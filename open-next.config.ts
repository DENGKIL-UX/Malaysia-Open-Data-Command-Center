// open-next.config.ts — OpenNext Cloudflare adapter configuration
// https://opennext.js.org/cloudflare/get-started
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  cloudflare: {
    useWorkerdCondition: true,
  },
});
