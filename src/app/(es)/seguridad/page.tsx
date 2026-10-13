import { LegalPage, legalMeta } from "@/components/pages/Legal";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("es", "security", legalMeta.security.es.title, legalMeta.security.es.description);

export default function Page() {
  return <LegalPage lang="es" doc="security" />;
}
