<template>
  <el-dialog
    title="Thêm Media Link vào lớp"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <el-table
      ref="multipleTable"
      highlight-current-row
      :data="mediaForClassData"
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      @selection-change="handleSelectionChangeMedia"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column type="index" label="STT" width="50" align="center"></el-table-column>
      <el-table-column prop="mediaName" label="Tên media" width="200"></el-table-column>
      <el-table-column prop="scopeType" label="Phạm vi" width="150" align="center"></el-table-column>
      <el-table-column prop="linkMedia" label="Media Link"></el-table-column>
      <el-table-column label="Sủ dụng" width="100" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.used"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('mediaForClassData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('mediaForClassData')"
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
      idClass: "",
      mediaForClassData: [],
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
        this.$refs["mediaForClassData"].resetFields();
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
      let dataList = this.mediaForClassData.filter((x) => x.used);
      this.loadingButton = true;
      SchoolConfigService.updateMediaForClass(this.idClass, dataList)
        .then((response) => {
          let data = response.data.data;
          console.log(data);
          this.$message({
            message: "Thêm Media thành công",
            type: "success",
          });

          setTimeout(() => {
            this.closeDialogByButton(fromData);
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: "Thêm Media thất bại",
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
    getMediaForClassInitial(id) {
      this.idClass = id;
      SchoolConfigService.findAllMediaForClass(id)
        .then((resp) => {
          this.mediaForClassData = resp.data.data;
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
</style>