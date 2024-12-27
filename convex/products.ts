import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    image: v.optional(v.any()),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const { title, description, category, image, price, } = args;

    console.log("title", title);
    console.log("description", description);
    console.log("category", category);
    console.log("image", image);
    console.log("price", price);


    // if (!title || !description || !category || !image || !price) {
    //   throw new Error("All fields are required");
    // }

    // if (price < 0) {
    //   throw new Error("Price cannot be negative");
    // }

    const product = await ctx.db.insert("product", {
      title: title,
      description: description,
      category: category,
      image: image,
      price: price,
      status: "Pending Approval", 
    });
    return product;
  },
});

export const getAllProducts = query({
  args: {
    // authorId: v.string(),
    // search: v.optional(v.string()),
    // favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("product").order("desc").collect();
    return products;
  },
});

export const remove = mutation({
  args: { id: v.id("product") },
  handler: async (ctx, args) => {
    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) {
      throw new Error("Document not found");
    }

    await ctx.db.delete(existingDoc._id);
  },
});

export const update = mutation({
  args: {
    id: v.id("product"),
  },
  handler: async (ctx, args) => {
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    const document = await ctx.db.patch(args.id, {
      ...existingDocument,
      status: "Approved",
    });

    return document;
  },
});
