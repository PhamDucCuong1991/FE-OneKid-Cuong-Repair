<template>
  <div class="content">
    <el-form
      :model="createAlbumRequest"
      :rules="rules"
      ref="createAlbumRequest"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div style="border: 1px solid rgb(96 99 102 / 19%)">
        <div style="margin-top: 20px">
          <el-form-item
            prop="idClass"
            style="float: right; margin-right: 100px"
            label="Lớp / Trường"
          >
            <el-select
              v-model="createAlbumRequest.idClass"
              filterable
              placeholder="Album đăng cho trường hoặc lớp"
            >
              <el-option value="0" label="Trường"></el-option>
              <el-option
                v-for="item in listClass"
                :key="item.id"
                :label="item.className"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            style="display: inline-block"
            label="Tên Album"
            prop="albumName"
          >
            <el-input
              v-model="createAlbumRequest.albumName"
              placeholder="Nhập tên album"
            ></el-input>
          </el-form-item>

          <el-form-item style="clear: both" label="Mô tả" prop="desc">
            <el-input
              :rows="2"
              v-model="createAlbumRequest.albumDescription"
              placeholder="Nhập mô tả"
              type="textarea"
            ></el-input>
          </el-form-item>
        </div>
        <span style="margin: 40px; color: orange; margin-top: -30px"
          >Chọn tối đa 30 ảnh</span
        >
        <el-progress
          style="width: 25%; float: left; margin-top: 30px"
          v-if="showProgress"
          :percentage="percentage"
          :color="colors"
        ></el-progress>
        <el-upload
          style="margin-left: 35px; clear: both"
          action="/api/upload/"
          list-type="picture-card"
          :auto-upload="false"
          :file-list="fileList"
          :on-change="handleChangePicture"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          ref="upload"
          :limit="30"
          :on-exceed="handleExceed"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i slot="default" class="el-icon-plus" style="font-style: normal"
            >Thêm Ảnh</i
          >
          <div slot="file" slot-scope="{ file }">
            <span style="background: orange; padding: 5px">Mới</span>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                @click="handleRemove"
                v-if="!disabled"
                class="el-upload-list__item-delete"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog width="30%" :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </div>
      <div style="margin-top: 20px; float: right">
        <el-button
          class="button-over"
          type="success"
          :loading="loadingButton"
          @click="submitUpload('createAlbumRequest')"
        >
          <i class="el-icon-circle-check" />
          Lưu thay đổi
        </el-button>

        <router-link
          style="text-decoration: none"
          to="/student-quality/album"
          class="router-link"
        >
          <el-button
            style="margin-left: 10px"
            class="button-over"
            type="danger"
            @click="createEmployeeDialog()"
          >
            <i class="el-icon-circle-close" />
            Hủy
          </el-button>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import MaClassService from "../../services/MaClassService";
