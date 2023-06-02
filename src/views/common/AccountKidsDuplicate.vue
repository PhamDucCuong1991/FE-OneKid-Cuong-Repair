<template>
  <el-dialog
    :title="'Danh sách học sinh trùng số điện thoại: ' + phoneDupliate"
    :visible.sync="dialogVisible"
    width="1220px"
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
        prop="representation"
        label="Người đại diện"
        align="center"
        min-width="120"
      ></el-table-column>
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
        prop="kidStatus"
        label="Trạng thái"
        align="center"
      ></el-table-column>
      <el-table-column label="Ngày sinh" width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthDay | formatDate }}</span>
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
      <el-table-column width="130" label="Chọn" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.status"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button
        :loading="loadingButton"
        type="danger"
        size="medium"
        @click="closeDialogByButton('')"
      >
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
      userData: {
        id: "",
        appType: "",
        oldPhone: "",
        newPhone: "",
      },
      loadingButton: false,
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
    submitForm() {
      let accountEmployee = this.responseList.filter((x) => x.status);
      if (accountEmployee.length == 0) {
        this.$message({
          message: "Chưa có tài khoản nào được chọn",
          type: "error",
        });
        return;
      }
      this.closeDialogByButton(this.responseList);
    },
    getKidsDuplicateInitial(objectData) {
      this.phoneDupliate = objectData.phone;
      MaUserService.findAccountKidsDublicate(objectData.phone)
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
