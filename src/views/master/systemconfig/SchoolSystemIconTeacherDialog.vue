<template>
  <el-dialog
    title="Cấu hình App Teacher"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div v-if="iconTeacherData != null" style="display: flex; justify-content: center">
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
              <td>{{ iconTeacherData.messageName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.messageShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.message"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>{{ iconTeacherData.medicineName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.medicineShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.medicine"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>{{ iconTeacherData.absentName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.absentShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.absent"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>{{ iconTeacherData.healthName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.healthShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.health"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>{{ iconTeacherData.attendanceName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.attendanceShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.attendance"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>{{ iconTeacherData.albumName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.albumShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.album"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>{{ iconTeacherData.evaluateName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.evaluateShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.evaluate"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">8</td>
              <td>{{ iconTeacherData.studentFeesName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.studentFeesShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.studentFees"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>{{ iconTeacherData.videoName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.videoShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.video"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">10</td>
              <td>{{ iconTeacherData.learnName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.learnShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.learn"></el-checkbox>
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
              <td class="table-index">11</td>
              <td>{{ iconTeacherData.menuName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.menuShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.menu"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">12</td>
              <td>{{ iconTeacherData.birthdayName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.birthdayShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.birthday"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">13</td>
              <td>{{ iconTeacherData.cameraName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.cameraShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.camera"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">14</td>
              <td>{{ iconTeacherData.utilityName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.utilityShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.utility"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">15</td>
              <td>{{ iconTeacherData.salaryName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.salaryShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.salary"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">16</td>
              <td>{{ iconTeacherData.facebookName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.facebookShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.facebook"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">17</td>
              <td>{{ iconTeacherData.feedbackName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.feedbackShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.feedback"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">18</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.newsShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconTeacherData.news"></el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else align="center">Không có dữ liệu</div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('iconTeacherData')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('iconTeacherData')"
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
      iconTeacherData: {},
      loadingButton: false,
      id: "",
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["iconTeacherData"].resetFields();
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
      this.$refs["iconTeacherData"].resetFields();
    },
    submitForm(fromData) {
      this.loadingButton = true;
      SystemConfigService.updateSchoolIconTeacher(this.id, this.iconTeacherData)
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
      SystemConfigService.findSchoolIconTeacher(id)
        .then((resp) => {
          this.iconTeacherData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.iconTeacherData = null;
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
