"use client";

export default function DemoMobileFix() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          html,
          body {
            max-width: 100%;
            overflow-x: hidden !important;
          }

          body {
            width: 100%;
          }

          img {
            max-width: 100%;
          }

          @media (max-width: 900px) {

            main {
              width: 100% !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
            }

            main section {
              max-width: 100% !important;
              overflow-x: hidden !important;
            }

            main img {
              max-width: 100% !important;
            }

            main h1,
            main h2,
            main h3,
            main p,
            main a {
              overflow-wrap: break-word;
            }

            main .cutout,
            main .clip,
            main .clip-left,
            main .clip-right,
            main .clip-small-left,
            main .clip-small-right {
              display: none !important;
            }

          }

          @media (max-width: 768px) {

            main {
              width: 100vw !important;
              max-width: 100vw !important;
            }

            main section {
              width: 100% !important;
            }

            main section > div {
              max-width: 100% !important;
            }

            main .grid {
              grid-template-columns: 1fr !important;
            }

            main [class*="grid-cols-2"],
            main [class*="grid-cols-3"],
            main [class*="grid-cols-4"],
            main [class*="grid-cols-5"],
            main [class*="grid-cols-6"] {
              grid-template-columns: 1fr !important;
            }

            main [class*="flex-row"] {
              flex-direction: column !important;
            }

            main [class*="lg:grid-cols-"] {
              grid-template-columns: 1fr !important;
            }

            main [class*="md:grid-cols-"] {
              grid-template-columns: 1fr !important;
            }

            main [class*="lg:flex-row"] {
              flex-direction: column !important;
            }

            main [class*="md:flex-row"] {
              flex-direction: column !important;
            }

            main [class*="border-r"] {
              border-right: 0 !important;
            }

            main h1 {
              font-size: clamp(48px, 15vw, 82px) !important;
              line-height: 0.88 !important;
            }

            main h2 {
              font-size: clamp(40px, 12vw, 68px) !important;
              line-height: 0.9 !important;
            }

            main h3 {
              font-size: clamp(24px, 7vw, 34px) !important;
            }

            main p {
              max-width: 100% !important;
            }

            main a {
              max-width: 100% !important;
              white-space: normal !important;
            }

            main section:first-of-type {
              min-height: auto !important;
            }

            main section:first-of-type > div {
              min-height: auto !important;
            }

            main [class*="h-[600px]"],
            main [class*="h-[580px]"],
            main [class*="h-[560px]"],
            main [class*="h-[540px]"],
            main [class*="h-[520px]"],
            main [class*="h-[500px]"],
            main [class*="h-[480px]"],
            main [class*="h-[460px]"],
            main [class*="h-[450px]"] {
              height: 320px !important;
            }

            main [class*="h-[430px]"],
            main [class*="h-[420px]"],
            main [class*="h-[410px]"],
            main [class*="h-[400px]"] {
              height: 290px !important;
            }

            main img {
              width: 100% !important;
              max-width: 100% !important;
              object-fit: cover;
            }

            main table {
              display: block !important;
              max-width: 100% !important;
              overflow-x: auto !important;
            }

          }

          @media (max-width: 480px) {

            main {
              width: 100vw !important;
              overflow-x: hidden !important;
            }

            main section > div {
              padding-left: 15px !important;
              padding-right: 15px !important;
            }

            main h1 {
              font-size: clamp(42px, 15vw, 65px) !important;
            }

            main h2 {
              font-size: clamp(37px, 12vw, 56px) !important;
            }

            main h3 {
              font-size: 24px !important;
            }

            main [class*="py-20"],
            main [class*="py-24"] {
              padding-top: 48px !important;
              padding-bottom: 48px !important;
            }

            main [class*="h-[600px]"],
            main [class*="h-[580px]"],
            main [class*="h-[560px]"],
            main [class*="h-[540px]"],
            main [class*="h-[520px]"],
            main [class*="h-[500px]"],
            main [class*="h-[480px]"],
            main [class*="h-[460px]"],
            main [class*="h-[450px]"],
            main [class*="h-[430px]"],
            main [class*="h-[420px]"],
            main [class*="h-[410px]"],
            main [class*="h-[400px]"] {
              height: 250px !important;
            }

            main .cutout,
            main .clip,
            main .clip-left,
            main .clip-right,
            main .clip-small-left,
            main .clip-small-right {
              display: none !important;
            }

          }

          @media (max-width: 360px) {

            main section > div {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }

            main h1 {
              font-size: 43px !important;
            }

            main h2 {
              font-size: 38px !important;
            }

          }
        `,
      }}
    />
  );
}
