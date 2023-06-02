<template>
  <el-dialog
    title="Thêm mới thời gian gửi tin"
    :visible.sync="dialogVisible"
    width="550px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form ref="updateData" :model="fromData" :rules="rules">
      <div>
        <el-time-picker
          :clearable="false"
          style="margin-right: 5px"
          type="time"
          :picker-options="{
            selectableRange: '05:00:00 - 22:00:00',
          }"
          value-format="HH:mm"
          format="HH:mm"
          v-model="fromData.time"
          placeholder="Chọn thời gian"
        ></el-time-picker>
        <el-select
          clearable
          v-if="
            dateNotify.type != 'attendanceArrive' &&
            dateNotify.type != 'attendanceLeave' &&
            dateNotify.type != 'attendanceEat' &&
            dateNotify.type != 'home' &&
            dateNotify.type != 'medicine' &&
            dateNotify.type != 'message' &&
            dateNotify.type != 'absent' &&
            dateNotify.type != 'birthday'
          "
          class="input-time"
          placeholder="Chọn ngày"
          v-model="fromData.day"
        >
          <el-option
            v-for="item in dayList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-form-item
          prop="percent"
          label="Phần trăm (%)"
          v-if="
            dateNotify.typeReceive == 'plus' &&
            (dateNotify.type == 'fees' || dateNotify.type == 'salary')
          "
        >
          <el-input-number
            :min="1"
            :max="100"
            placeholder="Nhập phần trăm"
            v-model="fromData.percent"
          ></el-input-number>
        </el-form-item>
      </div>
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
import moment from "moment";
const valDayList = [
  { key: 1, value: "Ngày 01" },
  { key: 2, value: "Ngày 02" },
  { key: 3, value: "Ngày 03" },
  { key: 4, value: "Ngày 04" },
  { key: 5, value: "Ngày 05" },
  { key: 6, value: "Ngày 06" },
  { key: 7, value: "Ngày 07" },
  { key: 8, value: "Ngày 08" },
  { key: 9, value: "Ngày 09" },
  { key: 10, value: "Ngày 10" },
  { key: 11, value: "Ngày 11" },
  { key: 12, value: "Ngày 12" },
  { key: 13, value: "Ngày 13" },
  { key: 14, value: "Ngày 14" },
  { key: 15, value: "Ngày 15" },
  { key: 16, value: "Ngày 16" },
  { key: 17, value: "Ngày 17" },
  { key: 18, value: "Ngày 18" },
  { key: 19, value: "Ngày 19" },
  { key: 20, value: "Ngày 20" },
  { key: 21, value: "Ngày 21" },
  { key: 22, value: "Ngày 22" },
  { key: 23, value: "Ngày 23" },
  { key: 24, value: "Ngày 24" },
  { key: 25, value: "Ngày 25" },
  { key: 26, value: "Ngày 26" },
  { key: 27, value: "Ngày 27" },
  { key: 28, value: "Ngày 28" },
  { key: 29, value: "Ngày 29" },
  { key: 30, value: "Ngày 30" },
  { key: 31, value: "Ngày 31" },
];
export default {
  props: {
    dateNotify: null,
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      dayList: valDayList,
      fromData: {
        idNotification: "",
        id: "",
        time: this.moment().toString(),
        day: "",
        month: "",
        status: "",
        percent: "",
      },
      rules: {
        percent: [
          {
            required: true,
            message: "Phần trăm không được để trống",
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
        this.fromData = {
          idNotification: "",
          id: "",
          time: this.moment().toString(),
          day: "",
          month: "",
          status: "",
        };
        this.$refs["updateData"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(from) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.fromData = {
          idNotification: "",
          id: "",
          time: moment().toString(),
          day: "",
          month: "",
          status: "",
        };
        this.$refs[from].resetFields();
      }, 300);
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          this.fromData.idNotification = this.dateNotify.id;
          NotificationManageService.createDateNotification(this.fromData)
            .then((response) => {
              this.$message({
                message: response.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(form);
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
.demo-input-label {
  display: inline-block;
  width: 100px;
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
.input-common {
  margin-right: 5px;
}
.input-time {
  margin-bottom: 10px;
  width: 150px;
  margin-right: 5px;
}
</style>
