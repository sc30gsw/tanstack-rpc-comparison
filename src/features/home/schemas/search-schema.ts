import * as v from "valibot";

import { FRAMEWORKS } from "~/features/home/constants/framework";

export const defaultValues = {
  framework: "hono",
  limit: 30,
  q: "",
  skip: 0,
} as const satisfies HomeSearchParams;

export const homeSearchSchema = v.object({
  framework: v.optional(v.fallback(v.picklist(FRAMEWORKS), "hono"), "hono"),
  limit: v.optional(v.fallback(v.number(), 30), 30),
  q: v.optional(v.fallback(v.string(), ""), ""),
  skip: v.optional(v.fallback(v.number(), 0), 0),
});

export type HomeSearchParams = v.InferOutput<typeof homeSearchSchema>;
