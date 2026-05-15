import { requireAuth } from "@/lib/auth/session";
import { getUserProfile } from "@/server/queries/users";
import { SettingsForm } from "@/components/forms/settings-form";

export default async function SettingsPage() {
  const session = await requireAuth();
  const user = await getUserProfile(session.userId);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account settings and business profile.</p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
