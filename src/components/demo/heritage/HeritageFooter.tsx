import Link from "next/link";

export default function HeritageFooter() {
  return (
    <footer className="bg-[#21191A] !text-[#F7F1E8] text-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A15B] font-serif text-xl font-bold text-[#C5A15B]">
                A
              </div>

              <div>
                <div className="font-serif text-2xl font-bold">
                  APEX
                </div>
                <div className="text-[9px] tracking-[0.3em] text-white/50">
                  PUBLIC SCHOOL
                </div>
              </div>
            </div>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/55">
              Inspiring young minds through knowledge, character, creativity
              and leadership. Building foundations for a lifetime of learning.
            </p>

            <div className="mt-8 inline-flex border border-[#C5A15B]/40 px-5 py-3 text-xs tracking-[0.2em] text-[#C5A15B]">
              LEARN • LEAD • EXCEL
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.25em] text-[#C5A15B]">
              EXPLORE
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/60">
              <Link href="/demo/heritage/about" className="hover:text-white">
                About Apex
              </Link>
              <Link href="/demo/heritage/academics" className="hover:text-white">
                Academics
              </Link>
              <Link href="/demo/heritage/campus" className="hover:text-white">
                Our Campus
              </Link>
              <Link href="/demo/heritage/gallery" className="hover:text-white">
                Gallery
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.25em] text-[#C5A15B]">
              QUICK LINKS
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/60">
              <Link href="/demo/heritage/admissions" className="hover:text-white">
                Admissions
              </Link>
              <Link href="/demo/heritage/notices" className="hover:text-white">
                Notices
              </Link>
              <Link href="/demo/heritage/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/demo" className="hover:text-white">
                Other Designs
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.25em] text-[#C5A15B]">
              VISIT APEX
            </h3>

            <p className="mt-6 text-sm leading-7 text-white/60">
              Apex Public School
              <br />
              New Delhi, India
            </p>

            <p className="mt-5 text-sm text-white/60">
              Email: info@apexpublicschool.edu.in
            </p>

            <Link
              href="/demo/heritage/contact"
              className="mt-7 inline-flex border-b border-[#C5A15B] pb-2 text-sm text-[#C5A15B]"
            >
              Plan your visit →
            </Link>
          </div>

        </div>

        <div className="mt-16 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex sm:items-center sm:justify-between">
          <p>© 2026 Apex Public School. All rights reserved.</p>
          <p className="mt-3 sm:mt-0">
            Heritage Design Concept
          </p>
        </div>
      </div>
    </footer>
  );
}


