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
    <Card className="shadow-sm border-slate-200 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Business Profile</CardTitle>
        <CardDescription>
          Update your personal and business details. These details will appear on your invoices.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address (Read-only)</label>
              <Input type="email" value={user.email} disabled className="bg-slate-50 text-slate-500" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name *</label>
              <Input id="name" name="name" defaultValue={user.name} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-semibold text-slate-700">Business Name *</label>
              <Input id="businessName" name="businessName" defaultValue={user.businessName} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="businessPhone" className="text-sm font-semibold text-slate-700">Business Phone</label>
              <Input id="businessPhone" name="businessPhone" defaultValue={user.businessPhone || ""} placeholder="+1 (555) 000-0000" />
            </div>

            <div className="space-y-2">
              <label htmlFor="businessAddress" className="text-sm font-semibold text-slate-700">Business Address</label>
              <Input id="businessAddress" name="businessAddress" defaultValue={user.businessAddress || ""} placeholder="123 Business Rd, Tech City, CA 94016" />
            </div>
          </div>

          {state?.error && <p className="text-sm text-red-600 font-medium">{state.error}</p>}
          {state?.success && <p className="text-sm text-emerald-600 font-medium">{state.success}</p>}

          <div className="pt-2">
            <Button type="submit" disabled={isPending} className="px-8 shadow-md">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
