// pages/about.js
import React from "react";
import RootLayout from "@/app/layout";
import DarkModeToggleClient from "@/app/layout/components/dark-mode-toggle.client";

function About() {
  return (
    <>
      <DarkModeToggleClient />
      <div>
        <h1>About Us</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
          risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
          ultricies sed, dolor.
        </p>
      </div>
    </>
  );
}

export default About;
