<template>
  <el-dialog
    title="Cập nhật Môn học"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="editSubject"
      label-position="left"
      :rules="rules"
      ref="editSubject"
    >
      <el-form-item label="Tên môn học" prop="subjectName">
        <el-input v-model="editSubject.subjectName" placeholder="Nhập tên môn học"></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="note">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="editSubject.note"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('editSubject')">
        <i class="el-icon-circle-close" />
        <span>Hủy</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('editSubject')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SubjectDataService from "@/services/SubjectDataService";
export default {
  props: {
    dialogVisible: null,
    editSubject: null,
  },
  data() {
    return {
      newSubjectUpdated: null,
      loadingButton: false,
      rules: {
        subjectName: [
          {
            required: true,
            message: "Tên phòng ban không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$refs["editSubject"].resetFields();
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
          SubjectDataService.update(this.editSubject.id, this.editSubject)
            .then((response) => {
              this.newSubjectUpdated = response.data.data;
              this.$message({
                message: "Cập nhật khối thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
                location.reload();
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Cập nhật khối thất bại",
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