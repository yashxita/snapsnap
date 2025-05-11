import React from "react";

interface LayoutBProps {
  images: string[];
  layoutRef: React.RefObject<HTMLDivElement>;
}

const LayoutB: React.FC<LayoutBProps> = ({ images, layoutRef }) => {
  return (
    <div
      ref={layoutRef}
      className="relative w-[320px] h-[800px] mx-auto"
    >
      {/* Filmstrip background */}
      <img
        src="/image.png" // Make sure it's saved in /public
        alt="Filmstrip"
        className="absolute inset-0 w-full h-full object-cover z-30"
      />

      {/* Image slots aligned to the transparent parts */}
      {[
        { top: "35px" },
        { top: "225px" },
        { top: "418px" },
        { top: "610px" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute left-[28px] w-[263px] h-[175px] overflow-hidden rounded-sm"
          style={{
            top: pos.top,
          }}
        >
          {images[i] && (
            <img
              src={images[i]}
              alt={`Image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LayoutB;
