import { test, expect } from "@playwright/test";
import { baseURL, waitForAppInitialRender } from "../utils";

test("renders the main content after loading", async ({ page }) => {
  await page.goto(baseURL);
  await waitForAppInitialRender(page);

  const mainContent = await page.$("#main-content");
  expect(mainContent).not.toBeNull();
});
