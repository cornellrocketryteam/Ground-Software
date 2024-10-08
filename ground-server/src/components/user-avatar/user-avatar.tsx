import { auth } from "@/app/auth";

import LoginDialog from "@/components/user-avatar/login-dialog";
import UserMenu from "@/components/user-avatar/user-menu";

export default async function UserAvatar() {
  const session = await auth();
  return !session ? <LoginDialog /> : <UserMenu />;
}
