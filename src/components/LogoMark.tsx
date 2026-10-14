import Image from "next/image";

const SRC = "/brand/axiomic-mark.png";
// Same mark with the dark navy ends turned silver, for use straight on dark backgrounds.
const SRC_DARK = "/brand/axiomic-mark-dark.png";

export function LogoMark({ className = "", mono = false, onDark = false }: { className?: string; mono?: boolean; onDark?: boolean }) {
  if (mono) {
    const mask = { maskImage: `url(${SRC})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" } as const;
    return (
      <span
        aria-hidden
        className={`inline-block shrink-0 bg-current ${className}`}
        style={{ ...mask, WebkitMaskImage: mask.maskImage, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center" }}
      />
    );
  }
  return <Image src={onDark ? SRC_DARK : SRC} alt="" aria-hidden width={512} height={512} className={`shrink-0 object-contain ${className}`} />;
}
