"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { passwordSchema } from "@/lib/zod";
import { useRouter } from 'next/navigation';

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
import { Button } from "@/components/ui/button";

export default function LoginDialog() {
  const { refresh } = useRouter();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

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

      refresh();
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
