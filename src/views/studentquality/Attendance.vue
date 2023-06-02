<template>
  <div style="margin-top: 5px">
    <div
      class="search-input"
      style="margin-bottom: -20px; position: relative; z-index: 1"
    >
      <!-- input of detail -->
      <div v-if="visibleDetailDate">
        <el-date-picker
          class="input-common input-date"
          style="width: 135px"
          v-model="dataSearch.date"
          type="date"
          :clearable="false"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Chọn ngày"
          :picker-options="startDayOfWeek"
          @change="getSearchAllAttendanceDetail()"
        ></el-date-picker>

        <!-- chọn khối -->
        <el-select
          v-if="this.getAppTypeUserLogin == 'plus'"
          class="input-common input-grade"
          style="width: 140px"
          v-model="dataSearch.idGrade"
          @change="changeGradeDetail()"
          placeholder="Chọn khối"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :value="item.id"
            :label="item.gradeName"
          ></el-option>
        </el-select>

        <!-- chọn lớp -->
        <el-select
          class="input-common input-class"
          style="width: 140px"
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          @change="getSearchAllAttendanceDetail()"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>

        <!-- trạng thái điểm danh -->
        <el-select
          v-model="dataSearch.absentStatus"
          placeholder="Chọn trạng thái"
          clearable
          class="input-common input-status"
          style="width: 160px"
          @change="getSearchAllAttendanceDetail()"
        >
          <el-option
            v-for="item in statusGoToSchoolList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>

      <!-- search of attendance arrive -->
      <div v-else-if="visibleAttendanceArrive">
        <el-date-picker
          class="input-common input-date"
          style="width: 135px"
          :clearable="false"
          v-model="dataSearch.date"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Chọn ngày"
          :picker-options="startDayOfWeek"
          @change="checkAbsentDateInClass('arrive')"
        ></el-date-picker>

        <!-- chọn khối -->
        <el-select
          v-if="this.getAppTypeUserLogin == 'plus'"
          class="input-common input-grade"
          style="width: 140px"
          v-model="dataSearch.idGrade"
          @change="changeGradeArrive()"
          placeholder="Chọn khối"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :value="item.id"
            :label="item.gradeName"
          ></el-option>
        </el-select>

        <!-- chọn lớp -->
        <el-select
          class="input-common input-class"
          style="width: 140px"
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          @change="checkAbsentDateInClass('arrive')"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>

        <!-- tình trạng đi học -->
        <el-select
          v-model="dataSearch.absentStatus"
          placeholder="Chọn trạng thái"
          clearable
          class="input-common input-status"
          style="width: 160px"
          @change="checkAbsentDateInClass('arrive')"
        >
          <el-option
            v-for="item in statusGoToSchoolList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <!-- search of attendance leave -->
      <div v-else-if="visibleAtendanceLeave">
        <el-date-picker
          class="input-common input-date"
          style="width: 135px"
          :clearable="false"
          v-model="dataSearch.date"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Chọn ngày"
          :picker-options="startDayOfWeek"
          @change="checkAbsentDateInClass('leave')"
        ></el-date-picker>

        <!-- chọn khối -->
        <el-select
          v-if="this.getAppTypeUserLogin == 'plus'"
          class="input-common input-grade"
          style="width: 140px"
          v-model="dataSearch.idGrade"
          @change="changeGradeLeave()"
          placeholder="Chọn khối"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :value="item.id"
            :label="item.gradeName"
          ></el-option>
        </el-select>

        <!-- chọn lớp -->
        <el-select
          class="input-common input-class"
          style="width: 140px"
          filterable
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          @change="checkAbsentDateInClass('leave')"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>

        <!-- tình trạng đi học -->
        <el-select
          v-model="dataSearch.absentStatus"
          placeholder="Chọn trạng thái"
          clearable
          class="input-common input-status"
          style="width: 160px"
          @change="checkAbsentDateInClass('leave')"
        >
          <el-option
            v-for="item in statusGoToSchoolList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <!-- search of attendance eat -->
      <div v-else-if="visibleAttendanceEat">
        <el-date-picker
          class="input-common input-date"
          style="width: 135px"
          v-model="dataSearch.date"
          type="date"
          :clearable="false"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Chọn ngày"
          :picker-options="startDayOfWeek"
          @change="getSearchAllAttendanceEat()"
        ></el-date-picker>

        <!-- chọn khối -->
        <el-select
          v-if="this.getAppTypeUserLogin == 'plus'"
          class="input-common input-grade"
          style="width: 140px"
          v-model="dataSearch.idGrade"
          placeholder="Chọn khối"
          @change="changeGradeEat()"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :value="item.id"
            :label="item.gradeName"
          ></el-option>
        </el-select>

        <!-- chọn lớp -->
        <el-select
          class="input-common input-class"
          style="width: 140px"
          filterable
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          @change="getSearchAllAttendanceEat()"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>

        <!-- tình trạng đi học -->
        <el-select
          v-model="dataSearch.absentStatus"
          placeholder="Chọn trạng thái"
          clearable
          class="input-common input-status"
          style="width: 160px"
          @change="getSearchAllAttendanceEat()"
        >
          <el-option
            v-for="item in statusGoToSchoolList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
    </div>

    <!-- tab -->
    <div class="content-main">
      <div>
        <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
          <!-- tab detail -->
          <el-tab-pane label="Chi tiết ngày" name="detailDate">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="attendanceDetailDateList"
              :cell-style="tableRowStyleDetail"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChange"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
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
                prop="kids.fullName"
                label="Họ tên"
                min-width="160"
              ></el-table-column>
              <el-table-column
                prop="maClass.className"
                label="Lớp"
                min-width="130"
              ></el-table-column>
              <el-table-column label="Điểm danh đến" min-width="130" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.attendanceArrive">Đã điểm danh</span>
                  <span v-else>Chưa điểm danh</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="configSchoolCommon.morningAttendanceArrive"
                label="Sáng"
                align="center"
              >
                <el-table-column label="Đi học" align="center" width="90" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-circle-check"
                      v-if="scope.row.attendanceArriveKids.morning"
                      style="color: #409eff; font-size: 18px"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Có phép" align="center" width="90" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-circle-close"
                      style="color: #f56c6c; font-size: 18px"
                      v-if="scope.row.attendanceArriveKids.morningYes"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Không phép" align="center" width="95" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-error"
                      style="color: #f56c6c; font-size: 18px"
                      v-if="scope.row.attendanceArriveKids.morningNo"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="configSchoolCommon.afternoonAttendanceArrive"
                label="Chiều"
                align="center"
              >
                <el-table-column label="Đi học" align="center" width="90" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-circle-check"
                      v-if="scope.row.attendanceArriveKids.afternoon"
                      style="font-size: 18px; color: #409eff"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Có phép" align="center" width="90" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-circle-close"
                      style="color: #f56c6c; font-size: 18px"
                      v-if="scope.row.attendanceArriveKids.afternoonYes"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Không phép" align="center" width="95" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-error"
                      style="color: #f56c6c; font-size: 18px"
                      v-if="scope.row.attendanceArriveKids.afternoonNo"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="configSchoolCommon.eveningAttendanceArrive"
                label="Tối"
                align="center"
              >
                <el-table-column label="Đi học" align="center" width="90" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-circle-check"
                      style="font-size: 18px; color: #409eff"
                      v-if="scope.row.attendanceArriveKids.evening"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Có phép" align="center" width="90" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-circle-close"
                      style="color: #f56c6c; font-size: 18px"
                      v-if="scope.row.attendanceArriveKids.eveningYes"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Không phép" align="center" width="95" header>
                  <template slot-scope="scope">
                    <i
                      class="el-icon-error"
                      style="color: #f56c6c; font-size: 18px"
                      v-if="scope.row.attendanceArriveKids.eveningNo"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="Giờ đến" width="90" align="center">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.attendanceArriveKids.timeArriveKid | formatTime
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Giờ về" width="90" align="center">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.attendanceLeaveKids.timeLeaveKid | formatTime
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Đón muộn(phút)" width="150" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.attendanceLeaveKids.minutePickupLate > 0">{{
                    scope.row.attendanceLeaveKids.minutePickupLate
                  }}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="Tác vụ" fixed="right" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    :disabled="!scope.row.attendanceArrive"
                    size="mini"
                    type="success"
                    @click="handleShowDetailDate(scope.$index, scope.row)"
                    >{{ $t("button.view") }}</el-button
                  >
                  <!-- <el-button v-else disabled size="mini" type="success">{{
                    $t("button.view")
                  }}</el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate">Xuất theo ngày</el-dropdown-item>
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng
                  </el-dropdown-item>
                  <el-dropdown-item command="exportCustom"
                    >Xuất file tổng hợp</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonthDetail"
                    >Xuất file chi tiết tháng</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>

          <!-- tab attendance arrive -->
          <el-tab-pane
            v-if="checkPermission(['studentQuality_attendance_update'])"
            label="Điểm danh đến"
            name="attendanceArriveTab"
          >
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="attendanceArriveList"
              :cell-style="tableRowStyleDetail"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChangeArrive"
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
                width="50"
                fixed
              ></el-table-column>
              <el-table-column
                prop="kids.fullName"
                label="Họ tên"
                min-width="160"
                fixed
              ></el-table-column>
              <el-table-column
                prop="maClass.className"
                label="Lớp"
                min-width="130"
              ></el-table-column>

              <!-- cả ngày -->
              <el-table-column
                v-if="
                  configSchoolCommon.morningAttendanceArrive ||
                  configSchoolCommon.afternoonAttendanceArrive ||
                  configSchoolCommon.eveningAttendanceArrive
                "
                label="Cả ngày"
                align="center"
              >
                <el-table-column align="center" width="60">
                  <template slot="header" slot-scope="scope">
                    <span class="second-title">Đi học</span>
                    <br />
                    <el-checkbox
                      @change="changeAllDayMothod(scope.$index, 1)"
                      v-model="checkboxAllDay1"
                    ></el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox
                      @change="checkRowAllDay(1, scope.row)"
                      v-model="scope.row.attendanceArriveKids.allDay"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="60">
                  <template slot="header" slot-scope="scope">
                    <span class="second-title">Có phép</span>
                    <br />
                    <el-checkbox
                      @change="changeAllDayMothod(scope.$index, 2)"
                      v-model="checkboxAllDay2"
                    ></el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox
                      @change="checkRowAllDay(2, scope.row)"
                      v-model="scope.row.attendanceArriveKids.allDayYes"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="60">
                  <template slot="header" slot-scope="scope">
                    <span class="second-title">Ko phép</span>
                    <br />
                    <el-checkbox
                      @change="changeAllDayMothod(scope.$index, 3)"
                      v-model="checkboxAllDay3"
                    ></el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox
                      @change="checkRowAllDay(3, scope.row)"
                      v-model="scope.row.attendanceArriveKids.allDayNo"
                    ></el-checkbox>
                  </template>
                </el-table-column>
              </el-table-column>
              <!-- buổi sáng -->
              <el-table-column
                v-if="configSchoolCommon.morningAttendanceArrive"
                label="Sáng"
                align="center"
              >
                <el-table-column align="center" width="60">
                  <template slot="header" slot-scope="scope">
                    <span class="second-title">Đi học</span>
                    <br />
                    <el-checkbox
                      @change="changeAllMorning(scope.$index, 1)"
                      v-model="checkboxAllMorning1"
                    ></el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox
                      @change="checkRowMorningDay(1, scope.row)"
                      v-model="scope.row.attendanceArriveKids.morning"
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
                      @change="checkRowMorningDay(2, scope.row)"
                      v-model="scope.row.attendanceArriveKids.morningYes"
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
                      @change="checkRowMorningDay(3, scope.row)"
                      v-model="scope.row.attendanceArriveKids.morningNo"
                    ></el-checkbox>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column
                v-if="configSchoolCommon.afternoonAttendanceArrive"
                label="Chiều"
                align="center"
              >
                <el-table-column align="center" width="60">
                  <template slot="header" slot-scope="scope">
                    <span class="second-title">Đi học</span>
                    <br />
                    <el-checkbox
                      @change="changeAllAfternoon(scope.$index, 1)"
                      v-model="checkboxAllAfternoon1"
                    ></el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox
                      @change="checkRowAfternoonDay(1, scope.row)"
                      v-model="scope.row.attendanceArriveKids.afternoon"
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
                      @change="checkRowAfternoonDay(2, scope.row)"
                      v-model="scope.row.attendanceArriveKids.afternoonYes"
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
                      @change="checkRowAfternoonDay(3, scope.row)"
                      v-model="scope.row.attendanceArriveKids.afternoonNo"
                    ></el-checkbox>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="Tối"
                v-if="configSchoolCommon.eveningAttendanceArrive"
                align="center"
              >
                <el-table-column align="center" width="60">
                  <template slot="header" slot-scope="scope">
                    <span class="second-title">Đi học</span>
                    <br />
                    <el-checkbox
                      @change="changeAllEvening(scope.$index, 1)"
                      v-model="checkboxAllEvening1"
                    ></el-checkbox>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox
                      @change="checkRowEveningDay(1, scope.row)"
                      v-model="scope.row.attendanceArriveKids.evening"
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
                      @change="checkRowEveningDay(2, scope.row)"
                      v-model="scope.row.attendanceArriveKids.eveningYes"
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
                      @change="checkRowEveningDay(3, scope.row)"
                      v-model="scope.row.attendanceArriveKids.eveningNo"
                    ></el-checkbox>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="
                  configSchoolCommon.morningAttendanceArrive ||
                  configSchoolCommon.afternoonAttendanceArrive ||
                  configSchoolCommon.eveningAttendanceArrive
                "
                align="center"
                label="Giờ đến"
                width="132"
              >
                <template slot-scope="scope">
                  <el-time-picker
                    type="time"
                    value-format="HH:mm"
                    format="HH:mm"
                    style="width: 85%"
                    size="mini"
                    v-if="
                      !scope.row.attendanceArriveKids.morning &&
                      !scope.row.attendanceArriveKids.afternoon &&
                      !scope.row.attendanceArriveKids.evening
                    "
                    disabled
                    v-model="scope.row.attendanceArriveKids.timeArriveKid"
                    :picker-options="{
                      selectableRange: '06:00:00 - 21:00:00',
                    }"
                    placeholder="Chọn"
                  ></el-time-picker>
                  <el-time-picker
                    v-else
                    type="time"
                    value-format="HH:mm"
                    format="HH:mm"
                    style="width: 85%"
                    size="mini"
                    v-model="scope.row.attendanceArriveKids.timeArriveKid"
                    :picker-options="{
                      selectableRange: '06:00:00 - 21:00:00',
                    }"
                    placeholder="Chọn"
                  ></el-time-picker>
                </template>
              </el-table-column>
              <!-- <el-table-column
                v-if="
                  configSchoolCommon.morningAttendanceArrive==false &&
                  configSchoolCommon.afternoonAttendanceArrive==false &&
                  configSchoolCommon.eveningAttendanceArrive==false
                "
                label="Ngày nghỉ"
              >
                <span>Ngày nghỉ</span>
              </el-table-column> -->
              <el-table-column fixed="right" label="Tác vụ" width="150" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="
                      configSchoolCommon.morningAttendanceArrive ||
                      configSchoolCommon.afternoonAttendanceArrive ||
                      configSchoolCommon.eveningAttendanceArrive
                    "
                    style="margin-right: 10px"
                  >
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleArriveRowSave(scope.$index, scope.row)"
                      >{{ $t("button.save") }}</el-button
                    >
                    <el-button
                      v-if="
                        scope.row.attendanceArriveKids.timeArriveKid == null ||
                        !scope.row.attendanceArrive
                      "
                      disabled
                      size="mini"
                      type="success"
                      >{{ $t("button.update") }}</el-button
                    >
                    <el-button
                      v-else
                      size="mini"
                      type="success"
                      @click="handleArriveUpdateRowMethod(scope.$index, scope.row)"
                      >{{ $t("button.update") }}</el-button
                    >
                  </span>
                  <!-- <el-button
                    size="mini"
                    type="warning"
                    @click="handleArriveRowDetail(scope.$index, scope.row)"
                    >{{ $t("button.detail") }}</el-button
                  > -->
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-button
                v-if="
                  configSchoolCommon.morningAttendanceArrive ||
                  configSchoolCommon.afternoonAttendanceArrive ||
                  configSchoolCommon.eveningAttendanceArrive
                "
                type="success"
                class="button-bottom"
                :loading="loadingButtonSaveArriveDate"
                @click="handleArriveManyRowSave()"
              >
                <i class="el-icon-circle-check" />
                Lưu điểm danh đến
              </el-button>
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate">Xuất theo ngày</el-dropdown-item>
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng</el-dropdown-item
                  >
                  <el-dropdown-item command="exportCustom"
                    >Xuất file tổng hợp</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonthDetail"
                    >Xuất file chi tiết tháng</el-dropdown-item
                  >
                  <!-- <el-dropdown-item command="exportManyClass">Xuất nhiều lớp</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>

          <!-- tab attendance leave -->
          <el-tab-pane
            v-if="checkPermission(['studentQuality_attendance_update'])"
            label="Điểm danh về"
            name="atendanceLeave"
          >
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="attendanceLeaveList"
              :cell-style="tableRowStyleLeave"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChangeLeave"
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
                width="50"
              ></el-table-column>
              <el-table-column
                prop="kids.fullName"
                label="Họ tên"
                min-width="160"
              ></el-table-column>
              <el-table-column
                prop="maClass.className"
                label="Lớp"
                min-width="130"
              ></el-table-column>
              <el-table-column label="Điểm danh về" min-width="130" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.attendanceLeave">Đã điểm danh</span>
                  <span v-else>Chưa điểm danh</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="100">
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
                    v-if="
                      scope.row.attendanceArrive &&
                      (scope.row.attendanceArriveKids.morning ||
                        scope.row.attendanceArriveKids.afternoon ||
                        scope.row.attendanceArriveKids.evening)
                    "
                    @change="setNullTimeLeaveMethod(scope.row)"
                    v-model="scope.row.attendanceLeaveKids.statusLeave"
                  ></el-checkbox>
                  <el-checkbox v-else disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Giờ về" width="132">
                <template slot-scope="scope">
                  <el-time-picker
                    type="time"
                    value-format="HH:mm"
                    format="HH:mm"
                    style="width: 85%"
                    size="mini"
                    @change="changeTimeLeave(scope.row)"
                    v-if="scope.row.attendanceLeaveKids.statusLeave"
                    v-model="scope.row.attendanceLeaveKids.timeLeaveKid"
                    :picker-options="{
                      selectableRange: '06:00:00 - 21:00:00',
                    }"
                    placeholder="Chọn"
                  ></el-time-picker>
                  <el-time-picker
                    type="time"
                    value-format="HH:mm"
                    format="HH:mm"
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
              <el-table-column label="Đón muộn(phút)" width="150" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.attendanceLeaveKids.minutePickupLate > 0">{{
                    scope.row.attendanceLeaveKids.minutePickupLate
                  }}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="Tác vụ" fixed="right" width="150" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="
                      scope.row.attendanceArrive &&
                      (scope.row.attendanceArriveKids.morning ||
                        scope.row.attendanceArriveKids.afternoon ||
                        scope.row.attendanceArriveKids.evening)
                    "
                    size="mini"
                    type="primary"
                    @click="handleLeaveRowSave(scope.$index, scope.row)"
                    >{{ $t("button.save") }}</el-button
                  >
                  <el-button v-else disabled size="mini" type="primary">{{
                    $t("button.save")
                  }}</el-button>
                  <el-button
                    v-if="
                      scope.row.attendanceLeave &&
                      scope.row.attendanceLeaveKids.timeLeaveKid != null
                    "
                    size="mini"
                    type="success"
                    @click="handleLeaveUpdateRowMethod(scope.$index, scope.row)"
                    >{{ $t("button.update") }}</el-button
                  >
                  <el-button v-else disabled size="mini" type="success">{{
                    $t("button.update")
                  }}</el-button>
                  <!-- <el-button
                    size="mini"
                    type="warning"
                    @click="handleLeaveRowDetail(scope.$index, scope.row)"
                    >{{ $t("button.detail") }}</el-button
                  > -->
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-button
                type="success"
                class="button-bottom"
                :loading="loadingButtonSaveLeaveDate"
                @click="handleLeaveManyRowSave()"
              >
                <i class="el-icon-circle-check" />
                Lưu điểm danh về
              </el-button>
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate">Xuất theo ngày</el-dropdown-item>
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng</el-dropdown-item
                  >
                  <el-dropdown-item command="exportCustom"
                    >Xuất file tổng hợp</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonthDetail"
                    >Xuất file chi tiết tháng</el-dropdown-item
                  >
                  <!-- <el-dropdown-item command="exportDate">Xuất học sinh theo ngày</el-dropdown-item>
                  <el-dropdown-item command="exportMonth">Xuất theo tháng</el-dropdown-item> -->
                  <!-- <el-dropdown-item command="exportManyClass">Xuất nhiều lớp</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>

          <!-- tab attendance eat -->
          <el-tab-pane label="Điểm danh ăn" name="attendanceEat">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="attendanceEatList"
              :cell-style="tableRowStyleEat"
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
              <el-table-column
                type="index"
                label="STT"
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="kids.fullName"
                sortable
                label="Họ tên"
                min-width="160"
              ></el-table-column>
              <el-table-column
                prop="maClass.className"
                label="Lớp"
                min-width="130"
              ></el-table-column>

              <el-table-column label="Điểm danh ăn" min-width="130" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.attendanceEat">Đã điểm danh</span>
                  <span v-else>Chưa điểm danh</span>
                </template>
              </el-table-column>
              <el-table-column label="Trạng thái đi học" align="center">
                <el-table-column
                  v-if="configSchoolCommon.morningAttendanceArrive"
                  label="Sáng"
                  width="70"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.attendanceArriveKids.morning">
                      <el-tooltip effect="dark" content="Đi học" placement="top">
                        <i
                          class="el-icon-circle-check"
                          style="color: #409eff; font-size: 18px"
                        />
                      </el-tooltip>
                    </span>
                    <span v-else-if="scope.row.attendanceArriveKids.morningYes">
                      <el-tooltip effect="dark" content="Nghỉ có phép" placement="top">
                        <i
                          class="el-icon-circle-close"
                          style="color: #f56c6c; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                    <span v-else-if="scope.row.attendanceArriveKids.morningNo">
                      <el-tooltip effect="dark" content="Nghỉ không phép" placement="top">
                        <i
                          class="el-icon-error"
                          style="color: #f56c6c; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="configSchoolCommon.afternoonAttendanceArrive"
                  label="Chiều"
                  width="70"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.attendanceArriveKids.afternoon">
                      <el-tooltip effect="dark" content="Đi học" placement="top">
                        <i
                          class="el-icon-circle-check"
                          style="color: #409eff; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                    <span v-else-if="scope.row.attendanceArriveKids.afternoonYes">
                      <el-tooltip effect="dark" content="Nghỉ có phép" placement="top">
                        <i
                          class="el-icon-circle-close"
                          style="color: #f56c6c; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                    <span
                      v-else-if="scope.row.attendanceArriveKids.afternoonNo"
                      class="absent-no"
                    >
                      <el-tooltip effect="dark" content="Nghỉ không phép" placement="top">
                        <i
                          class="el-icon-error"
                          style="color: #f56c6c; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="configSchoolCommon.eveningAttendanceArrive"
                  label="Tối"
                  width="70"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.attendanceArriveKids.evening">
                      <el-tooltip effect="dark" content="Đi học" placement="top">
                        <i
                          class="el-icon-circle-check"
                          style="color: #409eff; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                    <span
                      v-else-if="scope.row.attendanceArriveKids.eveningYes"
                      class="absent-yes"
                    >
                      <el-tooltip effect="dark" content="Nghỉ có phép" placement="top">
                        <i
                          class="el-icon-circle-close"
                          style="color: #f56c6c; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                    <span
                      v-else-if="scope.row.attendanceArriveKids.eveningNo"
                      class="absent-no"
                    >
                      <el-tooltip effect="dark" content="Nghỉ không phép" placement="top">
                        <i
                          class="el-icon-error"
                          style="color: #f56c6c; font-size: 18px"
                        /> </el-tooltip
                    ></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="configSchoolCommon.morningEat"
                align="center"
                width="60"
              >
                <template slot="header" slot-scope="scope">
                  Sáng
                  <br />
                  <el-checkbox
                    @change="changeCheckboxAllEat('breakfast', scope.row)"
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
                <template slot="header" slot-scope="scope">
                  Phụ sáng
                  <br />
                  <el-checkbox
                    @change="changeCheckboxAllEat('secondBreakfast', scope.row)"
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
                <template slot="header" slot-scope="scope">
                  Trưa
                  <br />
                  <el-checkbox
                    @change="changeCheckboxAllEat('lunch', scope.row)"
                    v-model="checkboxAllEatLunch"
                  ></el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.attendanceEatKids.lunch"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                v-if="configSchoolCommon.afternoonEat"
                align="center"
                width="60"
              >
                <template slot="header" slot-scope="scope">
                  Chiều
                  <br />
                  <el-checkbox
                    @change="changeCheckboxAllEat('afternoon', scope.row)"
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
                <template slot="header" slot-scope="scope">
                  Phụ chiều
                  <br />
                  <el-checkbox
                    @change="changeCheckboxAllEat('secondAfternoon', scope.row)"
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
                <template slot="header" slot-scope="scope">
                  Tối
                  <br />
                  <el-checkbox
                    @change="changeCheckboxAllEat('dinner', scope.row)"
                    v-model="checkboxAllEatDinner"
                  ></el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.attendanceEatKids.dinner"></el-checkbox>
                </template>
              </el-table-column>

              <el-table-column
                v-if="checkPermission(['studentQuality_attendance_update'])"
                label="Tác vụ"
                width="180"
                fixed="right"
                align="center"
              >
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
                    >{{ $t("button.save") }}</el-button
                  >
                  <!-- <el-button
                    size="mini"
                    type="warning"
                    @click="handleEatRowDetail(scope.$index, scope.row)"
                    >{{ $t("button.detail") }}</el-button
                  > -->
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-button
                v-if="checkPermission(['studentQuality_attendance_update'])"
                type="success"
                class="button-bottom"
                :loading="loadingButtonSaveEatDate"
                @click="handleEatManyRowSave()"
              >
                <i class="el-icon-circle-check" />
                Lưu điểm danh ăn
              </el-button>
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate">Xuất theo ngày</el-dropdown-item>
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng
                  </el-dropdown-item>
                  <el-dropdown-item command="exportCustom"
                    >Xuất file tổng hợp</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonthDetail"
                    >Xuất file chi tiết tháng</el-dropdown-item
                  >
                  <!-- <el-dropdown-item command="exportManyClass">Xuất nhiều lớp</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>
          <el-button
            style="float: right; margin: 15px 0"
            class="button-bottom"
            type="success"
            @click="viewCalendarClassMethod()"
            >Xem lịch học</el-button
          >
        </el-tabs>
      </div>
    </div>
    <AttendanceView
      :dialogVisible="showDialogViewDetailDate"
      @dialog-close="closeDialogViewDetailDateMethod()"
      ref="AttendanceView"
    />
    <AttendanceArriveUpdate
      :dialogVisible="showDialogUpdateArrive"
      @dialog-close="closeDialogUpdateArriveMethod()"
      ref="AttendanceArriveUpdate"
    />
    <AttendanceArriveOfMonth
      :dialogVisible="showDialogDetailArrive"
      @dialog-close="closeDialogDetailArriveMethod()"
      ref="AttendanceArriveOfMonth"
    />
    <AttendanceLeaveUpdate
      :dialogVisible="showDialogUpdateLeave"
      @dialog-close="closeDialogUpdateLeaveMethod()"
      ref="AttendanceLeaveUpdate"
    />
    <AttendanceLeaveOfMonth
      :dialogVisible="showDialogDetailLeave"
      @dialog-close="closeDialogDetailLeaveMethod()"
      ref="AttendanceLeaveOfMonth"
    />
    <AttendanceEatOfMonth
      :dialogVisible="showDialogDetailEat"
      @dialog-close="closeDialogDetailEatMethod()"
      ref="AttendanceEatOfMonth"
    />
    <CreateAttendanceKidCustomExcel
      :dialogVisible="showDialogCreateAttendanceKidCustomExcel"
      @dialog-close="closeDialogAttendanceKidCustomExcel()"
      ref="CreateAttendanceKidCustomExcel"
    />
    <CreateAttendanceKidDetailExcel
      :dialogVisible="showDialogCreateAttendanceKidMonthDetail"
      @dialog-close="closeDialogAttendanceKidMonthDetailExcel()"
      ref="CreateAttendanceKidDetailExcel"
    />
    <DayOffClassDialog
      :dialogVisible="showDayOffClassDialog"
      @dialog-close="closeDayOffClassDialog()"
      ref="DayOffClassDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import moment from "moment";
