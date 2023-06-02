<template>
  <el-dialog
    title="Danh sách thiết bị đang đăng nhập"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-table
      ref="multipleTable"
      :empty-text="textTable"
      v-loading="loadingData"
      :element-loading-text="$tableLoadding"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0)"
      :data="dataTransfer"
      highlight-current-row
      :cell-style="tableRowStyle"
      :header-cell-style="$funcCommon.tableHeaderColorFunction"
      @selection-change="handleSelectionChange"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        fixed
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="idDevice" label="idDevice"> </el-table-column>
      <el-table-column prop="type" align="center" label="Loại thiết bị">
      </el-table-column>
      <el-table-column prop="type" align="center" label="Thời gian đăng nhập">
        <template slot-scope="scope">
          <span>{{ scope.row.dateLogin | formatDateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="Tác vụ" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="logoutMethod(scope.row)"
            >Đăng xuất</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import DeviceService from "@/services/DeviceService";
export default {
  props: {
    dialogVisible: null,
    dataTransfer: null,
  },
  data() {
    return {
      newGradeUpdated: null,
      loadingButton: false,
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
    },
    logoutMethod(row) {
      DeviceService.deviceLogoutAdmin(row.id)
        .then((response) => {
          this.$message({
            message: response.data.message,
            type: "success",
          });
          this.dataTransfer = this.dataTransfer.filter((x) => x.id != row.id);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
