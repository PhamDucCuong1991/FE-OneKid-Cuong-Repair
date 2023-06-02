<template>
  <el-dialog
    title="Cấu hình App OneCam"
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="140px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-row :gutter="20">
        <el-col :span="4"><el-form-item label="Phụ huynh"></el-form-item></el-col>
        <el-col :span="10"
          ><el-form-item label="Trạng thái" prop="parentStatus">
            <el-checkbox v-model="dataInput.parentStatus"></el-checkbox> </el-form-item
        ></el-col>
        <el-col :span="10">
          <el-form-item label="Số thiết bị" prop="parentNumber" style="float: right">
            <el-input-number
              v-model="dataInput.parentNumber"
            ></el-input-number> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4"><el-form-item label="Giáo viên"></el-form-item></el-col>
        <el-col :span="10"
          ><el-form-item label="Trạng thái" prop="teacherStatus">
            <el-checkbox v-model="dataInput.teacherStatus"></el-checkbox> </el-form-item
        ></el-col>
        <el-col :span="10">
          <el-form-item label="Số thiết bị" prop="teacherNumber" style="float: right">
            <el-input-number
              v-model="dataInput.teacherNumber"
            ></el-input-number> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4"><el-form-item label="Nhà trường"></el-form-item></el-col>
        <el-col :span="10"
          ><el-form-item label="Trạng thái" prop="plusStatus">
            <el-checkbox v-model="dataInput.plusStatus"></el-checkbox> </el-form-item
        ></el-col>
        <el-col :span="10">
          <el-form-item label="Số thiết bị" prop="plusNumber" style="float: right">
            <el-input-number
              v-model="dataInput.plusNumber"
            ></el-input-number> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <span>Chú ý: Số thiết bị bằng 0 thì không giới hạn số lượng thiết bị sử dụng</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SystemConfigService from "@/services/SystemConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {},
      loadingButton: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    submitForm() {
      this.loadingButton = true;
      SystemConfigService.updateOneCamConfigService(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    getDataInitial(id) {
      SystemConfigService.getOneCamConfigService(id).then((resp) => {
        this.dataInput = resp.data.data;
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
  padding-top: 10px;
  padding-bottom: 10px;
}
.table-icon-1 {
  margin-left: 50px;
  margin-right: 40px;
}
.table-icon-2 {
  margin-right: 50px;
  margin-left: 40px;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
}
td {
  padding: 10px;
}
.table-index {
  width: 30px;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
</style>
