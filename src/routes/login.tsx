import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authApi } from "@/lib/api/authApi";
import { useAuth } from "@/lib/auth/context";
import { USE_MOCK_DATA } from "@/lib/env";
import { extractErrorMessage } from "@/lib/api/errors";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (v: FormValues) => authApi.login({ email: v.email, password: v.password }),
    onSuccess: (tokens) => {
      login(tokens);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return (
    <AuthShell
      title="Sign in to NeuroForge"
      subtitle="Enter your credentials to access your workspace."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" {...register("remember")} />
          <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          <LogIn className="mr-2 size-4" />
          {mutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = authApi.googleLoginUrl();
            }
          }}
        >
          Continue with Google
        </Button>
      </form>
      {USE_MOCK_DATA ? (
        <div className="mt-6 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
          <div className="mb-1 font-medium text-foreground">Demo credentials (mock mode)</div>
          <ul className="space-y-0.5">
            <li>super@neuroforge.dev · Password@123</li>
            <li>admin@neuroforge.dev · Password@123</li>
            <li>pm@neuroforge.dev · Password@123</li>
            <li>dev@neuroforge.dev · Password@123</li>
            <li>qa@neuroforge.dev · Password@123</li>
            <li>stake@neuroforge.dev · Password@123</li>
          </ul>
        </div>
      ) : null}
    </AuthShell>
  );
}
