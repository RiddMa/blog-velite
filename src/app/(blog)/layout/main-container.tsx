import React from "react";

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MainContainer: React.FC<MainContainerProps> = ({ children, className }) => {
  return <div className={`${className}`}>{children}</div>;
};

export default MainContainer;
