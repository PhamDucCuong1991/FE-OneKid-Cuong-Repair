<template>
  <div>
    <el-dialog
      :title="'Chi tiết lời nhắn: ' + messageData.kids.fullName"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="4vh"
    >
      <div class="main-content">
        <div class="over-table">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td class="table-item-name" style="width: 150px">Mục</td>
                <td style="text-align: center">Chi tiết lời nhắn</td>
                <td
                  v-if="checkPermission(['parentDiary_message_update'])"
                  class="table-action"
                >
                  Tác vụ
                </td>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr>
                <td class="table-index">1</td>
                <td class="table-item-name">
                  <div>Phụ huynh</div>
                  <br />
                  <div style="color: #4177e2">
                    {{ messageData.createdDate | formatDateTime }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ messageData.messageContent }}
                  </div>
                </td>

                <td
                  v-if="checkPermission(['parentDiary_message_update'])"
                  class="table-action"
                >
                  <el-button
                    :loading="loaddingButtom"
                    :disabled="messageData.confirmStatus ? true : false"
                    type="danger"
                    size="mini"
                    @click="handleConfirm()"
                  >
                    <span v-if="messageData.confirmStatus">Đã xác nhận</span>
                    <span v-else>Xác nhận</span>
                  </el-button>
                </td>
              </tr>
              <tr>
                <td class="table-index">2</td>
                <td class="table-item-name">File đính kèm</td>
                <td style="max-height: 40px !important">
                  <el-upload
                    class="upload-demo"
                    style="max-heigh: 20px"
                    ref="upload"
                    action
                    multiple
                    :auto-upload="false"
                    :on-change="handleChangeFile"
                    :limit="5"
                    :on-exceed="handleExceed"
                    :file-list="messageData.messageParentAttachFileList"
                    :on-preview="handleFileRequest"
                  >
                  </el-upload>
                </td>
                <td v-if="checkPermission(['parentDiary_message_update'])"></td>
              </tr>
              <tr>
                <td class="table-index">3</td>
                <td class="table-item-name">
                  <div>Giáo viên phản hồi</div>
                  <div class="color-text-reply">
                    {{ messageData.teacherTimeReply | formatDateTime }}
                  </div>
                </td>
                <td>
                  <textarea
                    :disabled="
                      messageData.teacherReplyDel ||
                      getAppTypeUserLogin != 'teacher'
                    "
                    type="textarea"
                    :rows="4"
                    style="width: 100%"
                    v-bind:value="newNameTeacher"
                    v-on:keyup="newNameTeacher = $event.target.value"
                    maxlength="3000"
                    textarea
                    show-word-limit
                    placeholder="Nhập nội dung giáo viên phản hồi"
                  ></textarea>
                </td>
                <td
                  v-if="checkPermission(['parentDiary_message_update'])"
                  class="table-action"
                >
                  <el-button
                    :loading="loaddingRevokeTeacher"
                    :disabled="!!this.newNameTeacher ? false : true"
                    type="success"
                    size="mini"
                    @click="revokeTeacherMethod()"
                  >
                    <span v-if="messageData.teacherReplyDel">Hủy thu hồi</span>
                    <span v-else>Thu hồi</span>
                  </el-button>
                </td>
              </tr>
              <tr>
                <td class="table-index">4</td>
                <td class="table-item-name">
                  <div>Nhà trường phản hồi</div>

                  <br />
                  <div class="color-text-reply">
                    {{ messageData.schoolTimeReply | formatDateTime }}
                  </div>
                </td>
                <td>
                  <textarea
                    :disabled="
                      messageData.schoolReplyDel ||
                      getAppTypeUserLogin != 'plus'
                    "
                    type="textarea"
                    :rows="4"
                    style="width: 100%"
                    v-bind:value="newName"
                    v-on:keyup="newName = $event.target.value"
                    maxlength="3000"
                    textarea
                    show-word-limit
                    placeholder="Nhập nội dung nhà trường phản hồi"
                  ></textarea>
                </td>

                <td
                  v-if="checkPermission(['parentDiary_message_update'])"
                  class="table-action"
                >
                  <el-button
                    v-if="getAppTypeUserLogin == 'plus'"
                    :disabled="!!this.newName ? false : true"
                    type="success"
                    size="mini"
                    :loading="loaddingRevokePlus"
                    @click="revokePlusMethod()"
                  >
                    <span v-if="messageData.schoolReplyDel">Hủy thu hồi</span>
                    <span v-else>Thu hồi</span>
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="margin-right: 10px"
          type="danger"
          size="medium"
          @click="closeDialogByButton()"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <span v-if="checkPermission(['parentDiary_message_update'])">
          <el-button
            v-if="
              (this.newName != '' &&
                this.newName != null &&
                this.newName != messageData.schoolReply) ||
              (this.newNameTeacher != '' &&
                this.newNameTeacher != null &&
                this.newNameTeacher != messageData.teacherReply)
            "
            type="success"
            size="medium"
            :loading="loadingButtonSaved"
            mini
            @click="handleSaveTakeLeave()"
          >
            <i class="el-icon-circle-check" />
            <span>Lưu</span>
          </el-button>
          <el-button v-else disabled type="success" size="medium" mini>
            <i class="el-icon-circle-check" />
            <span>Lưu</span>
          </el-button>
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import MessageParentService from "@/services/MessageParentService";
import http from "../../http-download";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      messageData: "",
      fullNameData: "",
      loadingButtonSaved: false,
      loaddingButtom: false,
      loaddingRevokePlus: false,
      loaddingRevokeTeacher: false,
      newName: "",
      newNameTeacher: "",
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    checkPermission,
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
    },
    handleFileRequest(file) {
      let a = file;
      console.log(a);
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlFileFeedback = file.id;
      this.downloadItem(label, extensionFile, idUrlFileFeedback);
    },
    downloadItem(label, extensionFile, idUrlFileFeedback) {
      http
        .get(`/message/messagedowload/${idUrlFileFeedback}`)
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
    handleSaveTakeLeave() {
      let dataInput = {
        id: this.messageData.id,
        content:
          this.getAppTypeUserLogin == "plus"
            ? this.newName
            : this.newNameTeacher,
      };
      (this.loadingButtonSaved = true),
        MessageParentService.saveReply(dataInput)
          .then((response) => {
            this.$message({
              message: response.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton();
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
              this.loadingButtonSaved = false;
            }, 500);
          });
    },
    /**
     * xac nhận
     */
    handleConfirm() {
      this.loaddingButtom = true;
      MessageParentService.confirmParentReply(this.messageData.id)
        .then((response) => {
          this.$message({
            message: response.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          this.loaddingButtom = false;
        });
    },
    /**
     * thu hồi, hủy thu hồi nhà trường
     */
    revokePlusMethod() {
      let dataInput = {
        id: this.messageData.id,
        status: !this.messageData.schoolReplyDel,
      };
      MessageParentService.revokePlus(dataInput)
        .then((response) => {
          this.messageData.schoolReplyDel = !this.messageData.schoolReplyDel;
          this.$message({
            message: response.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * thu hồi, hủy thu hồi giao vien
     */
    revokeTeacherMethod() {
      let dataInput = {
        id: this.messageData.id,
        status: !this.messageData.teacherReplyDel,
      };

      MessageParentService.revokeTeacher(dataInput)
        .then((response) => {
          this.messageData.teacherReplyDel = !this.messageData.teacherReplyDel;
          this.$message({
            message: response.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    // removeTeacherUnReply(type) {
    //   MessageParentService.update(
    //     this.messageData.id,
    //     this.messageData,
    //     (this.messageData.dataType = type)
    //   )
    //     .then((response) => {
    //       this.newMedicine = response.data.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     .finally(() => {
    //       setTimeout(() => {
    //         this.loadingButton = false;
    //       }, 500);
    //     });
    //   this.$message({
    //     message: "Hủy thu hồi thành công",
    //     type: "success",
    //   });
    // },
    // removeSchoolReply(type) {
    //   MessageParentService.update(
    //     this.messageData.id,
    //     this.messageData,
    //     (this.messageData.dataType = type)
    //   )
    //     .then((response) => {
    //       this.newTakeLeave = response.data.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     .finally(() => {
    //       setTimeout(() => {
    //         this.loadingButton = false;
    //       }, 500);
    //     });
    //   this.$message({
    //     message: "Thu hồi trả lời thành công",
    //     type: "success",
    //   });
    // },

    // removeSchoolUnReply(type) {
    //   MessageParentService.update(
    //     this.messageData.id,
    //     this.messageData,
    //     (this.messageData.dataType = type)
    //   )
    //     .then((response) => {
    //       this.newTakeLeave = response.data.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     .finally(() => {
    //       setTimeout(() => {
    //         this.loadingButton = false;
    //       }, 500);
    //     });
    //   this.$message({
    //     message: "Hủy thu hồi thành công",
    //     type: "success",
    //   });
    // },

    getDetailMessageInitial(id) {
      MessageParentService.getById(id)
        .then((resp) => {
          this.messageData = this.viewContent = resp.data.data;
          this.newName = this.messageData.schoolReply;
          this.newNameTeacher = this.messageData.teacherReply;
          // this.viewContent.user_unread= true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
.column {
  float: left;
  width: 50%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
.el-row {
  margin-bottom: 20px;
  // border-bottom: 1px solid #DCDFE6;
  // padding: 10px;
}
/deep/.el-upload-list__item .el-icon-close-tip {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0px !important;
  cursor: pointer;
  opacity: 1;
  color: #409eff;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
/deep/.el-upload-list__item .el-icon-close {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  opacity: 0.75;
  // color: #ffffff !important;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
td {
  padding: 10px;
}
.table-index {
  width: 30px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 150px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
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
.confirm {
  margin-top: -20px;
  margin-left: 25px;
}
/deep/[data-v-397b67cb] .el-textarea.is-disabled .el-textarea__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
.hhh {
  color: #f56c6c;
  margin-left: 100px;
  font-size: 17px;
  margin-top: -20px;
}

.ip1 {
  width: 50%;
}
/deep/.el-icon-close:before {
  content: "\e6db";
  color: #909399;
}
/deep/.el-textarea.is-disabled .el-textarea__inner {
  background-color: #ffff;
  border-color: #e4e7ed;
  color: #b9b9b9;
  cursor: not-allowed;
}
/deep/.el-upload-list__item .el-icon-upload-success {
  color: #ffffff !important;
}
</style>
