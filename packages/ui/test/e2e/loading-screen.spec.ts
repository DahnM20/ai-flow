import { test, expect } from "@playwright/test";
import { baseURL } from "../utils";

test("renders the loading screen initially", async ({ page }) => {
  await page.goto(baseURL);

  await page.waitForSelector("#loading-screen", { state: "visible" });
  const loadingScreen = await page.$("#loading-screen");
  expect(loadingScreen).not.toBeNull();
});
