import { ogImage, ogSize } from "@/lib/og";

export const alt = "Axiomic · Financial infrastructure for AI agents";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return ogImage("en");
}
