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
        :data="attendanceEatKidList"
        :cell-style="tableRowStyleDetail"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChangeEat"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="selection"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column sortable label="Ngày" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attendanceDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="Người điểm danh" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.attendanceEatKids.lastModifieBy }}</div>
            <div>
              {{ scope.row.attendanceEatKids.lastModifieDate | formatDateTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="absentStatus"
          sortable
          label="Tình trạng đi học"
          align="center"
        ></el-table-column>

        <el-table-column
          v-if="configSchoolCommon.morningEat"
          align="center"
          width="60"
        >
          <template slot="header">
            Sáng
            <br />
            <el-checkbox
              @change="changeCheckboxAllEat('breakfast')"
              v-model="checkboxAllEatBreakfast"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.attendanceEatKids.breakfast"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="configSchoolCommon.secondMorningEat"
          align="center"
          width="80"
        >
          <template slot="header">
            Phụ sáng
            <br />
            <el-checkbox
              @change="changeCheckboxAllEat('secondBreakfast')"
              v-model="checkboxAllEatSecondBreakfast"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.attendanceEatKids.secondBreakfast"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="configSchoolCommon.lunchEat"
          align="center"
          width="60"
        >
          <template slot="header">
            Trưa
            <br />
            <el-checkbox
              @change="changeCheckboxAllEat('lunch')"
              v-model="checkboxAllEatLunch"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.attendanceEatKids.lunch"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="configSchoolCommon.afternoonEat"
          align="center"
          width="60"
        >
          <template slot="header">
            Chiều
            <br />
            <el-checkbox
              @change="changeCheckboxAllEat('afternoon')"
              v-model="checkboxAllEatAfternoon"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.attendanceEatKids.afternoon"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="configSchoolCommon.secondAfternoonEat"
          align="center"
          width="80"
        >
          <template slot="header">
            Phụ chiều
            <br />
            <el-checkbox
              @change="changeCheckboxAllEat('secondAfternoon')"
              v-model="checkboxAllEatSecondAfternoon"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.attendanceEatKids.secondAfternoon"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="configSchoolCommon.eveningEat"
          align="center"
          width="60"
        >
          <template slot="header">
            Tối
            <br />
            <el-checkbox
              @change="changeCheckboxAllEat('dinner')"
              v-model="checkboxAllEatDinner"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.attendanceEatKids.dinner"
            ></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="Tác vụ" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.attendanceEatKids.breakfast &&
                scope.row.attendanceEatKids.secondBreakfast &&
                scope.row.attendanceEatKids.lunch &&
                scope.row.attendanceEatKids.afternoon &&
                scope.row.attendanceEatKids.secondAfternoon &&
                scope.row.attendanceEatKids.dinner
              "
              size="mini"
              type="primary"
              style="width: 94px"
              @click="handleEatRowUnCheckboxAll(scope.$index, scope.row)"
              >Bỏ chọn</el-button
            >
            <el-button
              v-else
              size="mini"
              type="primary"
              style="width: 94px"
              @click="handleEatRowCheckboxAll(scope.$index, scope.row)"
              >Chọn tất cả</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleEatRowSave(scope.$index, scope.row)"
              >Lưu</el-button
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
          @change="getAttendanceEatChangeMonth()"
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
          @click="handleEatManyRowSave()"
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
  </div>
</template>

<script>
import AttendanceService from "@/services/AttendanceService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      attendanceEatKidList: [],
      selectMonth: null,
      selectYear: 2020,
      idKidData: "",
      fullNameDialog: "",
      fullNameTitle: "",
      timeTest: "17:30",
      showDialogUpdateLeave: false,
      multipleSelectionEat: [],
      loadingButton: false,
      attendanceEatOneSave: {},
      attendanceEatManySave: "",
      checkboxAllEatBreakfast: false,
      checkboxAllEatSecondBreakfast: false,
      checkboxAllEatLunch: false,
      checkboxAllEatAfternoon: false,
      checkboxAllEatSecondAfternoon: false,
      checkboxAllEatDinner: false,
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
      if (
        row.absentStatus == "Nghỉ có phép" ||
        row.absentStatus == "Nghỉ không phép"
      ) {
        return "color: red";
      } else if (row.absentStatus == "Chưa điểm danh") {
        return "color: #409EFF";
      }
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      this.setCheckboxAllEatHeaderFalse();
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      this.setCheckboxAllEatHeaderFalse();
    },
    handleSelectionChangeEat(val) {
      this.multipleSelectionEat = val;
    },
    changeCheckboxAllEat(type) {
      this.attendanceEatKidList.forEach((x) => {
        switch (type) {
          case "breakfast": {
            x.attendanceEatKids.breakfast = this.checkboxAllEatBreakfast;
            break;
          }
          case "secondBreakfast": {
            x.attendanceEatKids.secondBreakfast = this.checkboxAllEatSecondBreakfast;
            break;
          }
          case "lunch": {
            x.attendanceEatKids.lunch = this.checkboxAllEatLunch;
            break;
          }
          case "afternoon": {
            x.attendanceEatKids.afternoon = this.checkboxAllEatAfternoon;
            break;
          }
          case "secondAfternoon": {
            x.attendanceEatKids.secondAfternoon = this.checkboxAllEatSecondAfternoon;
            break;
          }
          case "dinner": {
            x.attendanceEatKids.dinner = this.checkboxAllEatDinner;
            break;
          }
        }
      });
    },
    handleEatRowCheckboxAll(index, row) {
      row.attendanceEatKids.breakfast = true;
      row.attendanceEatKids.secondBreakfast = true;
      row.attendanceEatKids.lunch = true;
      row.attendanceEatKids.afternoon = true;
      row.attendanceEatKids.secondAfternoon = true;
      row.attendanceEatKids.dinner = true;
    },
    handleEatRowUnCheckboxAll(index, row) {
      row.attendanceEatKids.breakfast = false;
      row.attendanceEatKids.secondBreakfast = false;
      row.attendanceEatKids.lunch = false;
      row.attendanceEatKids.afternoon = false;
      row.attendanceEatKids.secondAfternoon = false;
      row.attendanceEatKids.dinner = false;
    },
    setCheckboxAllEatHeaderFalse() {
      this.checkboxAllEatBreakfast = false;
      this.checkboxAllEatSecondBreakfast = false;
      this.checkboxAllEatLunch = false;
      this.checkboxAllEatAfternoon = false;
      this.checkboxAllEatSecondAfternoon = false;
      this.checkboxAllEatDinner = false;
    },
    /**
     * lưu một row cho điểm danh ăn
     */
    handleEatRowSave(index, row) {
      AttendanceService.saveEatOne(row.id, row)
        .then((resp) => {
          this.attendanceEatOneSave = resp.data.data;
          this.$message({
            message: "Lưu điểm danh ăn thành công",
            type: "success",
          });
          this.getAttendanceEatChangeMonth();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu điểm danh ăn thất bại",
            type: "error",
          });
        });
    },
    /**
     * lưu nhiều row cho điểm danh ăn
     */
    handleEatManyRowSave() {
      let kidList = this.multipleSelectionEat;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có ngày nào được chọn",
          type: "error",
        });
        return;
      }
      this.loadingButton = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu điểm danh ăn cho " +
          kidList.length +
          " ngày đã chọn?",
        "Lưu điểm danh ăn: " + this.fullNameDialog,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          AttendanceService.saveEatMany(kidList)
            .then((resp) => {
              this.attendanceEatManySave = resp.data.data;
              this.$message({
                message: "Lưu các ngày điểm danh ăn thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialog();
              }, 500);
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                message: "Lưu các ngày điểm danh ăn thất bại",
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

    getAttendanceEatChangeMonth() {
      AttendanceService.getEatByIdKidOfMonth(
        this.idKidData,
        this.selectMonth,
        this.selectYear
      )
        .then((resp) => {
          this.attendanceEatKidList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.attendanceEatKidList = null;
        });
    },
    getAttendanceEatDetailInital(idKid, fullName, schoolConfig) {
      this.configSchoolCommon = schoolConfig;
      this.idKidData = idKid;
      this.fullNameDialog = fullName;
      this.fullNameTitle = "Điểm danh ăn: " + fullName;
      this.getCurrentMonth();
      AttendanceService.getEatByIdKidOfMonth(
        idKid,
        this.selectMonth,
        this.selectYear
      )
        .then((resp) => {
          this.attendanceEatKidList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.attendanceEatKidList = null;
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