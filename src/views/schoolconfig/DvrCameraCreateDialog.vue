<template>
  <el-dialog
    title="Thêm mới đầu ghi"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      label-width="140px"
      :model="dvrCameraData"
      label-position="left"
      :rules="rules"
      ref="dvrCameraData"
    >
      <el-form-item label="Tên đầu ghi" prop="dvrName">
        <el-input
          v-model="dvrCameraData.dvrName"
          placeholder="Nhập tên đầu ghi"
        ></el-input>
      </el-form-item>
      <el-form-item label="Loại đầu ghi" prop="dvrType">
        <el-radio-group v-model="dvrCameraData.dvrType">
          <el-radio label="Dahua">Dahua</el-radio>
          <el-radio label="Hix">Hix</el-radio>
          <el-radio label="Xmeye">Xmeye</el-radio>
          <el-radio label="Khác">Khác</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="Tài khoản đầu ghi"
        prop="adminDvrAcc"
        style="display: inline-block; width: 45%"
      >
        <el-input
          v-model.trim="dvrCameraData.adminDvrAcc"
          placeholder="Nhập tài khoản đầu ghi"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Mật khẩu"
        prop="adminDvrPassword"
        style="display: inline-block; width: 45%; float: right"
      >
        <el-input
          v-model.trim="dvrCameraData.adminDvrPassword"
          placeholder="Nhập mật khẩu"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Tên miền"
        prop="schoolDomain"
        style="width: 45%; display: inline-block"
      >
        <el-input
          v-model.trim="dvrCameraData.schoolDomain"
          placeholder="Nhập tên miền"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Port"
        prop="camPort"
        style="width: 45%; display: inline-block; float: right"
      >
        <el-input
          v-model="dvrCameraData.camPort"
          type="number"
          placeholder="Nhập port"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Device SN"
        prop="deviceSN"
        style="width: 45%; display: inline-block"
      >
        <el-input
          v-model="dvrCameraData.deviceSN"
          placeholder="Nhập số Serial Number thiết bị"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="PortDVR"
        prop="portDVR"
        style="width: 45%; display: inline-block; float: right"
      >
        <el-input v-model="dvrCameraData.portDVR" placeholder="Nhập Port DVR"></el-input>
      </el-form-item>
      <el-form-item label="Link DVR" prop="linkDvr">
        <el-input
          v-if="dvrCameraData.dvrType == 'Khác'"
          v-model.trim="dvrCameraData.linkDvr"
          placeholder="Nhập link DVR"
        ></el-input>
        <el-input
          v-else
          disabled
          v-model.trim="changeData"
          placeholder="Nhập link DVR"
        ></el-input>
      </el-form-item>
      <el-form-item label="IP local" prop="ipLocal">
        <el-input
          v-model.trim="dvrCameraData.ipLocal"
          placeholder="Nhập IP local"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Tài khoản modem"
        prop="modemAcc"
        style="display: inline-block; width: 45%"
      >
        <el-input
          v-model.trim="dvrCameraData.modemAcc"
          placeholder="Nhập tài khoản modem"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Mật khẩu"
        prop="modemPass"
        style="display: inline-block; width: 45%; float: right"
      >
        <el-input
          v-model.trim="dvrCameraData.modemPass"
          placeholder="Nhập mật khẩu modem"
        ></el-input>
      </el-form-item>
      <el-form-item label="Kích hoạt" prop="dvrActive">
        <el-radio-group v-model="dvrCameraData.dvrActive">
          <el-radio :label="true">Có</el-radio>
          <el-radio :label="false">Không</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input
          type="textarea"
          v-model="dvrCameraData.note"
          :rows="3"
          placeholder="Nhập ghi chú"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('dvrCameraData')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('dvrCameraData')"
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
      dvrCameraData: {
        dvrName: "",
        dvrActive: true,
        dvrType: "Khác",
        adminDvrAcc: "",
        adminDvrPassword: "",
        schoolDomain: "",
        camPort: "",
        linkDvr: "",
        note: "",
        deviceSN: "",
        portDVR: "",
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
        dvrName: [
          {
            required: true,
            message: "Tên đầu ghi không được để trống",
            trigger: "blur",
          },
        ],
        dvrType: [
          {
            required: true,
            message: "Loại đầu ghi không được để trống",
            trigger: "change",
          },
        ],
        adminDvrAcc: [
          {
            required: true,
            message: "Tài khoản đầu ghi không được để trống",
            trigger: "blur",
          },
        ],
        adminDvrPassword: [
          {
            required: true,
            message: "Mật khẩu không được để trống",
            trigger: "blur",
          },
        ],
        camPort: [
          {
            required: true,
            message: "Port không được để trống",
            trigger: "blur",
          },
        ],
        schoolDomain: [
          {
            required: true,
            message: "Tên miền không được để trống",
            trigger: "blur",
          },
        ],
        linkDvr: [
          {
            required: true,
            message: "Link DVR không được để trống",
            trigger: "blur",
          },
        ],
        dvrActive: [
          {
            required: true,
            message: "Kích hoạt không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    changeData() {
      if (this.dvrCameraData.dvrType == "Dahua") {
        return (
          "rtsp://" +
          this.dvrCameraData.adminDvrAcc +
          ":" +
          this.dvrCameraData.adminDvrPassword +
          "@" +
          this.dvrCameraData.schoolDomain +
          ":" +
          this.dvrCameraData.camPort +
          "/cam/realmonitor"
        );
      } else if (this.dvrCameraData.dvrType == "Hix") {
        return (
          "rtsp://" +
          this.dvrCameraData.adminDvrAcc +
          ":" +
          this.dvrCameraData.adminDvrPassword +
          "@" +
          this.dvrCameraData.schoolDomain +
          ":" +
          this.dvrCameraData.camPort
        );
      } else if (this.dvrCameraData.dvrType == "Xmeye") {
        return (
          "rtsp://" +
          this.dvrCameraData.schoolDomain +
          ":" +
          this.dvrCameraData.camPort +
          "/user=" +
          this.dvrCameraData.adminDvrAcc +
          "&password=" +
          this.dvrCameraData.adminDvrPassword
        );
      } else {
        return "";
      }
    },
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dvrCameraData"].resetFields();
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
      this.$refs["dvrCameraData"].resetFields();
    },
    submitForm(fromData) {
      if (this.dvrCameraData.dvrType != "Khác") {
        this.dvrCameraData.linkDvr = this.changeData;
      }
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SchoolConfigService.createDvrCamera(this.dvrCameraData)
            .then((response) => {
              let dataSubmit = response.data.data;
              console.log(dataSubmit);
              this.$message({
                message: "Thêm mới đầu ghi thành công",
                type: "success",
              });

              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới đầu ghi thất bại",
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
  padding-bottom: 0;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
  border: 1px solid #dcdfe6;
}
</style>
