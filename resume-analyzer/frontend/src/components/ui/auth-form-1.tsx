"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

enum AuthView {
  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
  FORGOT_PASSWORD = "forgot-password",
  RESET_SUCCESS = "reset-success",
}

interface FormState {
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
}

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface AuthProps extends React.ComponentProps<"div"> {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onBack?: () => void;
}

function Auth({ className, onSignIn, onSignUp, onForgotPassword, onGoogleSignIn, onBack, ...props }: AuthProps) {
  const [view, setView] = React.useState<AuthView>(AuthView.SIGN_IN);

  const setNextView = React.useCallback((nextView: AuthView) => {
    setView(nextView);
  }, []);

  return (
    <div data-slot="auth" className={cn("mx-auto w-full max-w-md", className)} {...props}>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_4px_12px_rgba(79,70,229,0.04)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-cyan-50/20" />
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 z-20 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : null}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {view === AuthView.SIGN_IN && (
              <AuthSignIn
                key="sign-in"
                onForgotPassword={() => setNextView(AuthView.FORGOT_PASSWORD)}
                onSignUp={() => setNextView(AuthView.SIGN_UP)}
                onSignIn={onSignIn}
                onGoogleSignIn={onGoogleSignIn}
              />
            )}
            {view === AuthView.SIGN_UP && (
              <AuthSignUp
                key="sign-up"
                onSignIn={() => setNextView(AuthView.SIGN_IN)}
                onSignUp={onSignUp}
                onGoogleSignIn={onGoogleSignIn}
              />
            )}
            {view === AuthView.FORGOT_PASSWORD && (
              <AuthForgotPassword
                key="forgot-password"
                onSignIn={() => setNextView(AuthView.SIGN_IN)}
                onForgotPassword={onForgotPassword}
                onSuccess={() => setNextView(AuthView.RESET_SUCCESS)}
              />
            )}
            {view === AuthView.RESET_SUCCESS && (
              <AuthResetSuccess
                key="reset-success"
                onSignIn={() => setNextView(AuthView.SIGN_IN)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface AuthFormProps<T> {
  onSubmit: (data: T) => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

function AuthForm<T>({ onSubmit, children, className }: AuthFormProps<T>) {
  return (
    <form onSubmit={onSubmit as any} data-slot="auth-form" className={cn("space-y-5", className)}>
      {children}
    </form>
  );
}

function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div data-slot="auth-error" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
      {message}
    </div>
  );
}

function AuthSocialButtons({ isLoading, onGoogleSignIn }: { isLoading: boolean; onGoogleSignIn: () => Promise<void> }) {
  return (
    <div data-slot="auth-social-buttons" className="w-full mt-5">
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
        disabled={isLoading}
        onClick={onGoogleSignIn}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>
    </div>
  );
}

function AuthSeparator({ text = "Or continue with" }: { text?: string }) {
  return (
    <div data-slot="auth-separator" className="relative mt-5">
      <div className="absolute inset-0 flex items-center">
        <Separator className="bg-slate-200" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-slate-400 font-medium">{text}</span>
      </div>
    </div>
  );
}

function AuthSignIn({ onForgotPassword, onSignUp, onSignIn, onGoogleSignIn }: { onForgotPassword: () => void; onSignUp: () => void; onSignIn: (email: string, password: string) => Promise<void>; onGoogleSignIn: () => Promise<void>; }) {
  const [formState, setFormState] = React.useState<FormState>({ isLoading: false, error: null, showPassword: false });
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  const submit = async (data: SignInFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await onSignIn(data.email, data.password);
    } catch (error: any) {
      setFormState((prev) => ({ ...prev, error: error?.message || error?.code || "Unable to sign in" }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogle = async () => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await onGoogleSignIn();
    } catch (error: any) {
      setFormState((prev) => ({ ...prev, error: error?.message || error?.code || "Google sign in failed" }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div data-slot="auth-sign-in" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="p-8">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-slate-500">Sign in to your SkillSnap account</p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm<SignInFormValues> onSubmit={handleSubmit(submit) as any}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700 font-medium text-xs">Email address</Label>
          <Input id="email" type="email" placeholder="name@example.com" disabled={formState.isLoading} className={cn("bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white", errors.email && "border-rose-500")} {...register("email")} />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700 font-medium text-xs">Password</Label>
            <Button type="button" variant="link" className="h-auto p-0 text-xs text-indigo-600 hover:text-indigo-700" onClick={onForgotPassword} disabled={formState.isLoading}>Forgot password?</Button>
          </div>
          <div className="relative">
            <Input id="password" type={formState.showPassword ? "text" : "password"} placeholder="••••••••" disabled={formState.isLoading} className={cn("bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white", errors.password && "border-rose-500")} {...register("password")} />
            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-slate-400 hover:text-slate-700" onClick={() => setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))} disabled={formState.isLoading}>
              {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-md shadow-indigo-500/20 h-11" disabled={formState.isLoading}>
          {formState.isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Sign in"}
        </Button>
      </AuthForm>

      <AuthSeparator />
      <AuthSocialButtons isLoading={formState.isLoading} onGoogleSignIn={handleGoogle} />

      <p className="mt-7 text-center text-sm text-slate-500">
        Don't have an account? <Button variant="link" className="h-auto p-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700" onClick={onSignUp} disabled={formState.isLoading}>Create one</Button>
      </p>
    </motion.div>
  );
}

function AuthSignUp({ onSignIn, onSignUp, onGoogleSignIn }: { onSignIn: () => void; onSignUp: (name: string, email: string, password: string) => Promise<void>; onGoogleSignIn: () => Promise<void>; }) {
  const [formState, setFormState] = React.useState<FormState>({ isLoading: false, error: null, showPassword: false });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema), defaultValues: { name: "", email: "", password: "", terms: false } });
  const terms = watch("terms");

  const submit = async (data: SignUpFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await onSignUp(data.name, data.email, data.password);
    } catch (error: any) {
      setFormState((prev) => ({ ...prev, error: error?.message || error?.code || "Unable to create account" }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogle = async () => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await onGoogleSignIn();
    } catch (error: any) {
      setFormState((prev) => ({ ...prev, error: error?.message || error?.code || "Google sign in failed" }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div data-slot="auth-sign-up" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="p-8">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h1>
        <p className="mt-1.5 text-sm text-slate-500">Start optimizing your resumes in seconds</p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm<SignUpFormValues> onSubmit={handleSubmit(submit) as any}>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-slate-700 font-medium text-xs">Full name</Label>
          <Input id="name" type="text" placeholder="John Doe" disabled={formState.isLoading} className={cn("bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white", errors.name && "border-rose-500")} {...register("name")} />
          {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700 font-medium text-xs">Email address</Label>
          <Input id="email" type="email" placeholder="name@example.com" disabled={formState.isLoading} className={cn("bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white", errors.email && "border-rose-500")} {...register("email")} />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-slate-700 font-medium text-xs">Password</Label>
          <div className="relative">
            <Input id="password" type={formState.showPassword ? "text" : "password"} placeholder="••••••••" disabled={formState.isLoading} className={cn("bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white", errors.password && "border-rose-500")} {...register("password")} />
            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-slate-400 hover:text-slate-700" onClick={() => setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))} disabled={formState.isLoading}>
              {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
        </div>
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox id="terms" checked={terms} onCheckedChange={(checked) => setValue("terms", checked === true)} disabled={formState.isLoading} />
          <div className="space-y-0.5">
            <Label htmlFor="terms" className="text-xs text-slate-600 font-normal">I agree to the terms and privacy policy</Label>
          </div>
        </div>
        {errors.terms && <p className="text-xs text-rose-600">{errors.terms.message}</p>}
        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-md shadow-indigo-500/20 h-11" disabled={formState.isLoading}>
          {formState.isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Create account"}
        </Button>
      </AuthForm>

      <AuthSeparator />
      <AuthSocialButtons isLoading={formState.isLoading} onGoogleSignIn={handleGoogle} />

      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account? <Button variant="link" className="h-auto p-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700" onClick={onSignIn} disabled={formState.isLoading}>Sign in</Button>
      </p>
    </motion.div>
  );
}

function AuthForgotPassword({ onSignIn, onSuccess, onForgotPassword }: { onSignIn: () => void; onSuccess: () => void; onForgotPassword: (email: string) => Promise<void>; }) {
  const [formState, setFormState] = React.useState<FormState>({ isLoading: false, error: null, showPassword: false });
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const submit = async (data: ForgotPasswordFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await onForgotPassword(data.email);
      onSuccess();
    } catch (error: any) {
      setFormState((prev) => ({ ...prev, error: error?.message || error?.code || "Unable to send reset email" }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div data-slot="auth-forgot-password" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="p-8">
      <Button variant="ghost" size="icon" className="absolute left-4 top-4 text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={onSignIn} disabled={formState.isLoading}><ArrowLeft className="h-4 w-4" /><span className="sr-only">Back</span></Button>
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset password</h1>
        <p className="mt-1.5 text-sm text-slate-500">Enter your email to receive a reset link</p>
      </div>
      <AuthError message={formState.error} />
      <AuthForm<ForgotPasswordFormValues> onSubmit={handleSubmit(submit) as any}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700 font-medium text-xs">Email address</Label>
          <Input id="email" type="email" placeholder="name@example.com" disabled={formState.isLoading} className={cn("bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white", errors.email && "border-rose-500")} {...register("email")} />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-md shadow-indigo-500/20 h-11" disabled={formState.isLoading}>{formState.isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : "Send reset link"}</Button>
      </AuthForm>
      <p className="mt-7 text-center text-sm text-slate-500">Remember your password? <Button variant="link" className="h-auto p-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700" onClick={onSignIn} disabled={formState.isLoading}>Sign in</Button></p>
    </motion.div>
  );
}

function AuthResetSuccess({ onSignIn }: { onSignIn: () => void; }) {
  return (
    <motion.div data-slot="auth-reset-success" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="flex flex-col items-center p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
        <MailCheck className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Check your email</h1>
      <p className="mt-1.5 text-sm text-slate-500">We sent a password reset link to your email address.</p>
      <Button variant="outline" className="mt-6 w-full max-w-xs border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm" onClick={onSignIn}>Back to sign in</Button>
    </motion.div>
  );
}

export { Auth, AuthSignIn, AuthSignUp, AuthForgotPassword, AuthResetSuccess, AuthForm, AuthError, AuthSocialButtons, AuthSeparator };
