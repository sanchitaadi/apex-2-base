"use client";

import { useEffect } from "react";

export default function GlobalMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const selectors = [
      "main > section",
      "main > section > div",
      "main > section article",
      "main > section h1",
      "main > section h2",
      "main > section h3",
      "main > section p",
      "main > section a",
      "main > section button",
      "main > section img",
      "footer",
    ];

    const elements = Array.from(
      new Set(
        selectors.flatMap((selector) =>
          Array.from(
            document.querySelectorAll<HTMLElement>(selector)
          )
        )
      )
    ).filter((element) => {
      // Don't interfere with the floating buttons
      if (element.closest("[data-static-motion]")) {
        return false;
      }

      // Don't animate absolutely positioned decorative elements
      const style = window.getComputedStyle(element);

      if (style.position === "absolute") {
        return false;
      }

      return true;
    });

    elements.forEach((element, index) => {
      element.classList.add("apex-auto-motion");

      /*
       * Stagger animation.
       * Nearby elements appear one after another.
       */
      const delay = Math.min(index % 6, 5) * 70;

      element.style.setProperty(
        "--apex-motion-delay",
        `${delay}ms`
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("apex-auto-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    /*
     * Mouse-following ambient light.
     */
    const handlePointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty(
        "--apex-mx",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--apex-my",
        `${event.clientY}px`
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  return (
    <>
      <div
        className="apex-motion-light"
        aria-hidden="true"
      />

      <div
        className="apex-motion-grid"
        aria-hidden="true"
      />
    </>
  );
}