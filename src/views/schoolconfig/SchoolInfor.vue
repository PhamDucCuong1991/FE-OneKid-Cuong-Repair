<template>
  <div>
    <el-form
      label-width="150px"
      :model="schoolData"
      label-position="left"
      :rules="rules"
      ref="schoolData"
    >
      <el-form-item label="Tên trường" prop="schoolName">
        <el-input
          v-model="schoolData.schoolName"
          placeholder="Nhập tên trường"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" style="margin-top: 35px" prop="schoolDescription">
        <el-input
          :rows="7"
          type="textarea"
          v-model="schoolData.schoolDescription"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
      <el-form-item label="Địa chỉ" prop="schoolAddress">
        <el-input
          v-model="schoolData.schoolAddress"
          placeholder="Nhập địa chỉ"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mã xử lý" style="display: inline-block; width: 33.5%">
        <span>{{ schoolData.verifyCode }}</span>
      </el-form-item>
      <el-form-item
        label="SMS đã dùng"
        prop="smsUsed"
        style="display: inline-block; width: 33.5%"
      >
        <span>{{ schoolData.smsUsed }}</span>
      </el-form-item>
      <el-form-item label="SMS còn lại" style="display: inline-block; width: 33%">
        <span>{{ schoolData.smsTotal - schoolData.smsUsed }}</span>
      </el-form-item>
      <div class="content-2" style="display: flex; flex-direction: row">
        <div class="avt-info" style="width: 80%">
          <el-form-item label="Điện thoại" prop="schoolPhone">
            <el-input
              v-model.trim="schoolData.schoolPhone"
              placeholder="Nhập số điện thoại"
            ></el-input>
          </el-form-item>
          <el-form-item label="Ảnh bìa">
            <el-image
              v-if="schoolData.schoolAvatar != null && showPicutreInitial"
              style="width: 150px; height: 150px"
              :src="schoolData.schoolAvatar"
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
              <span v-if="schoolData.schoolAvatar != null">
                <i class="el-icon-plus avatar-uploader-icon" style="font-size: 20px"
                  >Cập nhật ảnh</i
                >
              </span>
              <span v-else>
                <i class="el-icon-plus avatar-uploader-icon" style="font-size: 20px"
                  >Thêm ảnh</i
                >
              </span>
            </el-upload>
          </el-form-item>
        </div>
        <div class="concat-detail">
          <el-form-item label="Email" prop="schoolEmail" class="input-below">
            <el-input
              v-model.trim="schoolData.schoolEmail"
              placeholder="Nhập email"
            ></el-input>
          </el-form-item>
          <el-form-item label="Website" prop="schoolWebsite" class="input-below">
            <el-input
              v-model="schoolData.schoolWebsite"
              placeholder="Nhập website"
            ></el-input>
          </el-form-item>
          <el-form-item label="Liên hệ 1" prop="contactPhone1" class="input-below">
            <el-input
              v-model.trim="schoolData.contactPhone1"
              placeholder="Số điện thoại 1"
            ></el-input>
          </el-form-item>
          <el-form-item label="Tên" prop="contactName1" class="input-below">
            <el-input
              v-model="schoolData.contactName1"
              placeholder="Nhập nội dung"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item class="input-below"></el-form-item> -->
          <el-form-item label="Liên hệ 2" prop="contactPhone2" class="input-below">
            <el-input
              v-model.trim="schoolData.contactPhone2"
              placeholder="Số điện thoại 2"
            ></el-input>
          </el-form-item>
          <el-form-item label="Tên" prop="contactName2" class="input-below">
            <el-input
              v-model="schoolData.contactName2"
              placeholder="Nhập nội dung"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item prop="schoolAvatar" class="input-below"></el-form-item> -->
          <el-form-item label="Liên hệ 3" prop="contactPhone3" class="input-below">
            <el-input
              v-model.trim="schoolData.contactPhone3"
              placeholder="Số điện thoại 3"
            ></el-input>
          </el-form-item>
          <el-form-item label="Tên" prop="contactName3" class="input-below">
            <el-input
              v-model="schoolData.contactName3"
              placeholder="Nhập nội dung"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="checkPermission(['schoolConfig_school_update'])"
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        style="float: right; border-radius: 0"
        @click="submitForm('schoolData')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      imageUrl: "",
      showUpload: true,
      showPicutreInitial: true,
      schoolData: {},
      newGradeCreated: null,
      loadingButton: false,
      rules: {
        schoolName: [
          {
            required: true,
            message: "Tên trường không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    checkPermission,
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["schoolData"].resetFields();
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
      this.$refs["schoolData"].resetFields();
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
        this.showUpload = true;
        this.showPicutreInitial = true;
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
          this.loadingButton = true;
          let inputData = this.schoolData;
          let formDatas = new FormData();
          for (var key in inputData) {
            formDatas.append(key, inputData[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFile", this.imageUrl);
          }
          SchoolConfigService.updateSchoolData(formDatas)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              this.getSchoolInitial();
            })
            .catch((err) => {
              let messageText =
                err.response.status == 403
                  ? this.$permissionDenied
                  : err.response.data.message;
              this.$message({
                message: messageText,
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
    getSchoolInitial() {
      SchoolConfigService.getSchoolData()
        .then((resp) => {
          this.schoolData = resp.data.data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
        });
    },
  },
  beforeMount() {
    this.getSchoolInitial();
  },
};
</script>
<style>
.hideUpload > div {
  visibility: hidden;
}
</style>
<style lang="scss" scoped>
/deep/.el-input__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
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
/deep/label.el-form-item__label {
  padding-left: 40px;
}
.input-below {
  width: 50%;
  display: inline-block;
}
</style>
