<template>
  <div>
    <el-dialog
      v-if="this.checkActiveSms == true"
      :visible.sync="dialogVisibleSms"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
      title="Gửi qua SMS Học sinh"
    >
      <div
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
      >
        <div class="row-heard">
          <div class="row-heard__item">
            <p>
              Số người nhận:
              <span style="color: red">{{ this.numberReciver }}</span>
            </p>
          </div>
          <div class="row-heard__item">
            <p>
              Số người chưa được kích hoạt nhận Sms:
              <span style="color: red">{{ this.numberNoActive }}</span>
            </p>
          </div>
          <div class="row-heard__item">
            <p>
              Tổng số bản tin:
              <span style="color: red">{{ this.totalpackage }}</span>
            </p>
          </div>
          <div class="row-heard__item">
            <p>
              <!-- Số kí tự: <span style="color: red">{{ this.numberText }}</span>  -->
              Số gói tin:<span style="color: red">{{ this.numberpackage }}</span>
            </p>
          </div>
          <div class="row-heard__item" v-if="!this.smsMore">
            <p>
              Sms còn lại:
              <span style="color: red">{{ this.smsRemain }}</span>
            </p>
          </div>
        </div>
        <el-form
          label-width="140px"
          :model="createStudentNotifySms"
          label-position="left"
          :rules="rules"
          ref="createStudentNotifySms"
        >
          <el-row :gutter="40">
            <el-col :span="24">
              <div class="grid-content">
                <el-form-item label="Tiêu đề: " style="font-weight: bold">
                  <span>{{ createStudentNotifySms.sendTitle }}</span>
                </el-form-item>
                <div class="form-content">
                  <div class="form-content__box">
                    <h4>Nội dung:</h4>
                    <el-form-item prop="sendContent" style="margin-left: 0">
                      <el-input
                        :rows="10"
                        type="textarea"
                        placeholder="Nhập nội dung tiếng việt có dấu ..."
                        v-model="createStudentNotifySms.sendContent"
                        v-on:change="removeAccents(createStudentNotifySms.sendContent)"
                        :on-change="converStrSms(createStudentNotifySms.sendContent)"
                      ></el-input>
                    </el-form-item>
                    <!-- v-bind:value="contentSms"
                      v-on:keyup="contentSms = $event.target.value" -->
                  </div>
                  <div class="form-content__box">
                    <h4>Hiển thị:</h4>
                    <el-input
                      disabled
                      :rows="10"
                      type="textarea"
                      v-model="contentSmsCv"
                    ></el-input>
                  </div>
                </div>

                <div class="row-checkbox">
                  <el-radio v-model="radio" label="0" style="margin-right: 25px"
                    >Gửi ngay</el-radio
                  >
                  <el-radio v-model="radio" label="1" style="margin-right: 25px"
                    >Hẹn giờ</el-radio
                  >
                  <el-date-picker
                    v-if="radio == 1"
                    v-model="createStudentNotifySms.dateTime"
                    value-format="yyyy-MM-dd - HH:mm"
                    type="datetime"
                    placeholder="Select date and time"
                  >
                  </el-date-picker>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="tab-infor-button">
          <el-button
            type="danger"
            size="medium"
            @click="closeDialogByButton('createStudentNotifySms')"
          >
            <i class="el-icon-circle-close" />
            <span>Đóng</span>
          </el-button>
          <el-button
            type="success"
            size="medium"
            :loading="loadingButton"
            mini
            @click="submitForm('createStudentNotifySms')"
          >
            <i class="el-icon-circle-check" />
            <span>Gửi</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StudentService from "@/services/StudentService";

