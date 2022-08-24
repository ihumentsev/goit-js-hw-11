import axios from 'axios';

export default async function fetchImage(name, page) {
  const url = 'https://pixabay.com/api/';
  const key = '29464546-8020741a37deac58a15567c18';
  const filter = `?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(`${url}${filter}`).then(res => res.data);
}
