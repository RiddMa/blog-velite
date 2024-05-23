import { Link } from "@/src/components/transition/react-transition-progress/next";
import React from "react";

const MyLink: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({
  href,
  children,
  className,
}) => {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default MyLink;
