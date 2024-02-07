import { z } from "zod";

export const createUserValidation = z.object({
  email: z
    .string({
      required_error: `Email is required!`,
      invalid_type_error: `Invalid email!`,
    })
    .email({ message: `Invalid email address!` }),
   password: z.string({
    required_error: `Password is required!`,
    invalid_type_error: `Invalid password!`,
  }),
   name: z.string().optional(),
});

export const updateUserValidation = createUserValidation.partial();

export const ZodValidations = { createUserValidation, updateUserValidation };
