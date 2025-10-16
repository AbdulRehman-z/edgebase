"use client";
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
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters.")
    .max(20, "Password must be at most 20 characters."),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
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
        },
      },
    );
  };

  return (
    <Card className="w-full sm:max-w-md border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login to Edgebase</CardTitle>
        <CardDescription>Welcome back! Please login to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Button disabled={loading} variant="outline" type="button">
                <FaGithub />
                Login with GitHub
              </Button>
              <Button disabled={loading} variant="outline" type="button">
                <FcGoogle />
                Login with Google
              </Button>
            </Field>
          </FieldGroup>
          <FieldSeparator className="my-5">Or continue with</FieldSeparator>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    type="password"
                    disabled={loading}
                    {...field}
                    id="password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid}
                  />
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
                <Spinner /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Register
            </Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
