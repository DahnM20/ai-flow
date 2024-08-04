import { Page } from "@playwright/test";
const dotenv = require("dotenv");

dotenv.config({ path: ".env.test" });

export const baseURL = process.env.E2E_TEST_BASE_URL || "http://localhost:80";

export async function waitForAppInitialRender(page: Page) {
  await page.waitForSelector("#main-content", { state: "visible" });
  await page.waitForSelector("#loading-screen", { state: "detached" });
}
