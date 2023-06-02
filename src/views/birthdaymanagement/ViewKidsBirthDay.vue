<template>
  <el-dialog
    title="Lời chúc mừng sinh nhật"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
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
        <el-table-column type="index" label="STT" width="50" align="center"></el-table-column>
        <el-table-column prop="createdBy" label="Người gửi" align="left"></el-table-column>
        <el-table-column prop="sendContent" label="Nội dung" align="center "></el-table-column>
        <el-table-column prop="attachFile" label="Thiệp đính kèm " align="center "></el-table-column>
        <el-table-column label="Tác vụ" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleconfirm(scope.row)">Duyệt</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleRemove(scope.row)"
            >Thu hồi</el-button>
            <el-button size="mini" type="warning" @click="handleRemove1(scope.row)">Hủy thu hồi</el-button>
            <el-button
              size="mini"
              @click="handleDeleteAppsend(scope.$index, scope.row)"
              type="danger"
            >Xóa</el-button>
          </template>
          <el-button
            size="mini"
            type="warning"
            v-if="!historyappsend.sendDel"
            @click="handleRemove()"
          >Thu hồi</el-button>
          <el-button size="mini" type="warning" v-else @click="handleRemove1()">Đã thu hồi</el-button>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import KidsBirhtdayService from "@/services/KidsBirhtdayService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textarea: "",
      birthdaylist: [],
      historyappsend: "",
      test: "",
      item: "aa,aa,s",
      schoolConfirmStatus: "",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    closeDialog() {
      this.$emit("dialog-close");
      // setTimeout(() => {
      //   this.closeDialog();
      //   location.reload();
      // }, 500);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },

    // click duyệt
    handleconfirm(row) {
      let data = row;
      KidsBirhtdayService.update(data.id, data, (data.approved = true))
        .then((response) => {
          this.newAppsendUpdate = response.data.data;
          this.$message({
            message: "Duyệt  thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Duyệt thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    // click xoa
    handleDeleteAppsend(index, row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa lời chúc đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        KidsBirhtdayService.delete(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa lời chúc thành công",
              type: "success",
            });
            // setTimeout(() => {
            //   location.reload();
            // }, 100);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa lời chúc thất bại",
              type: "error",
            });
          });
      });
    },
    // click thu hồi
    handleRemove(row) {
      let data = row;
      KidsBirhtdayService.update(data.id, data, (data.sendDel = true))
        .then((response) => {
          this.newAppsendUpdate = response.data.data;
          this.$message({
            message: "Thu hồi thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Thu hồi thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    // click hủy thu hồi
    handleRemove1(row) {
      this.sendDel = false;
      let data = row;
      KidsBirhtdayService.update(data.id, data, (data.sendDel = false))
        .then((response) => {
          this.newAppsendUpdate = response.data.data;
          this.$message({
            message: "Hủy thu hồi thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Hủy thu hồi thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },

    getDetailMethod(id) {
      KidsBirhtdayService.getById(id)
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
  margin-top: 0px;
}
/deep/.th[data-v-fe3ffff4] {
  margin-top: -86px;
  margin-left: 160px;
  text-decoration: underline;
}
/deep/.th[data-v-e200f440] {
  margin-top: -86px;
  margin-left: 160px;
  text-decoration: underline;
}
/deep/.el-button--text {
  color: #f70101;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
}
.xn {
  height: 20px;
  font-size: 14px;
  margin-top: 10px;
  margin-left: 7px;
}
.th {
  margin-top: 20px;
  text-decoration: underline;
}
/deep/.el-button [class*="el-icon-"] + span {
  margin-left: 5px;
  text-decoration: underline;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/deep/[data-v-fe3ffff4] .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: 17px;
  font-family: arial;
  // color: #000000;
  background-color: #f0f0f0;
  background-image: none;
  // border: 1px solid gray;
  // border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
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