import { Methodology } from "@/components/pages/Methodology";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "es",
  "methodology",
  "Metodología · Axiomic",
  "Cómo mide Axiomic lo que arriesga un agente de IA que mueve dinero: mediciones preregistradas, episodios reproducibles y riesgo en pesos.",
);

export default function Page() {
  return <Methodology lang="es" />;
}
