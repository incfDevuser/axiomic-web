import { ogImage, ogSize } from "@/lib/og";

export const alt = "Axiomic · La infraestructura financiera para agentes de IA";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return ogImage("es");
}
