<template>
  <el-dialog
    title="Thêm brand từ nhà cung cấp"
    :visible.sync="dialogVisible"
    width="45%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="140px"
      :model="newBrand"
      label-position="left"
      :rules="rules"
      ref="newBrand"
    >
      <el-form-item label="Chọn nhà cung cấp" prop="idSupplier">
        <el-select
          class="select-grade"
          v-model="newBrand.idSupplier"
          clearable
          style="width: 100%"
          placeholder="Chọn nhà cung cấp"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :value="item.id"
            :label="item.supplierName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Tên brand" prop="brandName">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="newBrand.brandName"
          placeholder="Nhập tên brand"
        ></el-input>
      </el-form-item>

      <el-form-item label="Loại brand" prop="brandtype">
        <el-checkbox :label="true" v-model="newBrand.brandTypeCskh">CSKH</el-checkbox>
        <el-checkbox :label="true" v-model="newBrand.brandTypeAds">Quảng cáo</el-checkbox>
      </el-form-item>

      <el-form-item label="Ghi chú" prop="supplierNote">
        <el-input
          :rows="2"
          type="textarea"
          autosize
          v-model="newBrand.note"
          placeholder="Nhập ghi chú"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('newBrand')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button type="success" size="medium" mini @click="submitForm('newBrand')">
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
      supplierList: [],
      newBrand: {
        idSupplier: "",
        brandName: "",
        brandTypeCskh: "",
        brandTypeAds: "",
        note: "",
      },
      radio: "",
      radio1: "",
      newBrandCreated: null,
      loadingButton: false,
      rules: {
        idGrade: [
          {
            required: true,
            message: "Đại lý không được để trống",
            trigger: "change",
          },
        ],
        brandName: [
          {
            required: true,
            message: "Brand name không được để trống",
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
        this.$refs["newBrand"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      (this.newBrand.brandTypeCskh = ""),
        (this.newBrand.brandTypeAds = ""),
        (this.newBrand.note = ""),
        setTimeout(() => {
          this.$refs[fromData].resetFields();
        }, 300);
    },
    resetFormData() {
      this.$refs["newBrand"].resetFields();
    },

    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          // this.loadingButton = true;
          BrandNameService.createBrand(this.newBrand)
            .then((response) => {
              this.newBrandCreated = response.data.data;
              this.$message({
                message: "Thêm mới brand thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
                this.resetFormData(FormData);
                // location.reload();
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới brand thất bại",
                type: "error",
              });
              console.log(err);
            })
            .finally(() => {
              setTimeout(() => {
                // this.loadingButton = true;
              }, 500);
            });
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getAllSupplierInitial() {
      BrandNameService.getAll().then((resp) => {
        this.supplierList = resp.data.data.supplierResponses;
        console.log(this.supplierList);
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
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
