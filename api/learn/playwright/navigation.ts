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
  // navigate to a page
  await page.goto("https://www.wikipedia.org/");
  await page.getByRole("link", { name: "English" }).click();
  // wait for page to be loaded and all network requests are done
  await page.waitForLoadState("networkidle");

  // open another tab
  const secondTab = await context.newPage();
  await secondTab.goto("https://www.yahoo.com/", { waitUntil: "load" });

  return "Done!";
}
