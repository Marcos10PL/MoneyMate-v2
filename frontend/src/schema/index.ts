import z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");

const emailSchema = z.email("Invalid email address");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
