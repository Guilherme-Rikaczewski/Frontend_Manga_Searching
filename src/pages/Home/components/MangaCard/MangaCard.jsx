import './MangaCard.css';

export function MangaCard({ mangaInfo }) {

  return (
    <article>
        {/* <img src="" alt="imagem do anuncio" className='img-card' /> */}
        <div className='img-card'></div>
        
        <div className='info-card'>
            <p className='autor'>de Eichiro Oda</p>

            <h2>One Piece East Blue 3 em 1</h2>

            <div className='line'></div>

            <p className='media-txt'>Média: R$ 27,80</p>

            <div className='price'>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.102 9.16667L9.95434 5L5.8067 9.16667M14.102 15L9.95434 10.8333L5.8067 15" stroke="#FA4040" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <data value="" className='price-txt'>R$ 29,33</data>
            </div>

            <p className='state-txt'>Estado: Novo</p>

            <p className='shop-txt'>Loja: Panini</p>

            <a className='redirect-box'>

              <div className='redirect-svg'>

                <svg width="28" height="28" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.0011 11.625V3.875H19.2865M27.0011 3.875L12.8577 18.0833M23.1438 16.7917V24.5417C23.1438 25.2268 22.8729 25.8839 22.3906 26.3684C21.9084 26.8528 21.2543 27.125 20.5723 27.125H6.42884C5.74682 27.125 5.09274 26.8528 4.61049 26.3684C4.12823 25.8839 3.8573 25.2268 3.8573 24.5417V10.3333C3.8573 9.64819 4.12823 8.99111 4.61049 8.50664C5.09274 8.02217 5.74682 7.75 6.42884 7.75H14.1435" stroke="white" stroke-width="2.91667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </div>
              
              <div className='redirect-txt'>

                <p>Redirecionar</p>

              </div>
            </a>
        </div>
    </article>
  );
}
