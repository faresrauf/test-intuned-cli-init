import { FormInputItem, extendPlaywrightPage } from "@intuned/sdk/playwright";
import { BrowserContext, Locator, Page } from "playwright-core";

export type Step = "ShippingAddress" | "PaymentDetails" | "Review";

async function formSubmit(locator: Locator) {
  const nextButtonLocator = locator
    .page()
    .getByRole("button", { name: "Next" });
  await nextButtonLocator.waitFor({ state: "visible" });
  await nextButtonLocator.click();
}

async function getCurrentStep(page: Page): Promise<Step> {
  const title = await page.locator(
    "//html/body/div/div/main/div/div[2]/div[1]/h1"
  );
  if ((await title.textContent()) === "Shipping address")
    return "ShippingAddress";
  if ((await title.textContent()) === "Payment Details")
    return "PaymentDetails";
  if ((await title.textContent()) === "Review your order") return "Review";
  return "ShippingAddress";
}

const getFields = (step: Step, input: any): FormInputItem[] => {
  switch (step) {
    case "ShippingAddress":
      return getShippingAddressFields(input);
    case "PaymentDetails":
      return getPaymentDetailsFields(input);
    default:
      return [];
  }
};

const didFormSucceed = async (locator: Locator): Promise<boolean> => {
  return (await locator.page().locator(".error-message").count()) === 0;
};

async function run(_params: any, _page: Page, context: BrowserContext) {
  const page = extendPlaywrightPage(_page);
  await page.goto(
    "https://demo-site-eta.vercel.app/steps-form/ShippingAddress"
  );

  let currentStep = await getCurrentStep(page);
  while (currentStep !== "Review") {
    const fields = getFields(currentStep, params);
    await page.fillForm({
      formLocator: page.locator("main"),
      formInput: fields,
      isSubmitSuccessful: didFormSucceed,
      submitForm: formSubmit,
      autoRecoveryOptions: {
        enabled: true,
        recoveryData: params,
      },
    });
    currentStep = await getCurrentStep(page);
  }

  await page.getByRole("heading", { name: "Review your order" }).waitFor({
    state: "visible",
  });

  const res = await page.extractObjectOptimized({
    entityName: "checkout_details",
    label: "checkout_details",
    entitySchema: {
      type: "object",
      required: ["totalPrice", "cardType"],
      properties: {
        totalPrice: {
          type: "string",
          description: "total price of order",
        },
        cardType: {
          type: "string",
          description: "card type",
        },
      },
    },
  });

  return res;
}

const params = {
  firstName: "Ahmad",
  lastName: "Alhour",
  address1: "123 Main St",
  address2: "Apt 1",
  city: "San Francisco",
  state: "CA",
  zip: "94105",
  country: "US",
  nameOnCard: "Ahmad Alhour",
  cardNumber: "4242424242424242",
  expiration: "12/21",
  cvv: "123",
  saveAddress: true,
};

export const getShippingAddressFields = (input: any): FormInputItem[] => [
  {
    fieldSelector: {
      selector: "[name='firstName']",
      type: "css",
    },
    value: { type: "static", value: input.firstName },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='lastName']",
      type: "css",
    },
    value: { type: "static", value: input.lastName },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='addressLine1']",
      type: "css",
    },
    value: { type: "static", value: input.address1 },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='addressLine2']",
      type: "css",
    },
    value: { type: "static", value: input.address2 },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='city']",
      type: "css",
    },
    value: { type: "static", value: input.city },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='state']",
      type: "css",
    },
    value: { type: "static", value: input.state },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='zipCode']",
      type: "css",
    },
    value: { type: "static", value: input.zip },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='country']",
      type: "css",
    },
    value: { type: "dynamic", source: { country: input.country } },
    fieldType: "select",
  },
  {
    fieldSelector: {
      selector: "[name='futurePurchase']",
      type: "css",
    },
    fieldType: "checkbox",
    value: { type: "static", value: true },
  },
];

export const getPaymentDetailsFields = (input: any): FormInputItem[] => [
  {
    fieldSelector: {
      selector: "[name='nameOnCard']",
      type: "css",
    },
    value: { type: "static", value: input.nameOnCard },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='cardNumber']",
      type: "css",
    },
    value: { type: "static", value: input.cardNumber },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='expiryDate']",
      type: "css",
    },
    value: { type: "static", value: input.expiration },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='cvv']",
      type: "css",
    },
    value: { type: "static", value: input.cvv },
    fieldType: "text-input",
  },
  {
    fieldSelector: {
      selector: "[name='rememberCreditCardDetails']",
      type: "css",
    },
    fieldType: "checkbox",
    value: { type: "static", value: true },
  },
];

export default run;
