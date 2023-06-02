<template>
  <el-dialog
    title="Thêm Camera vào lớp"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <el-table
      ref="multipleTable"
      highlight-current-row
      :data="cameraForClassData"
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column type="index" label="STT" width="50" align="center"></el-table-column>
      <el-table-column prop="camName" label="Tên camera" width="200"></el-table-column>
      <el-table-column prop="dvrCamera.dvrName" label="DVR Name" width="200"></el-table-column>
      <el-table-column prop="linkCam" label="Link camera"></el-table-column>
      <el-table-column label="Sủ dụng" width="100" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.used"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('cameraForClassData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('cameraForClassData')"
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
      idclass: "",
      cameraForClassData: [],
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
        this.$refs["cameraForClassData"].resetFields();
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
      let dataList = this.cameraForClassData.filter((x) => x.used);
      this.loadingButton = true;
      SchoolConfigService.updateCameraForClass(this.idClass, dataList)
        .then((response) => {
          let data = response.data.data;
          console.log(data);
          this.$message({
            message: "Thêm camera cho lớp thành công",
            type: "success",
          });

          setTimeout(() => {
            this.closeDialogByButton(fromData);
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: "Thêm camera cho lớp thất bại",
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
    getCameraForClassInitial(id) {
      this.idClass = id;
      SchoolConfigService.findAllCameraForClass(id)
        .then((resp) => {
          this.cameraForClassData = resp.data.data;
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