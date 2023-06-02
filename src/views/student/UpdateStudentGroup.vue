<template>
  <el-dialog
    title="Cập nhật nhóm học sinh"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="editKidsGroup"
      label-position="left"
      :rules="rules"
      ref="editKidsGroup"
    >
      <el-form-item label="Tên nhóm" prop="groupName">
        <el-input
          v-model="editKidsGroup.groupName"
          @keyup.enter.native="submitForm('editKidsGroup')"
          placeholder="Nhập tên nhóm"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="description">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="editKidsGroup.description"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('editKidsGroup')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('editKidsGroup')"
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
    editKidsGroup: null,
  },
  data() {
    return {
      newKidsGroupUpdated: null,
      loadingButton: false,
      rules: {
        groupName: [
          {
            required: true,
            message: "Tên nhóm không được để trống",
            trigger: "blur",
          },
          {
            required: true,
            message: "Tên nhóm không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$refs["editKidsGroup"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          KidsGroupService.update(this.editKidsGroup.id, this.editKidsGroup)
            .then((response) => {
              this.newkidsGroupUpdated = response.data.data;
              this.$message({
                message: "Cập nhật nhóm thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
                // location.reload();
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
