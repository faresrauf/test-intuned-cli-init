import { BrowserContext, Page } from "playwright-core";
import { extendPlaywrightPage } from "@intuned/sdk/playwright";

interface Params {
  category?: string;
}

export default async function handler(
  params: Params,
  _playwrightPage: Page,
  context: BrowserContext
) {
  const page = extendPlaywrightPage(_playwrightPage);
  await page.goto("https://books.toscrape.com/");
  if (params.category)
    await page
      .locator("div.side_categories")
      .getByText(params.category)
      .click();
  const books = await page.extractArrayOptimized({
    label: "books_list",
    itemEntityName: "book",
    prompt: "scrape the books list from the page.",
    strategy: {
      model: "claude-3.5-sonnet",
      type: "HTML",
    },
    itemEntitySchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          primary: true,
          description: "book title",
        },
        price: {
          type: "string",
          description: "book price",
        },
        in_stock: {
          type: "string",
          description: "book in stock or out of stock",
        },
      },
      required: ["title", "price", "in_stock"],
    },
  });
  return books;
}
