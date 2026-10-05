"use client";

import HeritageHeader from "@/components/demo/heritage/HeritageHeader";
import HeritageFooter from "@/components/demo/heritage/HeritageFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#551B2A]">
      <HeritageHeader />

      <section className="bg-[#551B2A] !text-[#F7F1E8] px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.35em] text-[#C5A15B]">
            CONTACT
          </p>

          <h1 className="mt-5 max-w-4xl font-serif text-6xl md:text-8xl">
            Let's connect.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A15B]">
            VISIT APEX
          </p>

          <h2 className="mt-5 font-serif text-5xl">
            We would love to
            <br />
            hear from you.
          </h2>

          <div className="mt-12 space-y-7 text-sm leading-7 text-slate-600">
            <div>
              <strong className="text-[#551B2A]">Address</strong>
              <p>Apex Public School, New Delhi, India</p>
            </div>

            <div>
              <strong className="text-[#551B2A]">Email</strong>
              <p>info@apexpublicschool.edu.in</p>
            </div>

            <div>
              <strong className="text-[#551B2A]">Phone</strong>
              <p>+91 11 0000 0000</p>
            </div>
          </div>
        </div>

        <form className="border border-[#551B2A]/15 bg-[#EDE2D0] p-7 sm:p-10">
          <h2 className="font-serif text-3xl">Send an enquiry</h2>

          <div className="mt-8 space-y-5">
            <input
              className="w-full border-b border-[#551B2A]/20 bg-transparent px-1 py-4 outline-none placeholder:text-slate-400"
              placeholder="Your name"
            />

            <input
              type="email"
              className="w-full border-b border-[#551B2A]/20 bg-transparent px-1 py-4 outline-none placeholder:text-slate-400"
              placeholder="Email address"
            />

            <input
              className="w-full border-b border-[#551B2A]/20 bg-transparent px-1 py-4 outline-none placeholder:text-slate-400"
              placeholder="Phone number"
            />

            <textarea
              rows={5}
              className="w-full resize-none border-b border-[#551B2A]/20 bg-transparent px-1 py-4 outline-none placeholder:text-slate-400"
              placeholder="How can we help?"
            />

            <button
              type="button"
              className="w-full bg-[#551B2A] !text-[#F7F1E8] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#C5A15B] !text-[#F7F1E8]"
            >
              Send Enquiry
            </button>
          </div>
        </form>
      </section>

      <HeritageFooter />
    </main>
  );
}


