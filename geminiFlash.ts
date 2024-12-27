import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

export async function run(base64Image: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `I have an image of a product that a user wants to upload. 
Based on the image, can you extract the following details:
Title: A concise name for the product.
Description: A brief description of the product.
Price: An estimated price range (if identifiable).
Category: The most relevant category for the product (e.g., clothing, electronics, home decor, etc.).
Please output the extracted data in plain text format like this:
Title: Blue Denim Jacket
Description: A stylish blue denim jacket for casual wear.
Price: 40-50 USD
Category: Clothing
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.substring(base64Image.indexOf(",") + 1),
          mimeType: "image/jpeg",
        },
      },
    ]);

    console.log(typeof result.response.text());

    return result.response.text();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// run();
