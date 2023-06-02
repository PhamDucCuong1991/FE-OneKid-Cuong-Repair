<template>
  <el-dialog
    title="Cấu hình nhận thông báo"
    :visible.sync="dialogVisible"
    width="1100px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div style="display: flex; justify-content: center">
      <div class="table-icon-1">
        <span style="margin-left: 60px">App Parent</span>
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Sử dụng</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">1</td>
              <td>Thông báo</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.notify"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>Lời nhắn</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.message"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>Dặn thuốc</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.medicine"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>Xin nghỉ</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.absent"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>Album</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.album"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>Nhận xét</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.evaluate"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>Điểm danh</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.attendance"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">8</td>
              <td>Góp ý</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.feedback"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>Sinh nhật</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.birthday"
                ></el-checkbox>
              </td>
            </tr>

            <!-- <tr align="center">
              <td class="table-index">10</td>
              <td>Danh bạ</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.phonebook"
                ></el-checkbox>
              </td>
            </tr> -->

            <tr align="center">
              <td class="table-index">10</td>
              <td>Thông báo nạp/rút ví</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.wallet"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">11</td>
              <td>Thông báo học phí</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.orderShow"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">12</td>
              <td>Thông báo thanh toán</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.orderPayment"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">13</td>
              <td>Thông báo hóa đơn</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.orderNotify"
                ></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">14</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyParent.news"
                ></el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-icon-2">
        <span style="margin-left: 60px">App Teacher</span>
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Sử dụng</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">1</td>
              <td>Thông báo</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.notify"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>Lời nhắn</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.message"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>Dặn thuốc</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.medicine"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>Xin nghỉ</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.absent"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>Nhận xét</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.evaluate"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>Góp ý</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.feedback"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>Sinh nhật</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.birthday"
                ></el-checkbox>
              </td>
            </tr>

            <!-- <tr align="center">
              <td class="table-index">8</td>
              <td>Danh bạ</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.phonebook"
                ></el-checkbox>
              </td>
            </tr> -->
            <tr align="center">
              <td class="table-index">8</td>
              <td>Thông báo học phí</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.orderShow"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>Thông báo thanh toán</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.orderPayment"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">10</td>
              <td>Thông báo hóa đơn</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.orderNotify"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">11</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyTeacher.news"
                ></el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-icon-3">
        <span style="margin-left: 60px">App Plus</span>
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Sử dụng</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">1</td>
              <td>Thông báo</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.notify"
                ></el-checkbox>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">2</td>
              <td>Lời nhắn</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.message"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>Dặn thuốc</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.medicine"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>Xin nghỉ</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.absent"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>Nhận xét</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.evaluate"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>Góp ý</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.feedback"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>Thu chi nội bộ</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.cashInternal"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">8</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.news"
                ></el-checkbox>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>Duyệt album</td>
              <td class="table-action">
                <el-checkbox
                  v-model="responseData.configNotifyPlus.albumApproved"
                ></el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
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
      responseData: {},
      loadingButton: false,
      id: "",
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
    },
    submitForm() {
      this.loadingButton = true;
      SystemConfigService.updateNotifyConfig(this.responseData)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
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
      SystemConfigService.getNotifyConfig(id)
        .then((resp) => {
          this.responseData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
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
