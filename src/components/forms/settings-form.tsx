"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { updateProfileAction } from "@/server/actions/users/update-profile";
import { signOutAction } from "@/server/actions/auth/sign-out";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import type { UserProfile } from "@/server/queries/users";

export function SettingsForm({ user }: { user: UserProfile }) {
  const [state, setState] = useState<{ error?: string; success?: string } | null>(null);
  const [isPending, startSaveTransition] = useTransition();
  const [isSignOutPending, startSignOut] = useTransition();

  const handleLogout = () => {
    startSignOut(async () => {
      await signOutAction();
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState(null);

    const formData = new FormData(event.currentTarget);

    startSaveTransition(async () => {
      const result = await updateProfileAction(formData);
      setState(result ?? null);
    });
  };

  const userInitials = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Business Details Card (Left Side on Desktop) */}
      <form onSubmit={handleSubmit} className="flex-1 w-full order-2 lg:order-1">
        <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[24px] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-900 font-semibold tracking-tight">Business Details</CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              These details will appear on all generated invoices and client communications.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              
              <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="text-sm font-semibold text-slate-700">Full Name *</div>
                <div className="md:col-span-2">
                  <Input id="name" name="name" defaultValue={user.name} required className="focus:border-primary border-slate-200 w-full bg-white shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-4 items-center hover:bg-slate-50/50 transition-colors bg-slate-50/30">
                <div className="text-sm font-semibold text-slate-700">Business Name *</div>
                <div className="md:col-span-2">
                  <Input id="businessName" name="businessName" defaultValue={user.businessName} required className="focus:border-primary border-slate-200 w-full bg-white shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="text-sm font-semibold text-slate-700">Business Phone</div>
                <div className="md:col-span-2">
                  <Input id="businessPhone" name="businessPhone" defaultValue={user.businessPhone || ""} placeholder="+1 (555) 000-0000" className="focus:border-primary border-slate-200 w-full bg-white shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-4 items-center hover:bg-slate-50/50 transition-colors bg-slate-50/30">
                <div className="text-sm font-semibold text-slate-700">Business Address</div>
                <div className="md:col-span-2">
                  <Input id="businessAddress" name="businessAddress" defaultValue={user.businessAddress || ""} placeholder="123 Business Rd, Tech City, CA 94016" className="focus:border-primary border-slate-200 w-full bg-white shadow-sm" />
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-4">
              {state?.error && <p role="alert" className="text-sm text-red-600 font-medium bg-red-50 p-2.5 px-4 rounded-xl border border-red-100">{state.error}</p>}
              {state?.success && <p role="alert" className="text-sm text-emerald-600 font-medium bg-emerald-50 p-2.5 px-4 rounded-xl border border-emerald-100">{state.success}</p>}

              <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-10 py-6 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Profile & Security Card (Right Side on Desktop) */}
      <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[24px] bg-white overflow-hidden w-full lg:w-[400px] shrink-0 order-1 lg:order-2">
        <CardHeader className="p-8 border-b border-slate-100">
          <CardTitle className="text-xl text-slate-900 font-semibold tracking-tight">Profile</CardTitle>
          <CardDescription className="text-sm text-slate-500 mt-1">
            Your personal information and security.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-4xl shadow-md shrink-0">
              {userInitials}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
              <p className="text-slate-500 font-medium">{user.email}</p>
            </div>
            <div className="w-full pt-4 border-t border-slate-100">
              <Button 
                onClick={handleLogout} 
                disabled={isSignOutPending} 
                variant="outline" 
                className="w-full rounded-xl font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 transition-colors py-6 px-6"
              >
                {isSignOutPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <LogOut className="w-5 h-5 mr-2" />}
                Log Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
