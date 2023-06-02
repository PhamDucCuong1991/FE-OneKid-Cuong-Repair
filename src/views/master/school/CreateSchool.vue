<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Thêm trường mới"
    >
      <el-form
        label-width="160px"
        :model="createTabSchool"
        label-position="left"
        :rules="rules"
        ref="createTabSchool"
      >
        <el-tabs v-model="activeTabName" type="card" @tab-click="handleClick">
          <el-tab-pane label="Thông tin" name="tabInfo">
            <el-form-item label="Tên trường" prop="schoolName">
              <el-input
                v-model="createTabSchool.schoolName"
                placeholder="Nhập tên trường"
              ></el-input>
            </el-form-item>
            <el-form-item label="Chọn đại lý" prop="idAgent">
              <el-select
                v-model="createTabSchool.idAgent"
                class="button-left"
                placeholder="Chọn đại lý"
                clearable
              >
                <el-option
                  v-for="item in agentListSearch"
                  :key="item.id"
                  :label="item.agentName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Mô tả" style="margin-top: 35px" prop="schoolDescription">
              <el-input
                :rows="7"
                type="textarea"
                v-model="createTabSchool.schoolDescription"
                placeholder="Nhập mô tả"
              ></el-input>
            </el-form-item>
            <el-form-item label="Địa chỉ" prop="schoolAddress">
              <el-input
                v-model="createTabSchool.schoolAddress"
                placeholder="Nhập địa chỉ"
              ></el-input>
            </el-form-item>

            <el-form-item label="Điện thoại" prop="schoolPhone" class="input-below">
              <el-input
                type="number"
                min="0"
                max="0"
                v-model.trim="createTabSchool.schoolPhone"
                placeholder="Nhập số điện thoại"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="schoolEmail" class="input-below">
              <el-input
                v-model.trim="createTabSchool.schoolEmail"
                placeholder="Nhập email"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="width: 290px; margin-left: 58px"
              label="Website"
              prop="schoolWebsite"
              class="input-below"
            >
              <el-input
                v-model="createTabSchool.schoolWebsite"
                placeholder="Nhập website"
              ></el-input>
            </el-form-item>
            <el-row :gutter="40">
              <el-col :span="7">
                <el-form-item label="Ảnh bìa" class="input-below">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="true"
                    list-type="picture-card"
                    :on-change="toggleUpload"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                    :class="{ hideUpload: !showUpload }"
                    limit="1"
                    ref="upload"
                  >
                    <span>
                      <i class="el-icon-plus avatar-uploader-icon">Thêm ảnh</i>
                    </span>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="17">
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      style="width: 85%"
                      label="Liên hệ 1"
                      prop="contactPhone1"
                      class="input-below"
                    >
                      <el-input
                        v-model.trim="createTabSchool.contactPhone1"
                        placeholder="Số điện thoại 1"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      style="width: 85%; padding-left: 0px"
                      label="Tên"
                      prop="contactName1"
                      class="input-below"
                    >
                      <el-input
                        v-model="createTabSchool.contactName1"
                        placeholder="Nhập nội dung"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      style="width: 85%"
                      label="Liên hệ 2"
                      prop="contactPhone2"
                      class="input-below"
                    >
                      <el-input
                        v-model.trim="createTabSchool.contactPhone2"
                        placeholder="Số điện thoại 2"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      style="width: 85%"
                      label="Tên"
                      prop="contactName2"
                      class="input-below"
                    >
                      <el-input
                        v-model="createTabSchool.contactName2"
                        placeholder="Nhập nội dung"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      style="width: 85%"
                      label="Liên hệ 3"
                      prop="contactPhone3"
                      class="input-below"
                    >
                      <el-input
                        v-model.trim="createTabSchool.contactPhone3"
                        placeholder="Số điện thoại 3"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      style="width: 85%"
                      label="Tên"
                      prop="contactName3"
                      class="input-below"
                    >
                      <el-input
                        v-model="createTabSchool.contactName3"
                        placeholder="Nhập nội dung"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Thiết lập">
            <el-form-item label="Dùng thử" prop="trialStatus">
              <el-checkbox v-model="createTabSchool.trialStatus"></el-checkbox>
            </el-form-item>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item label="Dùng thử từ" prop="demoStart">
                    <el-date-picker
                      :disabled="!createTabSchool.trialStatus"
                      v-model="createTabSchool.demoStart"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item label="Đến ngày" prop="demoEnd">
                    <el-date-picker
                      :disabled="!createTabSchool.trialStatus"
                      v-model="createTabSchool.demoEnd"
                      value-format="yyyy-MM-dd"
                      format="dd-MM-yyyy"
                      type="date"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item label="Ngày bắt đầu" prop="dateStart">
                    <el-date-picker
                      :disabled="createTabSchool.trialStatus"
                      v-model="createTabSchool.dateStart"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item label="Ngày hết hạn" prop="dateEnd">
                    <el-date-picker
                      :disabled="createTabSchool.trialStatus"
                      v-model="createTabSchool.dateEnd"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item label="Ngày ký HĐ" prop="dateContractStart">
                    <el-date-picker
                      v-model="createTabSchool.dateContractStart"
                      format="dd-MM-yyyy"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item label="Kết thúc HĐ" prop="dateContractEnd">
                    <el-date-picker
                      v-model="createTabSchool.dateContractEnd"
                      format="dd-MM-yyyy"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item
                    prop="limitTime"
                    label-width="230px"
                    label="Giới hạn thời gian"
                  >
                    <el-radio-group v-model="createTabSchool.limitTime">
                      <el-radio :label="true">Có</el-radio>
                      <el-radio style="margin-left: 38px" :label="false">Không</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item
                    label-width="230px"
                    prop="schoolActive"
                    label="Trạng thái"
                  >
                    <el-radio-group v-model="createTabSchool.schoolActive">
                      <el-radio :label="true">Kích hoạt</el-radio>
                      <el-radio :label="false">Hủy kích hoạt</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item
                    label-width="230px"
                    prop="limitDevice"
                    label="Giới hạn thiết bị"
                  >
                    <el-radio-group v-model="createTabSchool.limitDevice">
                      <el-radio :label="true">Có</el-radio>
                      <el-radio style="margin-left: 38px" :label="false">Không</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item
                    prop="numberDevice"
                    label-width="190px"
                    label="Số lượng thiết bị"
                  >
                    <el-input v-model="createTabSchool.numberDevice"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item
                    prop="smsActiveMore"
                    label-width="230px"
                    label="Sử dụng SMS"
                  >
                    <el-radio-group v-model="createTabSchool.smsActiveMore">
                      <el-radio :label="false">Mặc định</el-radio>
                      <el-radio :label="true">Vượt mức</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item
                    prop="smsBudget"
                    label-width="190px"
                    label="Mức SMS mặc định"
                  >
                    <el-input
                      type="number"
                      v-model="createTabSchool.smsBudget"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <div class="tab-infor-button">
            <el-button
              type="danger"
              size="medium"
              @click="closeDialogByButton('createTabSchool')"
            >
              <i class="el-icon-circle-close" />
              <span>Đóng</span>
            </el-button>
            <el-button
              type="success"
              size="medium"
              :loading="loadingButton"
              mini
              @click="submitForm('createTabSchool')"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tabs>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SchoolService from "@/services/SchoolService";
