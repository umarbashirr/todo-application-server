import * as z from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name should be minimum 02 characters!" }),
  email: z.string().email({ message: "Enter valid email!" }),
  password: z
    .string()
    .min(6, { message: "Password should be minimum 06 characters!" }),
});

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Enter valid email!" }),
  password: z
    .string()
    .min(6, { message: "Password should be minimum 06 characters!" }),
});
