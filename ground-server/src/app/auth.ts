import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { passwordSchema } from "@/lib/zod";
import process from 'node:process';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Password",
      credentials: {
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { password } = await passwordSchema.parseAsync(credentials);

          if (password === process.env.PASSWORD) {
            return {
              name: "Max Larsson",
            };
          }

          return null;
        } catch {
          // Only possible error is zod error
          return null;
        }
      },
    }),
  ],
  trustHost: true,
});
