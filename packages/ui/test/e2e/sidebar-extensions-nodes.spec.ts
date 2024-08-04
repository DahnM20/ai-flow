import { test, expect } from "@playwright/test";
import { baseURL, waitForAppInitialRender } from "../utils";

test("default extensions are loaded in sidebar", async ({ page }) => {
  await page.goto(baseURL);
  await waitForAppInitialRender(page);

  const stabilityNodeSidebar = await page.locator("text=StabilityAI").first();
  const documentNodeSidebar = await page
    .locator("text=Document-to-Text")
    .first();

  const stabilityaiNodeContent = await stabilityNodeSidebar.textContent();
  const documentNodeContent = await documentNodeSidebar.textContent();

  expect(stabilityaiNodeContent).toContain("StabilityAI");
  expect(documentNodeContent).toContain("Document-to-Text");
});
