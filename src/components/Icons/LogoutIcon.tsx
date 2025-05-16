import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface EditIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const LogoutIcon: React.FC<EditIconProps> = ({
  width = 24,
  height = 24,
  color = '#007AFF',
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
        fill={color}
      />
    </Svg>
  );
};

export default LogoutIcon;
