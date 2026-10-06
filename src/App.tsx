import { ArrowUpRight } from 'lucide-react';
import KineticMatrix from '@/components/ui/kinetic-matrix';
import logo from '@/logo/logo.png';
import augeoLettering from '@/src/assets/augeo-lettering.svg';

export default function App() {
  return (
    <div className="page" id="inicio">
      <header className="nav" aria-label="Cabeçalho Augeo Creative">
        <a className="brand" href="#inicio" aria-label="Augeo Creative — início">
          <img src={logo} alt="Augeo Creative" />
        </a>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Ideias fortes, forma precisa.</h1>
            <p className="intro">Criamos marcas, sites e experiências digitais que transformam atenção em movimento.</p>
            <button className="cta" type="button" disabled title="Em breve">
              Falar com a Augeo <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="matrix-deck">
            <KineticMatrix title="AUGEO" titleArtwork={augeoLettering} animateArtwork className="augeo-matrix" />
          </div>
        </section>
      </main>
    </div>
  );
}
