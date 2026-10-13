import { useEffect, useRef } from 'react';

/** Decorative continuity hint until a real Processo section exists. */
export default function ScrollCue() {
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cue = cueRef.current;
    if (!cue) return;
    let isCueInViewport = false;
    const syncCueAnimationState = () => {
      cue.style.animationPlayState = isCueInViewport && !document.hidden ? 'running' : 'paused';
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isCueInViewport = entry.isIntersecting;
      syncCueAnimationState();
    });
    intersectionObserver.observe(cue);
    document.addEventListener('visibilitychange', syncCueAnimationState);
    syncCueAnimationState();
    return () => {
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncCueAnimationState);
    };
  }, []);

  return (
    <div ref={cueRef} className="scroll-cue" aria-hidden="true">
      <svg className="scroll-cue-triangle" viewBox="0 0 24 42" focusable="false">
        <path d="M0 6H24L12 24Z" />
      </svg>
      <svg className="scroll-cue-triangle" viewBox="0 0 24 42" focusable="false">
        <path d="M0 18H24L12 36Z" />
      </svg>
    </div>
  );
}
