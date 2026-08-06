import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .max(65_535)
    .default(3001),

  HOST: z.string().default("0.0.0.0"),

  OPEN_METEO_BASE_URL: z
    .url()
    .default("https://marine-api.open-meteo.com/v1/marine"),
});

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment configuration:",
    z.prettifyError(result.error),
  );

  process.exit(1);
}

export const env = result.data;

export type Env = z.infer<typeof EnvSchema>;