"use client";

import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

const images = [
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1000&q=85",
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      <section className="bg-[#551B2A] !text-[#F7F1E8] px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.35em] text-[#C5A15B]">
            GALLERY
          </p>
          <h1 className="mt-5 font-serif text-6xl md:text-8xl">
            Life at Apex.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image}
              className={`overflow-hidden ${
                index === 1 || index === 4 ? "md:translate-y-12" : ""
              }`}
            >
              <img
                src={image}
                alt={`Apex gallery ${index + 1}`}
                className="h-[360px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      <HeritageFooter />
    </main>
  );
}


