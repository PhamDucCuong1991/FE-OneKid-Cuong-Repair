<template>
  <el-dialog
    title="Thêm mới nhóm học sinh"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      :model="newKidsGroup"
      label-position="left"
      :rules="rules"
      ref="newKidsGroup"
    >
      <el-form-item label="Tên nhóm" prop="groupName">
        <el-input
          v-model="newKidsGroup.groupName"
          @keyup.enter.native="submitForm('newKidsGroup')"
          placeholder="Nhập tên nhóm"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="description">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="newKidsGroup.description"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('newKidsGroup')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('newKidsGroup')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import KidsGroupService from "@/services/KidsGroupService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      newKidsGroup: {
        groupName: "",
        description: "",
      },
      newKidsGroupCreated: null,
      loadingButton: false,
      rules: {
        groupName: [
          {
            required: true,
            message: "Tên nhóm không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$refs["newKidsGroup"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    resetFormData() {
      this.$refs["newKidsGroup"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          KidsGroupService.create(this.newKidsGroup)
            .then((response) => {
              this.newKidsGroupCreated = response.data.data;
              this.$message({
                message: "Thêm mới nhóm thành công",
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
              console.log(err);
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
</style>
