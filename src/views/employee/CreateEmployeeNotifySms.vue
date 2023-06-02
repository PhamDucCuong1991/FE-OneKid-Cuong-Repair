<template>
  <div>
    <el-dialog
      v-if="this.checkActiveSms == true"
      :visible.sync="dialogVisibleSms"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Thông tin gửi qua SMS nhân sự"
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
            Số người chưa được kích hoạt:
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
            Số tin:<span style="color: red">{{ this.numberpackage }}</span>
          </p>
        </div>
        <div class="row-heard__item" v-if="!this.smsMore">
          <p>
            Sms hạn mức:
            <span style="color: red">{{ this.smsRemain }}</span>
          </p>
        </div>
      </div>
      <el-form
        label-width="140px"
        :model="createEmployeeNotifySms"
        label-position="left"
        :rules="rules"
        ref="createEmployeeNotifySms"
      >
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Tiêu đề: " style="font-weight: bold">
                <span>{{ createEmployeeNotifySms.sendTitle }}</span>
              </el-form-item>
              <div class="form-content">
                <div class="form-content__box">
                  <h4>Nội dung:</h4>
                  <el-form-item prop="sendContent" style="margin-left: 0">
                    <el-input
                      :rows="10"
                      type="textarea"
                      placeholder="Nhập nội dung tiếng việt có dấu ..."
                      v-model="createEmployeeNotifySms.sendContent"
                      v-on:change="removeAccents(createEmployeeNotifySms.sendContent)"
                      :on-change="converStrSms(createEmployeeNotifySms.sendContent)"
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
                <el-radio
                  v-model="createEmployeeNotifySms.timer"
                  :label="false"
                  style="margin-right: 25px"
                  >Gửi ngay</el-radio
                >
                <el-radio
                  v-model="createEmployeeNotifySms.timer"
                  :label="true"
                  style="margin-right: 25px"
                  >Hẹn giờ</el-radio
                >
                <el-date-picker
                  :clearable="false"
                  v-if="createEmployeeNotifySms.timer"
                  v-model="createEmployeeNotifySms.dateTime"
                  value-format="yyyy-MM-dd - HH:mm"
                  type="datetime"
                  placeholder="Chọn thời gian"
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
          @click="closeDialogByButton('createEmployeeNotifySms')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitFromNew()"
        >
          <i class="el-icon-circle-check" />
          <span>Gửi</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EmployeeDataService from "@/services/EmployeeDataService";
import StudentService from "@/services/StudentService";

export default {
  props: {
    dialogVisibleSms: null,
    dataEmployeeNotifySmsList: null,
    dataDepartmentNotifySmsList: null,
  },
  data() {
    return {
      dialogVisible1: false,
      disabled: false,
      timeArm: false,
      // radio: "0",
      contentSms: [],
      contentSmsCv: "",
      numberReciver: 0,
      numberpackage: 0,
      totalpackage: 0,
      numberNoActive: 0,
      numberText: 0,
      value: "",
      loadingButton: false,
      createEmployeeNotifySms: {
        sendTitle: "",
        sendContent: "",
        timer: false,
        dateTime: "",
        idList: this.dataEmployeeNotifySmsList.listId,
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
      if (this.showTitle == true && this.createEmployeeNotifySms.sendTitle != null) {
        if (this.createEmployeeNotifySms.sendTitle != "") {
          str = this.createEmployeeNotifySms.sendTitle + str;
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
      if (this.showTitle == true && this.createEmployeeNotifySms.sendTitle != null) {
        str = this.createEmployeeNotifySms.sendTitle + "," + str;
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
      this.$refs["createEmployeeNotifySms"].resetFields();
      this.timeArm = false;
      (this.dataEmployeeNotifySmsList = null),
        (this.dataDepartmentNotifySmsList = null),
        (this.numberpackage = 0),
        (this.totalpackage = 0),
        (this.contentSms = ""),
        this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.timeArm = false;
      // this.showUpload = true;
      (this.dataEmployeeNotifySmsList = null),
        (this.dataDepartmentNotifySmsList = null),
        (this.createEmployeeNotifySms.sendTitle = "");
      this.createEmployeeNotifySms.sendContent = "";
      this.timeArm = false;
      this.createEmployeeNotifySms.dateTime = "";
      this.contentSms = "";
      (this.numberpackage = 0), (this.totalpackage = 0), this.$emit("dialog-close");
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
      if (this.radio == true && this.createEmployeeNotifySms.dateTime == "") {
        this.$message({
          message: "Bạn chưa thiết lập thời gian gửi.",
          type: "error",
        });
      } else if (this.smsRemain < this.totalpackage) {
        this.$message({
          message: "Bạn không thể gửi vượt quá hạn mức cho trước.",
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
            if (this.dataEmployeeNotifySmsList != null) {
              formDatas.append(
                "dataEmployeeNotifySmsList",
                this.dataEmployeeNotifySmsList.listId
              );
            }
            if (this.dataDepartmentNotifySmsList != null) {
              formDatas.append(
                "dataDepartmentNotifySmsList",
                this.dataDepartmentNotifySmsList.listId
              );
            }

            for (var key in this.createEmployeeNotifySms) {
              formDatas.append(key, this.createEmployeeNotifySms[key]);
            }
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
            console.log(this.createEmployeeNotifySms);

            EmployeeDataService.createdNotifySmsEmployee(formDatas)
              .then(() => {
                this.$message({
                  message: "Tạo thông báo Sms thành công",
                  type: "success",
                });
                setTimeout(() => {
                  this.closeDialogByButton(fromData);
                  this.$parent.handleCurrentChangeAfter();
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
    submitFromNew() {
      this.loadingButton = true;
      EmployeeDataService.createdNotifySmsEmployeeNew(this.createEmployeeNotifySms)
        .then(() => {
          this.$message({
            message: "Gửi thông báo Sms thành công",
            type: "success",
          });
          this.closeDialog();
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
      if (this.dataEmployeeNotifySmsList != null) {
        this.numberReciver = this.dataEmployeeNotifySmsList.listId.length;
        this.numberNoActive = this.dataEmployeeNotifySmsList.listNoActive.length;
      }
      if (this.dataDepartmentNotifySmsList != null) {
        this.numberReciver = this.dataDepartmentNotifySmsList.listId.length;
        this.numberNoActive = this.dataDepartmentNotifySmsList.listNoActive.length;
      }

      // this.

      StudentService.findTitleSms()
        .then((response) => {
          this.createEmployeeNotifySms.sendTitle = response.data.data.title;
          this.showTitle = response.data.data.showTitle;
          this.smsMore = response.data.data.smsMore;
          this.smsRemain = response.data.data.smsRemain;
          this.checkActiveSms = response.data.data.checkActiveSms;
          this.showNotify();
        })
        .catch((err) => {
          this.$message({});
          console.log(err);
        });
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
    // getSendSmsInitial(idInfoEmployeeList) {
    //   alert("1");
    //   this.createEmployeeNotifySms.idInfoEmployeeList = idInfoEmployeeList;
    // },
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
</style>
