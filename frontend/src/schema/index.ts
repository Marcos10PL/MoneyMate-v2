import z from "zod";

const loginPasswordSchema = z.string().min(1, "Password is required");

const registerPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

  

const emailSchema = z.email("Invalid email address");

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(255, "Name must be less than 255 characters long"),
    email: emailSchema,
    password: registerPasswordSchema,
    password_confirmation: registerPasswordSchema,
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const accountSchema = z.object({
  name: z
    .string()
    .min(2, "Account name must be at least 2 characters long")
    .max(40, "Account name must be less than 40 characters long"),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long")
    .max(40, "Category name must be less than 40 characters long"),
  is_global: z.boolean().optional(),
});
