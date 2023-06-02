<template>
  <el-dialog
    title="Chọn lớp khôi phục cho học sinh"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Tên học sinh">
        <span> {{ dataTransfer.fullName }} </span>
      </el-form-item>
      <el-form-item label="Lớp hiện tại">
        <span> {{ dataTransfer.maClass.className }} </span>
      </el-form-item>
      <el-form-item label="Chọn lớp" prop="idClass">
        <el-select v-model="dataInput.idClass">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>
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
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import GroupOutService from "@/services/GroupOutService";
import {mapActions, mapState} from "vuex";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {
        id: "",
        idClass: "",
      },
      classList: [],
      dataTransfer: {},
      loadingButton: false,
      rules: {
        idClass: [
          {
            required: true,
            message: "Lớp không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
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
          GroupOutService.restoreKidsGroupOut(this.dataInput.id, this.dataInput.idClass)
            .then((response) => {
              this.$message({
                message: response.data.message,
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
    getDataRestoreInitial(row) {
      this.dataTransfer = row;
      this.dataInput.id = row.id;

        this.classList = mapState(['serverDataClass'])

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
