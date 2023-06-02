<template>
  <div>
    <el-dialog
      :title="'Chi tiết xin nghỉ nhân sự: ' + takeLeaveData.createdBy"
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
                <td class="table-item-name">Mục</td>
                <td style="text-align: center">Chi tiết đơn xin nghỉ</td>
                <td
                  v-if="checkPermission(['attendanceEmployee_absentTeacher_update'])"
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
                    {{ takeLeaveData.createdDate | formatDateTime }}
                  </div>
                </td>
                <td>
                  <div style="margin-bottom: 10px">
                    - Thời gian nghỉ:
                    {{ takeLeaveData.fromDate | formatDate }} đến
                    {{ takeLeaveData.toDate | formatDate }}
                  </div>
                  <div>- Nội dung: {{ takeLeaveData.content }}</div>
                </td>

                <td
                  v-if="checkPermission(['attendanceEmployee_absentTeacher_update'])"
                  class="table-action"
                >
                  <el-button
                    :disabled="takeLeaveData.confirmStatus ? true : false"
                    type="success"
                    size="mini"
                    @click="handleConfirm()"
                  >
                    <span v-if="takeLeaveData.confirmStatus">Đã xác nhận</span>
                    <span v-else>Xác nhận</span>
                  </el-button>
                </td>
              </tr>
              <tr>
                <td class="table-index">2</td>
                <td class="table-item-name">File đính kèm</td>
                <td>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action
                    multiple
                    :auto-upload="false"
                    :on-change="handleChangeFile"
                    :limit="5"
                    :on-exceed="handleExceed"
                    :file-list="takeLeaveData.fileList"
                    :on-preview="handleFileRequest"
                  >
                  </el-upload>
                </td>
                <td
                  v-if="checkPermission(['attendanceEmployee_absentTeacher_update'])"
                ></td>
              </tr>
              <tr>
                <td class="table-index">3</td>
                <td class="table-item-name">
                  <div>Nhà trường phản hồi</div>
                  <br />
                  <div class="color-text-reply">
                    {{ takeLeaveData.schoolTimeReply | formatDateTime }}
                  </div>
                </td>
                <td>
                  <textarea
                    :disabled="takeLeaveData.schoolReplyDel ? true : false"
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
                  v-if="checkPermission(['attendanceEmployee_absentTeacher_update'])"
                  class="table-action"
                >
                  <el-button
                    :disabled="!!this.newName ? false : true"
                    type="success"
                    size="mini"
                    @click="revokePlusMethod()"
                  >
                    <span v-if="takeLeaveData.schoolReplyDel">Hủy thu hồi</span>
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
          type="danger"
          size="medium"
          style="margin-right: 5px"
          @click="closeDialogByButton()"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <span v-if="checkPermission(['attendanceEmployee_absentTeacher_update'])">
          <el-button
            v-if="
              this.newName != '' &&
              this.newName != null &&
              this.newName != takeLeaveData.schoolReply
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
          <el-button
            v-else
            disabled
            type="success"
            size="medium"
            :loading="loadingButtonSaved"
            mini
          >
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
import AbsentTeacherService from "@/services/AbsentTeacherService";
import http from "../../http-download";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      // takeLeaveData: {},
      takeLeaveData: "",
      // fullNameData: "",
      loadingButtonSaved: false,
      newName: "",
    };
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

    /**
     * click lưu
     */
    handleSaveTakeLeave() {
      let dataInput = {
        id: this.takeLeaveData.id,
        content: this.newName,
      };
      (this.loadingButtonSaved = true),
        AbsentTeacherService.saveReplyTeacher(dataInput)
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
      AbsentTeacherService.confirmTeacherReply(this.takeLeaveData.id)
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
        });
    },
    handleFileRequest(file) {
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlFileAbsent = file.id;
      this.downloadItem(label, extensionFile, idUrlFileAbsent);
    },
    downloadItem(label, extensionFile, idUrlFileAbsent) {
      http
        .get(`/absent-teacher/absent-download/${idUrlFileAbsent}`)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", label);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * thu hồi, hủy thu hồi nhà trường
     */
    revokePlusMethod() {
      let dataInput = {
        id: this.takeLeaveData.id,
        status: !this.takeLeaveData.schoolReplyDel,
      };
      AbsentTeacherService.revokePlusTeacher(dataInput)
        .then((response) => {
          this.takeLeaveData.schoolReplyDel = !this.takeLeaveData.schoolReplyDel;
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

    getDetailMessageInitial(id) {
      AbsentTeacherService.getByIdTeacher(id)
        .then((resp) => {
          this.takeLeaveData = this.viewContent = resp.data.data;
          this.newName = this.takeLeaveData.schoolReply;
          // this.viewContent.user_unread= true;
        })
        .catch((err) => {
          console.log(err.response.data.message);
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
  color: #ffffff !important;
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
.timeleave {
  white-space: pre-line !important;
  word-break: break-all;
  background-color: blanchedalmond;
  word-break: break-word;
}
// .timeleave[data-v-01c71f54] {
//     white-space: pre-line!important;
//     word-break: break-all;
//     background-color: blanchedalmond;
// 	    word-break: break-word;
// }
.timelea {
  border-right: 1px solid #ebeef5;
  background-color: lavenderblush;
  word-break: break-word;
}

.ip1 {
  width: 50%;
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
