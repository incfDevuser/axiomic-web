import { LegalPage, legalMeta } from "@/components/pages/Legal";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("en", "privacy", legalMeta.privacy.en.title, legalMeta.privacy.en.description);

export default function Page() {
  return <LegalPage lang="en" doc="privacy" />;
}
