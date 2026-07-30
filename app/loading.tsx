import { PiluLogo } from "@/components/branding/logo";

/** Branded loading state used while Pilu prepares the app shell. */
export default function Loading() {
  return <main className="pilu-loading-screen"><PiluLogo size="large" priority /><p>Your baby&apos;s AI companion</p></main>;
}
