import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_ACTIVE_BACKEND: z.enum(["js", "php", "python"]).default("js"),
  NEXT_PUBLIC_BACKEND_JS_URL: z.string().url().default("http://localhost:5000/api"),
  NEXT_PUBLIC_BACKEND_PHP_URL: z.string().url().default("http://localhost:8000/api"),
  NEXT_PUBLIC_BACKEND_PYTHON_URL: z.string().url().default("http://localhost:5000/api"),
});

// Since Next.js requires process.env.NEXT_PUBLIC_* to be explicitly referenced for static replacement,
// we must pass an object containing those specific keys.
const envVars = {
  NEXT_PUBLIC_ACTIVE_BACKEND: process.env.NEXT_PUBLIC_ACTIVE_BACKEND,
  NEXT_PUBLIC_BACKEND_JS_URL: process.env.NEXT_PUBLIC_BACKEND_JS_URL,
  NEXT_PUBLIC_BACKEND_PHP_URL: process.env.NEXT_PUBLIC_BACKEND_PHP_URL,
  NEXT_PUBLIC_BACKEND_PYTHON_URL: process.env.NEXT_PUBLIC_BACKEND_PYTHON_URL,
};

export const env = envSchema.parse(envVars);
