<template>
  <div>
    <el-dialog
      :title="'Nhận xét tháng: ' + fullNameData"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="4vh"
    >
      <div class="main-content">
        <div class="over-table">
          <div style="margin-bottom: 5px">
            Người nhận xét: {{ evaluateMonthDataKid.lastModifieBy }},
            {{ evaluateMonthDataKid.lastModifieDate | formatDateTime }}
          </div>
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="column-index">STT</td>
                <td class="column-item">Mục</td>
                <td style="text-align: center">Nội dung</td>
                <td class="table-action">Tác vụ</td>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr>
                <td class="column-index">1</td>
                <td class="column-item">Nội dung</td>
                <td>
                  <el-input
                    :disabled="evaluateMonthDataKid.id == null ? true : false"
                    type="textarea"
                    :rows="6"
                    v-model="evaluateMonthDataKid.content"
                    placeholder="Nhập nội dung"
                  ></el-input>
                </td>
                <td class="table-action"></td>
              </tr>
              <tr>
                <td class="column-index">2</td>
                <td class="column-item">File đính kèm</td>
                <td>
                  <el-upload
                    class="upload-demo"
                    action
                    :on-change="handleChange"
                    :file-list="evaluateMonthDataKid.evaluateMonthFileList"
                    :on-exceed="handleExceedEvaluateDate"
                    :on-remove="handleRemove"
                    :on-preview="downloadFile"
                    :auto-upload="false"
                    limit="3"
                    multiple
                  >
                    <el-button
                      :disabled="evaluateMonthDataKid.id == null ? true : false"
                      type="text"
                      style="text-decoration: underline; font-size: 12px"
                      >Thêm file</el-button
                    >
                  </el-upload>
                </td>
                <td class="column-action"></td>
              </tr>

              <tr>
                <td class="column-index">3</td>
                <td class="column-item">
                  <div>Phụ huynh phản hồi</div>
                  <div>{{ evaluateMonthDataKid.parentReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluateMonthDataKid.parentReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="evaluateMonthDataKid.parentReplyDel"
                  style="color: red"
                >
                  Nội dung đã được thu hồi
                </td>
                <td v-else>
                  <span>{{ evaluateMonthDataKid.parentReplyContent }}</span>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluateMonthDataKid.parentReplyDel ||
                    !!!evaluateMonthDataKid.parentReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <el-button
                    class="width-button"
                    type="success"
                    size="mini"
                    disabled
                    v-if="evaluateMonthDataKid.schoolReadReply"
                    >Đã đọc</el-button
                  >
                  <el-button
                    v-else
                    class="width-button"
                    type="success"
                    size="mini"
                    @click="handleConfirmSchoolRead()"
                    >Xác nhận đọc</el-button
                  >
                </td>
              </tr>

              <tr>
                <td class="column-index">4</td>
                <td class="column-item">
                  <div>Giáo viên phản hồi</div>
                  <div>{{ evaluateMonthDataKid.teacherReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluateMonthDataKid.teacherReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="
                    evaluateMonthDataKid.parentReplyDel ||
                    !!!evaluateMonthDataKid.parentReplyContent
                  "
                >
                  <el-input type="textarea" :rows="3" disabled></el-input>
                </td>
                <td v-else>
                  <el-input
                    v-if="evaluateMonthDataKid.teacherReplyDel"
                    type="textarea"
                    :rows="3"
                    disabled
                    v-model="evaluateMonthDataKid.teacherReplyContent"
                  ></el-input>
                  <el-input
                    v-else
                    type="textarea"
                    :rows="3"
                    :disabled="getAppTypeUserLogin != 'teacher'"
                    v-model="evaluateMonthDataKid.teacherReplyContent"
                    placeholder="Nhập nội dung"
                  ></el-input>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluateMonthDataKid.parentReplyDel ||
                    !!!evaluateMonthDataKid.parentReplyContent ||
                    !!!evaluateMonthDataKid.teacherReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <el-button
                    class="width-button"
                    type="success"
                    size="mini"
                    v-if="evaluateMonthDataKid.teacherReplyDel"
                    @click="handleTeacherUnRevoke()"
                    >Hủy thu hồi</el-button
                  >
                  <el-button
                    class="width-button"
                    type="success"
                    size="mini"
                    v-else
                    @click="handleTeacherRevoke()"
                    >Thu hồi</el-button
                  >
                </td>
              </tr>
              <tr>
                <td class="column-index">5</td>
                <td class="column-item">
                  <div>Nhà trường phản hồi</div>
                  <div>{{ evaluateMonthDataKid.schoolReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluateMonthDataKid.schoolReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="
                    evaluateMonthDataKid.parentReplyDel ||
                    !!!evaluateMonthDataKid.parentReplyContent
                  "
                >
                  <el-input type="textarea" :rows="3" disabled></el-input>
                </td>
                <td v-else>
                  <el-input
                    v-if="evaluateMonthDataKid.schoolReplyDel"
                    type="textarea"
                    :rows="3"
                    disabled
                    v-model="evaluateMonthDataKid.schoolReplyContent"
                  ></el-input>
                  <el-input
                    v-else
                    type="textarea"
                    :rows="3"
                    :disabled="getAppTypeUserLogin != 'plus'"
                    v-model="evaluateMonthDataKid.schoolReplyContent"
                    placeholder="Nhập nội dung"
                  ></el-input>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluateMonthDataKid.parentReplyDel ||
                    !!!evaluateMonthDataKid.parentReplyContent ||
                    !!!evaluateMonthDataKid.schoolReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <span v-if="getAppTypeUserLogin == 'plus'">
                    <el-button
                      class="width-button"
                      type="success"
                      size="mini"
                      v-if="evaluateMonthDataKid.schoolReplyDel"
                      @click="handleSchoolUnRevoke()"
                      >Hủy thu hồi</el-button
                    >
                    <el-button
                      class="width-button"
                      type="success"
                      size="mini"
                      v-else
                      @click="handleSchoolRevoke()"
                      >Thu hồi</el-button
                    >
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 20px">
            Tháng nhận xét
            <el-date-picker
              class="input-common input-date"
              style="width: 135px"
              v-model="dataSearchMonth.date"
              type="month"
              :clearable="false"
              format="MM-yyyy"
              value-format="yyyy-MM-dd"
              placeholder="Chọn tháng"
              @change="getSearchEvaluateMonthByIdKid()"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton()">
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          v-if="evaluateMonthDataKid.id != null"
          type="success"
          size="medium"
          :loading="loadingButtonSaved"
          mini
          @click="submitForm()"
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
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EvaluateService from "@/services/EvaluateService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      evaluateMonthDataKid: {},
      fullNameData: "",
      fileInputList: [],
      fileDeleteList: [],
      dataSearchMonth: {
        date: "",
        idKid: "",
      },
      startDayOfWeek: {
        firstDayOfWeek: 1,
      },
      loadingButtonSaved: false,
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetData();
      }, 100);
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetData();
      }, 100);
    },
    resetData() {
      this.fileInputList = [];
      this.fileDeleteList = [];
      this.evaluateDateKid.evaluateMonthFileList = [];
    },
    handleChange(file, fileList) {
      this.fileInputList = fileList.filter((x) => x.id == undefined);
    },
    handleRemove(file, fileList) {
      if (file.id == undefined) {
        this.fileInputList = fileList.filter((x) => x.id == undefined);
      } else {
        this.fileDeleteList.push(file);
      }
    },
    downloadFile(file) {
      let id = file.id;
      let fileName = file.name;
      EvaluateService.downloadFileMonth(id)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Dowload file thất bại",
            type: "error",
          });
        });
    },
    handleExceedEvaluateDate() {
      this.$message.warning(`Giới hạn là 3 file`);
    },
    /**
     * xóa nội dung đánh giá tháng
     */
    handleClearContentEvaluateWeek() {
      this.evaluateMonthDataKid.content = null;
    },
    /**
     * xác nhận nhà trường đã đọc phản hồi của phụ huynh
     */
    handleConfirmSchoolRead() {
      this.evaluateMonthDataKid.schoolReadReply = true;
    },
    /**
     * giáo viên thu hồi
     */
    handleTeacherRevoke() {
      this.evaluateMonthDataKid.teacherReplyDel = true;
    },
    /**
     * giáo viên hủy thu hồi
     */
    handleTeacherUnRevoke() {
      this.evaluateMonthDataKid.teacherReplyDel = false;
    },
    /**
     * giáo viên thu hồi
     */
    handleSchoolRevoke() {
      this.evaluateMonthDataKid.schoolReplyDel = true;
    },
    /**
     * giáo viên hủy thu hồi
     */
    handleSchoolUnRevoke() {
      this.evaluateMonthDataKid.schoolReplyDel = false;
    },
    /**
     * tìm kiếm đánh giá tháng của một học sinh
     */
    getSearchEvaluateMonthByIdKid() {
      EvaluateService.searchEvaluateMonthDateAndKid(
        this.dataSearchMonth.date,
        this.dataSearchMonth.idKid
      )
        .then((resp) => {
          this.evaluateMonthDataKid = resp.data.data;
          if (this.evaluateMonthDataKid.id == null) {
            this.$alert(
              "Không có thông tin nhận xét cho tháng này",
              "Thông báo!",
              {
                confirmButtonText: "Đóng",
              }
            );
            this.evaluateMonthDataKid.evaluateMonthFileList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * lưu đánh tháng giá cho một học sinh bao gồm phản hồi
     */
    submitForm() {
      let inputData = this.evaluateMonthDataKid;
      let formDatas = new FormData();
      for (var key in inputData) {
        let dataInput = inputData[key];
        formDatas.append(key, dataInput);
      }
      if (this.fileInputList.length > 0) {
        this.fileInputList.forEach((x) => {
          formDatas.append("multipartFileList", x.raw);
        });
      }
      if (this.fileDeleteList.length > 0) {
        this.fileDeleteList.forEach((x) => {
          formDatas.append("fileDeleteList", x.id);
        });
      }
      this.loadingButtonSaved = true;
      EvaluateService.saveEvaluateMonthDetail(formDatas)
        .then((resp) => {
          let evaluteMonthSaved = resp.data.data;
          console.log(evaluteMonthSaved);
          this.$message({
            message: "Lưu nhận xét tháng cho một học sinh thành công",
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu nhận xét tháng cho một học sinh thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonSaved = false;
          }, 500);
        });
    },
    getEvaluateMonthUpdateInitail(data, week) {
      this.fullNameData = data.kids.fullName;
      this.dataSearchMonth.date = week;
      this.dataSearchMonth.idKid = data.kids.id;
      this.getEvaluateMonthKid(data.id);
    },
    getEvaluateMonthKid(id) {
      EvaluateService.searchEvaluateMonthById(id)
        .then((resp) => {
          this.evaluateMonthDataKid = resp.data.data;
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
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
.el-row {
  margin-bottom: 20px;
  // border-bottom: 1px solid #DCDFE6;
  // padding: 10px;
}
// .main-content {
//   border: 1px solid #dcdfe6;
//   padding: 20px;
//   max-height: 450px;
//   overflow-y: scroll;
// }
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
td {
  padding: 10px;
}
.column-index {
  width: 30px;
  text-align: center;
}
.column-item {
  width: 150px;
  text-align: center;
}
.column-name {
  width: 150px;
  text-align: center;
}
.column-action {
  width: 80px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.width-button {
  width: 110px;
}
</style>