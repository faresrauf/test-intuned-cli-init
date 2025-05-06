import { BrowserContext, Page } from "playwright-core";
import { downloadFile } from "@intuned/sdk/files";
import { extendPlaywrightPage } from "@intuned/sdk/playwright";

interface Params {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  nameOnCard: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  saveAddress: boolean;
}

async function downloadImageToUse(page: Page) {
  const image = await downloadFile(page, {
    type: "DirectLink",
    link: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
  });
  return image.path();
}

export default async function handler(
  params: Params,
  _playwrightPage: Page,
  context: BrowserContext
) {
  const page = extendPlaywrightPage(_playwrightPage);
  await page.goto(
    "https://demo-site-eta.vercel.app/steps-form/ShippingAddress"
  );
  /**
   * Step 1
   */
  // text fields
  await page.getByLabel("First Name *").type(params.firstName, { delay: 500 });
  await page.locator("[name='lastName']").type(params.lastName);
  await page.locator("[name='addressLine1']").type(params.address1);
  await page.locator("[name='addressLine2']").type(params.address2);
  await page.locator("[name='city']").type(params.city);
  await page.locator("[name='state']").type(params.state);
  await page.locator("[name='zipCode']").type(params.zip);
  // select field
  await page.locator("[name='country']").selectOption(params.country);
  // checkbox
  await page.locator("[name='futurePurchase']").check();
  // submit
  await page.getByRole("button", { name: "Next" }).click();

  /**
   * Step 2
   */
  // text fields
  await page.locator("[name='nameOnCard']").type(params.nameOnCard);
  await page.locator("[name='cardNumber']").type(params.cardNumber);
  await page.locator("[name='expiryDate']").type(params.expiration);
  await page.locator("[name='cvv']").type(params.cvv);
  // checkbox
  await page.locator("[name='rememberCreditCardDetails']").check();
  //submit
  await page.getByRole("button", { name: "Next" }).click();

  const text = await page
    .locator("p", { hasText: "Total Price" })
    .textContent();
  return text;
}
