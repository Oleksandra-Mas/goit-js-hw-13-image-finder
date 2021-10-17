const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
const KEY = '23883543-c0e8a740f16e18e27aeb57e6b';
export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchCountries() {
    const url = `${BASE_URL}&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${KEY}`;
    const response = await fetch(url);
    return await response.json();
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
