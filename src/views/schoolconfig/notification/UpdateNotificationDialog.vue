<template>
  <el-dialog
    title="Cập nhật gửi tin"
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="updateData"
      label-position="left"
      :rules="rules"
      ref="updateData"
    >
      <el-form-item label="Tiêu đề" prop="title">
        <el-input
          v-model="updateData.title"
          placeholder="Nhập tiêu đề gửi tin"
        ></el-input>
      </el-form-item>
      <el-form-item label="Nội dung" prop="content">
        <el-input
          :rows="2"
          type="textarea"
          autosize
          v-model="updateData.content"
          placeholder="Nhập nội dung gửi tin"
        ></el-input>
      </el-form-item>
      <el-form-item label="Trạng thái">
        <el-switch v-model="updateData.status"></el-switch>
      </el-form-item>
      <el-form-item
        label="Tháng"
        prop="month"
        v-if="
          updateData.typeReceive == 'plus' &&
          (updateData.type == 'fees' || updateData.type == 'salary')
        "
      >
        <el-radio-group v-model="updateData.month">
          <el-radio :label="-1">Tháng trước</el-radio>
          <el-radio :label="0">Tháng hiện tại</el-radio>
          <el-radio :label="1">Tháng sau</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input
          :rows="2"
          v-model="updateData.note"
          placeholder="Nhập nội dung ghi chú"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('updateData')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('updateData')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import NotificationManageService from "@/services/NotificationManageService";
export default {
  props: {
    updateData: null,
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      rules: {
        content: [
          {
            required: true,
            message: "Nội dung không được để trống",
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
        this.$refs["updateData"].resetFields();
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
          NotificationManageService.updateNotification(this.updateData)
            .then((resp) => {
              // this.newGroupUpdated = response.data.data;
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
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 94%;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
