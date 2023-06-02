<template>
  <el-dialog
    title="Cập nhật Camera"
    :visible.sync="dialogVisible"
    width="1000px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="120px"
      :model="cameraData"
      label-position="left"
      :rules="rules"
      ref="cameraData"
    >
      <el-form-item label="Camera name" prop="camName">
        <el-input
          v-model="cameraData.camName"
          clearable
          placeholder="Nhập tên camera"
        ></el-input>
      </el-form-item>
      <el-form-item label="DVR Name" prop="idDvrcamera">
        <el-select
          v-model="cameraData.idDvrcamera"
          placeholder="Chọn DVR Name"
          style="width: 100%"
          @change="changeDvrcamera()"
        >
          <el-option
            v-for="item in dvrcameraList"
            :key="item.id"
            :value="item.id"
            :label="item.dvrType + ' - ' + item.dvrName + ' - ' + item.linkDvr"
          >
            <span
              >{{ item.dvrType }}&nbsp;-&nbsp;{{ item.dvrName }}&nbsp;-&nbsp;{{
                item.linkDvr
              }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Camera chanel"
        prop="camChanel"
        style="width: 45%; display: inline-block"
      >
        <el-input
          v-model.trim="cameraData.camChanel"
          placeholder="Nhập Camera chanel"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Camera stream"
        prop="camStream"
        style="width: 45%; display: inline-block; float: right"
      >
        <el-input
          v-model.trim="cameraData.camStream"
          placeholder="Nhập Camera stream"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="OneCam chanel"
        prop="camChanelOneCam"
        style="width: 45%; display: inline-block"
      >
        <el-input
          v-model.trim="cameraData.camChanelOneCam"
          placeholder="Nhập OneCam chanel"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="OneCam stream"
        prop="camStreamOneCam"
        style="width: 45%; display: inline-block; float: right"
      >
        <el-input
          v-model.trim="cameraData.camStreamOneCam"
          placeholder="Nhập OneCam stream"
        ></el-input>
      </el-form-item>
      <el-form-item label="Kích hoạt" prop="camActive">
        <el-radio-group v-model="cameraData.camActive">
          <el-radio :label="true">Có</el-radio>
          <el-radio :label="false">Không</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Link Camera" prop="linkCam">
        <el-input
          type="textarea"
          autosize
          v-if="checkDisableLinkCam"
          v-model.trim="cameraData.linkCam"
          placeholder="Nhập link camera"
        ></el-input>
        <el-input
          type="textarea"
          autosize
          v-else
          disabled
          v-model.trim="changeData"
          placeholder="Nhập link camera"
        ></el-input>
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input
          type="textarea"
          v-model="cameraData.note"
          :rows="3"
          placeholder="Nhập ghi chú"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('cameraData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('cameraData')"
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
      cameraData: {
        camActive: true,
        idDvrcamera: "",
        camChanel: "",
        camStream: "",
      },
      loadingButton: false,
      dvrcameraList: [],
      dvrCameraData: {},
      checkDisableLinkCam: true,
      rules: {
        camName: [
          {
            required: true,
            message: "Tên mô tả không được để trống",
            trigger: "blur",
          },
        ],
        linkCam: [
          {
            required: true,
            message: "Media Link không được để trống",
            trigger: "blur",
          },
        ],
        idDvrcamera: [
          {
            required: true,
            message: "DVR Name không được để trống",
            trigger: "change",
          },
        ],
        camChanel: [
          {
            required: true,
            message: "Camera chanel không được để trống",
            trigger: "blur",
          },
        ],
        camStream: [
          {
            required: true,
            message: "Camera strem không được để trống",
            trigger: "blur",
          },
        ],
        camActive: [
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
        let channel = "?channel=" + this.cameraData.camChanel;
        let stream = "&subtype=" + this.cameraData.camStream;
        return this.cameraData.linkCam + "/cam/realmonitor" + channel + stream;
      } else if (this.dvrCameraData.dvrType == "Hix") {
        let channel = "/Streaming/channels/" + this.cameraData.camChanel;
        let stream = "0" + this.cameraData.camStream;
        return this.cameraData.linkCam + channel + stream;
      } else if (this.dvrCameraData.dvrType == "Xmeye") {
        let channel = "&channel=" + this.cameraData.camChanel;
        let stream = "&stream=" + this.cameraData.camStream + ".sdp?";
        return this.cameraData.linkCam + channel + stream;
      } else {
        return "";
      }
    },
    changeDataInput() {
      if (this.dvrCameraData.dvrType == "Dahua") {
        let channel = "?channel=" + this.cameraData.camChanel;
        let stream = "&subtype=" + this.cameraData.camStream;
        return channel + stream;
      } else if (this.dvrCameraData.dvrType == "Hix") {
        let channel = "/Streaming/channels/" + this.cameraData.camChanel;
        let stream = "0" + this.cameraData.camStream;
        return channel + stream;
      } else if (this.dvrCameraData.dvrType == "Xmeye") {
        let channel = "&channel=" + this.cameraData.camChanel;
        let stream = "&stream=" + this.cameraData.camStream + ".sdp?";
        return channel + stream;
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
        this.$refs["cameraData"].resetFields();
        this.dvrCameraData.dvrType = "";
        this.checkDisableLinkCam = true;
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
        this.dvrCameraData.dvrType = "";
        this.checkDisableLinkCam = true;
      }, 300);
    },
    resetFormData() {
      this.$refs["cameraData"].resetFields();
    },
    changeDvrcamera() {
      let idDvr = this.cameraData.idDvrcamera;
      if (idDvr != "") {
        this.dvrCameraData = this.dvrcameraList.filter((x) => x.id == idDvr)[0];
        if (this.dvrCameraData.dvrType == "Khác") {
          this.checkDisableLinkCam = true;
        } else {
          this.cameraData.linkCam = this.dvrCameraData.linkDvr;
          this.checkDisableLinkCam = false;
        }
      }
    },
    submitForm(fromData) {
      let dataSubmit = this.cameraData;
      if (!this.checkDisableLinkCam) {
        //loại có sẵn
        dataSubmit.linkCam = this.changeDataInput;
      }

      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SchoolConfigService.updateCamera(dataSubmit)
            .then((response) => {
              let data = response.data.data;
              console.log(data);
              this.$message({
                message: "Cập nhật Camera thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Cập nhật Camera thất bại",
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
    getCameraUpdateInitial(row) {
      this.cameraData = row;
      this.cameraData.idDvrcamera = row.dvrCamera.id;
      this.changeDvrcamera();
    },
    /**
     * tìm kiếm tất cả đầu ghi
     */
    findAllDvrCameraMethodInitial(row) {
      SchoolConfigService.findAllDvrCamera()
        .then((resp) => {
          this.dvrcameraList = resp.data.data;
          this.getCameraUpdateInitial(row);
        })
        .catch((err) => {
          console.log(err);
          this.dvrcameraList = null;
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
/deep/.el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
  background: #e7e9ec;
  border: 1px solid #dcdfe6;
}
</style>
