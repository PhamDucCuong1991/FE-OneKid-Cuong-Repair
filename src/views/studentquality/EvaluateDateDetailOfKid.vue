<template>
  <div>
    <el-dialog
      :title="'Nhận xét ngày: ' + fullNameDialog"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <!-- table content -->
      <table border class="table-data">
        <thead class="table-header">
          <tr>
            <td class="column-index">STT</td>
            <td class="column-item">Mục nhận xét</td>
            <td class="column-name">Họ tên</td>
            <td>Nội dung</td>
            <td class="column-action">Tác vụ</td>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr>
            <td class="column-index">1</td>
            <td class="column-item">Học tập</td>
            <td class="column-name">{{ evaluateDateKid.learnCreatedBy }}</td>
            <td>
              <el-input
                type="textarea"
                autosize
                v-model="evaluateDateKid.learnContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                @click="handleEvaluateSampleDate('Học tập')"
                >Mẫu</el-button
              >
            </td>
          </tr>
          <tr>
            <td class="column-index">2</td>
            <td class="column-item">Ăn uống</td>
            <td class="column-name">{{ evaluateDateKid.eatCreatedBy }}</td>
            <td>
              <el-input
                type="textarea"
                autosize
                v-model="evaluateDateKid.eatContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                @click="handleEvaluateSampleDate('Ăn uống')"
                >Mẫu</el-button
              >
            </td>
          </tr>
          <tr>
            <td class="column-index">3</td>
            <td class="column-item">Ngủ nghỉ</td>
            <td class="column-name">{{ evaluateDateKid.sleepCreatedBy }}</td>
            <td>
              <el-input
                type="textarea"
                autosize
                v-model="evaluateDateKid.sleepContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                @click="handleEvaluateSampleDate('Ngủ nghỉ')"
                >Mẫu</el-button
              >
            </td>
          </tr>
          <tr>
            <td class="column-index">4</td>
            <td class="column-item">Sức khỏe</td>
            <td class="column-name">{{ evaluateDateKid.healtCreatedBy }}</td>
            <td>
              <el-input
                type="textarea"
                autosize
                v-model="evaluateDateKid.healtContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                @click="handleEvaluateSampleDate('Sức khỏe')"
                >Mẫu</el-button
              >
            </td>
          </tr>
          <tr>
            <td class="column-index">5</td>
            <td class="column-item">Vệ sinh</td>
            <td class="column-name">{{ evaluateDateKid.sanitaryCreatedBy }}</td>
            <td>
              <el-input
                type="textarea"
                autosize
                v-model="evaluateDateKid.sanitaryContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                @click="handleEvaluateSampleDate('Vệ sinh')"
                >Mẫu</el-button
              >
            </td>
          </tr>
          <tr>
            <td class="column-index">6</td>
            <td class="column-item">Nhận xét chung</td>
            <td class="column-name">{{ evaluateDateKid.commonCreatedBy }}</td>
            <td>
              <el-input
                type="textarea"
                autosize
                v-model="evaluateDateKid.commonContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                @click="handleEvaluateSampleDate('Nhận xét chung')"
                >Mẫu</el-button
              >
            </td>
          </tr>
          <tr>
            <td class="column-index">7</td>
            <td class="column-item">File đính kèm</td>
            <td class="column-name"></td>
            <td>
              <el-upload
                class="upload-demo"
                action
                :on-change="handleChange"
                :file-list="evaluateDateKid.evaluateAttachFileList"
                :on-exceed="handleExceedEvaluateDate"
                :on-remove="handleRemove"
                :on-preview="downloadFile"
                :auto-upload="false"
                limit="3"
                multiple
              >
                <el-button
                  size="small"
                  type="text"
                  style="text-decoration: underline"
                  >Thêm file</el-button
                >
              </el-upload>
            </td>
            <td class="column-action"></td>
          </tr>
          <tr>
            <td class="column-index">8</td>
            <td class="column-item">Phụ huynh phản hồi</td>
            <td class="column-name">
              <div>{{ evaluateDateKid.parentReplyCreatedBy }}</div>
              <div class="color-text-reply">
                {{ evaluateDateKid.parentReplyDatetime | formatDateTime }}
              </div>
            </td>
            <td v-if="evaluateDateKid.parentReplyDel" style="color: red">
              Nội dung đã được thu hồi
            </td>
            <td v-else>
              <span>{{ evaluateDateKid.parentReplyContent }}</span>
            </td>
            <td
              class="column-action"
              v-if="
                evaluateDateKid.parentReplyDel ||
                !!!evaluateDateKid.parentReplyContent
              "
            ></td>
            <td v-else class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                disabled
                v-if="evaluateDateKid.schoolReadReply"
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
            <td class="column-index">9</td>
            <td class="column-item">Giáo viên phản hồi</td>
            <td class="column-name">
              <div>{{ evaluateDateKid.teacherReplyCreatedBy }}</div>
              <div class="color-text-reply">
                {{ evaluateDateKid.teacherReplyDatetime | formatDateTime }}
              </div>
            </td>
            <td
              v-if="
                evaluateDateKid.parentReplyDel ||
                !!!evaluateDateKid.parentReplyContent
              "
            >
              <el-input type="textarea" :rows="3" disabled></el-input>
            </td>
            <td v-else>
              <el-input
                v-if="evaluateDateKid.teacherReplyDel"
                type="textarea"
                :rows="3"
                disabled
                v-model="evaluateDateKid.teacherReplyContent"
              ></el-input>
              <el-input
                v-else
                :disabled="getAppTypeUserLogin != 'teacher'"
                type="textarea"
                :rows="3"
                v-model="evaluateDateKid.teacherReplyContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td
              class="column-action"
              v-if="
                evaluateDateKid.parentReplyDel ||
                !!!evaluateDateKid.parentReplyContent ||
                !!!evaluateDateKid.teacherReplyContent
              "
            ></td>
            <td v-else class="column-action">
              <el-button
                class="width-button"
                type="success"
                size="mini"
                v-if="evaluateDateKid.teacherReplyDel"
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
            <td class="column-index">10</td>
            <td class="column-item">Nhà trường phản hồi</td>
            <td class="column-name">
              <div>{{ evaluateDateKid.schoolReplyCreatedBy }}</div>
              <div class="color-text-reply">
                {{ evaluateDateKid.schoolReplyDatetime | formatDateTime }}
              </div>
            </td>
            <td
              v-if="
                evaluateDateKid.parentReplyDel ||
                !!!evaluateDateKid.parentReplyContent
              "
            >
              <el-input type="textarea" :rows="3" disabled></el-input>
            </td>
            <td v-else>
              <el-input
                v-if="evaluateDateKid.schoolReplyDel"
                type="textarea"
                :rows="3"
                disabled
                v-model="evaluateDateKid.schoolReplyContent"
              ></el-input>
              <el-input
                v-else
                :disabled="getAppTypeUserLogin != 'plus'"
                type="textarea"
                :rows="3"
                v-model="evaluateDateKid.schoolReplyContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </td>
            <td
              class="column-action"
              v-if="
                evaluateDateKid.parentReplyDel ||
                !!!evaluateDateKid.parentReplyContent ||
                !!!evaluateDateKid.schoolReplyContent
              "
            ></td>
            <td v-else class="column-action">
              <span v-if="getAppTypeUserLogin == 'plus'">
                <el-button
                  class="width-button"
                  type="success"
                  size="mini"
                  v-if="evaluateDateKid.schoolReplyDel"
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
      <!-- button bottom -->
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton()">
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="handleEvaluateSave()"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </span>
    </el-dialog>
    <EvaluateSampleDate
      :dialogVisible="showDialogSampleDate"
      @dialog-close="closeDialogSampleDate"
      ref="EvaluateSampleDate"
    />
  </div>
