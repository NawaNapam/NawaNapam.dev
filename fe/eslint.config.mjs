import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Ignore all Prisma generated files
      "src/generated/**",
      "prisma/generated/**",
      // Ignore specific problematic files
      "**/runtime/**",
      "**/*.wasm.js",
      "**/wasm.js",
    ],
  },
  {
    // Additional rules for remaining files
    rules: {
      // Allow require() imports for compatibility with certain libraries
      "@typescript-eslint/no-require-imports": "off",
      // Allow 'this' aliasing patterns common in generated code
      "@typescript-eslint/no-this-alias": "off",
    },
  },
];

export default eslintConfig;
