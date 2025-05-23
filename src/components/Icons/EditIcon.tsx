import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

interface EditIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const EditIcon: React.FC<EditIconProps> = ({
  width = 24,
  height = 24,
  color = '#007AFF',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <G
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2">
        <Path d="m16.475 5.408l2.117 2.117m-.756-3.982L12.109 9.27a2.1 2.1 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621" />
        <Path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" />
      </G>
    </Svg>
  );
};
export default EditIcon;
