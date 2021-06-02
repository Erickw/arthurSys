import axios from 'axios';
import Cookies from 'js-cookie';
import { getApiClient } from './axios';

const api = getApiClient();

export default api;
