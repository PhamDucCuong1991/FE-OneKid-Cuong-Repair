<template>
  <el-dialog
    title="Cập nhật thư mục"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="updateGroup"
      label-position="left"
      :rules="rules"
      ref="updateGroup"
    >
      <el-form-item label="Tên thư mục" prop="name">
        <el-input
          :disabled="updateGroup.defaultStatus"
          v-model="updateGroup.name"
          @keyup.enter.native="submitForm('updateGroup')"
          placeholder="Nhập tên khối"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="note">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="updateGroup.note"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('updateGroup')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        v-if="typeView == 'student'"
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('updateGroup')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
      <el-button
        v-if="typeView == 'employee'"
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitFormEmployee('updateGroup')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import GroupOutService from "@/services/GroupOutService";
export default {
  props: {
    dialogVisible: null,
    updateGroup: null,
    typeView: null,
  },
  data() {
    return {
      loadingButton: false,
      newGroupUpdated: null,
      rules: {
        name: [
          {
            required: true,
            message: "Tên thư mục không được để trống",
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
        this.$refs["updateGroup"].resetFields();
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
          GroupOutService.update(this.updateGroup.id, this.updateGroup)
            .then((response) => {
              this.newGroupUpdated = response.data.data;
              this.$message({
                message: "Cập nhật thư mục thành công",
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
    submitFormEmployee(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          GroupOutService.updateEmployee(this.updateGroup.id, this.updateGroup)
            .then((response) => {
              this.newGroupUpdated = response.data.data;
              this.$message({
                message: "Cập nhật thư mục thành công",
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
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input.is-disabled .el-input__inner {
  // text-align: center;
  // color: #d13b93;
  // font-weight: bold;
  padding-left: 5px;
  color: #606266;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
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
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>
