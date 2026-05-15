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
    <Card className="shadow-sm border border-slate-100 rounded-2xl bg-white overflow-hidden">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="text-lg text-slate-900 font-semibold">Business Profile</CardTitle>
        <CardDescription className="text-sm text-slate-500 mt-1">
          Update your personal and business details. These details will appear on your invoices.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="p-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Personal Info */}
            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4">Personal information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email address</label>
                <Input type="email" value={user.email} readOnly aria-readonly className="border-slate-200 text-slate-500" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full name *</label>
                <Input id="name" name="name" defaultValue={user.name} required className="focus:border-primary border-slate-200" />
              </div>
            </div>

            {/* Right Column: Business Info */}
            <div className="space-y-6">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4">Business details</h3>
              
              <div className="space-y-2">
                <label htmlFor="businessName" className="text-sm font-semibold text-slate-700">Business name *</label>
                <Input id="businessName" name="businessName" defaultValue={user.businessName} required className="focus:border-primary border-slate-200" />
              </div>

              <div className="space-y-2">
                <label htmlFor="businessPhone" className="text-sm font-semibold text-slate-700">Business phone</label>
                <Input id="businessPhone" name="businessPhone" defaultValue={user.businessPhone || ""} placeholder="+1 (555) 000-0000" className="focus:border-primary border-slate-200" />
              </div>

              <div className="space-y-2">
                <label htmlFor="businessAddress" className="text-sm font-semibold text-slate-700">Business address</label>
                <Input id="businessAddress" name="businessAddress" defaultValue={user.businessAddress || ""} placeholder="123 Business Rd, Tech City, CA 94016" className="focus:border-primary border-slate-200" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            {state?.error && <p role="alert" className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-100">{state.error}</p>}
            {state?.success && <p role="alert" className="text-sm text-primary font-medium bg-primary/10 p-3 rounded-lg border border-primary/10">{state.success}</p>}

            <Button type="submit" disabled={isPending} size="lg" className="ml-2">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
