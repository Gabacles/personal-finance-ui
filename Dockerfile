# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Aceitar args de build
ARG EXTERNAL_API_URL=http://localhost:8080

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json e lockfiles do stage anterior
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Copiar node_modules do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar todo o código fonte
COPY . .

# Criar arquivo .env.production com variáveis de build
RUN echo "EXTERNAL_API_URL=${EXTERNAL_API_URL}" > .env.production

# Build da aplicação
RUN pnpm run build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Setar NODE_ENV para produção
ENV NODE_ENV=production

# Copiar apenas o package.json para instalar dependências de produção
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar a aplicação build do stage anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expor a porta 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/auth/status || exit 1

# Comando para iniciar a aplicação
CMD ["pnpm", "start"]
