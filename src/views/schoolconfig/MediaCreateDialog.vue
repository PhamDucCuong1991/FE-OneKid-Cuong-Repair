<template>
  <el-dialog
    title="Thêm mới Media Link"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="120px"
      :model="mediaData"
      label-position="left"
      :rules="rules"
      ref="mediaData"
    >
      <el-form-item label="Tên media" prop="mediaName">
        <el-input v-model="mediaData.mediaName" placeholder="Nhập tên mô tả"></el-input>
      </el-form-item>
      <el-form-item label="Media Link" prop="linkMedia">
        <el-input v-model="mediaData.linkMedia" placeholder="nhập media link"></el-input>
      </el-form-item>
      <el-form-item label="Loại" prop="mediaType" style="display: inline-block;">
        <el-select v-model="mediaData.mediaType" placeholder="Chọn loại">
          <el-option
            v-for="item in mediaTypeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Phạm vi" prop="scopeType" style="display: inline-block; float: right">
        <el-select v-model="mediaData.scopeType" placeholder="Chọn phạm vi">
          <el-option
            v-for="item in mediaScopeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Kích hoạt" prop="mediaActive">
        <el-radio-group v-model="mediaData.mediaActive">
          <el-radio :label="true">Có</el-radio>
          <el-radio :label="false">Không</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input type="textarea" v-model="mediaData.note" :rows="3" placeholder="Nhập ghi chú"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('mediaData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('mediaData')"
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
      mediaData: {
        mediaActive: true,
      },
      loadingButton: false,
      mediaTypeList: [
        { key: "Video", value: "Video" },
        { key: "Facebook", value: "Facebook" },
        { key: "Khác", value: "Khác" },
      ],
      mediaScopeList: [
        { key: "Trường", value: "Trường" },
        { key: "Lớp", value: "Lớp" },
      ],
      rules: {
        mediaName: [
          {
            required: true,
            message: "Tên mô tả không được để trống",
            trigger: "blur",
          },
        ],
        linkMedia: [
          {
            required: true,
            message: "Media Link không được để trống",
            trigger: "blur",
          },
        ],
        mediaType: [
          {
            required: true,
            message: "Loại không được để trống",
            trigger: "change",
          },
        ],
        scopeType: [
          {
            required: true,
            message: "Phạm vi không được để trống",
            trigger: "change",
          },
        ],
        mediaActive: [
          {
            required: true,
            message: "Kích hoạt không được để trống",
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
      setTimeout(() => {
        this.$refs["mediaData"].resetFields();
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
      this.$refs["mediaData"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SchoolConfigService.createMedia(this.mediaData)
            .then((response) => {
              let data = response.data.data;
              console.log(data);
              this.$message({
                message: "Thêm mới Media Link thành công",
                type: "success",
              });

              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới Media Link thất bại",
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
  padding-bottom: 0;
}
</style>