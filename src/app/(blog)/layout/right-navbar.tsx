import React from "react";

interface RightNavbarProps {
  children?: React.ReactNode;
}

const RightNavbar: React.FC<RightNavbarProps> = ({ children }) => {
  return (
    <div className="h-screen sticky top-0 overflow-y-auto overflow-x-hidden">
      <div className="bg-green-800 text-white p-4">
        <h2>Right Navbar</h2>
        {children}
      </div>
    </div>
  );
};

export default RightNavbar;
