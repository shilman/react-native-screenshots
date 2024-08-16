import React from 'react';
import { View, Image } from 'react-native';

interface ImagesProps {
  filePath: string;
  ignoreRegions?: Array<{
    top: number;
    width: number;
    height: number;
    left?: number;
  }>;
}

export const Images = ({ filePath = '', ignoreRegions = [] }) => {
  return (
    <View>
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
      <Image
        source={{ uri: filePath }}
        alt="baseline_image"
        width={240}
        height={320}
      />
    </View>
  );
};

// JSON object
// Key is the name of the file
// Value is coordinates for ignore regions
// Our script would look for the ignore regions and add absolute coordinates to the image with the divs we've defined
// export const ignoreRegions = {
//   'Images.tsx': [
//     {
//       x: 0,
//       y: 0,
//       width: 240,
//     },
//   ],
// };
