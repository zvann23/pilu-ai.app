const fallbackSiteUrl = "http://localhost:3000";
export function siteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, ""); }
export function safeNext(value: string | null | undefined) { return value?.startsWith("/") && !value.startsWith("//") ? value : "/home"; }
