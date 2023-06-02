<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      :title="'Danh sách người nhận '+this.status"
    >
      <el-form
        label-width="140px"
        :model="receiverList"
        label-position="left"
        :rules="rules"
        ref="receiverList"
      >
        <div class="table-content row-data">
          <el-table
            highlight-current-row
            :row-style="tableRowStyle"
            :data="receiverList"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChange"
            border
            :max-height="500"
          >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="STT" width="50" align="center"></el-table-column>
            <el-table-column prop="fullName" label="Họ tên" align="center"></el-table-column>
            <el-table-column prop="phone" label="Số điện thoại" align="center"></el-table-column>
            <el-table-column prop="appType" label="Đối tượng nhận" align="center"></el-table-column>
            <!-- <el-table-column prop="schoolName" label="Trường và Lớp" align="center"></el-table-column> -->
            <el-table-column prop="sendContent" label="Nội dung" align="center"></el-table-column>

            <el-table-column label="Tác vụ" align="center" width="160">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="warning"
                  @click="handleRevoke(scope.$index, scope.row)"
                  v-if="scope.row.sendDel"
                >Thu hồi</el-button>

                <el-button
                  v-else
                  size="mini"
                  type="success"
                  @click="handleRevoke(scope.$index, scope.row)"
                >Hiện lại</el-button>

                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >Xóa</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div class="tab-infor-button">
        <el-button type="danger" size="medium" @click="handleMultiDelete()">
          <i class="el-icon-delete"></i>
          <span>Xóa</span>
        </el-button>
        <el-button
          type="warning"
          size="medium"
          :loading="loadingButton"
          mini
          @click="handleMultiRevoke()"
        >
          <i class="el-icon-circle-check" />
          <span>Thu hồi</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HistorySmsService from "../../../services/HistorySmsService";
// import EmployeeDataService from "@/services/EmployeeDataService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      idAppSend: "",
      indexColumn: "",
      loadingButton: false,
      receiverList: [],
      multipleSelection: [],
      status:"",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["receiverList"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.$refs.upload.clearFiles();
      this.showUpload = true;
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
    getListReceiverSms(id,status){
    this.status=status
     HistorySmsService.getHistorySmsById(id).then(res=>{
       this.receiverList=res.data.data
     })
    }
  },
};
</script>
<style>
.hideUpload > div {
  visibility: hidden;
}
</style>
<style lang="scss" scoped>
// /deep/.el-input__inner,
// /deep/.el-textarea__inner {
//   border: none;
//   border-radius: 0;
//   resize: none;
//   padding-left: 0;
//   padding-right: 0;
//   border-bottom: 1px solid #d9d9d9;
// }

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