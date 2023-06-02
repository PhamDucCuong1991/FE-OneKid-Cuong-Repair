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
        :data="attendanceLeaveKidList"
        :cell-style="tableRowStyleDetail"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChangeLeave"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column sortable label="Ngày" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attendanceDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="Người điểm danh" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.attendanceLeaveKids.lastModifieBy }}</div>
            <div>
              {{ scope.row.attendanceLeaveKids.lastModifieDate | formatDateTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="absentStatus"
          sortable
          label="Tình trạng đi học"
          align="center"
        ></el-table-column>
        <el-table-column align="center" width="70">
          <template slot="header" slot-scope="scope">
            Đã đón
            <br />
            <el-checkbox
              @change="changeCheckboxAllLeave(scope.$index, scope.row)"
              v-model="checkboxAllLeave"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-if="scope.row.absentStatus == 'Đi học'"
              @change="setNullTimeLeaveMethod(scope.$index, scope.row)"
              v-model="scope.row.attendanceLeaveKids.statusLeave"
            ></el-checkbox>
            <el-checkbox v-else disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Giờ về" width="132">
          <template slot-scope="scope">
            <el-time-picker
              style="width: 83%"
              size="mini"
              @change="changeTimeLeave(scope.$index, scope.row)"
              v-if="scope.row.attendanceLeaveKids.statusLeave"
              v-model="scope.row.attendanceLeaveKids.timeLeaveKid"
              :picker-options="{
                selectableRange: '06:00:00 - 21:00:00',
              }"
              placeholder="Chọn"
            ></el-time-picker>
            <el-time-picker
              v-else
              disabled
              style="width: 83%"
              size="mini"
              v-model="scope.row.attendanceLeaveKids.timeLeaveKid"
              :picker-options="{
                selectableRange: '06:00:00 - 21:00:00',
              }"
              placeholder="Chọn"
            ></el-time-picker>
          </template>
        </el-table-column>
        <el-table-column sortable label="Đón muộn(phút)" width="140" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.attendanceLeaveKids.minutePickupLate > 0">{{
              scope.row.attendanceLeaveKids.minutePickupLate
            }}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.absentStatus == 'Đi học'"
              size="mini"
              type="primary"
              @click="handleLeaveRowSave(scope.$index, scope.row)"
              >Lưu</el-button
            >
            <el-button v-else disabled size="mini" type="primary">Lưu</el-button>
            <el-button
              v-if="
                scope.row.attendanceLeaveKids.statusLeave &&
                scope.row.attendanceLeaveKids.timeLeaveKid != null
              "
              size="mini"
              type="success"
              @click="handleLeaveUpdateRowMethod(scope.$index, scope.row)"
              >Sửa</el-button
            >
            <el-button v-else disabled size="mini" type="success">Sửa</el-button>
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
          @change="getAttendanceLeaveChangeMonth()"
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
          @click="handleLeaveManyRowSave()"
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
    <AttendanceLeaveUpdate
      :dialogVisible="showDialogUpdateLeave"
      @dialog-close="closeDialogUpdateLeaveMethod"
      ref="AttendanceLeaveUpdate"
    />
  </div>
</template>

