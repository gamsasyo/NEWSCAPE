import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export function initGallery(lenis) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#page',
    children: 'a[data-pswp-width]',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 1,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    wheelToZoom: true,
    showHideAnimationType: 'fade',
  });
  lightbox.on('openingAnimationStart', () => lenis.stop());
  lightbox.on('close', () => lenis.start());
  lightbox.init();
  return lightbox;
}
