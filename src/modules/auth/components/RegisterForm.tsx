"use client";

import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "../hooks/use-register";
import { PasswordInput } from "./PasswordInput";
import { EMPLOYMENT_TYPE_LABELS, type EmploymentType } from "../types/auth.types";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schemas";

export function RegisterForm() {
  const { register: registerUser, isPending, error } = useRegister();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: standardSchemaResolver(registerSchema),
  });

  const employmentTypeEntries = Object.entries(EMPLOYMENT_TYPE_LABELS) as [
    EmploymentType,
    string,
  ][];

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Start managing your personal finances
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="register-form"
          onSubmit={handleSubmit((data) => registerUser(data))}
          noValidate
          aria-label="Create account form"
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p id="name-error" role="alert" className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-muted-foreground">Min. 8 characters</span>
            </div>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="········"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employmentType">Employment type</Label>
            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="employmentType"
                    className="w-full"
                    aria-invalid={!!errors.employmentType}
                    aria-describedby={
                      errors.employmentType ? "employmentType-error" : undefined
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                  >
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypeEntries.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employmentType && (
              <p
                id="employmentType-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.employmentType.message}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              <AlertCircle className="mt-px size-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            form="register-form"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