<script>
import AttendanceLeaveUpdate from "./AttendanceLeaveUpdate.vue";
import AttendanceService from "@/services/AttendanceService";
export default {
  components: {
    AttendanceLeaveUpdate,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      attendanceLeaveKidList: [],
      selectMonth: null,
      selectYear: 2020,
      idKidData: "",
      fullNameDialog: "",
      fullNameTitle: "",
      timeTest: "17:30",
      showDialogUpdateLeave: false,
      checkboxAllLeave: false,
      multipleSelectionLeave: [],
      loadingButton: false,
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
      this.checkboxAllLeave = false;
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      this.checkboxAllLeave = false;
    },
    handleSelectionChangeLeave(val) {
      this.multipleSelectionLeave = val;
    },
    changeCheckboxAllLeave() {
      this.attendanceLeaveKidList.forEach((x) => {
        if (x.absentStatus == "Đi học") {
          x.attendanceLeaveKids.statusLeave = this.checkboxAllLeave;
          if (!x.attendanceLeaveKids.statusLeave) {
            x.attendanceLeaveKids.timeLeaveKid = null;
            x.attendanceLeaveKids.minutePickupLate = 0;
          }
        }
      });
    },
    setNullTimeLeaveMethod(index, row) {
      if (!row.attendanceLeaveKids.statusLeave) {
        row.attendanceLeaveKids.timeLeaveKid = null;
        row.attendanceLeaveKids.minutePickupLate = 0;
      }
    },
    /**
     * lưu một row cho điểm danh về
     */
    handleLeaveRowSave(index, row) {
      if (row.attendanceLeaveKids.statusLeave) {
        if (row.attendanceLeaveKids.timeLeaveKid == null) {
          this.$message({
            message: "Chưa chọn giờ về",
            type: "error",
          });
          return;
        }
      }
      AttendanceService.saveLeaveOne(row.id, row)
        .then((resp) => {
          this.attendanceLeaveOneSave = resp.data.data;
          this.$message({
            message: "Lưu điểm danh về thành công",
            type: "success",
          });
          this.getAttendanceLeaveChangeMonth();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu điểm danh về thất bại",
            type: "error",
          });
        });
    },
    /**
     * lưu nhiều row cho điểm danh về
     */
    handleLeaveManyRowSave() {
      let kidList = this.multipleSelectionLeave;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      let BreakException = null;
      kidList.forEach((x) => {
        if (x.absentStatus != "Đi học") {
          this.$message({
            message: "Tất cả học sinh đã chọn phải ở trạng thái đi học",
            type: "error",
          });
          throw BreakException;
        }
        if (
          x.attendanceLeaveKids.statusLeave &&
          x.attendanceLeaveKids.timeLeaveKid == null
        ) {
          this.$message({
            message: "Chưa chọn giờ về cho học sinh đã chọn",
            type: "error",
          });
          throw BreakException;
        }
      });
      this.loadingButton = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu điểm danh về cho " + kidList.length + " ngày đã chọn?",
        "Lưu điểm danh về: " + this.fullNameDialog,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          AttendanceService.saveLeaveMany(kidList)
            .then((resp) => {
              this.attendanceLeaveManySave = resp.data.data;
              this.$message({
                message: "Lưu các ngày điểm danh về thành công",
                type: "success",
              });
              this.getAttendanceLeaveChangeMonth();
              setTimeout(() => {
                this.closeDialog();
              }, 500);
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "Lưu các ngày điểm danh về thất bại",
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
    handleLeaveUpdateRowMethod(index, row) {
      this.$refs.AttendanceLeaveUpdate.getDataLeaveRowInitial(row);
      this.showDialogUpdateLeave = true;
    },
    closeDialogUpdateLeaveMethod() {
      this.showDialogUpdateLeave = false;
      this.getAttendanceLeaveChangeMonth();
    },

    getAttendanceLeaveChangeMonth() {
      AttendanceService.getLeaveByIdKidOfMonth(
        this.idKidData,
        this.selectMonth,
        this.selectYear
      )
        .then((resp) => {
          this.attendanceLeaveKidList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.attendanceLeaveKidList = null;
        });
    },
    changeTimeLeave(index, row) {
      let timeLeave = row.attendanceLeaveKids.timeLeaveKid.split(":");
      let timeConfig = this.timeTest.split(":");
      let hour = timeLeave[0] - timeConfig[0];
      let minute = timeLeave[1] - timeConfig[1];
      let hourLate = hour * 60;
      let minuteLate = hourLate + minute;
      if (minuteLate > 0) {
        row.attendanceLeaveKids.minutePickupLate = minuteLate;
      } else {
        row.attendanceLeaveKids.minutePickupLate = 0;
      }
    },
    getAttendanceLeaveDetailInital(idKid, fullName) {
      this.idKidData = idKid;
      this.fullNameDialog = fullName;
      this.fullNameTitle = "Điểm danh về: " + fullName;
      this.getCurrentMonth();
      AttendanceService.getLeaveByIdKidOfMonth(idKid, this.selectMonth, this.selectYear)
        .then((resp) => {
          this.attendanceLeaveKidList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.attendanceLeaveKidList = null;
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
