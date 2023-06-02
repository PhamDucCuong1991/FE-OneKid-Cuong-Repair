<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="90%"
    title="Thêm mới học sinh"
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
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <el-tab-pane label="Thông tin" name="mainInfo">
          <el-row :gutter="40">
            <el-col :span="4">
              <div class="grid-content">
                <div>
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="true"
                    list-type="picture-card"
                    :on-change="handleChangeUpload"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                    showPicutreInitial
                    :class="{ hideUpload: !showUpload }"
                    limit="1"
                    ref="upload"
                  >
                    <span>
                      <i class="el-icon-plus" style="font-size: 20px">Thêm ảnh</i>
                    </span>
                  </el-upload>
                </div>
                <div>
                  <el-radio-group
                    style="margin-top: 15px"
                    v-model="formAllTabStudent.kidMainInfo.kidStatus"
                    class="group-radio-status"
                  >
                    <el-radio label="STUDYING" class="kids-status">Đang học</el-radio>
                    <el-radio label="STUDY_WAIT" class="kids-status">Chờ học</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <!-- chọn khối -->
                <el-form-item label="Chọn khối học" prop="kidMainInfo.idGrade">
                  <el-select
                    v-model="formAllTabStudent.kidMainInfo.idGrade"
                    filterable
                    @change="selectGradeMethod()"
                    placeholder="Chọn khối học"
                  >
                    <el-option
                      v-for="item in gradeOfSchoolList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.gradeName"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- chọn lớp -->
                <el-form-item label="Chọn lớp học" prop="kidMainInfo.idClass">
                  <el-select
                    v-model="formAllTabStudent.kidMainInfo.idClass"
                    filterable
                    clearable
                    placeholder="Chọn lớp học"
                  >
                    <el-option
                      v-for="item in classOfGradeList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.className"
                    ></el-option>
                  </el-select>
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
                    <el-tooltip
                      effect="dark"
                      content="Số điện thoại người đại diện là tài khoản ứng dụng OneKids và nhận tin nhắn SMS từ nhà trường"
                      placement="top-start"
                    >
                      <el-radio label="Bố">Bố</el-radio>
                    </el-tooltip>
                    <el-tooltip
                      effect="dark"
                      content="Số điện thoại người đại diện là tài khoản ứng dụng OneKids và nhận tin nhắn SMS từ nhà trường"
                      placement="top-start"
                    >
                      <el-radio label="Mẹ">Mẹ</el-radio>
                    </el-tooltip>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="Ngày sinh" prop="kidMainInfo.birthDay">
                  <el-date-picker
                    v-model="formAllTabStudent.kidMainInfo.birthDay"
                    format="dd-MM-yyyy"
                    type="date"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
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
                    type="date"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
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
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
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

        <!-- sức khỏe chung -->
        <el-tab-pane label="Sức khỏe chung" name="extraInfo">
          <el-col :span="15" style="margin-left: 20%">
            <el-form-item label="Nhóm máu" prop="kidsExtraInfo.bloodType">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.bloodType"
                placeholder="Nhập nhóm máu"
              ></el-input>
            </el-form-item>
            <el-form-item label="Bơi" prop="kidsExtraInfo.swim">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.swim"
                placeholder="Nhập bơi"
              ></el-input>
            </el-form-item>
            <el-form-item label="Dị ứng" prop="kidsExtraInfo.allery">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.allery"
                placeholder="Nhập dị ứng"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ăn kiêng" prop="kidsExtraInfo.diet">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.diet"
                placeholder="Nhập ăn kiêng"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tai" prop="kidsExtraInfo.ear">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.ear"
                placeholder="Nhập tai"
              ></el-input>
            </el-form-item>
            <el-form-item label="Mũi" prop="kidsExtraInfo.nose">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.nose"
                placeholder="Nhập mũi"
              ></el-input>
            </el-form-item>
            <el-form-item label="Họng" prop="kidsExtraInfo.throat">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.throat"
                placeholder="Nhập họng"
              ></el-input>
            </el-form-item>
            <el-form-item label="Da" prop="kidsExtraInfo.skin">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.skin"
                placeholder="Nhập da"
              ></el-input>
            </el-form-item>
            <el-form-item label="Mắt" prop="kidsExtraInfo.eyes">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.eyes"
                placeholder="Nhập mắt"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tim" prop="kidsExtraInfo.heart">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.heart"
                placeholder="Nhập tim"
              ></el-input>
            </el-form-item>
            <el-form-item label="Béo phì" prop="kidsExtraInfo.fat">
              <el-input
                clearable
                v-model="formAllTabStudent.kidsExtraInfo.fat"
                placeholder="Nhập béo phì"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-tab-pane>

        <el-tab-pane label="App Onekids" name="parentIcon">
          <!-- table 1 -->
          <el-table
            class="table-icon-1"
            border
            :data="parentIconAppCreate.parentIconCreate1"
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
            :data="parentIconAppCreate.parentIconCreate2"
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

    <div class="tab-infor-button">
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
import {mapActions, mapState} from "vuex";

