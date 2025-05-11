"use client";

import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

interface DownloadLayoutProps {
  targetRef: React.RefObject<HTMLElement>;
}

const DownloadLayout: React.FC<DownloadLayoutProps> = ({ targetRef }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  useEffect(() => {
    // You can set selectedFilter dynamically if needed
  }, [selectedFilter]);

  const handleDownloadLayout = () => {
    if (targetRef.current) {
      const layoutWidth = targetRef.current.offsetWidth;
      const layoutHeight = targetRef.current.offsetHeight;

      // Increase the scale factor to simulate "zooming in"
      const scaleFactor = 2;  // Adjust this value for more or less zoom

      // Capture the layout with zoom applied
      html2canvas(targetRef.current, {
        logging: false, // Disable logging for cleaner output
        useCORS: true, // Enable CORS to allow external image rendering
        backgroundColor: null, // Transparent background
        width: layoutWidth * scaleFactor, // Increase width for zoom
        height: layoutHeight * scaleFactor, // Increase height for zoom
        x: 0, // Start capturing from the top-left corner
        y: 0, // Start capturing from the top-left corner
        scale: scaleFactor, // Zoom in by increasing the scale
        letterRendering: 1, // Improved text rendering
        ignoreElements: (el) => {
          // Ignore the button that triggers the download itself
          if (el.tagName === "BUTTON") {
            return true;
          }
          return false;
        },
        // Allow us to capture the exact layout without distortion
      }).then((canvas) => {
        // Convert the canvas to a data URL and save the image
        const layoutImage = canvas.toDataURL("image/png");
        saveAs(layoutImage, "layout.png");
      }).catch((error) => {
        console.error("Error while capturing layout: ", error);
      });
    }
  };

  return (
    <button
      onClick={handleDownloadLayout}
      className="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 mt-4"
    >
      Download Layout
    </button>
  );
};

export default DownloadLayout;
