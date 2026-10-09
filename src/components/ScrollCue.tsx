import { useEffect, useRef } from 'react';

/** Decorative continuity hint until a real Processo section exists. */
export default function ScrollCue() {
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cue = cueRef.current;
    if (!cue) return;
    let visible = false;
    const sync = () => {
      cue.style.animationPlayState = visible && !document.hidden ? 'running' : 'paused';
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(cue);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
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
