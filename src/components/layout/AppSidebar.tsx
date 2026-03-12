"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, ChevronUp, Coins } from "lucide-react";

import { useLogout } from "@/modules/auth/hooks/use-logout";
import { navSections } from "@/config/nav";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();

  return (
    <Sidebar collapsible="icon">
      {/* ── Brand header ─────────────────────────────── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="pointer-events-none select-none"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Coins className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm">Finanças Pessoais</span>
                <span className="text-xs text-muted-foreground">
                  Controle financeiro
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ───────────────────────────────── */}
      <SidebarContent>
        {navSections.map((section, sectionIndex) => (
          <SidebarGroup key={sectionIndex}>
            {section.title && (
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild={!item.disabled}
                        isActive={isActive}
                        tooltip={item.label}
                        disabled={item.disabled}
                        aria-disabled={item.disabled}
                        className={
                          item.disabled
                            ? "cursor-not-allowed opacity-40"
                            : undefined
                        }
                      >
                        {item.disabled ? (
                          <span className="flex items-center gap-2">
                            <Icon />
                            <span>{item.label}</span>
                          </span>
                        ) : (
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── User menu (footer) ───────────────────────── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip="Conta"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-sidebar-border">
                    <User className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="text-sm font-medium">Minha Conta</span>
                    <span className="text-xs text-muted-foreground">
                      Configurações
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 transition-transform group-data-[state=open]/menu-button:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-(--radix-popper-anchor-width)"
              >
                {/* Future: Profile & account settings items go here */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={logout}
                  className="cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
