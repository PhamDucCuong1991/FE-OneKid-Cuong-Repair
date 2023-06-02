import axios from 'axios'
import authHeader from '@/services/AuthenticationHeader';
import router from "./router";
import  baseUrl  from '@/base-url.js'

const apiClient = axios.create({
  headers: {
    "Content-type": "application/json",
  }
});
//thông tin trước khi gọi api
apiClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  let authKey = authHeader()
  // let domainDB = localStorage.getItem('domain');
  if (authKey != null) {
    config.baseURL = baseUrl.url + "/web/";
    config.headers["Authorization"] = authKey.Authorization;
    return config;
  }
})

//thông tin trả về sau khi gọi api
apiClient.interceptors.response.use(function (response) {
  //check theo apptpe ứng với http
  // let appType= JSON.parse(localStorage.getItem("user")).appType;
  // if(appType=='parent'){
  //   localStorage.removeItem("user")
  //   alert("Tính năng giành cho phụ huynh đang được phát triển")
  // }else if(appType=='teacher'){
  //   localStorage.removeItem("user")
  //   alert("Tính năng giành cho giáo viên đang được phát triển")
  // }
  return response;
}, function (error) {
  let status = error.response.status;
  //không có quyền truy cập trang này
  if (status === 403) {
    router.push("/error/forbidden");
    throw null;
  }
  //lỗi xác thực, xóa token=>quay về trang login
  else if (status === 401) {
    // alert("Thông tin tài khoản đã được thay đổi")
    localStorage.removeItem("user")
  }
  else if(status === 404){
    alert("Đường dẫn không tồn tại: "+error.config.url)
    throw null;
  }
  throw error;
})

export default apiClient;