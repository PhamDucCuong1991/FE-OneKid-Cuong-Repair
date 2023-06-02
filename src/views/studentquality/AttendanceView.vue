<template>
  <el-dialog
    :title="fullNameTitle"
    :visible.sync="dialogVisible"
    width="750px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="8vh"
  >
    <el-form
      label-width="120px"
      :model="attendanceKid"
      label-position="top"
      :rules="rules"
      ref="attendanceKid"
    >
      <!-- điểm danh đến -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item>
              <div>
                <el-image
                  v-if="attendanceKid.attendanceArriveKids.arriveUrlPicture!=null"
                  style="width: 150px; height: 150px;  margin-right: 20px; margin-top: 20px"
                  :src="attendanceKid.attendanceArriveKids.arriveUrlPicture"
                  fit="fill"
                ></el-image>
              </div>
              <div
                style="margin-left: 22px; color: #4177e2; font-size: 17px"
              >Giờ đến: {{attendanceKid.attendanceArriveKids.timeArriveKid|formatTime}}</div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <el-form-item label="Nội dung">
              <el-input
                :rows="3"
                type="textarea"
                disabled
                v-model="attendanceKid.attendanceArriveKids.arriveContent"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="attendanceKid.attendanceArriveKids.idCreated!=null">
              <div style="margin-bottom: 10px">
                <div
                  style="line-height: 10px"
                >Người tạo điểm danh: {{attendanceKid.attendanceArriveKids.createdBy}}</div>
                <div>Thời gian tạo: {{attendanceKid.attendanceArriveKids.createdDate|formatDateTime}}</div>
              </div>
              <div
                v-if="attendanceKid.attendanceArriveKids.createdDate!=attendanceKid.attendanceArriveKids.lastModifieDate"
              >
                <div
                  style="line-height: 10px"
                >Người sửa điểm danh: {{attendanceKid.attendanceArriveKids.lastModifieBy}}</div>
                <div>Thời gian sửa: {{attendanceKid.attendanceArriveKids.lastModifieDate|formatDateTime}}</div>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- điểm danh về -->
      <el-row :gutter="20" v-if="attendanceKid.attendanceLeaveKids.idCreated!=null">
        <hr />
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item>
              <div>
                <el-image
                  v-if="attendanceKid.attendanceLeaveKids.leaveUrlPicture!=null"
                  style="width: 150px; height: 150px;  margin-right: 20px; margin-top: 20px"
                  :src="attendanceKid.attendanceLeaveKids.leaveUrlPicture"
                  fit="fill"
                ></el-image>
              </div>
              <div
                style="margin-left: 25px; color: #4177e2; font-size: 17px"
              >Giờ về: {{attendanceKid.attendanceLeaveKids.timeLeaveKid|formatTime}}</div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <el-form-item label="Nội dung">
              <el-input
                :rows="3"
                disabled
                type="textarea"
                v-model="attendanceKid.attendanceLeaveKids.leaveContent"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="attendanceKid.attendanceLeaveKids.idCreated!=null">
              <div style="margin-bottom: 10px">
                <div
                  style="line-height: 10px"
                >Người điểm danh: {{attendanceKid.attendanceLeaveKids.createdBy}}</div>
                <div>Thời gian tạo: {{attendanceKid.attendanceLeaveKids.createdDate|formatDateTime}}</div>
              </div>
              <div
                v-if="attendanceKid.attendanceLeaveKids.createdDate!=attendanceKid.attendanceLeaveKids.lastModifieDate"
              >
                <div
                  style="line-height: 10px"
                >Người sửa điểm danh: {{attendanceKid.attendanceLeaveKids.lastModifieBy}}</div>
                <div>Thời gian sửa: {{attendanceKid.attendanceLeaveKids.lastModifieDate|formatDateTime}}</div>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('attendanceKid')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
// import AttendanceService from "@/services/AttendanceService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      attendanceKid: {},
      attendanceSave: {},
      fullNameTitle: "",
      loadingButton: false,
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close", false);
      setTimeout(() => {
        this.$refs["attendanceKid"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close", false);
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    // submitForm(fromData) {
    //   this.$refs[fromData].validate((valid) => {
    //     if (valid) {
    //       this.loadingButton = true;
    //       let dataSave = this.attendanceKid;
    //       if (
    //         this.attendanceKid.attendanceArriveKids.morning ||
    //         this.attendanceKid.attendanceArriveKids.afternoon ||
    //         this.attendanceKid.attendanceArriveKids.evening
    //       ) {
    //         if (this.attendanceKid.attendanceArriveKids.timeArriveKid == null) {
    //           this.$message({
    //             message: "Chưa chọn giờ đến",
    //             type: "error",
    //           });
    //           return;
    //         }
    //       }
    //       AttendanceService.saveOne(this.attendanceKid.id, dataSave)
    //         .then((resp) => {
    //           this.attendanceSave = resp.data.data;
    //           this.$message({
    //             message: "Sửa điểm danh đến thành công",
    //             type: "success",
    //           });
    //           setTimeout(() => {
    //             this.closeDialogByButton(fromData);
    //           }, 500);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //           this.$message({
    //             message: "Sửa điểm danh đến thất bại",
    //             type: "error",
    //           });
    //         })
    //         .finally(() => {
    //           setTimeout(() => {
    //             this.loadingButton = false;
    //           }, 500);
    //         });
    //     } else {
    //       console.log("error validate data!");
    //       return false;
    //     }
    //   });
    // },
    getDataArriveRowInitial(row) {
      this.attendanceKid = row;
      this.fullNameTitle =
        "Thông tin điểm danh đến và về: " + row.kids.fullName;
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
/deep/.el-dialog__body {
  padding-top: 5px;
  padding-bottom: 0px;
}
/deep/.el-form--label-top .el-form-item__label {
  padding-bottom: 0;
}
/deep/.el-avatar {
  display: inline;
  img {
    border-radius: 5px;
    width: 100%;
    margin-top: 13px;
  }
}
</style>