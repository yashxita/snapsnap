"use client";
import React, { useState, useRef, useEffect } from "react";
import LayoutA from "./LayoutA";
import LayoutB from "./LayoutB";
import LayoutC from "./LayoutC";
import Image from "next/image";
import DownloadLayout from "./DownloadLayout";

const layouts = [
  { name: "Layout A", requiredImages: 6, component: LayoutA },
  { name: "Layout B", requiredImages: 4, component: LayoutB },
  { name: "Layout C", requiredImages: 4, component: LayoutC },
];

const filters = [
  { name: "None", css: "none", className: "" },
  { name: "Grayscale", css: "grayscale(100%)", className: "grayscale" },
  { name: "Sepia", css: "sepia(100%)", className: "sepia" },
  { name: "Blur 1x", css: "blur(2px)", className: "blur-[2px]" },
  {
    name: "Retro Reddish",
    css: "contrast(1.6) brightness(0.9) hue-rotate(-10deg) saturate(1.7)",
    className:
      "contrast-[1.6] brightness-[0.9] hue-rotate-[-10deg] saturate-[1.7]",
  },
];

const CameraHome: React.FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null!);

  const width = 320;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!isCameraActive) return;

    const video = videoRef.current;
    if (!video) return;

    let stream: MediaStream;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        stream = mediaStream;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch((err) => console.error("Video play error:", err));
        };
      })
      .catch((err) => console.error("Camera access error:", err));

    const handleCanPlay = () => {
      if (video.videoWidth && video.videoHeight) {
        const newHeight = video.videoHeight / (video.videoWidth / width);
        setHeight(isNaN(newHeight) ? width / (4 / 3) : newHeight);
      }
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isCameraActive]);

  const handleLayoutSelection = (layoutName: string) => {
    setSelectedLayout(layoutName);
    setImages([]);
    setIsCameraActive(true);
  };

  const handleImageClick = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video && width && height) {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);

        const filterObj = filters.find(
          (f) => f.name.toLowerCase() === selectedFilter
        );
        ctx.filter = filterObj?.css || "none";

        ctx.drawImage(video, 0, 0, width, height);
        const data = canvas.toDataURL("image/png");

        const required =
          layouts.find((layout) => layout.name === selectedLayout)
            ?.requiredImages || 1;

        setImages((prevImages) => [...prevImages, data].slice(0, required));
      }
    }
  };

  const LayoutDisplay = () => {
    const layout = layouts.find((l) => l.name === selectedLayout);
    if (!layout) return null;
    const Component = layout.component;
    return <Component images={images} layoutRef={layoutRef} />;
  };

  const handleFilterChange = (filterName: string) => {
    setSelectedFilter(filterName);
  };

  return (
    <div className="h-auto w-screen bg-pink-200 min-h-screen font-press text-[#fff] cursor-pixel flex items-center justify-center">
      {!selectedLayout ? (
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-bold text-[#ff69b4]">
            🎮 Choose Your Layout
          </h1>
          <div className="flex gap-[64px]">
            {layouts.map((layout) => (
              <button
                key={layout.name}
                onClick={() => handleLayoutSelection(layout.name)}
                className="bg-pink-500 border-[3px] border-pink-800 px-8 py-4 text-white shadow-[4px_4px_0px_#a94464] hover:bg-pink-600"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  imageRendering: "pixelated",
                }}
              >
                {layout.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      ) : isCameraActive ? (
        <div className="flex flex-col items-center  ">
          <video
            ref={videoRef}
            height={500}
            autoPlay
            playsInline
            className={`rounded border shadow transform -scale-x-100 ${
              filters.find((f) => f.name.toLowerCase() === selectedFilter)
                ?.className || ""
            }`}
          />
          <button
            onClick={handleImageClick}
            className="bg-pink-600 px-6 py-6 text-white border-pink-800 shadow-[4px_4px_0px_#a94464] mt-[40px]"
            style={{ fontFamily: "Mangerine" }}
          >
            📸 SNAP!
          </button>
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-[12px] mt-[30px] flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => handleFilterChange(filter.name.toLowerCase())}
                className="bg-[#ff4d8b] text-[#2d0d34] border-4 border-[#6b1e50] px-8 py-4 rounded-[6px] shadow-[4px_4px_0_#6b1e50] active:shadow-none  text-[20px]  font-press"
              >
                {filter.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {images.map((src, idx) => (
              <div key={idx} className="w-[160px] h-[150px] relative">
                <Image
                  src={src}
                  alt={`Photo ${idx + 1}`}
                  width={160}
                  height={150}
                  className="object-contain border border-pink-600 rounded"
                />
              </div>
            ))}
          </div>

          {images.length >=
            (layouts.find((layout) => layout.name === selectedLayout)
              ?.requiredImages || 1) && (
            <button
              onClick={() => setIsCameraActive(false)}
              className="bg-green-600 text-white px-6 py-3 border-[3px] border-green-800 shadow-[4px_4px_0px_#1b5e20] hover:bg-green-700"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              ✅ FINALIZE
            </button>
          )}
        </div>
      ) : (
        <div className="relative bg-pink-200 justify-center items-center overflow-hidden h-full w-full">
          <h1>Here's your generated layout</h1>
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="w-[800px] h-[800px] rounded-full bg-pink-500 opacity-60 blur-[180px]" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-pink-300 to-transparent z-0" />
          <div className="relative z-10 flex flex-row items-center justify-between w-full px-10">
            <div
              ref={layoutRef}
              className="transform -rotate-6 -translate-x-8 scale-75 transition-all duration-300 ease-in-out ml-40"
            >
              <LayoutDisplay />
            </div>
            <div className="ml-6">
              <DownloadLayout
                targetRef={layoutRef as React.RefObject<HTMLElement>}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraHome;