export default {
  props: {
    dialogVisibleSms: null,
    dataKidNotifySmsList: null,
    dataClassNotifySmsList: null,
    dataGradeNotifySmsList: null,
    dataGroupNotifySmsList: null,
  },
  data() {
    return {
      dialogVisible1: false,
      disabled: false,
      timeArm: false,
      loadingData: true,
      radio: "0",
      contentSms: [],
      contentSmsCv: "",
      numberReciver: 0,
      numberpackage: 0,
      totalpackage: 0,
      numberNoActive: 0,
      numberText: 0,
      value: "",
      loadingButton: false,

      createStudentNotifySms: {
        sendTitle: "",
        sendContent: "",
        dateTime: "",
        // attachFile
      },
      showTitle: false,
      smsMore: false,
      smsRemain: 0,
      checkActiveSms: false,

      rules: {
        sendContent: [
          {
            min: 1,
            max: 459,
            required: true,
            message: "Nội dung không được trống và không được gửi quá 3 gói tin.",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    converStrSms(str) {
      if (this.showTitle == true && this.createStudentNotifySms.sendTitle != null) {
        if (this.createStudentNotifySms.sendTitle != "") {
          str = this.createStudentNotifySms.sendTitle + str;
        }
      }

      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      // Some system encode vietnamese combining accent as individual utf-8 characters
      // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
      // Remove extra spaces
      // Bỏ các khoảng trắng liền nhau
      str = str.replace(/ + /g, " ");
      str = str.trim();
      // Remove punctuations
      // Bỏ dấu câu, kí tự đặc biệt
      this.contentSmsCv = str;
      console.log(this.numberText);
    },
    removeAccents(str) {
      console.log(str);
      if (this.showTitle == true && this.createStudentNotifySms.sendTitle != null) {
        str = this.createStudentNotifySms.sendTitle + "," + str;
      }
      StudentService.convertSms(str)
        .then((response) => {
          console.log(response.data.data.smsConvert);
          this.contentSms = response.data.data.smsConvert;

          this.numberpackage = this.contentSms.length;
        })
        .catch((err) => {
          this.$message({
            message: "Tạo Sms thất bại",
            type: "error",
          });
          console.log(err);
        })
        .finally(() => {
          this.getNumberPackage();
        });
    },
    getNumberPackage() {
      if (this.numberpackage > 3) {
        this.$message({
          message: "Bạn chỉ được gửi tối đa 3 gói tin.",
          type: "error",
        });
      } else {
        this.totalpackage =
          this.numberpackage * (this.numberReciver - this.numberNoActive);
        console.log(this.numberpackage);
        console.log(this.numberReciver);
        console.log(this.numberNoActive);
        console.log(this.totalpackage);
      }
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["createStudentNotifySms"].resetFields();
      this.resetData();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.resetData();
      this.$emit("dialog-close");
    },
    resetData() {
      this.timeArm = false;
      this.dataKidNotifySmsList = null;
      this.dataClassNotifySmsList = null;
      this.dataGradeNotifySmsList = null;
      this.dataGroupNotifySmsList = null;
      this.createStudentNotifySms.sendTitle = "";
      this.createStudentNotifySms.sendContent = "";
      this.radio = "0";
      this.timeArm = false;
      this.createStudentNotifySms.dateTime = "";
      this.contentSms = "";
      this.numberpackage = 0;
      this.totalpackage = 0;
      this.numberReciver = 0;
    },
    handleClose(done) {
      this.$confirm("Are you sure to close this dialog?")
        .then((_) => {
          console.log(_);
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    submitForm(fromData) {
      if (this.radio == true && this.createStudentNotifySms.dateTime == "") {
        this.$message({
          message: "Bạn chưa thiết lập thời gian gửi.",
          type: "error",
        });
      } else if (this.smsRemain < this.totalpackage) {
        this.$message({
          message: "Bạn không thể gửi vượt quá hạn mức còn lại.",
          type: "error",
        });
      } else if (this.numberpackage > 3) {
        this.$message({
          message: "Bạn chỉ được gửi tối đa 3 gói tin.",
          type: "error",
        });
      } else if (this.numberNoActive > 0) {
        this.$message({
          message: "Bạn không thể gửi cho tài khoản chưa được kích hoạt SMS",
          type: "error",
        });
      } else {
        this.$refs[fromData].validate((valid) => {
          if (valid) {
            this.loadingButton = true;
            let formDatas = new FormData();
            if (this.dataKidNotifySmsList != null) {
              formDatas.append("dataKidNotifySmsList", this.dataKidNotifySmsList.listId);
            } else if (this.dataClassNotifySmsList != null) {
              formDatas.append(
                "dataClassNotifySmsList",
                this.dataClassNotifySmsList.listId
              );
            } else if (this.dataGradeNotifySmsList != null) {
              formDatas.append(
                "dataGradeNotifySmsList",
                this.dataGradeNotifySmsList.listId
              );
            } else if (this.dataGroupNotifySmsList != null) {
              formDatas.append(
                "dataGroupNotifySmsList",
                this.dataGroupNotifySmsList.listId
              );
            }

            for (var key in this.createStudentNotifySms) {
              formDatas.append(key, this.createStudentNotifySms[key]);
            }
            console.log(this.createStudentNotifySms);
            formDatas.append("timer", this.radio);

            // if (this.multipartFileList.length > 0) {
            //     let sumSize = 0;

            //     this.multipartFileList.forEach((element, index) => {
            //         sumSize += element.size;
            //         console.log('file size' + sumSize);

            //         if (element.size > 5 * 1024 * 1024) {
            //             this.$message.error('Kích thước file thứ' + index + '> 5MB');
            //         }

            //     })
            //     if (sumSize > 25 * 1024 * 1024) {
            //         this.$message.error('Tổng Kích thước file quá lớn > 25MB');
            //     }
            //     this.multipartFileList.forEach((element) => {
            //         formDatas.append("multipartFileList", element.raw);
            //     });
            // }
            console.log("ngon");
            console.log(formDatas);
            console.log(this.createStudentNotifySms);
            console.log(this.dataKidNotifySmsList);

            StudentService.createdNotifyStudentSms(formDatas)
              .then(() => {
                this.$message({
                  message: "Tạo thông báo Sms thành công",
                  type: "success",
                });
                setTimeout(() => {
                  this.closeDialogByButton(fromData);
                  this.$parent.handleCurrentChange(1);
                  this.$parent.searchByProperties();
                }, 200);
              })
              .catch((err) => {
                this.$message({
                  message: err.response.data.message,
                  type: "error",
                });
                setTimeout(() => {
                  this.closeDialogByButton(fromData);
                }, 500);
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
      }
    },

    // handleRemove(file) {
    //     // this.$refs.upload.clearFiles();
    //     let index = this.fileList.indexOf(file);
    //     if (index >= 0) {
    //         this.fileList.splice(index, 1);
    //     }
    // },
    // handleExceed() {
    //     this.$message.warning(`Bạn chỉ được chọn 5 file`);
    // },
    // handlePictureCardPreview(file) {
    //     this.dialogImageUrl = file.url;
    //     this.dialogVisible1 = true;
    // },
    // handleDownload(file) {
    //     console.log(file);
    // },
    // toggleUpload(file, fileList) {
    //     this.fileAvatar = file.raw;
    //     this.multipartFileList = fileList;
    // },
    // handlePreview(file) {
    //     console.log(file);
    // },
    // beforeRemove(file) {
    //     return this.$confirm(`Bạn chắc chắn muốn xóa ${file.name} ?`);
    // },
    getNumber() {
      if (this.dataKidNotifySmsList != null) {
        this.numberReciver = this.dataKidNotifySmsList.listId.length;
        this.numberNoActive = this.dataKidNotifySmsList.listNoActive.length;
      }
      console.log(this.dataClassNotifySmsList);
      if (this.dataClassNotifySmsList != null) {
        console.log("hi");
        console.log(this.dataClassNotifySmsList);
        this.numberReciver = this.dataClassNotifySmsList.listId.length;
        this.numberNoActive = this.dataClassNotifySmsList.listNoActive.length;
      }
      if (this.dataGroupNotifySmsList != null) {
        console.log("hi");
        console.log(this.dataGroupNotifySmsList);
        this.numberReciver = this.dataGroupNotifySmsList.listId.length;
        this.numberNoActive = this.dataGroupNotifySmsList.listNoActive.length;
      }
      if (this.dataGradeNotifySmsList != null) {
        console.log("hi");
        console.log(this.dataGradeNotifySmsList);
        this.numberReciver = this.dataGradeNotifySmsList.listId.length;
        this.numberNoActive = this.dataGradeNotifySmsList.listNoActive.length;
      }

      // this.

      StudentService.findTitleSms()
        .then((response) => {
          this.createStudentNotifySms.sendTitle = response.data.data.title;
          this.showTitle = response.data.data.showTitle;
          this.smsMore = response.data.data.smsMore;
          this.smsRemain = response.data.data.smsRemain;
          this.checkActiveSms = response.data.data.checkActiveSms;
          this.showNotify();
          console.log(this.createStudentNotifySms.sendTitle);
        })
        .catch((err) => {
          this.$message({});
          console.log(err);
        })
        .finally(() => {
          this.loadingData = false;
        });
    },
    showLoading() {
      this.loadingData = true;
    },
    showNotify() {
      console.log(this.checkActiveSms);
      console.log(this.smsRemain);
      console.log(this.smsMore);
      console.log(this.showTitle);
      if (this.checkActiveSms == false) {
        this.$message({
          message: "Bạn chưa được cấp quyền gửi Sms",
          type: "error",
        });
        setTimeout(() => {
          this.closeDialog();
        }, 500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  font-family: Arial, Helvetica, sans-serif;
}
.form-content {
  display: flex;
  &__box {
    width: 100%;
  }
  &__box:nth-child(1) {
    margin-right: 30px;
  }
}
.row-checkbox {
  padding: 20px;
}
.row-heard {
  display: flex;
  &__item {
    font-size: 15px;
    margin-right: 5%;
    font-weight: bold;
  }
}
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
/deep/.el-form-item__content {
  margin: 0px !important;
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

/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-dialog__body {
  padding: 30px 50px;
}

/deep/.el-tabs__item {
  color: white;
}

/deep/.el-tabs__item.is-active {
  color: white;
  background: #67c23a;
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
/deep/.el-loading-mask {
  background-color: rgba(255, 255, 255, 0);
  .el-loading-text {
    font-size: 15px !important;
  }
}
</style>
