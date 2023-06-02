<template>
  <el-dialog
    title="Cập nhật mẫu lời chúc"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="120px"
      :model="newWishesSample"
      label-position="left"
      :rules="rules"
      ref="newWishesSample"
    >
      <el-form-item label="Đối tượng" prop="receiverType">
        <el-radio-group v-model="newWishesSample.receiverType">
          <el-radio label="Học sinh">Học sinh</el-radio>
          <el-radio label="Phụ huynh">Phụ huynh</el-radio>
          <el-radio label="Giáo viên">Giáo viên</el-radio>
          <el-radio label="Nhà trường">Nhà trường</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Nội dung" prop="wishesContent">
        <el-input
          :rows="5"
          type="textarea"
          v-model="newWishesSample.wishesContent"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>

      <el-form-item label="Chọn ảnh">
        <el-image
          v-if="newWishesSample.urlPicture != null && showPicutreInitial"
          style="width: 150px; height: 150px; float: left; margin-right: 20px"
          :src="newWishesSample.urlPicture"
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
          <span v-if="newWishesSample.urlPicture != null">
            <i class="el-icon-plus" style="font-size: 20px">Cập nhật ảnh</i>
          </span>
          <span v-else>
            <i class="el-icon-plus" style="font-size: 20px">Thêm ảnh</i>
          </span>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('newWishesSample')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('newWishesSample')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
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
      imageUrl: "",
      showUpload: true,
      showPicutreInitial: true,
      newWishesSample: {
        wishesContent: "",
        receiverType: "",
      },
      loadingButton: false,
      rules: {
        wishesContent: [
          {
            required: true,
            message: "Nội dung không được để trống",
            trigger: "change",
          },
        ],
        receiverType: [
          {
            required: true,
            message: "Đối tượng không được để trống",
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
      this.$refs.upload.clearFiles();
      this.handleRemove();
      setTimeout(() => {
        this.$refs["newWishesSample"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      this.$refs.upload.clearFiles();
      this.handleRemove();
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["newWishesSample"].resetFields();
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
          this.loadingButton = true;
          let inputData = this.newWishesSample;
          let formDatas = new FormData();
          for (var key in inputData) {
            formDatas.append(key, inputData[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFile", this.imageUrl);
          }
          SchoolConfigService.updateWishesSample(formDatas)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
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
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getDataInitial(row) {
      this.newWishesSample = row;
    },
  },
};
</script>
<style>
.hideUpload > div {
  visibility: hidden;
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
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>
