"use client";

import HTMLFlipBook from "react-pageflip";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minus,
  Plus,
  Share2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type PdfFlipbookProps = {
  pdfUrl: string;
  title: string;
  className?: string;
};

type BookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
};

type PdfPage = {
  pageNumber: number;
  image: string;
};

export default function PdfFlipbook({
  pdfUrl,
  title,
  className = "",
}: PdfFlipbookProps) {
  const bookRef = useRef<BookRef | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const [pages, setPages] = useState<PdfPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(0);

  const [zoom, setZoom] = useState(1);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [bookWidth, setBookWidth] = useState(460);
  const [bookHeight, setBookHeight] = useState(650);

  /* ============================================================
     RESPONSIVE BOOK SIZE
  ============================================================ */

  useEffect(() => {
    function updateSize() {
      const width = window.innerWidth;

      if (width < 480) {
        setBookWidth(280);
        setBookHeight(395);
      } else if (width < 640) {
        setBookWidth(320);
        setBookHeight(455);
      } else if (width < 768) {
        setBookWidth(350);
        setBookHeight(495);
      } else if (width < 1100) {
        setBookWidth(400);
        setBookHeight(565);
      } else {
        setBookWidth(460);
        setBookHeight(650);
      }
    }

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  /* ============================================================
     LOAD PDF
  ============================================================ */

  useEffect(() => {
    let cancelled = false;

    async function renderPdf() {
      if (!pdfUrl) {
        setError("No PDF has been attached.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setPages([]);
      setCurrentPage(0);
      setLoadingProgress(0);

      try {
        const pdfjs = await import("pdfjs-dist");

        pdfjs.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        const response = await fetch(pdfUrl);

        if (!response.ok) {
          throw new Error(
            `Unable to load PDF (${response.status}).`
          );
        }

        const buffer = await response.arrayBuffer();

        const pdf = await pdfjs
          .getDocument({
            data: new Uint8Array(buffer),
          })
          .promise;

        const renderedPages: PdfPage[] = [];

        for (
          let pageNumber = 1;
          pageNumber <= pdf.numPages;
          pageNumber++
        ) {
          if (cancelled) return;

          const page = await pdf.getPage(pageNumber);

          const viewport = page.getViewport({
            scale: 1.35,
          });

          const canvas = document.createElement("canvas");

          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error(
              "Could not initialise PDF rendering."
            );
          }

          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          await page.render({
            canvas,
            canvasContext: context,
            viewport,
          }).promise;

          renderedPages.push({
            pageNumber,
            image: canvas.toDataURL(
              "image/jpeg",
              0.9
            ),
          });

          setLoadingProgress(
            Math.round(
              (pageNumber / pdf.numPages) * 100
            )
          );
        }

        if (!cancelled) {
          setPages(renderedPages);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the booklet."
          );

          setLoading(false);
        }
      }
    }

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  /* ============================================================
     NAVIGATION
  ============================================================ */

  function goNext() {
    bookRef.current?.pageFlip()?.flipNext();
  }

  function goPrevious() {
    bookRef.current?.pageFlip()?.flipPrev();
  }

  function handleFlip(event: any) {
    if (
      typeof event?.data === "number"
    ) {
      setCurrentPage(event.data);
    }
  }

  /* ============================================================
     ZOOM
  ============================================================ */

  function increaseZoom() {
    setZoom((current) =>
      Math.min(
        1.4,
        Number((current + 0.1).toFixed(2))
      )
    );
  }

  function decreaseZoom() {
    setZoom((current) =>
      Math.max(
        0.75,
        Number((current - 0.1).toFixed(2))
      )
    );
  }

  function resetZoom() {
    setZoom(1);
  }

  /* ============================================================
     FULLSCREEN
  ============================================================ */

  async function toggleFullscreen() {
    if (!viewerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await viewerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    }

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange
      );
    };
  }, []);

  /* ============================================================
     SHARE
  ============================================================ */

  async function shareBooklet() {
    try {
      if (
        navigator.share &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title,
          text: title,
          url: window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      alert("Link copied.");
    } catch (error) {
      console.error(error);
    }
  }

  /* ============================================================
     DOWNLOAD
  ============================================================ */

  function downloadPdf() {
    const anchor =
      document.createElement("a");

    anchor.href = pdfUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.download = "";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div
        className={`rounded-[28px] border border-[#102A56]/10 bg-[#e9e6df] ${className}`}
      >
        <div className="flex min-h-[650px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102A56]">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#102A56]/45">
            Preparing publication
          </p>

          <h3 className="mt-3 text-xl font-semibold text-[#102A56]">
            Loading booklet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {loadingProgress}%
          </p>

          <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#102A56]/10">
            <div
              className="h-full bg-[#102A56] transition-all duration-300"
              style={{
                width: `${loadingProgress}%`,
              }}
            />
          </div>

        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error) {
    return (
      <div
        className={`rounded-[28px] border border-red-200 bg-white px-8 py-16 text-center ${className}`}
      >
        <RotateCcw className="mx-auto h-10 w-10 text-red-500" />

        <h3 className="mt-5 text-xl font-semibold text-[#102A56]">
          Booklet could not be loaded
        </h3>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      className={`overflow-hidden rounded-[28px] border border-[#102A56]/10 bg-[#e8e5de] ${className}`}
    >

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex items-center justify-between gap-4 border-b border-[#102A56]/10 bg-[#F8F6F1] px-4 py-3 sm:px-6">

        <div className="min-w-0">

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#102A56]/40">
            Apex Public School
          </p>

          <h3 className="truncate text-sm font-semibold text-[#102A56] sm:text-base">
            {title}
          </h3>

        </div>

        <div className="flex items-center gap-1">

          <button
            type="button"
            onClick={shareBooklet}
            title="Share"
            className="grid h-9 w-9 place-items-center rounded-lg text-[#102A56]/65 hover:bg-[#102A56]/8"
          >
            <Share2 size={16} />
          </button>

          <button
            type="button"
            onClick={downloadPdf}
            title="Download"
            className="grid h-9 w-9 place-items-center rounded-lg text-[#102A56]/65 hover:bg-[#102A56]/8"
          >
            <Download size={16} />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title="Fullscreen"
            className="grid h-9 w-9 place-items-center rounded-lg bg-[#102A56] text-white hover:bg-[#173c74]"
          >
            <Maximize2 size={16} />
          </button>

        </div>
      </div>

      {/* ========================================================
          BOOK
      ======================================================== */}

      <div className="relative flex min-h-[520px] items-center justify-center overflow-auto bg-[radial-gradient(circle_at_center,#ffffff_0%,#e4e1da_70%)] px-2 py-10 sm:min-h-[720px]">

        {/* Previous */}
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentPage <= 0}
          aria-label="Previous page"
          className="absolute left-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#102A56]/10 bg-white/95 text-[#102A56] shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-25 sm:left-5"
        >
          <ChevronLeft size={21} />
        </button>

        {/* Book */}
        <div
          className="relative z-10"
          style={{
            transform: `scale(${zoom})`,
            transition:
              "transform 250ms ease",
          }}
        >
          <HTMLFlipBook
            ref={bookRef as any}
            width={bookWidth}
            height={bookHeight}
            size="fixed"
            minWidth={260}
            maxWidth={500}
            minHeight={370}
            maxHeight={720}
            drawShadow
            flippingTime={800}
            usePortrait
            startPage={0}
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.5}
            showCover
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={25}
            showPageCorners
            disableFlipByClick={false}
            onFlip={handleFlip}
            className="mx-auto"
            style={{
              margin: "0 auto",
            }}
          >
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="relative h-full w-full overflow-hidden bg-white"
              >
                <img
                  src={page.image}
                  alt={`${title} page ${page.pageNumber}`}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={goNext}
          disabled={
            currentPage >= pages.length - 1
          }
          aria-label="Next page"
          className="absolute right-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#102A56]/10 bg-white/95 text-[#102A56] shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-25 sm:right-5"
        >
          <ChevronRight size={21} />
        </button>

      </div>

      {/* ========================================================
          TOOLBAR
      ======================================================== */}

      <div className="border-t border-[#102A56]/10 bg-[#F8F6F1] px-3 py-3 sm:px-5">

        <div className="flex flex-wrap items-center justify-center gap-1.5">

          <button
            type="button"
            onClick={decreaseZoom}
            disabled={zoom <= 0.75}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#102A56]/10 bg-white text-[#102A56] hover:bg-[#102A56]/5 disabled:opacity-30"
            title="Zoom out"
          >
            <Minus size={15} />
          </button>

          <button
            type="button"
            onClick={resetZoom}
            className="min-w-[58px] rounded-lg border border-[#102A56]/10 bg-white px-2 py-2 text-xs font-semibold text-[#102A56]"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={increaseZoom}
            disabled={zoom >= 1.4}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#102A56]/10 bg-white text-[#102A56] hover:bg-[#102A56]/5 disabled:opacity-30"
            title="Zoom in"
          >
            <Plus size={15} />
          </button>

          <span className="mx-1 hidden h-5 w-px bg-[#102A56]/10 sm:block" />

          <button
            type="button"
            onClick={goPrevious}
            disabled={currentPage <= 0}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#102A56]/10 bg-white text-[#102A56] hover:bg-[#102A56]/5 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="rounded-lg bg-[#102A56] px-4 py-2 text-xs font-semibold text-white">
            {Math.min(
              currentPage + 1,
              pages.length
            )}{" "}
            / {pages.length}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={
              currentPage >= pages.length - 1
            }
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#102A56]/10 bg-white text-[#102A56] hover:bg-[#102A56]/5 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>

          <span className="mx-1 hidden h-5 w-px bg-[#102A56]/10 sm:block" />

          <button
            type="button"
            onClick={shareBooklet}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#102A56]/10 bg-white text-[#102A56] hover:bg-[#102A56]/5"
            title="Share"
          >
            <Share2 size={15} />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#102A56]/10 bg-white text-[#102A56] hover:bg-[#102A56]/5"
            title="Fullscreen"
          >
            <Maximize2 size={15} />
          </button>

          <button
            type="button"
            onClick={downloadPdf}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#102A56] px-3 text-xs font-semibold text-white hover:bg-[#173c74]"
          >
            <Download size={14} />
            <span className="hidden sm:inline">
              Download
            </span>
          </button>

        </div>
      </div>

      {/* ========================================================
          HINT
      ======================================================== */}

      <div className="border-t border-[#102A56]/10 bg-white px-4 py-3 text-center">

        <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#102A56]/35">
          Drag, swipe or use the arrows to turn pages
        </p>

      </div>

    </div>
  );
}