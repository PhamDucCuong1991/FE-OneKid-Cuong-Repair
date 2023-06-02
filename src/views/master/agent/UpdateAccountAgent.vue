<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
      title="Cập nhật tài khoản đại lý"
      border
    >
      <el-form
        label-width="140px"
        :model="updateTabAgent"
        label-position="left"
        :rules="rules"
        ref="updateTabAgent"
      >
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Username" prop="maUser.username">
                <el-input
                  clearable
                  v-model.trim="updateTabAgent.maUser.username"
                  placeholder="Nhập username"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Password" prop="maUser.passwordShow">
                <el-input
                  clearable
                  v-model.trim="updateTabAgent.maUser.passwordShow"
                  placeholder="Nhập password"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Họ tên" prop="fullName">
                <el-input clearable v-model="updateTabAgent.fullName" placeholder="Nhập họ tên"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Ngày sinh" prop="birthDay">
                <el-date-picker
                  v-model="updateTabAgent.birthDay"
                  format="dd-MM-yyyy"
                   :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày sinh"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Số điện thoại" prop="phone">
                <el-input
                  clearable
                  type="number"
                  v-model="updateTabAgent.phone"
                  placeholder="Nhập số điện thoại"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="Email" prop="email" align="right">
                <el-input v-model="updateTabAgent.email" placeholder="Nhập email"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item prop="gender" label="Giới tính">
                <el-radio-group v-model="updateTabAgent.gender">
                  <el-radio label="Nam">Nam</el-radio>
                  <el-radio style="margin-left:30px" label="Nữ">Nữ</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Ghi chú" prop="note">
                <el-input
                  v-model="updateTabAgent.note"
                  type="textarea"
                  :rows="3"
                  style="width:100%"
                  placeholder="Nhập ghi chú"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="tab-infor-button">
          <el-button type="danger" size="medium" @click="closeDialogByButton('updateTabAgent')">
            <i class="el-icon-circle-close" />
            <span>Đóng</span>
          </el-button>
          <el-button
            type="success"
            size="medium"
            :loading="loadingButton"
            mini
            @click="submitForm('updateTabAgent')"
            v-if="!statusView"
          >
            <i class="el-icon-circle-check" />
            <span>Lưu</span>
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import AgentService from "@/services/AgentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      updateTabAgent: {},
      updateTabAccounAgent: {},
      statusView: "",
      agentList: [],
      rules: {
        maUser: {
          username: [
            {
              required: true,
              message: "Username không được để trống",
              trigger: "blur",
            },
            {
              pattern: /^[a-zA-Z0-9@.]*$/,
              message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
              trigger: "blur",
            },
            {
              min: 6,
              message: "Username lớn hơn hoặc bằng 6 ký tự",
              trigger: "blur",
            },
          ],
           pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
          passwordShow: [
            {
              required: true,
              message: "Password không được để trống",
              trigger: "blur",
            },
            {
              pattern: /^[a-zA-Z0-9@.]*$/,
              message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
              trigger: "blur",
            },
            {
              min: 6,
              message: "Password lớn hơn hoặc bằng 6 ký tự",
              trigger: "blur",
            },
          ],
        },

        phone: [
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "blur",
          },
        ],
        fullName: [
          {
            required: true,
            message: "Họ tên không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.$refs["updateTabAgent"].resetFields();
      this.$emit("dialog-close");
    },
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let updateData = this.updateTabAgent;
          AgentService.updateAccountAgent(updateData)
            .then(() => {
              this.$message({
                message: "Cập nhật tài khoản đại lý thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              let textError = err.response.data.error;
              if (textError == "Đã tồn tại username và apptype tương ứng") {
                this.$message({
                  message: "Username đã tồn tại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Cập nhật tài khoản đại lý thất bại",
                  type: "error",
                });
              }
              console.log(err);
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        }
      });
    },
    getDataInitial(row) {
      this.updateTabAgent = row;
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
/deep/.el-button--primary {
  width: 100%;
  background: #409eff;
}
/deep/.upload-demo {
  text-align: center;
  .el-upload {
    width: 100%;
  }
}
/deep/.el-avatar {
  display: inline;
  img {
    border-radius: 5px;
    width: 100%;
  }
}
/deep/.el-input.is-disabled .el-input__inner {
  text-align: center;
  color: #d13b93;
  font-weight: bold;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.el-select {
  display: block;
}

.tab-infor-button {
  text-align: right;
  margin-top: 20px;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.group-radio-status {
  margin: 0 50px;
  .kids-status {
    margin-bottom: 10px;
  }
}
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #67c23a;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
.table-icon-1 {
  width: 30%;
  margin-left: 15%;
  display: inline-block;
}
.table-icon-2 {
  width: 30%;
  margin-right: 15%;
  float: right;
}
</style>