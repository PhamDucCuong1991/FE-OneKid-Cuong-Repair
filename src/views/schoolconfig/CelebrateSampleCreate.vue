<template>
  <el-dialog
    title="Thêm mới ngày lễ"
    :visible.sync="dialogVisible"
    width="1000px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      label-width="130px"
      :model="newCelebrateSample"
      label-position="left"
      :rules="rules"
      ref="newCelebrateSample"
    >
      <el-form-item label="Đối tượng" prop="type">
        <el-radio-group v-model="newCelebrateSample.type">
          <el-radio label="Học sinh">Học sinh</el-radio>
          <el-radio label="Phụ huynh">Phụ huynh</el-radio>
          <el-radio label="Giáo viên">Giáo viên</el-radio>
          <el-radio label="Nhà trường">Nhà trường</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Chủ đề" prop="title">
        <el-input v-model="newCelebrateSample.title" placeholder="Nhập chủ đề"></el-input>
      </el-form-item>
      <el-form-item label="Chọn ngày" prop="date" style="display:inline-block; width: 30%; ">
        <el-select v-model="newCelebrateSample.date" placeholder="Chọn ngày">
          <el-option v-for="item in dateList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Giới tính" prop="gender" style="float: right; margin-left: 15px">
        <el-select v-model="newCelebrateSample.gender" placeholder="Giới tính">
          <el-option v-for="item in genderList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Chọn tháng" prop="month" style="float: right; width: 30%;">
        <el-select v-model="newCelebrateSample.month" placeholder="Chọn tháng">
          <el-option v-for="item in monthList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Nội dung" prop="content">
        <el-input
          :rows="3"
          type="textarea"
          v-model="newCelebrateSample.content"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>
      <el-form-item label="Chọn ảnh">
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
          <span>
            <i class="el-icon-plus" style="font-size: 20px;">Thêm ảnh</i>
          </span>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('newCelebrateSample')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('newCelebrateSample')"
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
      showPicture: true,
      showUpload: true,
      newCelebrateSample: {
        wishesContent: "",
        receiverType: "",
      },
      loadingButton: false,
      genderList: ["Tất cả", "Nam", "Nữ"],
      dateList: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ],
      monthList: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ],
      rules: {
        content: [
          {
            required: true,
            message: "Nội dung không được để trống",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "Đối tượng không được để trống",
            trigger: "change",
          },
        ],
        title: [
          {
            required: true,
            message: "Tiêu đề không được để trống",
            trigger: "change",
          },
        ],
        date: [
          {
            required: true,
            message: "Ngày không được để trống",
            trigger: "change",
          },
        ],
        month: [
          {
            required: true,
            message: "Tháng không được để trống",
            trigger: "change",
          },
        ],
        gender: [
          {
            required: true,
            message: "Giới tính không được để trống",
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
        this.$refs["newCelebrateSample"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      // this.handleRemove();
      this.$refs.upload.clearFiles();
      this.handleRemove();
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["newCelebrateSample"].resetFields();
    },
    /**
     * click change image
     */
    handleChangeUpload(file) {
      this.beforeAvatarUpload(file);
      this.showUpload = !this.showUpload;
      this.imageUrl = file.raw;
    },
    /**
     * remove image
     */
    handleRemove() {
      setTimeout(() => {
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
        this.$message.error("Bạn phải chọn dạng ảnh");
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
          let inputData = this.newCelebrateSample;
          let formDatas = new FormData();
          for (let key in inputData) {
            formDatas.append(key, inputData[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFile", this.imageUrl);
          }
          SchoolConfigService.createCelebrateSample(formDatas)
            .then((response) => {
              let data = response.data.data;
              console.log(data);
              this.$message({
                message: "Thêm mới ngày lễ thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới ngày lễ thất bại",
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>