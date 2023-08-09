import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const refs = {
  breedEl: document.querySelector('.breed-select'),
  catInfoEl: document.querySelector('.cat-info'),
  loadingEl: document.querySelector('.loader-p'),
  errorEl: document.querySelector('.error'),
};

refs.breedEl.addEventListener('change', findCatInfo);

fetchBreeds().then(addAllCatsToList).catch(showError);
fetchCatByBreed;

let shownCat = '';

function addAllCatsToList(data) {
  const catOption = data
    .map(cat => {
      const catOption = `<option value="${cat.id}">${cat.name}</option>`;
      return catOption;
    })
    .join('');
  refs.breedEl.insertAdjacentHTML('beforeend', catOption);

  new SlimSelect({
    select: '#breed-select',
  });

  refs.breedEl.classList.remove('is-hidden');
}

function findCatInfo(event) {
  const catId = event.currentTarget.value;
  if (catId === shownCat) {
    return;
  }
  makeCatInfoInvisible();
  makeLoadingVisible();
  fetchCatByBreed(catId).then(showCatInfo).catch(showError);
}

function showCatInfo(item) {
  const catImg = item[0];
  const catInfo = catImg.breeds[0];
  makeCatCard(catImg, catInfo);
  makeCatInfoVisible();
  makeLoadingInvisible();
}

function showError(error) {
  if (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
    makeLoadingInvisible();
    console.log(error.message);
  }
}

function makeCatCard(catImg, catInfo) {
  const markUp = `
  <div class='container'>
    <img src='${catImg.url}' alt='Cat ${catInfo.name}'/>
  </div>
  <div>
    <h1 class='title'">${catInfo.name}</h1>
    <p>${catInfo.description}</p>
    <p class='habits'>${catInfo.temperament}</p>
  </div>`;
  refs.catInfoEl.innerHTML = markUp;
  shownCat = catInfo.id;
}

function makeLoadingVisible() {
  refs.loadingEl.classList.remove('is-hidden');
}
function makeLoadingInvisible() {
  refs.loadingEl.classList.add('is-hidden');
}

function makeCatInfoVisible() {
  refs.catInfoEl.classList.remove('is-hidden');
}
function makeCatInfoInvisible() {
  refs.catInfoEl.classList.add('is-hidden');
}
