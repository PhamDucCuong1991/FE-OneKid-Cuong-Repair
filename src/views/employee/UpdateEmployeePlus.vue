<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
    title="Sửa thông tin Plus"
  >
    <el-form
      label-width="140px"
      :model="formAllTabEmployee"
      label-position="left"
      :rules="rules"
      ref="formAllTabEmployee"
    >
      <el-tabs type="card" v-model="activeTabName" @tab-click="handleClick">
        <el-tab-pane label="Thông tin" name="infoTab">
          <el-row :gutter="40">
            <el-col :span="4">
              <div class="grid-content">
                <el-image
                  v-if="
                    !!formAllTabEmployee.updateEmployeeMainInfoRequest.avatarView &&
                    showPicutreInitial
                  "
                  style="width: 150px; height: 150px; float: left; margin-bottom: 10px"
                  :src="formAllTabEmployee.updateEmployeeMainInfoRequest.avatarView"
                  fit="fill"
                ></el-image>
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="true"
                  list-type="picture-card"
                  :on-change="toggleUpload"
                  :on-remove="handleRemove"
                  :auto-upload="false"
                  :class="{ hideUpload: !showUpload }"
                  limit="1"
                  ref="upload"
                >
                  <span
                    v-if="!!formAllTabEmployee.updateEmployeeMainInfoRequest.avatarView"
                  >
                    <i class="el-icon-plus avatar-uploader-icon">Cập nhật ảnh</i>
                  </span>
                  <span v-else>
                    <i class="el-icon-plus avatar-uploader-icon">Thêm ảnh</i>
                  </span>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible1">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
                <div style="margin-bottom: 10px">
                  <el-input
                    style="width: 150px; margin-top: 10px"
                    disabled
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.code"
                  ></el-input>
                </div>
                <div>
                  <el-radio-group
                    v-model="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.employeeStatus
                    "
                    class="group-radio-status"
                  >
                    <el-radio label="Đang làm" class="kids-status">Đang làm</el-radio>
                    <el-radio label="Tạm nghỉ" class="kids-status">Tạm nghỉ</el-radio>
                    <el-radio label="Nghỉ làm" class="kids-status">Nghỉ làm</el-radio>
                  </el-radio-group>
                </div>

                <div>
                  <el-form-item
                    prop="updateEmployeeMainInfoRequest.dateRetain"
                    style="margin-left: -120px"
                    v-if="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.employeeStatus ==
                      'Tạm nghỉ'
                    "
                  >
                    <el-date-picker
                      style="width: 160px"
                      type="date"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Ngày tạm nghỉ"
                      v-model="
                        formAllTabEmployee.updateEmployeeMainInfoRequest.dateRetain
                      "
                    ></el-date-picker>
                  </el-form-item>

                  <el-form-item
                    prop="updateEmployeeMainInfoRequest.dateLeave"
                    style="margin-left: -120px"
                    v-if="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.employeeStatus ==
                      'Nghỉ làm'
                    "
                  >
                    <el-date-picker
                      style="width: 160px"
                      v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.dateLeave"
                      type="date"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Ngày nghỉ làm"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <div style="margin: 20px 0"></div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item
                  label="Họ tên"
                  prop="updateEmployeeMainInfoRequest.fullName"
                >
                  <el-input
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.fullName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Ngày sinh"
                  prop="updateEmployeeMainInfoRequest.birthday"
                >
                  <el-date-picker
                    :clearable="false"
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.birthday"
                    format="dd-MM-yyyy"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="Chọn ngày sinh"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  prop="updateEmployeeMainInfoRequest.gender"
                  label="Giới tính"
                >
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
                <el-form-item
                  label="Ngày vào"
                  prop="updateEmployeeMainInfoRequest.startDate"
                >
                  <el-date-picker
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.startDate"
                    type="date"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                    placeholder="Chọn ngày vào"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="Email" prop="updateEmployeeMainInfoRequest.email">
                  <el-input
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.email"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Số định danh"
                  prop="updateEmployeeMainInfoRequest.cmnd"
                >
                  <el-input
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.cmnd"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Ngày cấp"
                  prop="updateEmployeeMainInfoRequest.cmndDate"
                >
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
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item
                  label="Chỗ ở hiện tại"
                  prop="updateEmployeeMainInfoRequest.address"
                >
                  <el-input
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.address"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Dân tộc" prop="updateEmployeeMainInfoRequest.ethnic">
                  <el-input
                    clearable
                    v-model="formAllTabEmployee.updateEmployeeMainInfoRequest.ethnic"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Hôn nhân"
                  prop="updateEmployeeMainInfoRequest.marriedStatus"
                >
                  <el-select
                    v-model="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.marriedStatus
                    "
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
                    v-model="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.numberChildren
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Trình độ"
                  prop="updateEmployeeMainInfoRequest.educationLevel"
                >
                  <el-input
                    v-model="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.educationLevel
                    "
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="Đối tượng"
                  prop="updateEmployeeMainInfoRequest.idAccountTypeList"
                >
                  <el-select
                    v-model="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.idAccountTypeList
                    "
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
                <el-form-item
                  label="Ngày ký hợp đồng"
                  prop="updateEmployeeMainInfoRequest.contractDate"
                >
                  <el-date-picker
                    v-model="
                      formAllTabEmployee.updateEmployeeMainInfoRequest.contractDate
                    "
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
                    :rows="1"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="App Plus">
          <!-- table 1 -->
          <el-table
            class="table-icon-1"
            border
            :data="plusIconAppUpdate.plusIconUpdate1"
            highlight-current-row
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
          >
            <el-table-column width="50" type="index" label="STT"></el-table-column>
            <el-table-column prop="iconName" label="Chức năng"></el-table-column>
            <el-table-column label="Hiển thị" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.statusShow"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Mở khóa" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-if="scope.row.rootLockStatus"
                  v-model="scope.row.status"
                ></el-checkbox>
                <el-checkbox v-else disabled></el-checkbox>
              </template>
            </el-table-column>
          </el-table>

          <!-- table 2 -->
          <el-table
            class="table-icon-2"
            border
            :data="plusIconAppUpdate.plusIconUpdate2"
            highlight-current-row
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
          >
            <el-table-column width="50" type="index" label="STT"></el-table-column>
            <el-table-column prop="iconName" label="Chức năng"></el-table-column>
            <el-table-column label="Hiển thị" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.statusShow"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Mở khóa" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-if="scope.row.rootLockStatus"
                  v-model="scope.row.status"
                ></el-checkbox>
                <el-checkbox v-else disabled></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
