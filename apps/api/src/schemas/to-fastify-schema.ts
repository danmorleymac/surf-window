import { z } from "zod";

/** Convert a Zod schema to JSON Schema that Fastify/Ajv can compile. */
export function toFastifySchema<T extends z.ZodType>(schema: T) {
  const jsonSchema = z.toJSONSchema(schema, {
    target: "draft-7",
  });

  delete jsonSchema.$schema;

  return jsonSchema;
}
