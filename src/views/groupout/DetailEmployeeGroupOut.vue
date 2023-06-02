<template>
  <el-dialog
    title="Thông tin nhân sự"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      :model="formAllTabEmployee"
      :rules="rules"
      label-width="130px"
      label-position="left"
      style="padding: 35px"
    >
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="Họ tên" prop="fullName">
              <el-input v-model="formAllTabEmployee.fullName"></el-input>
            </el-form-item>
            <el-form-item label="Ngày sinh" prop="birthday">
              <el-date-picker
                :clearable="false"
                v-model="formAllTabEmployee.birthday"
                format="dd-MM-yyyy"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="Chọn ngày sinh"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="gender" label="Giới tính">
              <el-radio-group v-model="formAllTabEmployee.gender">
                <el-radio label="Nam">Nam</el-radio>
                <el-radio label="Nữ">Nữ</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Số điện thoại" prop="phone">
              <el-input v-model="formAllTabEmployee.phone"></el-input>
            </el-form-item>
            <el-form-item label="Ngày vào" prop="startDate">
              <el-date-picker
                v-model="formAllTabEmployee.startDate"
                type="date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="Chọn ngày vào"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="formAllTabEmployee.email"></el-input>
            </el-form-item>
            <el-form-item label="Số định danh" prop="cmnd">
              <el-input v-model="formAllTabEmployee.cmnd"></el-input>
            </el-form-item>
            <el-form-item label="Ngày cấp" prop="cmndDate">
              <el-date-picker
                v-model="formAllTabEmployee.cmndDate"
                style="width: 100%"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="Chọn ngày cấp"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="Địa chỉ thường trú" prop="permanentAddress">
              <el-input
                v-model="formAllTabEmployee.permanentAddress"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content">
            <el-form-item label="Chỗ ở hiện tại" prop="address">
              <el-input v-model="formAllTabEmployee.address"></el-input>
            </el-form-item>
            <el-form-item label="Hôn nhân" prop="marriedStatus">
              <el-select
                v-model="formAllTabEmployee.marriedStatus"
                filterable
                clearable
                placeholder
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Số con" prop="numberChildren">
              <el-input v-model="formAllTabEmployee.numberChildren"></el-input>
            </el-form-item>
            <el-form-item label="Trình độ" prop="educationLevel">
              <el-input v-model="formAllTabEmployee.educationLevel"></el-input>
            </el-form-item>

            <el-form-item label="Đối tượng" prop="idAccountTypeList">
              <el-select
                v-model="formAllTabEmployee.idAccountTypeList"
                multiple
                placeholder="Chọn đối tượng"
                clearable
                filterable
              >
                <el-option
                  v-for="item in accountTypeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Ngày ký hợp đồng" prop="contractDate">
              <el-date-picker
                v-model="formAllTabEmployee.contractDate"
                type="date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="Ngày ký hợp đồng"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Ngày hết hạn" prop="endDate">
              <el-date-picker
                v-model="formAllTabEmployee.endDate"
                type="date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="Ngày hết hạn"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Ghi chú" prop="note">
              <el-input
                v-model="formAllTabEmployee.note"
                type="textarea"
                :rows="5"
                style="width: 100%"
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
import EmployeeDataService from "@/services/EmployeeDataService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      formAllTabEmployee: {
        idAccountTypeList: [],
      },
      accountTypeList: [],
      options: [
        {
          value: "Độc thân",
          label: "Độc thân",
        },
        {
          value: "Đã kết hôn",
          label: "Đã kết hôn",
        },
      ],
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
      await GroupOutService.getByIdEmployeeGroupOut(id)
        .then((resp) => {
          this.formAllTabEmployee = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllAccountType() {
      EmployeeDataService.getAccountType()
        .then((response) => {
          this.accountTypeList = response.data.data;
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
