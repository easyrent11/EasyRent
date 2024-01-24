import React from "react";
import FirstSection from "../components/FirstSection";
import SectionThree from "../components/SectionThree";
import "../index.css"; // Import the global CSS file

export default function HomeLayout() {
  return (
    <>
      <FirstSection />
      <SectionThree />
    </>
  );
}
