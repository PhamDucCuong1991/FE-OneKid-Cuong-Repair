<template>
  <div class="login-form">
    <el-form
      :label-position="labelPosition"
      :rules="rules"
      label-width="100px"
      :model="credentials"
      ref="credentials"
    >
      <div class="title-login">ĐĂNG NHẬP</div>
      <el-form-item label="Tên khoản" prop="username">
        <el-input
          prefix-icon="el-icon-phone-outline"
          v-model.trim="credentials.username"
          @keyup.enter.native="submitForm('credentials')"
          auto-complete
          placeholder="Nhập số điện thoại"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mật khẩu" prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          v-model.trim="credentials.password"
          @keyup.enter.native="submitForm('credentials')"
          placeholder="Nhập mật khẩu"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="appType">
        <el-radio-group v-model="credentials.appType">
          <el-radio label="plus">Nhà trường</el-radio>
          <el-radio label="teacher">Giáo viên</el-radio>
          <el-radio label="parent">Phụ huynh</el-radio>
        </el-radio-group>
      </el-form-item>
      <div
        class="error"
        :style="{ visibility: showBadCredential ? 'visible' : 'hidden' }"
      >
        {{ loginError }}
      </div>
      <el-button
        type="primary"
        @click="submitForm('credentials')"
        :loading="loadingButton"
        round
        style="margin-top: 10px"
        >Đăng nhập</el-button
      >

      <div class="note">
        <span>Liên hệ với nhà trường khi quên mật khẩu</span>
        <hr />
        <span>Trẻ em hôm nay, thế giới ngày mai!</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import DeviceService from "@/services/DeviceService";
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("Nhập số điện thoại"));
      } else {
        callback();
      }
    };

    var validatePassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("Nhập mật khẩu"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "top",
      showBadCredential: false,
      loadingButton: false,
      loginError: "Thông tin đăng nhập không đúng",
      credentials: {
        username: "",
        password: "",
        appType: "",
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: "blur" },
          { validator: validateUsername, trigger: "change" },
        ],
        password: [
          { validator: validatePassword, trigger: "blur" },
          { validator: validatePassword, trigger: "change" },
          {
            min: 6,
            message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/dashboard");
    }
  },
  methods: {
    submitForm(formName) {
      this.showBadCredential = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          this.$store
            .dispatch("auth/login", this.credentials)
            .then((resp) => {
              this.$router.push("/dashboard");
              console.log(resp);
              // let responseData = resp;
              // if (
              //   responseData.appType == "plus" ||
              //   responseData.appType == "parent"
              // ) {
              //   this.$router.push("/dashboard");
              // } else if (responseData.appType == "teacher") {
              //   // this.$router.push("/teacher/statistical");
              //   this.$router.push("/dashboard/teacher");
              // } else if (responseData.appType == "supperPlus") {
              //   this.$router.push("/dashboard/supper-plus");
              // } else {
              //   this.$router.push("/dashboard/admin");
              // }
              this.loginDeviceMethod();
            })
            .catch((err) => {
              setTimeout(() => {
                this.showBadCredential = true;
              }, 500);
              this.loginError = err.response.data.message;
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        } else {
          console.log("error validate data!!");
          return false;
        }
      });
    },
    loginDeviceMethod() {
      let deviceData = { idDevice: "" };
      deviceData.idDevice = this.$browserDetect.meta.ua;
      DeviceService.deviceLogin(deviceData)
        .then((resp) => {
          let data = resp.data.data;
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/.el-form--label-top .el-form-item__label {
  padding: 0px 0 0px;
}
/deep/.el-radio__label {
  font-size: 14px;
  margin-right: -15px;
}
/deep/.el-form-item__content {
  text-align: center;
}
.login-form {
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  background-image: url("../../assets/images/login.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  .el-form {
    border-radius: 10px;
    width: 325px;
    height: 430px;
    background: white;
    padding: 0 50px 50px 50px;
    margin-top: 4%;
    .title-login {
      background: #55a3f7;
      width: 100%;
      height: 55px;
      padding: 0 50px;
      margin-left: -50px;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      margin-bottom: 20px;
      font-size: 30px;
      text-align: center;
      line-height: 55px;
      color: white;
    }
    .el-button {
      margin: 0 auto;
      display: block;
      width: 200px;
    }
    .note {
      font-size: 12px;
      margin: 0 auto;
      text-align: center;
      margin-top: 25px;
      color: grey;
    }
    .error {
      font-size: 14px;
      margin: 0 auto;
      text-align: center;
      margin-top: -25px;
      margin-bottom: 10px;
      color: #ff3333;
    }
    .el-radio {
      margin-bottom: 10px;
    }
  }
}
</style>
