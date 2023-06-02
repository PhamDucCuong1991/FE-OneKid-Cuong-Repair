<template>
  <el-dialog
    title="Thêm bộ lọc cho học sinh"
    :visible.sync="dialogVisible"
    width="550px"
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
      <el-form-item label="Chọn loại" prop="type">
        <el-select v-model="dataInput.type" style="width: 100%">
          <el-option label="Ngày nhập học" value="startDate"> </el-option>
          <el-option label="Ngày sinh" value="birthday"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Khoảng ngày" prop="dateList">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          v-model="dataInput.dateList"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
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
        <span>{{ $t("button.OK") }}</span>
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
      pickerOptions: this.$funcCommon.quickOptionDate(),
      dataInput: {
        type: "",
        dateList: [],
      },
      loadingButton: false,
      rules: {
        type: [
          {
            required: true,
            message: "Loại không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog(data) {
      this.$emit("dialog-close", data);
    },
    submitForm() {
      if (this.dataInput.dateList == null) {
        this.dataInput.dateList = [];
      }
      this.closeDialog(this.dataInput);
    },
    getSearchExtendInitial(type, dateList) {
      this.dataInput.type = type;
      this.dataInput.dateList = dateList;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
