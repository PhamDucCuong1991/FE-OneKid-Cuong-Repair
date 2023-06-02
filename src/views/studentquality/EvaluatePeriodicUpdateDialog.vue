<template>
  <div>
    <el-dialog
      :title="'Nhận xét định kỳ: ' + fullNameKid"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="4vh"
    >
      <div class="main-content">
        <div class="over-table">
          <div style="margin-bottom: 5px">
            Người nhận xét: {{ evaluatePeriodicKid.lastModifieBy }},
            {{ evaluatePeriodicKid.lastModifieDate | formatDateTime }}
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
                    type="textarea"
                    :rows="6"
                    v-model="evaluatePeriodicKid.content"
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
                    :file-list="evaluatePeriodicKid.evaluatePeriodicFileList"
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
                <td class="column-index">3</td>
                <td class="column-item">
                  <div>Phụ huynh phản hồi123</div>
                  <div>{{ evaluatePeriodicKid.parentReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluatePeriodicKid.parentReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="evaluatePeriodicKid.parentReplyDel"
                  style="color: red"
                >
                  Nội dung đã được thu hồi
                </td>
                <td v-else>
                  <span>{{ evaluatePeriodicKid.parentReplyContent }}</span>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluatePeriodicKid.parentReplyDel ||
                    !!!evaluatePeriodicKid.parentReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <el-button
                    class="width-button"
                    type="success"
                    size="mini"
                    disabled
                    v-if="evaluatePeriodicKid.schoolReadReply"
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
                  <div>{{ evaluatePeriodicKid.teacherReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluatePeriodicKid.teacherReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="
                    evaluatePeriodicKid.parentReplyDel ||
                    !!!evaluatePeriodicKid.parentReplyContent
                  "
                >
                  <el-input type="textarea" :rows="3" disabled></el-input>
                </td>
                <td v-else>
                  <el-input
                    v-if="evaluatePeriodicKid.teacherReplyDel"
                    type="textarea"
                    :rows="3"
                    disabled
                    v-model="evaluatePeriodicKid.teacherReplyContent"
                  ></el-input>
                  <el-input
                    v-else
                    type="textarea"
                    :rows="3"
                    :disabled="getAppTypeUserLogin == 'plus'"
                    v-model="evaluatePeriodicKid.teacherReplyContent"
                    placeholder="Nhập nội dung"
                  ></el-input>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluatePeriodicKid.parentReplyDel ||
                    !!!evaluatePeriodicKid.parentReplyContent ||
                    !!!evaluatePeriodicKid.teacherReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <el-button
                    class="width-button"
                    type="success"
                    size="mini"
                    v-if="evaluatePeriodicKid.teacherReplyDel"
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
                  <div>{{ evaluatePeriodicKid.schoolReplyCreatedBy }}</div>
                  <div class="color-text-reply">
                    {{
                      evaluatePeriodicKid.schoolReplyDatetime | formatDateTime
                    }}
                  </div>
                </td>
                <td
                  v-if="
                    evaluatePeriodicKid.parentReplyDel ||
                    !!!evaluatePeriodicKid.parentReplyContent
                  "
                >
                  <el-input type="textarea" :rows="3" disabled></el-input>
                </td>
                <td v-else>
                  <el-input
                    v-if="evaluatePeriodicKid.schoolReplyDel"
                    type="textarea"
                    :rows="3"
                    disabled
                    v-model="evaluatePeriodicKid.schoolReplyContent"
                  ></el-input>
                  <el-input
                    v-else
                    type="textarea"
                    :rows="3"
                    :disabled="getAppTypeUserLogin != 'plus'"
                    v-model="evaluatePeriodicKid.schoolReplyContent"
                    placeholder="Nhập nội dung"
                  ></el-input>
                </td>
                <td
                  class="column-action"
                  v-if="
                    evaluatePeriodicKid.parentReplyDel ||
                    !!!evaluatePeriodicKid.parentReplyContent ||
                    !!!evaluatePeriodicKid.schoolReplyContent
                  "
                ></td>
                <td v-else class="column-action">
                  <span v-if="getAppTypeUserLogin == 'plus'">
                    <el-button
                      class="width-button"
                      type="success"
                      size="mini"
                      v-if="evaluatePeriodicKid.schoolReplyDel"
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
            Định kỳ lần thứ
            <el-select
              style="width: 80px"
              v-model="dataTimes"
              @change="searchEvaluatePeriodicAtFE()"
            >
              <el-option
                v-for="item in dataTimesList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton()">
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
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
      evaluatePeriodicKid: {},
      evaluatePeriodicKidList: [],
      dataTimes: "",
      dataTimesList: [],
      fileInputList: [],
      fileDeleteList: [],
      fullNameKid: "",

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
      this.dataTimesList = [];
      this.fileInputList = [];
      this.fileDeleteList = [];
      this.evaluatePeriodicKid.evaluatePeriodicFileList = [];
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
      EvaluateService.downloadFilePeriodic(id)
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
      this.evaluatePeriodicKid.content = null;
    },
    /**
     * xác nhận nhà trường đã đọc phản hồi của phụ huynh
     */
    handleConfirmSchoolRead() {
      this.evaluatePeriodicKid.schoolReadReply = true;
    },
    /**
     * giáo viên thu hồi
     */
    handleTeacherRevoke() {
      this.evaluatePeriodicKid.teacherReplyDel = true;
    },
    /**
     * giáo viên hủy thu hồi
     */
    handleTeacherUnRevoke() {
      this.evaluatePeriodicKid.teacherReplyDel = false;
    },
    /**
     * giáo viên thu hồi
     */
    handleSchoolRevoke() {
      this.evaluatePeriodicKid.schoolReplyDel = true;
    },
    /**
     * giáo viên hủy thu hồi
     */
    handleSchoolUnRevoke() {
      this.evaluatePeriodicKid.schoolReplyDel = false;
    },
    /**
     * tìm kiếm đánh giá tháng của một học sinh
     */
    searchEvaluatePeriodicAtFE() {
      this.evaluatePeriodicKid =
        this.evaluatePeriodicKidList[this.dataTimes - 1];
    },
    /**
     * lưu đánh tháng giá cho một học sinh bao gồm phản hồi
     */
    submitForm() {
      let inputData = this.evaluatePeriodicKid;
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
      EvaluateService.saveEvaluatePeriodicDetail(formDatas)
        .then((resp) => {
          let evalutePeriodicSaved = resp.data.data;
          console.log(evalutePeriodicSaved);
          this.$message({
            message: "Lưu nhận xét định kỳ cho một học sinh thành công",
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu nhận xét định kỳ cho một học sinh thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonSaved = false;
          }, 500);
        });
    },
    getEvaluatePeriodicUpdateInitail(data) {
      let idKid = data.kids.id;
      this.fullNameKid = data.kids.fullName;
      EvaluateService.searchEvaluatePeriodicDetail(idKid)
        .then((resp) => {
          let dataList = (this.evaluatePeriodicKidList = resp.data.data);
          this.dataTimes = dataList.length;
          this.evaluatePeriodicKid = dataList[this.dataTimes - 1];
          let index = dataList.length;
          dataList.forEach(() => {
            this.dataTimesList.push(index);
            index--;
          });
        })
        .catch((err) => {
          console.log(err);
          this.evaluatePeriodicKid = null;
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