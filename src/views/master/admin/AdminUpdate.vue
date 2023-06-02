<template>
  <el-dialog
    title="Cập nhật nhân viên"
    :visible.sync="dialogVisible"
    width="750px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <el-form
      label-width="120px"
      :model="dataUpdate"
      label-position="left"
      :rules="rules"
      ref="dataUpdate"
    >
      <el-form-item
        label="username"
        prop="maUser.username"
        style="display: inline-block; width: 47%"
      >
        <el-input
          v-model.trim="dataUpdate.maUser.username"
          clearable
          placeholder="Nhập username"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="password"
        prop="maUser.passwordShow"
        style="float: right; width: 47%"
      >
        <el-input
          v-model.trim="dataUpdate.maUser.passwordShow"
          clearable
          placeholder="Nhập password"
        ></el-input>
      </el-form-item>
      <el-form-item label="Họ tên" prop="fullName">
        <el-input
          v-model="dataUpdate.fullName"
          clearable
          placeholder="Nhập họ tên"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Giới tính"
        prop="gender"
        style="display: inline-block; width: 40%"
      >
        <el-radio-group v-model="dataUpdate.gender">
          <el-radio label="Nam">Nam</el-radio>
          <el-radio label="Nữ">Nữ</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="Ngày bắt đầu"
        prop="startDate"
        style="float: right; width: 47%"
      >
        <el-date-picker
          v-model="dataUpdate.startDate"
          type="date"
          style="width: 100%"
          value-format="yyyy-MM-dd"
          clearable
          format="dd-MM-yyyy"
          placeholder="Chọn ngày"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="Trạng thái" prop="adminStatus">
        <el-select
          class="input-common input-grade"
          style="width: 100%"
          v-model="dataUpdate.adminStatus"
          placeholder="Chọn trạng thái"
        >
          <el-option
            v-for="item in statusList"
            :key="item"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone">
        <el-input
          v-model="dataUpdate.phone"
          placeholder="số điện thoại"
        ></el-input>
      </el-form-item>
      <el-form-item label="Địa chỉ" prop="address">
        <el-input
          :rows="2"
          type="textarea"
          v-model="dataUpdate.address"
          placeholder="Nhập địa chỉ"
        ></el-input>
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input
          :rows="2"
          type="textarea"
          v-model="dataUpdate.note"
          placeholder="Nhập ghi chú"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('dataUpdate')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('dataUpdate')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import AdminService from "@/services/AdminService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataUpdate: {},
      loadingButton: false,
      statusList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      rules: {
        maUser: {
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
              message: "Usrename phải lớn hơn hoặc bằng 6 ký tự",
              trigger: "blur",
            },
          ],
          passwordShow: [
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
        },
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
        address: [
          {
            required: true,
            message: "Địa chỉ không được để trống",
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
        startDate: [
          {
            required: true,
            message: "Ngày bắt đầu không được để trống",
            trigger: "blur",
          },
        ],
        adminStatus: [
          {
            required: true,
            message: "Ngày bắt đầu không được để trống",
            trigger: "blur",
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
        this.$refs["dataUpdate"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          AdminService.updateAdmin(this.dataUpdate)
            .then((response) => {
              this.dataUpdate = response.data.data;
              this.$message({
                message: "Cập nhật thành công",
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
                  message: "Cập nhật nhân viên thất bại",
                  type: "error",
                });
              }
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
    getDataInitial(row) {
      this.dataUpdate = row;
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
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>