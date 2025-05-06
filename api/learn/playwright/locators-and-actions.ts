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
  // get by text and wait for the locator to be visible;
  await page
    .getByText("Automation Testing Practice")
    .waitFor({ state: "visible" });
  /**
   * ==================
   * Locators
   * ==================
   */
  // by css id
  const nameIdLocator = page.locator("#name");
  // by xpath
  const nameXpathLocator = page.locator(
    "xpath=/html/body/div[4]/div[2]/div[2]/div[2]/div[2]/div[2]/div[2]/div/div[4]/div[1]/div/div/div[1]/div[1]/div/div/div/div/div[2]/div[1]/input[1]"
  );
  // by label
  const genderCheckboxLocator = page.getByLabel("Female");
  // by regex
  const regexLocators = page.getByText(/table/);
  // regex will point to two elements so need to find all locators
  const allRegex = await regexLocators.all();
  for (const regexLocator of allRegex) {
    console.log(await regexLocator.textContent());
  }
  // by role and name
  const submitButton = page.getByRole("button", { name: /Submit/ });

  /**
   * ==================
   * Actions
   * ==================
   */
  // type locator
  await nameIdLocator.type("My name");
  // text content
  const headerContent = await page.locator("#header").textContent();
  // click
  await page.getByText("New Browser Window").first().click();
  // double click
  await page.getByText("Copy Text").click({ clickCount: 2 });
  // check radio button
  await genderCheckboxLocator.check();
  return "Done!";
}
