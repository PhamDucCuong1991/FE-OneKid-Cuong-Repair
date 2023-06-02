<template>
  <el-dialog
    title="Cấu hình App Plus"
    :visible.sync="dialogVisible"
    width="850px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div v-if="iconPlusData != null" style="display: flex; justify-content: center">
      <div class="table-icon-1">
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Hiển thị</td>
              <td class="table-action">Mở khóa</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">1</td>
              <td>{{ iconPlusData.employeeName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.employeeShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.employee"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>{{ iconPlusData.kidsName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.kidsShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.kids"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>{{ iconPlusData.messageName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.messageShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.message"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>{{ iconPlusData.medicineName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.medicineShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.medicine"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>{{ iconPlusData.absentName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.absentShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.absent"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>{{ iconPlusData.attendanceName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.attendanceShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.attendance"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>{{ iconPlusData.evaluateName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.evaluateShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.evaluate"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">8</td>
              <td>{{ iconPlusData.albumName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.albumShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.album"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>{{ iconPlusData.healthName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.healthShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.health"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">10</td>
              <td>{{ iconPlusData.learnName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.learnShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.learn"></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">11</td>
              <td>{{ iconPlusData.menuName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.menuShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.menu"></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">12</td>
              <td>{{ iconPlusData.videoName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.videoShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.video"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">13</td>
              <td>{{ iconPlusData.cameraName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.cameraShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.camera"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">14</td>
              <td>{{ iconPlusData.birthdayName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.birthdayShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.birthday"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">15</td>
              <td>{{ iconPlusData.studentFeesName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.studentFeesShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.studentFees"></el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-icon-2">
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Hiển thị</td>
              <td class="table-action">Mở khóa</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">16</td>
              <td>{{ iconPlusData.salaryName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.salaryShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.salary"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">17</td>
              <td>{{ iconPlusData.utilityName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.utilityShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.utility"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">18</td>
              <td>{{ iconPlusData.facebookName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.facebookShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.facebook"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">19</td>
              <td>{{ iconPlusData.feedbackName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.feedbackShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.feedback"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">20</td>
              <td>{{ iconPlusData.smsAppHistoryName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.smsAppHistoryShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.smsAppHistory"></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">21</td>
              <td>{{ iconPlusData.notifyName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.notifyShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.notify"></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">22</td>
              <td>{{ iconPlusData.supportName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.supportShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.support"></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">23</td>
              <td>{{ iconPlusData.cashInternalName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.cashInternalShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.cashInternal"></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">24</td>
              <td>{{ iconPlusData.walletName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.walletShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.wallet"></el-checkbox>
              </td>
            </tr>
            <!-- <tr align="center">
              <td class="table-index">25</td>
              <td>{{ iconPlusData.notifySchoolName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.notifySchoolShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.notifySchool"></el-checkbox>
              </td>
            </tr> -->
            <tr align="center">
              <td class="table-index">25</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.newsShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconPlusData.news"></el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else align="center">Không có dữ liệu</div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('iconPlusData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('iconPlusData')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SystemConfigService from "@/services/SystemConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      iconPlusData: {},
      loadingButton: false,
      id: "",
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["iconPlusData"].resetFields();
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
      this.$refs["iconPlusData"].resetFields();
    },
    submitForm(fromData) {
      this.loadingButton = true;
      SystemConfigService.updateSchoolIconPlus(this.id, this.iconPlusData)
        .then((response) => {
          let data = response.data.data;
          console.log(data);
          this.$message({
            message: "Cập nhật thành công",
            type: "success",
          });

          setTimeout(() => {
            this.closeDialogByButton(fromData);
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: "Cập nhật thất bại",
            type: "error",
          });
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    getDataInitial(id) {
      this.id = id;
      SystemConfigService.findSchoolIconPlus(id)
        .then((resp) => {
          this.iconPlusData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.iconPlusData = null;
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
  padding-top: 10px;
  padding-bottom: 10px;
}
.table-icon-1 {
  margin-left: 50px;
  margin-right: 40px;
}
.table-icon-2 {
  margin-right: 50px;
  margin-left: 40px;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
}
td {
  padding: 10px;
}
.table-index {
  width: 30px;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
</style>
