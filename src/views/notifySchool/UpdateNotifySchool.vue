<template>
  <div>
    <el-dialog
      title="Cập nhật tin tức"
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
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :file-list="fromData.notifySchoolAttachFileList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-plus"></i>
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
    <span
      ><el-dialog width="30%" :visible.sync="dialogVisible1">
        <img width="100%" :src="dialogImageUrl" alt /> </el-dialog
    ></span>
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
      fileDeleteList: [],
      fromData: {
        id: "",
        title: "",
        content: "",
        link: "",
        notifySchoolAttachFileList: [],
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
        this.$refs["updateData"].resetFields();
        this.multipartFileList = [];
        this.fileDeleteList = [];
      }, 300);
    },
    //click when click button
    closeDialogByButton(from) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[from].resetFields();
        this.multipartFileList = [];
        this.fileDeleteList = [];
      }, 300);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    handleChange(file, fileList) {
      this.multipartFileList = fileList.filter((x) => x.id == undefined);
    },
    handleRemove(file, fileList) {
      if (file.id == undefined) {
        this.multipartFileList = fileList.filter((x) => x.id == undefined);
      } else {
        this.fileDeleteList.push(file);
      }
    },
    handleExceed() {
      this.$message.warning(`Giới hạn là 3 file`);
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let formDatas = new FormData();
          formDatas.append("id", this.fromData.id);
          formDatas.append("title", this.fromData.title);
          formDatas.append("content", this.fromData.content);
          formDatas.append("link", this.fromData.link);
          if (
            this.multipartFileList != "undefined" &&
            this.multipartFileList != null &&
            this.multipartFileList.length != null &&
            this.multipartFileList.length > 0
          ) {
            this.multipartFileList.forEach((element) => {
              formDatas.append("multipartFileList", element.raw);
            });
          }
          if (this.fileDeleteList.length > 0) {
            this.fileDeleteList.forEach((x) => {
              formDatas.append("fileDeleteList", x.id);
            });
          }
          NotifySchoolService.updateNotifySchool(formDatas)
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

    getDataInitial(id) {
      NotifySchoolService.findByNotifySchool(id)
        .then((resp) => {
          this.fromData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
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
