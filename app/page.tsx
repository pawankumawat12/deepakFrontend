import React from "react";
import Hero from "../components/Hero";
import PopularPreview from "../components/PopularPreview";
import HomeProductsStrip from "../components/HomeProductsStrip";

const page = () => {
  return (
    <main>
      <Hero />
      <PopularPreview />
      <HomeProductsStrip />
    </main>
  );
};

export default page;