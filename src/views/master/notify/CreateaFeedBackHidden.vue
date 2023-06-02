<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
      title="Tạo góp ý ẩn danh"
    >
      <el-form
        label-width="140px"
        :model="feedBackHidden"
        label-position="left"
        :rules="rules"
        ref="feedBackHidden"
      >
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Tiêu đề" prop="feedbackTitle">
                <el-input
                  placeholder="Nhập tiêu đề"
                  v-model="feedBackHidden.feedbackTitle"
                ></el-input>
              </el-form-item>
              <el-form-item label="Nội dung" prop="feedbackContent">
                <el-input
                  type="textarea"
                  placeholder="Nhập nội dung"
                  :rows="10"
                  v-model="feedBackHidden.feedbackContent"
                ></el-input>
              </el-form-item>
              <el-form-item label="Chọn trường" prop="idSchool">
                <el-select
                  v-model="feedBackHidden.idSchool"
                  class="button-left"
                  placeholder="Chọn trường"
                  clearable
                  @change="handleChangeSelect"
                >
                  <el-option
                    v-for="item in schoolInAgentList"
                    :key="item.id"
                    :label="item.schoolName"
                    :value="item.id"
                  >
                    <span>{{ item.schoolName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="display: inline-block; width: 30%"
                label="Đối tượng nhận"
              >
                <span>Phụ huynh</span>
              </el-form-item>
              <el-form-item style="float: right; width: 70%" label="Loại góp ý">
                <span>Ẩn danh</span>
              </el-form-item>
              <el-form-item label="Ảnh đính kèm" prop="attachFile">
                <el-upload
                  action
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :auto-upload="false"
                  multiple
                  :on-change="toggleUpload"
                  :limit="5"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  :on-preview="handleFileRequest"
                  ref="upload"
                >
                  <el-button size="mini" type="primary">Tải lên</el-button>
                </el-upload>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="tab-infor-button">
        <el-button
          type="danger"
          size="medium"
          @click="closeDialogByButton('feedBackHidden')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm('feedBackHidden')"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FeedBackOneKidsService from "@/services/FeedBackOneKidsService";
import SchoolService from "@/services/SchoolService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      checkIdAgent: true,
      checkIdSchool: true,
      checkIdClass: true,
      listClass: [],
      schoolInAgentList: [],
      agentListSearch: [],
      checkboxGroup2: [],
      fileList: [],
      fileAvatar: "",
      showUpload: true,
      dialogImageUrl: "",
      dialogVisible1: false,
      disabled: false,

      value: "",
      loadingButton: false,
      feedBackHidden: {
        feedbackTitle: "",
        feedbackContent: "",
        idSchool: "",
      },
      multipartFileList: [],
      rules: {
        feedbackTitle: [
          {
            required: true,
            message: "Tiêu đề không được để trống",
            trigger: "blur",
          },
        ],
        feedbackContent: [
          {
            required: true,
            message: "Nội dung không được để trống",
            trigger: "blur",
          },
        ],
        idSchool: [
          {
            required: true,
            message: "Bạn chưa chọn trường",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleExceed() {
      this.$message.warning(`Bạn chỉ được chọn 5 file`);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["feedBackHidden"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs.upload.clearFiles();
      this.multipartFileList = [];
      this.$refs[fromData].resetFields();
      // this.showUpload = true;
      this.$emit("dialog-close");
    },
    handleClose(done) {
      this.$confirm("Are you sure to close this dialog?")
        .then((_) => {
          console.log(_);
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let formDatas = new FormData();
          for (var key in this.feedBackHidden) {
            formDatas.append(key, this.feedBackHidden[key]);
          }
          if (this.multipartFileList.length > 0) {
            this.multipartFileList.forEach((element) => {
              formDatas.append("multipartFileList", element.raw);
            });
          }
          let a = this.multipartFileList;
          console.log(a);
          FeedBackOneKidsService.createFeedBackOnekids(formDatas)
            .then(() => {
              this.$message({
                message: "Tạo góp ý ẩn danh thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });

              console.log(err);
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    uploadAvatar() {
      // EmployeeDataService.uploadAvatar(formData);
    },
    handleRemove(file) {
      // this.$refs.upload.clearFiles();
      let index = this.fileList.indexOf(file);
      if (index >= 0) {
        this.fileList.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    toggleUpload(file, fileList) {
      this.fileAvatar = file.raw;
      this.multipartFileList = fileList;
    },

    getAllSchool(idAgent) {
      SchoolService.getSchoolInAgent(idAgent).then((res) => {
        this.schoolInAgentList = res.data.data;
      });
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file) {
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },
  },
};
</script>
<style></style>
<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-button--primary {
  width: 100%;
  background: #409eff;
}
/deep/.upload-demo {
  text-align: center;
  .el-upload {
    width: 100%;
  }
}
/deep/.el-avatar {
  display: inline;
  img {
    border-radius: 5px;
    width: 100%;
  }
}
/deep/.el-input.is-disabled .el-input__inner {
  text-align: center;
  color: #d13b93;
  font-weight: bold;
}
.el-select {
  display: block;
}

.tab-infor-button {
  text-align: right;
  margin-top: 20px;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.group-radio-status {
  margin: 0 50px;
  .kids-status {
    margin-bottom: 10px;
  }
}
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #67c23a;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
.table-icon-1 {
  width: 30%;
  margin-left: 15%;
  display: inline-block;
}
.table-icon-2 {
  width: 30%;
  margin-right: 15%;
  float: right;
}
</style>
