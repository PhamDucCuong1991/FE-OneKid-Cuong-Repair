<template>
  <el-dialog
    title="Danh sách học sinh được gửi"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div style="margin: 20px 0">
      <el-form
        :model="dataList"
        :rules="rules"
        label-width="130px"
        label-position="left"
        ref="dataList"
      >
        <el-form-item label="Tiêu đề" prop="title">
          <el-input v-model="dataList.title" placeholder="Nhập tiêu đề"></el-input>
        </el-form-item>
      </el-form>
      <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
    </div>

    <div class="table-content row-data">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        style="font-size: 12px"
      >
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
          style="font-size: 10px"
        />
      </el-table>
    </div>
    <span slot="footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        :disabled="tableData.length == 0"
        type="success"
        size="medium"
        :loading="loadingExcelButton"
        mini
        @click="handleSendSms()"
      >
        <i class="el-icon-circle-check" />
        <span v-if="this.sendType == 'smsType'">Gửi qua SMS</span>
        <span v-else-if="this.sendType == 'firebaseType'">Gửi qua App</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SmsSendService from "@/services/SmsSendService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataList: {
        title: "",
        bodyList: [],
      },
      sendType: "",
      rules: {
        title: [
          {
            required: true,
            message: "Tên tiêu đề không được để trống",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      tableHeader: [],
      loadingExcelButton: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    formatWidth(row, column, cellValue, index) {
      console.log(index);
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataList"].resetFields();
        this.tableData = [];
        this.tableHeader = [];
      }, 300);
    },
    validateDialog(mess) {
      this.$confirm(mess, "THÔNG BÁO", {
        type: "warning",
        dangerouslyUseHTMLString: true,
        showCancelButton: false,
      });
    },
    //check size file
    beforeUpload(file) {
      return this.$funcCommon.checkUploadExcelZize(file);
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      this.dataList.bodyList = [];
      // debugger;
      results.forEach((item) => {
        let i = 0;
        this.dataList.bodyList.push(
          this.loda.mapKeys(item, () => {
            i++;
            return "pro" + i;
          })
        );
      });
    },
    handleSendSms() {
      if (this.dataList.title == "") {
        this.$message({
          message: "Tiêu đề không được để trống",
          type: "error",
        });
        throw null;
      }
      let check = true;
      let mess = "";
      this.dataList.bodyList.forEach((i) => {
        if (i.pro5.length == 0) {
          mess += `Nội dung có STT:${i.pro1} không được để trống.<br/>`;
          check = false;
        }
      });
      this.$refs["dataList"].validate((valid) => {
        if (valid && check) {
          this.loadingExcelButton = true;
          SmsSendService.getSmsFirebaseSendCustom(this.sendType, this.dataList)
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
                this.loadingExcelButton = false;
              }, 500);
            });
        } else {
          this.validateDialog(mess);
        }
      });
    },
    getDataInitialSend(sendType) {
      this.sendType = sendType;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>
