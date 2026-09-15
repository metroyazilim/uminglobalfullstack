import Link from "next/link";
import ArrowRightIcon from "../icons/ArrowRightIcon";

// The site's only call-to-action element. Variants cover the three surfaces a CTA sits on
// (white, dark, photo), sizes map to the spacing scale, and hover/focus states live here once.
// Corners are 6px: the hard 90-degree blocks the template shipped with read as unfinished.
type Variant = "primary" | "outlineDark" | "outlineLight";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "border-accent bg-accent text-white hover:border-brand-hover hover:bg-brand-hover",
  outlineDark: "border-ink/20 text-ink hover:border-accent hover:bg-accent hover:text-white",
  outlineLight: "border-white/40 text-white hover:border-white hover:bg-white/10",
};

const SIZES: Record<Size, string> = {
  md: "px-6 py-3.5 text-[14px]",
  lg: "px-7 py-4 text-[15px]",
};

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  withArrow = true,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 rounded-control border-2 font-semibold leading-[20px] transition-colors duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
      {withArrow && <ArrowRightIcon className= "h-[15px] w-[15px]" />}
    </Link>
  );
}
