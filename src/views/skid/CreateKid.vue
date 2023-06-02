<template>
  <el-dialog
    title="Thêm mới kid"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="newKid"
      label-position="left"
      :rules="rules"
      ref="newKid"
    >
      <el-form-item label="Tên học sinh" prop="fullName">
        <el-input
          v-model="newKid.fullName"
          placeholder="Nhập tên học sinh"
        ></el-input>
      </el-form-item>
      <el-form-item label="Tuổi học sinh" prop="age">
        <el-input
          v-model="newKid.age"
          placeholder="Nhập tuổi học sinh"
        ></el-input>
      </el-form-item>
      <el-form-item label="Địa chỉ học sinh" prop="address">
        <el-input
          v-model="newKid.address"
          placeholder="Nhập địa chỉ học sinh"
        ></el-input>
      </el-form-item>
      <el-form-item label="SĐT học sinh" prop="phone">
        <el-input
          v-model="newKid.phone"
          placeholder="Nhập SĐT học sinh"
        ></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('newKid')">
        <i class="el-icon-circle-close" />
        <span>{{$t('button.close')}}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('newKid')"
      >
        <i class="el-icon-circle-check" />
        <span>{{$t('button.save')}}</span>
      </el-button>
    </span>
  </el-dialog>
</template>


<script>
import KidService from "@/services/KidService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      newKid: {
        fullName: "",
        age: "",
        address: "",
        phone: "",
      },
      loadingButton: false,
      rules: {
        fullName: [
          {
            required: true,
            message: "Tên học sinh không được để trống",
            trigger: "blur",
          },
        ],
        age: [
          {
            required: true,
            message: "Tuổi học sinh không được để trống",
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
        this.$refs["newKid"].resetFields();
      }, 300);
    },
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    submitForm(fromData){
        this.$refs[fromData].validate((valid) => {
        if (valid) {
          KidService.create(this.newKid)
            .then((response) => {
              let data = response.data.data;
              console.log(data);
              this.$message({
                message: "Thêm mới khối thành công",
                type: "success",
              });

              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới khối thất bại",
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
    }
  }
}
</script>