// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: "src/setupTests.ts",
    include: ["test/unit/**/*.test.{js,ts,jsx,tsx}"],
  },
});
