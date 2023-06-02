<template>
  <div>
    <el-dialog
      :title="'Nhận xét tuần: ' + fullNameData"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="4vh"
    >
      <div class="main-content">
        <div class="over-table">
          <div style="margin-bottom: 5px">
            Người nhận xét: {{ evaluateWeekDataKid.lastModifieBy }},
            {{ evaluateWeekDataKid.lastModifieDate | formatDateTime }}
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
                    :disabled="evaluateWeekDataKid.id == null ? true : false"
                    type="textarea"
                    :rows="6"
                    v-model="evaluateWeekDataKid.content"
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
                    :file-list="evaluateWeekDataKid.evaluateWeekFileList"
                    :on-exceed="handleExceedEvaluateDate"
                    :on-remove="handleRemove"
                    :on-preview="downloadFile"
                    :auto-upload="false"
                    limit="3"
                    multiple
                  >
                    <el-button
                      :disabled="evaluateWeekDataKid.id == null ? true : false"
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
                  <div>{{ evaluateWeekDataKid.parentReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluateWeekDataKid.parentReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="evaluateWeekDataKid.parentReplyDel"
                  style="color: red"
                >
                  Nội dung đã được thu hồi
                </td>
                <td v-else>
                  <span>{{ evaluateWeekDataKid.parentReplyContent }}</span>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluateWeekDataKid.parentReplyDel ||
                    !!!evaluateWeekDataKid.parentReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <el-button
                    class="width-button"
                    type="success"
                    size="mini"
                    disabled
                    v-if="evaluateWeekDataKid.schoolReadReply"
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
                  <div>{{ evaluateWeekDataKid.teacherReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluateWeekDataKid.teacherReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="
                    evaluateWeekDataKid.parentReplyDel ||
                    !!!evaluateWeekDataKid.parentReplyContent
                  "
                >
                  <el-input type="textarea" :rows="3" disabled></el-input>
                </td>
                <td v-else>
                  <el-input
                    v-if="evaluateWeekDataKid.teacherReplyDel"
                    type="textarea"
                    :rows="3"
                    disabled
                    v-model="evaluateWeekDataKid.teacherReplyContent"
                  ></el-input>
                  <el-input
                    v-else
                    type="textarea"
                    :rows="3"
                    :disabled="getAppTypeUserLogin != 'teacher'"
                    v-model="evaluateWeekDataKid.teacherReplyContent"
                    placeholder="Nhập nội dung"
                  ></el-input>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluateWeekDataKid.parentReplyDel ||
                    !!!evaluateWeekDataKid.parentReplyContent ||
                    !!!evaluateWeekDataKid.teacherReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <el-button
                    class="width-button"
                    type="success"
                    size="mini"
                    v-if="evaluateWeekDataKid.teacherReplyDel"
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
                  <div>{{ evaluateWeekDataKid.schoolReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluateWeekDataKid.schoolReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="
                    evaluateWeekDataKid.parentReplyDel ||
                    !!!evaluateWeekDataKid.parentReplyContent
                  "
                >
                  <el-input type="textarea" :rows="3" disabled></el-input>
                </td>
                <td v-else>
                  <el-input
                    v-if="evaluateWeekDataKid.schoolReplyDel"
                    type="textarea"
                    :rows="3"
                    disabled
                    v-model="evaluateWeekDataKid.schoolReplyContent"
                  ></el-input>
                  <el-input
                    v-else
                    type="textarea"
                    :disabled="getAppTypeUserLogin != 'plus'"
                    :rows="3"
                    v-model="evaluateWeekDataKid.schoolReplyContent"
                    placeholder="Nhập nội dung"
                  ></el-input>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluateWeekDataKid.parentReplyDel ||
                    !!!evaluateWeekDataKid.parentReplyContent ||
                    !!!evaluateWeekDataKid.schoolReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <span v-if="getAppTypeUserLogin == 'plus'">
                    <el-button
                      class="width-button"
                      type="success"
                      size="mini"
                      v-if="evaluateWeekDataKid.schoolReplyDel"
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
            Tuần nhận xét
            <el-date-picker
              size="medium"
              class="input-common input-date"
              style="width: 125px"
              :clearable="false"
              v-model="dataSearchWeek.date"
              type="week"
              format="Tuần WW"
              value-format="yyyy-MM-dd"
              placeholder="Chọn tuần"
              :picker-options="startDayOfWeek"
              @change="getSearchEvaluateWeekByIdKid()"
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
          :disabled="evaluateWeekDataKid.id == null ? true : false"
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
      evaluateWeekDataKid: {},
      idEdit: "",
      fileInputList: [],
      fileDeleteList: [],
      fullNameData: "",
      dataSearchWeek: {
        date: "",
        idKid: "",
      },
      startDayOfWeek: {
        firstDayOfWeek: 1,
      },
      evaluateDate: {
        contentInput: "Nội dung",
        learn: null,
        eatName: "File đính kèm",
        eat: null,
        sleepName: "Phụ huynh phản hồi",
        sleep: null,
        sanitaryName: "Giáo viên phản hồi",
        sanitary: null,
        healtName: "Nhà trường phản hồi",
        healt: null,
      },
      newGradeCreated: null,
      loadingButtonSaved: false,
      rules: {
        gradeName: [
          {
            required: true,
            message: "Tên khối không được để trống",
            trigger: "blur",
          },
        ],
      },
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
        this.resetFormData();
      }, 100);
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetData();
        this.resetFormData();
      }, 100);
    },
    resetFormData() {
      (this.evaluateDate.learn = null),
        (this.evaluateDate.eat = null),
        (this.evaluateDate.sleep = null),
        (this.evaluateDate.sanitary = null),
        (this.evaluateDate.healt = null),
        (this.evaluateDate.common = null),
        (this.evaluateDate.attachFile = null);
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
    downloadFile(file) {
      let id = file.id;
      let fileName = file.name;
      EvaluateService.downloadFileWeek(id)
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
     * xác nhận nhà trường đã đọc phản hồi của phụ huynh
     */
    handleConfirmSchoolRead() {
      this.evaluateWeekDataKid.schoolReadReply = true;
    },
    /**
     * giáo viên thu hồi
     */
    handleTeacherRevoke() {
      this.evaluateWeekDataKid.teacherReplyDel = true;
    },
    /**
     * giáo viên hủy thu hồi
     */
    handleTeacherUnRevoke() {
      this.evaluateWeekDataKid.teacherReplyDel = false;
    },
    /**
     * giáo viên thu hồi
     */
    handleSchoolRevoke() {
      this.evaluateWeekDataKid.schoolReplyDel = true;
    },
    /**
     * giáo viên hủy thu hồi
     */
    handleSchoolUnRevoke() {
      this.evaluateWeekDataKid.schoolReplyDel = false;
    },
    /**
     * tìm kiếm đánh giá tuần của một học sinh
     */
    getSearchEvaluateWeekByIdKid() {
      EvaluateService.searchEvaluateWeekDateAndKid(
        this.dataSearchWeek.date,
        this.dataSearchWeek.idKid
      )
        .then((resp) => {
          this.evaluateWeekDataKid = resp.data.data;
          if (this.evaluateWeekDataKid.id == null) {
            this.$alert(
              "Không có thông tin nhận xét cho tuần này",
              "Thông báo!",
              {
                confirmButtonText: "Đóng",
              }
            );
            this.evaluateWeekDataKid.evaluateWeekFileList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * lưu đánh giá cho một học sinh bao gồm phản hồi
     */
    submitForm() {
      let inputData = this.evaluateWeekDataKid;
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
      EvaluateService.saveEvaluateWeekDetail(formDatas)
        .then((resp) => {
          let evaluteWeekSaved = resp.data.data;
          console.log(evaluteWeekSaved);
          this.$message({
            message: "Lưu nhận xét tuần cho một học sinh thành công",
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu nhận xét tuần cho một học sinh thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonSaved = false;
          }, 500);
        });
    },
    getEvaluateWeekUpdateInitail(row, week) {
      this.idEdit = row.id;
      this.fullNameData = row.kids.fullName;
      this.dataSearchWeek.date = week;
      this.dataSearchWeek.idKid = row.kids.id;
      this.getEvaluateWeekKid(row.id);
    },
    getEvaluateWeekKid(id) {
      EvaluateService.searchEvaluateWeekById(id)
        .then((resp) => {
          this.evaluateWeekDataKid = resp.data.data;
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