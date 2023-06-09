import axios from 'axios'
import authHeader from '@/services/AuthenticationHeader';
import  baseUrl  from '@/base-url.js'

const apiClient = axios.create({
  baseURL: baseUrl.url +"/web/",
  responseType: "blob",
  headers: {
    "Content-type": "text/plain;charset=UTF-8",
  }
});

apiClient.interceptors.request.use(function (config) {
  let authKey = authHeader()
  if (authKey != null) {
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
  if (status === 401) {
    localStorage.removeItem("user")
  }
  throw error;
})

export default apiClient;