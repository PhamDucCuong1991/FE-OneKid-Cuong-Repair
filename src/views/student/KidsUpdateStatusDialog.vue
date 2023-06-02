<template>
  <div>
    <el-dialog
      :title="'Chuyển sang nghỉ học: ' + fullName"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="20vh"
    >
      <el-form :model="dataInput" :rules="rules" ref="dataInput" label-width="140px">
        <el-form-item label="Chọn ngày nghỉ học" prop="date">
          <el-date-picker
            v-model="dataInput.date"
            type="date"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            placeholder="Chọn ngày"
            :clearable="false"
          ></el-date-picker>
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
  </div>
</template>

<script>
import moment from "moment";
import StudentService from "@/services/StudentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      fullName: "",
      dataInput: { date: "" },
      loadingButton: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.responseList = [];
      }, 300);
    },
    submitForm() {
      this.loadingButton = true;
      StudentService.updateKidsStatus(this.dataInput)
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
    getKidsStatusDataInitial(id, fullName) {
      this.dataInput.date = moment(String(new Date())).format("YYYY-MM-DD");
      this.fullName = fullName;
      this.dataInput.id = id;
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
.input-common {
  margin-right: 5px;
}
</style>
