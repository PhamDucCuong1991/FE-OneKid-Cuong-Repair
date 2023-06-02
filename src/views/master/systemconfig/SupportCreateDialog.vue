<template>
  <el-dialog
    title="Thêm mới link hỗ trợ"
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Tên" prop="name">
        <el-input v-model="dataInput.name" placeholder="Nhập tên"></el-input>
      </el-form-item>
      <el-form-item label="Link" prop="link">
        <el-input v-model="dataInput.link" placeholder="Nhập link"></el-input>
      </el-form-item>
      <el-form-item label="Đối tượng">
        Nhà trường <el-checkbox v-model="dataInput.plusStatus"></el-checkbox> Giáo viên
        <el-checkbox v-model="dataInput.teacherStatus"></el-checkbox> Phụ huynh
        <el-checkbox v-model="dataInput.parentStatus"></el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MenuSupportService from "@/services/MenuSupportService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {
        name: "",
        link: "",
        plusStatus: false,
        teacherStatus: false,
        parentStatus: false,
      },
      loadingButton: false,
      rules: {
        name: [
          {
            required: true,
            message: "Tên không được để trống",
            trigger: "blur",
          },
        ],
        link: [
          {
            required: true,
            message: "Link không được để trống",
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
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          MenuSupportService.createSupport(this.dataInput)
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
</style>
