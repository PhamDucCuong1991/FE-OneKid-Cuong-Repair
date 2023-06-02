import http from "../http-common";

class DeviceService {
  deviceLogin(data) {
    return http.put("/device/login", data);
  }
  deviceLogout(data) {
    return http.put("/device/logout", data);
  }
  deviceLogoutAdmin(id) {
    return http.put(`/device/logout/admin/${id}`);
  }
  deviceLogoutOneCamAdmin(id) {
    return http.put(`/device/logout/onecam/${id}`);
  }
}

export default new DeviceService();