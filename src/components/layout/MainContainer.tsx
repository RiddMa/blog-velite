import React from "react";
import { clsname } from "@/src/util/clsname";

interface MainContainerProps {
  children?: React.ReactNode;
  className?: string;
}

const MainContainer: React.FC<MainContainerProps> = ({ children, className }) => {
  return <main className={clsname("main-container", className)}>{children}</main>;
};

export default MainContainer;
