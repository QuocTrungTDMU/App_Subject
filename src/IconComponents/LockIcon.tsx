import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const LockIcon = ({ width = 24, height = 24, color = 'currentColor' }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
      fill={color}
    />
  </Svg>
);

export default LockIcon;