import * as z from "zod";
export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const createPostFormSchema = z.object({
  caption: z.string().min(5).max(2200, {
    message: "Caption feild is required.",
  }),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100, {
    message: "Location feild is required.",
  }),
  tags: z.string().min(2).max(100, {
    message: "Tags feild is required.",
  }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
