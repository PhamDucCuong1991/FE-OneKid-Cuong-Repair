<template>
  <el-dialog
    title="Chuyển học sinh sang tài khoản phụ huynh khác"
    :visible.sync="dialogVisible"
    width="850px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="150px"
      :model="editGrade"
      label-position="left"
      :rules="rules"
      ref="editGrade"
    >
      <el-form-item label="Chuyển học sinh">
        <span>{{ kid.fullName }} - Tài khoản ({{ kid.username }})</span>
      </el-form-item>
      <el-form-item label="Trường">
        <span>{{ kid.schoolName }} - Lớp ({{ kid.maClass.className }})</span>
      </el-form-item>
      <el-form-item label="Nhập tài khoản">
        <el-input
          v-model.trim="username"
          style="width: 70%"
          placeholder="Nhập tài khoản phụ huynh"
        ></el-input>
        <el-button
          :disabled="username == '' ? true : false"
          style="margin-left: 15px"
          type="primary"
          @click="findUserByUsernameMethod()"
          >Tìm kiếm</el-button
        >
      </el-form-item>
      <el-form-item label="Chuyển đến tài khoản">
        <span v-if="userInfo != ''">
          <span>{{ userInfo.fullName }} - SĐT SMS ({{ userInfo.phone }})</span>
          <div v-for="(item, index) in userInfo.kidList" :key="index">
            Con {{ index + 1 }}: {{ item.fullName }}, {{ item.birthDay | formatDate }},
            {{ item.maClass.className }},
            {{ item.schoolName }}
          </div>
        </span>
        <span v-if="showNotFound" style="color: red">Không tìm thấy tài khoản</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        :disabled="userInfo == '' ? true : false"
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>OK</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MaUserService from "@/services/MaUserService";
import StudentMasterService from "@/services/StudentMasterService";
export default {
  props: {
    dialogVisible: null,
    editGrade: null,
  },
  data() {
    return {
      kid: "",
      username: "",
      userInfo: "",
      showNotFound: false,
      newGradeUpdated: null,
      loadingButton: false,
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.kid = "";
        this.username = "";
        this.userInfo = "";
        this.showNotFound = false;
      }, 300);
    },
    findUserByUsernameMethod() {
      MaUserService.findUserByUsername(this.username, "parent")
        .then((resp) => {
          this.showNotFound = false;
          this.userInfo = resp.data.data;
        })
        .catch((err) => {
          this.userInfo = "";
          this.showNotFound = true;
          console.log(err);
        });
    },
    submitForm() {
      let dataInput = {
        id: this.kid.id,
        idUser: this.userInfo.id,
      };
      this.loadingButton = true;
      StudentMasterService.mergeKidsIntoParent(dataInput)
        .then((response) => {
          this.$message({
            message: response.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
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
    getMergeKidsInitial(row) {
      this.kid = row;
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
</style>
