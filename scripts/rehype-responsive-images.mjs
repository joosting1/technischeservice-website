import { visit } from 'unist-util-visit';
import path from 'path';

// Widths must match generator
const WIDTHS = [480, 768, 1024, 1440];

export default function rehypeResponsiveImages() {
  return async function transformer(tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img') return;
      if (!node.properties) return;
      const src = node.properties.src;
      if (typeof src !== 'string') return;
      if (!src.startsWith('/assets/')) return;

      const alt = node.properties.alt || '';

      // Build responsive variant paths (same logic as hero)
      const relUnderAssets = src.replace(/^\/assets\//, '');
      const relDir = path.posix.dirname(relUnderAssets);
      const baseName = path.basename(relUnderAssets, path.extname(relUnderAssets));

      const avifSet = WIDTHS.map((w) => `/assets/${relDir}/responsive/${baseName}-${w}w.avif ${w}w`).join(', ');
      const webpSet = WIDTHS.map((w) => `/assets/${relDir}/responsive/${baseName}-${w}w.webp ${w}w`).join(', ');
      const jpgSet = WIDTHS.map((w) => `/assets/${relDir}/responsive/${baseName}-${w}w.jpg ${w}w`).join(', ');

      const picture = {
        type: 'element',
        tagName: 'picture',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'source',
            properties: {
              type: 'image/avif',
              srcset: avifSet,
              sizes: '(max-width: 768px) 92vw, 1000px'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'source',
            properties: {
              type: 'image/webp',
              srcset: webpSet,
              sizes: '(max-width: 768px) 92vw, 1000px'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'source',
            properties: {
              type: 'image/jpeg',
              srcset: jpgSet,
              sizes: '(max-width: 768px) 92vw, 1000px'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'img',
            properties: {
              src,
              alt,
              loading: 'lazy',
              decoding: 'async'
            },
            children: []
          }
        ]
      };

      parent.children[index] = picture;
    });
  };
}
