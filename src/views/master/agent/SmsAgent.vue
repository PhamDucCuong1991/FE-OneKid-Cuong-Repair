<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Lịch sử cấp SMS"
    >
      <div class="table-content row-data">
        <el-table
          highlight-current-row
          :row-style="tableRowStyle"
          :data="smsAgentList"
          :header-cell-style="tableHeaderColor"
          @selection-change="handleSelectionChange"
          border
          :max-height="500"
        >
          <el-table-column type="index" label="STT" width="50" align="center"></el-table-column>
          <el-table-column prop="smsDate" label="Ngày cấp" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.smsDate|formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="numberSms" label="Số lượng" align="center"></el-table-column>
          <el-table-column prop="createBy" label="Người cấp" align="center"></el-table-column>
          <el-table-column prop="content" label="Nội dung" align="left"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AgentService from "@/services/AgentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      smsAgentList: [],
    };
  },
  methods: {
    getAllAgentSms(idAgent) {
      AgentService.getAgentSmsByIdAgent(idAgent)
        .then((res) => {
          this.smsAgentList = res.data.data;
        })
        .catch(() => {});
    },
    resetFormData() {
      this.$refs["createTabAgent"].resetFields();
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.smsAgentList = "";
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
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
      this.loadingButton = true;
      let newAgent = this.createAgentSmsRequest;
      console.log(newAgent);
      AgentService.addSmsAgent(newAgent)
        .then(() => {
          this.$message({
            message: "Cấp thêm SMS cho đại lý thành công",
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton(fromData);
          }, 500);
        })
        .catch(() => {
          this.$message({
            message: "Cấp thêm SMS cho đại lý thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });

      setTimeout(() => {
        this.loadingButton = false;
      }, 500);
    },
    getAgentSelected(data) {
      this.createAgentSmsRequest.idAgentList = data;
    },
  },
};
</script>
<style>
.hideUpload > div {
  visibility: hidden;
}
</style>
<style lang="scss" scoped>
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
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #67c23a;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
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