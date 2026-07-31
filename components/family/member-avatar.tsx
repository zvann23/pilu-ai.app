export function MemberAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return <div className={`member-avatar member-avatar--${size}`} aria-hidden="true">{initial}</div>;
}
