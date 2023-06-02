<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Thêm đại lý"
    >
      <el-form
        label-width="140px"
        :model="createTabAgent"
        label-position="left"
        :rules="rules"
        ref="createTabAgent"
      >
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Tên đại lý" prop="agentName">
                <el-input v-model="createTabAgent.agentName"></el-input>
              </el-form-item>
              <el-form-item label="Địa chỉ" prop="agentAddress">
                <el-input v-model="createTabAgent.agentAddress"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Email" prop="agentEmail">
                <el-input v-model="createTabAgent.agentEmail"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Điện thoại" prop="contactPhone" align="right">
                <el-input v-model="createTabAgent.contactPhone"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Website" prop="website">
                <el-input v-model="createTabAgent.website"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Dùng thử từ" prop="demoStart">
                <el-date-picker
                  v-model="createTabAgent.demoStart"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Đến ngày" prop="demoEnd">
                <el-date-picker
                  v-model="createTabAgent.demoEnd"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="40">
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Ngày bắt đầu" prop="dateStart">
                <el-date-picker
                  v-model="createTabAgent.dateStart"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Ngày hết hạn" prop="dateEnd">
                <el-date-picker
                  v-model="createTabAgent.dateEnd"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Ngày ký HĐ" prop="dateContractStart">
                <el-date-picker
                  v-model="createTabAgent.dateContractStart"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item label="Kết thúc HĐ" prop="dateContractEnd">
                <el-date-picker
                  v-model="createTabAgent.dateContractEnd"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="Chọn ngày"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item prop="agentActive" label="Trạng thái">
                <el-radio-group v-model="createTabAgent.agentActive">
                  <el-radio :label="true">Kích hoạt</el-radio>
                  <el-radio :label="false">Hủy</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item prop="smsActiveMore" label="Sử dụng SMS">
                <el-radio-group v-model="createTabAgent.smsActiveMore">
                  <el-radio :label="false">Mặc định</el-radio>
                  <el-radio :label="true">Vượt mức</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-form-item prop="smsBudget" label="Mức SMS">
                <el-input v-model="createTabAgent.smsBudget"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="Ghi chú" prop="agentDescription">
                <el-input
                  v-model="createTabAgent.agentDescription"
                  type="textarea"
                  :rows="5"
                  style="width:100%"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="tab-infor-button">
          <el-button type="danger" size="medium" @click="closeDialogByButton('createTabAgent')">
            <i class="el-icon-circle-close" />
            <span>Đóng</span>
          </el-button>
          <el-button
            type="success"
            size="medium"
            :loading="loadingButton"
            mini
            @click="submitForm('createTabAgent')"
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
      fileList: [],
      fileAvatar: "",
      showUpload: true,
      dialogImageUrl: "",
      dialogVisible1: false,
      disabled: false,
      src:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",

      accountTypes: [],
      subjectClass: "",
      subjectInClass: [],
      disabledIsMaster: false,
      isMasterAccountType: true,
      employeeSavedSuccess: {},
      listSubject: [],
      listIdSubject: [],
      idClassCheck: "",

      teacherIconAppCreate: {
        teacherIconCreate1: [],
        teacherIconCreate2: [],
      },
      plusIconAppCreate: {
        plusIconCreate1: [],
        plusIconCreate2: [],
      },
      emloyeeCode: "ABCDE-123456",
      employeeStatusRadio: "Đang làm",
      value: "",
      checkIsClass: true,
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
      createTabAgent: {
        agentName: "",
        agentAddress: "",
        agentEmail: "",
        contactPhone: "",
        website: "",
        demoStart: "",
        demoEnd: "",
        dateContractStart: "",
        dateContractEnd: "",
        dateStart: "",
        dateEnd: "",
        agentActive: true,
        smsActiveMore: false,
        smsBudget: "",
        agentDescription: "",
      },
      rules: {
        agentName: [
          {
            required: true,
            message: "Tên đại lý không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetFormData() {
      this.$refs["createTabAgent"].resetFields();
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["createTabAgent"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
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
          let newAgent = this.createTabAgent;
          AgentService.createAgent(newAgent)
            .then(() => {
              this.$message({
                message: "Thêm mới đại lý thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch(() => {
              this.$message({
                message: "Thêm mới đại lý thất bại",
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
      // this.$refs.upload.clearFiles();
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
      this.formAllTabAgent.createEmployeeMainInfoRequest.avatar = this.fileAvatar.name;
      this.fileList = fileList;
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
// /deep/.el-input__inner,
// /deep/.el-textarea__inner {
//   border: none;
//   border-radius: 0;
//   resize: none;
//   padding-left: 0;
//   padding-right: 0;
//   border-bottom: 1px solid #d9d9d9;
// }

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