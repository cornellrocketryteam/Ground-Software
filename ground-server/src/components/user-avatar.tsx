import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useSession, signIn, signOut } from "next-auth/react";
import { passwordSchema } from "@/lib/zod";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserAvatar() {
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  if (status === "loading") {
    return (
      <Button className="h-10 w-10" size="icon" disabled>
        <ReloadIcon className="h-[1.2rem] w-[1.2rem] animate-spin" />
      </Button>
    );
  }

  if (!session?.user) {
    const onSubmit = (values: z.infer<typeof passwordSchema>) => {
      signIn("credentials", {
        ...values,
        redirect: false,
      }).then((response) => {
        if (response?.error === "CredentialsSignin") {
          form.setError(
            "password",
            {
              type: "custom",
              message: "Invalid password",
            },
            {
              shouldFocus: true,
            }
          );
        } else if (!response || response.error) {
          form.setError(
            "password",
            {
              type: "custom",
              message: "An error occurred",
            },
            {
              shouldFocus: true,
            }
          );
        }
      });
    };


    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-10 w-10" size="icon">
            <ChevronRightIcon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Admin login</DialogTitle>
            <DialogDescription hidden>
              Enter the admin password to gain access to controls
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 text-center"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel hidden>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription hidden>Enter the password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

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
        <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => signOut({ redirect: false })}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
