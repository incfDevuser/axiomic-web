import { LegalPage, legalMeta } from "@/components/pages/Legal";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("en", "security", legalMeta.security.en.title, legalMeta.security.en.description);

export default function Page() {
  return <LegalPage lang="en" doc="security" />;
}
