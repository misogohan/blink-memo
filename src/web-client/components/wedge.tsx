import type { FC } from "react";

export const Wedge: FC<{ direction: 'left' | 'down' }> = ({direction}) =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-12-12 24 24">
    <path
      d="M0 0L-7.392304845413264-6Q3 0 12 0Q3 0-7.392304845413264 6z"
      fill="currentColor"
      strokeWidth="0"
      transform={`rotate(${direction == 'down' ? "90" : "0"})`}
    />
  </svg>
;
