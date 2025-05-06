import { BrowserContext, Page } from "playwright-core";
import { extractStructuredDataFromContent } from "@intuned/sdk/ai-extractors";
import { extendPlaywrightPage } from "@intuned/sdk/playwright";

interface Params {
  // Add your params here
}

export default async function handler(
  params: Params,
  _playwrightPage: Page,
  context: BrowserContext
) {
  const page = extendPlaywrightPage(_playwrightPage);
  const textData = extractStructuredDataFromContent(
    {
      type: "text",
      data: `"To Kill a Mockingbird" is a fiction novel written by Harper Lee. Published in 1960, this classic book delves into the themes of racial injustice and moral growth. The story is set in the American South during the 1930s. The book's ISBN is 978-0-06-112008-4.`,
    },
    {
      label: "book",
      model: "claude-3-haiku",
      dataSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the book",
          },
          author: {
            type: "string",
            description: "The author of the book",
          },
          published_year: {
            type: "integer",
            description: "The year the book was published",
          },
          genre: {
            type: "string",
            description: "The genre of the book",
          },
          ISBN: {
            type: "string",
            description: "The International Standard Book Number of the book",
          },
        },
        required: ["title", "author", "published_year", "genre", "ISBN"],
      },
    }
  );

  const imageData = extractStructuredDataFromContent(
    {
      type: "image-url",
      image_type: "png",
      data: "https://intuned-docs-public-images.s3.amazonaws.com/guides/book-details.png",
    },
    {
      label: "image",
      model: "claude-3-haiku",
      dataSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          in_stock: {
            type: "boolean",
          },
        },
        required: ["title", "in_stock"],
      },
    }
  );
  return { imageData, textData };
}
