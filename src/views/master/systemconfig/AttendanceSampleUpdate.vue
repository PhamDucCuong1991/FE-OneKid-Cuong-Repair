<template>
  <el-dialog
    title="Cập nhật mẫu điểm danh"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="updateAttendanceSample"
      label-position="left"
      :rules="rules"
      ref="updateAttendanceSample"
    >
      <el-form-item label="Loại điểm danh" prop="attendanceType">
        <el-select
          style="width:100%"
          v-model="updateAttendanceSample.attendanceType"
          placeholder="Chọn loại điểm danh"
          disabled
        >
          <el-option
            v-for="item in attendanceTypeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Nội dung" prop="attendanceContent">
        <el-input
          :rows="10"
          type="textarea"
          v-model="updateAttendanceSample.attendanceContent"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('updateAttendanceSample')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('updateAttendanceSample')"
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
      updateAttendanceSample: {
        attendanceType: "",
        attendanceContent: "",
      },
      loadingButton: false,
      attendanceTypeList: [
        { key: "arrive", value: "Điểm danh đến" },
        { key: "leave", value: "Điểm danh về" },
      ],
      rules: {
        attendanceType: [
          {
            required: true,
            message: "Loại điểm danh không được để trống",
            trigger: "change",
          },
        ],
        attendanceContent: [
          {
            required: true,
            message: "Nội dung không được để trống",
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
        this.$refs["updateAttendanceSample"].resetFields();
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
      this.$refs["updateAttendanceSample"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SystemConfigService.updateAttendanceSample(
            this.updateAttendanceSample
          )
            .then((response) => {
              let data = response.data.data;
              console.log(data);
              this.$message({
                message: "Cập nhật điểm danh thành công",
                type: "success",
              });

              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Cập nhật điểm danh thất bại",
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
    getAttendanceSampleUpdateInitial(row) {
      this.updateAttendanceSample = row;
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