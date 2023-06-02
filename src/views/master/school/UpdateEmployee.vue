<template>
  <el-dialog
    title="Thông tin nhân viên"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <el-form
      label-width="140px"
      :model="formAllTabEmployee"
      label-position="left"
      :rules="rules"
      ref="formAllTabEmployee"
    >
      <el-row :gutter="40">
        <el-col :span="4">
          <div class="grid-content">
            <div>
              <el-radio-group
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.employeeStatus"
                class="group-radio-status"
              >
                <el-radio label="Đang làm" class="kids-status">Đang làm</el-radio>
                <el-radio label="Tạm nghỉ" class="kids-status">Tạm nghỉ</el-radio>
                <el-radio label="Nghỉ làm" class="kids-status">Nghỉ làm</el-radio>
              </el-radio-group>
            </div>
            <div
              v-if="
                formAllTabEmployee.updateEmployeeMainInfoRequest.employeeStatus ==
                'Nghỉ làm'
              "
            >
              <!-- <el-input placeholder="Birthday" clearable prefix-icon="el-icon-date"></el-input> -->
              <el-date-picker
                type="date"
                style="width: 100%"
                placeholder="Chọn ngày nghỉ làm"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.dateLeave"
              ></el-date-picker>
            </div>
            <div
              v-if="
                formAllTabEmployee.updateEmployeeMainInfoRequest.employeeStatus ==
                'Tạm nghỉ'
              "
            >
              <!-- <el-input placeholder="Birthday" clearable prefix-icon="el-icon-date"></el-input> -->
              <el-date-picker
                type="date"
                style="width: 100%"
                placeholder="Chọn ngày tạm nghỉ"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.dateRetain"
              ></el-date-picker>
            </div>
            <div style="margin: 20px 0"></div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content">
            <el-form-item label="Họ tên" prop="updateEmployeeMainInfoRequest.fullName">
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.fullName"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ngày sinh" prop="updateEmployeeMainInfoRequest.birthday">
              <el-date-picker
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.birthday"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="Chọn ngày sinh"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="updateEmployeeMainInfoRequest.gender" label="Giới tính">
              <el-radio-group
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.gender"
              >
                <el-radio label="Nam">Nam</el-radio>
                <el-radio label="Nữ">Nữ</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="Số điện thoại"
              prop="updateEmployeeMainInfoRequest.phone"
            >
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.phone"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="updateEmployeeMainInfoRequest.email">
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.email"
              ></el-input>
            </el-form-item>
            <el-form-item label="Số định danh" prop="updateEmployeeMainInfoRequest.cmnd">
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.cmnd"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ngày cấp" prop="updateEmployeeMainInfoRequest.cmndDate">
              <el-date-picker
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.cmndDate"
                style="width: 100%"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="Chọn ngày cấp"
              ></el-date-picker>
            </el-form-item>

            <el-form-item
              label="Địa chỉ thường trú"
              prop="updateEmployeeMainInfoRequest.permanentAddress"
            >
              <el-input
                v-model="
                  formAllTabEmployee.updateEmployeeMainInfoRequest.permanentAddress
                "
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Chỗ ở hiện tại"
              prop="updateEmployeeMainInfoRequest.address"
            >
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.address"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content">
            <el-form-item
              label="Hôn nhân"
              prop="updateEmployeeMainInfoRequest.marriedStatus"
            >
              <el-select
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.marriedStatus"
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
            <el-form-item
              label="Số con"
              prop="updateEmployeeMainInfoRequest.numberChildren"
            >
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.numberChildren"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Trình độ"
              prop="updateEmployeeMainInfoRequest.educationLevel"
            >
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.educationLevel"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="Đối tượng"
              prop="updateEmployeeMainInfoRequest.accountType"
            >
              <el-select
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.accountType"
                multiple
                placeholder="Chọn đối tượng"
                clearable
                filterable
              >
                <el-option
                  v-for="item in formAllTabEmployee.updateEmployeeMainInfoRequest
                    .accountTypeList"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Ngày vào" prop="updateEmployeeMainInfoRequest.startDate">
              <el-date-picker
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.startDate"
                type="date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="Chọn ngày vào"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="Ngày ký hợp đồng"
              prop="updateEmployeeMainInfoRequest.contractDate"
            >
              <el-date-picker
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.contractDate"
                type="date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="Ngày ký hợp đồng"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="Ngày hết hạn"
              prop="updateEmployeeMainInfoRequest.endDate"
            >
              <el-date-picker
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.endDate"
                type="date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="Ngày hết hạn"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Ghi chú" prop="updateEmployeeMainInfoRequest.note">
              <el-input
                v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.note"
                type="textarea"
                :rows="5"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="tab-infor-button" v-if="showButtonClick">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('formAllTabEmployee')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('formAllTabEmployee')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import EmployeeDataService from "@/services/EmployeeDataService";
