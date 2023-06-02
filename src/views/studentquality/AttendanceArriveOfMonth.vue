<template>
  <div>
    <el-dialog
      :title="fullNameTitle"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <!-- table content -->
      <el-table
        ref="multipleTable"
        :data="attendanceArriveKidList"
        :cell-style="tableRowStyleDetail"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChangeArrive"
        :max-height="$tableMaxHeight"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column sortable label="Ngày" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attendanceDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="Người điểm danh" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.attendanceArriveKids.lastModifieBy }}</div>
            <div>
              {{ scope.row.attendanceArriveKids.lastModifieDate | formatDateTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="absentStatus"
          sortable
          label="Tình trạng đi học"
          align="center"
        ></el-table-column>
        <el-table-column label="Nghỉ học" align="center">
          <el-table-column label="Có phép" align="center" width="100" header>
            <template slot-scope="scope">
              <el-checkbox
                @change="changeRowDataAbsentYesMethod(scope.$index, scope.row)"
                v-model="scope.row.absentLetterYes"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="Không phép" align="center" width="100" header>
            <template slot-scope="scope">
              <el-checkbox
                @change="changeRowDataAbsentNoMethod(scope.$index, scope.row)"
                v-model="scope.row.absentLetterNo"
              ></el-checkbox>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="Đi học" align="center">
          <el-table-column
            v-if="configSchoolCommon.morningAttendanceArrive"
            prop="gradeResponse.gradeName"
            align="center"
            width="70"
          >
            <template slot="header" slot-scope="scope">
              Sáng
              <br />
              <el-checkbox
                @change="changeCheckboxAllMorning(scope.$index, scope.row)"
                v-model="checkboxAllMorning"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                @change="changeCheckboxPartDay(scope.$index, scope.row)"
                v-model="scope.row.attendanceArriveKids.morning"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="configSchoolCommon.afternoonAttendanceArrive"
            prop="gradeResponse.gradeName"
            align="center"
            width="70"
          >
            <template slot="header" slot-scope="scope">
              Chiều
              <br />
              <el-checkbox
                @change="changeCheckboxAllAfternoon(scope.$index, scope.row)"
                v-model="checkboxAllAfternoon"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                @change="changeCheckboxPartDay(scope.$index, scope.row)"
                v-model="scope.row.attendanceArriveKids.afternoon"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="configSchoolCommon.eveningAttendanceArrive"
            prop="gradeResponse.gradeName"
            align="center"
            width="70"
          >
            <template slot="header" slot-scope="scope">
              Tối
              <br />
              <el-checkbox
                @change="changeCheckboxAllEvening(scope.$index, scope.row)"
                v-model="checkboxAllEvening"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                @change="changeCheckboxPartDay(scope.$index, scope.row)"
                v-model="scope.row.attendanceArriveKids.evening"
              ></el-checkbox>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="Giờ đến" width="130">
          <template slot-scope="scope">
            <el-time-picker
              style="width: 85%"
              size="mini"
              v-if="
                scope.row.absentLetterYes ||
                scope.row.absentLetterNo ||
                (!scope.row.attendanceArriveKids.morning &&
                  !scope.row.attendanceArriveKids.afternoon &&
                  !scope.row.attendanceArriveKids.evening)
              "
              disabled
              placeholder="Chọn"
              v-model="scope.row.attendanceArriveKids.timeArriveKid"
              :picker-options="{
                selectableRange: '06:00:00 - 21:00:00',
              }"
            ></el-time-picker>
            <el-time-picker
              v-else
              style="width: 85%"
              size="mini"
              placeholder="Chọn"
              v-model="scope.row.attendanceArriveKids.timeArriveKid"
              :picker-options="{
                 selectableRange: '06:00:00 - 21:00:00',
              }"
            ></el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleArriveRowSave(scope.$index, scope.row)"
              >Lưu</el-button
            >
            <el-button
              v-if="
                scope.row.absentLetterYes ||
                scope.row.absentLetterNo ||
                scope.row.attendanceArriveKids.timeArriveKid == null ||
                (!scope.row.attendanceArriveKids.morning &&
                  !scope.row.attendanceArriveKids.afternoon &&
                  !scope.row.attendanceArriveKids.evening)
              "
              disabled
              size="mini"
              type="success"
              >Sửa</el-button
            >
            <el-button
              v-else
              size="mini"
              type="success"
              @click="handleArriveUpdateRowMethod(scope.$index, scope.row)"
              >Sửa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- button bottom -->
      <span slot="footer" class="dialog-footer">
        Tháng
        <el-select
          v-model="selectMonth"
          placeholder="Select"
          size="medium"
          style="width: 70px; margin-right: 10px"
          @change="getAttendanceArriveChangeMonth()"
        >
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="handleArriveManyRowSave()"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu các ngày</span>
        </el-button>
        <el-button type="danger" size="medium" @click="closeDialogByButton()">
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
      </span>
    </el-dialog>
    <AttendanceArriveUpdate
      :dialogVisible="showDialogUpdateArrive"
      @dialog-close="closeDialogUpdateArriveMethod"
      ref="AttendanceArriveUpdate"
    />
  </div>
