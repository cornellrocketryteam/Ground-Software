import { z } from "zod";

export const passwordSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(2, "Password must be more than 2 characters")
    .max(50, "Password must be less than 50 characters"),
});
