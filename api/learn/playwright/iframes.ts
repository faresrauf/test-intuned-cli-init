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
  await page.goto("https://testautomationpractice.blogspot.com/");
  const frame = page.frameLocator("#frame-one796456169");
  await frame.locator("#RESULT_TextField-0").fill("Random Name");
  await frame.getByText("Female").check();
  await frame.locator("#RESULT_TextField-2").fill("12121994");
  await page.waitForTimeout(2000);
  await frame.getByRole("button", { name: "Submit" }).click();
  return {};
}
