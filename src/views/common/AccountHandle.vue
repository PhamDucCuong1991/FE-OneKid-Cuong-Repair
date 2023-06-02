<template>
  <div>
    <el-dialog
      title="Xử lý cấp tài khoản"
      :visible.sync="dialogVisible"
      width="850px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <el-form :model="userData" :rules="rules" ref="userData">
        <el-row>
          <span style="color: #e51d4c; font-size: 16px"
            >Đã tồn tại tài khoản "{{ userData.phone }}" trên hệ thống. Xin vui lòng lựa
            chọn các bước tiếp theo để cấp tài khoản!</span
          ></el-row
        >
        <el-row :gutter="100">
          <el-col :span="10">
            <div class="grid-content-over bg-over-1">
              <el-radio v-model="phoneCorrect" label="incorrect"
                >Số điện thoại "{{ userData.phone }}" không đúng</el-radio
              >
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content-over bg-over-2">
              <el-radio v-model="phoneCorrect" label="correct"
                >Số điện thoại "{{ userData.phone }}" đã đúng</el-radio
              >
            </div>
          </el-col>
        </el-row>
        <!-- không đúng số điện thoại -->
        <span v-if="phoneCorrect == 'incorrect'">
          <el-row :gutter="100">
            <el-col>
              <span class="space-right">Nhập số điện thoại mới</span>
              <el-input
                type="number"
                min="0"
                max="0"
                class="space-right"
                v-model="newPhone"
                style="width: 200px"
                placeholder="Nhập số điện thoại"
              ></el-input>
              <el-button
                @click="checkNewPhoneMethod()"
                class="space-right"
                type="success"
                size="medium"
                >Kiểm tra số</el-button
              >
              <el-button
                v-if="checkUsernameExist == 'notExist'"
                @click="updateNewPhoneMethod()"
                class="space-right"
                type="success"
                size="medium"
                >Cập nhật số mới</el-button
              >
            </el-col>
          </el-row>
          <el-row>
            <span v-if="checkUsernameExist == 'notExist'" style="color: #46b74a"
              >Số mới nhập đã đúng, bạn có thể ấn "Cập nhật số mới" để thay đổi tài khoản
              cho người dùng!</span
            >
            <span v-else-if="checkUsernameExist == 'exist'" style="color: #e46d2b"
              >Số mới nhập đã có trên hệ thống, xin vui lòng lựa chọn số khác!</span
            >
          </el-row>
        </span>
        <span v-else-if="phoneCorrect == 'correct'">
          <!-- đúng số điện thoại -->
          <el-row :gutter="100">
            <el-col :span="10">
              <el-tooltip
                effect="dark"
                :content="
                  'Các thông tin của người dùng cũ có tài khoản ứng với SĐT ' +
                  userData.phone +
                  ' sẽ được giữ lại'
                "
                placement="right"
              >
                <el-radio
                  @change="showAccountDuplicate()"
                  v-model="typeAccount"
                  label="oldAccount"
                  >Sử dụng tài khoản cũ</el-radio
                >
              </el-tooltip>
            </el-col>
            <el-col :span="10">
              <el-tooltip
                effect="dark"
                :content="
                  'Các thông tin của người dùng cũ có tài khoản ứng với SĐT ' +
                  userData.phone +
                  ' sẽ không được giữ lại'
                "
                placement="top"
              >
                <el-radio v-model="typeAccount" label="newAccount"
                  >Cấp tài khoản mới</el-radio
                >
              </el-tooltip>
            </el-col>
          </el-row>
          <span
            v-if="
              typeAccount == 'newAccount' ||
              (typeAccount == 'oldAccount' && userAccountList != '')
            "
          >
            <el-row>
              <span>
                Bước 1: Ấn "Gửi" để gửi mã xác thực tới số điện thoại "{{
                  userData.phone
                }}".
              </span>
            </el-row>
            <el-row>
              <span>
                Bước 2: Liên hệ với nhân viên có số điện thoại "{{ userData.phone }}" để
                lấy mã xác thực được gửi qua tin nhắn.
              </span>
            </el-row>
            <el-row>
              <span>
                Bước 3: Nhập mã xác thực vào ô "Nhập mã xác thực" và ấn nút "Xác thực" để
                tiến hành cấp tài khoản.
              </span>
            </el-row>
            <el-row>
              <el-button
                v-if="!isTimer"
                @click="sendSMSMethod()"
                class="space-right"
                type="success"
                size="medium"
              >
                <i class="el-icon-s-promotion" />
                Gửi</el-button
              >
              <el-button v-else class="space-right" type="success" size="medium" disabled>
                <i class="el-icon-s-promotion" />
                Gửi
              </el-button>
              <el-input
                maxlength="6"
                clearable
                class="space-right"
                v-model.trim="verifyCode"
                style="width: 170px"
                placeholder="Nhập mã xác thực"
                @clear="clearCodeMethod()"
              ></el-input>
              <el-button
                :disabled="verifyCode.length == 6 ? false : true"
                @click="verificationMethod()"
                class="space-right"
                type="success"
                size="medium"
              >
                Xác thực</el-button
              >
            </el-row>
            <el-row>
              <span v-if="isTimer">Mã xác thực đã được gửi!</span>
            </el-row>
            <el-row>
              <span v-if="checkIncorrectCode" style="color: #eb2020"
                >Mã xác thực không đúng, xin vui lòng nhập lại!</span
              >
            </el-row>
          </span>
        </span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton('userData')">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
    <AccountEmployeeDuplicate
      :dialogVisible="showEmployeeDuplicate"
      @dialog-close="dialogCloseEmployeeMethod"
      ref="AccountEmployeeDuplicate"
    />
    <AccountKidsDuplicate
      :dialogVisible="showKidsDuplicate"
      @dialog-close="dialogCloseKidsMethod"
      ref="AccountKidsDuplicate"
    />
  </div>
