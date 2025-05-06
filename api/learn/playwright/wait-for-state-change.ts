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
  /**
   * wait for url to be navigated to
   */
  await page.goto("http://uitestingplayground.com");
  const waitForUrl = page.waitForURL(/loaddelay/);
  await page.getByRole("link", { name: "Load Delay" }).click();
  await waitForUrl;

  await page.waitForTimeout(2000);
  /**
   * wait for element to be visible
   */
  await page.goto("http://uitestingplayground.com/clientdelay");
  await page
    .getByRole("button", { name: "Button Triggering Client Side Logic" })
    .click();
  await page.locator("#spinner").waitFor({ state: "hidden" });
  console.log(await page.locator("#content").textContent());

  /**
   * wait for request to be done
   */
  await page.goto("http://uitestingplayground.com/ajax");
  const waitforResponse = page.waitForResponse(/ajaxdata/);
  await page
    .getByRole("button", { name: "Button Triggering AJAX Request" })
    .click();
  const response = await waitforResponse;
  console.log(await response.text());
  return "Done!";
}
