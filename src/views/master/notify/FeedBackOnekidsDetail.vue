<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
      :title="
        feedBackDetail.type +
        ': ' +
        feedBackDetail.createdBy +
        ' - ' +
        feedBackDetail.hidden
      "
    >
      <el-form
        label-width="140px"
        :model="feedBackDetail"
        label-position="left"
        :rules="rules"
        ref="feedBackDetail"
      >
        <span style="float: right">{{
          feedBackDetail.createdDate | formatDateTime
        }}</span>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Tiêu đề" prop="feedbackTitle">
                <el-input
                  placeholder="Nhập tiêu đề"
                  v-model="feedBackDetail.feedbackTitle"
                ></el-input>
              </el-form-item>
              <el-form-item label="Nội dung" prop="feedbackContent">
                <el-input
                  type="textarea"
                  :rows="10"
                  placeholder="Nhập nội dung"
                  v-model="feedBackDetail.feedbackContent"
                ></el-input>
              </el-form-item>
              <el-form-item label="Ảnh đính kèm" prop="attachFile">
                <el-upload
                  action
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :auto-upload="false"
                  multiple
                  :limit="5"
                  :on-exceed="handleExceed"
                  :file-list="feedBackDetail.fileList"
                  ref="upload"
                >
                  <!-- <el-button size="mini" type="primary">Tải lên</el-button> -->
                </el-upload>
              </el-form-item>

              <el-form-item label="Nhà trường trả lời">
                <span v-if="feedBackDetail.schoolReplyDel" style="color: red"
                  >Nội dung đã được thu hồi</span
                >
                <el-input
                  v-else
                  type="textarea"
                  :rows="5"
                  v-model="feedBackDetail.schoolReply"
                ></el-input>
                <span v-if="feedBackDetail.feedBackDel">Đã thu hồi</span>
              </el-form-item>
              <span style="float: right"
                >Xác nhận :{{ feedBackDetail.confirmDate | formatDateTime }} -
                {{ feedBackDetail.confirmName }} &nbsp; | &nbsp; Trả lời:{{
                  feedBackDetail.schoolTimeReply | formatDateTime
                }}
                - {{ feedBackDetail.replyName }}</span
              >
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import FeedBackOneKidsService from "@/services/FeedBackOneKidsService";
import AppSendService from "@/services/AppSendService";
import AgentService from "@/services/AgentService";
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
      feedBackDetail: {},
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
      },
    };
  },
  methods: {
    getFeedBackDetail(id) {
      FeedBackOneKidsService.viewDetailFeedbackAdmin(id)
        .then((resp) => (this.feedBackDetail = resp.data.data))
        .catch((err) => {
          this.feedBackDetail = {};
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    handleExceed() {
      this.$message.warning(`Bạn chỉ được chọn 5 file`);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.feedBackDetail.fileList = [];
      this.$refs.upload.clearFiles();
      this.$refs["feedBackDetail"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$refs.upload.clearFiles();
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
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let formDatas = new FormData();
          for (var key in this.feedBackDetail) {
            formDatas.append(key, this.feedBackDetail[key]);
          }
          if (this.multipartFileList.length > 0) {
            this.multipartFileList.forEach((element) => {
              formDatas.append("multipartFileList", element.raw);
            });
          }

          AppSendService.createAppSendNotify(formDatas)
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
    getAllAgent() {
      AgentService.getAll().then((res) => {
        this.agentListSearch = res.data.data.agentList;
      });
    },

    getAllSchool() {
      SchoolService.getAll().then((res) => {
        this.schoolListSearch = res.data.data.schoolList;
      });
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
