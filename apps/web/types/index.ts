import type { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  /** アイコンの表示サイズ */
  size?: number;
};

export type ImageSvgProps = SVGProps<SVGSVGElement> & {
  /** 画像の説明文 */
  message?: string;
};
