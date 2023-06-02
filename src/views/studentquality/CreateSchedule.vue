<template>
  <div>
    <el-dialog
      :title="'Thêm thời khóa biểu'"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
    >
      <el-form
        label-width="140px"
        label-position="left"
        :rules="rules"
        :model="createMultiSchedule"
        ref="createMultiSchedule"
      >
        <el-tabs type="card" @tab-click="handleClick" v-model="activeNameTab">
          <el-tab-pane label="Thứ 2" name="monday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="
                  createMultiSchedule.createTabAllSchedule[0].createTabDayInWeek
                "
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
                      v-model="scope.row.contentSchedule"
                      :rows="2"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Tác vụ" align="center" width="150">
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
                :data="
                  createMultiSchedule.createTabAllSchedule[1].createTabDayInWeek
                "
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
                      v-model="scope.row.contentSchedule"
                      :rows="2"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Tác vụ" align="center" width="150">
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
                :data="
                  createMultiSchedule.createTabAllSchedule[2].createTabDayInWeek
                "
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
                      v-model="scope.row.contentSchedule"
                      :rows="2"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Tác vụ" align="center" width="150">
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
                :data="
                  createMultiSchedule.createTabAllSchedule[3].createTabDayInWeek
                "
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
                      v-model="scope.row.contentSchedule"
                      :rows="2"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Tác vụ" align="center" width="150">
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
                      @click="deleteRow(scope.$index, 3)"
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
                :data="
                  createMultiSchedule.createTabAllSchedule[4].createTabDayInWeek
                "
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
                      type="text"
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
                      v-model="scope.row.contentSchedule"
                      :rows="2"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Tác vụ" align="center" width="150">
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
                :data="
                  createMultiSchedule.createTabAllSchedule[5].createTabDayInWeek
                "
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
                      v-model="scope.row.contentSchedule"
                      :rows="2"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Tác vụ" align="center" width="150">
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
          <el-tab-pane label="CN" name="sunday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :header-cell-style="tableHeaderColor"
                :data="
                  createMultiSchedule.createTabAllSchedule[6].createTabDayInWeek
                "
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
                      v-model="scope.row.contentSchedule"
                      :rows="2"
                      placeholder="Nhập nội dung học..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="Tác vụ" align="center" width="150">
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
      <div style="margin-top: 10px">
        <h3 style="display: inline-block; margin-right: 10px">Chủ đề:</h3>
        <el-input
          placeholder="Nhập chủ đề"
          v-model="createMultiSchedule.scheduleTitle"
          :rows="3"
          clearable
          style="width: 400px; display: inline-block"
        >
        </el-input>
      </div>
      <div style="margin-top: 50px">
        <div class="button-click-left;" style="display: inline-block">
          <el-date-picker
            v-model="createTimeSchedule"
            type="week"
            value-format="yyyy-MM-dd"
            format="Tuần WW(từ dd-MM-yyyy)"
            placeholder="Chọn tuần"
            :clearable="false"
            @change="getValueDateSchedule(createTimeSchedule)"
          ></el-date-picker>
          <el-select
            style="width: 400px; display: inline-block; margin-left: 5px"
            v-model="listCreateTimeSchedule"
            multiple
            @change="changeWeek()"
            placeholder="Tuần đã chọn"
          ></el-select>
        </div>
        <div
          style="text-align: center; display: inline-block; margin-left: 200px"
        >
          <el-select
            v-model="createMultiSchedule.listIdClass"
            class="button-left"
            placeholder="Chọn lớp"
            clearable
            style="margin-right: 10px; width: 300px"
            multiple="true"
          >
            <el-option
              v-for="item in listClass"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="tab-infor-button">
        <el-button
          type="danger"
          size="medium"
          @click="closeDialogByButton('createMultiSchedule')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm('createMultiSchedule')"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ScheduleService from "@/services/ScheduleService";
