"use client";

import { useEffect } from "react";

export default function GlobalMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      return;
    }

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
      /*
       * Never animate floating/static UI.
       */
      if (
        element.closest("[data-static-motion]") ||
        element.closest("[data-floating-action]")
      ) {
        return false;
      }

      const style = window.getComputedStyle(element);

      /*
       * Decorative positioned elements should stay untouched.
       */
      if (
        style.position === "absolute" ||
        style.position === "fixed"
      ) {
        return false;
      }

      return true;
    });

    /*
     * Add animation classes.
     */
    elements.forEach((element, index) => {
      element.classList.add("apex-auto-motion");

      const delay = Math.min(index % 6, 5) * 70;

      element.style.setProperty(
        "--apex-motion-delay",
        `${delay}ms`
      );
    });

    /*
     * Reveal elements when they enter the viewport.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;

          element.classList.add("apex-auto-visible");

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px",
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

    /*
     * Initial mouse position.
     */
    document.documentElement.style.setProperty(
      "--apex-mx",
      `${window.innerWidth / 2}px`
    );

    document.documentElement.style.setProperty(
      "--apex-my",
      `${window.innerHeight / 2}px`
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
      {/* Mouse-following ambient glow */}
      <div
        className="apex-motion-light"
        aria-hidden="true"
      />

      {/* Very subtle background grid */}
      <div
        className="apex-motion-grid"
        aria-hidden="true"
      />
    </>
  );
}