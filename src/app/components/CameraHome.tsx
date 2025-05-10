"use client"
import React, { useState, useRef, useEffect } from "react";
import LayoutA from "./LayoutA";
import LayoutB from "./LayoutB";
import LayoutC from "./LayoutC";
import Image from "next/image";
import DownloadLayout from "./DownloadLayout"; // Import the DownloadLayout component

const layouts = [
  { name: "Layout A", requiredImages: 6, component: LayoutA },
  { name: "Layout B", requiredImages: 6, component: LayoutB },
  { name: "Layout C", requiredImages: 4, component: LayoutC },
];

const CameraHome: React.FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Explicitly typing layoutRef as React.RefObject<HTMLElement>
  const layoutRef = useRef<HTMLElement | null>(null); // Updated here

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
        // Flip canvas context horizontally
        ctx.translate(width, 0);
        ctx.scale(-1, 1);

        // Apply the selected filter before drawing the image
        switch (selectedFilter) {
          case "grayscale":
            ctx.filter = "grayscale(100%)";
            break;
          case "sepia":
            ctx.filter = "sepia(100%)";
            break;
          case "none":
            ctx.filter = "none";
            break;
          default:
            ctx.filter = "none";
        }

        // Draw the video to the canvas with the applied filter
        ctx.drawImage(video, 0, 0, width, height);
        const data = canvas.toDataURL("image/png");

        const required =
          layouts.find((layout) => layout.name === selectedLayout)?.requiredImages || 1;

        setImages((prevImages) => [...prevImages, data].slice(0, required));
      }
    }
  };

  const LayoutDisplay = () => {
    const layout = layouts.find((l) => l.name === selectedLayout);
    if (!layout) return null;
    const Component = layout.component;
    return <Component images={images} />;
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="h-auto w-screen bg-gray-100 p-8">
      {!selectedLayout ? (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold">Select a Layout</h1>
          {layouts.map((layout) => (
            <button
              key={layout.name}
              onClick={() => handleLayoutSelection(layout.name)}
              className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              {layout.name}
            </button>
          ))}
        </div>
      ) : isCameraActive ? (
        <div className="flex flex-col items-center space-y-4">
          <video
            ref={videoRef}
            width={600}
            height={height || undefined}
            autoPlay
            playsInline
            className={`rounded border shadow transform -scale-x-100 ${selectedFilter}`}
          />
          <button
            onClick={handleImageClick}
            className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Take Picture
          </button>
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => handleFilterChange("grayscale")}
              className="px-3 py-1 bg-gray-600 text-white rounded"
            >
              Grayscale
            </button>
            <button
              onClick={() => handleFilterChange("sepia")}
              className="px-3 py-1 bg-orange-600 text-white rounded"
            >
              Retro (Sepia)
            </button>
            <button
              onClick={() => handleFilterChange("none")}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              No Filter
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {images.map((src, idx) => (
              <div key={idx} className="w-[160px] h-[150px] relative">
                <Image
                  src={src}
                  alt={`Photo ${idx + 1}`}
                  width={160}
                  height={150}
                  className="object-contain rounded"
                />
              </div>
            ))}
          </div>

          {images.length >=
            (layouts.find((layout) => layout.name === selectedLayout)?.requiredImages || 1) && (
            <button
              onClick={() => setIsCameraActive(false)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Finalize Layout
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 w-full flex justify-center" ref={layoutRef}>
          <LayoutDisplay />
          <DownloadLayout targetRef={layoutRef} /> {/* Add DownloadLayout here */}
        </div>
      )}
    </div>
  );
};

export default CameraHome;
