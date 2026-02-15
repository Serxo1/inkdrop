import Image from "next/image";

interface InkdropLogoProps {
  size?: number;
  className?: string;
}

export function InkdropLogo({ size = 28, className }: InkdropLogoProps) {
  return (
    <Image
      src="/my-icon.svg"
      alt="Inkdrop"
      width={size}
      height={size}
      className={className}
    />
  );
}
