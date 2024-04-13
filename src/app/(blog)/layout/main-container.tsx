import React from "react";

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MainContainer: React.FC<MainContainerProps> = ({ children, className }) => {
  return (
    <div className={`flex-grow ${className}`}>
      <span>this is the main container</span>
      {children}
    </div>
  );
};

export default MainContainer;
