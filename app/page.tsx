import Landing from "../components/landing/Landing";
import { STYLE_TOKENS } from "../components/landing/styles";

// Shani chose the Cinematic Dark flagship as the main site (was /v1).
// /v1, /v2, /v3 remain live for side-by-side comparison.
export default function Home() {
  return <Landing t={STYLE_TOKENS.cinematic} />;
}
