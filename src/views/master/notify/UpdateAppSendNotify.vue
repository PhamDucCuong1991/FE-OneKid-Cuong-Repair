<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Cập nhật thông báo hệ thống"
    >
      <el-form
        label-width="140px"
        :model="updateAppSend"
        label-position="left"
        :rules="rules"
        ref="updateAppSend"
      >
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Tiêu đề" prop="sendTitle">
                <el-input
                  placeholder="Nhập tiêu đề"
                  v-model="updateAppSend.sendTitle"
                ></el-input>
              </el-form-item>
              <el-form-item label="Nội dung" prop="sendContent">
                <el-input
                  :rows="15"
                  type="textarea"
                  placeholder="Nhập nội dung..."
                  v-model="updateAppSend.sendContent"
                ></el-input>
              </el-form-item>
              <el-form-item label="Chọn đại lý" prop="idAgent">
                <el-select
                  disabled
                  v-model="updateAppSend.idAgent"
                  class="button-left"
                  placeholder="-Chọn đại lý-"
                  clearable
                >
                  <el-option
                    v-for="item in agentListSearch"
                    :key="item.id"
                    :label="item.agentName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Chọn trường" prop="idSchool">
                <el-select
                  disabled
                  v-model="updateAppSend.idSchool"
                  class="button-left"
                  placeholder="-Chọn trường-"
                  clearable
                >
                  <el-option
                    v-for="item in schoolListSearch"
                    :key="item.id"
                    :label="item.schoolName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Đối tượng nhận" prop="appType">
                <el-checkbox-group
                  disabled
                  v-model="updateAppSend.appTypeArr"
                  size="mini"
                >
                  <el-checkbox label="plus">App Plus</el-checkbox>
                  <el-checkbox label="teacher">App Teacher</el-checkbox>
                  <el-checkbox label="onekids">App OneKids</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="File đính kèm" prop>
                <el-upload
                  action
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :auto-upload="false"
                  :on-change="toggleUpload"
                  :limit="5"
                  :on-exceed="handleExceed"
                  :file-list="updateAppSend.fileAttachAppSendResponseList"
                  :on-preview="handleFileRequest"
                  ref="upload"
                >
                  <!-- <el-button size="mini" type="primary">Tải lên</el-button> -->
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
          @click="closeDialogByButton('updateAppSend')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm('updateAppSend')"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AppSendService from "@/services/AppSendService";
// import AgentService from "@/services/AgentService";
import SchoolService from "@/services/SchoolService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      listClass: [],
      schoolListSearch: [],
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
      updateAppSend: {},
      multipartFileList: [],
      rules: {
        sendTitle: [
          {
            required: true,
            message: "Tiêu đề không được để trống",
            trigger: "blur",
          },
        ],
        sendContent: [
          {
            required: true,
            message: "Nội dung không được để trống",
            trigger: "blur",
          },
        ],
        appTypeArr: [
          {
            required: true,
            message: "Chọn ít nhất 1 đối tượng",
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
      this.$refs["updateAppSend"].resetFields();
      this.multipartFileList = [];
      this.$refs.upload.clearFiles();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.multipartFileList = [];
      // this.$refs.upload.clearFiles();
      this.$emit("dialog-close");

      this.showUpload = true;
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
    getAppSendNotifyByRow(data) {
      this.updateAppSend = data;
      let a = this.updateAppSend;
      console.log(a);
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let formDatas = new FormData();
          for (var key in this.updateAppSend) {
            formDatas.append(key, this.updateAppSend[key]);
          }
          if (this.multipartFileList.length > 0) {
            this.multipartFileList.forEach((element) => {
              formDatas.append("multipartFileList", element.raw);
            });
          }

          AppSendService.updateAppSendNotify(formDatas)
            .then(() => {
              this.$message({
                message: "Tạo thông báo thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Tạo thông báo thất bại",
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
    // getAllAgent() {
    //   AgentService.getAll().then((res) => {
    //     this.agentListSearch = res.data.data.agentList;
    //   });
    // },
    getAllSchool() {
      SchoolService.getAll().then((res) => {
        this.schoolListSearch = res.data.data.schoolList;
      });
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
