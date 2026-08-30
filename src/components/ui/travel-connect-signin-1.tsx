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
import { loginWithMockCredentials } from "@/lib/auth/use-mock-auth";
import { MOCK_USERS, type MockRole } from "@/lib/auth/mock-users";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

// Adapted from a 21st.dev "travel-connect-signin-1" submission. Kept as one
// file at the requested path/name, but with real changes from the source:
//  - Copy is rebranded for JKS Learning — the source was a travel app
//    ("Travel Connect… connect with nomads worldwide"), which would be a
//    glaring content bug shipped verbatim on a course platform's login page.
//  - The source's local placeholder Button/Input helpers referenced
//    shadcn's semantic tokens (bg-background, text-foreground, border-input,
//    ring-ring) that don't exist in this project's theme — this app is
//    Tailwind v4 with its own DESIGN.md token set (--color-primary-blue
//    etc.), no tailwind.config.js, and no shadcn CSS-variable layer. Those
//    classes would resolve to nothing. Removed the helpers; the visible
//    elements already used explicit Tailwind palette classes (gray-50,
//    blue-500, …), which need zero config and render identically.
//  - The source's local `cn` was a naive `.join(" ")` with no conflict
//    resolution; swapped for this project's real `cn` (clsx + tailwind-merge).
//  - Sign-in now actually authenticates (loginWithMockCredentials + the
//    existing `from`-redirect + hard-navigation pattern, same reasoning as
//    the rest of this app's auth flow) instead of console.logging the
//    attempt — the original was a static design demo, not a working form.
//  - Added a `mode` prop so one component serves both /login and /register
//    (register keeps its own fields and the existing TODO-backend submit,
//    matching how the rest of this mock-auth app treats registration).
//  - All motion (entrance fades, hover shimmer, the animated dot-map) is
//    gated behind prefers-reduced-motion, matching every other animated
//    component in this codebase.

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
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type RegisterValues = z.infer<typeof registerSchema>;

export function TravelConnectSignIn({ mode }: { mode: AuthMode }) {
  const reducedMotion = useReducedMotion();
  const copy = COPY[mode];

  const cardMotion = reducedMotion
    ? {}
    : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 } };

  return (
    <motion.div
      {...cardMotion}
      className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
    >
      {/* Left side — animated dot map + brand */}
      <div className="relative hidden h-[600px] w-1/2 overflow-hidden border-r border-gray-100 md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          {!reducedMotion && <DotMap />}

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
            <FadeIn reducedMotion={reducedMotion} delay={0.6} className="mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
            </FadeIn>
            <FadeIn reducedMotion={reducedMotion} delay={0.7}>
              <h2 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent">
                {copy.panelTitle}
              </h2>
            </FadeIn>
            <FadeIn reducedMotion={reducedMotion} delay={0.8}>
              <p className="max-w-xs text-center text-sm text-gray-600">{copy.panelBody}</p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex w-full flex-col justify-center bg-white p-8 md:w-1/2 md:p-10">
        <FadeIn reducedMotion={reducedMotion} delay={0} y={20}>
          <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">{copy.heading}</h1>
          <p className="mb-8 text-gray-500">{copy.subheading}</p>

          <div className="mb-6">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-100"
              onClick={() => console.log("Google sign-in (not wired — no OAuth backend yet)")}
            >
              <GoogleIcon />
              <span>{mode === "login" ? "Login with Google" : "Sign up with Google"}</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          {mode === "login" ? <LoginFields /> : <RegisterFields />}
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
    const result = loginWithMockCredentials(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    redirectAfterLogin(result.session.role, searchParams.get("from"));
  };

  // Testing convenience — skip typing the demo credentials. Wired to the
  // same MOCK_USERS the real form validates against, so it can never drift
  // out of sync with what the demo-credentials hint below actually says.
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
      <div className="mb-6">
        <p className="mb-2 text-center text-xs font-semibold tracking-wide text-gray-400 uppercase">
          Testing — instant demo access
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => quickLogin("student")}
            disabled={quickLoginRole !== null}
            className="rounded-lg border border-gray-200 bg-gray-50 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-60"
          >
            {quickLoginRole === "student" ? "Signing in…" : "Student"}
          </button>
          <button
            type="button"
            onClick={() => quickLogin("instructor")}
            disabled={quickLoginRole !== null}
            className="rounded-lg border border-purple-200 bg-purple-50 py-2 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 disabled:pointer-events-none disabled:opacity-60"
          >
            {quickLoginRole === "instructor" ? "Signing in…" : "Lecturer"}
          </button>
          <button
            type="button"
            onClick={() => quickLogin("admin")}
            disabled={quickLoginRole !== null}
            className="rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:pointer-events-none disabled:opacity-60"
          >
            {quickLoginRole === "admin" ? "Signing in…" : "Admin"}
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or continue manually</span>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-gray-700">
            Email <span className="text-blue-500">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-gray-700">
            Password <span className="text-blue-500">*</span>
          </label>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Enter your password"
            visible={visible}
            onToggle={() => setVisible((v) => !v)}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 transition-colors hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </SubmitButton>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}

function RegisterFields() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterValues) => {
    // TODO: wire to POST /auth/register once the backend API client exists.
    console.log("register submit", values);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="register-name" className="mb-1 block text-sm font-medium text-gray-700">
          Full name <span className="text-blue-500">*</span>
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-gray-700">
          Email <span className="text-blue-500">*</span>
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-gray-700">
          Password <span className="text-blue-500">*</span>
        </label>
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          placeholder="Enter your password"
          visible={passwordVisible}
          onToggle={() => setPasswordVisible((v) => !v)}
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="register-confirm" className="mb-1 block text-sm font-medium text-gray-700">
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
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <SubmitButton disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </SubmitButton>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Log in
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
