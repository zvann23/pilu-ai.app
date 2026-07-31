import type { PushProvider } from "./types";

/** Used whenever no push provider is configured — every call is a safe no-op. */
export const noopPushProvider: PushProvider = {
  name: "none",
  isConfigured: () => false,
  register: async () => null,
  unregister: async () => undefined,
};
