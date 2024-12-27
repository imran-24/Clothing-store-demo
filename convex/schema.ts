import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  product: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()), // Determines if the form is publicly accessible
    image: v.optional(v.any()), // Determines if the form is publicly accessible
    price: v.number(),
    status: v.optional(v.string()),
  })
});
