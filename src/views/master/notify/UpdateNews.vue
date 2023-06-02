<template>
  <el-dialog
    title="Sửa bài viết mới tin tức"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="news"
      label-position="left"
      :rules="rules"
      ref="news"
    >
      <el-form-item label="Tiêu đề" prop="title">
        <el-input v-model="news.title" placeholder="Nhập tiêu đề"></el-input>
      </el-form-item>
      <el-form-item label="Link bài viết" prop="link">
        <el-input
          type="text"
          autosize
          v-model="news.link"
          placeholder="Nhập link bài viết"
        ></el-input>
      </el-form-item>
      <el-form-item label="Hiển thị cho" prop="appTypeArr">
        <el-checkbox :disabled="this.lengthAppPlusNews >= 5" v-model="news.appPlus"
          >App Plus</el-checkbox
        >
        <el-checkbox :disabled="this.lengthAppTeacherNews >= 9" v-model="news.appTeacher"
          >App Teacher</el-checkbox
        >
        <el-checkbox :disabled="this.lengthAppParentNews >= 9" v-model="news.appParent"
          >App OneKids</el-checkbox
        >
        <el-checkbox v-model="news.appOneCame">App OneCam</el-checkbox>
      </el-form-item>
      <el-form-item label="Link ảnh" prop="urlAttachPicture">
        <el-input
          type="text"
          autosize
          v-model="news.urlAttachPicture"
          placeholder="Nhập link ảnh"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('news')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('news')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import NewsService from "@/services/NewsService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      lengthAppPlusNews: "",
      lengthAppTeacherNews: "",
      lengthAppParentNews: "",
      news: {
        title: "",
        link: "",
        appPlus: "",
        appTeacher: "",
        appParent: "",
        appOneCame: "",
      },
      newsCreated: null,
      loadingButton: false,
      rules: {
        title: [
          {
            required: true,
            message: "Tiêu đề không được để trống",
            trigger: "blur",
          },
        ],
        link: [
          {
            required: true,
            message: "Link bài viết không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$refs["news"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          NewsService.updateNews(this.news)
            .then(() => {
              this.$message({
                message: "Cập nhật bài viết thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Cập nhật bài viết thất bại",
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
    getCreateNews(data) {
      this.news = data;
    },
    getLength(lengthAppPlusNews, lengthAppTeacherNews, lengthAppParentNews) {
      this.lengthAppPlusNews = lengthAppPlusNews;
      this.lengthAppTeacherNews = lengthAppTeacherNews;
      this.lengthAppParentNews = lengthAppParentNews;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__inner,
/deep/.el-textarea__inner {
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
</style>
