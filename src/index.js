import './css/styles.css';
import Notiflix from 'notiflix';
import galeryCards from './templates/galeryCards.hbs';
import fetchImage from './js/axiosImage';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//////////////////////

const formEl = document.querySelector('#search-form');
const galeryEl = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

///////////////////////
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
const perPage = 40;
let currentPage = 1;
let currentHits = 0;
let searchQuery = '';
let loadFlag = false;

formEl.addEventListener('submit', onSubmitForm);
async function onSubmitForm(event) {
  event.preventDefault();
  currentPage = 1;
  searchQuery = event.currentTarget.searchQuery.value;
  galeryEl.innerHTML = '';

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImage(searchQuery, currentPage);
  currentHits = response.hits.length;
  //////////function loadBtn
  // if (response.totalHits > perPage) {
  //   loadBtn.classList.remove('is-hidden');
  // } else {
  //   loadBtn.classList.add('is-hidden');
  // }

  try {
    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      const cards = response.hits.map(item => galeryCards(item)).join('');
      galeryEl.insertAdjacentHTML('beforeend', cards);
      lightbox.refresh();
      window.addEventListener('scroll', onScrollPage);
    }

    if (response.totalHits === 0) {
      galeryEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onScrollPage() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight * 0.98
  ) {
    if (!loadFlag) {
      loadFlag = true;
      currentPage += 1;
      const response = await fetchImage(searchQuery, currentPage);
      currentHits += response.hits.length;
      if (currentHits + perPage > response.totalHits) {
        loadBtn.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        const cards = response.hits.map(item => galeryCards(item)).join('');
        galeryEl.insertAdjacentHTML('beforeend', cards);
        lightbox.refresh();
      }
      loadFlag = false;
    }
  }
}

//////////function loadBtn
// loadBtn.addEventListener('click', onLoadBtnClick);

// async function onLoadBtnClick(event) {
//   console.log(currentHits);
//   currentPage += 1;
//   const response = await fetchImage(searchQuery, currentPage);
//   const cards = response.hits.map(item => galeryCards(item)).join('');
//   galeryEl.insertAdjacentHTML('beforeend', cards);
//   lightbox.refresh();
//   currentHits += response.hits.length;

//   if (currentHits + perPage > response.totalHits) {
//     loadBtn.classList.add('is-hidden');
//     Notiflix.Notify.failure(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
// }
