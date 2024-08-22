import React from 'react';

interface ImageProps {
  src: string;
  ignoreRegions?: Array<{
    top: number;
    width: number;
    height: number;
    left?: number;
  }>;
}

export const Image = ({ src }) => {
  // const image = require(`../../${filePath}`);
  return (
    <div>
      {/* {ignoreRegions.map((region) => (
        <div
          key={region.top}
          style={{
            background: 'black',
            width: region.width,
            height: region.height,
            position: 'absolute',
            top: region.top,
            left: region.left || 0,
            zIndex: 1000,
          }}
        ></div>
      ))} */}
      <img src={src} alt={src} />
    </div>
  );
};

// JSON object
// Key is the name of the file
// Value is coordinates for ignore regions
// Our script would look for the ignore regions and add absolute coordinates to the image with the divs we've defined
// export const ignoreRegions = {
//   'Image.tsx': [
//     {
//       x: 0,
//       y: 0,
//       width: 240,
//     },
//   ],
// };
