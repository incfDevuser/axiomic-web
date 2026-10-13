import { Home } from "@/components/pages/Home";
import { homeMeta, pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("es", "home", homeMeta.es.title, homeMeta.es.description);

export default function Page() {
  return <Home lang="es" />;
}
