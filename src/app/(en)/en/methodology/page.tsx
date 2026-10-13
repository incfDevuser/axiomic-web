import { Methodology } from "@/components/pages/Methodology";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "en",
  "methodology",
  "Methodology · Axiomic",
  "How Axiomic measures what an AI agent that moves money puts at risk: pre-registered measurements, replayable episodes and risk in pesos.",
);

export default function Page() {
  return <Methodology lang="en" />;
}
