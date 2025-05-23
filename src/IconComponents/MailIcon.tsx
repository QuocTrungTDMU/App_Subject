import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const MailIcon = ({width = 24, height = 24, color = 'currentColor'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"
      fill={color}
    />
  </Svg>
);

export default MailIcon;
