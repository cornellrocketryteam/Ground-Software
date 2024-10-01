import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function UserAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src="https://github.com/maxslarsson.png"
            alt="@maxslarsson"
          />
          <AvatarFallback>ML</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-34">
        <DropdownMenuLabel>Max Larsson</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <p>Settings</p>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <p className="text-red-600">Sign out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
