<template>
  <el-dialog
    title="Chi tiết giáo viên góp ý"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <div class="hr">
      <hr />
    </div>

    <div class="table-content row-data">
      <div class="title">
        <span style="font-size: 18px">Tiêu đề :</span>
        {{ this.viewContent.feedbackTitle }}
      </div>

      <div class="content">
        <span style="font-size: 18px">Nội dung :</span>
        <el-input
          type="textarea"
          rows="5"
          v-model="this.viewContent.feedbackContent"
          >{{ this.viewContent.feedbackContent }}</el-input
        >
      </div>

      <div class="file">
        <span style="font-size: 18px; margin-bottom: 50px"
          >File đính kèm :</span
        >
        <div class="chuafile" style="margin-bottom: 30px">
          <el-upload
            class="upload-demo"
            ref="upload"
            style="margin-top: -30px"
            action
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="handleBeforeUpload"
            multiple
            :auto-upload="false"
            :on-change="handleChangeFile"
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="viewContent.feedBackFileList"
            :on-preview="handleFileRequest"
          >
          </el-upload>
        </div>
      </div>

      <div class="reply">
        <span style="font-size: 18px; display: block"
          >Nhà trường trả lời:
        </span>
        <textarea
          v-if="viewContent.schoolReplyDel == false"
          type="textarea"
          :rows="5"
          v-bind:value="newName"
          v-on:keyup="newName = $event.target.value"
          maxlength="3000"
          show-word-limit
          style="border: 1px solid #dcdfe6; width: 99%"
        ></textarea>

        <textarea
          v-else
          disabled
          type="textarea"
          :rows="5"
          v-bind:value="newName"
          v-on:keyup="newName = $event.target.value"
          maxlength="3000"
          show-word-limit
          style="border: 1px solid #dcdfe6; width: 99%"
        ></textarea>
      </div>
      <div class="xn">
        <span>Xác nhận:</span>
        {{ this.viewContent.confirmName }} |
        {{ this.viewContent.confirmDate | formatDateTime }}
      </div>
      <div class="tl">
        <span>Trả lời:</span>
        {{ this.viewContent.replyName }} |
        {{ this.viewContent.schoolTimeReply | formatDateTime }}
      </div>
      <el-button
        style="float: right; margin-left: 10px"
        type="danger"
        @click="closeDialogByButton()"
        icon="el-icon-circle-close"
        >Đóng</el-button
      >
      <div v-if="checkPermission(['news_feedbackTeacher_update'])" class="btt">
        <el-button
          type="danger"
          v-if="
            viewContent.schoolReplyDel == false &&
            this.newName != '' &&
            this.newName != null &&
            newName == viewContent.schoolReply &&
            viewContent.idSchoolReply != null
          "
          @click="remove('feedbackRemove')"
          :loading="loaddingButton"
          icon="el-icon-folder-remove"
          >Thu hồi trả lời
        </el-button>
        <el-button
          type="danger"
          disabled
          v-else-if="
            viewContent.schoolReplyDel == false &&
            this.newName != viewContent.schoolReply
          "
          icon="el-icon-folder-remove"
          >Thu hồi trả lời</el-button
        >

        <el-button
          type="danger"
          v-else-if="
            viewContent.schoolReplyDel == true &&
            this.newName != '' &&
            viewContent.schoolReply != null
          "
          :loading="loaddingButton"
          @click="remove1('feedbackRemove1')"
          icon="el-icon-folder-checked"
          >Hủy thu hồi</el-button
        >
        <el-button
          type="danger"
          v-else-if="
            viewContent.schoolReplyDel == true &&
            this.newName != '' &&
            viewContent.schoolReply == null &&
            viewContent.schoolReply != this.newName
          "
          disabled
          @click="remove1('feedbackRemove1')"
          icon="el-icon-folder-checked"
          >Hủy thu hồi</el-button
        >
        <el-button
          v-if="
            this.newName != '' &&
            this.newName != null &&
            viewContent.schoolReply != this.newName
          "
          type="success"
          @click="submitForm('feedbackSend')"
          icon="el-icon-circle-check"
          >Gửi phản hồi</el-button
        >
        <el-button
          v-else
          disabled
          type="success"
          @click="submitForm('feedbackSend')"
          icon="el-icon-circle-check"
          >Gửi phản hồi</el-button
        >
        <el-button
          type="primary"
          :loading="loadingButtonOK"
          @click="submitForm1('feedbackConfirm')"
          v-if="!viewContent.schoolConfirmStatus"
          icon="el-icon-circle-check"
          >Xác nhận</el-button
        >
        <el-button type="info" v-else disabled icon="el-icon-circle-check"
          >Xác nhận</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import TeacherFeedbackService from "@/services/TeacherFeedbackService";
