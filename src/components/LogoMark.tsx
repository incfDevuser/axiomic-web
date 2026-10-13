import Image from "next/image";

const SRC = "/brand/axiomic-mark.png";

export function LogoMark({ className = "", mono = false }: { className?: string; mono?: boolean }) {
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
  return <Image src={SRC} alt="" aria-hidden width={512} height={512} className={`shrink-0 object-contain ${className}`} />;
}
