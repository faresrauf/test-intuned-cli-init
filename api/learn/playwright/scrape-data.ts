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
  await page.goto("https://demo-site-eta.vercel.app/lists/card");
  const listContainerLocator = page.locator(
    "xpath=html/body/div/div/main/div/div/div[3]/div"
  );
  const listItems = await listContainerLocator.locator("> div").all();
  const contractsList = [];
  for (let i = 0; i < listItems.length; i++) {
    const itemLocator = listItems[i];
    const title = await itemLocator.locator("h3").textContent();
    const suppliers = await itemLocator
      .locator("xpath=//div[2]/p[1]")
      .textContent();
    const effectiveDate = await itemLocator
      .locator("xpath=//div[2]/p[2]")
      .textContent();
    const supplierNumber = await itemLocator
      .locator("xpath=//div[2]/p[3]")
      .textContent();
    const status = await itemLocator
      .locator("xpath=//div[2]/div")
      .textContent();
    const link = await itemLocator.locator("a").getAttribute("href");
    contractsList.push({
      title: transformString(title),
      suppliers,
      effectiveDate: transformEffectiveDate(effectiveDate),
      supplierNumber: transformSupplierNumber(supplierNumber),
      status,
      link,
    });
  }
  return contractsList;
}

function transformString(input) {
  return input.replace(/ - Amendment #\d+/, "");
}

function transformEffectiveDate(input) {
  return input.replace("Effective Date: ", "");
}

function transformSupplierNumber(input) {
  return input.replace("Supplier Number: ", "");
}
