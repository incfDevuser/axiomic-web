import { LegalPage, legalMeta } from "@/components/pages/Legal";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("es", "privacy", legalMeta.privacy.es.title, legalMeta.privacy.es.description);

export default function Page() {
  return <LegalPage lang="es" doc="privacy" />;
}
