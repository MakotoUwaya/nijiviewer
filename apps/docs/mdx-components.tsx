import type { ComponentType } from 'react';
import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import {
  ImageZoom,
  type ImageZoomProps,
} from 'fumadocs-ui/components/image-zoom';
import { Tab, Tabs as FumadocsTabs } from 'fumadocs-ui/components/tabs';

// Nextra の <Tabs.Tab> 構文との互換性を維持
const Tabs = Object.assign(FumadocsTabs, { Tab });

// Next.js の unoptimized プロパティを ImageZoom に透過させるための型拡張
const ZoomImage = ImageZoom as ComponentType<
  ImageZoomProps & { unoptimized?: boolean }
>;

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout,
    Tabs,
    Tab,
    img: (props) => (
      <ZoomImage
        {...(props as ImageZoomProps)}
        unoptimized={
          typeof props.src === 'string' && /^https?:\/\//.test(props.src)
        }
      />
    ),
    ...components,
  };
}
