import KineticMatrix from '@/components/ui/kinetic-matrix';
import symbol from '@/logo/symbol.png';
import augeoLettering from '@/src/assets/augeo-lettering.svg';
import { ArrowDown } from 'lucide-react';

const exploreWords = ['EXPLORE', 'AQUI'];

function ExploreLettering() {
  return exploreWords.map((word) => (
    <span className="explore-word" key={word}>
      {[...word].map((letter, index) => (
        <span className="explore-letter" key={`${word}-${index}`}>{letter}</span>
      ))}
    </span>
  ));
}

export default function App() {
  return (
    <div className="page" id="inicio">
      <header className="nav" aria-label="Cabeçalho Augeo Creative">
        <a className="brand" href="#inicio" aria-label="Augeo Creative — início">
          <img src={symbol} alt="Augeo Creative" />
        </a>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Presença digital com direção.</h1>
            <p className="intro">O contexto do seu negócio define como conectamos marca, website, aquisição e operação digital.</p>
            {/* Replace with a native link to #processo when the real section exists. */}
            <div className="explore">
              <span className="sr-only">Explore aqui</span>
              <span className="explore-label" aria-hidden="true"><ExploreLettering /></span>
              <span className="explore-scan" aria-hidden="true"><ExploreLettering /></span>
              <ArrowDown className="explore-direction" aria-hidden="true" strokeWidth={1.5} />
            </div>
          </div>
          <div className="matrix-deck">
            <KineticMatrix title="AUGEO" titleArtwork={augeoLettering} reactiveArtwork className="augeo-matrix" />
          </div>
        </section>
      </main>
    </div>
  );
}
