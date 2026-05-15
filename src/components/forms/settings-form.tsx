"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/server/actions/users/update-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SettingsForm({ user }: { user: any }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  return (
    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[24px] bg-white overflow-hidden">
      <CardHeader className="p-8 border-b border-slate-100">
        <CardTitle className="text-2xl text-slate-800 font-medium">Business Profile</CardTitle>
        <CardDescription className="text-base mt-2">
          Update your personal and business details. These details will appear on your invoices.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="p-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Personal Info */}
            <div className="space-y-6">
              <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-6">Personal Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address (Read-only)</label>
                <Input type="email" value={user.email} disabled className="bg-slate-50 text-slate-500 border-slate-200" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name *</label>
                <Input id="name" name="name" defaultValue={user.name} required className="focus:border-emerald-500 bg-slate-50 border-slate-200" />
              </div>
            </div>

            {/* Right Column: Business Info */}
            <div className="space-y-6">
              <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-6">Business Details</h3>
              
              <div className="space-y-2">
                <label htmlFor="businessName" className="text-sm font-semibold text-slate-700">Business Name *</label>
                <Input id="businessName" name="businessName" defaultValue={user.businessName} required className="focus:border-emerald-500 bg-slate-50 border-slate-200" />
              </div>

              <div className="space-y-2">
                <label htmlFor="businessPhone" className="text-sm font-semibold text-slate-700">Business Phone</label>
                <Input id="businessPhone" name="businessPhone" defaultValue={user.businessPhone || ""} placeholder="+1 (555) 000-0000" className="focus:border-emerald-500 bg-slate-50 border-slate-200" />
              </div>

              <div className="space-y-2">
                <label htmlFor="businessAddress" className="text-sm font-semibold text-slate-700">Business Address</label>
                <Input id="businessAddress" name="businessAddress" defaultValue={user.businessAddress || ""} placeholder="123 Business Rd, Tech City, CA 94016" className="focus:border-emerald-500 bg-slate-50 border-slate-200" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col items-end gap-4">
            {state?.error && <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-100 w-fit">{state.error}</p>}
            {state?.success && <p className="text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-100 w-fit">{state.success}</p>}

            <Button type="submit" disabled={isPending} className="px-10 py-6 rounded-xl font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-transform">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
