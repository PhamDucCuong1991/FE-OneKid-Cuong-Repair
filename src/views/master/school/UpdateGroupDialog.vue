<template>
  <el-dialog
    title="Cập nhật nhóm cho trường"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Chọn nhóm" prop="groupType">
        <el-select v-model="dataInput.groupType" placeholder="Chọn nhóm" style="width: 80%">
          <el-option
            v-for="item in groupList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('dataInput')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('dataInput')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SchoolService from "@/services/SchoolService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {
        idList: [],
        groupType: "",
      },
      groupList: ["A", "B", "C", "D"],
      loadingButton: false,
      rules: {
        groupType: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "",
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
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SchoolService.updateGroupTypeService(this.dataInput)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
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
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getDataInitial(idList) {
      this.dataInput.idList = idList;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
