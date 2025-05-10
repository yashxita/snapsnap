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

      // Use html2canvas to capture the layout
      html2canvas(targetRef.current, {
        x: 0,  // Capture from the top-left corner
        y: 0,  // Capture from the top-left corner
        width: layoutWidth,  // Use exact width of the component
        height: layoutHeight, // Use exact height of the component
        scale: window.devicePixelRatio, // Ensure high resolution for the image
        backgroundColor: null, // Ensure no background color (transparent if required)
        logging: false, // Disable console logs from html2canvas
        useCORS: true, // Enable CORS if loading external images
        letterRendering: 1, // For better text rendering (if applicable)
        ignoreElements: (el) => {
          // Ignore the Download Layout button itself
          if (el.tagName === 'BUTTON') {
            return true;
          }
          return false;
        }
      }).then((canvas) => {
        // Convert the canvas to a data URL (image)
        const layoutImage = canvas.toDataURL("image/png");

        // Save the layout image
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
