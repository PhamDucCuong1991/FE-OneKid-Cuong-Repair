<template>
  <el-dialog
    :title="'Chỉnh sửa vai trò: ' + fullNameData"
    :visible.sync="dialogVisible"
    width="1000px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <el-table
      ref="multipleTable"
      highlight-current-row
      :data="permissionForUserData"
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="roleName" label="Vai trò" width="250"></el-table-column>
      <el-table-column prop="description" label="Mô tả"></el-table-column>
      <el-table-column label="Sủ dụng" width="100" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.used"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('permissionForUserData')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('permissionForUserData')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      idUser: "",
      fullNameData: "",
      permissionForUserData: [],
      loadingButton: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["permissionForUserData"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    submitForm(fromData) {
      let dataList = this.permissionForUserData.filter((x) => x.used);
      let idRoleList = dataList.map((x) => x.id);
      this.loadingButton = true;
      SchoolConfigService.updateRoleForUser(this.idUser, idRoleList)
        .then((response) => {
          let data = response.data.data;
          console.log(data);
          this.$message({
            message: "Thêm quyền thành công",
            type: "success",
          });

          setTimeout(() => {
            this.closeDialogByButton(fromData);
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: "Thêm quyền thất bại",
            type: "error",
          });
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    getPermissionForUserInitial(row, type) {
      this.idUser = row.id;
      this.fullNameData = row.fullName;
      SchoolConfigService.findPermissionForUser(row.id, type)
        .then((resp) => {
          this.permissionForUserData = resp.data.data;
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
</style>
