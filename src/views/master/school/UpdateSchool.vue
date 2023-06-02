<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      title="Cập nhật thông tin trường"
      top="3vh"
    >
      <el-form
        label-width="160px"
        :model="updateTabSchool"
        label-position="left"
        :rules="rules"
        ref="updateTabSchool"
      >
        <el-tabs type="card" @tab-click="handleTabAccount" v-model="activeTabName">
          <el-tab-pane label="Thông tin" name="inforTab">
            <el-form-item label="Tên trường" prop="schoolName">
              <el-input
                v-model="updateTabSchool.schoolName"
                placeholder="Nhập tên trường"
              ></el-input>
            </el-form-item>
            <el-form-item label="Chọn đại lý" prop="idAgent">
              <el-select
                v-model="updateTabSchool.agent.id"
                class="button-left"
                placeholder="-Chọn đại lý-"
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
                v-model="updateTabSchool.schoolDescription"
                placeholder="Nhập mô tả"
              ></el-input>
            </el-form-item>
            <el-form-item label="Địa chỉ" prop="schoolAddress">
              <el-input
                v-model="updateTabSchool.schoolAddress"
                placeholder="Nhập địa chỉ"
              ></el-input>
            </el-form-item>

            <el-form-item label="Điện thoại" prop="schoolPhone" class="input-below">
              <el-input
                v-model.trim="updateTabSchool.schoolPhone"
                placeholder="Nhập số điện thoại"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="schoolEmail" class="input-below">
              <el-input
                v-model.trim="updateTabSchool.schoolEmail"
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
                v-model="updateTabSchool.schoolWebsite"
                placeholder="Nhập website"
              ></el-input>
            </el-form-item>
            <el-row :gutter="40">
              <el-col :span="7">
                <el-form-item label="Ảnh bìa">
                  <el-image
                    v-if="updateTabSchool.schoolAvatar != null && showPicutreInitial"
                    style="width: 150px; height: 150px; float: left; margin-bottom: 10px"
                    :src="updateTabSchool.schoolAvatar"
                    fit="fill"
                  ></el-image>
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="true"
                    list-type="picture-card"
                    :on-change="handleChangeUpload"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                    :class="{ hideUpload: !showUpload }"
                    limit="1"
                    ref="upload"
                  >
                    <span v-if="updateTabSchool.schoolAvatar != null">
                      <i class="el-icon-plus" style="font-size: 20px">Cập nhật ảnh</i>
                    </span>
                    <span v-else>
                      <i class="el-icon-plus" style="font-size: 20px">Thêm ảnh</i>
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
                        v-model.trim="updateTabSchool.contactPhone1"
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
                        v-model="updateTabSchool.contactName1"
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
                        v-model.trim="updateTabSchool.contactPhone2"
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
                        v-model="updateTabSchool.contactName2"
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
                        v-model.trim="updateTabSchool.contactPhone3"
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
                        v-model="updateTabSchool.contactName3"
                        placeholder="Nhập nội dung"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Thiết lập" name="settingTab">
            <el-form-item label="Dùng thử">
              <el-checkbox v-model="updateTabSchool.trialStatus"></el-checkbox>
            </el-form-item>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item label="Dùng thử từ" prop="demoStart">
                    <el-date-picker
                      :disabled="!updateTabSchool.trialStatus"
                      v-model="updateTabSchool.demoStart"
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
                      :disabled="!updateTabSchool.trialStatus"
                      v-model="updateTabSchool.demoEnd"
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
                      :disabled="updateTabSchool.trialStatus"
                      v-model="updateTabSchool.dateStart"
                      value-format="yyyy-MM-dd"
                      format="dd-MM-yyyy"
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
                      :disabled="updateTabSchool.trialStatus"
                      v-model="updateTabSchool.dateEnd"
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
                      v-model="updateTabSchool.dateContractStart"
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
                  <el-form-item label="Kết thúc HĐ" prop="dateContractEnd">
                    <el-date-picker
                      v-model="updateTabSchool.dateContractEnd"
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
                  <el-form-item
                    prop="limitTime"
                    label-width="230px"
                    label="Giới hạn thời gian"
                  >
                    <el-radio-group v-model="updateTabSchool.limitTime">
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
                    <el-radio-group v-model="updateTabSchool.schoolActive">
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
                    <el-radio-group v-model="updateTabSchool.limitDevice">
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
                    <el-input v-model="updateTabSchool.numberDevice"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="10">
                <div class="grid-content">
                  <el-form-item
                    label-width="230px"
                    prop="smsActiveMore"
                    label="Sử dụng SMS"
                  >
                    <el-radio-group v-model="updateTabSchool.smsActiveMore">
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
                    <el-input v-model="updateTabSchool.smsBudget"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>

          <div class="tab-infor-button">
            <el-button
              v-if="showButtonTabAccount"
              type="danger"
              size="medium"
              @click="closeDialogByButton('updateTabSchool')"
            >
              <i class="el-icon-circle-close" />
              <span>Đóng</span>
            </el-button>
            <el-button
              type="success"
              size="medium"
              :loading="loadingButton"
              mini
              @click="submitForm('updateTabSchool')"
              v-if="!statusSave && showButtonTabAccount"
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
      imageUrl: "",
      showUpload: true,
      showPicutreInitial: true,

      agentListSearch: [],
      activeTabName: "inforTab",
      showButtonTabAccount: true,
      updateTabAccountSchool: "",
      dialogImageUrl: "",
      disabled: false,
      statusSave: "",
      fileList: [],
      fileAvatar: "",
      loadingButton: false,

      updateTabSchool: {
        demoStart: "",
        demoEnd: "",
        dateContractStart: "",
        dateContractEnd: "",
        dateStart: "",
        dateEnd: "",
      },
      rules: {
        schoolName: [
          {
            required: true,
            message: "Tên trường không được để trống",
            trigger: "blur",
          },
        ],
        schoolPhone: [
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "blur",
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
    handleTabAccount(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "accountTab") {
        this.showButtonTabAccount = false;
      } else {
        this.showButtonTabAccount = true;
      }
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["updateTabSchool"].resetFields();
      this.updateTabAccountSchool = "";
      this.$emit("dialog-close");
      this.clearTabDefault();
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.$refs.upload.clearFiles();
      this.showUpload = true;
      this.clearTabDefault();
    },
    /**
     * click change image
     */
    handleChangeUpload(file) {
      this.beforeAvatarUpload(file);
      this.showPicutreInitial = false;
      this.showUpload = !this.showUpload;
      this.imageUrl = file.raw;
    },
    /**
     * remove image
     */
    handleRemove() {
      this.$refs.upload.clearFiles();
      setTimeout(() => {
        this.foupdateTabSchool.schoolAvatar = null;
        this.showPicutreInitial = true;
        this.showUpload = true;
      }, 800);
      this.imageUrl = "";
    },
    /**
     * check image before upload
     */
    beforeAvatarUpload(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.raw.size / 1024 / 1024 <= 5;
      if (!isJPG && !isPNG) {
        this.$message.error("Bạn phải chọn định dạng ảnh");
        this.$refs.upload.clearFiles();
        throw "file not valid";
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không được quá 5MB!");
        this.$refs.upload.clearFiles();
        throw "over size";
      }
    },
    clearTabDefault() {
      this.activeTabName = "inforTab";
    },

    getAccountSchoolByIdSchool(id, status) {
      SchoolService.getAccountSchoolByIdSchool(id).then((res) => {
        this.updateTabAccountSchool = res.data.data;
      });
      this.statusView = status;
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
          let newSchool = this.updateTabSchool;
          this.setNullForDate(newSchool);
          let formDatas = new FormData();
          for (var key in newSchool) {
            formDatas.append(key, newSchool[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFileAvatar", this.imageUrl);
          }
          SchoolService.updateSchool(formDatas)
            .then((response) => {
              this.$message({
                message: response.data.message,
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

    /**
     * chuyển date từ null về ""
     */
    setNullForDate(dataInput) {
      if (dataInput.demoStart == null) {
        dataInput.demoStart = "";
      }
      if (dataInput.demoEnd == null) {
        dataInput.demoEnd = "";
      }
      if (dataInput.dateContractStart == null) {
        dataInput.dateContractStart = "";
      }
      if (dataInput.dateContractEnd == null) {
        dataInput.dateContractEnd = "";
      }
      if (dataInput.dateStart == null) {
        dataInput.dateStart = "";
      }
      if (dataInput.dateEnd == null) {
        dataInput.dateEnd = "";
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
    async getAllAgent() {
      await AgentService.getAllCommon()
        .then((res) => {
          this.agentListSearch = res.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getSchoolById(id) {
      SchoolService.getSchoolById(id)
        .then((resp) => {
          this.updateTabSchool = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    async getDataInitial(id) {
      await this.getAllAgent();
      this.getSchoolById(id);
    },
  },
};
</script>
<style>
.hideUpload > div {
  display: none;
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
.input-below {
  width: 30%;
  display: inline-block;
  text-align: center;
}
/deep/label.el-form-item__label {
  padding-left: 50px;
}
</style>
