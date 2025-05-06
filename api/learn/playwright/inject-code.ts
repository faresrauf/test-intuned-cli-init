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
  await page.goto("https://example.com");

  // Transform the DOM
  await page.evaluate(() => {
    const header = document.querySelector("h1");
    if (header) {
      header.textContent = "Playwright DOM Manipulation Example";
      header.style.color = "red";
    }
    const paragraph = document.querySelector("p");
    if (paragraph) {
      paragraph.textContent = "This paragraph has been changed by Playwright.";
      paragraph.style.fontSize = "20px";
    }
  });

  // Perform a fetch request and log the response
  const response = await page.evaluate(async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    const data = await response.json();
    return data;
  });
  console.log("Fetch response:", response);
  return {};
}
