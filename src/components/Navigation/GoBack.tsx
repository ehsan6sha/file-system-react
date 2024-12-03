import React from 'react';

interface SvgIconProps {
  size?: string;
  fill?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ size = '20px', fill = '#090509' }) => (
  <svg viewBox="0 0 476.737 476.737" height={size}>
    <path
      fill={fill}
      d="M238.369 0C106.726 0 0 106.726 0 238.369c0 131.675 106.726 238.369 238.369 238.369 131.675 0 238.369-106.694 238.369-238.369C476.737 106.726 370.043 0 238.369 0zm106.598 217.837c-6.134 6.198-16.273 6.198-22.47 0L254.26 149.6v247.681c0 8.74-7.151 15.891-15.891 15.891-8.772 0-15.891-7.151-15.891-15.891V149.6l-68.205 68.237c-6.198 6.198-16.273 6.198-22.47 0s-6 .198 -16 .273 A95 .347 .095 -.0955 .022 .337a15 .684 .109l5 .2123 .40195 .34795 .347230 .032z"
    />
  </svg>
);

export default SvgIcon;