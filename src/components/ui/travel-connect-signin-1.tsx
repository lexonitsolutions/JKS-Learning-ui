"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { loginWithApi, registerWithApi, loginWithMockCredentials } from "@/lib/auth/use-mock-auth";
import { MOCK_USERS, type MockRole } from "@/lib/auth/mock-users";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { JksLogo } from "@/components/common/jks-logo";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useMockSession, logoutMockSession } from "@/lib/auth/use-mock-auth";
import {
  CheckCircle2,
  ShieldCheck,
  Mail,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowLeft,
} from "lucide-react";

export type AuthMode = "login" | "register";

type RoutePoint = { x: number; y: number; delay: number };

function DotMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const routes: { start: RoutePoint; end: RoutePoint; color: string }[] = [
    { start: { x: 100, y: 150, delay: 0 }, end: { x: 200, y: 80, delay: 2 }, color: "#2563eb" },
    { start: { x: 200, y: 80, delay: 2 }, end: { x: 260, y: 120, delay: 4 }, color: "#2563eb" },
    { start: { x: 50, y: 50, delay: 1 }, end: { x: 150, y: 180, delay: 3 }, color: "#2563eb" },
    { start: { x: 280, y: 60, delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 }, color: "#2563eb" },
  ];

  function generateDots(width: number, height: number) {
    const dots: { x: number; y: number; radius: number; opacity: number }[] = [];
    const gap = 12;
    const dotRadius = 1;

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const isInMapShape =
          (x < width * 0.25 && x > width * 0.05 && y < height * 0.4 && y > height * 0.1) ||
          (x < width * 0.25 && x > width * 0.15 && y < height * 0.8 && y > height * 0.4) ||
          (x < width * 0.45 && x > width * 0.3 && y < height * 0.35 && y > height * 0.15) ||
          (x < width * 0.5 && x > width * 0.35 && y < height * 0.65 && y > height * 0.35) ||
          (x < width * 0.7 && x > width * 0.45 && y < height * 0.5 && y > height * 0.1) ||
          (x < width * 0.8 && x > width * 0.65 && y < height * 0.8 && y > height * 0.6);

        if (isInMapShape && Math.random() > 0.3) {
          dots.push({ x, y, radius: dotRadius, opacity: Math.random() * 0.5 + 0.2 });
        }
      }
    }
    return dots;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    });

    resizeObserver.observe(canvas.parentElement);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = generateDots(dimensions.width, dimensions.height);
    let animationFrameId: number;
    let startTime = Date.now();

    function drawDots() {
      ctx!.clearRect(0, 0, dimensions.width, dimensions.height);
      dots.forEach((dot) => {
        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(37, 99, 235, ${dot.opacity})`;
        ctx!.fill();
      });
    }

    function drawRoutes() {
      const currentTime = (Date.now() - startTime) / 1000;
      routes.forEach((route) => {
        const elapsed = currentTime - route.start.delay;
        if (elapsed <= 0) return;

        const duration = 3;
        const progress = Math.min(elapsed / duration, 1);
        const x = route.start.x + (route.end.x - route.start.x) * progress;
        const y = route.start.y + (route.end.y - route.start.y) * progress;

        ctx!.beginPath();
        ctx!.moveTo(route.start.x, route.start.y);
        ctx!.lineTo(x, y);
        ctx!.strokeStyle = route.color;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = route.color;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(x, y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = "#3b82f6";
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(x, y, 6, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(59, 130, 246, 0.4)";
        ctx!.fill();

        if (progress === 1) {
          ctx!.beginPath();
          ctx!.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          ctx!.fillStyle = route.color;
          ctx!.fill();
        }
      });
    }

    function animate() {
      drawDots();
      drawRoutes();
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime > 15) startTime = Date.now();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => cancelAnimationFrame(animationFrameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

const COPY: Record<
  AuthMode,
  { panelTitle: string; panelBody: string; heading: string; subheading: string }
> = {
  login: {
    panelTitle: "JKS Learning",
    panelBody: "Sign in to continue your learning journey and pick up where you left off.",
    heading: "Welcome back",
    subheading: "Sign in to your account",
  },
  register: {
    panelTitle: "JKS Learning",
    panelBody: "Create an account for structured courses and AI-evaluated mock interviews.",
    heading: "Create your account",
    subheading: "Start with free demo lessons on any course",
  },
};

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
type LoginValues = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type RegisterValues = z.infer<typeof registerSchema>;
const PROVIDER_LABEL: Record<string, string> = {
  oauth_google: "Google",
  oauth_github: "GitHub",
};

type ClerkErrorLike = { clerkError: true; code: string; message: string; longMessage?: string };

function isClerkErrorLike(val: unknown): val is ClerkErrorLike {
  return (
    typeof val === "object" &&
    val !== null &&
    (val as { clerkError?: unknown }).clerkError === true &&
    typeof (val as { code?: unknown }).code === "string"
  );
}

function readClerkError(err: unknown, strategy: string): string {
  const provider = PROVIDER_LABEL[strategy] ?? "this provider";

  const code = isClerkErrorLike(err)
    ? err.code
    : isClerkAPIResponseError(err)
      ? (err.errors?.[0]?.code ?? "")
      : "";

  if (
    code === "oauth_provider_not_enabled" ||
    code === "strategy_invalid" ||
    code === "external_account_not_found"
  ) {
    return `${provider} sign-in is not enabled on this Clerk instance. Turn on the ${provider} SSO connection in the Clerk dashboard under User & Authentication -> SSO connections.`;
  }

  if (isClerkErrorLike(err)) {
    return err.longMessage || err.message || `Could not sign in with ${provider}.`;
  }

  if (isClerkAPIResponseError(err)) {
    const first = err.errors?.[0];
    return first?.longMessage || first?.message || `Could not sign in with ${provider}.`;
  }

  if (err instanceof Error && err.message) {
    return `Could not sign in with ${provider}: ${err.message}`;
  }

  return `Could not sign in with ${provider}. Please try again.`;
}

export function TravelConnectSignIn({ mode }: { mode: AuthMode }) {
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") || "/dashboard";
  const reducedMotion = useReducedMotion();
  const copy = COPY[mode];
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const session = useMockSession();
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const isAuthenticated = (isAuthLoaded && isSignedIn) || !!session;
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || session?.email || "";
  const userName = clerkUser?.fullName || clerkUser?.firstName || session?.name || "Student";

  // Auto-redirect if already signed in
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        window.location.assign(from);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, from]);

  // Auto-reset loading state if the redirect does not happen within 15s.
  useEffect(() => {
    if (!oauthLoading) return;
    const timer = setTimeout(() => setOauthLoading(null), 15000);
    return () => clearTimeout(timer);
  }, [oauthLoading]);

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_github") => {
    setOauthError(null);

    // If already signed in, immediately navigate to target
    if (isSignedIn || session) {
      window.location.assign(from);
      return;
    }

    if (!isSignInLoaded || !signIn) {
      setOauthError("Authentication is still loading. Please try again in a moment.");
      return;
    }

    setOauthLoading(strategy);

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: from,
      });
      // On success the browser navigates away; nothing runs after this.
    } catch (err) {
      setOauthLoading(null);
      setOauthError(readClerkError(err, strategy));
      console.error(`[SocialAuth] ${strategy} failed:`, err);
    }
  };

  const cardMotion = reducedMotion
    ? {}
    : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 } };

  // If already authenticated, show friendly redirect card
  if (isAuthenticated) {
    return (
      <motion.div
        {...cardMotion}
        className="flex w-full max-w-md flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-2xl border border-slate-100"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] mb-4">
          <CheckCircle2 className="h-8 w-8 text-[#2563EB]" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Already Signed In</h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          You are currently signed in as{" "}
          <span className="font-bold text-slate-800">{userEmail || userName}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => window.location.assign(from)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              logoutMockSession();
              window.location.assign("/login");
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 transition-colors cursor-pointer"
          >
            Sign in with a different account
          </button>
        </div>
      </motion.div>
    );
  }

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verifyingEmailAddress, setVerifyingEmailAddress] = useState("");

  return (
    <motion.div
      {...cardMotion}
      className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100"
    >
      {/* Desktop Left side — animated dot map + brand */}
      <div className="relative hidden h-[620px] w-1/2 overflow-hidden border-r border-slate-100 md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-100/70">
          {!reducedMotion && <DotMap />}

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">
            <FadeIn reducedMotion={reducedMotion} delay={0.6} className="mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-indigo-600 shadow-xl shadow-blue-500/25">
                {isVerifyingEmail ? (
                  <ShieldCheck className="h-7 w-7 text-white" />
                ) : (
                  <ArrowRight className="h-7 w-7 text-white" />
                )}
              </div>
            </FadeIn>
            <FadeIn reducedMotion={reducedMotion} delay={0.7}>
              <h2 className="mb-2 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-3xl font-black text-transparent">
                {isVerifyingEmail ? "Security Verification" : copy.panelTitle}
              </h2>
            </FadeIn>
            <FadeIn reducedMotion={reducedMotion} delay={0.8}>
              <p className="max-w-xs text-sm text-slate-600 font-medium leading-relaxed">
                {isVerifyingEmail
                  ? "Enter the 6-digit confirmation code sent to your inbox to activate your student account."
                  : copy.panelBody}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex w-full flex-col justify-center bg-white p-6 sm:p-8 md:w-1/2 md:p-10">
        <FadeIn reducedMotion={reducedMotion} delay={0} y={20}>
          <div className="mb-6 flex items-center justify-between">
            <JksLogo size="md" />
            <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-bold text-[#2563EB]">
              {isVerifyingEmail
                ? "Security Check"
                : mode === "login"
                ? "Secure Login"
                : "New Account"}
            </span>
          </div>

          {!isVerifyingEmail && (
            <>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{copy.heading}</h1>
              <p className="mt-1 mb-6 text-xs text-slate-500 font-medium">{copy.subheading}</p>

              <div className="mb-6 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={oauthLoading !== null}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all duration-300 hover:bg-slate-100 hover:border-slate-300 cursor-pointer disabled:opacity-60"
                  onClick={() => handleSocialAuth("oauth_google")}
                >
                  <GoogleIcon />
                  <span className="truncate">
                    {oauthLoading === "oauth_google" ? "Connecting…" : "Google"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={oauthLoading !== null}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all duration-300 hover:bg-slate-100 hover:border-slate-300 cursor-pointer disabled:opacity-60"
                  onClick={() => handleSocialAuth("oauth_github")}
                >
                  <GithubIcon />
                  <span className="truncate">
                    {oauthLoading === "oauth_github" ? "Connecting…" : "GitHub"}
                  </span>
                </button>
              </div>

              {oauthError && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium leading-relaxed text-red-700"
                >
                  {oauthError}
                </p>
              )}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
                  <span className="bg-white px-3 text-slate-400">or</span>
                </div>
              </div>
            </>
          )}

          {mode === "login" ? (
            <LoginFields />
          ) : (
            <RegisterFields
              onVerificationChange={(verifying, email) => {
                setIsVerifyingEmail(verifying);
                setVerifyingEmailAddress(email || "");
              }}
            />
          )}
          <div id="clerk-captcha" />
        </FadeIn>
      </div>
    </motion.div>
  );
}

function FadeIn({
  children,
  reducedMotion,
  delay,
  y = -20,
  className,
}: {
  children: React.ReactNode;
  reducedMotion: boolean;
  delay: number;
  y?: number;
  className?: string;
}) {
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PasswordInput({
  id,
  visible,
  onToggle,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { visible: boolean; onToggle: () => void }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        className={cn(
          "w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500",
          className
        )}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
        onClick={onToggle}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { scale: 1.01 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="pt-2"
    >
      <button
        type="submit"
        disabled={disabled}
        className={cn(
          "relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 disabled:pointer-events-none disabled:opacity-60",
          isHovered && !reducedMotion ? "shadow-lg shadow-blue-200" : ""
        )}
      >
        <span className="flex items-center justify-center">
          {children}
          <ArrowRight className="ml-2 h-4 w-4" />
        </span>
        {isHovered && !reducedMotion && (
          <motion.span
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ filter: "blur(8px)" }}
          />
        )}
      </button>
    </motion.div>
  );
}

// Hard navigation, not router.push() — see (auth)/layout.tsx / proxy.ts:
// /login, /admin, /dashboard are force-dynamic but the client Router Cache
// can still replay a stale prefetch captured under a different auth state.
// A full navigation always re-evaluates proxy.ts fresh.
function redirectAfterLogin(role: MockRole, from: string | null) {
  const fallback = role === "admin" ? "/admin" : role === "instructor" ? "/instructor" : "/dashboard";
  window.location.assign(from ?? fallback);
}

function LoginFields() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [quickLoginRole, setQuickLoginRole] = useState<MockRole | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    const result = await loginWithApi(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    redirectAfterLogin(result.session.role, searchParams.get("from"));
  };

  const quickLogin = (role: MockRole) => {
    const user = MOCK_USERS.find((u) => u.role === role);
    if (!user) return;
    setQuickLoginRole(role);
    const result = loginWithMockCredentials(user.email, user.password);
    if (!result.ok) {
      setQuickLoginRole(null);
      setFormError(result.error);
      return;
    }
    redirectAfterLogin(result.session.role, searchParams.get("from"));
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="login-email" className="mb-1 block text-xs font-semibold text-slate-700">
            Email address <span className="text-blue-500">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15 transition-all"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
              Password <span className="text-blue-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Enter your password"
            visible={visible}
            onToggle={() => setVisible((v) => !v)}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {formError && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 leading-relaxed">
            {formError}
          </p>
        )}

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in to Dashboard"}
        </SubmitButton>

        <p className="pt-1 text-center text-xs text-slate-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
      </form>

      {/* Subtle Demo Credentials Widget */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="mb-2 text-center text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Quick Demo Access
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => quickLogin("student")}
            disabled={quickLoginRole !== null}
            className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50 cursor-pointer"
          >
            {quickLoginRole === "student" ? "Signing in…" : "Student"}
          </button>
          <button
            type="button"
            onClick={() => quickLogin("instructor")}
            disabled={quickLoginRole !== null}
            className="rounded-lg border border-purple-200 bg-purple-50/70 py-1.5 text-xs font-semibold text-purple-700 transition-all hover:bg-purple-100 hover:border-purple-300 disabled:opacity-50 cursor-pointer"
          >
            {quickLoginRole === "instructor" ? "Signing in…" : "Lecturer"}
          </button>
          <button
            type="button"
            onClick={() => quickLogin("admin")}
            disabled={quickLoginRole !== null}
            className="rounded-lg border border-blue-200 bg-blue-50/70 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 cursor-pointer"
          >
            {quickLoginRole === "admin" ? "Signing in…" : "Admin"}
          </button>
        </div>
      </div>
    </>
  );
}

interface RegisterFieldsProps {
  onVerificationChange?: (verifying: boolean, email?: string) => void;
}

function RegisterFields({ onVerificationChange }: RegisterFieldsProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clerk OTP Verification & Sign-In States
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const [isSignInVerification, setIsSignInVerification] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  // Auto-countdown for Resend timer
  useEffect(() => {
    if (!pendingVerification || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingVerification, resendCooldown]);

  // Auto-focus on the first OTP input when entering verification mode
  useEffect(() => {
    if (pendingVerification) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [pendingVerification]);

  const onSubmit = async (values: RegisterValues) => {
    setFormError(null);

    // If Clerk is available, use Clerk's email verification sign-up
    if (isSignUpLoaded && signUp) {
      const parts = values.name.trim().split(" ");
      const firstName = parts[0] || values.name;
      const lastName = parts.slice(1).join(" ") || "";

      try {
        await signUp.create({
          emailAddress: values.email,
          password: values.password,
          firstName,
          lastName,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setRegisteredEmail(values.email);
        setIsSignInVerification(false);
        setPendingVerification(true);
        onVerificationChange?.(true, values.email);
        setResendCooldown(30);
        setOtp(["", "", "", "", "", ""]);
        setOtpError(null);
        setOtpSuccessMsg("We sent a 6-digit verification code to your email.");
      } catch (err: unknown) {
        // Robust check for existing account error across all Clerk response formats
        const isAlreadyTaken =
          (isClerkAPIResponseError(err) &&
            err.errors?.some(
              (e) =>
                e.code === "form_identifier_exists" ||
                e.code === "identifier_already_exists" ||
                e.message?.toLowerCase().includes("taken") ||
                e.message?.toLowerCase().includes("already exists") ||
                e.longMessage?.toLowerCase().includes("taken") ||
                e.longMessage?.toLowerCase().includes("already exists")
            )) ||
          (typeof err === "object" &&
            err !== null &&
            "errors" in err &&
            Array.isArray((err as { errors: unknown[] }).errors) &&
            (err as { errors: Array<{ code?: string; message?: string }> }).errors.some(
              (e) =>
                e?.code === "form_identifier_exists" ||
                e?.code === "identifier_already_exists" ||
                e?.message?.toLowerCase().includes("taken") ||
                e?.message?.toLowerCase().includes("already exists")
            )) ||
          (err instanceof Error &&
            (err.message.toLowerCase().includes("taken") ||
              err.message.toLowerCase().includes("already exists") ||
              err.message.includes("form_identifier_exists")));

        // If email already exists in Clerk (e.g. user deleted from local DB or existing account)
        if (isAlreadyTaken && isSignInLoaded && signIn) {
          try {
            // Attempt automatic sign-in with the provided credentials
            const signInAttempt = await signIn.create({
              identifier: values.email,
              password: values.password,
            });

            if (signInAttempt.status === "complete") {
              if (setActive) {
                await setActive({ session: signInAttempt.createdSessionId });
              }
              window.location.assign(from);
              return;
            } else if (signInAttempt.status === "needs_first_factor") {
              const emailFactor = signInAttempt.supportedFirstFactors?.find(
                (f) => f.strategy === "email_code"
              );
              if (emailFactor && "emailAddressId" in emailFactor) {
                await signIn.prepareFirstFactor({
                  strategy: "email_code",
                  emailAddressId: emailFactor.emailAddressId,
                });
                setRegisteredEmail(values.email);
                setIsSignInVerification(true);
                setPendingVerification(true);
                onVerificationChange?.(true, values.email);
                setResendCooldown(30);
                setOtp(["", "", "", "", "", ""]);
                setOtpError(null);
                setOtpSuccessMsg("We found your account! We sent a 6-digit verification code to your email.");
                return;
              }
            }
          } catch {
            // Auto sign-in with matching password did not complete, fall through to friendly UI message
          }

          setFormError(
            "An account with this email address already exists in our system. Please sign in with your password or use a different email address."
          );
          return;
        }

        // For other unexpected errors, format a clean message
        const msg = isClerkAPIResponseError(err)
          ? err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Registration failed"
          : err instanceof Error
          ? err.message
          : "Registration failed. Please check your details.";
        setFormError(msg);
      }
      return;
    }

    // Fallback if Clerk isn't ready
    const result = await registerWithApi(values.name, values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    redirectAfterLogin("student", from);
  };

  // OTP Input handlers
  const handleOtpChange = (val: string, index: number) => {
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal && val !== "") return;

    const newOtp = [...otp];
    newOtp[index] = cleanVal.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input if digit entered
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter all 6 digits of the verification code.");
      return;
    }

    setVerifying(true);
    setOtpError(null);
    setOtpSuccessMsg(null);

    try {
      if (isSignInVerification && isSignInLoaded && signIn) {
        const completeSignIn = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });

        if (completeSignIn.status === "complete") {
          if (setActive) {
            await setActive({ session: completeSignIn.createdSessionId });
          }
          window.location.assign(from);
        } else {
          setOtpError("Verification incomplete. Please check your code and try again.");
        }
      } else if (isSignUpLoaded && signUp) {
        const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

        if (completeSignUp.status === "complete") {
          if (setActive) {
            await setActive({ session: completeSignUp.createdSessionId });
          }
          window.location.assign(from);
        } else {
          setOtpError("Verification incomplete. Please check your code and try again.");
        }
      }
    } catch (err: unknown) {
      console.error("[Clerk OTP Verify Error]", err);
      const msg = isClerkAPIResponseError(err)
        ? err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Invalid code"
        : err instanceof Error
        ? err.message
        : "Invalid or expired verification code. Please try again.";
      setOtpError(msg);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setOtpError(null);
    setOtpSuccessMsg(null);

    try {
      if (isSignInVerification && signIn) {
        const factor = signIn.supportedFirstFactors?.find((f) => f.strategy === "email_code");
        if (factor && "emailAddressId" in factor) {
          await signIn.prepareFirstFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId });
          setResendCooldown(30);
          setOtpSuccessMsg("A fresh 6-digit code has been sent to your inbox!");
        }
      } else if (signUp) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setResendCooldown(30);
        setOtpSuccessMsg("A fresh 6-digit code has been sent to your inbox!");
      }
    } catch (err: unknown) {
      const msg = isClerkAPIResponseError(err)
        ? err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Failed to resend code"
        : "Failed to resend verification code. Please try again in a moment.";
      setOtpError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToRegistration = () => {
    setPendingVerification(false);
    setIsSignInVerification(false);
    setFormError(null);
    setOtpError(null);
    setOtpSuccessMsg(null);
    onVerificationChange?.(false);
  };

  // =========================================================================
  // STEP 2: SLEEK & PROFESSIONAL 6-DIGIT OTP VERIFICATION SCREEN
  // =========================================================================
  if (pendingVerification) {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-600 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Step 2 of 2: Security Verification</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Check Your Email
          </h2>

          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
            We sent a 6-digit confirmation code to:
          </p>

          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-mono font-bold text-slate-800 shadow-xs">
            <Mail className="h-3.5 w-3.5 text-blue-600" />
            <span className="truncate max-w-[200px]">{registeredEmail}</span>
            <button
              type="button"
              onClick={handleBackToRegistration}
              className="ml-1 text-[11px] font-sans font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>

        {/* 6-Digit Interactive OTP Inputs */}
        <div className="py-2">
          <label className="block text-center text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
            Enter 6-Digit Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                onPaste={handleOtpPaste}
                className={`h-12 w-10 sm:h-14 sm:w-12 rounded-xl text-center font-mono text-xl sm:text-2xl font-black text-slate-900 outline-none transition-all duration-200 ${
                  digit
                    ? "border-2 border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10 scale-105"
                    : "border border-slate-200 bg-slate-50/80 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/15 focus:scale-105"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error / Success Feedback */}
        {otpError && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-center text-xs font-semibold leading-relaxed text-rose-700 animate-in fade-in"
          >
            {otpError}
          </p>
        )}

        {otpSuccessMsg && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-center text-xs font-semibold leading-relaxed text-emerald-700 animate-in fade-in">
            {otpSuccessMsg}
          </p>
        )}

        {/* Verify Submit Button */}
        <button
          type="submit"
          disabled={verifying || otp.join("").length !== 6}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Verifying Code…</span>
            </>
          ) : (
            <>
              <span>Verify &amp; Launch Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Resend Code & Back actions */}
        <div className="flex flex-col items-center gap-2 text-center text-xs text-slate-500 pt-1">
          <div>
            Didn&apos;t receive the email?{" "}
            {resendCooldown > 0 ? (
              <span className="font-semibold text-slate-700">
                Resend in <strong className="font-mono text-blue-600">{resendCooldown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" /> Sending…
                  </>
                ) : (
                  "Resend code"
                )}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleBackToRegistration}
            className="flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to registration
          </button>
        </div>

        {/* Security Seal */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <Lock className="h-3 w-3 text-slate-400" />
          <span>256-Bit Encrypted Security &bull; Official JKS Credentials</span>
        </div>
      </form>
    );
  }

  // =========================================================================
  // STEP 1: INITIAL REGISTRATION FORM
  // =========================================================================
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 space-y-1.5 animate-in fade-in">
          <p>{formError}</p>
          {formError.includes("already exists") && (
            <div className="pt-0.5">
              <Link
                href={`/login?from=${encodeURIComponent(from)}`}
                className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2"
              >
                Sign in to your account <ArrowRight className="h-3 w-3 inline" />
              </Link>
            </div>
          )}
        </div>
      )}

      <div>
        <label htmlFor="register-name" className="mb-1 block text-xs font-semibold text-slate-700">
          Full name <span className="text-blue-500">*</span>
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Rahul Sharma"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15 transition-all"
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1 block text-xs font-semibold text-slate-700">
          Email address <span className="text-blue-500">*</span>
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15 transition-all"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700">
            Password <span className="text-blue-500">*</span>
          </label>
          <span className="text-[11px] font-medium text-slate-400">Min. 10 characters</span>
        </div>
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          placeholder="Enter your password (min 10 characters)"
          visible={passwordVisible}
          onToggle={() => setPasswordVisible((v) => !v)}
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="register-confirm" className="mb-1 block text-xs font-semibold text-slate-700">
          Confirm password <span className="text-blue-500">*</span>
        </label>
        <PasswordInput
          id="register-confirm"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          visible={confirmVisible}
          onToggle={() => setConfirmVisible((v) => !v)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create Student Account"}
      </SubmitButton>

      <p className="pt-1 text-center text-xs text-slate-500 font-medium">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fillOpacity=".54"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#4285F4"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#34A853"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
      <path fill="#EA4335" fillOpacity="0" d="M1 1h22v22H1z" />
    </svg>
  );
}

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
