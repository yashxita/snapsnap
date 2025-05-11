import React, { useRef, useState, useEffect } from "react";

// Utility to strip unsupported oklch colors
function sanitizeOklchColors(element: HTMLElement) {
  const allElements = element.querySelectorAll<HTMLElement>("*");

  allElements.forEach((el) => {
    const computedStyle = getComputedStyle(el);
    for (const prop of [
      "color",
      "backgroundColor",
      "borderColor",
      "outlineColor",
      "boxShadow",
    ]) {
      const value = computedStyle.getPropertyValue(prop);
      if (value.includes("oklch")) {
        el.style.setProperty(prop, "#000000", "important");
      }
    }
  });
}

interface LayoutAProps {
  images: string[];
  layoutRef: React.RefObject<HTMLDivElement>;
}

const LayoutA: React.FC<LayoutAProps> = ({ images, layoutRef }) => {
  const [caption, setCaption] = useState("Jane & Johnny\n1-16-2019");

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Caption input - not included in download */}
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Enter caption"
        className="mb-4 px-3 py-2 border border-[#d1d5db] rounded shadow-sm w-[250px] text-sm"
        style={{ color: "#000", backgroundColor: "#fff" }}
      />

      {/* Downloadable layout content */}
      <div ref={layoutRef} className="flex space-x-8">
        {[0, 3].map((startIdx, stripIdx) => (
          <div
            key={stripIdx}
            className="flex flex-col overflow-hidden w-[100px] h-[300px] justify-between rounded"
            style={{ backgroundColor: "#000" }}
          >
            {[0, 1, 2].map((i) => {
              const img = images[startIdx + i];
              return (
                <div key={i} className="h-[33.33%] w-full">
                  {img && (
                    <img
                      src={img}
                      alt={`Image ${startIdx + i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
            <div
              className="text-[10px] text-center py-1"
              style={{ color: "#fff", backgroundColor: "#000" }}
            >
              {caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutA;
