<template>
  <div>
    <el-dialog
      title="Nhận xét ngày cho nhiều học sinh"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
    >
      <!-- table content -->
      <table border class="table-data">
        <thead class="table-header">
          <tr>
            <td class="column-index">STT</td>
            <td class="column-item">Mục nhận xét</td>
            <td>Nội dung</td>
            <td class="column-action">Tác vụ</td>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr>
            <td class="column-index">1</td>
            <td class="column-item">Học tập</td>
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
                @click="handleShowSampleDateRow('Học tập')"
              >Mẫu</el-button>
            </td>
          </tr>
          <tr>
            <td class="column-index">2</td>
            <td class="column-item">Ăn uống</td>
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
                @click="handleShowSampleDateRow('Ăn uống')"
              >Mẫu</el-button>
            </td>
          </tr>
          <tr>
            <td class="column-index">3</td>
            <td class="column-item">Ngủ nghỉ</td>
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
                @click="handleShowSampleDateRow('Ngủ nghỉ')"
              >Mẫu</el-button>
            </td>
          </tr>
          <tr>
            <td class="column-index">4</td>
            <td class="column-item">Sức khỏe</td>
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
                @click="handleShowSampleDateRow('Sức khỏe')"
              >Mẫu</el-button>
            </td>
          </tr>
          <tr>
            <td class="column-index">5</td>
            <td class="column-item">Vệ sinh</td>
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
                @click="handleShowSampleDateRow('Vệ sinh')"
              >Mẫu</el-button>
            </td>
          </tr>
          <tr>
            <td class="column-index">6</td>
            <td class="column-item">Nhận xét chung</td>
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
                @click="handleShowSampleDateRow('Nhận xét chung')"
              >Mẫu</el-button>
            </td>
          </tr>
          <tr>
            <td class="column-index">7</td>
            <td class="column-item">File đính kèm</td>
            <td>
              <el-upload
                class="upload-demo"
                action
                :on-change="handleChange"
                :file-list="fileInputList"
                :on-exceed="handleExceedEvaluateDate"
                :on-remove="handleRemove"
                :auto-upload="false"
                limit="3"
                multiple
              >
                <el-button size="small" type="text" style="text-decoration:underline">Thêm file</el-button>
              </el-upload>
            </td>
            <td class="column-action"></td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton('evaluateDateKid')">
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButtonSaveDetailDate"
          mini
          @click="submitForm()"
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
      evaluateDateKid: {
        learnContent: "",
        eatContent: "",
        sleepContent: "",
        sanitaryContent: "",
        healtContent: "",
        commonContent: "",
      },
      fileInputList: [],
      evaluateDateListData: [],
      showDialogSampleDate: false,
      newGradeCreated: null,
      loadingButtonSaveDetailDate: false,
    };
  },
  methods: {
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
      this.evaluateDateKid.evaluateAttachFileList = [];
      this.evaluateDateKid.learnContent = "";
      this.evaluateDateKid.eatContent = "";
      this.evaluateDateKid.sleepContent = "";
      this.evaluateDateKid.sanitaryContent = "";
      this.evaluateDateKid.healtContent = "";
      this.evaluateDateKid.commonContent = "";
      this.idKidList = [];
    },
    handleChange(file, fileList) {
      this.fileInputList = fileList;
    },
    handleRemove(file) {
      this.fileInputList.splice(this.fileInputList.indexOf(file), 1);
    },
    /**
     * cảnh báo khi chọn quá 3 file
     */
    handleExceedEvaluateDate() {
      this.$message.warning(`Giới hạn là 3 file`);
    },
    handleShowSampleDateRow(type) {
      this.$refs.EvaluateSampleDate.getEvaluateSampleDateInitial(type);
      setTimeout(() => {
        this.showDialogSampleDate = true;
      }, 100);
    },
    closeDialogSampleDate(data) {
      this.showDialogSampleDate = false;
      if (data != false) {
        let learnList = data.learnList;
        let eatList = data.eatList;
        let sleepList = data.sleepList;
        let sanitaryList = data.sanitaryList;
        let healtList = data.healtList;
        let commonList = data.commonList;

        if (learnList.length != 0) {
          this.evaluateDateKid.learnContent = learnList.join("\n");
        }
        if (eatList.length != 0) {
          this.evaluateDateKid.eatContent = eatList.join("\n");
        }
        if (sleepList.length != 0) {
          this.evaluateDateKid.sleepContent = sleepList.join("\n");
        }
        if (sanitaryList.length != 0) {
          this.evaluateDateKid.sanitaryContent = sanitaryList.join("\n");
        }
        if (healtList.length != 0) {
          this.evaluateDateKid.healtContent = healtList.join("\n");
        }
        if (commonList.length != 0) {
          this.evaluateDateKid.commonContent = commonList.join("\n");
        }
      }
    },
    /**
     * lưu đánh giá cho nhiều học sinh theo mẫu
     */
    submitForm() {
      let kidList = this.evaluateDateListData;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu nhận xét cho " +
          kidList.length +
          " học sinh?",
        "Lưu nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        let inputData = this.evaluateDateKid;
        let formDatas = new FormData();
        for (var key in inputData) {
          formDatas.append(key, inputData[key]);
        }
        if (this.fileInputList.length > 0) {
          this.fileInputList.forEach((x) => {
            formDatas.append("multipartFileList", x.raw);
          });
        }
        if (kidList.length > 0) {
          kidList.forEach((x) => {
            formDatas.append("idKidList", x.id);
          });
        }
        this.loadingButtonSaveDetailDate = true;
        EvaluateService.saveManykidDetailDateCommon(formDatas)
          .then((resp) => {
            let dataSaved = resp.data.data;
            console.log(dataSaved);
            this.$message({
              message: "Lưu nhận xét nhiều học sinh thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Lưu nhận xét nhiều học sinh thất bại",
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButtonSaveDetailDate = false;
            }, 500);
          });
      });
    },
    getEvaluateSampleDateKidsInitial(data) {
      this.evaluateDateListData = data;
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
.main-content {
  border: 1px solid #dcdfe6;
  padding: 20px;
  max-height: 450px;
  overflow-y: scroll;
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