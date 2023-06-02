<template>
  <el-dialog
    title="Tạo ngày nghỉ cho nhiều lớp"
    :visible.sync="dialogVisible"
    width="900px"
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
      <el-form-item label="Các lớp đã chọn">
        <span v-for="item in classList" :key="item"> {{ item.className }}, </span>
      </el-form-item>
      <el-form-item label="Chọn ngày" prop="dateList">
        <el-date-picker
          style="margin: 0 auto; width: 100%"
          :picker-options="startDayOfWeek"
          type="dates"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          v-model="dataInput.dateList"
          placeholder="Chọn các ngày nghỉ"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input v-model="dataInput.note" placeholder="Ghi chú"> </el-input>
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
        <span>Tạo ngày nghỉ</span>
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
      classList: [],
      dataInput: {
        idClassList: [],
        dateList: [],
        note: "Ngày nghỉ",
      },
      loadingButton: false,
      rules: {
        dateList: [
          {
            required: true,
            message: "Ngày không được để trống",
            trigger: "change",
          },
        ],
        note: [
          {
            required: true,
            message: "Ghi chú không được để trống",
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
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SchoolConfigService.createDayOffClassMany(this.dataInput)
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
    getDataInitial(rowList) {
      this.dataInput.idClassList = rowList.map((x) => x.id);
      this.classList = rowList;
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
  padding-bottom: 5px;
}
</style>
