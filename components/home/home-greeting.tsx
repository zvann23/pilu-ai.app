import { baby } from "@/lib/home-data";

export function HomeGreeting() {
  return (
    <header className="home-greeting">
      <div>
        <p>Good morning,</p>
        <h1>{baby.name}</h1>
        <span>{baby.age}</span>
      </div>
      <div className="home-greeting__avatar" aria-label={`${baby.name}'s avatar`}>{baby.initial}</div>
    </header>
  );
}
