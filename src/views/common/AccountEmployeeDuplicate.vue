<template>
  <el-dialog
    :title="'Danh sách nhân viên trùng số điện thoại: ' + phoneDupliate"
    :visible.sync="dialogVisible"
    width="1100px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="15vh"
  >
    <el-table
      ref="multipleTable"
      :data="responseList"
      highlight-current-row
      :cell-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      @selection-change="handleSelectionChange"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="fullName" label="Họ tên" min-width="170"></el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="Số điện thoại"
        width="110"
      ></el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="Tài khoản"
        width="110"
      ></el-table-column>
      <el-table-column
        width="100"
        prop="employeeStatus"
        label="Trạng thái"
        align="center"
      ></el-table-column>
      <el-table-column label="Ngày sinh" width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Ngày tạo" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | formatDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tài khoản" width="90" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.eixstAccount">Đã có</span>
          <span v-else>Chưa có</span>
        </template>
      </el-table-column>
      <el-table-column width="130" align="center">
        <template slot-scope="scope">
          <el-radio
            @change="selectAccountMethod(scope.row)"
            v-model="checkAccount"
            :label="scope.row.status"
            >Chọn</el-radio
          >
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('')">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button type="success" size="medium" @click="submitForm()">
        <i class="el-icon-circle-check" />
        <span>OK</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MaUserService from "@/services/MaUserService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      responseList: [],
      checkAccount: true,
      phoneDupliate: "",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    tableRowStyle({ row }) {
      if (!row.eixstAccount) {
        return "color: #409EFF";
      }
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close", "");
      this.resetFormData();
    },
    //click when click button
    closeDialogByButton(data) {
      this.$emit("dialog-close", data);
      this.resetFormData();
    },
    resetFormData() {
      setTimeout(() => {
        this.responseList = [];
        this.phoneDupliate = "";
      }, 200);
    },
    selectAccountMethod(row) {
      this.responseList.forEach((x) => {
        x.status = false;
      });
      row.status = true;
      this.checkAccount = true;
    },
    submitForm() {
      let accountEmployee = this.responseList.filter((x) => x.status);
      if (accountEmployee.length == 0) {
        this.$message({
          message: "Chưa có tài khoản nào được chọn",
          type: "error",
        });
        return;
      } else if (accountEmployee.length > 1) {
        this.$message({
          message: "Chỉ được chọn một tài khoản",
          type: "error",
        });
        return;
      }
      this.closeDialogByButton(this.responseList);
    },
    getEmployeeDuplicateInitial(objectData) {
      this.phoneDupliate = objectData.phone;
      MaUserService.findAccountEmployeeDublicate(objectData.appType, objectData.phone)
        .then((resp) => {
          this.responseList = resp.data.data;
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
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
// .grid-content-over{
//     margin-bottom: 10px;
// }
.el-row {
  margin-bottom: 20px;
}
.space-right {
  margin-right: 15px;
}
</style>
