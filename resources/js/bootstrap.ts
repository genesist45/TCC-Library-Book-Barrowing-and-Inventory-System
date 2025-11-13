import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Force Axios to use the same protocol as the page
window.axios.defaults.baseURL = window.location.origin;
