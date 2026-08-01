/** Replaces `{key}` placeholders, e.g. format("{name} said hi", { name: "Ana" }). Safe for both server and client code. */
export function format(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
