<template>
  <el-dialog
    title="Thêm Brand Name cho trường"
    :visible.sync="dialogVisible"
    width="45%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="140px"
      :model="newAgentBrand"
      label-position="left"
      :rules="rules"
      ref="newAgentBrand"
    >
      <el-form-item label="Chọn trường" prop="idSchool">
        <el-select
          class="select-grade"
          v-model="newAgentBrand.idSchool"
          clearable
          style="width:100%"
          placeholder="Chọn nhà cung cấp"
        >
          <el-option
            v-for="item in schoollista"
            :key="item.id"
            :value="item.id"
            :label="item.schoolName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Chọn brand" prop="idBrand">
        <el-select
          class="select-grade"
          v-model="newAgentBrand.idBrand"
          clearable
          style="width:100%"
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

      <el-form-item  label="Kích hoạt" prop="parentInfo.representation">
        <el-radio-group>
          <el-radio  :label="true">Có</el-radio>
          <el-radio  :label="false">Không</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('newAgentBrand')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('newAgentBrand')"
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
      schoollista: [],
      brandnamelist: [],
      newAgentBrand: {
        idSupplier: "",
        idBrand: "",
        brandActive: "",
      },
      radio: "1",
      newAgentBrandCreated: null,
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
        this.$refs["newAgentBrand"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },

    // //kích hoạt tính năng nhận sms cho một học sinh
    // activeOneSMSMethod(index, row) {
    //   this.dataOneActiveSMS.id = row.id;
    //   let handleUpdate = (this.dataOneActiveSMS.checkOneActiveSMS =
    //     row.smsReceive);
    //   BrandNameService.updateOneActiveSMS(this.dataOneActiveSMS)
    //     .then(() => {
    //       if (handleUpdate) {
    //         this.$message({
    //           message: "Kích hoạt thành công",
    //           type: "success",
    //         });
    //       } else {
    //         this.$message({
    //           message: "Hủy kích hoạt thành công",
    //           type: "success",
    //         });
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       if (handleUpdate) {
    //         this.$message({
    //           message: "Kích hoạt thất bại",
    //           type: "error",
    //         });
    //       } else {
    //         this.$message({
    //           message: "Hủy kích hoạt thất bại",
    //           type: "error",
    //         });
    //       }
    //     });
    // },
    resetFormData() {
      this.$refs["newAgentBrand"].resetFields();
    },

    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          BrandNameService.createBrand(this.newClass)
            .then((response) => {
              this.newAgentBrandCreated = response.data.data;
              this.$message({
                message: "Thêm mới brand từ nhà cung cấp thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới brand từ nhà cung cấp thất bại",
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
    getAllSupplierInitial() {
      BrandNameService.getAll().then((resp) => {
        this.schoollista = resp.data.data.schoolList;
        console.log(this.schoollista);
      });
    },

    getAllBrandNameInitial() {
      BrandNameService.getAllBrandName().then((resp) => {
        this.brandnamelist = resp.data.data.brandResponses;
        console.log(this.brandnamelist);
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