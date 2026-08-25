import './SearchBar.css';
import {searchManga} from '../../../../services/searchService'

export function SearchBar() {

  const handle_click = async () => {
    let text = document.getElementById('manga-search').value
    console.log(text)
    let result = await searchManga(text)
    console.log(result)
    alert(result)
  }

  return (
    <form className="search-bar" role="search">
      <label className="search-bar__label" htmlFor="manga-search">
        Pesquise pelo seu mangá
      </label>

      <input
        id="manga-search"
        className="search-bar__input"
        type="search"
        placeholder="Pesquise pelo seu mangá"
        autoComplete="off"
      />

      <button className="search-bar__button" type="button" aria-label="Pesquisar" onClick={handle_click}>
        <svg
          aria-hidden="true"
          width="27"
          height="27"
          viewBox="0 0 43 43"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35.1167 37.625L23.8292 26.3375C22.9333 27.0542 21.9031 27.6215 20.7385 28.0396C19.574 28.4576 18.3347 28.6667 17.0208 28.6667C13.766 28.6667 11.0113 27.5394 8.75677 25.2849C6.50226 23.0304 5.375 20.2757 5.375 17.0208C5.375 13.766 6.50226 11.0113 8.75677 8.75677C11.0113 6.50226 13.766 5.375 17.0208 5.375C20.2757 5.375 23.0304 6.50226 25.2849 8.75677C27.5394 11.0113 28.6667 13.766 28.6667 17.0208C28.6667 18.3347 28.4576 19.574 28.0396 20.7385C27.6215 21.9031 27.0542 22.9333 26.3375 23.8292L37.625 35.1167L35.1167 37.625ZM17.0208 25.0833C19.2604 25.0833 21.1641 24.2995 22.7318 22.7318C24.2995 21.1641 25.0833 19.2604 25.0833 17.0208C25.0833 14.7812 24.2995 12.8776 22.7318 11.3099C21.1641 9.74219 19.2604 8.95833 17.0208 8.95833C14.7812 8.95833 12.8776 9.74219 11.3099 11.3099C9.74219 12.8776 8.95833 14.7812 8.95833 17.0208C8.95833 19.2604 9.74219 21.1641 11.3099 22.7318C12.8776 24.2995 14.7812 25.0833 17.0208 25.0833Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </form>
  );
}
