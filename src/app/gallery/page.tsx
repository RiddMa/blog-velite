// pages/EmptyPage.tsx

import { NextPage } from "next";
import WaterfallGrid from "@/src/components/WaterfallGrid";

const EmptyPage: NextPage = () => {
  return (
    <>
      {/*<WaterfallGrid items={} CardComponent={}/>*/}
      <div>
        <h1>Welcome to the Empty Page</h1>
        <p>This is an example of an empty page component in Next.js 14.</p>
      </div>
    </>
  );
};

export default EmptyPage;
