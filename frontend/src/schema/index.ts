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

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(40, "Name must be less than 40 characters")
  .regex(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,\- ]*$/, "Invalid characters in name");

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
  name: nameSchema,
});

export const categorySchema = z.object({
  name: nameSchema,
  is_global: z.boolean().optional(),
});

export const transactionSchema = z.object({
  name: nameSchema,
  amount: z.coerce
    .number("Amount must be a number")
    .positive("Amount must be greater than zero"),
  category_id: z.number().positive("Category is required"),
  type_id: z.number().positive("Type is required"),
  date: z.date().optional(),
});
