import Link from "next/link";

type BackNavProps = {
  href: string;
  label: string;
};

export function BackNav({ href, label }: BackNavProps) {
  return (
    <nav className="back-nav">
      <Link href={href} className="back-nav-link">
        <i className="bx bx-chevron-left"></i>
        <span>{label}</span>
      </Link>
    </nav>
  );
}
