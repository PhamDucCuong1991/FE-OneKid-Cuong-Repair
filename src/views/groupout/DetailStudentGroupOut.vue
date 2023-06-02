<template>
  <el-dialog
    title="Thông tin học sinh"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      :model="formAllTabStudent"
      :rules="rules"
      label-width="130px"
      label-position="left"
      style="padding: 35px"
    >
      <el-row :gutter="40">
        <!-- thông tin học sinh -->
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="Khối học" prop="gradeName">
              <el-input
                disabled
                v-model="formAllTabStudent.gradeName"
              ></el-input>
            </el-form-item>
            <el-form-item label="Lớp học" prop="className">
              <el-input
                disabled
                v-model="formAllTabStudent.className"
              ></el-input>
            </el-form-item>
            <el-form-item label="Họ tên" prop="fullName">
              <el-input
                clearable
                v-model="formAllTabStudent.fullName"
              ></el-input>
            </el-form-item>
            <el-form-item label="Biệt danh" prop="nickName">
              <el-input
                clearable
                v-model="formAllTabStudent.nickName"
              ></el-input>
            </el-form-item>
            <el-form-item label="Người đại diện" prop="representation">
              <el-radio-group v-model="formAllTabStudent.representation">
                <el-radio label="Bố">Bố</el-radio>
                <el-radio label="Mẹ">Mẹ</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Ngày sinh" prop="birthDay">
              <el-date-picker
                v-model="formAllTabStudent.birthDay"
                format="dd-MM-yyyy"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="Chọn ngày"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="gender" label="Giới tính">
              <el-radio-group v-model="formAllTabStudent.gender">
                <el-radio label="Nam">Nam</el-radio>
                <el-radio label="Nữ">Nữ</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Ngày nhập học" prop="dateStart">
              <el-date-picker
                v-model="formAllTabStudent.dateStart"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                type="date"
                style="width: 100%"
                placeholder="Chọn ngày"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Địa chỉ" prop="address">
              <el-input
                clearable
                v-model="formAllTabStudent.address"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ghi chú" prop="note">
              <el-input
                type="textarea"
                :rows="2"
                v-model="formAllTabStudent.note"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="Họ tên bố" prop="fatherName">
              <el-input
                clearable
                v-model="formAllTabStudent.fatherName"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ngày sinh" prop="fatherBirthday">
              <el-date-picker
                v-model="formAllTabStudent.fatherBirthday"
                format="dd-MM-yyyy"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                type="date"
                style="width: 100%"
                placeholder="Chọn ngày"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Số điện thoại" prop="fatherPhone">
              <el-input
                type="number"
                min="0"
                max="0"
                v-model="formAllTabStudent.fatherPhone"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="fatherEmail">
              <el-input
                clearable
                v-model="formAllTabStudent.fatherEmail"
              ></el-input>
            </el-form-item>
            <el-form-item label="Nghề nghiệp" prop="fatherJob">
              <el-input
                clearable
                v-model="formAllTabStudent.fatherJob"
              ></el-input>
            </el-form-item>
            <el-form-item label="Họ tên mẹ" prop="motherName">
              <el-input
                clearable
                v-model="formAllTabStudent.motherName"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ngày sinh" prop="motherBirthday">
              <el-date-picker
                v-model="formAllTabStudent.motherBirthday"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                type="date"
                style="width: 100%"
                placeholder="Chọn ngày"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Số điện thoại" prop="motherPhone">
              <el-input
                type="number"
                min="0"
                max="0"
                v-model="formAllTabStudent.motherPhone"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="motherEmail">
              <el-input
                clearable
                v-model="formAllTabStudent.motherEmail"
              ></el-input>
            </el-form-item>
            <el-form-item label="Nghề nghiệp" prop="motherJob">
              <el-input
                clearable
                v-model="formAllTabStudent.motherJob"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- buton lick -->
    <div class="tab-infor-button">
      <el-button type="danger" size="medium" @click="closeDialogByButton()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import GroupOutService from "@/services/GroupOutService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      formAllTabStudent: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
    },
    async getDataInitial(id) {
      await GroupOutService.getByIdGroupOut(id)
        .then((resp) => {
          this.formAllTabStudent = resp.data.data;
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
  display: none;
}
</style>
<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-dialog__body {
  padding-top: 0;
}

// /deep/.el-tabs__nav {
//   background: #a0a19ce0;
// }
// /deep/.el-tabs__item {
//   color: white;
// }
// /deep/.el-tabs__item.is-active {
//   color: white;
//   background: #67c23a;
// }
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
  // text-align: center;
  // color: #d13b93;
  // font-weight: bold;
  color: #606266;
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
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
  border: 1px solid #dcdfe6;
}
.el-select {
  display: block;
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
</style>
