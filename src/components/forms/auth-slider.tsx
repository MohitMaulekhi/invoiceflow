"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Loader2, Briefcase } from "lucide-react";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { signInAction } from "@/server/actions/auth/sign-in";
import { signUpAction } from "@/server/actions/auth/sign-up";
import { cn } from "@/lib/utils";
import type { SignInInput, SignUpInput } from "@/types/auth";
import Lottie from "lottie-react";
import welcomeAnimation from "@/assets/animations/welcome-back.json";
import newAccountAnimation from "@/assets/animations/new-user.json";

export default function AuthSlider() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  // Sign In Form
  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  // Sign Up Form
  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSignIn = (data: SignInInput) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const res = await signInAction(formData);
      if (res?.error) setServerError(res.error);
    });
  };

  const onSignUp = (data: SignUpInput) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("businessName", data.businessName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      const res = await signUpAction(formData);
      if (res?.error) setServerError(res.error);
    });
  };

  return (
    <div className="relative w-full max-w-4xl min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
      
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/10" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-400/20" />

      {/* --- LEFT SIDE (SIGN IN FORM) --- */}
      <div className={cn(
        "absolute top-0 left-0 w-full md:w-1/2 h-full flex items-center justify-center p-8 md:p-12 transition-opacity duration-500 ease-in-out z-10",
        !isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 md:opacity-0 pointer-events-none"
      )}>
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary tracking-tight">Sign in to Invoice Flow</h2>
            <p className="text-slate-500 mt-2 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSignInSubmit(onSignIn)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...registerSignIn("email")}
                  type="email"
                  placeholder="Email Address"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-colors",
                    signInErrors.email ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-teal-500 focus:bg-white"
                  )}
                />
              </div>
              {signInErrors.email && <p className="text-xs text-red-500 px-1">{signInErrors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...registerSignIn("password")}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-colors",
                    signInErrors.password ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-teal-500 focus:bg-white"
                  )}
                />
              </div>
              {signInErrors.password && <p className="text-xs text-red-500 px-1">{signInErrors.password.message}</p>}
            </div>

            {serverError && !isSignUp && (
              <p className="text-sm text-red-500 text-center font-medium">{serverError}</p>
            )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending && !isSignUp ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isPending && !isSignUp ? "Signing in..." : "SIGN IN"}
              </button>
          </form>

          {/* Mobile toggle */}
          <div className="md:hidden text-center mt-6">
            <p className="text-sm text-slate-500">
              New Here?{" "}
              <button type="button" onClick={() => { setIsSignUp(true); setServerError(null); }} className="text-primary font-semibold hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE (SIGN UP FORM) --- */}
      <div className={cn(
        "absolute top-0 right-0 w-full md:w-1/2 h-full flex items-center justify-center p-8 md:p-12 transition-opacity duration-500 ease-in-out z-10",
        isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 md:opacity-0 pointer-events-none"
      )}>
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary tracking-tight">Create your account</h2>
            <p className="text-slate-500 mt-2 text-sm">Take control of your invoices and get paid faster.</p>
          </div>

          <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...registerSignUp("name")}
                  type="text"
                  placeholder="Full Name"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-colors",
                    signUpErrors.name ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-teal-500 focus:bg-white"
                  )}
                />
              </div>
              {signUpErrors.name && <p className="text-xs text-red-500 px-1">{signUpErrors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...registerSignUp("businessName")}
                  type="text"
                  placeholder="Business Name"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-colors",
                    signUpErrors.businessName ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-teal-500 focus:bg-white"
                  )}
                />
              </div>
              {signUpErrors.businessName && <p className="text-xs text-red-500 px-1">{signUpErrors.businessName.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...registerSignUp("email")}
                  type="email"
                  placeholder="Email Address"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-colors",
                    signUpErrors.email ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-teal-500 focus:bg-white"
                  )}
                />
              </div>
              {signUpErrors.email && <p className="text-xs text-red-500 px-1">{signUpErrors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...registerSignUp("password")}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-colors",
                    signUpErrors.password ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-teal-500 focus:bg-white"
                  )}
                />
              </div>
              {signUpErrors.password && <p className="text-xs text-red-500 px-1">{signUpErrors.password.message}</p>}
            </div>

            {serverError && isSignUp && (
              <p className="text-sm text-red-500 text-center font-medium">{serverError}</p>
            )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending && isSignUp ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isPending && isSignUp ? "Creating..." : "SIGN UP"}
              </button>
          </form>

          {/* Mobile toggle */}
          <div className="md:hidden text-center mt-6">
            <p className="text-sm text-slate-500">
              Welcome Back!{" "}
              <button type="button" onClick={() => { setIsSignUp(false); setServerError(null); }} className="text-primary font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* --- THE TEAL SLIDING OVERLAY (Desktop Only) --- */}
      <motion.div
        className="hidden md:flex absolute top-0 left-0 h-full w-1/2 bg-primary z-20 text-white items-center justify-center p-12 text-center shadow-xl"
        initial={false}
        animate={{
          x: isSignUp ? "0%" : "100%",
          borderRadius: isSignUp ? "0 3rem 3rem 0" : "3rem 0 0 3rem",
        }}
        transition={{ ease: "easeInOut", duration: 0.6 }}
      >
        {/* Subtle overlay patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />
        
        <AnimatePresence mode="wait">
          {!isSignUp ? (
            <motion.div
              key="sign-in-overlay"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 space-y-6 flex flex-col items-center"
            >
              <div className="w-48 h-48 -mb-4">
                 <Lottie animationData={newAccountAnimation} loop={true} />
              </div>
              <h2 className="text-4xl font-bold tracking-tight">New Here?</h2>
              <p className="text-teal-50 leading-relaxed max-w-sm mx-auto">
                Start tracking payments and sending automated reminders today. Join Invoice Flow!
              </p>
              <button
                onClick={() => { setIsSignUp(true); setServerError(null); }}
                className="mt-8 px-12 py-3 rounded-full border-2 border-white hover:bg-white hover:text-primary transition-colors font-semibold tracking-wide"
              >
                SIGN UP
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="sign-up-overlay"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 space-y-6 flex flex-col items-center"
            >
              <div className="w-48 h-48 -mb-4">
                 <Lottie animationData={welcomeAnimation} loop={true} />
              </div>
              <h2 className="text-4xl font-bold tracking-tight">Welcome Back!</h2>
              <p className="text-teal-50 leading-relaxed max-w-sm mx-auto">
                To manage your active invoices and follow-ups, please log in with your personal info.
              </p>
              <button
                onClick={() => { setIsSignUp(false); setServerError(null); }}
                className="mt-8 px-12 py-3 rounded-full border-2 border-white hover:bg-white hover:text-primary transition-colors font-semibold tracking-wide"
              >
                SIGN IN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
