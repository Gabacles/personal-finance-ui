"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
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
import {
  EMPLOYMENT_TYPE_LABELS,
  type EmploymentType,
  type RegisterFormData,
} from "../types/auth.types";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  employmentType?: string;
}

function validate(data: RegisterFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!data.employmentType) {
    errors.employmentType = "Please select an employment type.";
  }
  return errors;
}

export function RegisterForm() {
  const { register, isPending, error } = useRegister();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">("");

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: RegisterFormData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      employmentType: employmentType as EmploymentType,
    };

    const errors = validate(data);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    register(data);
  }

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
          onSubmit={handleSubmit}
          noValidate
          aria-label="Create account form"
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              disabled={isPending}
              onChange={() => clearFieldError("name")}
            />
            {fieldErrors.name && (
              <p id="name-error" role="alert" className="text-xs text-destructive">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              disabled={isPending}
              onChange={() => clearFieldError("email")}
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="text-xs text-destructive">
                {fieldErrors.email}
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
              name="password"
              autoComplete="new-password"
              placeholder="········"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              disabled={isPending}
              onChange={() => clearFieldError("password")}
            />
            {fieldErrors.password && (
              <p id="password-error" role="alert" className="text-xs text-destructive">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employmentType">Employment type</Label>
            <Select
              value={employmentType}
              onValueChange={(val) => {
                setEmploymentType(val as EmploymentType);
                clearFieldError("employmentType");
              }}
              disabled={isPending}
            >
              <SelectTrigger
                id="employmentType"
                className="w-full"
                aria-invalid={!!fieldErrors.employmentType}
                aria-describedby={
                  fieldErrors.employmentType ? "employmentType-error" : undefined
                }
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
            {fieldErrors.employmentType && (
              <p
                id="employmentType-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {fieldErrors.employmentType}
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
