import { AppHeader } from '../../shared/components/AppHeader/AppHeader.jsx';
import { SearchBar } from './components/SearchBar/SearchBar.jsx';

import './HomePage.css';

export function HomePage() {
  return (
    <main className="home-page">
      <AppHeader />

      <section className="home-page__content" aria-labelledby="home-title">
        <h1 id="home-title" className="home-page__title">
          Manga Searching
        </h1>

        <SearchBar />
      </section>
    </main>
  );
}
