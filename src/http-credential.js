import axios from 'axios'
import authHeader from '@/services/AuthenticationHeader';
import  baseUrl  from '@/base-url.js'

const apiClient = axios.create({
  headers: {
    "Content-type": "application/json",
  }
});

apiClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  let authKey = authHeader()
  // let domainDB = localStorage.getItem('domain');
  if (authKey != null) {
    config.baseURL = baseUrl.url + "/api/";
    config.headers["Authorization"] = authKey.Authorization;
    return config;
  }
});

//thông tin trả về sau khi gọi api
apiClient.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  let status = error.response.status;
  //lỗi xác thực, xóa token=>quay về trang login
  if (status == 401) {
    localStorage.removeItem("user")
  }
  throw error;
})

export default apiClient;