import AlbumService from "../../services/AlbumService";
import {mapActions, mapState} from "vuex";
export default {
  components: {},
  data() {
    return {
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      percentage: 0,
      loadingButton: false,
      createAlbumRequest: {
        albumName: "",
        albumDescription: "",
        albumType: "",
        albumApprovalDefault: false,
        idSchoolApproval: "",
        createdBy: "",
        createdDate: "",
        schoolApprovalDate: "",
        urlPictureFirst: "",
        pictureNumber: "",
        pictureApprovedNumber: "",
        idClass: "",
        idSchool: "",
        alistPictureList: [],
      },
      listClass: [],
      rules: {
        albumName: [
          {
            required: true,
            message: "Tên Album không được được để trống",
            trigger: "blur",
          },
        ],
        idClass: [
          {
            required: true,
            message: "Lớp không được để trống",
            trigger: "blur",
          },
        ],
      },
      // files: [],
      selectedFiles: undefined,
      currentFile: undefined,
      fileInfos: [],
      layout: "sizes, prev, pager, next",
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogVisiblePic: false,
      indexSrc: "",
      disabled: false,
      showCreateDialog: false,
      showUpdateDialog: false,
      idList: [],
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
      imgUrl: "",
    };
  },
  computed:{
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    increase() {
      this.interval = window.setInterval(() => {
        this.percentage += 5;
        if (this.percentage > 90) {
          this.percentage = 90;
        }
      }, 50);
    },
    stopIncrease() {
      clearInterval(this.interval);
      this.percentage = 100;
    },
    handleChangePicture(file, fileList) {
      this.createAlbumRequest.fileList = fileList;
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG && !isPNG) {
        this.$message.error("Ảnh phải có dạng JPG hoặc PNG!");
        this.handleRemove(file);
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không thể vượt quá 5MB");
        this.handleRemove(file);
      }

      return isJPG && isLt5M;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      row.id;
    },
    submitUpload(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.showProgress = true;
          let formData = new FormData();
          this.loadingButton = true;
          if (
            this.createAlbumRequest.fileList !== "undefined" &&
            this.createAlbumRequest.fileList != null &&
            this.createAlbumRequest.fileList.length != null &&
            this.createAlbumRequest.fileList.length > 0
          ) {
            this.createAlbumRequest.fileList.forEach((element) => {
              formData.append("multipartFileList", element.raw);
            });
          }
          formData.append("albumName", this.createAlbumRequest.albumName);
          formData.append(
            "albumDescription",
            this.createAlbumRequest.albumDescription
          );
          formData.append("albumType", this.createAlbumRequest.albumType);
          formData.append(
            "albumApprovalDefault",
            this.createAlbumRequest.albumApprovalDefault
          );
          formData.append(
            "idSchoolApproval",
            this.createAlbumRequest.idSchoolApproval
          );
          formData.append(
            "schoolApprovalDate",
            this.createAlbumRequest.schoolApprovalDate
          );
          formData.append(
            "urlPictureFirst",
            this.createAlbumRequest.urlPictureFirst
          );
          formData.append(
            "pictureNumber",
            this.createAlbumRequest.pictureNumber
          );
          formData.append(
            "pictureApprovedNumber",
            this.createAlbumRequest.pictureApprovedNumber
          );
          formData.append("idClass", this.createAlbumRequest.idClass);
          formData.append("idSchool", this.createAlbumRequest.idSchool);
          formData.append(
            "listPictureList",
            this.createAlbumRequest.alistPictureList
          );
          this.increase();
          AlbumService.createAlbumUpload(formData)
            .then((res) => {
              console.log(res.data);
              this.$message({
                message: "Thêm mới Album thành công",
                type: "success",
              });
              this.showProgress = false;
              this.stopIncrease();
              this.$router.push("/student-quality/album");
            })
            .catch((err) => {
              this.showProgress = false;
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        }
      });
    },
    handleCommand(command) {
      if (command === "activeAccount") {
        this.updateMultiActivated();
      } else if (command === "unactiveAccount") {
        this.updateMultiUnActivated();
      } else if (command === "deleteMultiEmployee") {
        this.handleMultiDelelte();
      } else if (command === "exportExcel") {
        this.exportExcelEmployee();
      }
    },
    handleRemove(file) {
      this.$refs.upload.clearFiles();
      let a = this.createAlbumRequest.fileList;
      console.log(a);
      let index = this.createAlbumRequest.fileList.indexOf(file);
      if (index >= 0) {
        this.createAlbumRequest.fileList.splice(index, 1);
      }
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleShowDetailPicture(index) {
      this.indexSrc = index;
      this.dialogVisiblePic = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    //click edit at row
    handleEdit(index, row) {
      console.log(row);
    },
    createEmployeeDialog() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
    },
    handleFile(file) {
      console.log(file);
    },
    getClass() {
     this.listClass = mapState(['serverDataClass']);
    },
    handleExceed() {
      this.$message.warning(`Chỉ được phép chọn tối đa 30 ảnh`);
    },
    beforeRemove(file, fileList) {
      console.log(fileList);
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },
  },
  beforeMount() {
    this.getClass();
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
// li.el-select-dropdown__item.hover {
//   // background: rgb(111, 142, 189);
// }
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

/deep/.el-checkbox__inner {
  border: 1px solid green;
}
/deep/.el-select .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  // height: 65px;
  line-height: 65px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 150px;
}
/deep/.el-input .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  // height: 65px;
  line-height: 65px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 300px;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 94%;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/deep/input.el-input__inner {
  height: 37px;
}
/deep/[data-v-1fb81136] input.el-input__inner {
  height: 37px;
  border: none;
  border-bottom: 1px solid #80808057;
}

.el-image-opacity:hover {
  opacity: 5 !important;
  border: 1px solid #409eff;
}
.el-image-opacity {
  cursor: pointer;
  opacity: 5 !important;
  border: 1px solid grey;
}
// /deep/.el-select-dropdown__item.hover,
// .el-select-dropdown__item:hover {
//   background-color: #e8e8e8;
//   color: red;
// }
/deep/.el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  color: #ffffff;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px !important;
}
</style>
