<template>
  <div class="content">
    <div style="margin-top: 5px">
      <!-- Tìm kiếm xem -->
      <div class="button-click-left">
        <el-date-picker
          v-model="dataSearch.timeAlbumSearch"
          type="date"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          placeholder="Chọn ngày"
          :clearable="true"
          @change="searchHeaderMethod()"
        ></el-date-picker>

        <el-select
          class="button-left"
          v-model="dataSearch.idClass"
          @change="searchHeaderMethod()"
          placeholder="Chọn lớp"
          :clearable="getAppTypeUserLogin == 'plus'"
          style="margin-left: 5px"
        >
          <el-option
            v-for="item in listClass"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-select
          v-if="getAppTypeUserLogin == 'plus'"
          class="button-left"
          v-model="dataSearch.albumType"
          @change="searchHeaderMethod()"
          placeholder="Tất cả"
          clearable
        >
          <el-option
            v-for="item in albumTypesOption"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>

      <div
        v-if="checkPermission(['studentQuality_ablum_update'])"
        class="button-click row-data"
      >
        <el-dropdown @command="handleCommand">
          <router-link :to="{ path: '/student-quality/album/add' }">
            <el-button class="button-over" type="success">Tạo Album</el-button>
          </router-link>
        </el-dropdown>
        <el-dropdown @command="handleCommandAction">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="approveAlbum"
              >Duyệt Album</el-dropdown-item
            >
            <el-dropdown-item command="unApproveAlbum"
              >Hủy duyệt Album</el-dropdown-item
            >
            <el-dropdown-item command="deleteMultiAlbum"
              >Xóa Album</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-row
      style="
        width: 100%;
        margin-top: 10px;
        border: 1px solid rgb(96 99 102 / 19%);
        overflow-y: scroll;
        max-height: 730px;
        padding-left: 50px;
      "
      class="demo-image__placeholder"
    >
      <div
        v-for="albumResponse in albumResponseList"
        class="inline-block"
        :key="albumResponse"
        style="
          float: left;
          margin: 14px;
          border: 1px solid #dcdfe6;
          width: 223px;
          color: #606266;
          position: relative;
        "
      >
        <router-link
          :to="{ path: '/student-quality/album-detail/' + albumResponse.id }"
          style="text-decoration: none"
          class="router-link"
        >
          <span
            v-if="albumResponse.albumNew"
            style="background: orange; position: absolute; z-index: 1"
            >Mới</span
          >
          <el-image
            v-if="albumResponse.urlPictureFirst != null"
            class="el-image-opacity"
            :src="
              albumResponse.urlPictureFirst.replace(
                '/Albumanh/',
                '/Albumanh/thumbnail_'
              )
            "
            style="width: 100%; height: 200px"
          ></el-image>
          <h4
            style="color: #30313499; text-align: left; margin-left: 5px"
            class="demonstration"
          >
            {{ albumResponse.albumName }}
          </h4>
        </router-link>

        <span style="float: right; margin-right: 10px" class="demonstration">{{
          albumResponse.albumType
        }}</span>
        <span style="margin-right: 5px; float: right" class="demonstration"
          >{{ albumResponse.pictureNumber }}&nbsp;<i
            class="el-icon-picture"
            style="color: #6298d0"
          ></i
        ></span>
        <br />
        <el-checkbox
          style="margin-left: 5px"
          v-model="albumResponse.checkApporove"
          @change="
            checkApproveAlbum(albumResponse.id, albumResponse.checkApporove)
          "
          albumResponse.checkApprove
        ></el-checkbox>
        <span style="float: right; margin-right: 10px" class="demonstration">{{
          albumResponse.createdDate | formatDateTime
        }}</span>
        <div
          v-if="albumResponse.albumView"
          style="
            background: #67c23a;
            color: white;
            font-size: 20px;
            text-align: center;
          "
        >
          <span> Đang hiện</span>
          <el-button
            @click="download1(albumResponse.id)"
            style="background: #67c23a; margin-left: 10px; border: none"
          >
            <i style="color: white" class="el-icon-download"></i>
          </el-button>

          <el-button
            v-if="checkPermission(['studentQuality_ablum_update'])"
            @click="deleteAlbum(albumResponse.id)"
            style="background: rgb(103, 194, 58); border: none"
          >
            <i style="color: white" class="el-icon-delete"></i>
          </el-button>
        </div>
        <div
          v-else
          style="
            background: #409eff;
            color: white;
            font-size: 20px;
            text-align: center;
          "
        >
          <span>Đã ẩn</span>
          <el-button
            @click="download1(albumResponse.id)"
            style="background: #409eff; margin-left: 10px; border: none"
          >
            <i style="color: white" class="el-icon-download"></i>
          </el-button>

          <el-button
            @click="deleteAlbum(albumResponse.id)"
            style="background: #409eff; border: none"
          >
            <i style="color: white" class="el-icon-delete"></i>
          </el-button>
        </div>
      </div>
    </el-row>
    <div
      class="paging-click row-data"
      style="float: right; margin-bottom: 10px"
    >
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultNew"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import AlbumService from "../../services/AlbumService";
import TeacherService from "../../services/TeacherService";
import {mapActions, mapState} from "vuex";
// import GradeService from "../../services/GradeService";
export default {
  components: {},
  data() {
    return {
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      listClass: [],
      layout: "sizes, prev, pager, next",
      total: 10,
      pageSize: 12,
      currentPageNumber: 1,
      showProgress: false,
      albumTypesOption: ["Trường", "Lớp"],
      checkApprove: false,
      listIdApproveAlbum: [],
      // offset : this.currentPageNumber*this.pageSize-this.pageSize,
      pageList: [3, 6, 8, 10],
      multipleSelectionEmployee: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      employeeData: [],
      statusEmployee: [],
      departmentList: [],
      idList: [],
      // listGrade: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        albumType: "",
        timeAlbumSearch: "",
      },
      srcs: [
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%202.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%203.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%2013.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%2014.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%207.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%202.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%202.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%207.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%2013.jpg",
        "https://upload.onekids.edu.vn/id1/2020/T08/album_anh/%207.jpg",
      ],
      albumResponseList: [],
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      row.id;
    },

    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.searchByProperties();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByProperties();
    },
    handleCommandAction(command) {
      if (command == "approveAlbum") {
        this.updateMultiApproveAlbumMethod();
      } else if (command == "unApproveAlbum") {
        this.updateMultiUnApproveAlbum();
      } else if (command == "deleteMultiAlbum") {
        this.deleteMultiAlbum();
      } else if (command == "exportExcel") {
        this.exportExcelEmployee();
      }
    },

    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelectionEmployee = val;
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      console.log(row);
    },
    //click delete at row
    handleDelete(index, row) {
      // console.log("delete " + index, row);
      this.$confirm(
        "Bạn có chắc chắn muốn xóa nhân viên đã chọn?",
        "Thông báo!"
      );
      console.log(row);
    },
    createEmployeeDialog() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      // this.getAllStudent();
      // this.getAllClass();
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    dialogCloseUpdateMethod() {
      // this.getAllClass();
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      AlbumService.searchalbumNew(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.timeAlbumSearch,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.albumType
      )
        .then((resp) => {
          this.albumResponseList = resp.data.data.responseList;
          this.total = this.getTotalRows();
        })
        .catch((err) => {
          this.total = 1;
          console.log(err);
          this.albumResponseList = [];
        });
    },
    getAllAlbum() {
      AlbumService.getAllAlbum()
        .then((response) => {
          this.albumResponseList = response.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTotalRows() {
      AlbumService.getTotalItems().then((res) => {
        this.total = res.data.data;
      });
    },
    download1(id) {
      AlbumService.dowloadAlbum1(id)
        .then((response) => {
          this.reponse = response.data.data;
          const link = document.createElement("a");
          link.href = this.reponse;
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteAlbum(id) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa Album ảnh đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        AlbumService.deleteAlbum(id)
          .then((res) => {
            if (res.data) {
              this.$message({
                message: "Xóa album thành công",
                type: "success",
              });
              this.searchByProperties();
              // this.$router.go("/student-quality/album");
            } else {
              this.$message({
                message: "Xóa album thất bại",
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Lỗi xóa ảnh",
              type: "error",
            });

            // this.albumResponseList=null
          });
      });
    },
    deleteMultiAlbum() {
      if (this.listIdApproveAlbum.length > 0) {
        this.$confirm(
          "Bạn có chắc chắn muốn xóa Album ảnh đã chọn?",
          "Thông báo!",
          {
            distinguishCancelAndClose: true,
            confirmButtonText: "Có",
            closeOnClickModal: false,
            cancelButtonText: "Không",
          }
        ).then(() => {
          AlbumService.deleteMultiAlbum(this.listIdApproveAlbum)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: "Xóa album thành công",
                  type: "success",
                });
                this.listIdApproveAlbum = [];
                // this.$router.go("/student-quality/album");
                this.searchByProperties();
              } else {
                this.$message({
                  message: "Xóa album thất bại",
                  type: "error",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "Lỗi xóa Album",
                type: "error",
              });
            });
        });
      } else {
        this.$message({
          message: "Bạn chưa chọn Album nào",
          type: "error",
        });
      }
    },
    getClassSearch() {
    this.listClass = mapState(['serverDataClass']);
    },
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
        .then((resp) => {
          this.listClass = resp.data.data;
          this.dataSearch.idClass = this.listClass.filter(
            (x) => x.checked
          )[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkApproveAlbum(id, checkApprove) {
      let indexOf = this.listIdApproveAlbum.indexOf(id);
      if (checkApprove == true) {
        if (indexOf == -1) {
          this.listIdApproveAlbum.push(id);
        }
      } else {
        if (indexOf != -1) {
          this.listIdApproveAlbum.splice(indexOf, 1);
        }
      }
    },
    updateMultiApproveAlbumMethod() {
      AlbumService.updateMultiApproveAlbum(this.listIdApproveAlbum)
        .then((res) => {
          console.log(res.data);
          this.$message({
            message: "Duyệt album thành công",
            type: "success",
          });
          // this.$router.push("/student-quality/album");
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Duyệt album thất bại",
            type: "error",
          });
          this.searchByProperties();
          // this.$router.go("/student-quality/album");
        });
    },
    updateMultiUnApproveAlbum() {
      AlbumService.updateMultiUnApproveAlbum(this.listIdApproveAlbum)
        .then(() => {
          this.$message({
            message: "Hủy duyệt album thành công",
            type: "success",
          });
          // this.$router.go("/student-quality/album");
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Hủy duyệt album thất bại",
            type: "error",
          });
          // this.$router.go("/student-quality/album");
          this.searchByProperties();
        });
    },
  },

  beforeMount() {
    this.getTotalRows();
    if (this.getAppTypeUserLogin == "plus") {
      this.getClassSearch();
    } else if (this.getAppTypeUserLogin == "teacher") {
      this.getClassListTeacher();
    }
    this.searchByProperties();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }

  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-left {
    margin-right: 5px;
    width: 145px;
  }
  .button-click-left {
    display: inline-block;
  }
  .button-click {
    float: right;
  }
  .table-content {
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
  /deep/.el-table th.gutter {
    background-color: #78a5e7;
  }
  // /deep/.el-table--scrollable-y .el-table__body-wrapper {
  //   overflow-y: auto;
  //   margin-top: -1px;
  // }
  /deep/.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
    // max-height: 50px;
    text-overflow: ellipsis;
  }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    margin-left: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: rgb(95, 180, 74);
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.click-fullname {
  border: none;
  padding: 0;
  color: blue;
}
.click-fullname:hover {
  color: blue;
  background: none;
}
.el-image-opacity:hover {
  opacity: 5 !important;
  border: 1px solid #409eff;
  transition: 1s;
}
</style>
