import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ImageSvgProps = SVGProps<SVGSVGElement> & {
  message?: string;
};
