<template>
  <el-dialog
    title="Sửa đối tượng"
    :visible.sync="dialogVisible"
    width="950px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="110px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Tên đối tượng" prop="name">
        <el-input
          v-model="dataInput.name"
          :disabled="dataInput.defaultStatus"
          placeholder="Nhập tên đối tượng"
        ></el-input>
      </el-form-item>

      <el-form-item label="Loại" prop="type" style="display: inline-block">
        <el-radio-group v-if="dataInput.defaultStatus" v-model="dataInput.type">
          <el-radio label="internal">Nhà trường</el-radio>
        </el-radio-group>

        <el-radio-group v-else v-model="dataInput.type">
          <el-radio label="internal">Nhà trường</el-radio>
          <el-radio label="external">Khác</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="Giới tính"
        prop="gender"
        style="display: inline-block; float: right; margin-right: 178px"
      >
        <el-radio-group v-model="dataInput.gender">
          <el-radio label="Nam">Nam</el-radio>
          <el-radio label="Nữ">Nữ</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Số điện thoại" prop="phone">
        <el-input
          v-model="dataInput.phone"
          style="width: 300px"
          placeholder="Nhập số điện thoại"
        ></el-input>
      </el-form-item>
      <div class="gender" style="float: right; margin-top: -65px">
        <el-form-item label="Ngày sinh" prop="birthday">
          <el-input
            v-model="dataInput.birthday"
            style="width: 300px"
            placeholder="Nhập ngày sinh"
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item label="Email" prop="email">
        <el-input
          v-model="dataInput.email"
          style="width: 300px"
          placeholder="Nhập email"
        ></el-input>
      </el-form-item>
      <div class="gender" style="float: right; margin-top: -65px">
        <el-form-item label="Số CMND" prop="number">
          <el-input
            v-model="dataInput.indentify"
            style="width: 300px"
            placeholder="Nhập số CMND"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="Địa chỉ" prop="address">
        <el-input
          :rows="2"
          type="textarea"
          v-model="dataInput.address"
          placeholder="Nhập địa chỉ"
        ></el-input>
      </el-form-item>

      <el-form-item label="Mô tả" prop="description">
        <el-input
          :rows="3"
          type="textarea"
          v-model="dataInput.description"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import CashInternalService from "@/services/CashInternalService";

export default {
  components: {},
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      dataInput: {
        name: "",
        phone: "",
        birthday: "",
        gender: "",
        email: "",
        indentify: "",
        type: "",
        address: "",
        description: "",
      },

      loadingButton: false,
      rules: {
        name: [
          {
            required: true,
            message: "Tên đối tượng không được để trống",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Loại đối tượng không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    dataInput: {
      deep: true,
    },
  },
  computed: {},
  methods: {
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          CashInternalService.updatePeopleType(this.dataInput)
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
              let messageText =
                err.response.status == 403
                  ? this.$permissionDenied
                  : err.response.data.message;
              this.$message({
                message: messageText,
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
    getDataInitial(id) {
      CashInternalService.getById(id)
        .then((resp) => {
          this.dataInput = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.$refs["dataInput"].resetFields();
      }, 300);
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
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
  border: 1px solid #dcdfe6;
}
.el-input-number {
  width: 100%;
}
</style>
