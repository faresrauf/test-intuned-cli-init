import { BrowserContext, Page } from "playwright-core";
import { extractStructuredDataFromFile } from "@intuned/sdk/ai-extractors";
import { PdfFile } from "@intuned/sdk/files";
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
  await page.goto("https://sandbox.intuned.dev/pdfs");
  const monitors = await page.extractArrayOptimized({
    label: "pdf demo site",
    itemEntityName: "monitor",
    itemEntitySchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          primary: true,
        },
        manufacturer: {
          type: "string",
        },
        model: {
          type: "string",
        },
        spec_href: {
          type: "string",
          description: "href value of the spec for the monitor",
        },
      },
      required: ["name", "spec_href", "manufacturer", "model"],
    },
  });
  for (const monitor of monitors) {
    const specs = await extractStructuredDataFromFile(
      {
        type: "pdf",
        source: {
          type: "url",
          data: monitor.spec_href,
        },
      },
      {
        label: "spec files",
        dataSchema: {
          type: "object",
          properties: {
            models: {
              description: "models number included in this spec sheet",
              type: "array",
              items: {
                type: "string",
              },
            },
            color_depth: {
              type: "string",
              description: "color depth of the monitor",
            },
            max_resolution: {
              type: "string",
              description: "max rolustion of the screen and at what hz",
            },
            power_source: {
              type: "object",
              properties: {
                power_rating: {
                  type: "string",
                },
                prowser_consumption: {
                  type: "string",
                },
              },
            },
            adpator: {
              type: "string",
              description: "AC AD adaptor specs",
            },
            dimensions: {
              type: "object",
              properties: {
                with_stand: {
                  type: "string",
                },
                without_stand: {
                  type: "string",
                },
              },
            },
            weight: {
              type: "object",
              properties: {
                with_stand: {
                  type: "string",
                },
                without_stand: {
                  type: "string",
                },
              },
            },
          },
          required: [
            "models",
            "color_depth",
            "max_resolution",
            "power_source",
            "adpator",
            "dimensions",
            "weight",
          ],
        },
      }
    );
    monitor.specs = specs;
  }
  return monitors;
}