import http from "../../http-download";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      loaddingButton: false,
      loadingButtonOK: false,
      viewContent: "",
      textarea: "",
      schoolConfirmStatus: "",
      schoolUnread: "",
      names: "",
      newName: "",
    };
  },
  methods: {
    checkPermission,
    ok() {
      console.log(this.newName);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
    },
    getDetailMethod(id) {
      TeacherFeedbackService.getById(id)
        .then((resp) => {
          let data = (this.viewContent = resp.data.data);
          this.newName = this.viewContent.schoolReply;
          this.content = data.content;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleFileRequest(file) {
      let a = file;
      console.log(a);
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlFileAppsend = file.id;
      this.downloadItem(label, extensionFile, idUrlFileAppsend);
    },
    downloadItem(label, extensionFile, idUrlFileAppsend) {
      http
        .get(`/feedbackpr/feedbackdownload/${idUrlFileAppsend}`)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", label);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Thất bại",
            type: "error",
          });
        });
    },
    submitForm(type) {
      TeacherFeedbackService.update(
        this.viewContent.id,
        this.viewContent,
        (this.viewContent.schoolReply = this.newName),
        (this.viewContent.schoolUnread = true),
        (this.viewContent.schoolConfirmStatus = true),
        (this.viewContent.dataType = type)
      )
        .then((response) => {
          this.newFeedbackUpdate = response.data.data;
          this.$message({
            message: response.data.message,
            type: "success",
          });
          if (type != "feedbackRemove") {
            setTimeout(() => {
              this.closeDialog();
            }, 500);
          }
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

    submitForm1(type) {
      this.loadingButtonOK = false;
      TeacherFeedbackService.update(
        this.viewContent.id,
        this.viewContent,
        (this.viewContent.schoolUnread = true),
        (this.viewContent.schoolConfirmStatus = true),
        (this.viewContent.dataType = type)
      )
        .then((response) => {
          this.newFeedbackUpdate = response.data.data;
          this.$message({
            message: "Xác nhận thành công",
            type: "success",
          });
          if (type != "feedbackRemove") {
            setTimeout(() => {
              this.closeDialog();
            }, 500);
          }
        })
        .catch((err) => {
          this.loadingButtonOK = false;
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonOK = false;
          }, 500);
        });
      setTimeout(() => {
        this.closeDialog();
      }, 500);
    },
    remove(type) {
      if (type == "feedbackRemove" || type == "feedbackRemove1") {
        this.loaddingButton = true;
      }
      TeacherFeedbackService.update(
        this.viewContent.id,
        this.viewContent,
        (this.viewContent.schoolReply = this.newName),
        (this.viewContent.dataType = type),
        (this.viewContent.schoolReplyDel = true)
      )
        .then((response) => {
          this.newFeedbackUpdate = response.data.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            if (type == "feedbackRemove" || type == "feedbackRemove1") {
              this.loaddingButton = false;
            }
          }, 500);
        });
      this.$message({
        message: "Thu hồi thành công",
        type: "success",
      });
    },
    remove1(type) {
      if (type == "feedbackRemove" || type == "feedbackRemove1") {
        this.loaddingButton = true;
      }
      TeacherFeedbackService.update(
        this.viewContent.id,
        this.viewContent,
        (this.viewContent.dataType = type),
        (this.viewContent.schoolReplyDel = false)
      )
        .then((response) => {
          this.newFeedbackUpdate = response.data.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            if (type == "feedbackRemove" || type == "feedbackRemove1") {
              this.loaddingButton = false;
            }
          }, 500);
        });
      this.$message({
        message: "Hủy thu hồi thành công",
        type: "success",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
textarea:focus {
  outline: none !important;
  border: none;
  // box-shadow: 0 0 10px #719ECE;
}

textarea {
  // resize: vertical;
  padding: 10px;
  font-size: 14px;
  font-family: arial;
}
.btt {
  float: right;
  margin-top: 0px;
}
/deep/[data-v-fe3ffff4] [data-v-fe3ffff4] .th[data-v-fe3ffff4] {
  margin-top: -86px;
  margin-left: 160px;
  // text-decoration: underline;
}

/deep/.el-button--text {
  color: #f70101;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
}
.xn {
  height: 20px;
  font-size: 14px;
  margin-top: 10px;
  margin-left: 7px;
}

/deep/.el-button [class*="el-icon-"] + span {
  margin-left: 5px;
}
.tl {
  height: 20px;
  font-size: 14px;
  margin-top: -20px;
  margin-left: 350px;
}
.view {
  margin-left: 130px;
  margin-top: -20px;
  color: #25aff3;
  font-size: 14px;
}

.title {
  margin-top: 15px;
  height: 40px;
  font-size: 18px;
  font-family: arial;
}
.content {
  margin-top: -10px;
  font-family: arial;
}
.file {
  margin-top: 5px;
}
.hr {
  margin-top: -60px;
}
.reply {
  margin-top: -20px;
}
/deep/.el-dialog__title {
  line-height: 24px;
  font-size: 25px;
  color: #606266;
}
/deep/.el-dialog__body {
  padding: 30px 20px;
  // color: #000000;
  font-size: 14px;
  word-break: break-all;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 99%;
  font-family: arial;
  font-size: 14px;
  color: #606266;
  background-color: #f0f0f0;
  background-image: none;
  // border: 1px solid #000000;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/ .el-dialog__body {
  padding: 55px 20px;
  // color: #000000;
  font-size: 14px;
  word-break: break-all;
}
/deep/el-upload-list__item.is-success .el-upload-list__item-status-label {
  display: none;
}
/deep/.el-upload-list__item .el-icon-upload-success {
  color: #ffffff !important;
}
/deep/.el-upload-list__item .el-icon-close {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  opacity: 0.75;
  color: #ffffff;
}
/deep/.textarea {
  padding: 10px;
  font-size: 14px;
  font-family: arial;
  width: 96% !important;
}
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
  word-break: break-word;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  word-break: break-word;
  color: #606266;
  font-size: 14px;
  background-color: #f0f0f0;
  background-image: none;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/.el-upload-list__item-name {
  color: #606266;
  display: block;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  transition: color 0.3s;
  white-space: nowrap;
  margin-bottom: 17px;
  line-height: 13px;
  margin-left: 21px;
  margin-top: 14px;
}
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
  max-height: 50px;
  font-family: arial;
  word-break: break-word;
  text-overflow: ellipsis;
}
/deep/.el-upload-list__item .el-icon-close-tip {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0px;
  cursor: pointer;
  /* opacity: 1; */
  color: #409eff;
}
</style>
