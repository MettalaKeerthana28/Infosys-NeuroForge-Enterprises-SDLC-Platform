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
import { authApi } from "@/lib/api/authApi";
import { extractErrorMessage } from "@/lib/api/errors";

const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const send = useMutation({
    mutationFn: (v: FormValues) => authApi.forgotPasswordSendOtp(v.email),
    onSuccess: (_data, v) => {
      setEmail(v.email);
      toast.success("OTP sent. Continue to reset your password.");
      navigate({ to: "/reset-password", search: { email: v.email } });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="We'll email you a 6-digit code to reset it."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit((v) => send.mutate(v))} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={email} {...register("email")} />
          {formState.errors.email ? (
            <p className="text-xs text-destructive">{formState.errors.email.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" disabled={send.isPending}>
          {send.isPending ? "Sending..." : "Send reset code"}
        </Button>
      </form>
    </AuthShell>
  );
}
