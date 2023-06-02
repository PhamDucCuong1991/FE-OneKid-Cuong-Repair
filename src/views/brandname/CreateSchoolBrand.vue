<template>
  <el-dialog
    title="Thêm brand cho trường"
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
      <el-form-item label="Tên trường" prop="schoolName">{{
        editGrade.schoolName
      }}</el-form-item>
      <!-- chon brand -->
      <el-form-item label="Chọn brand" prop="idBrand">
        <el-select
          v-model="editGrade.brand"
          class="select-grade"
          clearable
          style="width: 100%"
          placeholder="Chọn brand"
        >
          <el-option
            v-for="item in brandnamelist"
            :key="item.id"
            :value="item.id"
            :label="item.brandName"
          ></el-option>
        </el-select>
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
  },
  data() {
    return {
      editGrade: {},
      updateBrand: {
        id: "",
        idBrand: "",
      },
      brandnamelist: [],
      input: "",
      newGradeUpdated: null,
      loadingButton: false,
      rules: {},
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
      }, 300);
    },
    getAllBrand(row) {
      this.editGrade = row;
      BrandNameService.getBrandForSchool(row.id).then((resp) => {
        this.brandnamelist = resp.data.data;
        console.log(this.brandnamelist);
      });
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.updateBrand.id = this.editGrade.id;
          this.updateBrand.idBrand = this.editGrade.brand;
          BrandNameService.updateSchoolbrand(this.editGrade.id, this.updateBrand)
            .then((response) => {
              this.newGradeUpdated = response.data.data;
              this.$message({
                message: "Cập nhật brand cho trường thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Cập nhật brand cho trường thất bại",
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