export default {
  props: {
    dialogVisible: null,
  },
  data() {
    let checkDate = (rule, value, callback) => {
      if (value > new Date()) {
        callback(new Error("Ngày phải nhỏ hơn ngày hiện tại"));
      } else {
        callback();
      }
    };
    return {
      activeTabName: "mainInfo",
      newGrade: {
        gradeName: "",
        gradeDescription: "",
      },
      avatar: {},
      imageUrl: "",
      showUpload: true,
      gradeOfSchoolList: [],
      classOfGradeList: [],
      parentIconAppCreate: {
        parentIconCreate1: [],
        parentIconCreate2: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      formAllTabStudent: {
        kidMainInfo: {
          idGrade: "",
          idClass: "",
          kidStatus: "STUDYING",
          fullName: "",
          birthDay: "",
          gender: "",
          nickName: "",
          address: "",
          dateStart: "",
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
        kidsExtraInfo: {
          bloodType: "",
          swim: "",
          allery: "",
          diet: "",
          ear: "",
          nose: "",
          throat: "",
          eyes: "",
          skin: "",
          heart: "",
          fat: "",
          note: "",
        },
        parentIconApp: [],
      },
      value: "",

      newStudentCreated: null,
      loadingButton: false,
      rules: {
        kidMainInfo: {
          idGrade: [
            {
              required: true,
              message: "Khối không được để trống",
              trigger: "change",
            },
          ],

          idClass: [
            {
              required: true,
              message: "Lớp không được để trống",
              trigger: "change",
            },
          ],
          fullName: [
            {
              required: true,
              message: "Họ tên không được để trống",
              trigger: ["blur", "change"],
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
            { validator: checkDate, trigger: "change" },
          ],
          dateStart: [
            {
              required: true,
              message: "Ngày nhập học không được để trống",
              trigger: "change",
            },
          ],

          fatherBirthday: [{ validator: checkDate, trigger: "change" }],
          motherBirthday: [{ validator: checkDate, trigger: "change" }],
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
  computed:{
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    //reset when click x
    closeDialog() {
      this.$refs["formAllTabStudent"].resetFields();
      this.$emit("dialog-close");
      this.handleRemove();
      this.clearTabDefault();
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.handleRemove();
      this.clearTabDefault();
    },
    /**
     * remove image
     */
    handleRemove() {
      setTimeout(() => {
        this.$refs.upload.clearFiles();
        this.formAllTabStudent.kidMainInfo.avatarKid = "";
        this.showPicutreInitial = false;
        this.showUpload = true;
      }, 800);
      this.imageUrl = null;
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "mainInfo") {
        console.log(tabNameClick);
      } else if (tabNameClick == "extraInfo") {
        this.tabExtraInfoMethod();
      }
    },
    clearTabDefault() {
      setTimeout(() => {
        (this.formAllTabStudent.kidMainInfo.kidStatus = "STUDYING"),
          (this.activeTabName = "mainInfo");
      }, 500);
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
     * check image before upload
     */
    beforeAvatarUpload(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.raw.size / 1024 / 1024 <= 5;
      if (!isJPG && !isPNG) {
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
    },
    tabParentIconMethod() {
      StudentService.findIconParentCreate()
        .then((resp) => {
          this.parentIconAppCreate.parentIconCreate1 =
            resp.data.data.appIconResponseList1;
          this.parentIconAppCreate.parentIconCreate2 =
            resp.data.data.appIconResponseList2;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let iconArray1 = this.parentIconAppCreate.parentIconCreate1;
          let iconArray2 = this.parentIconAppCreate.parentIconCreate2;
          let iconArray = iconArray1.concat(iconArray2);
          this.formAllTabStudent.parentIconApp = iconArray;
          this.formAllTabStudent.kidMainInfo.avatarKid == "";
          let formDataInput = this.formAllTabStudent;
          if (
            (formDataInput.kidMainInfo.representation == "Bố" &&
              (formDataInput.kidMainInfo.fatherPhone == "" ||
                formDataInput.kidMainInfo.fatherName == "")) ||
            (formDataInput.kidMainInfo.representation == "Mẹ" &&
              (formDataInput.kidMainInfo.motherPhone == "" ||
                formDataInput.kidMainInfo.motherName == ""))
          ) {
            this.$confirm(
              `Chưa có họ tên hoặc số điện thoại người đại diện.
              Bạn có chắc chắn muốn tạo học sinh?`,
              "Thông báo!",
              {
                distinguishCancelAndClose: true,
                closeOnClickModal: false,
                confirmButtonText: "Có",
                cancelButtonText: "Không",
              }
            )
              .then(() => {
                this.submitAvatar()
                  .then(() => {
                    this.submitData(formDataInput, fromData);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch(() => {
                this.loadingButton = false;
              });
          } else {
            this.submitAvatar()
              .then(() => {
                this.submitData(formDataInput, fromData);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },

    submitData(dataInput, fromDataValidate) {
      StudentService.create(dataInput)
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
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
            this.closeDialogByButton();
            this.showPicutreInitial = false;
          }, 500);
        });
      this.formAllTabStudent.kidMainInfo.avatarKid = "";
      this.imageUrl = "";
      this.closeDialogByButton();
    },
    selectGradeMethod() {
      this.formAllTabStudent.kidMainInfo.idClass = "";
          this.classOfGradeList = mapState(['serverDataClassInGrade',this.formAllTabStudent.kidMainInfo.idGrade])
    },

    getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
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
  text-align: center;
  color: #d13b93;
  font-weight: bold;
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