</template>

<script>
import EvaluateSampleDate from "./EvaluateSampleDate.vue";
import EvaluateService from "@/services/EvaluateService";
export default {
  components: {
    EvaluateSampleDate,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      evaluateDateKid: {},
      fullNameDialog: "",
      showDialogSampleDate: false,
      loadingButton: false,
      fileInputList: [],
      fileDeleteList: [],
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      if (
        row.absentStatus == "Nghỉ có phép" ||
        row.absentStatus == "Nghỉ không phép"
      ) {
        return "color: red";
      } else if (row.absentStatus == "Chưa điểm danh") {
        return "color: #409EFF";
      }
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      this.resetData();
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      this.resetData();
    },
    resetData() {
      this.fileInputList = [];
      this.fileDeleteList = [];
      this.evaluateDateKid.evaluateAttachFileList = [];
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
    /**
     * cảnh báo khi chọn quá 3 file
     */
    handleExceedEvaluateDate() {
      this.$message.warning(`Giới hạn là 3 file`);
    },
    /**
     * xác nhận nhà trường đọc
     */
    handleConfirmSchoolRead() {
      this.evaluateDateKid.schoolReadReply = true;
    },
    /**
     * thu hồi phản hồi của giáo viên
     */
    handleTeacherRevoke() {
      this.evaluateDateKid.teacherReplyDel = true;
    },
    /**
     * hủy thu hồi phản hồi của giáo viên
     */
    handleTeacherUnRevoke() {
      this.evaluateDateKid.teacherReplyDel = false;
    },
    /**
     * thu hồi phản hồi của nhà trường
     */
    handleSchoolRevoke() {
      this.evaluateDateKid.schoolReplyDel = true;
    },
    /**
     * hủy thu hồi phản hồi của nhà trường
     */
    handleSchoolUnRevoke() {
      this.evaluateDateKid.schoolReplyDel = false;
    },
    closeDialogSampleDate(data) {
      this.showDialogSampleDate = false;
      if (data != false) {
        let evaluateData = this.evaluateDateKid;
        let learnList = data.learnList;
        let eatList = data.eatList;
        let sleepList = data.sleepList;
        let sanitaryList = data.sanitaryList;
        let healtList = data.healtList;
        let commonList = data.commonList;

        if (learnList.length != 0) {
          evaluateData.learnContent = learnList.join("\n");
        }
        if (eatList.length != 0) {
          evaluateData.eatContent = eatList.join("\n");
        }
        if (sleepList.length != 0) {
          evaluateData.sleepContent = sleepList.join("\n");
        }
        if (sanitaryList.length != 0) {
          evaluateData.sanitaryContent = sanitaryList.join("\n");
        }
        if (healtList.length != 0) {
          evaluateData.healtContent = healtList.join("\n");
        }
        if (commonList.length != 0) {
          evaluateData.commonContent = commonList.join("\n");
        }
      }
    },
    handleClearContentRow(index, row) {
      row.content = null;
    },
    handleClearContentRowUser(index, row) {
      row.content = null;
      row.replyDel = false;
    },
    confirmRowRead(index, row) {
      row.schoolUnread = true;
    },
    handleRevokeRow(index, row) {
      row.replyDel = true;
    },
    handleUnRevokeRow(index, row) {
      row.replyDel = false;
    },
    /**
     * lấy nội dung từ mẫu đánh giá chung
     */
    handleEvaluateSampleDate(data) {
      this.$refs.EvaluateSampleDate.getEvaluateSampleDateInitial(data);
      setTimeout(() => {
        this.showDialogSampleDate = true;
      }, 100);
    },

    /**
     * lưu nhận xét
     */
    handleEvaluateSave() {
      this.loadingButton = true;
      let inputData = this.evaluateDateKid;
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
      EvaluateService.saveOnekidDate(formDatas)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
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
          }, 500);
        });
    },
    downloadFile(file) {
      let id = file.id;
      let fileName = file.name;
      EvaluateService.downloadFileDate(id)
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
    getEvaluateSampleKidInitial(id, fullName) {
      this.fullNameDialog = fullName;
      EvaluateService.getKidDate(id)
        .then((resp) => {
          this.evaluateDateKid = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.evaluateDateKid = null;
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
.column-reply {
  color: #4177e2;
}
.width-button {
  width: 110px;
}
</style>