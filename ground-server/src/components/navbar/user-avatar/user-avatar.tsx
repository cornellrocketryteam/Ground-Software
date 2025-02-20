import { auth } from "@/app/auth";

import LoginDialog from "@/components/navbar/user-avatar/login-dialog";
import UserMenu from "@/components/navbar/user-avatar/user-menu";

export default async function UserAvatar() {
  const session = await auth();
  return !session ? <LoginDialog /> : <UserMenu />;
}