import AttendanceService from "@/services/AttendanceService";
import TeacherService from "@/services/TeacherService";

import AttendanceView from "./AttendanceView.vue";
import CreateAttendanceKidCustomExcel from "./CreateAttendanceKidCustomExcel.vue";
import AttendanceArriveUpdate from "./AttendanceArriveUpdate.vue";
import AttendanceArriveOfMonth from "./AttendanceArriveOfMonth.vue";
import AttendanceLeaveUpdate from "./AttendanceLeaveUpdate.vue";
import AttendanceLeaveOfMonth from "./AttendanceLeaveOfMonth.vue";
import AttendanceEatOfMonth from "./AttendanceEatOfMonth.vue";
import DayOffClassDialog from "./DayOffClassDialog.vue";
import CreateAttendanceKidDetailExcel from "./CreateAttendanceKidDetailExcel.vue";
import {mapActions, mapState} from "vuex";
// import http from "../../http-download";
export default {
  components: {
    AttendanceView,
    CreateAttendanceKidCustomExcel,
    AttendanceArriveUpdate,
    AttendanceArriveOfMonth,
    AttendanceLeaveUpdate,
    AttendanceLeaveOfMonth,
    AttendanceEatOfMonth,
    DayOffClassDialog,
    CreateAttendanceKidDetailExcel,
  },
  data() {
    return {
      dateStartEnd: "",
      loadingData: true,
      textTable: "",
      activeTabName: "detailDate",
      startDayOfWeek: {
        firstDayOfWeek: 1,
      },
      loadingButtonSaveArriveDate: false,
      loadingButtonSaveLeaveDate: false,
      loadingButtonSaveEatDate: false,
      visibleDetailDate: true,
      visibleAttendanceArrive: false,
      visibleAtendanceLeave: false,
      visibleAttendanceEat: false,
      multipleSelectionArrive: [],
      multipleSelectionLeave: [],
      multipleSelectionEat: [],
      gradeOfSchoolList: [],
      classOfGradeList: [],
      showDialogUpdateArrive: false,
      showDialogUpdateLeave: false,
      showDialogViewDetailDate: false,
      showDialogDetailArrive: false,
      showDialogDetailLeave: false,
      showDialogDetailEat: false,
      showDialogCreateAttendanceKidCustomExcel: false,
      showDialogCreateAttendanceKidMonthDetail: false,
      showDayOffClassDialog: false,
      attendanceArriveOneSave: {},
      attendanceLeaveOneSave: {},
      attendanceEatOneSave: {},
      attendanceArriveManySave: "",
      attendanceLeaveManySave: "",
      attendanceEatManySave: "",
      attendanceDetailDateList: [],
      attendanceArriveList: [],
      attendanceLeaveList: [],
      attendanceEatList: [],
      checkboxAllMorning: false,
      checkboxAllAfternoon: false,
      checkboxAllEvening: false,
      checkboxAllLeave: false,
      checkboxAllEatBreakfast: false,
      checkboxAllEatSecondBreakfast: false,
      checkboxAllEatLunch: false,
      checkboxAllEatAfternoon: false,
      checkboxAllEatSecondAfternoon: false,
      checkboxAllEatDinner: false,
      //start
      checkboxAllDay1: false,
      checkboxAllDay2: false,
      checkboxAllDay3: false,
      checkboxAllMorning1: false,
      checkboxAllMorning2: false,
      checkboxAllMorning3: false,
      checkboxAllAfternoon1: false,
      checkboxAllAfternoon2: false,
      checkboxAllAfternoon3: false,
      checkboxAllEvening1: false,
      checkboxAllEvening2: false,
      checkboxAllEvening3: false,

      //end
      fileList: [],
      configSchoolCommon: "",
      configSchoolCommonData: "",
      statusGoToSchoolList: [
        { value: true, label: "Đã điểm danh" },
        { value: false, label: "Chưa điểm danh" },
      ],
      dataSearch: {
        date: "",
        idGrade: "",
        idClass: "",
        absentStatus: "",
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      //false->chưa điểm danh đến
      if (!row.attendanceArrive) {
        return "color: #409EFF";
        //true->nghỉ có phép hoặc không phép cả ngày theo config
      } else if (row.absentStatus) {
        return "color: red";
      }
    },
    tableRowStyleLeave({ row }) {
      //false->chưa điểm danh về
      if (!row.attendanceLeave) {
        return "color: #409EFF";
      }
    },
    tableRowStyleEat({ row }) {
      //false->chưa điểm danh ăn
      if (!row.attendanceEat) {
        return "color: #409EFF";
      }
    },
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      } else if (command == "exportCustom") {
        this.exportExcelAttendanceCustom();
      } else if (command == "exportMonthDetail") {
        this.exportExcelAttendanceMonthDetail();
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "detailDate") {
        this.visibleDetailDate = true;
        this.visibleAttendanceArrive = false;
        this.visibleAtendanceLeave = false;
        this.visibleAttendanceEat = false;
        this.getSearchAllAttendanceDetail();
      } else if (tabNameClick == "attendanceArriveTab") {
        this.visibleDetailDate = false;
        this.visibleAttendanceArrive = true;
        this.visibleAtendanceLeave = false;
        this.visibleAttendanceEat = false;
        this.checkboxAllMorning = false;
        this.checkboxAllAfternoon = false;
        this.checkboxAllEvening = false;
        this.checkAbsentDateInClass("arrive");
      } else if (tabNameClick == "atendanceLeave") {
        this.visibleDetailDate = false;
        this.visibleAttendanceArrive = false;
        this.visibleAtendanceLeave = true;
        this.visibleAttendanceEat = false;
        this.checkboxAllLeave = false;
        this.checkAbsentDateInClass("leave");
      } else if (tabNameClick == "attendanceEat") {
        this.visibleDetailDate = false;
        this.visibleAttendanceArrive = false;
        this.visibleAtendanceLeave = false;
        this.visibleAttendanceEat = true;
        this.checkboxAllEatBreakfast = false;
        this.checkboxAllEatSecondBreakfast = false;
        this.checkboxAllEatLunch = false;
        this.checkboxAllEatAfternoon = false;
        this.checkboxAllEatSecondAfternoon = false;
        this.checkboxAllEatDinner = false;
        this.getSearchAllAttendanceEat();
      }
    },
    // export attendance date
    // exportExcelAttendanceDate() {
    //   let id;
    //   let date;
    //   if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   }
    //   if (id == "" || id == undefined) {
    //     this.$message({
    //       message: "Bạn chưa chọn lớp",
    //       type: "error",
    //     });
    //     return;
    //   }
    //   this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
    //     distinguishCancelAndClose: true,
    //     closeOnClickModal: false,
    //     confirmButtonText: "Có",
    //     cancelButtonText: "Không",
    //   }).then(() => {
    //     let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    //     return http
    //       .get(
    //         `/attendance-kids/export-attendance-kid?idClass=` +
    //           id +
    //           `&date=` +
    //           date
    //       )
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute(
    //           "download",
    //           "QUAN_LY_DIEM_DANH_HOC_SINH_" + myDate + ".xlsx"
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
      let id;
      let date;
      if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      }
      if (id == "" || id == undefined) {
        this.$message({
          message: "Bạn chưa chọn lớp",
          type: "error",
        });
        return;
      }
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcelDate();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        AttendanceService.getExportExcelDate(id, date)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_DIEM_DANH_HOC_SINH_${myDate}`;
                const merges = [
                  "A5:B5",
                  "C5:E5",
                  "F5:N5",
                  "O5:T5",
                  "U5:V5",
                  "F6:H6",
                  "I6:K6",
                  "L6:N6",
                  "A6:A7",
                  "C6:C7",
                  "B6:B7",
                  "D6:D7",
                  "E6:E7",
                  "O6:O7",
                  "P6:P7",
                  "Q6:Q7",
                  "R6:R7",
                  "S6:S7",
                  "T6:T7",
                  "U6:U7",
                  "V6:V7",
                  "W6:W7",
                ];
                const tHeader = [
                  "",
                  "",
                  "",
                  "",
                  "",
                  "Có phép",
                  "Không phép",
                  "Đi học",
                  "Có phép",
                  "Không phép",
                  "Đi học",
                  "Có phép",
                  "Không phép",
                  "Đi học",
                  "",
                  "",
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
                  "pro22",
                  "pro23",
                ];
                let columnList = [
                  { col: 5 },
                  { col: 25 },
                  { col: 12 },
                  { col: 15 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 20 },
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
        name: "A6:W7",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font: font,
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
        name: "O5:T50",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol5 = {
        name: "U5:V50",
        style: {
          fill: { fgColor: { rgb: "3399ff" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol6 = {
        name: "W5:W50",
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
    // export attendance month
    // exportExcelAttendanceMonth() {
    //   let id;
    //   let date;
    //   if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   }
    //   if (id == "" || id == undefined) {
    //     this.$message({
    //       message: "Bạn chưa chọn lớp",
    //       type: "error",
    //     });
    //     return;
    //   }
    //   this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
    //     distinguishCancelAndClose: true,
    //     closeOnClickModal: false,
    //     confirmButtonText: "Có",
    //     cancelButtonText: "Không",
    //   }).then(() => {
    //     let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    //     return http
    //       .get(
    //         `/attendance-kids/export-attendance-kid-month?idClass=` +
    //           id +
    //           `&date=` +
    //           date
    //       )
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute(
    //           "download",
    //           "QUAN_LY_DIEM_DANH_HOC_SINH_THEO_THANG_" + myDate + ".xlsx"
    //         );
    //         document.body.appendChild(link);
    //         link.click();
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         this.$message({
    //           message: "Xuất file thất bại",
    //           type: "error",
    //         });
    //       });
    //   });
    // },
    exportExcelAttendanceMonth() {
      let id;
      let date;
      if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (this.dataSearch.idClass != "" && this.dataSearch.date != "") {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      }
      if (id == "" || id == undefined) {
        this.$message({
          message: "Bạn chưa chọn lớp",
          type: "error",
        });
        return;
      }
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcelDate();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        AttendanceService.getExportExcelMonth(id, date)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_DIEM_DANH_HOC_SINH_THEO_THANG_${myDate}`;
                const merges = [
                  "A5:B5",
                  "C5:E5",
                  "F5:N5",
                  "O5:T5",
                  "U5:V5",
                  "F6:H6",
                  "I6:K6",
                  "L6:N6",
                  "A6:A7",
                  "C6:C7",
                  "B6:B7",
                  "D6:D7",
                  "E6:E7",
                  "O6:O7",
                  "P6:P7",
                  "Q6:Q7",
                  "R6:R7",
                  "S6:S7",
                  "T6:T7",
                  "U6:U7",
                  "V6:V7",
                  "W6:W7",
                ];
                const tHeader = [
                  "",
                  "",
                  "",
                  "",
                  "",
                  "Có phép",
                  "Không phép",
                  "Đi học",
                  "Có phép",
                  "Không phép",
                  "Đi học",
                  "Có phép",
                  "Không phép",
                  "Đi học",
                  "",
                  "",
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
                  "pro22",
                  "pro23",
                ];
                let columnList = [
                  { col: 5 },
                  { col: 25 },
                  { col: 12 },
                  { col: 15 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 20 },
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

    // export attendance custom
    exportExcelAttendanceCustom() {
      this.showDialogCreateAttendanceKidCustomExcel = true;
    },
    exportExcelAttendanceMonthDetail() {
      this.showDialogCreateAttendanceKidMonthDetail = true;
    },

    handleShowDetailDate(index, row) {
      this.$refs.AttendanceView.getDataArriveRowInitial(row);
      this.showDialogViewDetailDate = true;
    },
    closeDialogViewDetailDateMethod() {
      this.showDialogViewDetailDate = false;
    },
    handleArriveRowDetail(index, row) {
      this.$refs.AttendanceArriveOfMonth.getAttendanceArriveDetailInital(
        row.kids.id,
        row.kids.fullName,
        this.configSchoolCommon
      );
      setTimeout(() => {
        this.showDialogDetailArrive = true;
      }, 100);
    },
    handleLeaveRowDetail(index, row) {
      this.$refs.AttendanceLeaveOfMonth.getAttendanceLeaveDetailInital(
        row.kids.id,
        row.kids.fullName
      );
      setTimeout(() => {
        this.showDialogDetailLeave = true;
      }, 100);
    },

    handleEatRowDetail(index, row) {
      this.$refs.AttendanceEatOfMonth.getAttendanceEatDetailInital(
        row.kids.id,
        row.kids.fullName,
        this.configSchoolCommon
      );
      setTimeout(() => {
        this.showDialogDetailEat = true;
      }, 100);
    },
    viewCalendarClassMethod() {
      this.showDayOffClassDialog = true;
      this.$refs.DayOffClassDialog.getCalendarInitial(this.dataSearch.idClass);
    },
    closeDialogDetailArriveMethod() {
      this.showDialogDetailArrive = false;
      this.getSearchAllAttendanceArrive();
    },
    closeDialogDetailLeaveMethod() {
      this.showDialogDetailLeave = false;
      this.getSearchAllAttendanceLeave();
    },
    closeDialogDetailEatMethod() {
      this.showDialogDetailEat = false;
      this.getSearchAllAttendanceEat();
    },
    closeDayOffClassDialog() {
      this.showDayOffClassDialog = false;
    },
    closeDialogAttendanceKidCustomExcel() {
      this.showDialogCreateAttendanceKidCustomExcel = false;
      this.getSearchAllAttendanceEat();
    },
    closeDialogAttendanceKidMonthDetailExcel() {
      this.showDialogCreateAttendanceKidMonthDetail = false;
    },
    handleArriveUpdateRowMethod(index, row) {
      this.$refs.AttendanceArriveUpdate.getDataArriveRowInitial(row);
      this.showDialogUpdateArrive = true;
    },
    closeDialogUpdateArriveMethod() {
      this.showDialogUpdateArrive = false;
      this.getSearchAllAttendanceArrive();
    },
    handleSelectionChangeArrive(val) {
      this.multipleSelectionArrive = val;
    },
    handleSelectionChangeLeave(val) {
      this.multipleSelectionLeave = val;
    },
    handleSelectionChangeEat(val) {
      this.multipleSelectionEat = val;
    },
    handleLeaveUpdateRowMethod(index, row) {
      this.$refs.AttendanceLeaveUpdate.getDataLeaveRowInitial(row);
      this.showDialogUpdateLeave = true;
    },
    closeDialogUpdateLeaveMethod() {
      this.showDialogUpdateLeave = false;
      this.getSearchAllAttendanceLeave();
    },
    /*file */

    /**handleUploadChange */
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleUploadChange() {
      this.fileList = this.$refs.upload.uploadFiles;
    },
    submitUpload() {
      let file = [];
      this.fileList.forEach((x) => file.push(x.raw));
      const formData = new FormData();
      formData.append("upload", file[0]);
      console.log(this.fileList[0].raw);
      console.log(file);
    },

    /**
     * lưu một row cho điểm danh đến
     */
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
      AttendanceService.saveArriveOne(row.id, row)
        .then((resp) => {
          this.attendanceArriveOneSave = resp.data.data;
          this.$message({
            message: "Lưu điểm danh đến thành công",
            type: "success",
          });
          this.getSearchAllAttendanceArrive();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: err.response.data.message,
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
            message: "Chưa chọn giờ đến cho học sinh đã chọn",
            type: "error",
          });
        }
        if (checkTimeNull) {
          throw BreakException;
        }
      });

      this.loadingButtonSaveArriveDate = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu điểm danh đến cho " +
          kidList.length +
          " học sinh đã chọn?",
        "Lưu điểm danh đến",
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
                message: "Lưu điểm danh đến cho nhiều học sinh thành công",
                type: "success",
              });
              this.getSearchAllAttendanceArrive();
            })
            .catch((err) => {
              console.log(err);
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
    /**
     * lưu một row cho điểm danh về
     */
    handleLeaveRowSave(index, row) {
      AttendanceService.saveLeaveOne(row.id, row)
        .then((resp) => {
          this.attendanceLeaveOneSave = resp.data.data;
          this.$message({
            message: "Lưu điểm danh về thành công",
            type: "success",
          });
          this.getSearchAllAttendanceLeave();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    /**
     * lưu nhiều row cho điểm danh về
     */

    handleLeaveManyRowSave() {
      let kidList = this.multipleSelectionLeave;
      kidList = kidList.filter(
        (x) =>
          x.attendanceArrive &&
          (x.attendanceArriveKids.morning ||
            x.attendanceArriveKids.afternoon ||
            x.attendanceArriveKids.evening)
      );
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn ở trạng thái đi học",
          type: "error",
        });
        return;
      }
      this.loadingButtonSaveLeaveDate = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu điểm danh về cho " +
          kidList.length +
          " học sinh đã chọn?",
        "Lưu điểm danh về",
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
                message: "Lưu điểm danh về cho nhiều học sinh thành công",
                type: "success",
              });
              this.getSearchAllAttendanceLeave();
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
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
          this.getSearchAllAttendanceEat();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: err.response.data.message,
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
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.loadingButtonSaveEatDate = true;
      this.$confirm(
        "Bạn có chắc chắn muốn lưu điểm danh ăn cho " +
          kidList.length +
          " học sinh đã chọn?",
        "Lưu điểm danh ăn",
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
                message: "Lưu điểm danh ăn cho nhiều học sinh thành công",
                type: "success",
              });
              this.getSearchAllAttendanceEat();
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonSaveEatDate = false;
          }, 500);
        });
    },

    /**
     * kiểm tra lớp đó trong ngày đó có đơn xin phép ngày chưa xác nhận hay không
     */
    checkAbsentDateInClass(type) {
      AttendanceService.checkAbsentDate(this.dataSearch.date, this.dataSearch.idClass)
        .then((resp) => {
          let absentList = resp.data.data;
          if (absentList.length > 0) {
            if (type == "arrive") {
              this.attendanceArriveList = [];
            } else if (type == "leave") {
              this.attendanceLeaveList = [];
            }
            this.$alert(
              "Bạn có " +
                absentList.length +
                " đơn xin nghỉ chưa được xác nhận, vui lòng xác nhận trước khi điểm danh",
              "Thông báo!",
              {
                confirmButtonText: "Đã hiểu",
              }
            );
          } else {
            if (type == "arrive") {
              this.getSearchAllAttendanceArrive();
            } else if (type == "leave") {
              this.getSearchAllAttendanceLeave();
            }
          }
        })
        .catch((err) => {
          this.attendanceArriveList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    /**
     * lấy danh sách tab chi tiết
     */
    getSearchAllAttendanceDetail() {
      this.loadingData = true;
      this.textTable = "";
      AttendanceService.searchAll(
        this.dataSearch.date,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.absentStatus
      )
        .then((resp) => {
          this.attendanceDetailDateList = resp.data.data.attendanceDetailDateList;
          this.configSchoolCommon = resp.data.data.attendanceConfigResponse;
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
     * tìm kiếm điểm danh đến cho các học sinh trong ngày
     */
    getSearchAllAttendanceArrive() {
      this.loadingData = true;
      this.textTable = "";
      AttendanceService.searchArriveDate(
        this.dataSearch.date,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.absentStatus
      )
        .then((resp) => {
          let dataList = (this.attendanceArriveList = resp.data.data.attendanceDateList);
          this.configSchoolCommon = resp.data.data.attendanceConfigResponse;
          dataList.forEach((x) => {
            this.setCheckAllDayFromSession(x.attendanceArriveKids);
          });
          if (dataList.length > 0) {
            this.setCheckboxHeaderMorning();
            this.setCheckboxHeaderAfternoon();
            this.setCheckboxHeaderEvening();
          }
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.attendanceArriveList = [];
        })
        .finally(() => {
          if (this.attendanceArriveList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm điểm danh về cho các học sinh trong ngày
     */
    getSearchAllAttendanceLeave() {
      this.loadingData = true;
      this.textTable = "";
      AttendanceService.searchLeaveDate(
        this.dataSearch.date,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.absentStatus
      )
        .then((resp) => {
          this.attendanceLeaveList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.attendanceLeaveList = [];
        })
        .finally(() => {
          if (this.attendanceLeaveList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm điểm danh ăn cho các học sinh trong ngày
     */
    getSearchAllAttendanceEat() {
      this.loadingData = true;
      this.textTable = "";
      AttendanceService.searchEatDate(
        this.dataSearch.date,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.absentStatus
      )
        .then((resp) => {
          this.attendanceEatList = resp.data.data.attendanceEatList;
          this.configSchoolCommon = resp.data.data.attendanceConfigResponse;
        })
        .catch((err) => {
          console.log(err);
          this.attendanceEatList = [];
        })
        .finally(() => {
          if (this.attendanceEatList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    changeCheckboxAllLeave() {
      let dataList = this.attendanceLeaveList.filter(
        (x) =>
          x.attendanceArrive &&
          (x.attendanceArriveKids.morning ||
            x.attendanceArriveKids.afternoon ||
            x.attendanceArriveKids.evening)
      );
      dataList.forEach((x) => {
        x.attendanceLeaveKids.statusLeave = this.checkboxAllLeave;
        this.setNullTimeLeaveMethod(x);
      });
    },
    /**
     * set time mỗi row cho điểm danh về
     */
    setNullTimeLeaveMethod(row) {
      if (!row.attendanceLeaveKids.statusLeave) {
        row.attendanceLeaveKids.timeLeaveKid = null;
        row.attendanceLeaveKids.minutePickupLate = 0;
      } else {
        row.attendanceLeaveKids.timeLeaveKid = moment(String(new Date())).format("HH:mm");
        this.changeTimeLeave(row);
      }
    },
    changeCheckboxAllEat(type) {
      this.attendanceEatList.forEach((x) => {
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
    changeCheckboxAllMorning() {
      this.attendanceArriveList.forEach((x) => {
        x.attendanceArriveKids.morning = this.checkboxAllMorning;
        this.setFalseAbsentMethod(x);
      });
    },

    changeCheckboxAllAfternoon() {
      this.attendanceArriveList.forEach((x) => {
        x.attendanceArriveKids.afternoon = this.checkboxAllAfternoon;
        this.setFalseAbsentMethod(x);
      });
    },
    changeCheckboxAllEvening() {
      this.attendanceArriveList.forEach((x) => {
        x.attendanceArriveKids.evening = this.checkboxAllEvening;
        this.setFalseAbsentMethod(x);
      });
    },

    /**
     * chọn checkbox mỗi hàng ở cả ngày
     */
    checkRowAllDay(type, row) {
      let configMoring = this.configSchoolCommon.morningAttendanceArrive;
      let configAfternoon = this.configSchoolCommon.afternoonAttendanceArrive;
      let configEvening = this.configSchoolCommon.eveningAttendanceArrive;
      let checkboxAllDay = row.attendanceArriveKids.allDay;
      let checkboxAllDayYes = row.attendanceArriveKids.allDayYes;
      let checkboxAllDayNo = row.attendanceArriveKids.allDayNo;
      if (type == 1) {
        if (configMoring) {
          row.attendanceArriveKids.morning = checkboxAllDay;
          this.checkRowMorningDay(type, row);
        }
        if (configAfternoon) {
          row.attendanceArriveKids.afternoon = checkboxAllDay;
          this.checkRowAfternoonDay(type, row);
        }
        if (configEvening) {
          row.attendanceArriveKids.evening = checkboxAllDay;
          this.checkRowEveningDay(type, row);
        }
      }
      if (type == 2) {
        if (configMoring) {
          row.attendanceArriveKids.morningYes = checkboxAllDayYes;
          this.checkRowMorningDay(type, row);
        }
        if (configAfternoon) {
          row.attendanceArriveKids.afternoonYes = checkboxAllDayYes;
          this.checkRowAfternoonDay(type, row);
        }
        if (configEvening) {
          row.attendanceArriveKids.eveningYes = checkboxAllDayYes;
          this.checkRowEveningDay(type, row);
        }
      }
      if (type == 3) {
        if (configMoring) {
          row.attendanceArriveKids.morningNo = checkboxAllDayNo;
          this.checkRowMorningDay(type, row);
        }
        if (configAfternoon) {
          row.attendanceArriveKids.afternoonNo = checkboxAllDayNo;
          this.checkRowAfternoonDay(type, row);
        }
        if (configEvening) {
          row.attendanceArriveKids.eveningNo = checkboxAllDayNo;
          this.checkRowEveningDay(type, row);
        }
      }
      this.setAllCheckboxAllDay();
    },

    /**
     * chọn checkbox ở header của cả ngày
     */
    changeAllDayMothod(index, type) {
      let dataList = this.attendanceArriveList;
      let checkAll1 = this.checkboxAllDay1;
      let checkAll2 = this.checkboxAllDay2;
      let checkAll3 = this.checkboxAllDay3;
      dataList.forEach((x) => {
        if (type == 1) {
          x.attendanceArriveKids.allDay = checkAll1;
          if (checkAll1) {
            x.attendanceArriveKids.allDayYes = false;
            x.attendanceArriveKids.allDayNo = false;
          }
        } else if (type == 2) {
          x.attendanceArriveKids.allDayYes = checkAll2;
          if (checkAll2) {
            x.attendanceArriveKids.allDay = false;
            x.attendanceArriveKids.allDayNo = false;
          }
        } else if (type == 3) {
          x.attendanceArriveKids.allDayNo = checkAll3;
          if (checkAll3) {
            x.attendanceArriveKids.allDay = false;
            x.attendanceArriveKids.allDayYes = false;
          }
        }
        this.checkRowAllDay(type, x);
      });
      this.setUniquesHeaderAllDay(type);
    },
    /**
     * check all sáng
     */
    changeAllMorning(index, type) {
      let dataList = this.attendanceArriveList;
      let checkAll1 = this.checkboxAllMorning1;
      let checkAll2 = this.checkboxAllMorning2;
      let checkAll3 = this.checkboxAllMorning3;
      dataList.forEach((x) => {
        if (type == 1) {
          //đi học
          x.attendanceArriveKids.morning = checkAll1;
          if (checkAll1) {
            x.attendanceArriveKids.morningYes = false;
            x.attendanceArriveKids.morningNo = false;
          }
        } else if (type == 2) {
          //nghỉ có phép
          x.attendanceArriveKids.morningYes = checkAll2;
          if (checkAll2) {
            x.attendanceArriveKids.morning = false;
            x.attendanceArriveKids.morningNo = false;
          }
        } else if (type == 3) {
          //nghỉ không phép
          x.attendanceArriveKids.morningNo = checkAll3;
          if (checkAll3) {
            x.attendanceArriveKids.morning = false;
            x.attendanceArriveKids.morningYes = false;
          }
        }
        this.setTimeArriveDataMethod(x.attendanceArriveKids);
        this.setCheckAllDayFromSession(x.attendanceArriveKids);
      });
      this.setUniquesHeaderMornig(type);
    },

    /**
     * check tất cả các row buổi chiều
     */
    changeAllAfternoon(index, type) {
      let dataList = this.attendanceArriveList;
      let checkAll1 = this.checkboxAllAfternoon1;
      let checkAll2 = this.checkboxAllAfternoon2;
      let checkAll3 = this.checkboxAllAfternoon3;
      //đi học
      dataList.forEach((x) => {
        if (type == 1) {
          x.attendanceArriveKids.afternoon = checkAll1;
          if (checkAll1) {
            x.attendanceArriveKids.afternoonYes = false;
            x.attendanceArriveKids.afternoonNo = false;
          }
        } else if (type == 2) {
          //nghỉ có phép
          x.attendanceArriveKids.afternoonYes = checkAll2;
          if (checkAll2) {
            x.attendanceArriveKids.afternoon = false;
            x.attendanceArriveKids.afternoonNo = false;
          }
        } else if (type == 3) {
          //nghỉ không phép
          x.attendanceArriveKids.afternoonNo = checkAll3;
          if (checkAll3) {
            x.attendanceArriveKids.afternoon = false;
            x.attendanceArriveKids.afternoonYes = false;
          }
        }
        this.setTimeArriveDataMethod(x.attendanceArriveKids);
        this.setCheckAllDayFromSession(x.attendanceArriveKids);
      });
      this.setUniquesHeaderAfternoon(type);
    },
    /**
     * check tất cả các row buổi tối
     */
    changeAllEvening(index, type) {
      let dataList = this.attendanceArriveList;
      let checkAll1 = this.checkboxAllEvening1;
      let checkAll2 = this.checkboxAllEvening2;
      let checkAll3 = this.checkboxAllEvening3;
      //đi học
      dataList.forEach((x) => {
        if (type == 1) {
          x.attendanceArriveKids.evening = checkAll1;
          if (checkAll1) {
            x.attendanceArriveKids.eveningYes = false;
            x.attendanceArriveKids.eveningNo = false;
          }
        } else if (type == 2) {
          //nghỉ có phép
          x.attendanceArriveKids.eveningYes = checkAll2;
          if (checkAll2) {
            x.attendanceArriveKids.evening = false;
            x.attendanceArriveKids.eveningNo = false;
          }
        } else if (type == 3) {
          //nghỉ không phép
          x.attendanceArriveKids.eveningNo = checkAll3;
          if (checkAll3) {
            x.attendanceArriveKids.evening = false;
            x.attendanceArriveKids.eveningYes = false;
          }
        }
        this.setTimeArriveDataMethod(x.attendanceArriveKids);
        this.setCheckAllDayFromSession(x.attendanceArriveKids);
      });
      this.setUniquesHeaderEvening(type);
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
    /**
     * set unique checkBox header cho cả ngày
     */
    setUniquesHeaderAllDay(type) {
      let checkAll1 = this.checkboxAllDay1;
      let checkAll2 = this.checkboxAllDay2;
      let checkAll3 = this.checkboxAllDay3;
      if (type == 1) {
        if (checkAll1) {
          this.checkboxAllDay2 = false;
          this.checkboxAllDay3 = false;
        }
      } else if (type == 2) {
        if (checkAll2) {
          this.checkboxAllDay1 = false;
          this.checkboxAllDay3 = false;
        }
      } else if (type == 3) {
        if (checkAll3) {
          this.checkboxAllDay1 = false;
          this.checkboxAllDay2 = false;
        }
      }
    },
    /**
     * check row buổi sáng
     */
    checkRowMorningDay(type, row) {
      let data = row.attendanceArriveKids;
      //đi học
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
      this.setTimeArriveDataMethod(data);
      this.setCheckAllDayFromSession(data);
      this.setCheckboxHeaderMorning();
    },

    /**
     * check row buổi chiều
     */
    checkRowAfternoonDay(type, row) {
      let data = row.attendanceArriveKids;
      //đi học
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
      this.setTimeArriveDataMethod(data);
      this.setCheckAllDayFromSession(data);
      this.setCheckboxHeaderAfternoon();
    },
    /**
     * check row buổi tối
     */
    checkRowEveningDay(type, row) {
      let data = row.attendanceArriveKids;
      //đi học
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
      this.setTimeArriveDataMethod(data);
      this.setCheckAllDayFromSession(data);
      this.setCheckboxHeaderEvening();
    },
    /**
     * set giá trị cho phần header các buổi sáng
     */
    setCheckboxHeaderMorning() {
      let dataList = this.attendanceArriveList;
      let countMorning1 = dataList.filter((x) => x.attendanceArriveKids.morning).length;
      if (countMorning1 == dataList.length) {
        this.checkboxAllMorning1 = true;
      } else {
        this.checkboxAllMorning1 = false;
      }
      let countMorning2 = dataList.filter((x) => x.attendanceArriveKids.morningYes)
        .length;
      if (countMorning2 == dataList.length) {
        this.checkboxAllMorning2 = true;
      } else {
        this.checkboxAllMorning2 = false;
      }
      let countMorning3 = dataList.filter((x) => x.attendanceArriveKids.morningNo).length;
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
      let dataList = this.attendanceArriveList;
      let count1 = dataList.filter((x) => x.attendanceArriveKids.afternoon).length;
      if (count1 == dataList.length) {
        this.checkboxAllAfternoon1 = true;
      } else {
        this.checkboxAllAfternoon1 = false;
      }
      let count2 = dataList.filter((x) => x.attendanceArriveKids.afternoonYes).length;
      if (count2 == dataList.length) {
        this.checkboxAllAfternoon2 = true;
      } else {
        this.checkboxAllAfternoon2 = false;
      }
      let count3 = dataList.filter((x) => x.attendanceArriveKids.afternoonNo).length;
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
      let dataList = this.attendanceArriveList;
      let count1 = dataList.filter((x) => x.attendanceArriveKids.evening).length;
      if (count1 == dataList.length) {
        this.checkboxAllEvening1 = true;
      } else {
        this.checkboxAllEvening1 = false;
      }
      let count2 = dataList.filter((x) => x.attendanceArriveKids.eveningYes).length;
      if (count2 == dataList.length) {
        this.checkboxAllEvening2 = true;
      } else {
        this.checkboxAllEvening2 = false;
      }
      let count3 = dataList.filter((x) => x.attendanceArriveKids.eveningNo).length;
      if (count3 == dataList.length) {
        this.checkboxAllEvening3 = true;
      } else {
        this.checkboxAllEvening3 = false;
      }
    },

    /**
     * set các checkbox ở header trong cả ngày
     */
    setAllCheckboxAllDay() {
      let dataList = this.attendanceArriveList;
      let count1 = dataList.filter((x) => x.attendanceArriveKids.allDay).length;
      if (count1 == dataList.length) {
        this.checkboxAllDay1 = true;
      } else {
        this.checkboxAllDay1 = false;
      }
      let count2 = dataList.filter((x) => x.attendanceArriveKids.allDayYes).length;
      if (count2 == dataList.length) {
        this.checkboxAllDay2 = true;
      } else {
        this.checkboxAllDay2 = false;
      }
      let count3 = dataList.filter((x) => x.attendanceArriveKids.allDayNo).length;
      if (count3 == dataList.length) {
        this.checkboxAllDay3 = true;
      } else {
        this.checkboxAllDay3 = false;
      }
    },
    /**
     * set giá trị checkbox trong mỗi row ở phần cả ngày khi click ở các buổi
     */
    setCheckAllDayFromSession(dataArrive) {
      let configMoring = this.configSchoolCommon.morningAttendanceArrive;
      let configAfternoon = this.configSchoolCommon.afternoonAttendanceArrive;
      let configEvening = this.configSchoolCommon.eveningAttendanceArrive;
      //đi học
      if (!dataArrive.morning && !dataArrive.afternoon && !dataArrive.evening) {
        dataArrive.allDay = false;
      } else if (
        configMoring == dataArrive.morning &&
        configAfternoon == dataArrive.afternoon &&
        configEvening == dataArrive.evening
      ) {
        if (dataArrive.morning || dataArrive.afternoon || dataArrive.evening) {
          dataArrive.allDay = true;
        }
      } else {
        dataArrive.allDay = false;
      }
      //nghỉ có phép
      if (!dataArrive.morningYes && !dataArrive.afternoonYes && !dataArrive.eveningYes) {
        dataArrive.allDayYes = false;
      } else if (
        configMoring == dataArrive.morningYes &&
        configAfternoon == dataArrive.afternoonYes &&
        configEvening == dataArrive.eveningYes
      ) {
        if (dataArrive.morningYes || dataArrive.afternoonYes || dataArrive.eveningYes) {
          dataArrive.allDayYes = true;
        }
      } else {
        dataArrive.allDayYes = false;
      }
      //nghỉ không phép
      if (!dataArrive.morningNo && !dataArrive.afternoonNo && !dataArrive.eveningNo) {
        dataArrive.allDayNo = false;
      } else if (
        configMoring == dataArrive.morningNo &&
        configAfternoon == dataArrive.afternoonNo &&
        configEvening == dataArrive.eveningNo
      ) {
        if (dataArrive.morningNo || dataArrive.afternoonNo || dataArrive.eveningNo) {
          dataArrive.allDayNo = true;
        }
      } else {
        dataArrive.allDayNo = false;
      }
      this.setAllCheckboxAllDay();
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
    setFalseAllDayMethod(row) {
      row.attendanceArriveKids.morning = false;
      row.attendanceArriveKids.afternoon = false;
      row.attendanceArriveKids.evening = false;
    },
    setFalseAbsentMethod(row) {
      if (
        row.attendanceArriveKids.morning ||
        row.attendanceArriveKids.afternoon ||
        row.attendanceArriveKids.evening
      ) {
        row.attendanceArriveKids.timeArriveKid = moment(String(new Date())).format(
          "HH:mm"
        );
      }
      if (
        !row.attendanceArriveKids.morning &&
        !row.attendanceArriveKids.afternoon &&
        !row.attendanceArriveKids.evening
      ) {
        row.attendanceArriveKids.timeArriveKid = "";
      }

      row.absentLetterYes = false;
      row.absentLetterNo = false;
    },
    /**
     * set time for orther method
     */
    setTimeArriveDataMethod(data) {
      if (data.morning || data.afternoon || data.evening) {
        data.timeArriveKid = moment(String(new Date())).format("HH:mm");
      } else if (!data.morning && !data.afternoon && !data.evening) {
        data.timeArriveKid = null;
      }
    },
    setNullTimeArriveMethod(row) {
      row.attendanceArriveKids.timeArriveKid = null;
    },
    setYesTimeArriveMethod(row) {
      row.attendanceArriveKids.timeArriveKid = moment(String(new Date())).format("HH:mm");
    },

    /**
     * set thời gian đón muộn
     */
    changeTimeLeave(row) {
      let timeLeave = row.attendanceLeaveKids.timeLeaveKid.split(":");
      let timeConfig = this.configSchoolCommonData.timePickupKid.split(":");
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
    getCurrentDate() {
      this.dataSearch.date = moment(String(new Date())).format("YYYY-MM-DD");
    },
    /**
     * đối khối cho tab detail
     */
    async changeGradeDetail() {
      await this.getClassInGrade();
      this.getSearchAllAttendanceDetail();
    },
    /**
     * đối khối cho tab arrive
     */
    async changeGradeArrive() {
      await this.getClassInGrade();
      this.checkAbsentDateInClass("arrive");
    },
    /**
     * đối khối cho tab detail
     */
    async changeGradeLeave() {
      await this.getClassInGrade();
      this.checkAbsentDateInClass("leave");
    },
    /**
     * đối khối cho tab detail
     */
    async changeGradeEat() {
      await this.getClassInGrade();
      this.getSearchAllAttendanceEat();
    },
    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
          if (this.gradeOfSchoolList.length > 0) {
            this.dataSearch.idGrade = this.gradeOfSchoolList[0].id;
          }
    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassInGrade() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])

      if (this.classOfGradeList.length > 0) {
            this.dataSearch.idClass = this.classOfGradeList[0].id;
          } else {
            this.dataSearch.idClass = "";
          }

    },
    /**
     * lấy cấu hình chung
     */
    getConfigCommonMethod() {
      AttendanceService.getConfigCommonForAttendance()
        .then((resp) => {
          this.configSchoolCommonData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
        .then((resp) => {
          this.classOfGradeList = resp.data.data;
          this.dataSearch.idClass = this.classOfGradeList.filter((x) => x.checked)[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * get data initial
     */
    async fetchDataMany() {
      this.getCurrentDate();
      this.getConfigCommonMethod();
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade()]);
        await this.getClassInGrade();
      } else if (this.getAppTypeUserLogin == "teacher") {
        await this.getClassListTeacher();
      }

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
/deep/.el-icon-loading:before {
  content: "\e6cf";
}
/deep/.el-loading-spinner .el-loading-text {
  color: #606266;
  font-size: 15px;
}
/deep/.el-loading-spinner {
  top: 67%;
  width: 100%;
  text-align: center;
  position: absolute;
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
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
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
.second-title {
  font-size: 10px;
}
.absent-yes {
  color: #c82ee7;
}
.absent-no {
  color: #e61010;
}
</style>
