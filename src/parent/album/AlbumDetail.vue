<template>
  <div class="content">
    <el-form
      :model="updateAlbumRequest"
      :rules="rules"
      ref="updateAlbumRequest"
      label-width="120px"
      class="demo-ruleForm"
    >
      <!-- Vùng body  -->
      <div style="border: 1px solid rgb(96 99 102 / 19%)">
        <!--Vùng Tên Album-->
        <el-form-item style="width: 45%; float: left" label="Loại album">
          <span> {{ updateAlbumRequest.albumType }}</span>
        </el-form-item>
        <el-form-item style="width: 45%; float: right" label="Tên Album">
          <span>{{ updateAlbumRequest.albumName }}</span>
        </el-form-item>
        <el-form-item style="clear: both" label="Mô tả Album">
          <span>{{ updateAlbumRequest.albumDescription }}</span>
        </el-form-item>
        <!--Vùng ảnh-->
        <div style="max-height: 492px; overflow: scroll">
          <h3 style="margin-left: 35px; margin-bottom: 20px; margin-top: -39px">
            Ảnh được chọn
          </h3>
          <el-progress
            style="width: 25%; float: left; margin-top: 23px"
            v-if="showProgress"
            :percentage="percentage"
            :color="colors"
          ></el-progress>
          <el-dialog width="30%" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>

          <h3 style="margin-left: 20px">
            Danh sách ảnh album: {{ this.updateAlbumRequest.albumName }}
          </h3>
          <hr style="width: 98%; margin-top: -18px" />
          <el-row
            style="width: 100%; margin-top: 10px"
            class="demo-image__placeholder"
            v-if="
              Array.isArray(updateAlbumRequest.pictureList) &&
              updateAlbumRequest.pictureList.length
            "
          >
            <div
              v-for="(listPicture, index) in updateAlbumRequest.pictureList"
              class="inline-block"
              :key="listPicture"
              style="float: left; margin: 14px; border: 1px solid #dcdfe6; width: 160px"
            >
              <el-tooltip content="Xem ảnh" placement="top">
                <el-image
                  @click="handleShowDetailPicture(index)"
                  :src="listPicture.replace('/Albumanh/', '/Albumanh/thumbnail_')"
                  style="width: 100%; height: 160px"
                  class="el-image-opacity"
                ></el-image>
              </el-tooltip>
              <div></div>
            </div>
            <el-dialog width="40%" :visible.sync="dialogVisiblePic">
              <img width="100%" :src="updateAlbumRequest.pictureList[indexSrc]" alt />
            </el-dialog>
          </el-row>
        </div>
      </div>
      <!-- Vùng nút trái -->
      <div style="margin-top: 20px; float: left">
        <span style="font-weight: bold">Người đăng :</span>
        <span
          >{{ updateAlbumRequest.createdBy }} |
          {{ updateAlbumRequest.pictureApprovedNumber }}/{{
            updateAlbumRequest.pictureNumber
          }}
          ảnh | {{ updateAlbumRequest.createdDate | formatDate }}</span
        >
      </div>
      <!-- Vùng nút phải -->
      <div style="margin-top: 20px; float: right">
        <router-link style="text-decoration: none" to="/parent/album" class="router-link">
          <el-button class="button-over" type="success">
            <i class="el-icon-back" />
            quay lại
          </el-button>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import AlbumService from "../../services/AlbumService";
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
      interval: "",
      showProgress: false,
      listClass: [],
      updateAlbumRequest: {},
      rules: {
        albumName: [
          {
            required: true,
            message: "Tên Album không được được để trống",
            trigger: "blur",
          },
        ],
      },
      // files: [],
      selectedFiles: undefined,
      currentFile: undefined,
      fileInfos: [],
      layout: "sizes, prev, pager, next",
      // fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogVisiblePic: false,
      indexSrc: 0,
      disabled: false,
      showCreateDialog: false,
      showUpdateDialog: false,
      idList: [],
    };
  },
  methods: {
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
      this.updateAlbumRequest.fileList = fileList;
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
          if (
            this.updateAlbumRequest.fileList != "undefined" &&
            this.updateAlbumRequest.fileList != null &&
            this.updateAlbumRequest.fileList.length != null &&
            this.updateAlbumRequest.fileList.length > 0
          ) {
            this.updateAlbumRequest.fileList.forEach((element) => {
              formData.append("fileList", element.raw);
            });
          }
          formData.append("albumName", this.updateAlbumRequest.albumName);
          formData.append("albumDescription", this.updateAlbumRequest.albumDescription);
          formData.append("albumType", this.updateAlbumRequest.albumType);
          formData.append(
            "albumApprovalDefault",
            this.updateAlbumRequest.albumApprovalDefault
          );
          formData.append("idSchoolApproval", this.updateAlbumRequest.idSchoolApproval);
          formData.append(
            "schoolApprovalDate",
            this.updateAlbumRequest.schoolApprovalDate
          );
          formData.append("urlPictureFirst", this.updateAlbumRequest.urlPictureFirst);
          formData.append("pictureNumber", this.updateAlbumRequest.pictureNumber);
          formData.append(
            "pictureApprovedNumber",
            this.updateAlbumRequest.pictureApprovedNumber
          );
          formData.append("idClass", this.updateAlbumRequest.idClass);
          formData.append("idSchool", this.updateAlbumRequest.idSchool);
          formData.append("id", this.updateAlbumRequest.id);
          formData.append("listPictureList", this.updateAlbumRequest.pictureList);

          this.increase();
          let a = this.updateAlbumRequest;
          console.log(a);
          AlbumService.updateAlbumUpload(formData)
            .then((res) => {
              let a = res.data.data;
              if (a) {
                this.stopIncrease();
                this.$message({
                  message: "Cập nhật Album thành công",
                  type: "success",
                });
                // this.$router.go(
                //   "/student-quality/album-detail/" + this.updateAlbumRequest.id
                // );
                this.showProgress = false;

                this.getAlumDetail();
              } else {
                clearInterval(this.interval);
                this.$message({
                  message: "Cập nhật Album thất bại,Số lượng ảnh trong Album vượt 30",
                  type: "error",
                });
                // this.$router.push(
                //   "/student-quality/album-detail/" + this.updateAlbumRequest.id
                // );

                this.getAlumDetail();
                this.showProgress = false;
              }
            })
            .catch((err) => {
              clearInterval(this.interval);
              this.updateAlbumRequest.pictureList = [];
              console.log(err);
              this.$message({
                message: "Cập nhật Album thất bại",
                type: "error",
              });
            })
            .finally(() => {
              this.$refs.upload.clearFiles();
              this.updateAlbumRequest.pictureList = [];
            });
        }
      });
    },
    handleCommand(command) {
      if (command == "activeAccount") {
        this.updateMultiActivated();
      } else if (command == "unactiveAccount") {
        this.updateMultiUnActivated();
      } else if (command == "deleteMultiEmployee") {
        this.handleMultiDelelte();
      } else if (command == "exportExcel") {
        this.exportExcelEmployee();
      }
    },
    handleRemove(file) {
      let a = this.updateAlbumRequest.fileList;
      console.log(a);
      let index = this.updateAlbumRequest.fileList.indexOf(file);
      if (index >= 0) {
        this.updateAlbumRequest.fileList.splice(index, 1);
      }
    },
    handleExceed() {
      this.$message.warning(`Chỉ được phép chọn tối đa 30 ảnh`);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleShowDetailPicture(index) {
      this.indexSrc = index;
      let a = this.indexSrc;
      this.dialogVisiblePic = true;
      console.log(a);
    },
    handleDownload(file) {
      console.log(file);
    },
    //click edit at row
    handleEdit(index, row) {
      console.log(row);
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
    handleFilesUpload() {
      let uploadedFiles = this.$refs.files.files;
      /*
          Adds the uploaded file to the files array
        */
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i]);
      }
    },
    addFiles() {
      this.$refs.files.click();
    },
    getAlumDetail() {
      AlbumService.getAlbumByIdWeb(this.$route.params.id)
        .then((res) => {
          this.updateAlbumRequest = res.data.data;
          let a = this.updateAlbumRequest;
          console.log(a);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  beforeMount() {
    this.getAlumDetail();
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
  /deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto;
    margin-top: -1px;
  }
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

/deep/.el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 146px;
  margin-left: 35px;
  vertical-align: top;
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
