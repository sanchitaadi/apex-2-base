import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Academics from "@/components/home/Academics";
import Campus from "@/components/home/Campus";
import GalleryPreview from "@/components/home/GalleryPreview";
import AdmissionsCTA from "@/components/home/AdmissionsCTA";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Intro />
        <Academics />
        <Campus />
        <GalleryPreview />
        <AdmissionsCTA />
        <Contact />
      </main>

      <div id="site-end" />
    </>
  );
}