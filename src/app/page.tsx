import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Academics from "@/components/home/Academics";
import Campus from "@/components/home/Campus";
import NewsEvents from "@/components/home/NewsEvents";
import GalleryPreview from "@/components/home/GalleryPreview";
import AdmissionsCTA from "@/components/home/AdmissionsCTA";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Intro />
        <Academics />
        <Campus />
        <NewsEvents />
        <GalleryPreview />
        <AdmissionsCTA />
        <Contact />
      </main>

      <Footer />
       <div id="site-end" />
    </>
  );
}