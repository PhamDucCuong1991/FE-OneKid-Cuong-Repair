import http from "../http-common";
import httpFile from "../http-multipart";
// import { max } from "moment";
class AlbumService {
  searchAlbum(maxPageItem, pageNumber, timeAlbumSearch, idGrade, idClass, albumType) {
    return http.get(`/album?maxPageItem=${maxPageItem}&pageNumber=${pageNumber}&timeAlbumSearch=${timeAlbumSearch}&idGrade=${idGrade}&idClass=${idClass}&albumType=${albumType}`);
  }
  searchalbumNew(pageNumber, maxPageItem,timeAlbumSearch, idGrade, idClass,albumType) {
    return http.get(`/album/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&timeAlbumSearch=${timeAlbumSearch}&idGrade=${idGrade}&idClass=${idClass}&albumType=${albumType}`);
  }
  searchalbumNewWeb(pageNumber, maxPageItem, date, albumType) {
    return http.get(`/parent/album?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&albumType=${albumType}`);
  }
  getAlbumByIdWeb(id) {
    return http.get(`/parent/album/detail/${id}`);
  }
  getAlbumById(id) {
    return http.get(`/album/${id}`);
  }
  getTotalItems() {
    return http.get(`/album/total-rows`);
  }
  deletePicture(id) {
    return http.delete(`/album/picture/${id}`);
  }
  deleteAlbum(id) {
    return http.delete(`/album/album/${id}`);
  }
  dowloadAlbum1(id) {
    return http.get(`/album/download/${id}`);
  }
  dowloadAlbumWeb(id) {
    return http.get(`/parent/album/download/${id}`);
  }
  deleteMultiAlbum(data) {
    return http.put(`/album/multi-album/`,data);
  }
  updateApprovePicture(id, data) {
    return http.put(`/album/approve/${id}`, data)
  }
  updateAllApprovePicture(id) {
    return http.put(`/album/approve-all/${id}`)
  }
  updateMultiApproveAlbum(data) {
    return http.put(`/album/approve-multi-album`, data)
  }
  updateMultiUnApproveAlbum(data) {
    return http.put(`/album/unapprove-multi-album`, data)
  }
  updateAlbumUpload(formData) {
    return httpFile.post(`album/edit`, formData);
  }
  createAlbumUpload(formData) {
    return httpFile.post(`album`, formData);
  }
  test1(formData) {
    return httpFile.post(`/test/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}
export default new AlbumService();