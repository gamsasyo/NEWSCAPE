import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// 세리프 본문과 어울리는 얇은 선 아이콘 (기본 PhotoSwipe 아이콘은 두꺼운 면 아이콘)
const line = 'fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"';
const closeSVG = `<svg class="pswp__icn" viewBox="0 0 32 32" aria-hidden="true"><path d="M9 9l14 14M23 9L9 23" ${line}/></svg>`;
const arrowSVG = `<svg class="pswp__icn" viewBox="0 0 32 32" aria-hidden="true"><path d="M20 7L11 16l9 9" ${line}/></svg>`;

export function initGallery(lenis) {
  const lightbox = new PhotoSwipeLightbox({
    closeSVG,
    arrowPrevSVG: arrowSVG,
    arrowNextSVG: arrowSVG,
    gallery: '#page',
    children: 'a[data-pswp-width]',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 1,
    zoom: false,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    wheelToZoom: true,
    showHideAnimationType: 'fade',
  });
  lightbox.on('openingAnimationStart', () => lenis.stop());
  lightbox.on('close', () => lenis.start());
  lightbox.init();
  return lightbox;
}
