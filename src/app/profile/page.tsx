import ProfileView from "@/components/ProfileView";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const user = auth.currentUser;

  if (!user) return <p>ログインが必要です</p>;

  return <ProfileView userId={user.uid} />;
}