import TeacherService from "@/services/TeacherService";
import moment from "moment";
import {mapActions, mapState} from "vuex";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      createTimeSchedule: "",
      listTimeSchedule: "",
      listCreateTimeSchedule: [],
      activeNameTab: "monday",
      value: "",
      listClass: [],
      loadingButton: false,
      createMultiSchedule: {
        createTabAllSchedule: [
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
        ],
        weekSchedule: [],
        listIdClass: "",
        scheduleTitle: "",
      },
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    changeWeek() {
      let c = this.listCreateTimeSchedule;
      this.createMultiSchedule.weekSchedule = [];
      c.forEach((element) => {
        {
          let date = element.slice(-11, -1);
          var newdate = date.split("-").reverse().join("-");
          this.createMultiSchedule.weekSchedule.push(newdate);
        }
      });
    },
    closeDialog() {
      this.$refs["createMultiSchedule"].resetFields();
      this.$emit("dialog-close");
      this.resetData();
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.resetData();
    },
    resetData() {
      this.activeNameTab = "monday";
      this.createMultiSchedule.scheduleTitle = "";
      this.createMultiSchedule.listIdClass = [];
      this.listCreateTimeSchedule = [];
      this.createMultiSchedule.createTabAllSchedule.forEach((x) => {
        x.createTabDayInWeek.forEach((y) => {
          y.timeContent = "";
          y.contentSchedule = "";
        });
      });

      // for (let i = 0; i < this.createMultiSchedule.length(); i++) {
      //   for (
      //     let j = 0;
      //     j < this.createMultiSchedule.createTabAllSchedule[i].length();
      //     j++
      //   ) {
      //     this.createMultiSchedule.createTabAllSchedule[i].createTabDayInWeek[
      //       j
      //     ].timeContent = "";
      //     this.createMultiSchedule.createTabAllSchedule[i].createTabDayInWeek[
      //       j
      //     ].contentSchedule = "";
      //   }
      // }
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
      let a = this.createMultiSchedule;
      console.log(a);
      if (
        this.createMultiSchedule.listIdClass.length > 0 &&
        this.createMultiSchedule.weekSchedule.length > 0
      ) {
        ScheduleService.createMultiScheduleForClass(this.createMultiSchedule)
          .then((response) => {
            console.log(response.data.data);
            this.$message({
              message: "Thêm mới thời khóa biểu thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton(fromData);
            }, 500);
          })
          .catch((err) => {
            this.$message({
              message: "Thêm mới thời khóa biểu thất bại",
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
        this.$message({
          message: "Bạn phải chọn lớp và tuần áp dụng",
          type: "error",
        });
      }
    },
    //get class for teacher
    getClassListTeacher() {
      TeacherService.getClassInTeacher()
        .then((resp) => {
          this.listClass = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllClass() {
      if (this.getAppTypeUserLogin == "plus") {

            this.listClass = mapState(['serverDataClass'])

      } else if (this.getAppTypeUserLogin == "teacher") {
        this.getClassListTeacher();
      }
    },
    deleteRow(index, day) {
      let sessionMorning = this.createMultiSchedule.createTabAllSchedule[
        day
      ].createTabDayInWeek.filter((item) => item.sessionDay == "Sáng");
      if (sessionMorning.length > 1) {
        this.createMultiSchedule.createTabAllSchedule[
          day
        ].createTabDayInWeek.splice(index, 1);
      }

      let sessionAfternoon = this.createMultiSchedule.createTabAllSchedule[
        day
      ].createTabDayInWeek.filter((item) => item.sessionDay == "Chiều");
      if (sessionAfternoon.length > 1) {
        this.createMultiSchedule.createTabAllSchedule[
          day
        ].createTabDayInWeek.splice(index, 1);
      }

      let sessionEvening = this.createMultiSchedule.createTabAllSchedule[
        day
      ].createTabDayInWeek.filter((item) => item.sessionDay == "Tối");
      if (sessionEvening.length > 1) {
        this.createMultiSchedule.createTabAllSchedule[
          day
        ].createTabDayInWeek.splice(index, 1);
      }
    },
    addRowTableMonday(data) {
      let indexOf =
        this.createMultiSchedule.createTabAllSchedule[0].createTabDayInWeek.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.createMultiSchedule.createTabAllSchedule[0].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[0].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[0].createTabDayInWeek.splice(
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
    },
    addRowTableTuesday(data) {
      let indexOf =
        this.createMultiSchedule.createTabAllSchedule[1].createTabDayInWeek.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.createMultiSchedule.createTabAllSchedule[1].createTabDayInWeek.splice(
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
        this.createMultiSchedulecreateTabAllSchedule[1].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[1].createTabDayInWeek.splice(
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
    },
    addRowTableWednesday(data) {
      let indexOf =
        this.createMultiSchedule.createTabAllSchedule[2].createTabDayInWeek.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.createMultiSchedule.createTabAllSchedule[2].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[2].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[2].createTabDayInWeek.splice(
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
    },
    addRowTableThursday(data) {
      let indexOf =
        this.createMultiSchedule.createTabAllSchedule[3].createTabDayInWeek.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.createMultiSchedule.createTabAllSchedule[3].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[3].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[3].createTabDayInWeek.splice(
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
    },
    addRowTableFriday(data) {
      let indexOf =
        this.createMultiSchedule.createTabAllSchedule[4].createTabDayInWeek.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.createMultiSchedule.createTabAllSchedule[4].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[4].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[4].createTabDayInWeek.splice(
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
    },
    addRowTableSaturday(data) {
      let indexOf =
        this.createMultiSchedule.createTabAllSchedule[5].createTabDayInWeek.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.createMultiSchedule.createTabAllSchedule[5].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[5].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[5].createTabDayInWeek.splice(
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
    },
    addRowTableSunday(data) {
      let indexOf =
        this.createMultiSchedule.createTabAllSchedule[6].createTabDayInWeek.findIndex(
          (element) => element.sessionDay === data
        );
      if (data == "Sáng") {
        this.createMultiSchedule.createTabAllSchedule[6].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[6].createTabDayInWeek.splice(
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
        this.createMultiSchedule.createTabAllSchedule[6].createTabDayInWeek.splice(
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
    },

    getValueDateSchedule(createTimeSchedule) {
      this.createTimeSchedule = createTimeSchedule;
      let a = this.createTimeSchedule;
      let weeknumber = moment(a, "YYYY-MM-DD").isoWeek();
      let formatweek =
        "Tuần " + weeknumber + "(từ " + moment(a).format("DD-MM-YYYY") + ")";
      let indexOfFormatWeek = this.listCreateTimeSchedule.indexOf(formatweek);
      if (indexOfFormatWeek == -1) {
        this.listCreateTimeSchedule.push(formatweek);
      } else {
        this.listCreateTimeSchedule.splice(indexOfFormatWeek, 0);
      }
      let indexOfCreateTimeSchedule =
        this.createMultiSchedule.weekSchedule.indexOf(a);
      if (indexOfCreateTimeSchedule == -1) {
        this.createMultiSchedule.weekSchedule.push(a);
      } else {
        this.createMultiSchedule.weekSchedule.splice(
          indexOfCreateTimeSchedule,
          0
        );
      }
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
