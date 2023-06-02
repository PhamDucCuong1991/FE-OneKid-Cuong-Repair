<template>
  <el-dialog
    :title="'Thông tin điểm danh về: '+fullNameTitle"
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="attendanceKid.attendanceLeaveKids"
      label-position="top"
      :rules="rules"
      ref="attendanceKid"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item>
              <div>
                <el-image
                  v-if="attendanceKid.attendanceLeaveKids.leaveUrlPicture!=null && showPicutreInitial"
                  style="width: 150px; height: 150px; float:left; margin-right: 20px; margin-bottom: 10px"
                  :src="attendanceKid.attendanceLeaveKids.leaveUrlPicture"
                  fit="fill"
                ></el-image>
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="true"
                  list-type="picture-card"
                  :on-change="handleChangeUpload"
                  :on-remove="handleRemove"
                  :auto-upload="false"
                  :class="{ hideUpload: !showUpload }"
                  limit="1"
                  ref="upload"
                >
                  <span v-if="attendanceKid.attendanceLeaveKids.leaveUrlPicture!=null">
                    <i class="el-icon-plus" style="font-size: 20px">Cập nhật ảnh</i>
                  </span>
                  <span v-else>
                    <i class="el-icon-plus" style="font-size: 20px">Thêm ảnh</i>
                  </span>
                </el-upload>
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
                :rows="2"
                type="textarea"
                v-model="attendanceKid.attendanceLeaveKids.leaveContent"
                placeholder="Nhập nội dung"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="attendanceKid.attendanceLeaveKids.idCreated!=null">
              <div style="margin-bottom: 10px">
                <div
                  style="line-height: 10px"
                >Người tạo điểm danh: {{attendanceKid.attendanceLeaveKids.createdBy}}</div>
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
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('attendanceKid')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import AttendanceService from "@/services/AttendanceService";
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
      imageUrl: "",
      showUpload: true,
      showPicutreInitial: true,
      srcArrive:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close", false);
      this.$refs.upload.clearFiles();
      this.handleRemove();
      setTimeout(() => {
        this.$refs["attendanceKid"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close", false);
      this.$refs.upload.clearFiles();
      this.handleRemove();
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    /**
     * click change image
     */
    handleChangeUpload(file) {
      this.beforeAvatarUpload(file);
      this.showPicutreInitial = false;
      this.showUpload = !this.showUpload;
      this.imageUrl = file.raw;
    },
    /**
     * remove image
     */
    handleRemove() {
      setTimeout(() => {
        this.showPicutreInitial = true;
        this.showUpload = true;
      }, 800);
      this.imageUrl = "";
    },
    /**
     * check image before upload
     */
    beforeAvatarUpload(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.raw.size / 1024 / 1024 <= 5;
      if (!isJPG && !isPNG) {
        this.$message.error("Bạn phải chọn định dạng ảnh");
        this.$refs.upload.clearFiles();
        throw "file not valid";
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không được quá 5MB!");
        this.$refs.upload.clearFiles();
        throw "over size";
      }
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          // let dataSave = this.attendanceKid;
          // if (dataSave.attendanceLeaveKids.statusLeave) {
          //   if (dataSave.attendanceLeaveKids.timeLeaveKid == null) {
          //     this.$message({
          //       message: "Chưa chọn giờ về",
          //       type: "error",
          //     });
          //     return;
          //   }
          // }
          let inputData = this.attendanceKid.attendanceLeaveKids;
          let formDatas = new FormData();
          for (var key in inputData) {
            formDatas.append(key, inputData[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFile", this.imageUrl);
          }
          this.loadingButton = true;
          AttendanceService.updateLeaveContent(
            this.attendanceKid.attendanceLeaveKids.id,
            formDatas
          )
            .then((resp) => {
              this.attendanceLeaveOneSave = resp.data.data;
              this.$message({
                message: "Lưu điểm danh về thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "Lưu điểm danh về thất bại",
                type: "error",
              });
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
    getDataLeaveRowInitial(row) {
      this.attendanceKid = row;
      this.fullNameTitle = row.kids.fullName;
    },
  },
};
</script>
<style>
.hideUpload > div {
  display: none;
}
</style>
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