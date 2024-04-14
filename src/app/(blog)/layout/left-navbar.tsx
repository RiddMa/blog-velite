import React from "react";

interface LeftNavbarProps {
  children?: React.ReactNode;
  className?: string;
}

const LeftNavbar: React.FC<LeftNavbarProps> = ({ children, className }) => {
  return <div className={`side-navbar text-right ${className}`}>{children}</div>;
};

export default LeftNavbar;
