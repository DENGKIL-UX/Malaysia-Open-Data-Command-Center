// open-next.config.ts — OpenNext Cloudflare adapter configuration
// https://opennext.js.org/cloudflare/get-started
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Sharp is a native Node.js addon — cannot be bundled for Cloudflare Workers.
  // Mark it as an edge external so esbuild won't try to resolve it.
  cloudflare: {
    useWorkerdCondition: true,
  },
});
