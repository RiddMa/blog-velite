"use client";

import React from "react";
import { Pagination, PaginationItemType, PaginationItemRenderProps } from "@nextui-org/pagination";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { Icon } from "@iconify-icon/react";
import { cn } from "@nextui-org/system";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

interface IPaginationProps {
  pageNumber: number;
  totalPages: number;
  baseUrl: string;
}

const MyPagination: React.FC<IPaginationProps> = ({ pageNumber, totalPages, baseUrl }) => {
  // const renderItem = ({
  //   ref,
  //   key,
  //   value,
  //   isActive,
  //   activePage,
  //   onNext,
  //   onPrevious,
  //   setPage,
  //   className,
  // }: PaginationItemRenderProps) => {
  //   if (value === PaginationItemType.NEXT) {
  //     if (activePage === totalPages) {
  //       return (
  //         <Button
  //           isDisabled={true}
  //           key={key}
  //           isIconOnly={true}
  //           className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
  //         >
  //           <Icon icon={"heroicons:chevron-right"} />
  //         </Button>
  //       );
  //     }
  //     return (
  //       <Link href={`${baseUrl}/${activePage + 1}`} key={key} onClick={onNext}>
  //         <Button isIconOnly={true} className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}>
  //           <Icon icon={"heroicons:chevron-right"} />
  //         </Button>
  //       </Link>
  //     );
  //   }
  //
  //   if (value === PaginationItemType.PREV) {
  //     if (activePage === 1) {
  //       return (
  //         <Button
  //           isDisabled={true}
  //           key={key}
  //           isIconOnly={true}
  //           className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
  //         >
  //           <Icon icon={"heroicons:chevron-left"} />
  //         </Button>
  //       );
  //     }
  //     return (
  //       <Link href={`${baseUrl}/${activePage - 1}`} key={key} onClick={onPrevious}>
  //         <Button isIconOnly={true} className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}>
  //           <Icon icon={"heroicons:chevron-left"} />
  //         </Button>
  //       </Link>
  //     );
  //   }
  //
  //   if (value === PaginationItemType.DOTS) {
  //     return (
  //       <button key={key} className={className}>
  //         ...
  //       </button>
  //     );
  //   }
  //
  //   // cursor is the default item
  //   return (
  //     <Link href={`${baseUrl}/${value}`} ref={ref} key={key} onClick={() => setPage(value)}>
  //       <Button
  //         className={cn(className, isActive && "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold")}
  //       >
  //         {value}
  //       </Button>
  //     </Link>
  //   );
  // };
  //
  // return (
  //   <Pagination
  //     disableCursorAnimation
  //     showControls
  //     total={totalPages}
  //     initialPage={pageNumber}
  //     className="gap-2"
  //     radius="full"
  //     renderItem={renderItem}
  //     variant="flat"
  //   />
  // );
  const router = useRouter();

  return (
    <Pagination
      total={totalPages}
      initialPage={pageNumber}
      page={pageNumber}
      variant="flat"
      showControls
      showShadow
      onChange={(page) => router.push(`${baseUrl}/${page}`)}
      className={`p-0 m-0`}
    />
  );
};

export default MyPagination;
