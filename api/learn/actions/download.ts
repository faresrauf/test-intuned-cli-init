import { BrowserContext, Page } from "playwright-core";
import { downloadFile } from "@intuned/sdk/files";
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
   * Download by clicking a locator that results in a downloaded file
   */
  await page.goto("https://www.princexml.com/samples/");
  const downloadlXmlFile = await downloadFile(page, {
    locator: page.locator("#dictionary > p.links > a:nth-child(2)"),
  });
  console.log({
    path: await downloadlXmlFile.path(),
    suggestedName: downloadlXmlFile.suggestedFilename(),
  });

  /**
   * directly download file from URL
   */
  const downloadedDirectPdf = await downloadFile(page, {
    url: "https://pdfobject.com/pdf/sample.pdf",
  });
  console.log({
    path: await downloadedDirectPdf.path(),
    suggestedName: downloadedDirectPdf.suggestedFilename(),
  });

  /**
   * Download by providing a trigger function that triggers the download
   */
  await page.goto("https://sandbox.intuned.dev/pdfs");
  const download = await downloadFile(page, {
    trigger: (page) =>
      page
        .locator(
          'xpath=//*[@id="root"]/div/main/div/div/div/table/tbody/tr[1]/td[4]/a'
        )
        .click(),
  });
  console.log({
    path: await download.path(),
    suggestedName: download.suggestedFilename(),
  });

  /**
   * Print site and download as pdf
   */
  await page.goto(
    "https://css-tricks.com/quick-tip-making-a-print-this-page-button/"
  );
  const downloadPrintedPdf = await downloadFile(page, {
    type: "PrintPageAsPdf",
  });
  console.log({
    path: await downloadPrintedPdf.path(),
    suggestedName: downloadPrintedPdf.suggestedFilename(),
  });

  return {};
}
