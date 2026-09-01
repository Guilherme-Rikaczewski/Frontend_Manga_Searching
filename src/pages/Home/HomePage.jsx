import { AppHeader } from '../../shared/components/AppHeader/AppHeader.jsx';
import { SearchBar } from './components/SearchBar/SearchBar.jsx';
import { useState } from 'react';
import { MangaCard } from './components/MangaCard/MangaCard.jsx';

import './HomePage.css';

export function HomePage() {

  const [result, setResult] = useState(null);

  return (
    <main className={`home-page ${result ? 'home-page--has-result' : ''}`}>
      <AppHeader />

      <section className="home-page__content" aria-labelledby="home-title">
        <h1 id="home-title" className="home-page__title">
          Manga Searching
        </h1>

        <SearchBar setResult={setResult}/>

        {
          result && <div className='manga-result'>
            {result.opcoes.map((mangaInfo, index) => (
              <MangaCard
                key={`${mangaInfo.nome}-${index}`}
                mangaInfo={mangaInfo}
                media={result.preco_medio}
              />
            ))}
          </div>
        }


      </section>
    </main>
  );
}
