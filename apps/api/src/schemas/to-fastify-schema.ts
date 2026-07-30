import { z } from "zod";

/** Convert a Zod schema to JSON Schema that Fastify/Ajv can compile. */
export function toFastifySchema(schema: z.ZodType) {
  const { $schema: _, ...jsonSchema } = z.toJSONSchema(schema, {
    target: "draft-7",
  });

  return jsonSchema;
}
