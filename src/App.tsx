import KineticMatrix from '@/components/ui/kinetic-matrix';
import symbol from '@/logo/symbol.png';
import augeoLettering from '@/src/assets/augeo-lettering.svg';

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
  const explore = () => {
    document.querySelector('main > .hero + section')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  };

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
            <h1 id="hero-title">Ideias fortes, forma precisa.</h1>
            <p className="intro">Criamos marcas, sites e experiências digitais que transformam atenção em movimento.</p>
            <button className="explore" type="button" aria-label="Explore aqui" onClick={explore}>
              <span className="explore-label" aria-hidden="true"><ExploreLettering /></span>
              <span className="explore-scan" aria-hidden="true"><ExploreLettering /></span>
            </button>
          </div>
          <div className="matrix-deck">
            <KineticMatrix title="AUGEO" titleArtwork={augeoLettering} reactiveArtwork className="augeo-matrix" />
          </div>
        </section>
      </main>
    </div>
  );
}
