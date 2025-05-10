import React from "react";

interface LayoutBProps {
  images: string[];
}

const LayoutB: React.FC<LayoutBProps> = ({ images }) => {
  return (
    <div className="flex space-x-4">
      <div className="w-[160px] h-[160px] bg-gray-300">
        {images[0] && <img src={images[0]} alt="Image 1" className="w-full h-full object-contain" />}
      </div>
      <div className="w-[160px] h-[160px] bg-gray-300">
        {images[1] && <img src={images[1]} alt="Image 2" className="w-full h-full object-contain" />}
      </div>
    </div>
  );
};

export default LayoutB;
