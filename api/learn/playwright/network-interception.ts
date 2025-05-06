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
  const companies: {
    name: string;
    website: string;
    industry: string;
    tags: string[];
  }[] = [];
  const page = extendPlaywrightPage(_playwrightPage);
  const responsePromise = page.waitForResponse(async (response) => {
    const requestUrl = response.request().url();
    if (requestUrl.includes("indexes/*/queries")) {
      const jsonResponse = JSON.parse((await response.body()).toString());
      if (jsonResponse.results[0].hits.length > 1) {
        return true;
      }
    }
    return false;
  });
  await page.goto(`https://www.ycombinator.com/companies`);
  const response = await responsePromise;
  const jsonResponse = JSON.parse((await response.body()).toString());
  companies.push(
    ...jsonResponse.results[0].hits.map((i) => ({
      name: i.name,
      website: i.website,
      industry: i.industy,
      tags: i.tags,
    }))
  );
  return companies;
  return {};
}
