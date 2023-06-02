<template>
  <div class="content">
    <div style="margin-top: 5px">
      <!-- Tìm kiếm xem -->
      <div class="button-click-left">
        <el-date-picker
          class="button-left"
          v-model="dataSearch.date"
          type="date"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          placeholder="Chọn ngày"
          :clearable="true"
          @change="searchHeaderMethod()"
        ></el-date-picker>

        <el-select
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
          :to="{ path: '/parent/album-detail/' + albumResponse.id }"
          style="text-decoration: none"
          class="router-link"
        >
          <span
            v-if="!albumResponse.albumNew"
            style="background: orange; position: absolute; z-index: 1"
            >Mới</span
          >
          <el-image
            v-if="albumResponse.urlPictureFirst != null"
            class="el-image-opacity"
            :src="
              albumResponse.urlPictureFirst.replace('/Albumanh/', '/Albumanh/thumbnail_')
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
        <span style="margin-left: 5px"></span>
        <span style="float: right; margin-right: 10px" class="demonstration">{{
          albumResponse.createdDate | formatDateTime
        }}</span>
        <div
          style="background: #67c23a; color: white; font-size: 20px; text-align: center"
        >
          <el-button
            @click="download1(albumResponse.id)"
            style="background: #67c23a; margin-left: 10px; border: none"
          >
            <span style="color: white">Tải xuống</span> &nbsp;
            <i style="color: white" class="el-icon-download"></i>
          </el-button>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import AlbumService from "@/services/AlbumService";
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
      listIdApproveAlbum: [],
      pageList: [3, 6, 8, 10],
      multipleSelectionEmployee: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      employeeData: [],
      statusEmployee: [],
      departmentList: [],
      idList: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        albumType: "",
        date: "",
      },
      albumResponseList: [],
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
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
      this.$confirm("Bạn có chắc chắn muốn xóa nhân viên đã chọn?", "Thông báo!");
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
      if (this.dataSearch.date == null) {
        this.dataSearch.date = "";
      }
      this.searchByProperties();
    },
    searchByProperties() {
      AlbumService.searchalbumNewWeb(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.date,
        this.dataSearch.albumType
      )
        .then((resp) => {
          this.albumResponseList = resp.data.data.listAllAlbum;
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
    download1(id) {
      AlbumService.dowloadAlbumWeb(id)
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
      this.$confirm("Bạn có chắc chắn muốn xóa Album ảnh đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
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
  },

  beforeMount() {
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
