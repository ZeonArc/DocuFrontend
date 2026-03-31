import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatMakesUsDifferent from "@/components/WhatMakesUsDifferent";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      <ScrollManager />
      <Header />
      <Hero />
      <WhatMakesUsDifferent />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
