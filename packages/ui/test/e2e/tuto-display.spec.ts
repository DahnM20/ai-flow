import { test, expect } from "@playwright/test";
import { baseURL, waitForAppInitialRender } from "../utils";

test("tuto is launched after loading", async ({ page }) => {
  await page.goto(baseURL);
  await waitForAppInitialRender(page);

  await page.screenshot({ path: "screenshots/tuto-before-wait.png" });
  await page.waitForSelector("#react-joyride-step-0", { state: "attached" });

  const tutoStep = await page.$("#react-joyride-step-0");
  expect(tutoStep).not.toBeNull();

  const textContent = await tutoStep?.textContent();
  expect(textContent).toContain("Welcome to AI-FLOW");

  const closeTutoButton = await page.locator("text=I know the app");
  await closeTutoButton.click();

  const tutoStepAfterClose = await page.$("#react-joyride-step-0");
  expect(tutoStepAfterClose).toBeNull();

  await page.screenshot({ path: "screenshots/tuto-after-wait.png" });
});