</template>

<script>
import AttendanceArriveUpdate from "./AttendanceArriveUpdate.vue";
import AttendanceService from "@/services/AttendanceService";
export default {
  components: {
    AttendanceArriveUpdate,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      attendanceArriveKidList: [],
      selectMonth: null,
      selectYear: 2020,
      idKidData: "",
      fullNameDialog: "",
      fullNameTitle: "",
      showDialogUpdateArrive: false,
      multipleSelectionArrive: [],
      loadingButton: false,
      checkboxAllMorning: false,
      checkboxAllAfternoon: false,
      checkboxAllEvening: false,
      configSchoolCommon: "",
      monthList: [
        {
          value: 1,
          label: "01",
        },
        {
          value: 2,
          label: "02",
        },
        {
          value: 3,
          label: "03",
        },
        {
          value: 4,
          label: "04",
        },
        {
          value: 5,
          label: "05",
        },
        {
          value: 6,
          label: "06",
        },
        {
          value: 7,
          label: "07",
        },
        {
          value: 8,
          label: "08",
        },
        {
          value: 9,
          label: "09",
        },
        {
          value: 10,
          label: "10",
        },
        {
          value: 11,
          label: "11",
        },
        {
          value: 12,
          label: "12",
        },
      ],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      if (row.absentStatus == "Nghỉ có phép" || row.absentStatus == "Nghỉ không phép") {
        return "color: red";
      } else if (row.absentStatus == "Chưa điểm danh") {
        return "color: #409EFF";
      }
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      this.setFalseALllCheckboxHeaderArrive();
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      this.setFalseALllCheckboxHeaderArrive();
    },
    handleSelectionChangeArrive(val) {
      this.multipleSelectionArrive = val;
    },
    changeCheckboxAllMorning() {
      this.attendanceArriveKidList.forEach((x) => {
        x.attendanceArriveKids.morning = this.checkboxAllMorning;
        this.setFalseAbsentMethod(x);
      });
    },
    changeCheckboxAllAfternoon() {
      this.attendanceArriveKidList.forEach((x) => {
        x.attendanceArriveKids.afternoon = this.checkboxAllAfternoon;
        this.setFalseAbsentMethod(x);
      });
    },
    changeCheckboxAllEvening() {
      this.attendanceArriveKidList.forEach((x) => {
        x.attendanceArriveKids.evening = this.checkboxAllEvening;
        this.setFalseAbsentMethod(x);
      });
    },
    changeRowDataAbsentYesMethod(index, row) {
      if (row.absentLetterYes) {
        this.setFalseAllDayMethod(row);
        this.setNullTimeArriveMethod(row);
        row.absentLetterNo = false;
      }
    },
    changeRowDataAbsentNoMethod(index, row) {
      if (row.absentLetterNo) {
        this.setFalseAllDayMethod(row);
        this.setNullTimeArriveMethod(row);
        row.absentLetterYes = false;
      }
    },
    changeCheckboxPartDay(index, row) {
      if (
        row.attendanceArriveKids.morning ||
        row.attendanceArriveKids.afternoon ||
        row.attendanceArriveKids.evening
      ) {
        this.setFalseAbsentMethod(row);
      }
      if (
        !row.attendanceArriveKids.morning &&
        !row.attendanceArriveKids.afternoon &&
        !row.attendanceArriveKids.evening
      ) {
        this.setNullTimeArriveMethod(row);
      }
    },
    setFalseALllCheckboxHeaderArrive() {
      this.checkboxAllMorning = false;
      this.checkboxAllAfternoon = false;
      this.checkboxAllEvening = false;
    },
    setFalseAllDayMethod(row) {
      row.attendanceArriveKids.morning = false;
      row.attendanceArriveKids.afternoon = false;
      row.attendanceArriveKids.evening = false;
    },
    setFalseAbsentMethod(row) {
      row.absentLetterYes = false;
      row.absentLetterNo = false;
    },
    setNullTimeArriveMethod(row) {
      row.attendanceArriveKids.timeArriveKid = null;
    },
    handleArriveRowSave(index, row) {
      if (
        row.attendanceArriveKids.morning ||
        row.attendanceArriveKids.afternoon ||
        row.attendanceArriveKids.evening
      ) {
        if (row.attendanceArriveKids.timeArriveKid == null) {
          this.$message({
            message: "Chưa chọn giờ đến",
            type: "error",
          });
          return;
        }
      }
      /**
       * lưu một row cho điểm danh đến
       */
      AttendanceService.saveArriveOne(row.id, row)
        .then((resp) => {
          this.attendanceSave = resp.data.data;
          this.$message({
            message: "Lưu điểm danh đến thành công",
            type: "success",
          });
          this.getAttendanceArriveChangeMonth();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu điểm danh đến thất bại",
            type: "error",
          });
        });
    },
    /**
     * lưu nhiều row cho điểm danh đến
     */
    handleArriveManyRowSave() {
      let kidList = this.multipleSelectionArrive;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      let checkTimeNull = false;
      let BreakException = null;
      kidList.forEach((x) => {
        if (
          (x.attendanceArriveKids.morning ||
            x.attendanceArriveKids.afternoon ||
            x.attendanceArriveKids.evening) &&
          x.attendanceArriveKids.timeArriveKid == null
        ) {
          checkTimeNull = true;
          this.$message({
            message: "Chưa chọn giờ đến cho học sinh",
            type: "error",
          });
        }
        if (checkTimeNull) {
          throw BreakException;
        }
      });
      this.loadingButton = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu điểm danh đến cho " +
          kidList.length +
          " ngày đã chọn?",
        "Lưu điểm danh đến: " + this.fullNameDialog,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          AttendanceService.saveArriveMany(kidList)
            .then((resp) => {
              this.attendanceArriveManySave = resp.data.data;
              this.$message({
                message: "Lưu các ngày điểm danh đến thành công",
                type: "success",
              });
              this.getAttendanceArriveChangeMonth();
              setTimeout(() => {
                this.closeDialog();
              }, 500);
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "Lưu các ngày điểm danh đến cho thất bại",
                type: "error",
              });
            });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    handleArriveUpdateRowMethod(index, row) {
      this.$refs.AttendanceArriveUpdate.getDataArriveRowInitial(row);
      this.showDialogUpdateArrive = true;
    },
    closeDialogUpdateArriveMethod() {
      this.showDialogUpdateArrive = false;
      this.getAttendanceArriveChangeMonth();
    },

    getAttendanceArriveChangeMonth() {
      AttendanceService.getArriveByIdKidOfMonth(
        this.idKidData,
        this.selectMonth,
        this.selectYear
      )
        .then((resp) => {
          this.attendanceArriveKidList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.attendanceArriveKidList = null;
        });
    },
    getAttendanceArriveDetailInital(idKid, fullName, schoolConfig) {
      this.configSchoolCommon = schoolConfig;
      this.idKidData = idKid;
      this.fullNameDialog = fullName;
      this.fullNameTitle = "Điểm danh đến: " + fullName;
      this.getCurrentMonth();
      AttendanceService.getArriveByIdKidOfMonth(idKid, this.selectMonth, this.selectYear)
        .then((resp) => {
          this.attendanceArriveKidList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.attendanceArriveKidList = null;
        });
    },
    getCurrentMonth() {
      let dateNow = new Date();
      this.selectMonth = dateNow.getMonth() + 1;
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
</style>
