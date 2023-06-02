<template>
  <el-dialog
    title="Cài đặt chế độ xem cho OneCam"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      label-width="160px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Điểm danh đến">
        <el-checkbox v-model="dataInput.arriveViewStatus"
          >Học sinh điểm danh đến mới được xem camera</el-checkbox
        >
        <el-input
          v-model="dataInput.arriveViewText"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>
      <el-form-item label="Điểm danh về">
        <el-checkbox v-model="dataInput.leaveNoViewStatus"
          >Học sinh điểm về không được xem camera</el-checkbox
        >
        <el-input
          v-model="dataInput.leaveNoViewText"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>
      <el-form-item label="Giới hạn xem liên tục">
        <el-radio-group v-model="dataInput.viewLimitStatus">
          <el-radio :label="true">Có</el-radio>
          <el-radio :label="false">Không</el-radio>
        </el-radio-group>
        <span style="float: right"
          >Số phút xem liên tục &nbsp;&nbsp;&nbsp;&nbsp;
          <el-input-number
            style="width: 250px"
            v-model="dataInput.viewLimitNumber"
          ></el-input-number
        ></span>
        <el-input
          style="margin-top: 10px"
          v-model="dataInput.viewLimitText"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>
      <el-form-item label="Khoảng thời gian xem">
        <el-checkbox v-model="dataInput.timeViewStatus"
          >Giới hạn khoảng thời gian xem camera không</el-checkbox
        >
        <el-input v-model="dataInput.timeViewText" placeholder="Nhập nội dung"></el-input>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="4"><div class="grid-content bg-purple">Giá trị 1</div></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.startTime1"
                placeholder="Bắt đầu"
                style="width: 170px"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.endTime1"
                style="width: 170px"
                placeholder="Kết thúc"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="4"><div class="grid-content bg-purple">Giá trị 2</div></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.startTime2"
                placeholder="Bắt đầu"
                style="width: 170px"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.endTime2"
                style="width: 170px"
                placeholder="Kết thúc"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="4"><div class="grid-content bg-purple">Giá trị 3</div></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.startTime3"
                placeholder="Bắt đầu"
                style="width: 170px"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.endTime3"
                style="width: 170px"
                placeholder="Kết thúc"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="4"><div class="grid-content bg-purple">Giá trị 4</div></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.startTime4"
                placeholder="Bắt đầu"
                style="width: 170px"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.endTime4"
                style="width: 170px"
                placeholder="Kết thúc"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="4"><div class="grid-content bg-purple">Giá trị 5</div></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.startTime5"
                placeholder="Bắt đầu"
                style="width: 170px"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-time-select
                v-model="dataInput.endTime5"
                style="width: 170px"
                placeholder="Kết thúc"
                :picker-options="getTimeSelect()"
              >
              </el-time-select></div
          ></el-col>
        </el-row>
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
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {},
      loadingButton: false,
      rules: {
        // gradeName: [
        //   {
        //     required: true,
        //     message: "Tên khối không được để trống",
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      // setTimeout(() => {
      //   this.$refs["dataInput"].resetFields();
      // }, 300);
    },
    getTimeSelect() {
      return {
        start: "00:00",
        step: "00:05",
        end: "23:55",
      };
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SchoolConfigService.updateOneCamSetting(this.dataInput)
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
    initialDataMethod(row) {
      this.dataInput = row;
    },
  },
};
</script>

<style lang="scss" scoped></style>
