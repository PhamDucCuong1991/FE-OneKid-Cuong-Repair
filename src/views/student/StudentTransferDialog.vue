<template>
  <el-dialog
    :title="'Thông tin đưa đón: ' + fullName + ' - ' + className"
    :visible.sync="dialogVisible"
    width="1200px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-row :gutter="20">
      <el-col :span="3">
        <el-image
          v-if="dataInput.url != null && showPicutreInitial"
          style="width: 150px; height: 150px; float: left; margin-bottom: 10px"
          :src="dataInput.url"
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
          <span>
            <i class="el-icon-plus" style="font-size: 20px">
              <span v-if="dataInput.url == null">Thêm ảnh</span>
              <span v-else> Cập nhật ảnh</span>
            </i>
          </span>
        </el-upload>
      </el-col>
      <el-col :span="2" style="margin-left: 20px">
        <div style="height: 150px; line-height: 70px">
          <el-checkbox v-model="dataInput.inStatus">Đưa</el-checkbox>
          <el-checkbox v-model="dataInput.outStatus">Đón</el-checkbox>
        </div>
      </el-col>
      <el-col :span="18">
        <el-form
          label-width="100px"
          :model="dataInput"
          label-position="left"
          :rules="rules"
          ref="dataInput"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Họ tên" prop="fullName">
                <el-input v-model="dataInput.fullName"></el-input>
              </el-form-item>
              <el-form-item label="Số điện thoại" prop="phone">
                <el-input v-model="dataInput.phone"></el-input>
              </el-form-item>
              <el-form-item label="Số định danh" prop="identify">
                <el-input v-model="dataInput.identify"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Quan hệ" prop="relationship">
                <el-input v-model="dataInput.relationship"></el-input>
              </el-form-item>
              <el-form-item label="Ghi chú" prop="note">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="dataInput.note"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import StudentService from "@/services/StudentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      showUpload: true,
      showPicutreInitial: true,
      imageUrl: "",
      fullName: "",
      className: "",
      dataInput: {
        id: null,
        idKid: "",
        inStatus: false,
        outStatus: false,
        fullName: "",
        phone: "",
        identify: "",
        relationship: "",
        note: "",
        url: null,
      },
      rules: {
        fullName: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.dataInput.inStatus = false;
        this.dataInput.outStatus = false;
        this.dataInput.url = null;
        this.handleRemove();
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.raw.size / 1024 / 1024 <= 5;
      if (!isJPG && !isPNG) {
        this.$message.error("Bạn phải chọn định dạng ảnh");
        throw "file not valid";
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không được quá 5MB!");
        throw "over size";
      }
    },
    handleRemove() {
      setTimeout(() => {
        this.showPicutreInitial = true;
        this.showUpload = true;
        this.imageUrl = "";
      }, 800);
      this.$refs.upload.clearFiles();
    },
    handleChangeUpload(file) {
      this.beforeAvatarUpload(file);
      this.showPicutreInitial = false;
      this.showUpload = !this.showUpload;
      this.imageUrl = file.raw;
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let formDatas = new FormData();
          for (let key in this.dataInput) {
            formDatas.append(key, this.dataInput[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFile", this.imageUrl);
          }
          StudentService.kidsTransferCreateUpdate(formDatas)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialog();
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
    initialDataCreate(idKid, fullName, className) {
      this.fullName = fullName;
      this.className = className;
      this.dataInput = {
        id: "",
        idKid: idKid,
        inStatus: false,
        outStatus: false,
        fullName: "",
        phone: "",
        identify: "",
        relationship: "",
        note: "",
        url: null,
      };
    },
    initialDataUpdate(fullName, className, dataTransfer) {
      this.fullName = fullName;
      this.className = className;
      this.dataInput = dataTransfer;
    },
  },
};
</script>

<style >
.hideUpload > div {
  display: none;
}
.input-class {
  width: 200px;
  margin-right: 15px;
}
.text-class {
  margin-right: 10px;
}
</style>
