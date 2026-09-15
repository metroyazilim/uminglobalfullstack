// Flat config. `next lint` no longer exists in Next 16, so the gate is the ESLint CLI:
// `npm run lint`. Only Next's own presets are enabled - core-web-vitals adds the rules that
// catch the mistakes that actually cost ranking (missing alt text, sync scripts, bad <head> use).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