import AgentService from "@/services/AgentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      activeTabName: "tabInfo",
      agentListSearch: [],
      dialogImageUrl: "",
      disabled: false,
      fileList: [],
      fileAvatar: "",
      showUpload: true,
      dialogVisible1: false,
      src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",

      accountTypes: [],
      value: "",
      radiogender: "",
      appOptions: ["Sử dụng App Teacher", "Sử dụng App Plus"],
      options: [
        {
          value: "Độc thân",
          label: "Độc thân",
        },
        {
          value: "Đã kết hôn",
          label: "Đã kết hôn",
        },
      ],
      loadingButton: false,
      createTabSchool: {
        schoolName: "",
        schoolDescription: "",
        schoolAddress: "",
        schoolEmail: "",
        schoolPhone: "",
        schoolWebsite: "",
        contactName1: "",
        contactDescription1: "",
        contactPhone1: "",
        contactEmail1: "",
        contactName2: "",
        contactDescription2: "",
        contactPhone2: "",
        contactEmail2: "",
        contactName3: "",
        contactDescription3: "",
        contactPhone3: "",
        contactEmail3: "",
        schoolActive: true,
        smsBudget: 1000,
        smsBudgetDate: "",
        smsActiveMore: false,
        smsUsed: "",
        smsTotal: "",
        namePhone1: "",
        namePhone2: "",
        namePhone3: "",
        demoStart: "",
        demoEnd: "",
        dateContractStart: "",
        dateContractEnd: "",
        dateStart: "",
        dateEnd: "",
        limitTime: false,
        limitDevice: true,
        numberDevice: 2,
        idAgent: "",
        trialStatus: false,
      },
      rules: {
        schoolName: [
          {
            required: true,
            message: "Tên trường không được để trống",
            trigger: "blur",
          },
        ],
        idAgent: [
          {
            required: true,
            message: "Mời bạn chọn đại lý",
            trigger: "blur",
          },
        ],
        schoolPhone: [
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "change",
          },
        ],
        schoolAddress: [
          {
            required: true,
            message: "Địa chỉ không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleClick() {},
    resetFormData() {
      this.$refs["createTabSchool"].resetFields();
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.activeTabName = "tabInfo";
      this.$refs["createTabSchool"].resetFields();
      this.fileAvatar = "";
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.activeTabName = "tabInfo";
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.$refs.upload.clearFiles();
      this.fileAvatar = "";
      this.showUpload = true;
    },
    handleClose(done) {
      this.$confirm("Are you sure to close this dialog?")
        .then((_) => {
          console.log(_);
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let newSchool = this.createTabSchool;
          let formDatas = new FormData();
          for (var key in newSchool) {
            formDatas.append(key, newSchool[key]);
          }
          if (this.fileAvatar != "") {
            formDatas.append("multipartFileAvatar", this.fileAvatar);
          }
          SchoolService.createSchool(formDatas)
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
        }
      });
    },
    handleRemove(file) {
      this.$refs.upload.clearFiles();
      setTimeout(() => {
        this.showUpload = !this.showUpload;
      }, 950);

      let index = this.fileList.indexOf(file);
      if (index >= 0) {
        this.fileList.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    toggleUpload(file, fileList) {
      this.showUpload = !this.showUpload;
      this.fileAvatar = file.raw;
      this.fileList = fileList;
    },
    getAllAgent() {
      AgentService.getAll()
        .then((res) => {
          this.agentListSearch = res.data.data.agentList;
        })
        .catch((err) => {
          console.log(err);
        });
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
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
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

// /deep/.el-input__inner {
//   border: none;
//   border-radius: 0;
//   resize: none;
//   padding-left: 0;
//   padding-right: 0;
//   border-bottom: 1px solid #d9d9d9;
// }
// /deep/.el-dialog__title {
//   font-size: 25px;
//   color: #606266;
// }
.input-below {
  width: 30%;
  display: inline-block;
  text-align: center;
}
/deep/label.el-form-item__label {
  padding-left: 50px;
}
</style>
