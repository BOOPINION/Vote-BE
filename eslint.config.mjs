import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "./eslint.formatting.mjs";

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    stylistic
];
