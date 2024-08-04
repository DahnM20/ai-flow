import { test, expect } from "@playwright/test";
import { baseURL, waitForAppInitialRender } from "../utils";

test("initial gpt node is present after loading", async ({ page }) => {
  await page.goto(baseURL);
  await waitForAppInitialRender(page);

  const mainContent = await page.$("#main-content");
  expect(mainContent).not.toBeNull();

  const reactFlow = await page.waitForSelector(".reactflow-wrapper", {
    state: "visible",
  });
  expect(reactFlow).not.toBeNull();

  const gptNode = await page.waitForSelector(".react-flow__node-llm-prompt", {
    state: "visible",
  });

  expect(gptNode).not.toBeNull();
});
