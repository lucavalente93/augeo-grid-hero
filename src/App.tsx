import ScrollCue from './components/ScrollCue';
import KineticMatrix from '@/components/ui/kinetic-matrix';
import symbol from '@/src/assets/logo/symbol.png';
import augeoLettering from '@/src/assets/augeo-lettering.svg';
import { useLayoutEffect, useRef } from 'react';

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const heading = headingRef.current;
    if (!hero || !heading) return;
    const alignArtwork = () => {
      const title = heading.getBoundingClientRect();
      const center = title.top + title.height / 2 - hero.getBoundingClientRect().top;
      hero.style.setProperty('--hero-title-center', `${center}px`);
    };
    const observer = new ResizeObserver(alignArtwork);
    observer.observe(hero);
    observer.observe(heading);
    observer.observe(hero.querySelector('.intro')!);
    window.addEventListener('resize', alignArtwork);
    alignArtwork();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', alignArtwork);
    };
  }, []);

  return (
    <div className="page cue-study" id="inicio">
      <header className="nav" aria-label="Cabeçalho Augeo Creative">
        <a className="brand" href="#inicio" aria-label="Augeo Creative — início">
          <img src={symbol} alt="Augeo Creative" />
        </a>
      </header>
      <main>
        <section ref={heroRef} className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 ref={headingRef} id="hero-title"><span>Presença</span>{' '}<span>digital com</span>{' '}<span>direção.</span></h1>
            <p className="intro">O contexto do seu negócio define como conectamos marca, website, aquisição e operação digital.</p>
          </div>
          <ScrollCue />
          <div className="matrix-deck">
            <KineticMatrix title="AUGEO" titleArtwork={augeoLettering} reactiveArtwork gridSpacing={72} className="augeo-matrix" />
          </div>
        </section>
      </main>
    </div>
  );
}
