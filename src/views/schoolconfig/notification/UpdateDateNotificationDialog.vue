<template>
  <el-dialog
    title="Chỉnh sửa thời gian gửi tin"
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
          value-format="HH:mm"
          format="HH:mm"
          :picker-options="{
            selectableRange: '05:00:00 - 22:00:00',
          }"
          v-model="fromData.time"
          placeholder="Chọn thời gian"
        ></el-time-picker>
        <el-select
          clearable
          v-if="
            typeDate.type != 'attendanceArrive' &&
            typeDate.type != 'attendanceLeave' &&
            typeDate.type != 'attendanceEat' &&
            typeDate.type != 'home' &&
            typeDate.type != 'medicine' &&
            typeDate.type != 'message' &&
            typeDate.type != 'absent' &&
            typeDate.type != 'birthday'
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
        <el-form-item label="Trạng thái">
          <el-switch v-model="fromData.status"></el-switch>
        </el-form-item>
        <el-form-item
          prop="percent"
          label="Phần trăm (%)"
          v-if="
            typeDate.typeReceive == 'plus' &&
            (typeDate.type == 'fees' || typeDate.type == 'salary')
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
        @click="deleteDate('updateData')"
        :loading="loadingButtonDel"
      >
        <i class="el-icon-delete" />
        <span>Xóa</span>
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
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('updateData')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import NotificationManageService from "@/services/NotificationManageService";
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
    typeDate: null,
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      loadingButtonDel: false,
      dayList: valDayList,
      fromData: {
        time: "",
        day: "",
        month: "",
        status: "",
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
        this.$refs["updateData"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(from) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[from].resetFields();
      }, 300);
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          NotificationManageService.updateDateNotification(this.fromData)
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
    deleteDate(form) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thư mục đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          this.loadingButtonDel = true;
          NotificationManageService.deleteDateNotification(this.fromData.id)
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
                this.loadingButtonDel = false;
              }, 500);
            });
        })
        .catch(() => {
          setTimeout(() => {
            this.loadingButtonDel = false;
          }, 500);
        });
    },
    async getDataInitial(id) {
      await NotificationManageService.findByIdDate(id).then((resp) => {
        this.fromData = resp.data.data;
      });
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
.input-common {
  margin-right: 5px;
}
.input-time {
  margin-bottom: 10px;
  width: 150px;
  margin-right: 5px;
}
</style>
