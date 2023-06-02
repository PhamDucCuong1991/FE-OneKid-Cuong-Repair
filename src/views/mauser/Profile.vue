<template>
  <el-dialog
    title="Cập nhật trang cá nhân"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="130px"
      :model="userData"
      label-position="left"
      :rules="rules"
      ref="userData"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-image
            v-if="userData.avatar != null && showPicutreInitial"
            style="width: 150px; height: 150px; float: left; margin-bottom: 20px"
            :src="userData.avatar"
            fit="fill"
          ></el-image>
          <el-upload
            class="avatar-uploader"
            :show-file-list="true"
            list-type="picture-card"
            :on-change="handleChangeUpload"
            :on-remove="handleRemove"
            :auto-upload="false"
            :class="{ hideUpload: !showUpload }"
            limit="1"
            ref="upload"
          >
            <span v-if="userData.avatar != null">
              <i class="el-icon-plus" style="font-size: 20px">Cập nhật ảnh</i>
            </span>
            <span v-else>
              <i class="el-icon-plus" style="font-size: 20px">Thêm ảnh</i>
            </span>
          </el-upload>
        </el-col>
        <el-col :span="17">
          <el-form-item label="Tài khoản" prop="username">
            <el-input disabled v-model="userData.username"></el-input>
          </el-form-item>
          <el-form-item label="Nickname/Họ tên" prop="fullName">
            <el-input
              v-model="userData.fullName"
              placeholder="Nhập Nickname/Họ tên"
            ></el-input>
          </el-form-item>
          <el-form-item label="Số điện thoại" prop="phone">
            <el-tooltip effect="dark" content="Số điện thoại nhận SMS" placement="top">
              <el-input
                v-model="userData.phone"
                type="number"
                placeholder="Nhập số điện thoại"
              ></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="Giới tính" prop="gender">
            <el-radio-group v-model="userData.gender">
              <el-radio label="Nam">Nam</el-radio>
              <el-radio label="Nữ">Nữ</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="userData.appType == 'parent'" label="Ngày sinh">
            <el-date-picker
              v-model="userData.birthday"
              format="dd-MM-yyyy"
              type="date"
              :picker-options="pickerOptions"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              placeholder="Chọn ngày sinh"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-else label="Ngày sinh" prop="birthday">
            <el-date-picker
              v-model="userData.birthday"
              format="dd-MM-yyyy"
              type="date"
              :picker-options="pickerOptions"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              placeholder="Chọn ngày sinh"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="userData.email" placeholder="Nhập email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('userData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('userData')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MaUserService from "@/services/MaUserService";
import CommonOnekidsService from "@/services/CommonOnekidsService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      passwordData: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      userData: {},
      imageUrl: "",
      showUpload: true,
      showPicutreInitial: true,
      newGradeCreated: null,
      loadingButton: false,
      rules: {
        fullName: [
          {
            required: true,
            message: "Họ tên không được để trống",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "change",
          },
          {
            min: 10,
            max: 10,
            message: "Số điện thoại bao gồm 10 số",
            trigger: "change",
          },
        ],
        gender: [
          {
            required: true,
            message: "Giới tính không được để trống",
            trigger: "change",
          },
        ],
        birthday: [
          {
            required: true,
            message: "Ngày sinh không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.handleRemove();
        this.$refs["passwordData"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.handleRemove();
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["passwordData"].resetFields();
    },
    /**
     * click change image
     */
    handleChangeUpload(file) {
      this.beforeAvatarUpload(file);
      this.showUpload = !this.showUpload;
      this.imageUrl = file.raw;
      this.showPicutreInitial = false;
    },
    /**
     * remove image
     */
    handleRemove() {
      setTimeout(() => {
        this.showUpload = true;
        this.showPicutreInitial = true;
      }, 800);
      this.imageUrl = "";
      this.$refs.upload.clearFiles();
    },
    /**
     * check image before upload
     */
    beforeAvatarUpload(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isGIF = file.raw.type === "image/gif";
      const isLt5M = file.raw.size / 1024 / 1024 <= 5;
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error("Bạn phải chọn dạng ảnh");
        this.$refs.upload.clearFiles();
        throw "file not valid";
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không được quá 5MB!");
        this.$refs.upload.clearFiles();
        throw "over size";
      }
    },
    setDataAgain() {
      CommonOnekidsService.getAvatar()
        .then((resp) => {
          let user = JSON.parse(localStorage.getItem("user"));
          user.avatar = resp.data.data;
          localStorage.setItem("user", JSON.stringify(user));
          this.$store.dispatch("auth/setUserActions", user);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let inputData = this.userData;
          let formDatas = new FormData();
          for (let key in inputData) {
            formDatas.append(key, inputData[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFile", this.imageUrl);
          }
          MaUserService.updateProfile(formDatas)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
              this.setDataAgain();
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
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getInitialData() {
      MaUserService.findProfile()
        .then((resp) => {
          this.userData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
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
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
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
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
}
</style>
