import React from "react";

interface RightNavbarProps {
  children?: React.ReactNode;
  className?: string;
}

const RightNavbar: React.FC<RightNavbarProps> = ({ children, className }) => {
  return <div className={`side-navbar justify-start ${className}`}>{children}</div>;
};

export default RightNavbar;
