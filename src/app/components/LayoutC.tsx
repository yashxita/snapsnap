import React from "react";

interface LayoutCProps {
  images: string[];
  layoutRef: React.RefObject<HTMLDivElement>;
}

const LayoutC: React.FC<LayoutCProps> = ({ images, layoutRef }) => {
  return (
    <div
      ref={layoutRef}
      className="relative w-[370px] h-[460px] mx-auto"
    >
      {/* Background template */}
      <img
        src="/layoutC.png"
        alt="Template"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Image slots */}
      {[
        { top: 0, left: 0 },
        { top: 0, left: "50%" },
        { top: "50%", left: 0 },
        { top: "50%", left: "50%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-[50%] h-[50%] p-[6px] box-border"
          style={{
            top: pos.top,
            left: pos.left,
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

export default LayoutC;
