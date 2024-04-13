import React from "react";

interface LeftNavbarProps {
  children?: React.ReactNode;
}

const LeftNavbar: React.FC<LeftNavbarProps> = ({ children }) => {
  return (
    <div className="side-navbar bg-blue-800 text-white justify-start">
      <h2>Left Navbar</h2>
      {children}
    </div>
  );
};

export default LeftNavbar;
