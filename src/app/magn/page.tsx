// pages/EmptyPage.tsx

import { NextPage } from "next";
import Head from "next/head";

const EmptyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Empty Page</title>
        <meta name="description" content="This is an empty page" />
      </Head>
      <div>
        <h1>Welcome to the Empty Page</h1>
        <p>This is an example of an empty page component in Next.js 14.</p>
      </div>
    </>
  );
};

export default EmptyPage;
