<template>
  <el-dialog
    title="Xuất đơn thuốc"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-radio-group v-model="dataType">
      <el-radio style="margin-right: 150px" label="allType">Tất cả đơn thuốc</el-radio>
      <el-radio label="dateType">Chọn ngày</el-radio>
      <el-date-picker
        v-if="dataType == 'dateType'"
        type="date"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        :clearable="false"
        style="width: 30%"
        v-model="dateSelect"
      ></el-date-picker>
    </el-radio-group>
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
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {
        gradeName: "",
        gradeDescription: "",
      },
      dataType: "allType",
      dateSelect: this.moment(new Date()).format("YYYY-MM-DD"),
      idList: [],

      loadingButton: false,
      rules: {
        gradeName: [
          {
            required: true,
            message: "Tên khối không được để trống",
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
        this.loadingButton = false;
        this.dataType = "allType";
        this.dateSelect = this.moment(new Date()).format("YYYY-MM-DD");
      }, 300);
    },
    submitForm() {
      this.loadingButton = true;
      if (this.dataType == "allType") {
        this.$parent.exportExcelMedicineMethod();
      } else {
        this.$parent.exportExcelMedicineDateMethod();
      }
      if (this.$parent.dataSearch.idClass != "") {
        setTimeout(() => {
          this.closeDialog();
        }, 2000);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
