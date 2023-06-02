<template>
  <el-dialog
    title="Cập nhật mẫu nhận xét"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="udpateEvaluateSample"
      label-position="left"
      :rules="rules"
      ref="udpateEvaluateSample"
    >
      <el-form-item label="Loại nhận xét" prop="evaluateType">
        <el-select
          style="width:100%"
          v-model="udpateEvaluateSample.evaluateType"
          placeholder="Chọn loại nhận xét"
          disabled
        >
          <el-option
            v-for="item in evaluateTypeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Nội dung" prop="evaluateContent">
        <el-input
          :rows="15"
          type="textarea"
          v-model="udpateEvaluateSample.evaluateContent"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('udpateEvaluateSample')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('udpateEvaluateSample')"
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
      udpateEvaluateSample: {},
      loadingButton: false,
      evaluateTypeList: [
        { key: "learn", value: "Học tập" },
        { key: "eat", value: "Ăn uống" },
        { key: "sleep", value: "Ngủ nghỉ" },
        { key: "sanitary", value: "Vệ sinh" },
        { key: "healt", value: "Sức khỏe" },
        { key: "common", value: "Nhận xét chung" },
      ],
      rules: {
        evaluateType: [
          {
            required: true,
            message: "Loại nhận xét không được để trống",
            trigger: "change",
          },
        ],
        evaluateContent: [
          {
            required: true,
            message: "Nội dung xét không được để trống",
            trigger: "change",
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
        this.$refs["udpateEvaluateSample"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["udpateEvaluateSample"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SystemConfigService.updateEvaluateSample(this.udpateEvaluateSample)
            .then((response) => {
              let data = response.data.data;
              console.log(data);
              this.$message({
                message: "Thêm mới nhận xét thành công",
                type: "success",
              });

              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới nhận xét thất bại",
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
    getEvaluateSampleUpdateInitial(row) {
      this.udpateEvaluateSample = row;
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
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>