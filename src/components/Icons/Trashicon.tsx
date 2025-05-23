import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TrashIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const TrashIcon: React.FC<TrashIconProps> = ({ width = 24, height = 24, color = '#FF3B30' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
      />
    </Svg>
  );
};

export default TrashIcon;