import SupperPlusService from "@/services/SupperPlusService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      checkAppType: "",
      showPicutreInitial: true,
      fileList: [],
      dialogImageUrl: "",
      dialogVisible1: false,
      fileAvatar: "",
      showUpload: true,
      avatar: {},
      isMasterAccountType: true,
      idEmployeeEdit: "",
      accountTypeList: [],
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
      teacherIconAppUpdate: {
        teacherIconUpdate1: [],
        teacherIconUpdate2: [],
      },
      plusIconAppUpdate: {
        plusIconUpdate1: [],
        plusIconUpdate2: [],
      },
      notifyPlusIconAppUpdate: {
        notifyPlusIconUpdate1: [],
        notifyPlusIconUpdate2: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      loadingButton: false,
      formAllTabEmployee: {
        updateEmployeeMainInfoRequest: {
          id: "",
          idAccountTypeList: [],
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
          avatar: "",
          avatarView: "",
        },
        tabDepartmentInEmployee: [],
        tabDepartmentRequestList: [],
        tabProfessionalInEmployee: [],
        tabProfessionalRequestList: [],
        notifyAppIconPlusRequestList: [],
        idSchool: "",
      },
      activeTabName: "infoTab",
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
              message: "Ngày vào không được để trống",
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
          dateLeave: [
            {
              required: true,
              message: "Ngày nghỉ làm không được để trống",
              trigger: "change",
            },
          ],
          dateRetain: [
            {
              required: true,
              message: "Ngày tạm nghỉ không được để trống",
              trigger: "change",
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
      this.activeTabName = "infoTab";
      this.$refs.upload.clearFiles();
      this.formAllTabEmployee.updateEmployeeMainInfoRequest.avatarView = "";
      this.$refs["formAllTabEmployee"].resetFields();
      this.$emit("dialog-close");
      this.showPicutreInitial = true;
      this.$parent.handleCurrentChangeAfter();
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.activeTabName = "infoTab";
      this.$refs.upload.clearFiles();
      this.formAllTabEmployee.updateEmployeeMainInfoRequest.avatarView = "";
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.showUpload = true;
      this.showPicutreInitial = true;
      this.$parent.handleCurrentChangeAfter();
      location.reload();
    },
    getEmployeeById(idEmployee) {
      this.idEmployeeEdit = idEmployee;
      SupperPlusService.getPlusById(idEmployee)
        .then((response) => {
          this.formAllTabEmployee.updateEmployeeMainInfoRequest = response.data.data;
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
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;

          let iconArrayPlus1 = this.plusIconAppUpdate.plusIconUpdate1;
          let iconArrayPlus2 = this.plusIconAppUpdate.plusIconUpdate2;
          let iconArrayPlus = iconArrayPlus1.concat(iconArrayPlus2);
          this.formAllTabEmployee.appIconPlusRequestList = iconArrayPlus;
          let formDatas = new FormData();

          formDatas.append(
            "idEmployee",
            this.formAllTabEmployee.updateEmployeeMainInfoRequest.id
          );
          formDatas.append(
            "fileName",
            this.formAllTabEmployee.updateEmployeeMainInfoRequest.avatar
          );
          if (this.fileAvatar != null && this.fileAvatar != "") {
            formDatas.append("multipartFile", this.fileAvatar);
            // this.updateEmployee(fromData);
            SupperPlusService.uploadEditAvatar(formDatas)
              .then(() => {
                this.updateEmployee(fromData);
              })
              .catch((err) => {
                this.$message({
                  message: err.response.data.message,
                  type: "error",
                });
              });
          } else {
            this.updateEmployee(fromData);
          }
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    /**
     * cập nhật nhân viên
     */
    updateEmployee(fromData) {
      SupperPlusService.updatePlus(this.idEmployeeEdit, this.formAllTabEmployee)
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
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    uploadEditAvatar(formData) {
      EmployeeDataService.uploadEditAvatar(formData)
        .then((res) => {
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clickNameInitial(data) {
      if (data == "fullName") {
        this.showButtonClick = false;
      } else if (data == "noFullName") {
        this.showButtonClick = true;
      }
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

    tabPlusIconMethod(id) {
      SupperPlusService.findIconPlusUpdate(id)
        .then((resp) => {
          this.plusIconAppUpdate.plusIconUpdate1 =
            resp.data.data.appIconPlusResponseList1;
          this.plusIconAppUpdate.plusIconUpdate2 =
            resp.data.data.appIconPlusResponseList2;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    pushDataToCheckBoxDepartment() {
      let a = this.formAllTabEmployee.tabDepartmentInEmployee.filter(
        (item) => item.checkDepartment == true
      );
      this.formAllTabEmployee.tabDepartmentRequestList = a;
    },
    selectionMultiProfessional() {
      let a = this.formAllTabEmployee.tabProfessionalInEmployee.filter(
        (item) => item.checkIsClass == true
      );
      this.formAllTabEmployee.tabProfessionalRequestList = a;
    },
    toggleUpload(file, fileList) {
      this.fileList = fileList;
      this.showPicutreInitial = false;
      this.showUpload = !this.showUpload;
      this.fileAvatar = file.raw;
      this.formAllTabEmployee.updateEmployeeMainInfoRequest.avatar = this.fileAvatar.name;
    },
    handleRemove(file) {
      setTimeout(() => {
        this.showPicutreInitial = true;
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
    getCheckAppType(checkAppType) {
      this.checkAppType = checkAppType;
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
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