</template>

<script>
import MaUserService from "@/services/MaUserService";
import SmsSendService from "@/services/SmsSendService";

import AccountEmployeeDuplicate from "./AccountEmployeeDuplicate";
import AccountKidsDuplicate from "./AccountKidsDuplicate";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    AccountEmployeeDuplicate,
    AccountKidsDuplicate,
  },
  data() {
    return {
      userData: {
        id: 0,
        phone: "",
        appType: "",
      },
      isTimer: false,
      phoneCorrect: "",
      newPhone: "",
      checkUsernameExist: "",

      typeAccount: "",
      verifyCode: "",
      checkIncorrectCode: false,

      loadingButton: false,
      seconds: 120,

      showEmployeeDuplicate: false,
      showKidsDuplicate: false,
      userAccountList: [],

      rules: {
        gradeName: [
          {
            required: true,
            message: "Tên khối không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    changeCodeMethod() {
      if (this.verifyCode.length != 6) {
        this.checkIncorrectCode = false;
      }
    },
  },
  computed: {
    changeCodeMethod() {
      return this.verifyCode;
    },
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetFormData();
      }, 300);
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      this.resetFormData();
    },
    resetFormData() {
      this.isTimer = false;
      this.seconds = 0;
      this.newPhone = "";
      this.checkUsernameExist = "";
      this.phoneCorrect = "";
      this.typeAccount = "";
      this.verifyCode = "";
      this.checkIncorrectCode = false;
      this.userAccountList = [];
    },
    dialogCloseEmployeeMethod(data) {
      if (data == "") {
        this.typeAccount = "";
      } else {
        this.userAccountList = data;
      }
      this.showEmployeeDuplicate = false;
    },
    dialogCloseKidsMethod(data) {
      if (data == "") {
        this.typeAccount = "";
      } else {
        this.userAccountList = data;
      }
      this.showKidsDuplicate = false;
    },
    showAccountDuplicate() {
      let appType = this.userData.appType;
      if (appType == "parent") {
        this.handleKidsDuplicate();
      } else if (appType == "teacher" || appType == "plus") {
        this.handleEmployeeDuplicate();
      }
    },
    clearCodeMethod() {
      this.checkIncorrectCode = false;
    },
    handleEmployeeDuplicate() {
      setTimeout(() => {
        this.showEmployeeDuplicate = true;
      }, 200);
      let dataTranfer = {
        appType: this.userData.appType,
        phone: this.userData.phone,
      };
      this.$refs.AccountEmployeeDuplicate.getEmployeeDuplicateInitial(dataTranfer);
    },
    handleKidsDuplicate() {
      setTimeout(() => {
        this.showKidsDuplicate = true;
      }, 200);
      let dataTranfer = {
        phone: this.userData.phone,
      };
      this.$refs.AccountKidsDuplicate.getKidsDuplicateInitial(dataTranfer);
    },
    //kiểm tra số điện thoại có trong hệ thống hay chưa
    checkNewPhoneMethod() {
      let requestData = {
        appType: this.userData.appType,
        username: this.newPhone,
      };
      MaUserService.checkExistUsername(requestData)
        .then(() => {
          //username chưa tồn tại trong hệ thống
          this.checkUsernameExist = "notExist";
        })
        .catch((err) => {
          //username đã tồn tại trong hệ thống
          if (err.response.data.message == "Tên đăng nhập đã tồn tại") {
            this.checkUsernameExist = "exist";
          } else {
            this.checkUsernameExist = "";
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
        });
    },
    //cập nhật sdt mới
    updateNewPhoneMethod() {
      this.$confirm("Bạn có chắc chắn muốn cấp tài khoản không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        let requestData = {
          id: this.userData.id,
          appType: this.userData.appType,
          newPhone: this.newPhone,
        };
        MaUserService.createAccountHandleNewPhone(requestData)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton();
            }, 500);
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    //gửi SMS để lấy mã xác thực
    sendSMSMethod() {
      this.isTimer = true;
      SmsSendService.createVerifyAccountKid(
        this.userData.id,
        this.userData.phone,
        this.userData.appType
      )
        .then(() => {
          this.$message({
            message: "Gửi mã xác thực thành công.",
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: "Không thành công. Bạn vui lòng thử lại sau!",
            type: "error",
          });
        });
      this.startTimer();
    },
    //đếm ngược 60s gửi lại.
    startTimer() {
      if (this.seconds > 0) {
        setTimeout(() => {
          this.seconds -= 1;
          this.startTimer();
        }, 1000);
      }
      this.isTimer = this.seconds > 0 ? true : false;
      this.seconds = this.seconds > 0 ? this.seconds : 120;
    },
    //xác thực tài khoản
    verificationMethod() {
      let requestData = {
        id: this.userData.id,
        appType: this.userData.appType,
        code: this.verifyCode,
      };
      MaUserService.verificationCode(requestData)
        .then(() => {
          this.checkIncorrectCode = false;
          this.$confirm(
            "Bạn đã nhập đúng. Bạn có chắc chắn muốn cấp tài khoản không?",
            "Thông báo!",
            {
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              confirmButtonText: "Có",
              cancelButtonText: "Không",
            }
          ).then(() => {
            this.mergeAccountMethod();
          });
        })
        .catch(() => {
          this.checkIncorrectCode = true;
        });
    },
    mergeAccountMethod() {
      let requestData = {
        id: this.userData.id,
        appType: this.userData.appType,
        type: this.typeAccount,
        phone: this.userData.phone,
        userList: this.userAccountList,
      };
      MaUserService.mergeAccount(requestData)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton();
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
    },
    getAccountHandelInitial(objectData) {
      this.userData = objectData;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
// .grid-content-over{
//     margin-bottom: 10px;
// }
.el-row {
  margin-bottom: 20px;
}
.space-right {
  margin-right: 15px;
}
</style>
