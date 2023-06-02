<template>
  <div>
    <el-dialog
      title="Thiết lập chấm công nhân viên"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
    >
      <table class="table table-bordered">
        <thead class="table-header">
          <tr>
            <td class="table-index">STT</td>
            <td style="text-align: center">Nội dung</td>
            <td class="table-action">Thiết lập</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-index">1</td>
            <td>Mặc định có làm sáng không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.morning">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">2</td>
            <td>Mặc định có làm chiều không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.afternoon">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">3</td>
            <td>Mặc định có làm tối không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.evening">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">4</td>
            <td>Mặc định có làm sáng thứ 7 không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.saturdayMorning">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">5</td>
            <td>Mặc định có làm chiều thứ 7 không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.saturdayAfternoon">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">6</td>
            <td>Mặc định có làm tối thứ 7 không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.saturdayEvening">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">7</td>
            <td>Mặc định có làm sáng chủ nhật không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.sundayMorning">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">8</td>
            <td>Mặc định có làm chiều chủ nhật không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.sundayAfternoon">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">9</td>
            <td>Mặc định có làm tối chủ nhật không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.sundayEvening">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">10</td>
            <td>Mặc định có ăn bữa sáng không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.breakfast">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">11</td>
            <td>Mặc định có ăn bữa trưa không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.lunch">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">12</td>
            <td>Mặc định có ăn bữa tối không?</td>
            <td class="table-action">
              <el-radio-group v-model="configSchoolCommon.dinner">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          @click="submitConfigCommon(configSchoolCommon)"
          :loading="loadingButton"
          size="medium"
          type="success"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AttendanceEmployeeService from "@/services/AttendanceEmployeeService";
export default {
  components: {},
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      idOrder: "",
      orderCode: "",
      responseList: [],
      idInfo: "",
      configSchoolCommon: {
        dinner: "",
        lunch: "",
        breakfast: "",
        sundayEvening: "",
        sundayAfternoon: "",
        sundayMorning: "",
        saturdayEvening: "",
        saturdayMorning: "",
        saturdayAfternoon: "",
        evening: "",
        afternoon: "",
        morning: "",
      },
      loadingButton: false,
      showOrderHistoryDetailDialog: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      for (var key in this.configSchoolCommon) {
        this.configSchoolCommon[key] = "";
      }
      setTimeout(() => {
        this.loadingButton = false;
      }, 300);
    },
    closesOrderHistoryDetailDialog() {
      this.showOrderHistoryDetailDialog = false;
    },
    orderSalaryHistoryDetailMethod(row) {
      this.showOrderHistoryDetailDialog = true;
      this.$refs.OrderSalaryHistoryDetailDialog.getOrderHistoryDetailInitial(
        row.id
      );
    },
    submitConfigCommon(data) {
      console.log(data);
      this.loadingButton = true;
      AttendanceEmployeeService.updateConfigAttendanceEmployee(
        this.idInfo,
        data
      )
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
        });
    },
    getData(data) {
      this.idInfo = data.id;
      if (data.attendanceConfig != null) {
        this.configSchoolCommon = data.attendanceConfig;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
// /deep/.el-tabs--card > .el-tabs__header {
//   border-bottom: none;
// }
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
/deep/.el-table .cell {
  line-height: 15px;
}
/deep/.el-table th > .cell {
  font-size: 13px;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;

  // display: inline-block;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
// .table-header {
//   position: sticky;
// }
table {
  width: 100%;
  border-collapse: collapse;
}
table,
td,
th {
  border: 1px solid #e0e0e0;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 90%;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  // height: 600px;
  font-family: Arial, Helvetica, sans-serif;
  // display: block;
  // width: 90%;
}
td {
  padding: 12px;
}
.table-index {
  width: 50px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
