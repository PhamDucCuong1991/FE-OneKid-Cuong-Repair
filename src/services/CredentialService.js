import http from "../http-credential";


class CredentialService {
  changePassword(data) {
    return http.put("/update-password", data);
  }

}

export default new CredentialService();