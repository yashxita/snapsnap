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

        switch (selectedFilter) {
          case "grayscale":
            ctx.filter = "grayscale(100%)";
            break;
          case "sepia":
            ctx.filter = "sepia(100%)";
            break;
          case "none":
          default:
            ctx.filter = "none";
        }

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

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="h-auto w-screen bg-[#fbd6e3] p-8 min-h-screen font-press text-[#fff] cursor-pixel">
      {!selectedLayout ? (
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-bold text-[#ff69b4]">
            🎮 Choose Your Layout
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="flex flex-col items-center space-y-6">
          <video
            ref={videoRef}
            width={600}
            height={height || undefined}
            autoPlay
            playsInline
            className={`rounded border shadow transform -scale-x-100 ${
              selectedFilter || ""
            }`}
          />
          <button
            onClick={handleImageClick}
            className="bg-pink-600 px-6 py-3 text-white border-[3px] border-pink-800 shadow-[4px_4px_0px_#a94464] hover:bg-pink-700"
            style={{ fontFamily: "Mangerine" }}
          >
            📸 SNAP!
          </button>
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex space-x-3">
            {["grayscale", "sepia", "none"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className="bg-pink-400 text-white px-4 py-2 border border-pink-700 hover:bg-pink-500"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                {filter.toUpperCase()}
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
              className="mt-4 bg-green-600 text-white px-6 py-3 border-[3px] border-green-800 shadow-[4px_4px_0px_#1b5e20] hover:bg-green-700"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              ✅ FINALIZE
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 flex justify-center w-full" ref={layoutRef}>
          <LayoutDisplay />
          <DownloadLayout
            targetRef={layoutRef as React.RefObject<HTMLElement>}
          />
        </div>
      )}
    </div>
  );
};

export default CameraHome;
