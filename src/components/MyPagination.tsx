"use client";

import React from "react";
import { Pagination } from "@nextui-org/pagination";

interface IPaginationProps {
  pageNumber: number;
  totalPages: number;
}

const MyPagination: React.FC<IPaginationProps> = ({ pageNumber, totalPages }) => {
  return <Pagination showControls total={totalPages} initialPage={pageNumber} />;
  // return <></>;
};

export default MyPagination;
