import { BrowserContext, Page } from "playwright-core";
import { downloadFile, uploadFileToS3 } from "@intuned/sdk/files";
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
  await page.goto("https://www.princexml.com/samples/");
  const downloadlXmlFile = await downloadFile(page, {
    type: "DownloadFromDirectLink",
    downloadTrigger: page.locator("#dictionary > p.links > a:nth-child(2)"),
  });
  console.log({
    path: await downloadlXmlFile.path(),
    suggestedName: downloadlXmlFile.suggestedFilename(),
  });

  const file = await uploadFileToS3(downloadlXmlFile, {
    s3Configs: {
      accessKeyId: "xxxxxx",
      bucket: "xxxxx",
      region: "xxxxxx",
      secretAccessKey: "xxxxxx",
    },
  });

  return {
    signedUrl: await file.generateSignedUrl(),
    descriptor: file.urlDescriptor(),
  };
}
