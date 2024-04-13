import React from "react";

interface LeftNavbarProps {
  children?: React.ReactNode;
}

const LeftNavbar: React.FC<LeftNavbarProps> = ({ children }) => {
  return (
    <div className="side-navbar">
      <div className="bg-blue-800 text-white p-4">
        <h2>Left Navbar</h2>
        {children}
      </div>
    </div>
  );
};

export default LeftNavbar;
