<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="90%"
    title="Cập nhật học sinh"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      :model="formAllTabStudent"
      :rules="rules"
      label-width="130px"
      label-position="left"
      ref="formAllTabStudent"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="Thông tin" name="commonInfor">
          <el-row :gutter="40">
            <el-col :span="4">
              <div class="grid-content">
                <el-image
                  v-if="
                    formAllTabStudent.kidMainInfo.avatarKid != null && showPicutreInitial
                  "
                  style="width: 150px; height: 150px; float: left; margin-bottom: 10px"
                  :src="formAllTabStudent.kidMainInfo.avatarKid"
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
                  <span v-if="formAllTabStudent.kidMainInfo.avatarKid != null">
                    <i class="el-icon-plus" style="font-size: 20px">Cập nhật ảnh</i>
                  </span>
                  <span v-else>
                    <i class="el-icon-plus" style="font-size: 20px">Thêm ảnh</i>
                  </span>
                </el-upload>
                <div style="margin-top: 10px; width: 150px">
                  <el-input
                    disabled
                    class="show-code"
                    style="color: red"
                    v-model="formAllTabStudent.kidMainInfo.kidCode"
                  ></el-input>
                </div>
                <div>
                  <el-radio-group
                    style="margin-top: 15px"
                    v-model="formAllTabStudent.kidMainInfo.kidStatus"
                    class="group-radio-status"
                    @change="changeKidsStatus()"
                  >
                    <el-radio label="STUDYING" class="kids-status">Đang học</el-radio>
                    <el-radio label="STUDY_WAIT" class="kids-status">Chờ học</el-radio>
                    <el-radio label="RESERVE" class="kids-status">Bảo lưu</el-radio>
                    <el-radio label="LEAVE_SCHOOL" class="kids-status">Nghỉ học</el-radio>
                  </el-radio-group>
                </div>
                <div>
                  <el-form-item
                    prop="kidMainInfo.dateRetain"
                    style="margin-left: -120px"
                    v-if="formAllTabStudent.kidMainInfo.kidStatus == 'RESERVE'"
                  >
                    <el-date-picker
                      style="width: 160px"
                      type="date"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Ngày bảo lưu"
                      v-model="formAllTabStudent.kidMainInfo.dateRetain"
                      :disabled="showDateStatus"
                    ></el-date-picker>
                  </el-form-item>

                  <el-form-item
                    prop="kidMainInfo.dateLeave"
                    style="margin-left: -120px"
                    v-if="formAllTabStudent.kidMainInfo.kidStatus == 'LEAVE_SCHOOL'"
                  >
                    <el-date-picker
                      style="width: 160px"
                      v-model="formAllTabStudent.kidMainInfo.dateLeave"
                      type="date"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Ngày nghỉ học"
                      :disabled="showDateStatus"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </el-col>

            <!-- thông tin học sinh -->
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item label="Khối học" prop="kidMainInfo.gradeName">
                  <el-input
                    disabled
                    v-model="formAllTabStudent.kidMainInfo.gradeName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Lớp học" prop="kidMainInfo.className">
                  <el-input
                    disabled
                    v-model="formAllTabStudent.kidMainInfo.className"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Họ tên" prop="kidMainInfo.fullName">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.fullName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Biệt danh" prop="kidMainInfo.nickName">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.nickName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Người đại diện" prop="kidMainInfo.representation">
                  <el-radio-group v-model="formAllTabStudent.kidMainInfo.representation">
                    <el-radio label="Bố">Bố</el-radio>
                    <el-radio label="Mẹ">Mẹ</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="Ngày sinh" prop="kidMainInfo.birthDay">
                  <el-date-picker
                    v-model="formAllTabStudent.kidMainInfo.birthDay"
                    format="dd-MM-yyyy"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="Chọn ngày"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item prop="kidMainInfo.gender" label="Giới tính">
                  <el-radio-group v-model="formAllTabStudent.kidMainInfo.gender">
                    <el-radio label="Nam">Nam</el-radio>
                    <el-radio label="Nữ">Nữ</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="Ngày nhập học" prop="kidMainInfo.dateStart">
                  <el-date-picker
                    v-model="formAllTabStudent.kidMainInfo.dateStart"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                    type="date"
                    style="width: 100%"
                    placeholder="Chọn ngày"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="Địa chỉ hiện tại" prop="kidMainInfo.address">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.address"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Địa chỉ thường trú"
                  prop="kidMainInfo.permanentAddress"
                >
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.permanentAddress"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Dân tộc" prop="kidMainInfo.ethnic">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.ethnic"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Số định danh"
                  prop="kidMainInfo.identificationNumber"
                >
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.identificationNumber"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-form-item label="Họ tên bố" prop="kidMainInfo.fatherName">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.fatherName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Ngày sinh" prop="kidMainInfo.fatherBirthday">
                  <el-date-picker
                    v-model="formAllTabStudent.kidMainInfo.fatherBirthday"
                    format="dd-MM-yyyy"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    type="date"
                    style="width: 100%"
                    placeholder="Chọn ngày"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="Số điện thoại" prop="kidMainInfo.fatherPhone">
                  <el-input
                    type="number"
                    min="0"
                    max="0"
                    v-model="formAllTabStudent.kidMainInfo.fatherPhone"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="kidMainInfo.fatherEmail">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.fatherEmail"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Nghề nghiệp" prop="kidMainInfo.fatherJob">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.fatherJob"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Họ tên mẹ" prop="kidMainInfo.motherName">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.motherName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Ngày sinh" prop="kidMainInfo.motherBirthday">
                  <el-date-picker
                    v-model="formAllTabStudent.kidMainInfo.motherBirthday"
                    format="dd-MM-yyyy"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    type="date"
                    style="width: 100%"
                    placeholder="Chọn ngày"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="Số điện thoại" prop="kidMainInfo.motherPhone">
                  <el-input
                    type="number"
                    min="0"
                    max="0"
                    v-model="formAllTabStudent.kidMainInfo.motherPhone"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="kidMainInfo.motherEmail">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.motherEmail"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Nghề nghiệp" prop="kidMainInfo.motherJob">
                  <el-input
                    clearable
                    v-model="formAllTabStudent.kidMainInfo.motherJob"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Ghi chú" prop="kidMainInfo.note">
                  <el-input
                    type="textarea"
                    :rows="4"
                    v-model="formAllTabStudent.kidMainInfo.note"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="Sức khỏe chung" name="extraInfo">
          <el-col :span="15" style="margin-left: 20%">
            <el-form-item label="Nhóm máu" prop="bloodType">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.bloodType"
                placeholder="Nhập nhóm máu"
              ></el-input>
            </el-form-item>
            <el-form-item label="Bơi" prop="swim">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.swim"
                placeholder="Nhập bơi"
              ></el-input>
            </el-form-item>
            <el-form-item label="Dị ứng" prop="allery">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.allery"
                placeholder="Nhập dị ứng"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ăn kiêng" prop="diet">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.diet"
                placeholder="Nhập ăn kiêng"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tai" prop="ear">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.ear"
                placeholder="Nhập tai"
              ></el-input>
            </el-form-item>
            <el-form-item label="Mũi" prop="nose">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.nose"
                placeholder="Nhập mũi"
              ></el-input>
            </el-form-item>
            <el-form-item label="Họng" prop="throat">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.throat"
                placeholder="Nhập họng"
              ></el-input>
            </el-form-item>
            <el-form-item label="Da" prop="skin">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.skin"
                placeholder="Nhập da"
              ></el-input>
            </el-form-item>
            <el-form-item label="Mắt" prop="eyes">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.eyes"
                placeholder="Nhập mắt"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tim" prop="heart">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.heart"
                placeholder="Nhập tim"
              ></el-input>
            </el-form-item>
            <el-form-item label="Béo phì" prop="fat">
              <el-input
                clearable
                v-model="kidsExtraInfoUpdate.fat"
                placeholder="Nhập béo phì"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-tab-pane>

        <!-- tab icon -->
        <el-tab-pane label="App Onekids" name="appOnekids">
          <!-- table 1 -->
          <el-table
            class="table-icon-1"
            border
            :data="parentIconAppUpdate.parentIconUpdate1"
            highlight-current-row
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
          >
            <el-table-column type="index"></el-table-column>
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
            :data="parentIconAppUpdate.parentIconUpdate2"
            highlight-current-row
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
          >
            <el-table-column type="index"></el-table-column>
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

    <!-- buton lick -->
    <div class="tab-infor-button" v-if="showButtonClick">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('formAllTabStudent')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('formAllTabStudent')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import StudentService from "@/services/StudentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      activeName: "commonInfor",
      newGrade: {
        gradeName: "",
        gradeDescription: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      imageUrl: "",
      showUpload: true,
      showPicutreInitial: true,
      idKidTranfer: "",
      showDateStatus: true,
      showButtonClick: true,
      avatar: {},
      gradeOfSchoolList: [],
      classOfGradeList: [],
      parentIconAppUpdate: {
        parentIconUpdate1: [],
        parentIconUpdate2: [],
      },
      kidsExtraInfoUpdate: {},
      formAllTabStudent: {
        kidMainInfo: {
          idGrade: "",
          idClass: "",
          kidStatus: "",
          kidCode: "",
          fullName: "",
          birthDay: "",
          gender: "",
          nickName: "",
          address: "",
          dateStart: "",
          dateRetain: "",
          dateLeave: "",
          note: "",
          representation: "",
          fatherName: "",
          fatherBirthday: "",
          fatherPhone: "",
          fatherEmail: "",
          fatherJob: "",
          motherName: "",
          motherBirthday: "",
          motherPhone: "",
          motherEmail: "",
          motherJob: "",
          identificationNumber: "",
        },
        kidsExtraInfo: {},
        parentIconApp: [],
      },
      value: "",

      newStudentCreated: null,
      loadingButton: false,
      rules: {
        kidMainInfo: {
          fullName: [
            {
              required: true,
              message: "Họ tên không được để trống",
              trigger: "change",
            },
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
          birthDay: [
            {
              required: true,
              message: "Ngày sinh không được để trống",
              trigger: "change",
            },
          ],
          dateStart: [
            {
              required: true,
              message: "Ngày nhập học không được để trống",
              trigger: "change",
            },
          ],
          dateRetain: [
            {
              required: true,
              message: "Chọn ngày bảo lưu",
              trigger: "change",
            },
          ],
          dateLeave: [
            {
              required: true,
              message: "Chọn ngày nghỉ học",
              trigger: "change",
            },
          ],
          representation: [
            {
              required: true,
              message: "Người đại diện không được để trống",
              trigger: "change",
            },
          ],
          fatherPhone: [
            {
              min: 10,
              max: 10,
              message: "Số điện thoại bao gồm 10 số",
              trigger: "change",
            },
          ],
          motherPhone: [
            {
              min: 10,
              max: 10,
              message: "Số điện thoại bao gồm 10 số",
              trigger: "change",
            },
          ],
          fatherEmail: [
            {
              type: "email",
              message: "Email không đúng định dạng",
              trigger: ["blur", "change"],
            },
          ],
          motherEmail: [
            {
              type: "email",
              message: "Email không đúng định dạng",
              trigger: ["blur", "change"],
            },
          ],
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
      this.$refs["formAllTabStudent"].resetFields();
      this.$emit("dialog-close");
      this.handleRemove();
      setTimeout(() => {
        this.clearTabDefault();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.handleRemove();
      // this.$refs[fromData].resetFields();
      // this.showUpload = true;
      // this.showPicutreInitial = true;
      // this.formAllTabStudent.kidMainInfo.address = "";
      setTimeout(() => {
        this.clearTabDefault();
      }, 300);
    },
    clickNameInitial(data) {
      if (data == "fullName") {
        this.showButtonClick = false;
      } else if (data == "noFullName") {
        this.showButtonClick = true;
      }
    },
    changeKidsStatus() {
      let status = this.formAllTabStudent.kidMainInfo.kidStatus;
      if (status == "RESERVE" || status == "LEAVE_SCHOOL") {
        this.showDateStatus = false;
      } else {
        this.showDateStatus = true;
      }
    },
    handleClickTab(tab) {
      if (tab.name == "commonInfor") {
        console.log("111");
        // alert(new Date())
      } else if (tab.name == "extraInfo") {
        console.log("222");
      } else if (tab.name == "appOnekids") {
        console.log("333");
      }
    },
    clearTabDefault() {
      this.activeName = "commonInfor";
    },
    /**
     * click change image
     */
    handleChangeUpload(file) {
      this.beforeAvatarUpload(file);
      this.showPicutreInitial = false;
      this.showUpload = !this.showUpload;
      this.imageUrl = file.raw;
    },
    /**
     * remove image
     */
    handleRemove() {
      this.$refs.upload.clearFiles();
      setTimeout(() => {
        this.formAllTabStudent.kidMainInfo.avatarKid = null;
        this.showPicutreInitial = true;
        this.showUpload = true;
      }, 800);
      this.imageUrl = "";
    },
    /**
     * check image before upload
     */
    beforeAvatarUpload(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.raw.size / 1024 / 1024 <= 5;
      if (!isJPG && !isPNG) {
        this.$message.error("Bạn phải chọn định dạng ảnh");
        this.$refs.upload.clearFiles();
        throw "file not valid";
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không được quá 5MB!");
        this.$refs.upload.clearFiles();
        throw "over size";
      }
    },
    /**
     * create avatar
     */
    async submitAvatar() {
      let formDatas = new FormData();
      if (this.imageUrl != "") {
        formDatas.append("multipartFile", this.imageUrl);
      }
      await StudentService.createAvatar(formDatas)
        .then(() => {
          console.log("ok");
        })
        .catch((err) => {
          console.log(err);
          throw "error create avatar";
        });
      setTimeout(() => {
        this.closeDialogByButton();
      }, 500);
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let iconArray1 = this.parentIconAppUpdate.parentIconUpdate1;
          let iconArray2 = this.parentIconAppUpdate.parentIconUpdate2;
          let iconArray = iconArray1.concat(iconArray2);
          this.formAllTabStudent.parentIconApp = iconArray;
          this.formAllTabStudent.kidsExtraInfo = this.kidsExtraInfoUpdate;
          let formDataInput = this.formAllTabStudent;
          this.submitAvatar()
            .then(() => {
              this.submitData(formDataInput, fromData);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error validate data!");
          this.loadingButton = false;
          return false;
        }
      });
    },

    submitData(dataInput, fromDataValidate) {
      StudentService.updateExtra(this.idKidTranfer, dataInput)
        .then((response) => {
          this.$message({
            message: response.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton(fromDataValidate);
          }, 500);
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
    },
    tabParentIconMethod() {
      StudentService.findIconParentUpdate(this.idKidTranfer)
        .then((resp) => {
          this.parentIconAppUpdate.parentIconUpdate1 =
            resp.data.data.appIconResponseList1;
          this.parentIconAppUpdate.parentIconUpdate2 =
            resp.data.data.appIconResponseList2;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tabKidsExtraInfo() {
      StudentService.getKidsExtraInfo(this.idKidTranfer)
        .then((resp) => {
          this.kidsExtraInfoUpdate = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectGradeMethod(data) {
      if (data == 10) {
        this.formAllTabStudent.kidMainInfo.idClass = "";
      }
      let grade = this.gradeOfSchoolList.filter(
        (x) => x.id == this.formAllTabStudent.kidMainInfo.idGrade
      );
      this.classOfGradeList = grade[0].maClassListResponse;
    },

    async getDataInitial(id) {
      this.idKidTranfer = id;
      await this.getExtraKids();
      this.tabKidsExtraInfo();
      this.tabParentIconMethod();
    },

    /**
     * get kids by id
     */
    async getExtraKids() {
      await StudentService.getIdExtra(this.idKidTranfer)
        .then((resp) => {
          this.formAllTabStudent = resp.data.data;
          this.changeKidsStatus();
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
