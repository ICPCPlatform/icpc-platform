import path from "path";
import { fileURLToPath } from "url";
import type { Linter } from "eslint";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next','prettier'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-unused-vars': ["error", { argsIgnorePattern: "^_" }],
    },
  }),
] satisfies Linter.Config[];

export default eslintConfig;
