import { BrowserContext, Page } from "playwright-core";
import {
  extractMarkdownFromFile,
  extractMarkdownFromPage,
  extractTablesFromFile,
} from "@intuned/sdk/ai-extractors";
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
  await page.goto(
    "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html"
  );
  const siteMarkdown = extractMarkdownFromPage(page);

  const specMarkdown = await extractMarkdownFromFile(
    {
      type: "pdf",
      source: {
        type: "url",
        data: "https://intuned-docs-public-images.s3.amazonaws.com/27UP600_27UP650_ENG_US.pdf",
      },
    },
    { label: "pdf_markdown" }
  );

  const fileTables = await extractTablesFromFile(
    {
      type: "pdf",
      source: {
        type: "url",
        data: "https://intuned-docs-public-images.s3.amazonaws.com/27UP600_27UP650_ENG_US.pdf",
      },
    },
    { label: "pdf_markdown" }
  );

  return { siteMarkdown, specMarkdown, fileTables };
}
