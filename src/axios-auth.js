import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://vuejs-course-axios.firebaseio.com/'
});

instance.defaults.headers.common['foo'] = 'bar';

export default instance