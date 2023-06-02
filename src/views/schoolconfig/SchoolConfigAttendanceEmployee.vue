<template>
  <div>
    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <el-tab-pane label="Cấu hình điểm danh" name="attendance">
          <div class="wrapper-table">
            <table border class="table-data">
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
                    <el-radio-group
                      v-model="configSchoolCommon.saturdayMorning"
                    >
                      <el-radio :label="true">Có</el-radio>
                      <el-radio :label="false">Không</el-radio>
                    </el-radio-group>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">5</td>
                  <td>Mặc định có làm chiều thứ 7 không?</td>
                  <td class="table-action">
                    <el-radio-group
                      v-model="configSchoolCommon.saturdayAfternoon"
                    >
                      <el-radio :label="true">Có</el-radio>
                      <el-radio :label="false">Không</el-radio>
                    </el-radio-group>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">6</td>
                  <td>Mặc định có làm tối thứ 7 không?</td>
                  <td class="table-action">
                    <el-radio-group
                      v-model="configSchoolCommon.saturdayEvening"
                    >
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
                    <el-radio-group
                      v-model="configSchoolCommon.sundayAfternoon"
                    >
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
          </div>
          <div>
            <el-button
              v-if="checkPermission(['schoolConfig_attendanceEmployee_update'])"
              class="button-click"
              @click="submitConfigCommon()"
              :loading="loaddingButton"
              size="medium"
              type="success"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Cấu hình thời gian" name="configTime">
          <div class="wrapper-table">
            <table border class="table-data">
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
                  <td>
                    Thiết lập giờ đi làm buổi sáng của nhân viên nhà trường?
                  </td>
                  <td class="table-action">
                    <el-time-picker
                      class="input-data"
                      size="mini"
                      :clearable="false"
                      type="time"
                      value-format="HH:mm"
                      format="HH:mm"
                      v-model="configSchoolTime.timeMorningEmployee"
                      :picker-options="{
                        selectableRange: '06:00:00 - 21:00:00',
                      }"
                      placeholder="Chọn"
                    ></el-time-picker>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">1</td>
                  <td>
                    Thiết lập giờ đi làm buổi chiều của nhân viên nhà trường?
                  </td>
                  <td class="table-action">
                    <el-time-picker
                      class="input-data"
                      size="mini"
                      :clearable="false"
                      type="time"
                      value-format="HH:mm"
                      format="HH:mm"
                      v-model="configSchoolTime.timeAfternoonEmployee"
                      :picker-options="{
                        selectableRange: '06:00:00 - 21:00:00',
                      }"
                      placeholder="Chọn"
                    ></el-time-picker>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">1</td>
                  <td>
                    Thiết lập giờ đi làm buổi tối của nhân viên nhà trường?
                  </td>
                  <td class="table-action">
                    <el-time-picker
                      class="input-data"
                      size="mini"
                      :clearable="false"
                      type="time"
                      value-format="HH:mm"
                      format="HH:mm"
                      v-model="configSchoolTime.timeEveningEmployee"
                      :picker-options="{
                        selectableRange: '06:00:00 - 21:00:00',
                      }"
                      placeholder="Chọn"
                    ></el-time-picker>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">2</td>
                  <td>Thiết lập giờ về ca sáng của nhân viên nhà trường?</td>
                  <td class="table-action">
                    <el-time-picker
                      class="input-data"
                      size="mini"
                      :clearable="false"
                      type="time"
                      value-format="HH:mm"
                      format="HH:mm"
                      v-model="configSchoolTime.timeLeaveMorningEmployee"
                      :picker-options="{
                        selectableRange: '06:00:00 - 21:00:00',
                      }"
                      placeholder="Chọn"
                    ></el-time-picker>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">2</td>
                  <td>Thiết lập giờ về ca chiều của nhân viên nhà trường?</td>
                  <td class="table-action">
                    <el-time-picker
                      class="input-data"
                      size="mini"
                      :clearable="false"
                      type="time"
                      value-format="HH:mm"
                      format="HH:mm"
                      v-model="configSchoolTime.timeLeaveAfternoonEmployee"
                      :picker-options="{
                        selectableRange: '06:00:00 - 21:00:00',
                      }"
                      placeholder="Chọn"
                    ></el-time-picker>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">2</td>
                  <td>Thiết lập giờ về ca tối của nhân viên nhà trường?</td>
                  <td class="table-action">
                    <el-time-picker
                      class="input-data"
                      size="mini"
                      :clearable="false"
                      type="time"
                      value-format="HH:mm"
                      format="HH:mm"
                      v-model="configSchoolTime.timeLeaveEveningEmployee"
                      :picker-options="{
                        selectableRange: '06:00:00 - 21:00:00',
                      }"
                      placeholder="Chọn"
                    ></el-time-picker>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <el-button
              v-if="checkPermission(['schoolConfig_attendanceEmployee_update'])"
              class="button-click"
              @click="submitConfigTime()"
              :loading="loaddingButton"
              size="medium"
              type="success"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  data() {
    return {
      activeTabName: "attendance",
      showDataSearch: false,
      configSchoolCommon: {},
      configSchoolTime: "",
      configSchoolClassList: [],
      noSelect: "",
      albumRadio: false,
      loaddingButton: false,
      loaddingButtonClass: false,
      gradeList: [],
      classFirstGradeList: [],
      classList: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        className: "",
      },
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      if (
        row.absentStatus == "Nghỉ có phép" ||
        row.absentStatus == "Nghỉ không phép"
      ) {
        return "color: red";
      } else if (row.absentStatus == "Chưa điểm danh") {
        return "color: #409EFF";
      }
    },
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "configTime") {
        this.getConfigTime();
      } else if (tabNameClick == "configAbsent") {
        this.showDataSearch = true;
        this.getConfigClassMethod();
      }
    },
    getConfigTime() {
      SchoolConfigService.getConfigAttendanceTimeSchool()
        .then((resp) => {
          this.configSchoolTime = resp.data.data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
        });
    },
    /**
     * lưu cấu hình chung
     */
    submitConfigCommon() {
      this.loaddingButton = true;
      SchoolConfigService.updateConfigAttendanceSchool(this.configSchoolCommon)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButton = false;
          }, 500);
        });
    },
    submitConfigTime() {
      SchoolConfigService.updateConfigAttendanceTimeSchool(
        this.configSchoolTime
      )
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
        });
    },
    /**
     * lấy cấu hình chung
     */
    getConfigCommonMethod() {
      SchoolConfigService.getConfigAttendanceSchool()
        .then((resp) => {
          this.configSchoolCommon = resp.data.data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
        });
    },
  },
  beforeMount() {
    this.getConfigCommonMethod();
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
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 10px 0;
// }
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
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
  border-radius: 0;
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
// table{

// }
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
  width: 10px;
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
