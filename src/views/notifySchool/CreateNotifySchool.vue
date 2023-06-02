<template>
  <div>
    <el-dialog
      title="Thêm mới tin tức"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      width="76%"
      top="10vh"
    >
      <el-form
        ref="updateData"
        :model="fromData"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="title" label="Tiêu đề">
          <el-input placeholder="Nhập tiêu đề" v-model="fromData.title"></el-input>
        </el-form-item>
        <el-form-item label="Nội dung" prop="content">
          <el-input
            :rows="10"
            type="textarea"
            v-model="fromData.content"
            placeholder="Nhập nội dung"
          ></el-input>
        </el-form-item>
        <el-form-item prop="link" label="Đường dẫn">
          <el-input
            placeholder="Nhập đường dẫn đính kèm (https://example.com)"
            v-model="fromData.link"
          ></el-input>
        </el-form-item>
        <span style="margin: 40px; color: orange; margin-top: -30px"
          >Chọn tối đa 3 ảnh</span
        >
        <el-progress
          style="width: 25%; float: left; margin-top: 30px"
          :percentage="percentage"
          v-if="showProgress"
          :color="colors"
        ></el-progress>
        <el-upload
          style="margin-left: 35px; clear: both"
          action="/api/upload/"
          list-type="picture-card"
          :auto-upload="false"
          :file-list="multipartFileList"
          :on-change="handleChangePicture"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          ref="upload"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <!-- <img :src="imageUrl" class="avatar" /> -->
          <i
            slot="default"
            class="el-icon-plus"
            style="font-style: normal; font-size: 24px"
            >Thêm Ảnh</i
          >
          <div slot="file" slot-scope="{ file }">
            <span style="background: orange; padding: 5px">Mới</span>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span @click="handleRemove" class="el-upload-list__item-delete">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton('updateData')">
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
    <el-dialog width="30%" :visible.sync="dialogVisible1">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import NotifySchoolService from "@/services/NotifySchoolService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible1: false,

      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      percentage: 0,
      loadingButton: false,
      showProgress: false,
      multipartFileList: [],
      fromData: {
        title: "",
        content: "",
        link: "",
        multipartFileList: [],
      },
      rules: {
        title: [
          {
            required: true,
            message: "Tiêu đề không được để trống",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "Nội dung không được để trống",
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
        this.handleRemove();
        this.$refs["updateData"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(from) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.handleRemove();
        this.$refs[from].resetFields();
      }, 300);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    increase() {
      this.interval = window.setInterval(() => {
        this.percentage += 5;
        if (this.percentage > 90) {
          this.percentage = 90;
        }
      }, 50);
    },
    stopIncrease() {
      clearInterval(this.interval);
      this.percentage = 100;
    },
    handleChangePicture(file, fileList) {
      this.fromData.multipartFileList = fileList;
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG && !isPNG) {
        this.$message.error("Ảnh phải có dạng JPG hoặc PNG!");
        this.handleRemove(file);
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không thể vượt quá 5MB");
        this.handleRemove(file);
      }

      return isJPG && isLt5M;
    },
    handleRemove(file) {
      this.$refs.upload.clearFiles();
      let index = this.fromData.multipartFileList.indexOf(file);
      if (index >= 0) {
        this.fromData.multipartFileList.splice(index, 1);
      }
    },
    handleExceed() {
      this.$message.warning(`Chỉ được phép chọn tối đa 3 ảnh`);
    },
    beforeRemove(file, fileList) {
      console.log(fileList);
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          this.showProgress = true;
          this.increase();
          let formDatas = new FormData();
          formDatas.append("title", this.fromData.title);
          formDatas.append("content", this.fromData.content);
          formDatas.append("link", this.fromData.link);
          if (
            this.fromData.multipartFileList != "undefined" &&
            this.fromData.multipartFileList != null &&
            this.fromData.multipartFileList.length != null &&
            this.fromData.multipartFileList.length > 0
          ) {
            this.fromData.multipartFileList.forEach((element) => {
              formDatas.append("multipartFileList", element.raw);
            });
          }
          NotifySchoolService.createNotifySchool(formDatas)
            .then((response) => {
              this.$message({
                message: response.data.message,
                type: "success",
              });
              this.showProgress = false;
              this.stopIncrease();
              setTimeout(() => {
                this.closeDialogByButton(form);
              }, 500);
            })
            .catch((err) => {
              this.showProgress = false;
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
/deep/.el-input__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
</style>
