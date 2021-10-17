import './sass/main.scss';
import ApiService from './js/apiService';
import * as basicLightbox from 'basiclightbox';

import { alert, success } from '.././node_modules/@pnotify/core/dist/PNotify.js';
import galleryTpl from './templates/gallery.hbs';
const apiService = new ApiService();
const refs = {
  search_form: document.getElementById('search-form'),
  galleryContainer: document.querySelector('.gallery'),
  sentinel: document.querySelector('#sentinel'),
};
refs.search_form.addEventListener('submit', onSubmitSearchForm);
refs.galleryContainer.addEventListener('click', onGalleryElementClick);

function onSubmitSearchForm(event) {
  event.preventDefault();
  apiService.query = event.currentTarget.elements.query.value.trim();
  if (apiService.query === '') {
    return alert({
      text: 'Please enter more specific query!',
      type: 'error',
      closer: false,
      sticker: false,
      width: '360px',
      delay: 1000,
    });
  }
  apiService.resetPage();
  clearGalleryContainer();
  getPhotosAndUpdateUI();
}

function onGalleryElementClick(e) {
  if (!e.target.classList.contains('gallery__image')) return;
  const srcImage = e.target.dataset.source;
  const instance = basicLightbox.create(`
    <img src="${srcImage}" width="1600" >
`);
  instance.show();
}

async function getPhotosAndUpdateUI() {
  try {
    const photos = await apiService.fetchCountries();
    if (photos.total === 0) {
      return alert({
        text: 'Nothing found. Please enter another query!',
        type: 'error',
        closer: false,
        sticker: false,
        width: '360px',
        delay: 1000,
      });
    }
    success({
      text: 'Success!',
      type: 'success',
      closer: false,
      sticker: false,
      width: '360px',
      delay: 1000,
    });
    appendGalleryMarkup(photos);
  } catch (error) {
    alert({
      text: `${error.message}`,
      type: 'error',
      closer: false,
      sticker: false,
      width: '360px',
      delay: 1000,
    });
  }
}

function appendGalleryMarkup(photos) {
  const countriesMarkup = galleryTpl(photos.hits);
  refs.galleryContainer.insertAdjacentHTML('beforeend', countriesMarkup);
}
function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiService.query !== '') {
      getPhotosAndUpdateUI();
      apiService.incrementPage();
    }
  });
};
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);
