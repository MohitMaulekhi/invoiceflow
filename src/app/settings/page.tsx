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
    <div className="max-w-4xl mx-auto py-8">
      <SettingsForm user={user} />
    </div>
  );
}
