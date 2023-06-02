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
      <!-- chấm công đến -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item>
              <div>
                <el-image
                  v-if="attendanceKid.attendanceDetail.arrivePicture != null"
                  style="
                    width: 150px;
                    height: 150px;
                    margin-right: 20px;
                    margin-top: 20px;
                  "
                  :src="attendanceKid.attendanceDetail.arrivePicture"
                  fit="fill"
                ></el-image>
              </div>
              <div style="margin-left: 22px; color: #4177e2; font-size: 17px">
                Giờ đến:
                {{ attendanceKid.attendanceDetail.arriveTime | formatTime }}
              </div>
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
                v-model="attendanceKid.attendanceDetail.arriveContent"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="attendanceKid.attendanceDetail.idCreated != null">
              <div style="margin-bottom: 10px">
                <div style="line-height: 10px">
                  Người tạo chấm công:
                  {{ attendanceKid.attendanceDetail.createdBy }}
                </div>
                <div>
                  Thời gian tạo:
                  {{ attendanceKid.attendanceDetail.createdDate | formatDateTime }}
                </div>
              </div>
              <div
                v-if="
                  attendanceKid.attendanceDetail.createdDate !=
                  attendanceKid.attendanceDetail.lastModifieDate
                "
              >
                <div style="line-height: 10px">
                  Người sửa chấm công:
                  {{ attendanceKid.attendanceDetail.lastModifieBy }}
                </div>
                <div>
                  Thời gian sửa:
                  {{ attendanceKid.attendanceDetail.lastModifieDate | formatDateTime }}
                </div>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- chấm công về -->
      <el-row :gutter="20" v-if="attendanceKid.attendanceDetail.idCreated != null">
        <hr />
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item>
              <div>
                <el-image
                  v-if="attendanceKid.attendanceDetail.leavePicture != null"
                  style="
                    width: 150px;
                    height: 150px;
                    margin-right: 20px;
                    margin-top: 20px;
                  "
                  :src="attendanceKid.attendanceDetail.leavePicture"
                  fit="fill"
                ></el-image>
              </div>
              <div style="margin-left: 25px; color: #4177e2; font-size: 17px">
                Giờ về:
                {{ attendanceKid.attendanceDetail.leaveTime | formatTime }}
              </div>
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
                v-model="attendanceKid.attendanceDetail.leaveContent"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="attendanceKid.attendanceDetail.idCreated != null">
              <div style="margin-bottom: 10px">
                <div style="line-height: 10px">
                  Người chấm công:
                  {{ attendanceKid.attendanceDetail.createdBy }}
                </div>
                <div>
                  Thời gian tạo:
                  {{ attendanceKid.attendanceDetail.createdDate | formatDateTime }}
                </div>
              </div>
              <div
                v-if="
                  attendanceKid.attendanceDetail.createdDate !=
                  attendanceKid.attendanceDetail.lastModifieDate
                "
              >
                <div style="line-height: 10px">
                  Người sửa chấm công:
                  {{ attendanceKid.attendanceDetail.lastModifieBy }}
                </div>
                <div>
                  Thời gian sửa:
                  {{ attendanceKid.attendanceDetail.lastModifieDate | formatDateTime }}
                </div>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('attendanceKid')"
      >
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
    getDataArriveRowInitial(row) {
      this.attendanceKid = row;
      this.fullNameTitle =
        "Thông tin chấm công đến và về: " + row.infoEmployeeResponse.fullName;
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
