import React from "react";

interface MobileNavMenuProps {
  isOpen: boolean;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen }) => {
  return (
    <div className={`mobile-nav-menu ${isOpen ? "open" : "closed"}`}>
      {/* NavList 或其他导航内容 */}
    </div>
  );
};

export default MobileNavMenu;
