<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Cập nhật đại lý"
    >
      <el-form
        label-width="140px"
        :model="updateTabAgent"
        label-position="left"
        :rules="rules"
        ref="updateTabAgent"
      >
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Thông tin" name="inforTab">
            <el-row :gutter="40">
              <el-col :span="24">
                <div class="grid-content">
                  <el-form-item label="Tên đại lý" prop="agentName">
                    <el-input v-model="updateTabAgent.agentName"></el-input>
                  </el-form-item>
                  <el-form-item label="Địa chỉ" prop="agentAddress">
                    <el-input v-model="updateTabAgent.agentAddress"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="8">
                <div class="grid-content">
                  <el-form-item label="Email" prop="agentEmail">
                    <el-input v-model="updateTabAgent.agentEmail"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <el-form-item label="Điện thoại" prop="contactPhone" align="right">
                    <el-input v-model="updateTabAgent.contactPhone"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <el-form-item label="Website" prop="website">
                    <el-input v-model="updateTabAgent.website"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="8">
                <div class="grid-content">
                  <el-form-item label="Dùng thử từ" prop="demoStart">
                    <el-date-picker
                      v-model="updateTabAgent.demoStart"
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
                      v-model="updateTabAgent.demoEnd"
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
                      v-model="updateTabAgent.dateStart"
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
                      v-model="updateTabAgent.dateEnd"
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
                      v-model="updateTabAgent.dateContractStart"
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
                      v-model="updateTabAgent.dateContractEnd"
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
                    <el-radio-group v-model="updateTabAgent.agentActive">
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
                    <el-radio-group v-model="updateTabAgent.smsActiveMore">
                      <el-radio :label="false">Mặc định</el-radio>
                      <el-radio :label="true">Vượt mức</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <el-form-item prop="smsBudget" label="Mức SMS">
                    <el-input v-model="updateTabAgent.smsBudget"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="24">
                <div class="grid-content">
                  <el-form-item label="Ghi chú" prop="agentDescription">
                    <el-input
                      v-model="updateTabAgent.agentDescription"
                      type="textarea"
                      :rows="5"
                      style="width:100%"
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
                v-if="!statusSave"
              >
                <i class="el-icon-circle-check" />
                <span>Lưu</span>
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Tài khoản" name="accountTab">
            <el-table
              highlight-current-row
              :row-style="tableRowStyle"
              :data="updateTabAccounAgent"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column type="index" label="STT" width="50" align="center"></el-table-column>
              <el-table-column prop="maUser.username" label="Username" align="center"></el-table-column>
              <el-table-column prop="maUser.passwordShow" label="Password" align="center"></el-table-column>
              <el-table-column prop="active" label="Kích hoạt" align="center">
                <template slot-scope="scope">
                  <i
                    v-if="scope.row.maUser.activated"
                    class="el-icon-circle-check"
                    style="margin-left: 10px; color: #409EFF"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="fullName" label="Họ tên" align="center"></el-table-column>
              <el-table-column prop="phone" label="Số điện thoại" align="center"></el-table-column>
              <el-table-column prop="email" label="Email" align="center"></el-table-column>
              <el-table-column prop="note" label="Ghi chú" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
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
      activeName: "inforTab",
      updateTabAccounAgent: "",
      statusSave: "",
      loadingButton: false,
      updateTabAgent: {},
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
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["updateTabAgent"].resetFields();
      this.updateTabAccounAgent = "";
      this.clearTabDefault();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.clearTabDefault();
      this.$emit("dialog-close");
    },
    clearTabDefault() {
      this.activeName = "inforTab";
    },
    getAgentById(data, status) {
      this.updateTabAgent = data;
      this.statusSave = status;
    },

    getAccountAgentByIdAgent(id, status) {
      AgentService.getAccountAgentByIdAgent(id).then((res) => {
        this.updateTabAccounAgent = res.data.data;
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
          let newAgent = this.updateTabAgent;
          console.log(newAgent);
          AgentService.updateAgent(newAgent.id, newAgent)
            .then(() => {
              this.$message({
                message: "Cập nhật đại lý thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch(() => {
              this.$message({
                message: "Cập nhật đại lý thất bại",
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