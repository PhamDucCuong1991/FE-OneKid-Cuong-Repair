<template>
  <div>
    <div style="margin-top: 5px">
      <div
        class="button-click-left"
        style="margin-bottom: -20px; position: relative; z-index: 1"
      >
        <el-date-picker
          class="button-left"
          style="width: 135px"
          v-model="dataSearch.date"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          placeholder="Chọn ngày"
          @change="getSearchAllAttendance()"
        >
        </el-date-picker>
        <el-select
          style="width: 190px"
          class="button-left"
          clearable
          v-model="dataSearch.status"
          @change="getSearchAllAttendance()"
          placeholder="Trạng thái chấm công"
        >
          <el-option
            v-for="item in attendanceStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          class="button-left"
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
          v-model="dataSearch.nameOrPhone"
          @keyup.enter.native="getSearchAllAttendance()"
          clearable
          @clear="getSearchAllAttendance()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getSearchAllAttendance()"
          ></el-button>
        </el-input>
      </div>
    </div>
    <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
      <!-- Chi tiết ngày-->
      <el-tab-pane label="Chi tiết ngày" name="detailDay">
        <el-table
          ref="multipleTable"
          :empty-text="textTable"
          v-loading="loadingData"
          :element-loading-text="$tableLoadding"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)"
          highlight-current-row
          :data="attendanceDetailDateList"
          :cell-style="tableRowStyleDetail"
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          border
        >
          <el-table-column
            type="selection"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            type="index"
            label="STT"
            align="center"
          ></el-table-column>
          <el-table-column
            label="Họ tên"
            prop="infoEmployeeResponse.fullName"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            label="Số điện thoại"
            prop="infoEmployeeResponse.phone"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column label="Trạng thái" align="center" min-width="130">
            <template slot-scope="scope">
              <span v-if="!scope.row.arrive">Chưa chấm công</span>
              <span v-else>Đã chấm công</span>
            </template>
          </el-table-column>
          <el-table-column label="Sáng" align="center">
            <el-table-column label="Đi làm" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-circle-check"
                  v-if="scope.row.attendanceDetail.morning"
                  style="color: #409eff; font-size: 18px"
                />
              </template>
            </el-table-column>
            <el-table-column label="Có phép" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-circle-close"
                  v-if="scope.row.attendanceDetail.morningYes"
                  style="color: #f56c6c; font-size: 18px"
                />
              </template>
            </el-table-column>
            <el-table-column label="Ko phép" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-error"
                  v-if="scope.row.attendanceDetail.morningNo"
                  style="color: #f56c6c; font-size: 18px"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="Chiều" align="center">
            <el-table-column label="Đi làm" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-circle-check"
                  v-if="scope.row.attendanceDetail.afternoon"
                  style="font-size: 18px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Có phép" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-circle-close"
                  v-if="scope.row.attendanceDetail.afternoonYes"
                  style="color: #f56c6c; font-size: 18px"
                />
              </template>
            </el-table-column>
            <el-table-column label="Ko phép" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-error"
                  v-if="scope.row.attendanceDetail.afternoonNo"
                  style="color: #f56c6c; font-size: 18px"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="Tối" align="center">
            <el-table-column label="Đi làm" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-circle-check"
                  v-if="scope.row.attendanceDetail.evening"
                  style="font-size: 18px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Có phép" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-circle-close"
                  v-if="scope.row.attendanceDetail.eveningYes"
                  style="color: #f56c6c; font-size: 18px"
                />
              </template>
            </el-table-column>
            <el-table-column label="Ko phép" align="center" width="70" header>
              <template slot-scope="scope">
                <i
                  class="el-icon-error"
                  v-if="scope.row.attendanceDetail.eveningNo"
                  style="color: #f56c6c; font-size: 18px"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="Giờ đến" width="70" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.attendanceDetail.arriveTime | formatTime
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Giờ về" width="70" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.attendanceDetail.leaveTime | formatTime
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Đến muộn(phút)" width="115" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.attendanceDetail.minuteArriveLate > 0">{{
                scope.row.attendanceDetail.minuteArriveLate
              }}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="Về sớm(phút)" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.attendanceDetail.minuteLeaveSoon > 0">{{
                scope.row.attendanceDetail.minuteLeaveSoon
              }}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column
            label="Tác vụ"
            fixed="right"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.arrive ? false : true"
                size="mini"
                type="success"
                @click="handleShowDetailDate(scope.$index, scope.row)"
                >{{ $t("button.view") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div style="float: right; margin: 15px 0">
          <el-dropdown @command="handleCommandAction">
            <el-button class="button-bottom" type="success">
              Tác vụ
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu class="el-dropdown-menu-container">
              <el-dropdown-item command="exportDay"
                >Xuất theo ngày</el-dropdown-item
              >
              <el-dropdown-item command="exportMonth"
                >Xuất theo tháng</el-dropdown-item
              >
              <el-dropdown-item command="exportAll"
                >Xuất tổng hợp</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-tab-pane>

      <!-- Chấm công đến -->
      <el-tab-pane
        v-if="checkPermission(['attendanceEmployee_attendance_update'])"
        label="Chấm công đến"
        name="attendanceArrive"
      >
        <el-table
          ref="multipleTable"
          :empty-text="textTableArrive"
          v-loading="loadingData"
          :element-loading-text="$tableLoadding"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)"
          highlight-current-row
          :data="responseArriveList"
          :cell-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          @selection-change="handleSelectionChangeArrive"
          border
        >
          <el-table-column
            type="selection"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            type="index"
            label="STT"
            align="center"
            width="50"
            fixed
          ></el-table-column>
          <el-table-column
            prop="attendanceInfoEmployee.fullName"
            label="Họ tên"
            min-width="120"
            fixed
          ></el-table-column>
          <el-table-column
            prop="attendanceInfoEmployee.phone"
            label="Số điện thoại"
            width="100"
          ></el-table-column>
          <el-table-column label="Sáng" align="center">
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Đi làm</span>
                <br />
                <el-checkbox
                  @change="changeAllMorning(scope.$index, 1)"
                  v-model="checkboxAllMorning1"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.morning == true ? false : true
                  "
                  @change="checkRowMorningDay(1, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.morning"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Có phép</span>
                <br />
                <el-checkbox
                  @change="changeAllMorning(scope.$index, 2)"
                  v-model="checkboxAllMorning2"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.morning == true ? false : true
                  "
                  @change="checkRowMorningDay(2, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.morningYes"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Ko phép</span>
                <br />
                <el-checkbox
                  @change="changeAllMorning(scope.$index, 3)"
                  v-model="checkboxAllMorning3"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.morning == true ? false : true
                  "
                  @change="checkRowMorningDay(3, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.morningNo"
                ></el-checkbox>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- v-if="configSchoolCommon.afternoonAttendanceArrive" -->
          <el-table-column label="Chiều" align="center">
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Đi làm</span>
                <br />
                <el-checkbox
                  @change="changeAllAfternoon(scope.$index, 1)"
                  v-model="checkboxAllAfternoon1"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.afternoon == true ? false : true
                  "
                  @change="checkRowAfternoonDay(1, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.afternoon"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Có phép</span>
                <br />
                <el-checkbox
                  @change="changeAllAfternoon(scope.$index, 2)"
                  v-model="checkboxAllAfternoon2"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.afternoon == true ? false : true
                  "
                  @change="checkRowAfternoonDay(2, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.afternoonYes"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Ko phép</span>
                <br />
                <el-checkbox
                  @change="changeAllAfternoon(scope.$index, 3)"
                  v-model="checkboxAllAfternoon3"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.afternoon == true ? false : true
                  "
                  @change="checkRowAfternoonDay(3, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.afternoonNo"
                ></el-checkbox>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- v-if="configSchoolCommon.eveningAttendanceArrive" -->
          <el-table-column label="Tối" align="center">
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Đi làm</span>
                <br />
                <el-checkbox
                  @change="changeAllEvening(scope.$index, 1)"
                  v-model="checkboxAllEvening1"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.evening == true ? false : true
                  "
                  @change="checkRowEveningDay(1, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.evening"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Có phép</span>
                <br />
                <el-checkbox
                  @change="changeAllEvening(scope.$index, 2)"
                  v-model="checkboxAllEvening2"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.evening == true ? false : true
                  "
                  @change="checkRowEveningDay(2, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.eveningYes"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60">
              <template slot="header" slot-scope="scope">
                <span class="second-title">Ko phép</span>
                <br />
                <el-checkbox
                  @change="changeAllEvening(scope.$index, 3)"
                  v-model="checkboxAllEvening3"
                ></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    scope.row.attendanceConfig.evening == true ? false : true
                  "
                  @change="checkRowEveningDay(3, scope.row)"
                  v-model="scope.row.arriveEmployeeDate.eveningNo"
                ></el-checkbox>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="Giờ đến" width="132">
            <template slot-scope="scope">
              <el-time-picker
                type="time"
                value-format="HH:mm"
                format="HH:mm"
                :clearable="false"
                style="width: 85%"
                size="mini"
                v-if="
                  !scope.row.arriveEmployeeDate.morning &&
                    !scope.row.arriveEmployeeDate.afternoon &&
                    !scope.row.arriveEmployeeDate.evening
                "
                disabled
                v-model="scope.row.arriveEmployeeDate.arriveTime"
                :picker-options="{
                  selectableRange: '06:00:00 - 23:59:00',
                }"
                placeholder="Chọn"
              ></el-time-picker>
              <el-time-picker
                v-else
                type="time"
                value-format="HH:mm"
                :clearable="false"
                format="HH:mm"
                style="width: 85%"
                size="mini"
                v-model="scope.row.arriveEmployeeDate.arriveTime"
                :picker-options="{
                  selectableRange: '06:00:00 - 23:59:00',
                }"
                placeholder="Chọn"
                @change="changeTimeLeaveCustom(scope.row)"
              ></el-time-picker>
            </template>
          </el-table-column>
          <el-table-column
            label="Đi muộn(Phút)"
            width="130"
            align="center"
            class="second-title"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.arriveEmployeeDate.minuteArriveLate > 0">{{
                scope.row.arriveEmployeeDate.minuteArriveLate
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Tác vụ"
            width="170"
            align="center"
          >
            <template slot-scope="scope">
              <!-- //check config nhà trường  -->
              <span style="margin-right: 10px">
                <el-button
                  :loading="scope.row.loadingSave"
                  size="mini"
                  type="primary"
                  @click="handleArriveRowSave(scope.row)"
                  >{{ $t("button.save") }}</el-button
                >
                <el-button
                  v-if="
                    scope.row.arriveEmployeeDate.arriveTime != null &&
                      scope.row.showEdit
                  "
                  @click="handleArriveUpdateRowMethod(scope.$index, scope.row)"
                  size="mini"
                  type="success"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button v-else size="mini" type="success" disabled>{{
                  $t("button.update")
                }}</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="checkPermission(['attendanceEmployee_attendance_update'])"
          style="float: right; margin: 15px 0"
        >
          <el-button
            type="success"
            class="button-bottom"
            :loading="loadingButtonSaveArriveDate"
            @click="handleArriveManyRowSave()"
          >
            <i class="el-icon-circle-check" />
            Lưu chấm công đến
          </el-button>
          <el-dropdown @command="handleCommandAction">
            <el-button class="button-bottom" type="success">
              Tác vụ
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu class="el-dropdown-menu-container">
              <el-dropdown-item command="exportDay"
                >Xuất theo ngày</el-dropdown-item
              >
              <el-dropdown-item command="exportMonth"
                >Xuất theo tháng</el-dropdown-item
              >
              <el-dropdown-item command="exportAll"
                >Xuất tổng hợp</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-tab-pane>

      <!-- Chấm công về -->
      <el-tab-pane
        v-if="checkPermission(['attendanceEmployee_attendance_update'])"
        label="Chấm công về"
        name="attendanceLeave"
      >
        <el-table
          ref="multipleTable"
          :empty-text="textTableLeave"
          v-loading="loadingData"
          :element-loading-text="$tableLoadding"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)"
          highlight-current-row
          :data="responseLeaveList"
          :cell-style="tableRowLeaveStyle"
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          @selection-change="handleSelectionChangeLeave"
          border
        >
          <el-table-column
            fixed
            type="selection"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            fixed
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            fixed
            prop="fullName"
            label="Họ và tên"
            min-width="200"
            ><template slot-scope="scope">
              <span>{{ scope.row.attendanceInfoEmployee.fullName }}</span>
            </template></el-table-column
          >
          <el-table-column
            prop="unit"
            align="center"
            label="Trạng thái đi làm"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == true">Đã chấm công</span>
              <span v-else>Chưa chấm công</span>
            </template>
          </el-table-column>
          <el-table-column prop="number" align="center" min-width="80">
            <template slot="header" slot-scope="scope">
              <span>Đã về</span>
              <br />
              <el-checkbox
                v-model="checkboxAllLeave"
                @change="changeAllLeave(scope.$index)"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                v-if="scope.row.arrive"
                @change="checkRowLeave(scope.row)"
                v-model="scope.row.attendanceLeaveEmployee.leave"
              ></el-checkbox>

              <el-checkbox
                disabled
                v-else
                v-model="scope.row.attendanceLeaveEmployee.leave"
              ></el-checkbox> </template
          ></el-table-column>

          <el-table-column align="center" label="Giờ về" width="132">
            <template slot-scope="scope">
              <el-time-picker
                type="time"
                value-format="HH:mm"
                format="HH:mm"
                :clearable="false"
                style="width: 85%"
                size="mini"
                v-if="scope.row.arrive"
                @change="getTimeLeave(scope.row)"
                v-model="scope.row.attendanceLeaveEmployee.leaveTime"
                :picker-options="{
                  selectableRange: '06:00:00 - 23:59:00',
                }"
                placeholder="Chọn"
              ></el-time-picker>
              <el-time-picker
                v-else
                disabled
                type="time"
                value-format="HH:mm"
                format="HH:mm"
                :clearable="false"
                style="width: 85%"
                size="mini"
                v-model="scope.row.attendanceLeaveEmployee.leaveTime"
                :picker-options="{
                  selectableRange: '06:00:00 - 23:59:00',
                }"
                placeholder="Chọn"
              ></el-time-picker>
            </template>
          </el-table-column>

          <el-table-column
            label="Về sớm(Phút)"
            width="130"
            align="center"
            class="second-title"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.attendanceLeaveEmployee.minuteLeaveSoon > 0"
                >{{ scope.row.attendanceLeaveEmployee.minuteLeaveSoon }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            label="Tác vụ"
            fixed="right"
            width="170"
            align="center"
          >
            <template slot-scope="scope">
              <!-- //check config nhà trường  -->
              <span style="margin-right: 10px">
                <el-button
                  :disabled="!scope.row.arrive"
                  :loading="scope.row.loadingSave"
                  size="mini"
                  type="primary"
                  @click="handleLeaveRowSave(scope.row)"
                  >{{ $t("button.save") }}</el-button
                >
                <el-button
                  v-if="
                    scope.row.attendanceLeaveEmployee.leaveTime != null &&
                      scope.row.attendanceLeaveEmployee.leave &&
                      scope.row.showEdit
                  "
                  size="mini"
                  type="success"
                  @click="handleLeaveUpdateRowMethod(scope.$index, scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button v-else size="mini" type="success" disabled>{{
                  $t("button.update")
                }}</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="checkPermission(['attendanceEmployee_attendance_update'])"
          style="float: right; margin: 15px 0"
        >
          <el-button
            type="success"
            class="button-bottom"
            :loading="loadingButtonSaveLeaveDate"
            @click="handleLeaveManyRowSave()"
          >
            <i class="el-icon-circle-check" />
            Lưu chấm công về
          </el-button>
          <el-dropdown @command="handleCommandAction">
            <el-button class="button-bottom" type="success">
              Tác vụ
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu class="el-dropdown-menu-container">
              <el-dropdown-item command="exportDay"
                >Xuất theo ngày</el-dropdown-item
              >
              <el-dropdown-item command="exportMonth"
                >Xuất theo tháng</el-dropdown-item
              >
              <el-dropdown-item command="exportAll"
                >Xuất tổng hợp</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-tab-pane>

      <!-- Chấm ăn -->
      <el-tab-pane label="Chấm ăn" name="attendanceEat">
        <el-table
          ref="multipleTable"
          :empty-text="textTableEat"
          v-loading="loadingData"
          :element-loading-text="$tableLoadding"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)"
          highlight-current-row
          :data="responseEatList"
          :cell-style="tableRowStyleEat"
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          @selection-change="handleSelectionChangeEat"
          border
        >
          <el-table-column
            fixed
            type="selection"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            fixed
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column fixed prop="name" label="Họ và tên" min-width="170"
            ><template slot-scope="scope">
              <span>{{ scope.row.attendanceInfoEmployee.fullName }}</span>
            </template></el-table-column
          >
          <el-table-column
            prop="unit"
            align="center"
            label="Chấm công ăn"
            min-width="130"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.attendanceEatEmployee.eat">Đã chấm ăn</span>
              <span v-else>Chưa chấm ăn</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unit"
            align="center"
            label="Trạng thái đi làm"
            min-width="100"
          >
            <el-table-column label="Sáng" width="70" align="center">
              <template
                slot-scope="scope"
                v-if="scope.row.arriveEmployeeDate != null"
              >
                <span v-if="scope.row.arriveEmployeeDate.morning">
                  <el-tooltip effect="dark" content="Đi làm" placement="top">
                    <i
                      class="el-icon-circle-check"
                      style="color: #409eff; font-size: 18px"
                    />
                  </el-tooltip>
                </span>
                <span v-else-if="scope.row.arriveEmployeeDate.morningYes">
                  <el-tooltip
                    effect="dark"
                    content="Nghỉ có phép"
                    placement="top"
                  >
                    <i
                      class="el-icon-circle-close"
                      style="color: #f56c6c; font-size: 18px"
                    /> </el-tooltip
                ></span>
                <span v-else-if="scope.row.arriveEmployeeDate.morningNo">
                  <el-tooltip
                    effect="dark"
                    content="Nghỉ không phép"
                    placement="top"
                  >
                    <i
                      class="el-icon-error"
                      style="color: #f56c6c; font-size: 18px"
                    /> </el-tooltip
                ></span>
              </template>
            </el-table-column>
            <el-table-column label="Chiều" width="70" align="center">
              <template
                slot-scope="scope"
                v-if="scope.row.arriveEmployeeDate != null"
              >
                <span v-if="scope.row.arriveEmployeeDate.afternoon">
                  <el-tooltip effect="dark" content="Đi làm" placement="top">
                    <i
                      class="el-icon-circle-check"
                      style="color: #409eff; font-size: 18px"
                    /> </el-tooltip
                ></span>
                <span v-else-if="scope.row.arriveEmployeeDate.afternoonYes">
                  <el-tooltip
                    effect="dark"
                    content="Nghỉ có phép"
                    placement="top"
                  >
                    <i
                      class="el-icon-circle-close"
                      style="color: #f56c6c; font-size: 18px"
                    /> </el-tooltip
                ></span>
                <span
                  v-else-if="scope.row.arriveEmployeeDate.afternoonNo"
                  class="absent-no"
                >
                  <el-tooltip
                    effect="dark"
                    content="Nghỉ không phép"
                    placement="top"
                  >
                    <i
                      class="el-icon-error"
                      style="color: #f56c6c; font-size: 18px"
                    /> </el-tooltip
                ></span>
              </template>
            </el-table-column>
            <el-table-column label="Tối" width="70" align="center">
              <template
                slot-scope="scope"
                v-if="scope.row.arriveEmployeeDate != null"
              >
                <span v-if="scope.row.arriveEmployeeDate.evening">
                  <el-tooltip effect="dark" content="Đi làm" placement="top">
                    <i
                      class="el-icon-circle-check"
                      style="color: #409eff; font-size: 18px"
                    /> </el-tooltip
                ></span>
                <span
                  v-else-if="scope.row.arriveEmployeeDate.eveningYes"
                  class="absent-yes"
                >
                  <el-tooltip
                    effect="dark"
                    content="Nghỉ có phép"
                    placement="top"
                  >
                    <i
                      class="el-icon-circle-close"
                      style="color: #f56c6c; font-size: 18px"
                    /> </el-tooltip
                ></span>
                <span
                  v-else-if="scope.row.arriveEmployeeDate.eveningNo"
                  class="absent-no"
                >
                  <el-tooltip
                    effect="dark"
                    content="Nghỉ không phép"
                    placement="top"
                  >
                    <i
                      class="el-icon-error"
                      style="color: #f56c6c; font-size: 18px"
                    /> </el-tooltip
                ></span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="number" align="center" min-width="80">
            <template slot="header" slot-scope="scope">
              <span>Sáng</span>
              <br />
              <el-checkbox
                @change="changeCheckboxAllEat('breakfast', scope.row)"
                v-model="checkboxAllEatBreakfast"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                :disabled="
                  scope.row.attendanceEmployeeConfig.breakfast ? false : true
                "
                v-model="scope.row.attendanceEatEmployee.breakfast"
              ></el-checkbox> </template
          ></el-table-column>
          <el-table-column prop="number" align="center" min-width="80">
            <template slot="header" slot-scope="scope">
              <span>Trưa</span>
              <br />
              <el-checkbox
                @change="changeCheckboxAllEat('lunch', scope.row)"
                v-model="checkboxAllEatLunch"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                :disabled="
                  scope.row.attendanceEmployeeConfig.lunch ? false : true
                "
                v-model="scope.row.attendanceEatEmployee.lunch"
              ></el-checkbox> </template
          ></el-table-column>
          <el-table-column prop="number" align="center" min-width="80">
            <template slot="header" slot-scope="scope">
              <span>Tối</span>
              <br />
              <el-checkbox
                @change="changeCheckboxAllEat('dinner', scope.row)"
                v-model="checkboxAllEatDinner"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                :disabled="
                  scope.row.attendanceEmployeeConfig.dinner ? false : true
                "
                v-model="scope.row.attendanceEatEmployee.dinner"
              ></el-checkbox> </template
          ></el-table-column>

          <el-table-column
            v-if="checkPermission(['attendanceEmployee_attendance_update'])"
            label="Tác vụ"
            fixed="right"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="
                  ((scope.row.attendanceEmployeeConfig.breakfast &&
                    scope.row.attendanceEatEmployee.breakfast) ||
                    !scope.row.attendanceEmployeeConfig.breakfast) &&
                    ((scope.row.attendanceEmployeeConfig.lunch &&
                      scope.row.attendanceEatEmployee.lunch) ||
                      !scope.row.attendanceEmployeeConfig.lunch) &&
                    ((scope.row.attendanceEmployeeConfig.dinner &&
                      scope.row.attendanceEatEmployee.dinner) ||
                      !scope.row.attendanceEmployeeConfig.dinner)
                "
                size="mini"
                type="primary"
                style="width: 94px"
                @click="handleEatRowCheckboxAll(scope.$index, scope.row, false)"
                >Bỏ chọn</el-button
              >
              <el-button
                v-else
                size="mini"
                type="primary"
                style="width: 94px"
                @click="handleEatRowCheckboxAll(scope.$index, scope.row, true)"
                >Chọn tất cả</el-button
              >
              <el-button
                :loading="scope.row.loadingSave"
                size="mini"
                type="success"
                @click="handleEatRowSave(scope.$index, scope.row)"
                >{{ $t("button.save") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="checkPermission(['attendanceEmployee_attendance_update'])"
          style="float: right; margin: 15px 0"
        >
          <el-button
            type="success"
            class="button-bottom"
            :loading="loadingButtonSaveEatDate"
            @click="handleEatManyRowSave()"
          >
            <i class="el-icon-circle-check" />
            Lưu chấm công ăn
          </el-button>
          <el-dropdown @command="handleCommandAction">
            <el-button class="button-bottom" type="success">
              Tác vụ
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu class="el-dropdown-menu-container">
              <el-dropdown-item command="exportDay"
                >Xuất theo ngày</el-dropdown-item
              >
              <el-dropdown-item command="exportMonth"
                >Xuất theo tháng</el-dropdown-item
              >
              <el-dropdown-item command="exportAll"
                >Xuất tổng hợp</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-tab-pane>
      <!-- <el-dropdown @command="handleCommandAction">
        <el-button class="button-bottom" type="success">
          Tác vụ
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu class="el-dropdown-menu-container">
          <el-dropdown-item command="exportDay">Xuất theo ngày</el-dropdown-item>
          <el-dropdown-item command="exportMonth">Xuất theo tháng</el-dropdown-item>
          <el-dropdown-item command="exportAll">Xuất tổng hợp</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </el-tabs>

    <AttendanceArriveEmployeeUpdate
      :dialogVisible="showDialogUpdateArrive"
      @dialog-close="closeDialogUpdateArriveMethod()"
      ref="AttendanceArriveEmployeeUpdate"
    />
    <AttendanceLeaveEmployeeUpdate
      :dialogVisible="showDialogUpdateLeave"
      @dialog-close="closeDialogUpdateLeaveMethod()"
      ref="AttendanceLeaveEmployeeUpdate"
    />
    <AttendanceView
      :dialogVisible="showDialogViewDetailDate"
      @dialog-close="closeDialogViewDetailDateMethod()"
      ref="AttendanceView"
    />
    <CreateAttendanceEmployeeCustomExcel
      :dialogVisible="showDialogCreateAttendanceKidCustomExcel"
      @dialog-close="closeDialogAttendanceKidCustomExcel()"
      ref="CreateAttendanceEmployeeCustomExcel"
    />
  </div>
</template>

<script>
import moment from "moment";
import checkPermission from "@/utils/permission.js";
import AttendanceEmployeeService from "@/services/AttendanceEmployeeService";
import AttendanceArriveEmployeeUpdate from "./AttendanceArriveEmployeeUpdate.vue";
import AttendanceLeaveEmployeeUpdate from "./AttendanceLeaveEmployeeUpdate.vue";
import CreateAttendanceEmployeeCustomExcel from "./CreateAttendanceEmployeeCustomExcel.vue";
import AttendanceView from "./AttendanceView.vue";
// import http from "../../http-download";
// import DepartmentDataService from "../../services/DepartmentDataService";
export default {
  components: {
    AttendanceArriveEmployeeUpdate,
    AttendanceLeaveEmployeeUpdate,
    AttendanceView,
    CreateAttendanceEmployeeCustomExcel,
  },
  props: {},
  data() {
    return {
      loaddingButtonArrived: false,
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      attendanceStatusList: [
        { value: true, label: "Đã chấm công" },
        { value: false, label: "Chưa chấm công" },
      ],
      departmentList: [],
      attendanceDetailDateList: [],
      responseArriveList: [],
      responseLeaveList: [],
      responseEatList: [],
      data: "",
      tabNameClick: "detailDay",
      activeTabName: "detailDay",
      showDialogUpdateArrive: false,
      showDialogUpdateLeave: false,
      showDialogViewDetailDate: false,
      showDialogCreateAttendanceKidCustomExcel: false,
      loadingButtonSaveArriveDate: false,
      loadingButtonSaveLeaveDate: false,
      loadingButtonSaveEatDate: false,

      //start checkbox all
      checkboxAllMorning1: false,
      checkboxAllMorning2: false,
      checkboxAllMorning3: false,
      checkboxAllAfternoon1: false,
      checkboxAllAfternoon2: false,
      checkboxAllAfternoon3: false,
      checkboxAllEvening1: false,
      checkboxAllEvening2: false,
      checkboxAllEvening3: false,
      checkboxAllLeave: false,
      //end checkbox all

      multipleSelectionEat: [],
      multipleSelectionLeave: [],
      multipleSelectionArrive: [],

      checkboxAllEatDinner: false,
      checkboxAllEatLunch: false,
      checkboxAllEatBreakfast: false,
      textTableLeave: "",
      textTableEat: "",
      textTableArrive: "",
      loadingData: true,

      dataSearch: {
        date: "",
        status: "",
        nameOrPhone: "",
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      if (!row.arrive) {
        return "color: #409EFF";
      }
    },
    tableRowStyle({ row }) {
      if (!row.arrive) {
        return "color: #409EFF";
      }
    },
    tableRowLeaveStyle({ row }) {
      if (row.attendanceLeaveEmployee.leaveTime == null && !row.status) {
        return "color: #409EFF";
      }
    },
    tableRowStyleEat({ row }) {
      if (row.attendanceEatEmployee.eat == false) {
        return "color: #409EFF";
      }
    },
    handleShowDetailDate(index, row) {
      this.$refs.AttendanceView.getDataArriveRowInitial(row);
      this.showDialogViewDetailDate = true;
    },
    closeDialogViewDetailDateMethod() {
      this.showDialogViewDetailDate = false;
    },
    handleSelectionChangeEat(val) {
      this.multipleSelectionEat = val;
    },
    handleSelectionChangeLeave(val) {
      this.multipleSelectionLeave = val;
    },
    handleSelectionChangeArrive(val) {
      this.multipleSelectionArrive = val;
    },
    handleArriveUpdateRowMethod(index, row) {
      this.$refs.AttendanceArriveEmployeeUpdate.getDataArriveRowInitial(row);
      this.showDialogUpdateArrive = true;
    },
    handleLeaveUpdateRowMethod(index, row) {
      this.$refs.AttendanceLeaveEmployeeUpdate.getDataLeaveRowInitial(row);
      this.showDialogUpdateLeave = true;
    },
    closeDialogAttendanceKidCustomExcel() {
      this.showDialogCreateAttendanceKidCustomExcel = false;
    },
    closeDialogUpdateArriveMethod() {
      this.showDialogUpdateArrive = false;
      this.searchAttendanceArrive();
    },
    closeDialogUpdateLeaveMethod() {
      this.showDialogUpdateLeave = false;
      this.searchAttendanceLeave();
    },
    handleClickTab(tab) {
      this.tabNameClick = tab.name;
      if (this.tabNameClick == "detailDay") {
        this.getSearchAllAttendanceDetail();
      }
      if (this.tabNameClick == "attendanceArrive") {
        this.searchAttendanceArrive();
      }
      if (this.tabNameClick == "attendanceLeave") {
        this.checkboxAllLeave = false;
        this.searchAttendanceLeave(this.idInfo);
      }
      if (this.tabNameClick == "attendanceEat") {
        this.searchAttendanceEatMethod();
      }
    },
    handleCommandAction(command) {
      if (command == "exportAll") {
        this.exportExcelAttendanceCustom();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      } else if (command == "exportDay") {
        this.exportExcelAttendanceDate();
      }
    },
    // exportExcelAttendanceDate() {
    //   this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
    //     distinguishCancelAndClose: true,
    //     closeOnClickModal: false,
    //     confirmButtonText: "Có",
    //     cancelButtonText: "Không",
    //   }).then(() => {
    //     let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    //     return http
    //       .get(
    //         `/attendance-employees/export-attendance-employee?&date=` +
    //           this.dataSearch.date
    //       )
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute(
    //           "download",
    //           "QUẢN_LÝ_CHẤM_CÔNG_NGÀY_" + myDate + ".xlsx"
    //         );
    //         document.body.appendChild(link);
    //         link.click();
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         this.$message({
    //           message: "Thất bại",
    //           type: "error",
    //         });
    //       });
    //   });
    // },
    exportExcelAttendanceDate() {
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcelDate();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        AttendanceEmployeeService.getExportExcelEmployeeDay(
          this.dataSearch.date
        )
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_CHAM_CONG_NGAY_${myDate}`;
                const merges = [
                  "A5:B5",
                  "C5:E5",
                  "F5:N5",
                  "O5:Q5",
                  "R5:S5",
                  "A6:A7",
                  "B6:B7",
                  "C6:C7",
                  "D6:D7",
                  "E6:E7",
                  "O6:O7",
                  "P6:P7",
                  "Q6:Q7",
                  "R6:R7",
                  "S6:S7",
                  "T6:T7",
                  "U6:U7",
                  "F6:H6",
                  "I6:K6",
                  "L6:N6",
                ];
                const tHeader = [
                  "",
                  "",
                  "",
                  "",
                  "",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ];
                const filterVal = [
                  "pro1",
                  "pro2",
                  "pro3",
                  "pro4",
                  "pro5",
                  "pro6",
                  "pro7",
                  "pro8",
                  "pro9",
                  "pro10",
                  "pro11",
                  "pro12",
                  "pro13",
                  "pro14",
                  "pro15",
                  "pro16",
                  "pro17",
                  "pro18",
                  "pro19",
                  "pro20",
                  "pro21",
                ];
                let columnList = [
                  { col: 4 },
                  { col: 25 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 8 },
                  { col: 8 },
                  { col: 8 },
                  { col: 8 },
                ];
                excel.export_json_to_excel({
                  header: tHeader,
                  merges,
                  data: dataList,
                  title: filterVal,
                  filename: fileName,
                  columnsWidth: columnList,
                  styleCols1: this.styleCols1,
                  styleCols2: this.styleCols2,
                });
              })
              .finally(() => {
                this.styleCols1 = [];
                this.styleCols2 = [];
              });
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Thất bại",
              type: "error",
            });
          });
      });
    },
    //Style css Excel Date
    getStyleExcelDate() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let style1 = {
        name: "A6:U7",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font: { sz: 10 },
          alignment,
          border,
        },
      };
      let style2 = {
        name: "F4:W4",
        style: {
          border: { bottom: { style: "thin" } },
        },
      };
      //style1
      let styleCol1 = {
        name: "A5:B5",
        style: {
          fill: { fgColor: { rgb: "cfcfcf" } },
          font: { bold: true, sz: "11", color: { rgb: "f70000" } },
          alignment,
          border,
        },
      };
      let styleCol2 = {
        name: "C5:E50",
        style: {
          fill: { fgColor: { rgb: "83a4c4" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol3 = {
        name: "F5:N50",
        style: {
          fill: { fgColor: { rgb: "95cb4a" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol4 = {
        name: "O5:Q50",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol5 = {
        name: "R5:S50",
        style: {
          fill: { fgColor: { rgb: "3399ff" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol6 = {
        name: "T5:U50",
        style: {
          fill: { fgColor: { rgb: "e0bf1c" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol01 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      let styleCol02 = {
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };

      this.styleCols2.push(styleCol1);
      this.styleCols2.push(styleCol2);
      this.styleCols2.push(styleCol3);
      this.styleCols2.push(styleCol4);
      this.styleCols2.push(styleCol5);
      this.styleCols2.push(styleCol6);
      this.styleCols2.push(style1);
      this.styleCols2.push(style2);
      // this.styleCols2.push(styleCol4);
      // this.styleCols2.push(styleCol5);
      // this.styleCols2.push(styleCol6);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
    },
    // exportExcelAttendanceMonth() {
    //   this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
    //     distinguishCancelAndClose: true,
    //     closeOnClickModal: false,
    //     confirmButtonText: "Có",
    //     cancelButtonText: "Không",
    //   }).then(() => {
    //     let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    //     return http
    //       .get(
    //         `/attendance-employees/export-attendance-employee-month?&date=` +
    //           this.dataSearch.date
    //       )
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute(
    //           "download",
    //           "QUAN_LY_CHẤM_CÔNG_THEO_THÁNG_" + myDate + ".xlsx"
    //         );
    //         document.body.appendChild(link);
    //         link.click();
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         this.$message({
    //           message: "Thất bại",
    //           type: "error",
    //         });
    //       });
    //   });
    // },
    exportExcelAttendanceMonth() {
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcelDate();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        AttendanceEmployeeService.getExportExcelEmployeeMonth(
          this.dataSearch.date
        )
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_CHAM_CONG_THEO_THANG_${myDate}`;
                const merges = [
                  "A5:B5",
                  "C5:E5",
                  "F5:N5",
                  "O5:Q5",
                  "R5:S5",
                  "A6:A7",
                  "B6:B7",
                  "C6:C7",
                  "D6:D7",
                  "E6:E7",
                  "O6:O7",
                  "P6:P7",
                  "Q6:Q7",
                  "R6:R7",
                  "S6:S7",
                  "T6:T7",
                  "U6:U7",
                  "F6:H6",
                  "I6:K6",
                  "L6:N6",
                ];
                const tHeader = [
                  "",
                  "",
                  "",
                  "",
                  "",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ];
                const filterVal = [
                  "pro1",
                  "pro2",
                  "pro3",
                  "pro4",
                  "pro5",
                  "pro6",
                  "pro7",
                  "pro8",
                  "pro9",
                  "pro10",
                  "pro11",
                  "pro12",
                  "pro13",
                  "pro14",
                  "pro15",
                  "pro16",
                  "pro17",
                  "pro18",
                  "pro19",
                  "pro20",
                  "pro21",
                ];
                let columnList = [
                  { col: 4 },
                  { col: 25 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 8 },
                  { col: 8 },
                  { col: 8 },
                  { col: 8 },
                ];
                excel.export_json_to_excel({
                  header: tHeader,
                  merges,
                  data: dataList,
                  title: filterVal,
                  filename: fileName,
                  columnsWidth: columnList,
                  styleCols1: this.styleCols1,
                  styleCols2: this.styleCols2,
                });
              })
              .finally(() => {
                this.styleCols1 = [];
                this.styleCols2 = [];
              });
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Thất bại",
              type: "error",
            });
          });
      });
    },

    /**
     * đối khối cho tab detail
     */
    getSearchAllAttendance() {
      if (this.tabNameClick == "detailDay") {
        this.getSearchAllAttendanceDetail();
      }
      if (this.tabNameClick == "attendanceArrive") {
        this.searchAttendanceArrive();
      }
      if (this.tabNameClick == "attendanceLeave") {
        this.searchAttendanceLeave(this.idInfo);
      }
      if (this.tabNameClick == "attendanceEat") {
        this.searchAttendanceEatMethod();
      }
    },
    /**
     * lưu một row cho chấm công đến
     */
    handleArriveRowSave(row) {
      if (
        row.arriveEmployeeDate.morning ||
        row.arriveEmployeeDate.afternoon ||
        row.arriveEmployeeDate.evening
      ) {
        if (row.arriveEmployeeDate.arriveTime == null) {
          this.$message({
            message: "Chưa chọn giờ đến",
            type: "error",
          });
          return;
        }
      }
      row.loadingSave = true;
      row.arriveEmployeeDate.date = this.dataSearch.date;
      AttendanceEmployeeService.saveArriveOne(row.arriveEmployeeDate)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchAttendanceArrive();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            row.loadingSave = false;
          }, 400);
        });
    },

    handleLeaveRowSave(row) {
      if (
        row.attendanceLeaveEmployee.leaveTime == null &&
        row.attendanceLeaveEmployee.leave
      ) {
        this.$message({
          message: "Chưa chọn giờ về",
          type: "error",
        });
        return;
      }
      row.loadingSave = true;
      row.attendanceLeaveEmployee.date = this.dataSearch.date;
      AttendanceEmployeeService.saveLeaveOne(row.attendanceLeaveEmployee)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchAttendanceLeave();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            row.loadingSave = false;
          }, 400);
        });
    },
    /**
     * lưu nhiều row cho chấm công đến
     */
    handleArriveManyRowSave() {
      let employeeList = this.multipleSelectionArrive;
      let arriveList = [];
      if (employeeList.length == 0) {
        this.$message({
          message: "Không có nhân viên nào được chọn",
          type: "error",
        });
        return;
      }
      let checkTimeNull = false;
      let BreakException = null;
      employeeList.forEach((x) => {
        if (
          (x.arriveEmployeeDate.morning ||
            x.arriveEmployeeDate.afternoon ||
            x.arriveEmployeeDate.evening) &&
          x.arriveEmployeeDate.arriveTime == null
        ) {
          checkTimeNull = true;
          this.$message({
            message: "Chưa chọn giờ đến cho nhân viên đã chọn",
            type: "error",
          });
        }
        if (checkTimeNull) {
          throw BreakException;
        }
        x.arriveEmployeeDate.date = this.dataSearch.date;
        arriveList.push(x.arriveEmployeeDate);
      });

      this.loadingButtonSaveArriveDate = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu chấm công đến cho " +
          employeeList.length +
          " nhân viên đã chọn?",
        "Lưu chấm công đến",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          AttendanceEmployeeService.saveArriveMany(arriveList)
            .then((resp) => {
              this.attendanceArriveManySave = resp.data.data;
              this.$message({
                message: "Cập nhật thành công",
                type: "success",
              });
              this.searchAttendanceArrive();
            })
            .catch((err) => {
              setTimeout(() => {
                this.loadingButtonSaveArriveDate = false;
              }, 500);
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonSaveArriveDate = false;
          }, 500);
        });
    },
    // export attendance custom
    exportExcelAttendanceCustom() {
      this.showDialogCreateAttendanceKidCustomExcel = true;
    },
    /**
     * lưu nhiều row cho chấm công về
     */

    handleLeaveManyRowSave() {
      let kidList = this.multipleSelectionLeave;
      kidList = kidList
        .filter((x) => x.arrive)
        .map((x) => x.attendanceLeaveEmployee);
      if (kidList.length == 0) {
        this.$message({
          message: "Không có nhân viên nào được chọn ở trạng thái đi làm",
          type: "error",
        });
        return;
      }
      this.loadingButtonSaveLeaveDate = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu chấm công về cho " +
          kidList.length +
          " nhân viên đã chọn?",
        "Lưu chấm công về",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          AttendanceEmployeeService.saveLeaveMany(kidList)
            .then((resp) => {
              this.attendanceLeaveManySave = resp.data.data;
              this.$message({
                message: "Cập nhật thành công",
                type: "success",
              });
              this.getSearchAllAttendanceLeave();
            })
            .catch((err) => {
              setTimeout(() => {
                this.loadingButtonSaveLeaveDate = false;
              }, 500);
              this.$message({
                message: err.response.data.data,
                type: "error",
              });
            });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonSaveLeaveDate = false;
          }, 500);
        });
    },

    changeAllLeave() {
      let dataList = this.responseLeaveList;
      dataList.forEach((data) => {
        if (data.arrive) {
          data.attendanceLeaveEmployee.leave = this.checkboxAllLeave;
          let timConfig = data.attendanceTimeConfig;
          let attendaceArrive = data.arriveEmployeeDate;
          data.attendanceLeaveEmployee.leaveTime = moment(
            String(new Date())
          ).format("HH:mm");
          if (data.attendanceLeaveEmployee.leave) {
            if (attendaceArrive.evening) {
              this.handleTimeLeaveSoon(
                timConfig.timeLeaveEveningEmployee,
                data
              );
            } else if (attendaceArrive.afternoon) {
              this.handleTimeLeaveSoon(
                timConfig.timeLeaveAfternoonEmployee,
                data
              );
            } else if (attendaceArrive.morning) {
              this.handleTimeLeaveSoon(
                timConfig.timeLeaveMorningEmployee,
                data
              );
            }
          } else {
            data.attendanceLeaveEmployee.leaveTime = null;
            data.attendanceLeaveEmployee.minuteLeaveSoon = 0;
          }
        }
      });
      this.setUniquesHeaderLeave();
    },
    setUniquesHeaderLeave() {
      let dataList = this.responseLeaveList;
      let count1 = dataList.filter((x) => x.arrive).length;
      let conut2 = dataList.filter(
        (x) => x.arrive && x.attendanceLeaveEmployee.leave
      ).length;
      if (count1 == conut2) {
        this.checkboxAllLeave = true;
      }
    },
    checkRowLeave(data) {
      data.attendanceLeaveEmployee.leaveTime = moment(
        String(new Date())
      ).format("HH:mm");
      this.getTimeLeave(data);
    },

    getTimeLeave(data) {
      let timConfig = data.attendanceTimeConfig;
      let attendanceArrive = data.arriveEmployeeDate;
      if (data.attendanceLeaveEmployee.leave) {
        if (attendanceArrive.evening) {
          this.handleTimeLeaveSoon(timConfig.timeLeaveEveningEmployee, data);
        } else if (attendanceArrive.afternoon) {
          this.handleTimeLeaveSoon(timConfig.timeLeaveAfternoonEmployee, data);
        } else if (attendanceArrive.morning) {
          this.handleTimeLeaveSoon(timConfig.timeLeaveMorningEmployee, data);
        }
      } else {
        data.attendanceLeaveEmployee.leaveTime = null;
        data.attendanceLeaveEmployee.minuteLeaveSoon = 0;
      }
    },

    handleTimeLeaveSoon(timeConfigData, data) {
      let timeConfig = timeConfigData.split(":");
      let timeLeave = data.attendanceLeaveEmployee.leaveTime.split(":");
      let hour = timeLeave[0] - timeConfig[0];
      let minute = timeLeave[1] - timeConfig[1];
      let hourLate = hour * 60;
      let minuteLate = hourLate + minute;
      if (minuteLate < 0) {
        data.attendanceLeaveEmployee.minuteLeaveSoon = Math.abs(minuteLate);
      } else {
        data.attendanceLeaveEmployee.minuteLeaveSoon = 0;
      }
    },
    /**
     * check all sáng
     */
    changeAllMorning(index, type) {
      let dataList = this.responseArriveList;
      let checkAll1 = this.checkboxAllMorning1;
      let checkAll2 = this.checkboxAllMorning2;
      let checkAll3 = this.checkboxAllMorning3;
      dataList.forEach((x) => {
        debugger;
        if (x.attendanceConfig.morning) {
          if (type == 1) {
            //đi làm
            x.arriveEmployeeDate.morning = checkAll1;
            if (checkAll1) {
              x.arriveEmployeeDate.morningYes = false;
              x.arriveEmployeeDate.morningNo = false;
            }
          } else if (type == 2) {
            //nghỉ có phép
            x.arriveEmployeeDate.morningYes = checkAll2;
            if (checkAll2) {
              x.arriveEmployeeDate.morning = false;
              x.arriveEmployeeDate.morningNo = false;
            }
          } else if (type == 3) {
            //nghỉ không phép
            x.arriveEmployeeDate.morningNo = checkAll3;
            if (checkAll3) {
              x.arriveEmployeeDate.morning = false;
              x.arriveEmployeeDate.morningYes = false;
            }
          }
          this.setTimeArriveDataMethod(
            x.arriveEmployeeDate,
            x.attendanceTimeConfig
          );
        }
      });
      this.setUniquesHeaderMornig(type);
    },
    handleEatRowCheckboxAll(index, row, status) {
      if (row.attendanceEmployeeConfig.breakfast) {
        row.attendanceEatEmployee.breakfast = status;
      }
      if (row.attendanceEmployeeConfig.lunch) {
        row.attendanceEatEmployee.lunch = status;
      }
      if (row.attendanceEmployeeConfig.dinner) {
        row.attendanceEatEmployee.dinner = status;
      }
    },

    changeCheckboxAllEat(type) {
      this.responseEatList.forEach((x) => {
        switch (type) {
          case "breakfast": {
            if (x.attendanceEmployeeConfig.breakfast) {
              x.attendanceEatEmployee.breakfast = this.checkboxAllEatBreakfast;
            }
            break;
          }
          case "lunch": {
            if (x.attendanceEmployeeConfig.lunch) {
              x.attendanceEatEmployee.lunch = this.checkboxAllEatLunch;
            }
            break;
          }
          case "dinner": {
            if (x.attendanceEmployeeConfig.dinner) {
              x.attendanceEatEmployee.dinner = this.checkboxAllEatDinner;
            }
            break;
          }
        }
      });
    },

    /**
     * check row buổi sáng
     */
    checkRowMorningDay(type, row) {
      let data = row.arriveEmployeeDate;
      //đi làm
      if (type == 1 && data.morning) {
        data.morningYes = false;
        data.morningNo = false;
      } else if (type == 2 && data.morningYes) {
        //nghỉ có phép
        data.morning = false;
        data.morningNo = false;
      } else if (type == 3 && data.morningNo) {
        //nghỉ không phép
        data.morning = false;
        data.morningYes = false;
      }
      this.setTimeArriveDataMethod(data, row.attendanceTimeConfig);
      this.setCheckboxHeaderMorning();
    },

    /**
     * check row buổi chiều
     */
    checkRowAfternoonDay(type, row) {
      let data = row.arriveEmployeeDate;
      //đi làm
      if (type == 1 && data.afternoon) {
        data.afternoonYes = false;
        data.afternoonNo = false;
      } else if (type == 2 && data.afternoonYes) {
        //nghỉ có phép
        data.afternoon = false;
        data.afternoonNo = false;
      } else if (type == 3 && data.afternoonNo) {
        //nghỉ không phép
        data.afternoon = false;
        data.afternoonYes = false;
      }
      this.setTimeArriveDataMethod(data, row.attendanceTimeConfig);
      this.setCheckboxHeaderAfternoon();
    },

    /**
     * check row buổi tối
     */
    checkRowEveningDay(type, row) {
      let data = row.arriveEmployeeDate;
      //đi làm
      if (type == 1 && data.evening) {
        data.eveningYes = false;
        data.eveningNo = false;
      } else if (type == 2 && data.eveningYes) {
        //nghỉ có phép
        data.evening = false;
        data.eveningNo = false;
      } else if (type == 3 && data.eveningNo) {
        //nghỉ không phép
        data.evening = false;
        data.eveningYes = false;
      }
      this.setTimeArriveDataMethod(data, row.attendanceTimeConfig);
      this.setCheckboxHeaderEvening();
    },
    /**
     * set giá trị cho phần header các buổi sáng
     */
    setCheckboxHeaderMorning() {
      let dataList = this.responseArriveList;
      let countMorning1 = dataList.filter((x) => x.arriveEmployeeDate.morning)
        .length;
      if (countMorning1 == dataList.length) {
        this.checkboxAllMorning1 = true;
      } else {
        this.checkboxAllMorning1 = false;
      }
      let countMorning2 = dataList.filter(
        (x) => x.arriveEmployeeDate.morningYes
      ).length;
      if (countMorning2 == dataList.length) {
        this.checkboxAllMorning2 = true;
      } else {
        this.checkboxAllMorning2 = false;
      }
      let countMorning3 = dataList.filter((x) => x.arriveEmployeeDate.morningNo)
        .length;
      if (countMorning3 == dataList.length) {
        this.checkboxAllMorning3 = true;
      } else {
        this.checkboxAllMorning3 = false;
      }
    },
    /**
     * set giá trị cho phần header các buổi chiều
     */
    setCheckboxHeaderAfternoon() {
      let dataList = this.responseArriveList;
      let count1 = dataList.filter((x) => x.arriveEmployeeDate.afternoon)
        .length;
      if (count1 == dataList.length) {
        this.checkboxAllAfternoon1 = true;
      } else {
        this.checkboxAllAfternoon1 = false;
      }
      let count2 = dataList.filter((x) => x.arriveEmployeeDate.afternoonYes)
        .length;
      if (count2 == dataList.length) {
        this.checkboxAllAfternoon2 = true;
      } else {
        this.checkboxAllAfternoon2 = false;
      }
      let count3 = dataList.filter((x) => x.arriveEmployeeDate.afternoonNo)
        .length;
      if (count3 == dataList.length) {
        this.checkboxAllAfternoon3 = true;
      } else {
        this.checkboxAllAfternoon3 = false;
      }
    },
    /**
     * set giá trị cho phần header các buổi tối
     */
    setCheckboxHeaderEvening() {
      let dataList = this.responseArriveList;
      let count1 = dataList.filter((x) => x.arriveEmployeeDate.evening).length;
      if (count1 == dataList.length) {
        this.checkboxAllEvening1 = true;
      } else {
        this.checkboxAllEvening1 = false;
      }
      let count2 = dataList.filter((x) => x.arriveEmployeeDate.eveningYes)
        .length;
      if (count2 == dataList.length) {
        this.checkboxAllEvening2 = true;
      } else {
        this.checkboxAllEvening2 = false;
      }
      let count3 = dataList.filter((x) => x.arriveEmployeeDate.eveningNo)
        .length;
      if (count3 == dataList.length) {
        this.checkboxAllEvening3 = true;
      } else {
        this.checkboxAllEvening3 = false;
      }
    },

    /**
     * set unique checkBox header cho các buổi
     */
    setUniquesHeaderMornig(type) {
      let checkAll1 = this.checkboxAllMorning1;
      let checkAll2 = this.checkboxAllMorning2;
      let checkAll3 = this.checkboxAllMorning3;
      if (type == 1) {
        if (checkAll1) {
          this.checkboxAllMorning2 = false;
          this.checkboxAllMorning3 = false;
        }
      } else if (type == 2) {
        if (checkAll2) {
          this.checkboxAllMorning1 = false;
          this.checkboxAllMorning3 = false;
        }
      } else if (type == 3) {
        if (checkAll3) {
          this.checkboxAllMorning1 = false;
          this.checkboxAllMorning2 = false;
        }
      }
    },
    /**
     * set time for orther method
     */
    setTimeArriveDataMethod(data, time) {
      data.arriveTime = moment(String(new Date())).format("HH:mm");
      this.getTimeArrive(data, time);
    },

    getTimeArrive(data, time) {
      if (data.morning) {
        this.changeTimeLeave(data, time.timeMorningEmployee);
      } else if (!data.morning && data.afternoon) {
        this.changeTimeLeave(data, time.timeAfternoonEmployee);
      } else if (!data.morning && !data.afternoon && data.evening) {
        this.changeTimeLeave(data, time.timeEveningEmployee);
      } else if (!data.morning && !data.afternoon && !data.evening) {
        data.arriveTime = null;
        data.minuteArriveLate = 0;
      }
    },

    /**
     * check tất cả các row buổi chiều
     */
    changeAllAfternoon(index, type) {
      let dataList = this.responseArriveList;
      let checkAll1 = this.checkboxAllAfternoon1;
      let checkAll2 = this.checkboxAllAfternoon2;
      let checkAll3 = this.checkboxAllAfternoon3;
      //đi làm
      dataList.forEach((x) => {
        debugger;
        if (x.attendanceConfig.afternoon) {
          if (type == 1) {
            x.arriveEmployeeDate.afternoon = checkAll1;
            if (checkAll1) {
              x.arriveEmployeeDate.afternoonYes = false;
              x.arriveEmployeeDate.afternoonNo = false;
            }
          } else if (type == 2) {
            //nghỉ có phép
            x.arriveEmployeeDate.afternoonYes = checkAll2;
            if (checkAll2) {
              x.arriveEmployeeDate.afternoon = false;
              x.arriveEmployeeDate.afternoonNo = false;
            }
          } else if (type == 3) {
            //nghỉ không phép
            x.arriveEmployeeDate.afternoonNo = checkAll3;
            if (checkAll3) {
              x.arriveEmployeeDate.afternoon = false;
              x.arriveEmployeeDate.afternoonYes = false;
            }
          }
          this.setTimeArriveDataMethod(
            x.arriveEmployeeDate,
            x.attendanceTimeConfig
          );
        }
      });
      this.setUniquesHeaderAfternoon(type);
    },
    /**
     * set unique checkBox header cho các buổi
     */
    setUniquesHeaderAfternoon(type) {
      let checkAll1 = this.checkboxAllAfternoon1;
      let checkAll2 = this.checkboxAllAfternoon2;
      let checkAll3 = this.checkboxAllAfternoon3;
      if (type == 1) {
        if (checkAll1) {
          this.checkboxAllAfternoon2 = false;
          this.checkboxAllAfternoon3 = false;
        }
      } else if (type == 2) {
        if (checkAll2) {
          this.checkboxAllAfternoon1 = false;
          this.checkboxAllAfternoon3 = false;
        }
      } else if (type == 3) {
        if (checkAll3) {
          this.checkboxAllAfternoon1 = false;
          this.checkboxAllAfternoon2 = false;
        }
      }
    },
    /**
     * check tất cả các row buổi tối
     */
    changeAllEvening(index, type) {
      let dataList = this.responseArriveList;
      let checkAll1 = this.checkboxAllEvening1;
      let checkAll2 = this.checkboxAllEvening2;
      let checkAll3 = this.checkboxAllEvening3;
      //đi làm
      dataList.forEach((x) => {
        if (x.attendanceConfig.evening) {
          if (type == 1) {
            x.arriveEmployeeDate.evening = checkAll1;
            if (checkAll1) {
              x.arriveEmployeeDate.eveningYes = false;
              x.arriveEmployeeDate.eveningNo = false;
            }
          } else if (type == 2) {
            //nghỉ có phép
            x.arriveEmployeeDate.eveningYes = checkAll2;
            if (checkAll2) {
              x.arriveEmployeeDate.evening = false;
              x.arriveEmployeeDate.eveningNo = false;
            }
          } else if (type == 3) {
            //nghỉ không phép
            x.arriveEmployeeDate.eveningNo = checkAll3;
            if (checkAll3) {
              x.arriveEmployeeDate.evening = false;
              x.arriveEmployeeDate.eveningYes = false;
            }
          }
          this.setTimeArriveDataMethod(
            x.arriveEmployeeDate,
            x.attendanceTimeConfig
          );
        }
      });
      this.setUniquesHeaderEvening(type);
    },
    /**
     * set unique checkBox header cho các buổi
     */
    setUniquesHeaderEvening(type) {
      let checkAll1 = this.checkboxAllEvening1;
      let checkAll2 = this.checkboxAllEvening2;
      let checkAll3 = this.checkboxAllEvening3;
      if (type == 1) {
        if (checkAll1) {
          this.checkboxAllEvening2 = false;
          this.checkboxAllEvening3 = false;
        }
      } else if (type == 2) {
        if (checkAll2) {
          this.checkboxAllEvening1 = false;
          this.checkboxAllEvening3 = false;
        }
      } else if (type == 3) {
        if (checkAll3) {
          this.checkboxAllEvening1 = false;
          this.checkboxAllEvening2 = false;
        }
      }
    },

    changeTimeLeaveCustom(x) {
      this.getTimeArrive(x.arriveEmployeeDate, x.attendanceTimeConfig);
    },
    /**
     * set thời gian đón muộn
     */
    changeTimeLeave(data, timeConfigsChool) {
      let time = timeConfigsChool;
      let timeArrive = data.arriveTime.split(":");
      if (time != null) {
        let timeConfig = time.split(":");

        let hour = timeArrive[0] - timeConfig[0];
        let minute = timeArrive[1] - timeConfig[1];
        let hourLate = hour * 60;
        let minuteLate = hourLate + minute;
        if (minuteLate > 0) {
          data.minuteArriveLate = minuteLate;
        } else {
          data.minuteArriveLate = 0;
        }
      }
    },

    /**
     * lưu một row cho chấm công ăn
     */
    handleEatRowSave(index, row) {
      row.loadingSave = true;
      row.attendanceEatEmployee.date = this.dataSearch.date;
      AttendanceEmployeeService.saveEatOne(row.attendanceEatEmployee)
        .then(() => {
          // this.attendanceEatOneSave = resp.data.data;
          this.$message({
            message: "Cập nhật thành công",
            type: "success",
          });
          this.searchAttendanceEatMethod();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Cập nhật thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            row.loadingSave = false;
          }, 400);
        });
    },
    /**
     * lưu nhiều row cho chấm công ăn
     */
    handleEatManyRowSave() {
      let employeeList = this.multipleSelectionEat;
      employeeList = employeeList.map((x) => x.attendanceEatEmployee);
      employeeList.forEach((x) => {
        x.date = this.dataSearch.date;
      });
      if (employeeList.length == 0) {
        this.$message({
          message: "Không có nhân viên nào được chọn",
          type: "error",
        });
        return;
      }
      this.loadingButtonSaveEatDate = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu chấm công ăn cho " +
          employeeList.length +
          " nhân viên đã chọn?",
        "Lưu chấm công ăn",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          AttendanceEmployeeService.saveEatMany(employeeList)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              this.searchAttendanceEatMethod();
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
                this.loadingButtonSaveEatDate = false;
              }, 500);
            });
        })
        .catch(() => {
          setTimeout(() => {
            this.loadingButtonSaveEatDate = false;
          }, 500);
        });
    },

    /**
     * lấy danh sách tab chi tiết
     */
    getSearchAllAttendanceDetail() {
      this.loadingData = true;
      this.dataSearch.date = moment(this.dataSearch.date).format("YYYY-MM-DD");
      AttendanceEmployeeService.searchAttendanceDetail(
        this.dataSearch.date,
        this.dataSearch.nameOrPhone,
        this.dataSearch.status
      )
        .then((resp) => {
          this.attendanceDetailDateList = resp.data.data;
          // this.configSchoolCommon = resp.data.data.attendanceConfigResponse;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.attendanceDetailDateList = [];
        })
        .finally(() => {
          if (this.attendanceDetailDateList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    /**
     * lấy danh sách tab chấm công đến
     */
    searchAttendanceArrive() {
      this.loadingData = true;
      AttendanceEmployeeService.searchAttendanceArrive(
        this.dataSearch.date,
        this.dataSearch.nameOrPhone,
        this.dataSearch.status
      )
        .then((resp) => {
          this.responseArriveList = resp.data.data;
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
          this.responseArriveList = [];
        })
        .finally(() => {
          if (this.responseArriveList.length == 0) {
            this.textTableArrive = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * lấy danh sách tab chấm công về
     */
    searchAttendanceLeave() {
      this.loadingData = true;
      AttendanceEmployeeService.searchAttendanceLeave(
        this.dataSearch.date,
        this.dataSearch.nameOrPhone,
        this.dataSearch.status
      )
        .then((resp) => {
          this.responseLeaveList = resp.data.data;
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
          this.responseLeaveList = [];
        })
        .finally(() => {
          if (this.responseLeaveList.length == 0) {
            this.textTableLeave = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * lấy danh sách tab chấm công ăn
     */
    searchAttendanceEatMethod() {
      this.loadingData = true;
      AttendanceEmployeeService.searchAttendanceEat(
        this.dataSearch.date,
        this.dataSearch.nameOrPhone,
        this.dataSearch.status
      )
        .then((resp) => {
          this.responseEatList = resp.data.data;
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
          this.responseEatList = [];
        })
        .finally(() => {
          if (this.responseEatList.length == 0) {
            this.textTableEat = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    async fetchDataMany() {
      this.dataSearch.date = moment(new Date()).format("YYYY-MM-DD");
      this.getSearchAllAttendanceDetail();
    },
  },
  beforeMount() {
    this.fetchDataMany();
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
// /deep/.el-tabs__nav-scroll {
//   float: right;
// }
/deep/.el-tabs__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
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
/deep/.el-table td {
  padding: 8px 0;
}
/deep/.el-table th {
  padding: 5px 0;
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
// table{

// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 70%;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
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
  width: 80%;
}
.disable-row {
  background: #e4e7ed;
}
.second-title {
  font-size: 10px;
}
.button-left {
  margin-right: 5px;
  width: 145px;
}
.second-title {
  font-size: 10px;
}
</style>
