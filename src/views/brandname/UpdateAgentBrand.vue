<template>
  <el-dialog
    title="Cập nhật nhà cung cấp brand"
    :visible.sync="dialogVisible"
    width="45%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="140px"
      :model="editGrade"
      label-position="left"
      :rules="rules"
      ref="editGrade"
    >
      <!-- <el-form-item label="Chọn nhà cung cấp" prop="abc">
        <el-select v-model="value" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
<!-- 
      <el-form-item label="Tên nhà cung cấp" prop="supplierNameShow">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="editGrade.supplierNameShow"
          placeholder="Nhập tên nhà cung cấp"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="Brand name" prop="brandName">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="editGrade.brandName"
          placeholder="Nhập brand name"
        ></el-input>
      </el-form-item>

      <el-form-item prop="brandType" label="Loại brand name">
        <el-checkbox :label="true" v-model="editGrade.brandTypeCskh">CSKH</el-checkbox>
        <el-checkbox :label="true" v-model="editGrade.brandTypeAds">Quảng cáo</el-checkbox>
      </el-form-item>

      <el-form-item label="Ghi chú" prop="note">
        <el-input
          :rows="2"
          type="textarea"
          autosize
          v-model="editGrade.note"
          placeholder="Nhập ghi chú"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('editGrade')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('editGrade')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import BrandNameService from "@/services/BrandNameService";
export default {
  props: {
    dialogVisible: null,
    editGrade: null,
  },
  data() {
    return {
      supplierList: [],
      input: "",
      radio: "",
      radio1: "",
      brandActive: "",
      brandTypeCskh: "",
      brandTypeAds: "",
      newGradeUpdated: null,
      loadingButton: false,
      rules: {
        supplierName: [
          {
            required: true,
            message: "Tên nhà cung cấp không được để trống",
            trigger: "blur",
          },
        ],
        brandName: [
          {
            required: true,
            message: "Link connect không được để trống",
            trigger: "blur",
          },
        ],
        usernameLink: [
          {
            required: true,
            message: "Username không được để trống",
            trigger: "blur",
          },
        ],

        passwordLink: [
          {
            required: true,
            message: "Password không được để trống",
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
        this.$refs["editGrade"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
        location.reload();
      }, 300);
    },

    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          BrandNameService.updatebrand(this.editGrade.id, this.editGrade)
            .then((response) => {
              this.newGradeUpdated = response.data.data;
              this.$message({
                message: "Cập nhật nhà cung cấp thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Cập nhật nhà cung cấp thất bại",
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
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
.username {
  float: left;
}
.thanh {
  float: right;
  margin-top: -60px;
}
.password {
  float: right;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
</style>