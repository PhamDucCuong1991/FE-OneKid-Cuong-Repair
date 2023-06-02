<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="20vh"
      title="Cấp thêm SMS cho đại lý"
    >
      <el-form
        label-width="140px"
        :model="createAgentSmsRequest"
        label-position="left"
        :rules="rules"
        ref="createAgentSmsRequest"
      >
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Cấp thêm SMS" prop="smsAdd">
                <el-input
                  placeholder="Nhập số SMS muốn thêm..."
                  v-model="createAgentSmsRequest.smsAdd"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="Nội dung" prop="content">
                <el-input v-model="createAgentSmsRequest.content"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="tab-infor-button">
          <el-button
            type="danger"
            size="medium"
            @click="closeDialogByButton('createAgentSmsRequest')"
          >
            <i class="el-icon-circle-close" />
            <span>Đóng</span>
          </el-button>
          <el-button
            type="success"
            size="medium"
            :loading="loadingButton"
            mini
            @click="submitForm('createAgentSmsRequest')"
          >
            <i class="el-icon-circle-check" />
            <span>Lưu</span>
          </el-button>
        </div>
      </el-form>
      {{ idAgentList }}
    </el-dialog>
  </div>
</template>

<script>
import AgentService from "@/services/AgentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,

      createAgentSmsRequest: {
        idAgentList: [],
        smsAdd: "",
        content: "",
      },
      rules: {
        smsAdd: [
          {
            required: true,
            message: "Không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetFormData() {
      this.$refs["createAgentSmsRequest"].resetFields();
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["createAgentSmsRequest"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
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
          let newAgent = this.createAgentSmsRequest;
          console.log(newAgent);
          AgentService.addSmsAgent(newAgent)
            .then(() => {
              this.$message({
                message: "Cấp thêm SMS cho đại lý thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch(() => {
              this.$message({
                message: "Cấp thêm SMS cho đại lý thất bại",
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
    handleRemove(file) {
      // this.$refs.upload.clearFiles();
      setTimeout(() => {
        this.showUpload = !this.showUpload;
      }, 950);

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
      this.showUpload = !this.showUpload;
      this.fileAvatar = file.raw;
      this.formAllTabAgent.createEmployeeMainInfoRequest.avatar = this.fileAvatar.name;
      this.fileList = fileList;
    },
    getAgentSelected(data) {
      this.createAgentSmsRequest.idAgentList = data;
    },
  },
};
</script>
<style>
.hideUpload > div {
  visibility: hidden;
}
</style>
<style lang="scss" scoped>
// /deep/.el-input__inner,
// /deep/.el-textarea__inner {
//   border: none;
//   border-radius: 0;
//   resize: none;
//   padding-left: 0;
//   padding-right: 0;
//   border-bottom: 1px solid #d9d9d9;
// }

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
