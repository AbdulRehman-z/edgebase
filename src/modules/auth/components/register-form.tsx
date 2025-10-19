"use client";

import { PasswordStrengthIndicator } from "@/components/custom/password-strength-indicator";
import { TooltipWrapper } from "@/components/custom/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordInputWithIndicator } from "@/components/ui/password-input-indicator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, HelpCircleIcon, InfoIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import z from "zod";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters.").max(100),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters.")
      .max(20, "Password must be at most 20 characters."),
    confirmPassword: z
      .string()
      .min(4, "Password must be at least 4 characters.")
      .max(20, "Password must be at most 20 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible((prev) => !prev);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSettled: () => {
          setLoading(false);
        },
        onError: (error) => {
          setLoading(false);
          toast.error("Something went wrong!");
        },
        onSuccess: () => {
          setLoading(false);
          toast.success("Registration successful!");
          router.push("/");
        },
      },
    );
  };

  return (
    <Card className="w-full sm:max-w-md border shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Welcome! Please fill in the details to get started{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Button disabled={loading} variant="outline" type="button">
                <FaGithub />
                Continue with GitHub
              </Button>
              <Button disabled={loading} variant="outline" type="button">
                <FcGoogle />
                Continue with Google
              </Button>
            </Field>
          </FieldGroup>
          <FieldSeparator className="my-5">Or continue with</FieldSeparator>
          <FieldGroup className="gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      disabled={loading}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />

                    <InputGroupAddon>
                      <MailIcon />
                    </InputGroupAddon>
                    <TooltipWrapper content="We'll use this to send you notifications">
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton
                          variant={"ghost"}
                          aria-label="ghost"
                          size={"icon-xs"}
                        >
                          <InfoIcon />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </TooltipWrapper>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <FieldDescription>
                    We will never share your email address.
                  </FieldDescription>
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      disabled={loading}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="******"
                    />
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupButton onClick={togglePasswordVisibility}>
                        {passwordVisible ? (
                          <EyeOffIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <PasswordStrengthIndicator password={field.value} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation={"responsive"}>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      disabled={loading}
                      id="confirmPassword"
                      aria-invalid={fieldState.invalid}
                      type={confirmPasswordVisible ? "text" : "password"}
                      placeholder="******"
                    />
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupButton onClick={toggleConfirmPasswordVisibility}>
                        {confirmPasswordVisible ? (
                          <EyeOffIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>{" "}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="mt-1">
        <Field>
          <Button disabled={loading} type="submit" className="w-full" form="form">
            {loading ? (
              <>
                <Spinner /> Creating...
              </>
            ) : (
              "Create an account"
            )}
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
};
