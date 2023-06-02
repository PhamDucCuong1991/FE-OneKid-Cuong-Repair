<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Thêm tài khoản cho trường học"
      border
    >
      <el-form
        label-width="140px"
        :model="createAccountSchoolRequest"
        label-position="left"
        :rules="rules"
        ref="createAccountSchoolRequest"
      >
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Tên tài khoản" prop="username">
                <el-input
                  v-model.trim="createAccountSchoolRequest.username"
                  placeholder="Nhập username"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Mật khẩu" prop="password">
                <el-input
                  v-model.trim="createAccountSchoolRequest.password"
                  placeholder="Nhập password"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Chọn Trường" prop="idSchool">
                <el-select
                  v-model="createAccountSchoolRequest.idSchool"
                  class="button-left"
                  placeholder="Chọn Trường"
                  clearable
                >
                  <el-option
                    v-for="item in schoolList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.id+' - '+item.schoolName"
                  >
                    <span>{{ item.id }}</span> -
                    <span>{{ item.schoolName }}</span>
                  </el-option>
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
                  v-model="createAccountSchoolRequest.fullName"
                  placeholder="Nhập họ tên"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Ngày sinh" prop="birthDay">
                <el-date-picker
                  v-model="createAccountSchoolRequest.birthDay"
                  format="dd-MM-yyyy"
                  type="date"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
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
                  type="number"
                  v-model="createAccountSchoolRequest.phone"
                  placeholder="Nhập số điện thoại"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="createAccountSchoolRequest.email"
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
                <el-radio-group v-model="createAccountSchoolRequest.gender">
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
                  v-model="createAccountSchoolRequest.note"
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
            @click="closeDialogByButton('createAccountSchoolRequest')"
          >
            <i class="el-icon-circle-close" />
            <span>Đóng</span>
          </el-button>
          <el-button
            type="success"
            size="medium"
            :loading="loadingButton"
            mini
            @click="submitForm('createAccountSchoolRequest')"
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
import SchoolService from "@/services/SchoolService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      schoolList: "",
      loadingButton: false,
      createAccountSchoolRequest: {
        username: "",
        password: "",
        idSchool: "",
        active: "",
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
            message: "Tên tài khoản không được để trống",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9@.]*$/,
            message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Tên tài khoản phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Mật khẩu không được để trống",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9@.]*$/,
            message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
        ],
        idSchool: [
          {
            required: true,
            message: "Trường không được để trống",
            trigger: "blur",
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
        gender: [
          {
            required: true,
            message: "Giới tính không được để trống",
            trigger: "change",
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
      this.$refs["createAccountSchoolRequest"].resetFields();
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["createAccountSchoolRequest"].resetFields();
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
          let newSchool = this.createAccountSchoolRequest;
          console.log(newSchool);
          SchoolService.createAccountSchool(newSchool)
            .then(() => {
              this.$message({
                message: "Thêm mới tài khoản cho trường thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              let textError = err.response.data.error;
              if (textError == "Đã tồn tại username và apptype tương ứng") {
                this.$message({
                  message: "Username đã tồn tại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Thêm mới tài khoản cho trường thất bại",
                  type: "error",
                });
              }
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        }
      });
    },
    getAllSchool(idAgent) {
      SchoolService.getSchoolInAgent(idAgent)
        .then((res) => {
          this.schoolList = res.data.data;
        })
        .catch(() => {});
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
      this.formAllTabSchool.createEmployeeMainInfoRequest.avatar =
        this.fileAvatar.name;
      this.fileList = fileList;
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
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
