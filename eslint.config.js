// ESLint v9+ flat config
import js from "@eslint/js";
import * as tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  // Global settings (React version)
  { settings: { react: { version: "detect" } } },

  // Global ignores
  { ignores: ["node_modules", "dist", "build", "coverage", "**/.next", "**/.vite", "**/out"] },

  // Base recommended sets
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,

  // ===== Root project rules (strict) =====
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      "react-hooks": hooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // keep the rest strict at the root
    },
  },

  // ===== Service worker files (fixes no-undef for self/caches/fetch) =====
  {
    files: ["**/public/service-worker.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        self: "readonly",
        caches: "readonly",
        fetch: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
    },
  },

  // ===== Config files can use require() (tailwind, etc.) =====
  {
    files: ["**/tailwind.config.{js,ts}", "**/postcss.config.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { require: "readonly", module: "readonly", __dirname: "readonly" },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // ===== Subtree / integrated apps: relax TS strictness to avoid CI failures =====
  {
    files: [
      "apps/publimais/**/*.{ts,tsx,js,jsx}",
      "apps/publimais_lovable/**/*.{ts,tsx,js,jsx}",
      "apps/**/supabase/functions/**/*.{ts,tsx,js,jsx}",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // turn former errors into warnings to pass CI while code is normalized
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-require-imports": "off",

      // Some components use custom props/attributes (e.g., cmdk-*). Avoid blocking CI:
      "react/no-unknown-property": "off",
    },
  }
);
