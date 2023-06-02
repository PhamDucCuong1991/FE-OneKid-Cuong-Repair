<template>
  <el-dialog
    title="Tạo link xem thêm"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form label-width="120px" :model="news" label-position="left" :rules="rules" ref="news">
      <el-form-item label="Link mở rộng" prop="link">
        <el-input type="text" autosize v-model="news.link" placeholder="Nhập link mở rộng"></el-input>
      </el-form-item>
      <el-form-item label="Hiển thị cho" prop="appTypeArr">
        <el-checkbox :disabled="this.lengthAppPlusNews>=1" v-model="news.appPlus">App Plus</el-checkbox>
        <el-checkbox :disabled="this.lengthAppTeacherNews>=1" v-model="news.appTeacher">App Teacher</el-checkbox>
        <el-checkbox :disabled="this.lengthAppParentNews>=1" v-model="news.appParent">App OneKids</el-checkbox>
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
import NewsExtraService from "@/services/NewsExtraService";
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
        appTeacher:"",
        appParent:"",
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
        ]
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.news.appPlus=false
      this.news.appTeacher=false
      this.news.appParent=false
      this.$refs["news"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.news.appPlus=false
      this.news.appTeacher=false
      this.news.appParent=false
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          NewsExtraService.createNewsExtra(this.news)
            .then(() => {
              this.$message({
                message: "Thêm mới bài viết thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới bài viết thất bại",
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
    // getCreateNews(data){
    //   this.news=data
    // }
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