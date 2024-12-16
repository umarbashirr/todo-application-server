import * as z from "zod";

export const tasksSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title should be minimum 02 characters!" }),
  description: z
    .string()
    .min(2, { message: "Description should be minimum 02 characters!" }),
});
