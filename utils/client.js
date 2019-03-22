import * as axios from 'axios';

const instance = axios.create();
instance.defaults.baseURL = 'https://androidlessonsapi.herokuapp.com/api/';
instance.defaults.timeout = 20000;
//...
//and other options

export default instance;
