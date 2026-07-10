import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authApi } from "@/lib/api/authApi";
import { extractErrorMessage } from "@/lib/api/errors";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/;

const step1Schema = z
  .object({
    name: z.string().trim().min(3, "Name must be 3-50 chars").max(50),
    email: z.string().email(),
    password: z
      .string()
      .regex(
        passwordRegex,
        "8-20 chars, upper, lower, number and special",
      ),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

type Step1Values = z.infer<typeof step1Schema>;

export const Route = createFileRoute("/register")({
  ssr: false,
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<Step1Values | null>(null);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: "", email: "", password: "", confirm: "", terms: false as unknown as true },
  });

  const sendOtp = useMutation({
    mutationFn: (email: string) => authApi.sendOtp(email),
    onSuccess: () => {
      toast.success("OTP sent. Check your email.");
      setStep(2);
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const register = useMutation({
    mutationFn: () =>
      authApi.register({
        name: details!.name,
        email: details!.email,
        password: details!.password,
        otp,
      }),
    onSuccess: () => {
      toast.success("Account created. Please sign in.");
      navigate({ to: "/login" });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return (
    <AuthShell
      title={step === 1 ? "Create your account" : "Verify your email"}
      subtitle={
        step === 1
          ? "Start your NeuroForge workspace in minutes."
          : `Enter the 6-digit code sent to ${details?.email ?? ""}.`
      }
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {step === 1 ? (
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => {
            setDetails(v);
            sendOtp.mutate(v.email);
          })}
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} {...form.register("password")} />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {form.formState.errors.password ? (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                8-20 chars with uppercase, lowercase, number and special character.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type={showPassword ? "text" : "password"} {...form.register("confirm")} />
            {form.formState.errors.confirm ? (
              <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>
            ) : null}
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={!!form.watch("terms")}
              onCheckedChange={(v) => form.setValue("terms", (v ? true : false) as unknown as true, { shouldValidate: true })}
            />
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the Terms of Service and Privacy Policy.
            </Label>
          </div>
          {form.formState.errors.terms ? (
            <p className="text-xs text-destructive">{form.formState.errors.terms.message}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={sendOtp.isPending}>
            <Mail className="mr-2 size-4" />
            {sendOtp.isPending ? "Sending code..." : "Send OTP"}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <button
              type="button"
              className="inline-flex items-center hover:text-foreground"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="mr-1 size-4" /> Back
            </button>
            <button
              type="button"
              className="hover:text-foreground"
              onClick={() => details && sendOtp.mutate(details.email)}
              disabled={sendOtp.isPending}
            >
              Resend code
            </button>
          </div>
          <Button
            className="w-full"
            disabled={otp.length !== 6 || register.isPending}
            onClick={() => register.mutate()}
          >
            {register.isPending ? "Creating account..." : "Create account"}
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
