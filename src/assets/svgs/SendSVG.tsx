import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface SendSVGProps {
  color?: string;
  size?: number;
}

const SendSVG = (props: SendSVGProps) => {
  return (
    <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    // xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M5.11933 0.384215C2.32524 -1.01453 -0.775656 1.63695 0.175149 4.61184L1.26247 8.01384L0.181065 11.3845C-0.772814 14.3576 2.32366 17.0124 5.11924 15.6182L14.0461 11.1663C16.6491 9.86821 16.6519 6.15753 14.0509 4.85543L5.11933 0.384215Z"
      fill="#363853"
    />
  </Svg>
  );
};

export default SendSVG;
