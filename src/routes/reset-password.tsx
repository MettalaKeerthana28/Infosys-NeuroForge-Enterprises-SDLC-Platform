import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authApi } from "@/lib/api/authApi";
import { extractErrorMessage } from "@/lib/api/errors";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/;

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex, "Password does not meet requirements"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: search.email, password: "", confirm: "" },
  });

  const reset = useMutation({
    mutationFn: (v: FormValues) =>
      authApi.resetPassword({ email: v.email, otp, password: v.password }),
    onSuccess: () => {
      toast.success("Password reset successfully. Please sign in.");
      navigate({ to: "/login" });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Enter the code we sent you and choose a new password."
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit((v) => reset.mutate(v))} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
        <div className="space-y-2">
          <Label>Verification code</Label>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" {...register("password")} />
          {formState.errors.password ? (
            <p className="text-xs text-destructive">{formState.errors.password.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              8-20 chars with upper, lower, number and special character.
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" {...register("confirm")} />
          {formState.errors.confirm ? (
            <p className="text-xs text-destructive">{formState.errors.confirm.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" disabled={reset.isPending || otp.length !== 6}>
          {reset.isPending ? "Updating..." : "Reset password"}
        </Button>
      </form>
    </AuthShell>
  );
}
