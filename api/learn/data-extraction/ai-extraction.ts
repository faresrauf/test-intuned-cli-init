import { BrowserContext, Page } from "playwright-core";
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
  const url = [
    "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
    "https://books.toscrape.com/catalogue/tipping-the-velvet_999/index.html",
    "https://books.toscrape.com/catalogue/soumission_998/index.html",
    "https://books.toscrape.com/catalogue/the-requiem-red_995/index.html",
    "https://books.toscrape.com/catalogue/the-dirty-little-secrets-of-getting-your-dream-job_994/index.html",
    "https://books.toscrape.com/catalogue/the-coming-woman-a-novel-based-on-the-life-of-the-infamous-feminist-victoria-woodhull_993/index.html",
  ];
  const books = [] as any[];
  for (const link of url) {
    await page.goto(link);
    const result = await page.extractStructuredData({
      label: "books_to_scrape",
      dataSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "title of the book",
          },
          in_stock: {
            type: "boolean",
          },
          UPC: {
            type: "string",
          },
          product_type: {
            type: "string",
          },
          availableBooks: {
            type: "number",
            description: "number of avaible books",
          },
          price: {
            type: "object",
            properties: {
              price_include_tax: {
                type: "number",
              },
              price_execluding_tax: {
                type: "number",
              },
              tax_amount: {
                type: "number",
              },
              currency: {
                type: "string",
                enum: ["pound", "dollar"],
              },
            },
          },
        },
        required: [],
      },
    });
    books.push(result);
  }
  return books;
}
