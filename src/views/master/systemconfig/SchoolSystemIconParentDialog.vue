<template>
  <el-dialog
    title="Cấu hình App OneKids"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div v-if="iconParentData != null" style="display: flex; justify-content: center">
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
              <td>{{ iconParentData.messageName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.messageShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.message"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>{{ iconParentData.medicineName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.medicineShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.medicine"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>{{ iconParentData.absentName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.absentShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.absent"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>{{ iconParentData.albumName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.albumShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.album"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>{{ iconParentData.evaluateName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.evaluateShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.evaluate"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>{{ iconParentData.attendanceName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.attendanceShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.attendance"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>{{ iconParentData.studentFeesName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.studentFeesShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.studentFees"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">8</td>
              <td>{{ iconParentData.learnName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.learnShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.learn"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>{{ iconParentData.menuName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.menuShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.menu"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">10</td>
              <td>{{ iconParentData.cameraName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.cameraShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.camera"></el-checkbox>
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
              <td>{{ iconParentData.videoName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.videoShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.video"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">12</td>
              <td>{{ iconParentData.kidsInfoName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.kidsInfoShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.kidsInfo"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">13</td>
              <td>{{ iconParentData.utilityName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.utilityShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.utility"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">14</td>
              <td>{{ iconParentData.facebookName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.facebookShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.facebook"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">15</td>
              <td>{{ iconParentData.feedbackName }}</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.feedbackShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.feedback"></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">16</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.newsShow"></el-checkbox>
              </td>
              <td class="table-action">
                <el-checkbox v-model="iconParentData.news"></el-checkbox>
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
        @click="closeDialogByButton('iconParentData')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('iconParentData')"
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
      iconParentData: {},
      loadingButton: false,
      id: "",
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["iconParentData"].resetFields();
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
      this.$refs["iconParentData"].resetFields();
    },
    submitForm(fromData) {
      this.loadingButton = true;
      SystemConfigService.updateSchoolIconParent(this.id, this.iconParentData)
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
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    getDataInitial(id) {
      this.id = id;
      SystemConfigService.findSchoolIconParent(id)
        .then((resp) => {
          this.iconParentData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.iconParentData = null;
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
