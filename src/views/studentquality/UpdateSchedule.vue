<template>
  <div>
    <el-dialog
      :title="'THỜI KHÓA BIỂU ' + classNameData"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
    >
      <el-form
        label-width="140px"
        :model="tabAllDayInWeek"
        label-position="left"
        :rules="rules"
        ref="formAllTabSchedule"
      >
        <el-tabs type="card" @tab-click="handleClick" v-model="activeNameTab">
          <el-tab-pane label="Thứ 2" name="monday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabAllDayInWeek[0].scheduleInClassResponseList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                :max-height="$tableMaxHeight"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentSchedule"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="scope.row.contentSchedule"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_schedule_update'])"
                  label="Tác vụ"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addRowTableMonday(scope.row.sessionDay)"
                      >Thêm</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 0)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 3" name="tuesday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabAllDayInWeek[1].scheduleInClassResponseList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                :max-height="$tableMaxHeight"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentSchedule"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="scope.row.contentSchedule"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_schedule_update'])"
                  label="Tác vụ"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addRowTableTuesday(scope.row.sessionDay)"
                      >Thêm</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 1)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 4" name="wednesday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabAllDayInWeek[2].scheduleInClassResponseList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                :max-height="$tableMaxHeight"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentSchedule"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="scope.row.contentSchedule"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_schedule_update'])"
                  label="Tác vụ"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addRowTableWednesday(scope.row.sessionDay)"
                      >Thêm</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 2)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 5" name="thursday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabAllDayInWeek[3].scheduleInClassResponseList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                :max-height="$tableMaxHeight"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentSchedule"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="scope.row.contentSchedule"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_schedule_update'])"
                  label="Tác vụ"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addRowTableThursday(scope.row.sessionDay)"
                      >Thêm</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 0)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 6" name="friday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabAllDayInWeek[4].scheduleInClassResponseList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                :max-height="$tableMaxHeight"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentSchedule"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="scope.row.contentSchedule"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_schedule_update'])"
                  label="Tác vụ"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addRowTableFriday(scope.row.sessionDay)"
                      >Thêm</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 4)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 7" name="saturday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabAllDayInWeek[5].scheduleInClassResponseList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                :max-height="$tableMaxHeight"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentSchedule"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="scope.row.contentSchedule"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_schedule_update'])"
                  label="Tác vụ"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addRowTableSaturday(scope.row.sessionDay)"
                      >Thêm</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 5)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="CN" v-if="statusListWeekend.sunday" name="sunday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabAllDayInWeek[6].scheduleInClassResponseList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                border
                :max-height="$tableMaxHeight"
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentSchedule"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="scope.row.contentSchedule"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_schedule_update'])"
                  label="Tác vụ"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addRowTableSunday(scope.row.sessionDay)"
                      >Thêm</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 6)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div class="tab-infor-button">
        <el-button
          type="danger"
          size="medium"
          @click="closeDialogByButton('formAllTabSchedule')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          v-if="checkPermission(['studentQuality_schedule_update'])"
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm('formAllTabSchedule')"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import ScheduleService from "@/services/ScheduleService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      avatar: {},
      accountTypes: [],
      activeNameTab: "",
      subjectClass: "",
      subjectInClass: [],
      classNameData: "",
      timeSchedule: "",
      disabledIsMaster: false,
      isMasterAccountType: true,
      listSubject: [],
      listIdSubject: [],
      kkk: [],
      idClassCheck: "",
      tabDayInWeek: [],
      tabAllDayInWeek: [],
      teacherIconAppCreate: {
        teacherIconCreate1: [],
        teacherIconCreate2: [],
      },
      plusIconAppCreate: {
        plusIconCreate1: [],
        plusIconCreate2: [],
      },
      emloyeeCode: "ABCDE-123456",
      employeeStatusRadio: "Đang làm",
      value: "",
      checkIsClass: true,
      radiogender: "",
      appOptions: ["Sử dụng App Teacher", "Sử dụng App Plus"],
      loadingButton: false,
      formAllTabSchedule: {
        dayOfWeek: [
          { day: "Sáng", time: "7h-10h", content: "cccc sss" },
          { day: "Sáng", time: "10h-11h", content: "cccc sss" },
          { day: "Chiều", time: "10h-11h", content: "rrrr" },
          { day: "Tối", time: "10h-11h", content: "uuuuuu" },
        ],
      },
      statusListWeekend: {
        morningSaturday: "",
        afternoonSaturday: "",
        eveningSaturday: "",
        sunday: "",
      },
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["formAllTabSchedule"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
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
      this.loadingButton = true;
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          ScheduleService.create(this.tabAllDayInWeek)
            .then((response) => {
              console.log(response.data.data);
              this.$message({
                message: "Cập nhật thời khóa biểu thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
                //location.reload();
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Cập nhật thời khóa biểu thất bại",
                type: "error",
              });

              console.log(err);
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    deleteRow(index, day) {
      let sessionMorning = this.tabAllDayInWeek[
        day
      ].scheduleInClassResponseList.filter((item) => item.sessionDay == "Sáng");
      if (sessionMorning.length > 1) {
        this.tabAllDayInWeek[day].scheduleInClassResponseList.splice(index, 1);
      }

      let sessionAfternoon = this.tabAllDayInWeek[
        day
      ].scheduleInClassResponseList.filter(
        (item) => item.sessionDay == "Chiều"
      );
      if (sessionAfternoon.length > 1) {
        this.tabAllDayInWeek[day].scheduleInClassResponseList.splice(index, 1);
      }

      let sessionEvening = this.tabAllDayInWeek[
        day
      ].scheduleInClassResponseList.filter((item) => item.sessionDay == "Tối");
      if (sessionEvening.length > 1) {
        this.tabAllDayInWeek[day].scheduleInClassResponseList.splice(index, 1);
      }
    },
    addRowTableMonday(data) {
      let indexOf =
        this.tabAllDayInWeek[0].scheduleInClassResponseList.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.tabAllDayInWeek[0].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Sáng",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: this.timeSchedule,
          }
        );
      } else if (data == "Chiều") {
        this.tabAllDayInWeek[0].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Chiều",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: this.timeSchedule,
          }
        );
      } else if (data == "Tối") {
        this.tabAllDayInWeek[0].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Tối",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: this.timeSchedule,
          }
        );
      }
      let a = this.tabAllDayInWeek[0].scheduleInClassResponseList;
      console.log(a);
    },
    addRowTableTuesday(data) {
      let indexOf =
        this.tabAllDayInWeek[1].scheduleInClassResponseList.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.tabAllDayInWeek[1].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Sáng",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Chiều") {
        this.tabAllDayInWeek[1].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Chiều",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Tối") {
        this.tabAllDayInWeek[1].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Tối",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      }
    },
    addRowTableWednesday(data) {
      let indexOf =
        this.tabAllDayInWeek[2].scheduleInClassResponseList.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.tabAllDayInWeek[2].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Sáng",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Chiều") {
        this.tabAllDayInWeek[2].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Chiều",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Tối") {
        this.tabAllDayInWeek[2].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Tối",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      }
    },
    addRowTableThursday(data) {
      let indexOf =
        this.tabAllDayInWeek[3].scheduleInClassResponseList.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.tabAllDayInWeek[3].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Sáng",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Chiều") {
        this.tabAllDayInWeek[3].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Chiều",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Tối") {
        this.tabAllDayInWeek[3].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Tối",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      }
    },
    addRowTableFriday(data) {
      let indexOf =
        this.tabAllDayInWeek[4].scheduleInClassResponseList.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.tabAllDayInWeek[4].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Sáng",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Chiều") {
        this.tabAllDayInWeek[4].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Chiều",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Tối") {
        this.tabAllDayInWeek[0].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Tối",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      }
    },
    addRowTableSaturday(data) {
      let a = this.tabAllDayInWeek[5].scheduleInClassResponseList;
      console.log(a);
      let indexOf =
        this.tabAllDayInWeek[5].scheduleInClassResponseList.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.tabAllDayInWeek[5].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Sáng",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Chiều") {
        this.tabAllDayInWeek[5].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Chiều",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Tối") {
        this.tabAllDayInWeek[5].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Tối",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      }
    },
    addRowTableSunday(data) {
      let indexOf =
        this.tabAllDayInWeek[6].scheduleInClassResponseList.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.tabAllDayInWeek[6].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Sáng",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Chiều") {
        this.tabAllDayInWeek[6].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Chiều",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      } else if (data == "Tối") {
        this.tabAllDayInWeek[6].scheduleInClassResponseList.splice(
          indexOf + 1,
          0,
          {
            sessionDay: "Tối",
            contentSchedule: null,
            timeContent: null,
            timeSchedule: null,
          }
        );
      }
    },
    getScheduleInClassWeek(timeSchedule, idClass, timeDay, className) {
      this.classNameData = className;
      let a = timeSchedule;
      this.timeSchedule = a;
      console.log(a);
      if (timeDay == 2) {
        this.activeNameTab = "monday";
      }
      if (timeDay == 3) {
        this.activeNameTab = "tuesday";
      }
      if (timeDay == 4) {
        this.activeNameTab = "wednesday";
      }
      if (timeDay == 5) {
        this.activeNameTab = "thursday";
      }
      if (timeDay == 6) {
        this.activeNameTab = "friday";
      }
      if (timeDay == 7) {
        this.activeNameTab = "saturday";
      }
      if (timeDay == 8) {
        this.activeNameTab = "sunday";
      }
      ScheduleService.searchScheduleInClassWeek(a, idClass)
        .then((res) => {
          let b = (this.tabAllDayInWeek = res.data.data);
          console.log(b);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getStatusWeekend(
      morningSaturday,
      afternoonSaturday,
      eveningSaturday,
      sunday
    ) {
      this.statusListWeekend.morningSaturday = morningSaturday;
      this.statusListWeekend.afternoonSaturday = afternoonSaturday;
      this.statusListWeekend.eveningSaturday = eveningSaturday;
      this.statusListWeekend.sunday = sunday;
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
// /deep/.el-tabs__nav {
//   background: #a0a19ce0;
// }
// /deep/.el-tabs__item {
//   color: white;
// }
// /deep/.el-tabs__item.is-active {
//   color: white;
//   background: #67c23a;
// }
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
