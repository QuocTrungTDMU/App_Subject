import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface BoxOutlineIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const BoxOutlineIcon: React.FC<BoxOutlineIconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5zM3 3v10h10V3z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default BoxOutlineIcon;
