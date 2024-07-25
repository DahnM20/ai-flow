import { test, expect } from "@playwright/test";
import { baseURL, waitForAppInitialRender } from "../utils";

test("default nodes are loaded in sidebar", async ({ page }) => {
  await page.goto(baseURL);
  await waitForAppInitialRender(page);

  const textNodeSidebar = await page.locator("text=Text").first();
  const webNodeSidebar = await page.locator("text=Web Extractor").first();
  const fileNodeSidebar = await page.locator("text=File").first();

  const textNodeContent = await textNodeSidebar.textContent();
  const webNodeContent = await webNodeSidebar.textContent();
  const fileNodeContent = await fileNodeSidebar.textContent();

  expect(textNodeContent).toContain("Text");
  expect(webNodeContent).toContain("Web Extractor");
  expect(fileNodeContent).toContain("File");
});

test("hidden nodes are not loaded in sidebar", async ({ page }) => {
  await page.goto(baseURL);
  await waitForAppInitialRender(page);

  const aiActionNodeSidebar = await page.locator("text=AI Action");

  const aiActionNodeCount = await aiActionNodeSidebar.count();

  expect(aiActionNodeCount).toBe(0);
});
