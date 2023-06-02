<template>
  <el-dialog
    title="Danh sách người nhận"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div class="hr">
      <hr />
    </div>
    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :data="historyappsend"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="Tên người nhận"
          align="left"
        ></el-table-column>
        <el-table-column
          width="150px"
          prop="phone"
          label="Số điện thoại"
          align="left "
        ></el-table-column>

        <el-table-column
          width="150px"
          prop="type"
          label="Đối tượng"
          align="left "
        ></el-table-column>
        <el-table-column prop="student" label="Học sinh" align="left "></el-table-column>
        <el-table-column
          min-width="250"
          prop="sendContent"
          label="Nội dung "
          align="left "
        ></el-table-column>
        <el-table-column
          label="Trạng thái "
          prop="status"
          align="center "
        ></el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import HistorySmsService from "@/services/HistorySmsService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textarea: "",
      historyappsend: [],
      multipleSelectionEmployee: [],
      idList: [],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["newBrand"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["newBrand"].resetFields();
    },
    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelectionEmployee = val;
    },
    //click delete at row
    handleDeleteSmsReiceivers(index, row) {
      this.$confirm("Bạn có chắc chắn muốn hủy gửi tin nhắn đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        HistorySmsService.deleteSmsReiceivers(row.id).then((response) => {
          console.log(response);
          this.$message({
            message: "Hủy gửi tin nhắn thành công",
            type: "success",
          });
          setTimeout(() => {
            this.getDetailMethodabc();
            location.reload();
          }, 500);
        });
      });
    },
    handleMultiDelelte() {
      console.log(this.multipleSelectionEmployee);
      let idList = [];
      this.multipleSelectionEmployee.forEach((x) => idList.push(x.id));

      this.$confirm(
        "Bạn có chắc chắn muốn xóa tất cả người nhận đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        HistorySmsService.deleteMulti(idList)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa người nhận thành công",
              type: "success",
            });
            // setTimeout(() => {
            // this.searchByProperties();
            // }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa người nhận thất bại",
              type: "error",
            });
          });
      });
    },
    getDetailMethodAll(id) {
      HistorySmsService.getByIdSmsCustomAll(id)
        .then((resp) => {
          this.historyappsend = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.btt {
  float: right;
  margin-top: 10px;
}
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  white-space: pre-line;
  line-height: 23px;
  padding-right: 10px;
  max-height: 50px;
  word-break: break-word;
  text-overflow: ellipsis;
}

/deep/.el-button--text {
  color: #f70101;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
}
/deep/.el-button [class*="el-icon-"] + span {
  margin-left: 5px;
  // text-decoration: underline;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.hr {
  margin-top: -50px;
}
/deep/.el-dialog__title {
  line-height: 24px;
  font-size: 25px;
  color: #606266;
}
/deep/.el-dialog__body {
  padding: 30px 20px;
  // color: #000000;
  font-size: 14px;
  word-break: break-all;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  // border: 1px solid #000000;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/ .el-dialog__body {
  padding: 55px 20px;
  // color: #000000;
  font-size: 14px;
  word-break: break-all;
}
</style>
