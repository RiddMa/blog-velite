import React from "react";

interface RightNavbarProps {
  children?: React.ReactNode;
}

const RightNavbar: React.FC<RightNavbarProps> = ({ children }) => {
  return (
    <div className="side-navbar bg-green-800 text-white">
      <h2>Right Navbar</h2>
      {children}
    </div>
  );
};

export default RightNavbar;
