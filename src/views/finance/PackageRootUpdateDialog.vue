<template>
  <el-dialog
    title="Sửa khoản hệ thống"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="dataTransfer"
      label-position="left"
      :rules="rules"
      ref="dataTransfer"
    >
      <el-form-item label="Tên khoản" prop="name">
        <el-input
          v-model="dataTransfer.name"
          placeholder="Nhập tên khoản"
        ></el-input>
      </el-form-item>
      <el-form-item label="Đơn vị" prop="unit">
        <el-input
          v-model="dataTransfer.unit"
          placeholder="Nhập đơn vị"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="description">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="dataTransfer.description"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('dataTransfer')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('dataTransfer')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      newGradeUpdated: null,
      dataTransfer: {},
      loadingButton: false,
      rules: {
        name: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
        unit: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataTransfer"].resetFields();
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
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          FnFeesService.updatePackageRoot(this.dataTransfer)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
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
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getDataInitial(row) {
      this.dataTransfer = row;
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
</style>
