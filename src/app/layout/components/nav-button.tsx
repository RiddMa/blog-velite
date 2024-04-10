import React from "react";

interface NavButtonProps {
  onClick: () => void; // 假设 onClick 没有参数并且没有返回值
  icon: React.ElementType; // icon 是一个React组件
  ariaLabel: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  icon: Icon,
  ariaLabel,
}) => {
  return (
    <button onClick={onClick} aria-label={ariaLabel} className="nav-button">
      <Icon />
    </button>
  );
};

export default NavButton;
