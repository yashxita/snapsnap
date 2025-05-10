import React, { useState } from "react";

interface LayoutAProps {
  images: string[];
}

const LayoutA: React.FC<LayoutAProps> = ({ images }) => {
  const [caption, setCaption] = useState("Jane & Johnny\n1-16-2019");

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Caption Input */}
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Enter caption (e.g. Jane & Johnny\n1-16-2019)"
        className="mb-4 px-3 py-2 border border-gray-300 rounded shadow-sm w-[250px] text-sm"
      />

      {/* Two separate strips */}
      <div className="flex space-x-8">
        {[0, 3].map((startIdx, stripIdx) => (
          <div
            key={stripIdx}
            className="flex flex-col bg-black overflow-hidden w-[100px] h-[300px] justify-between rounded"
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
            <div className="text-[10px] text-center text-white bg-black py-1 whitespace-pre-line">
              {caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutA;
