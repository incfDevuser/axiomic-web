import { Home } from "@/components/pages/Home";
import { homeMeta, pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("en", "home", homeMeta.en.title, homeMeta.en.description);

export default function Page() {
  return <Home lang="en" />;
}
