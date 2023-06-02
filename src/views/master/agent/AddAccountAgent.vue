<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
      title="Thêm tài khoản cho đại lý"
      border
    >
      <el-form
        label-width="140px"
        :model="createAccountAgentRequest"
        label-position="left"
        :rules="rules"
        ref="createAccountAgentRequest"
      >
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Username" prop="username">
                <el-input
                  v-model.trim="createAccountAgentRequest.username"
                  placeholder="Nhập username"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Password" prop="password">
                <el-input
                  v-model.trim="createAccountAgentRequest.password"
                  placeholder="Nhập password"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Chọn đại lý" prop="idAgent">
                <el-select
                  v-model="createAccountAgentRequest.idAgent"
                  class="button-left"
                  @change="getAllAccountAgent()"
                  placeholder="Chọn đại lý"
                  clearable
                >
                  <el-option
                    v-for="item in agentList"
                    :key="item.id"
                    :label="item.agentName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Họ tên" prop="fullName">
                <el-input
                  v-model="createAccountAgentRequest.fullName"
                  placeholder="Nhập họ tên"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Ngày sinh" prop="birthDay">
                <el-date-picker
                  v-model="createAccountAgentRequest.birthDay"
                  format="dd-MM-yyyy"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày sinh"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Số điện thoại" prop="phone">
                <el-input
                  v-model="createAccountAgentRequest.phone"
                  type="number"
                  placeholder="Nhập số điện thoại"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="createAccountAgentRequest.email"
                  placeholder="Nhập email"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item prop="gender" label="Giới tính">
                <el-radio-group v-model="createAccountAgentRequest.gender">
                  <el-radio label="Nam">Nam</el-radio>
                  <el-radio style="margin-left: 30px" label="Nữ">Nữ</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Ghi chú" prop="note">
                <el-input
                  v-model="createAccountAgentRequest.note"
                  type="textarea"
                  :rows="3"
                  style="width: 100%"
                  placeholder="Nhập ghi chú"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="tab-infor-button">
          <el-button
            type="danger"
            size="medium"
            @click="closeDialogByButton('createAccountAgentRequest')"
          >
            <i class="el-icon-circle-close" />
            <span>Đóng</span>
          </el-button>
          <el-button
            type="success"
            size="medium"
            :loading="loadingButton"
            mini
            @click="submitForm('createAccountAgentRequest')"
          >
            <i class="el-icon-circle-check" />
            <span>Lưu</span>
          </el-button>
        </div>
      </el-form>
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
      agentList: "",
      loadingButton: false,
      createAccountAgentRequest: {
        username: "",
        password: "",
        idAgent: "",
        active: true,
        fullName: "",
        birthDay: "",
        phone: "",
        email: "",
        gender: "",
        note: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      rules: {
        username: [
          {
            required: true,
            message: "Username không được để trống",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9@.]*$/,
            message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Username lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Password không được để trống",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9@.]*$/,
            message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Password phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
        ],
        idAgent: [
          {
            required: true,
            message: "Đại lý không được để trống",
            trigger: "blur",
          },
        ],
        gender: [
          {
            required: true,
            message: "Giới tính không được để trống",
            trigger: "change",
          },
        ],
        active: [
          {
            required: true,
            message: "Trạng thái không được để trống",
            trigger: "change",
          },
        ],
        fullName: [
          {
            required: true,
            message: "Họ tên không được để trống",
            trigger: "blur",
          },
        ],
        phone: [
          {
            min: 10,
            max: 10,
            message: "Số điện thoại bao gồm 10 số",
            trigger: "change",
          },
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    resetFormData() {
      this.$refs["createAccountAgentRequest"].resetFields();
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["createAccountAgentRequest"].resetFields();
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
          AgentService.createAccountAgent(this.createAccountAgentRequest)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
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
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        }
      });
    },
    getAllAgent() {
      AgentService.getAll()
        .then((res) => {
          this.agentList = res.data.data.agentList;
          this.agentList = this.agentList
            .slice(0)
            .sort((a, b) => (a.agentName < b.agentName ? this.sorting : -this.sorting));
        })
        .catch(() => {});
    },
    findAllAgentUnique() {
      AgentService.getAllAgentUnique()
        .then((resp) => {
          this.agentList = resp.data.data;
          this.agentList = this.agentList
            .slice(0)
            .sort((a, b) => (a.agentName < b.agentName ? this.sorting : -this.sorting));
        })
        .catch((err) => {
          console.log(err);
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
  },
  beforeMount() {
    this.getAllAccountAgent();
    this.findAllAgentUnique();
    this.getAllAgent();
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
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