import SchoolMasterService from "@/services/SchoolMasterService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dialogVisible1: false,
      isMasterAccountType: true,
      idEmployeeEdit: "",
      accountTypes: [],
      showButtonClick: true,
      value: "",
      radiogender: "",
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
      loadingButton: false,
      formAllTabEmployee: {
        updateEmployeeMainInfoRequest: {
          id: "",
          accountType: [],
          fullName: "",
          birthday: "",
          address: "",
          gender: "",
          email: "",
          phone: "",
          cmnd: "",
          cmndDate: "",
          permanentAddress: "",
          marriedStatus: "",
          numberChildren: "",
          educationLevel: "",
          startDate: "",
          contractDate: "",
          endDate: "",
          employeeStatus: "",
          note: "",
          dateLeave: "",
          dateRetain: "",
          listAppType: [],
          avatar: "",
          avatarView: "",
        },
      },
      rules: {
        updateEmployeeMainInfoRequest: {
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
              trigger: "blur",
            },
          ],
          startDate: [
            {
              required: true,
              message: "Giới tính không được để trống",
              trigger: "blur",
            },
          ],
          birthday: [
            {
              required: true,
              message: "Giới tính không được để trống",
              trigger: "blur",
            },
          ],
          listAppType: [
            {
              required: true,
              message: "Bạn phải chọn ít nhất 1 ứng dụng",
              trigger: "blur",
            },
          ],
          dateLeave: [
            {
              required: true,
              message: "Bạn phải chọn ngày nghỉ làm ",
              trigger: "blur",
            },
          ],
          dateRetain: [
            {
              required: true,
              message: "Bạn phải chọn ngày tạm nghỉ ",
              trigger: "blur",
            },
          ],
        },
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["formAllTabEmployee"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    getEmployeeById(idEmployee) {
      this.idEmployeeEdit = idEmployee;
      EmployeeDataService.getEmployeeById(idEmployee)
        .then((response) => {
          let a = (this.formAllTabEmployee.updateEmployeeMainInfoRequest =
            response.data.data);
          console.log(a);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getEmployeeByIdAndIdSchool(idEmployee, idSchool) {
      this.formAllTabEmployee.idSchool = idSchool;
      this.idEmployeeEdit = idEmployee;
      EmployeeDataService.getEmployeeByIdAndIdSchool(idEmployee, idSchool)
        .then((response) => {
          let a = (this.formAllTabEmployee.updateEmployeeMainInfoRequest =
            response.data.data);
          console.log(a);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // submitForm(fromData) {
    //   this.$refs[fromData].validate((valid) => {
    //     if (valid) {
    //       this.loadingButton = true;
    //       this.pushDataToCheckBoxDepartment();
    //       this.selectionMultiProfessional();
    //       let iconArrayTeacher1 = this.teacherIconAppUpdate.teacherIconUpdate1;
    //       let iconArrayTeacher2 = this.teacherIconAppUpdate.teacherIconUpdate2;
    //       let iconArrayTeacher = iconArrayTeacher1.concat(iconArrayTeacher2);
    //       this.formAllTabEmployee.appIconTeacherRequestList = iconArrayTeacher;

    //       let iconArrayPlus1 = this.plusIconAppUpdate.plusIconUpdate1;
    //       let iconArrayPlus2 = this.plusIconAppUpdate.plusIconUpdate2;
    //       let iconArrayPlus = iconArrayPlus1.concat(iconArrayPlus2);
    //       this.formAllTabEmployee.appIconPlusRequestList = iconArrayPlus;

    //       let iconNotifyArrayPlus1 = this.notifyPlusIconAppUpdate
    //         .notifyPlusIconUpdate1;
    //       let iconNotifyArrayPlus2 = this.notifyPlusIconAppUpdate
    //         .notifyPlusIconUpdate2;
    //       let iconNotifyArrayPlus = iconNotifyArrayPlus1.concat(
    //         iconNotifyArrayPlus2
    //       );
    //       this.formAllTabEmployee.notifyAppIconPlusRequestList = iconNotifyArrayPlus;

    //       let a = this.formAllTabEmployee;
    //       console.log(a);
    //       let formDatas = new FormData();

    //       formDatas.append(
    //         "idEmployee",
    //         this.formAllTabEmployee.updateEmployeeMainInfoRequest.id
    //       );
    //       formDatas.append(
    //         "fileName",
    //         this.formAllTabEmployee.updateEmployeeMainInfoRequest.avatar
    //       );
    //       let b = this.fileAvatar;
    //       console.log(b);
    //       if (this.fileAvatar != null && this.fileAvatar != "") {
    //         formDatas.append("multipartFile", this.fileAvatar);
    //         this.updateEmployee(fromData);
    //         EmployeeDataService.uploadEditAvatar(formDatas)
    //           .then((res) => {
    //             console.log(res.data.data);
    //             this.updateEmployee(fromData);
    //             this.closeDialogByButton(fromData);
    //           })
    //           .catch((err) => {
    //             console.log(err);
    //           })
    //           .finally(() => {
    //             setTimeout(() => {
    //               this.loadingButton = false;
    //             }, 500);
    //           });
    //       } else {
    //         this.updateEmployee(fromData);
    //       }
    //     } else {
    //       console.log("error validate data!");
    //       return false;
    //     }
    //   });
    // },
    /**
     * cập nhật nhân viên
     */
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          SchoolMasterService.updateExtraEmployee(this.formAllTabEmployee)
            .then((response) => {
              this.$message({
                message: response.data.message,
                type: "success",
              });
              this.closeDialogByButton(fromData);
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
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
    clickNameInitial(data) {
      if (data == "fullName") {
        this.showButtonClick = false;
      } else if (data == "noFullName") {
        this.showButtonClick = true;
      }
    },
  },
};
</script>
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
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #67c23a;
}
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
