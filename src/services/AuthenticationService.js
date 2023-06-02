import axios from 'axios';
import  baseUrl  from '@/base-url.js'

const API_URL = baseUrl.url +'/api/auth/';

class AuthService {
    login(user) {
        return axios
            .post(API_URL + 'signin', {
                username: user.username,
                password: user.password,
                appType: user.appType
            })
            .then(response => {
                if (response.data.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                    // if (response.data.appType == 'teacher') {
                    //     localStorage.setItem('domain', "http://localhost")
                    // } else if (response.data.appType == 'parent') {
                        // localStorage.setItem('domain', "http://demo.onekids.edu.vn")
                    // }
                }
                return response.data.data;
            }).catch(err => {
                console.log(err)
                return Promise.reject(err);
            });
    }

    //xóa thông tin người dùng khỏi local storage khi thoát đăng nhập
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('domain');
    }

    // register(user) {
    //     return axios.post(API_URL + 'signup', {
    //         username: user.username,
    //         email: user.email,
    //         password: user.password
    //     });
    // }
}

export default new AuthService();
