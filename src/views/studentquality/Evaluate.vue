<template>
  <div style="margin-top: 5px">
    <div
      class="search-input"
      style="margin-bottom: -20px; position: relative; z-index: 1"
    >
      <!-- search of evaluate detail -->
      <div>
        <el-date-picker
          v-if="
            activeTabName == 'evaluateDetail' || activeTabName == 'evaluateDate'
          "
          class="input-common input-date"
          style="width: 135px"
          v-model="dataSearch.date"
          type="date"
          :clearable="false"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Chọn ngày"
          :picker-options="startDayOfWeek"
          @change="searchDataMethod()"
        ></el-date-picker>
        <el-date-picker
          v-else-if="activeTabName == 'evaluateWeek'"
          class="input-common input-date"
          style="width: 125px"
          :clearable="false"
          v-model="dataSearch.dateWeek"
          type="week"
          format="Tuần WW"
          value-format="yyyy-MM-dd"
          placeholder="Chọn tuần"
          :picker-options="startDayOfWeek"
          @change="searchDataMethod()"
        ></el-date-picker>
        <el-date-picker
          v-else-if="activeTabName == 'evaluateMonth'"
          class="input-common input-date"
          style="width: 165px"
          v-model="dataSearch.dateMonth"
          type="month"
          :clearable="false"
          format="'Tháng 'MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Chọn tháng"
          @change="searchDataMethod()"
        ></el-date-picker>

        <!-- chọn khối -->
        <el-select
          v-if="this.getAppTypeUserLogin == 'plus'"
          class="input-common input-grade"
          style="width: 140px"
          v-model="dataSearch.idGrade"
          @change="searchDataMethod('changeGrade')"
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
          @change="searchDataMethod()"
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
          v-model="dataSearch.approved"
          placeholder="Chọn tình trạng"
          clearable
          class="input-common input-status"
          style="width: 160px"
          @change="searchDataMethod()"
        >
          <el-option
            v-for="item in statusApproved"
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
        <el-tabs
          type="card"
          @tab-click="handleClickTab"
          v-model="activeTabName"
        >
          <!-- tab evaluate detail date -->
          <el-tab-pane label="Chi tiết ngày" name="evaluateDetail">
            <el-table
              ref="tableDetailDate"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="evaluateDateDetailDateList"
              :cell-style="tableRowStyleDetail"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChangeDetailDate"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column type="expand" width="1">
                <template slot-scope="scope">
                  <div style="margin: 10px 15px 0 55px">
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content" style="margin-top: 10px">
                          Học tập
                        </div>
                      </el-col>
                      <el-col :span="17">
                        <div class="grid-content">
                          <el-input
                            type="textarea"
                            autosize
                            v-model="scope.row.learnContent"
                            placeholder="Nhập nội dung"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col
                        v-if="
                          checkPermission(['studentQuality_evaluate_update'])
                        "
                        :span="4"
                      >
                        <div style="text-align: right">
                          <el-button
                            type="success"
                            size="mini"
                            @click="
                              handleShowSampleDateRow(scope.row, 'Học tập')
                            "
                            >Mẫu</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content" style="margin-top: 10px">
                          Ăn uống
                        </div>
                      </el-col>
                      <el-col :span="17">
                        <div class="grid-content">
                          <el-input
                            type="textarea"
                            autosize
                            v-model="scope.row.eatContent"
                            placeholder="Nhập nội dung"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col
                        v-if="
                          checkPermission(['studentQuality_evaluate_update'])
                        "
                        :span="4"
                      >
                        <div style="text-align: right">
                          <el-button
                            type="success"
                            size="mini"
                            @click="
                              handleShowSampleDateRow(scope.row, 'Ăn uống')
                            "
                            >Mẫu</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content" style="margin-top: 10px">
                          Ngủ nghỉ
                        </div>
                      </el-col>
                      <el-col :span="17">
                        <div class="grid-content">
                          <el-input
                            type="textarea"
                            autosize
                            v-model="scope.row.sleepContent"
                            placeholder="Nhập nội dung"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col
                        v-if="
                          checkPermission(['studentQuality_evaluate_update'])
                        "
                        :span="4"
                      >
                        <div style="text-align: right">
                          <el-button
                            type="success"
                            size="mini"
                            @click="
                              handleShowSampleDateRow(scope.row, 'Ngủ nghỉ')
                            "
                            >Mẫu</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content" style="margin-top: 10px">
                          Vệ sinh
                        </div>
                      </el-col>
                      <el-col :span="17">
                        <div class="grid-content">
                          <el-input
                            type="textarea"
                            autosize
                            v-model="scope.row.sanitaryContent"
                            placeholder="Nhập nội dung"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col
                        v-if="
                          checkPermission(['studentQuality_evaluate_update'])
                        "
                        :span="4"
                      >
                        <div style="text-align: right">
                          <el-button
                            type="success"
                            size="mini"
                            @click="
                              handleShowSampleDateRow(scope.row, 'Vệ sinh')
                            "
                            >Mẫu</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content" style="margin-top: 10px">
                          Sức khỏe
                        </div>
                      </el-col>
                      <el-col :span="17">
                        <div class="grid-content">
                          <el-input
                            type="textarea"
                            autosize
                            v-model="scope.row.healtContent"
                            placeholder="Nhập nội dung"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col
                        v-if="
                          checkPermission(['studentQuality_evaluate_update'])
                        "
                        :span="4"
                      >
                        <div style="text-align: right">
                          <el-button
                            type="success"
                            size="mini"
                            @click="
                              handleShowSampleDateRow(scope.row, 'Sức khỏe')
                            "
                            >Mẫu</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content" style="margin-top: 10px">
                          Nhận xét chung
                        </div>
                      </el-col>
                      <el-col :span="17">
                        <div class="grid-content">
                          <el-input
                            type="textarea"
                            autosize
                            v-model="scope.row.commonContent"
                            placeholder="Nhập nội dung"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col
                        v-if="
                          checkPermission(['studentQuality_evaluate_update'])
                        "
                        :span="4"
                      >
                        <div style="text-align: right">
                          <el-button
                            type="success"
                            size="mini"
                            @click="
                              handleShowSampleDateRow(
                                scope.row,
                                'Nhận xét chung'
                              )
                            "
                            >Mẫu</el-button
                          >
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="3">
                        <div class="grid-content" style="margin-top: 10px">
                          File đính kèm
                        </div>
                      </el-col>
                      <el-col :span="17">
                        <div class="grid-content">
                          <el-upload
                            class="upload-demo"
                            action
                            :on-change="handleChange"
                            :file-list="scope.row.evaluateAttachFileList"
                            :on-exceed="handleExceedDetailDate"
                            :on-remove="handleRemove"
                            :on-preview="downloadFile"
                            :auto-upload="false"
                            limit="3"
                            multiple
                          >
                            <el-button
                              v-if="
                                checkPermission([
                                  'studentQuality_evaluate_update',
                                ])
                              "
                              size="small"
                              type="text"
                              style="text-decoration: underline"
                              >Thêm file</el-button
                            >
                          </el-upload>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div style="text-align: right"></div>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="kids.fullName"
                label="Họ tên"
              ></el-table-column>
              <el-table-column label="Tác vụ" width="170" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.expandRow"
                    size="mini"
                    type="primary"
                    @click="toogleExpandDetailDate(scope.$index, scope.row)"
                    >Thu nhỏ</el-button
                  >
                  <el-button
                    v-else
                    type="primary"
                    size="mini"
                    @click="toogleExpandDetailDate(scope.$index, scope.row)"
                    >Mở rộng</el-button
                  >
                  <el-button
                    v-if="checkPermission(['studentQuality_evaluate_update'])"
                    size="mini"
                    type="success"
                    @click="
                      handleRowSaveOnekidDetailDate(scope.$index, scope.row)
                    "
                    >{{ $t("button.save") }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-button
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                class="button-bottom"
                type="success"
                @click="handleSampleDateSaveManyKid()"
                >Nhận xét chung</el-button
              >
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate"
                    >Xuất theo ngày</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>

          <!-- tab evaluate date -->
          <el-tab-pane label="Ngày" name="evaluateDate">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="evaluateDateList"
              :cell-style="tableRowStyleDetail"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChangeDate"
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
                min-width="170"
                label="Họ tên"
              ></el-table-column>
              <el-table-column
                label="Duyệt"
                align="center"
                min-width="80"
                header
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="
                      !!scope.row.learnContent ||
                      !!scope.row.eatContent ||
                      !!scope.row.sleepContent ||
                      !!scope.row.healtContent ||
                      !!scope.row.sanitaryContent ||
                      !!scope.row.commonContent ||
                      scope.row.evaluateAttachFileList.length > 0
                    "
                    @change="changeRowIsApprovedDate(scope.row)"
                    v-model="scope.row.approved"
                  ></el-checkbox>
                  <el-checkbox v-else disabled></el-checkbox>
                </template>
              </el-table-column>

              <el-table-column align="center" label="Phản hồi" min-width="80">
                <template slot-scope="scope">
                  <span
                    v-if="
                      !!scope.row.parentReplyContent &&
                      !scope.row.parentReplyDel
                    "
                  >
                    <el-tooltip
                      v-if="scope.row.schoolReadReply"
                      effect="dark"
                      content="Đã đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: #409eff"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-else
                      effect="dark"
                      content="Chưa đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: red"
                      />
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="Học tập" min-width="80">
                <template slot-scope="scope">
                  <el-popover
                    v-if="!!scope.row.learnContent"
                    placement="top"
                    width="300"
                    trigger="hover"
                    :content="scope.row.learnContent"
                  >
                    <i
                      class="el-icon-circle-check"
                      slot="reference"
                      style="margin-left: 10px; color: #409eff"
                    />
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column align="center" label="Ăn uống" min-width="80">
                <template slot-scope="scope">
                  <el-popover
                    v-if="!!scope.row.eatContent"
                    placement="top"
                    width="300"
                    trigger="hover"
                    :content="scope.row.eatContent"
                  >
                    <i
                      class="el-icon-circle-check"
                      slot="reference"
                      style="margin-left: 10px; color: #409eff"
                    />
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column align="center" label="Ngủ nghỉ" min-width="80">
                <template slot-scope="scope">
                  <el-popover
                    v-if="!!scope.row.sleepContent"
                    placement="top"
                    width="300"
                    trigger="hover"
                    :content="scope.row.sleepContent"
                  >
                    <i
                      class="el-icon-circle-check"
                      slot="reference"
                      style="margin-left: 10px; color: #409eff"
                    />
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column align="center" label="Vệ sinh" min-width="80">
                <template slot-scope="scope">
                  <el-popover
                    v-if="!!scope.row.sanitaryContent"
                    placement="top"
                    width="300"
                    trigger="hover"
                    :content="scope.row.sanitaryContent"
                  >
                    <i
                      class="el-icon-circle-check"
                      slot="reference"
                      style="margin-left: 10px; color: #409eff"
                    />
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column align="center" label="Sức khỏe" min-width="80">
                <template slot-scope="scope">
                  <el-popover
                    v-if="!!scope.row.healtContent"
                    placement="top"
                    width="300"
                    trigger="hover"
                    :content="scope.row.healtContent"
                  >
                    <i
                      class="el-icon-circle-check"
                      slot="reference"
                      style="margin-left: 10px; color: #409eff"
                    />
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="Nhận xét chung"
                width="110"
              >
                <template slot-scope="scope">
                  <el-popover
                    v-if="!!scope.row.commonContent"
                    placement="top"
                    width="300"
                    trigger="hover"
                    :content="scope.row.commonContent"
                  >
                    <i
                      class="el-icon-circle-check"
                      slot="reference"
                      style="margin-left: 10px; color: #409eff"
                    />
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column align="center" label="Số file" min-width="60">
                <template slot-scope="scope">
                  <span v-if="scope.row.evaluateAttachFileList.length > 0">{{
                    scope.row.evaluateAttachFileList.length
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                label="Tác vụ"
                width="110"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="handleDateRowSave(scope.$index, scope.row)"
                    >Nhận xét</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-dropdown
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                @command="handleCommandEvaluateActionDate"
              >
                <el-button class="button-bottom" type="success">
                  Tác vụ
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu>
                  <el-dropdown-item command="approvedTrue"
                    >Duyệt nhận xét</el-dropdown-item
                  >
                  <el-dropdown-item command="approvedFalse"
                    >Hủy duyệt nhận xét</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate"
                    >Xuất theo ngày</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>

          <!-- tab evaluate week -->
          <el-tab-pane label="Tuần" name="evaluateWeek">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="evaluateWeekKidsList"
              :cell-style="tableRowStyleEvaluateWeek"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionEvaluateWeek"
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
                width="150"
              ></el-table-column>
              <el-table-column label="Duyệt" align="center" width="80" header>
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="
                      !!scope.row.content ||
                      scope.row.evaluateWeekFileList.length > 0
                    "
                    @change="
                      changeRowIsApprovedEvaluateWeek(scope.$index, scope.row)
                    "
                    v-model="scope.row.approved"
                  ></el-checkbox>
                  <el-checkbox v-else disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Phản hồi" width="80">
                <template slot-scope="scope">
                  <span
                    v-if="
                      !!scope.row.parentReplyContent &&
                      !scope.row.parentReplyDel
                    "
                  >
                    <el-tooltip
                      v-if="scope.row.schoolReadReply"
                      effect="dark"
                      content="Đã đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: #409eff"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-else
                      effect="dark"
                      content="Chưa đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: red"
                      />
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Nội dung"
                prop="content"
              ></el-table-column>
              <el-table-column label="Số file" width="70" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.evaluateWeekFileList.length > 0">{{
                    scope.row.evaluateWeekFileList.length
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                label="Tác vụ"
                fixed="right"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="
                      updateEvaluateWeekOneMethod(scope.$index, scope.row)
                    "
                    >Nhận xét</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-button
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                class="button-bottom"
                type="success"
                @click="evaluteWeekCommon()"
                >Nhận xét chung</el-button
              >
              <el-dropdown
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                @command="handleCommandEvaluateActionWeek"
              >
                <el-button type="success" class="button-bottom">
                  {{ $t("button.action") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="approvedTrue"
                    >Duyệt nhận xét</el-dropdown-item
                  >
                  <el-dropdown-item command="approvedFalse"
                    >Hủy duyệt nhận xét</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate"
                    >Xuất theo ngày</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>

          <!-- tab evaluate month -->
          <el-tab-pane label="Tháng" name="evaluateMonth">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="evaluateMonthList"
              :cell-style="tableRowStyleEvaluateMonth"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChangeMonth"
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
                width="150"
              ></el-table-column>
              <el-table-column label="Duyệt" align="center" width="80" header>
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="
                      !!scope.row.content ||
                      scope.row.evaluateMonthFileList.length > 0
                    "
                    @change="
                      changeRowIsApprovedEvaluateMonth(scope.$index, scope.row)
                    "
                    v-model="scope.row.approved"
                  ></el-checkbox>
                  <el-checkbox v-else disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Phản hồi" width="80">
                <template slot-scope="scope">
                  <span
                    v-if="
                      !!scope.row.parentReplyContent &&
                      !scope.row.parentReplyDel
                    "
                  >
                    <el-tooltip
                      v-if="scope.row.schoolReadReply"
                      effect="dark"
                      content="Đã đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: #409eff"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-else
                      effect="dark"
                      content="Chưa đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: red"
                      />
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Nội dung"
                prop="content"
              ></el-table-column>
              <el-table-column label="Số file" width="70" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.evaluateMonthFileList.length > 0">{{
                    scope.row.evaluateMonthFileList.length
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                label="Tác vụ"
                fixed="right"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="
                      updateEvaluateMonthOneMethod(scope.$index, scope.row)
                    "
                    >Nhận xét</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-button
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                class="button-bottom"
                type="success"
                @click="evaluteMonthCommon()"
                >Nhận xét chung</el-button
              >
              <el-dropdown
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                @command="handleCommandEvaluateActionMonth"
              >
                <el-button type="success" class="button-bottom">
                  {{ $t("button.action") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="approvedTrue"
                    >Duyệt nhận xét</el-dropdown-item
                  >
                  <el-dropdown-item command="approvedFalse"
                    >Hủy duyệt nhận xét</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate"
                    >Xuất theo ngày</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>

          <!-- tab evaluate periodic -->
          <el-tab-pane label="Định kỳ" name="evaluatePeriodic">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="evaluatePeriodicList"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChangePeriodic"
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
                width="150"
              ></el-table-column>
              <el-table-column label="Duyệt" align="center" width="80" header>
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="
                      !!scope.row.content ||
                      scope.row.evaluatePeriodicFileList.length > 0
                    "
                    @change="
                      changeRowIsApprovedEvaluatePeriodic(
                        scope.$index,
                        scope.row
                      )
                    "
                    v-model="scope.row.approved"
                  ></el-checkbox>
                  <el-checkbox v-else disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" width="130" label="Ngày tạo">
                <template slot-scope="scope">
                  <span>{{ scope.row.date | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Phản hồi" width="80">
                <template slot-scope="scope">
                  <span
                    v-if="
                      !!scope.row.parentReplyContent &&
                      !scope.row.parentReplyDel
                    "
                  >
                    <el-tooltip
                      v-if="scope.row.schoolReadReply"
                      effect="dark"
                      content="Đã đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: #409eff"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-else
                      effect="dark"
                      content="Chưa đọc"
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        style="margin-left: 10px; color: red"
                      />
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="Nội dung"
                prop="content"
              ></el-table-column>
              <el-table-column label="Số file" width="70" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.evaluatePeriodicFileList.length > 0">{{
                    scope.row.evaluatePeriodicFileList.length
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                label="Tác vụ"
                fixed="right"
                width="110"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="
                      updateEvaluatePeriodicOneMethod(scope.$index, scope.row)
                    "
                    >Nhận xét</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- click xuất file -->
            <div style="float: right; margin: 15px 0">
              <el-button
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                class="button-bottom"
                type="success"
                :loading="loadingButtonSaveEvaluatePeriodic"
                @click="EvaluatePeriodicShowKidsMethod()"
                >Thêm mới nhận xét</el-button
              >
              <el-dropdown
                v-if="checkPermission(['studentQuality_evaluate_update'])"
                @command="handleCommandEvaluateActionPeriodic"
              >
                <el-button type="success" class="button-bottom">
                  {{ $t("button.action") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="approvedTrue"
                    >Duyệt nhận xét</el-dropdown-item
                  >
                  <el-dropdown-item command="approvedFalse"
                    >Hủy duyệt nhận xét</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand">
                <el-button type="success" class="button-bottom">
                  {{ $t("button.exportFile") }}
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="exportDate"
                    >Xuất theo ngày</el-dropdown-item
                  >
                  <el-dropdown-item command="exportMonth"
                    >Xuất theo tháng</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <EvaluateDateDetailOfKid
      :dialogVisible="showEvaluateDateDetailOfKid"
      @dialog-close="closeEvaluateDateDetailOfKid()"
      ref="EvaluateDateDetailOfKid"
    />
    <EvaluateSampleDate
      :dialogVisible="showDialogSampleDate"
      @dialog-close="closeDialogSampleDate"
      ref="EvaluateSampleDate"
    />
    <EvaluateDateManyKidsDialog
      :dialogVisible="showDialogEvaluateDateManyKids"
      @dialog-close="closeDialogEvaluateDateManyKids()"
      ref="EvaluateDateManyKidsDialog"
    />
    <EvaluateWeekCommonDialog
      :dialogVisible="showDialogEvaluateWeekCommon"
      @dialog-close="closeDialogEvaluateWeekComon()"
      ref="EvaluateWeekCommonDialog"
    />
    <EvaluateWeekUpdateDialog
      :dialogVisible="showDialogEvaluateWeekUpdate"
      @dialog-close="closeDialogEvaluateWeekUpdate()"
      ref="EvaluateWeekUpdateDialog"
    />
    <EvaluateMonthCommonDialog
      :dialogVisible="showDialogEvaluateMonthCommon"
      @dialog-close="closeDialogEvaluateMonthComon()"
      ref="EvaluateMonthCommonDialog"
    />
    <EvaluateMonthUpdateDialog
      :dialogVisible="showDialogEvaluateMonthUpdate"
      @dialog-close="closeDialogEvaluateMonthUpdate()"
      ref="EvaluateMonthUpdateDialog"
    />
    <EvaluatePeriodicCommonDialog
      :dialogVisible="showDialogEvaluatePeriodicCommon"
      @dialog-close="closeDialogEvaluatePeriodicComon()"
      ref="EvaluatePeriodicCommonDialog"
    />
    <EvaluatePeriodicUpdateDialog
      :dialogVisible="showDialogEvaluatePeriodicUpdate"
      @dialog-close="closeDialogEvaluatePeriodicUpdate()"
      ref="EvaluatePeriodicUpdateDialog"
    />
    <EvaluatePeriodicKidsClassDialog
      :dialogVisible="showDialogEvaluatePeriodicKidsClass"
      @dialog-close="closeDialogEvaluatePeriodicShowKids()"
      ref="EvaluatePeriodicKidsClassDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import moment from "moment";
import EvaluateService from "@/services/EvaluateService";
import TeacherService from "@/services/TeacherService";

import EvaluateDateDetailOfKid from "./EvaluateDateDetailOfKid.vue";
import EvaluateSampleDate from "./EvaluateSampleDate.vue";
import EvaluateDateManyKidsDialog from "./EvaluateDateManyKidsDialog.vue";
import EvaluateWeekCommonDialog from "./EvaluateWeekCommonDialog.vue";
import EvaluateWeekUpdateDialog from "./EvaluateWeekUpdateDialog.vue";
import EvaluateMonthCommonDialog from "./EvaluateMonthCommonDialog.vue";
import EvaluateMonthUpdateDialog from "./EvaluateMonthUpdateDialog.vue";
import EvaluatePeriodicCommonDialog from "./EvaluatePeriodicCommonDialog.vue";
import EvaluatePeriodicUpdateDialog from "./EvaluatePeriodicUpdateDialog.vue";
import EvaluatePeriodicKidsClassDialog from "./EvaluatePeriodicKidsClassDialog.vue";
import {mapActions, mapState} from "vuex";
// import http from "../../http-download";

export default {
  components: {
    EvaluateDateDetailOfKid,
    EvaluateSampleDate,
    EvaluateDateManyKidsDialog,
    EvaluateWeekCommonDialog,
    EvaluateWeekUpdateDialog,
    EvaluateMonthCommonDialog,
    EvaluateMonthUpdateDialog,
    EvaluatePeriodicCommonDialog,
    EvaluatePeriodicUpdateDialog,
    EvaluatePeriodicKidsClassDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      activeTabName: "evaluateDate",
      startDayOfWeek: {
        firstDayOfWeek: 1,
      },
      loadingButtonSaveDetailDate: false,
      loadingButtonSaveEvaluateWeek: false,
      loadingButtonSaveEvaluateMonth: false,
      loadingButtonSaveEvaluatePeriodic: false,
      multipleSelectionDate: [],
      multipleSelectionDetailDate: [],
      multipleSelectionEvaluateWeek: [],
      multipleSelectionEvaluateMonth: [],
      multipleSelectionEvaluatePeriodic: [],
      gradeOfSchoolList: [],
      // classOfSchoolList: [],
      classOfGradeList: [],
      classOfGradeWeekList: [],
      classOfGradeMonthList: [],
      classOfGradePeriodicList: [],
      showDialogViewDetailDate: false,
      showDialogDetailArrive: false,
      showDialogDetailLeave: false,
      showEvaluateDateDetailOfKid: false,
      showDialogSampleDate: false,
      showDialogEvaluateDateManyKids: false,
      showDialogEvaluateWeekCommon: false,
      showDialogEvaluateMonthCommon: false,
      showDialogEvaluatePeriodicCommon: false,
      showDialogEvaluateWeekUpdate: false,
      showDialogEvaluateMonthUpdate: false,
      showDialogEvaluatePeriodicUpdate: false,
      showDialogEvaluatePeriodicKidsClass: false,
      evaluateDetailDateOneSave: {},
      evaluateDetailDateManySave: "",
      evaluateDetailDateEvaluateWeekSave: "",
      evaluateWeekOneSave: {},
      attendanceEatOneSave: {},
      evaluateDateDetailDateList: [],
      evaluateDateList: [],
      evaluateWeekKidsList: [],
      evaluateMonthList: [],
      evaluatePeriodicList: [],
      sampleDateTempRow: {},
      fileInputList: [],
      fileDeleteList: [],
      fileInputDetailDateList: [],
      fileDeleteDetailDateList: [],
      statusApproved: [
        { value: false, label: "Chưa duyệt" },
        { value: true, label: "Đã duyệt" },
      ],
      dataSearch: {
        date: "",
        dateWeek: "",
        dateMonth: "",
        idGrade: "",
        idClass: "",
        approved: "",
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
      if (
        row.learnContent ||
        !!row.eatContent ||
        !!row.sleepContent ||
        !!row.healtContent ||
        !!row.sanitaryContent ||
        !!row.commonContent ||
        row.evaluateAttachFileList.length > 0
      ) {
        if (row.expandRow) {
          return "color: #606266; font-weight: bold";
        } else {
          return "color: #606266;";
        }
      } else {
        if (row.expandRow) {
          return "color: #409EFF; font-weight: bold";
        } else {
          return "color: #409EFF";
        }
      }
    },
    // xuất file excel
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelDate();
      } else if (command == "exportMonth") {
        this.exportExcelMonth();
      }
    },
    // xuất file excel điểm danh theo ngày
    // exportExcelDate() {
    //   let id;
    //   let date;
    //   if (
    //     this.dataSearch.idClass != "" &&
    //     this.dataSearch.date != "" &&
    //     this.activeTabName == "evaluateDate"
    //   ) {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (
    //     this.dataSearch.idClass != "" &&
    //     this.dataSearch.date != "" &&
    //     this.activeTabName == "evaluateWeek"
    //   ) {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.dateWeek;
    //   } else if (
    //     this.dataSearch.idClass != "" &&
    //     this.dataSearch.date != "" &&
    //     this.activeTabName == "evaluateMonth"
    //   ) {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.dateMonth;
    //   } else {
    //     id = this.dataSearch.idClass;
    //     date = moment(String(new Date())).format("YYYY-MM-DD");
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
    //     return http
    //       .get(
    //         `/evaluate-kids/evaluate-to-excel-date?idClass=` +
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
    //           "QUAN_LY_NHAN_XET_DANH_HOC_SINH_" + date + ".xlsx"
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
    exportExcelDate() {
      let id;
      let date;
      if (
        this.dataSearch.idClass != "" &&
        this.dataSearch.date != "" &&
        this.activeTabName == "evaluateDate"
      ) {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (
        this.dataSearch.idClass != "" &&
        this.dataSearch.date != "" &&
        this.activeTabName == "evaluateWeek"
      ) {
        id = this.dataSearch.idClass;
        date = this.dataSearch.dateWeek;
      } else if (
        this.dataSearch.idClass != "" &&
        this.dataSearch.date != "" &&
        this.activeTabName == "evaluateMonth"
      ) {
        id = this.dataSearch.idClass;
        date = this.dataSearch.dateMonth;
      } else {
        id = this.dataSearch.idClass;
        date = moment(String(new Date())).format("YYYY-MM-DD");
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
        EvaluateService.getExportExcelDate(id, date)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_NHAN_XET_DANH_HOC_SINH_${date}`;
                const merges = ["A5:B5", "D5:I5"];
                const tHeader = [
                  "STT",
                  "Họ và tên",
                  "Duyệt",
                  "Học tập",
                  "Ăn uống",
                  "Ngủ nghỉ",
                  "Vệ sinh",
                  "Sức khỏe",
                  "Nhận xét chung",
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
                ];
                let columnList = [
                  { col: 5 },
                  { col: 25 },
                  { col: 12 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
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
        name: "A5:B5",
        style: {
          fill: { fgColor: { rgb: "cfcfcf" } },
          font: { bold: true, sz: "11", color: { rgb: "f70000" } },
          alignment,
          border,
        },
      };
      let style2 = {
        name: "A6:I6",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font: font,
          alignment,
          border,
        },
      };
      let style3 = {
        name: "D5:I5",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font: font,
          alignment,
          border,
        },
      };
      let style4 = {
        name: "D7:I50",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font: { sz: "11" },
          alignment,
          border,
        },
      };
      let style5 = {
        name: "C5:C6",
        style: {
          fill: { fgColor: { rgb: "83a4c4" } },
          font: font,
          alignment,
          border,
        },
      };
      let style6 = {
        name: "C7:C50",
        style: {
          fill: { fgColor: { rgb: "83a4c4" } },
          font: { sz: "11" },
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
      this.styleCols2.push(style1);
      this.styleCols2.push(style3);
      this.styleCols2.push(style4);
      this.styleCols2.push(style5);
      this.styleCols2.push(style6);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
      //css cuối
      this.styleCols2.push(style2);
    },
    // xuất file excel điểm danh theo tháng
    // exportExcelMonth() {
    //   let id;
    //   let date;
    //   if (
    //     this.dataSearch.idClass != "" &&
    //     this.dataSearch.date != "" &&
    //     this.activeTabName == "evaluateDate"
    //   ) {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.date;
    //   } else if (
    //     this.dataSearch.idClass != "" &&
    //     this.dataSearch.date != "" &&
    //     this.activeTabName == "evaluateWeek"
    //   ) {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.dateWeek;
    //   } else if (
    //     this.dataSearch.idClass != "" &&
    //     this.dataSearch.date != "" &&
    //     this.activeTabName == "evaluateMonth"
    //   ) {
    //     id = this.dataSearch.idClass;
    //     date = this.dataSearch.dateMonth;
    //   } else {
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
    //     return http
    //       .get(
    //         `/evaluate-kids/evaluate-to-excel-month?idClass=` +
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
    //           "QUAN_LY_NHAN_XET_HOC_SINH_THEO_THANG_" + date + ".xlsx"
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
    exportExcelMonth() {
      let id;
      let date;
      if (
        this.dataSearch.idClass != "" &&
        this.dataSearch.date != "" &&
        this.activeTabName == "evaluateDate"
      ) {
        id = this.dataSearch.idClass;
        date = this.dataSearch.date;
      } else if (
        this.dataSearch.idClass != "" &&
        this.dataSearch.date != "" &&
        this.activeTabName == "evaluateWeek"
      ) {
        id = this.dataSearch.idClass;
        date = this.dataSearch.dateWeek;
      } else if (
        this.dataSearch.idClass != "" &&
        this.dataSearch.date != "" &&
        this.activeTabName == "evaluateMonth"
      ) {
        id = this.dataSearch.idClass;
        date = this.dataSearch.dateMonth;
      } else {
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
        this.getStyleExcelMonth();
        EvaluateService.getExportExcelMonth(id, date)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_NHAN_XET_HOC_SINH_THEO_THANG_${date}`;
                const merges = ["A6:B6", "D6:I6"];
                const tHeader = [
                  "STT",
                  "Họ và tên",
                  "Duyệt",
                  "Học tập",
                  "Ăn uống",
                  "Ngủ nghỉ",
                  "Vệ sinh",
                  "Sức khỏe",
                  "Nhận xét chung",
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
                ];
                let columnList = [
                  { col: 5 },
                  { col: 25 },
                  { col: 12 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
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
    //Style css Excel Month
    getStyleExcelMonth() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let style1 = {
        name: "A6:B6",
        style: {
          fill: { fgColor: { rgb: "cfcfcf" } },
          font: { bold: true, sz: "11", color: { rgb: "f70000" } },
          alignment,
          border,
        },
      };
      let style2 = {
        name: "A7:I7",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font: font,
          alignment,
          border,
        },
      };
      let style3 = {
        name: "D6:I6",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font: font,
          alignment,
          border,
        },
      };
      let style4 = {
        name: "D8:I50",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font: { sz: "11" },
          alignment,
          border,
        },
      };
      let style5 = {
        name: "C6:C7",
        style: {
          fill: { fgColor: { rgb: "83a4c4" } },
          font: font,
          alignment,
          border,
        },
      };
      let style6 = {
        name: "C8:C50",
        style: {
          fill: { fgColor: { rgb: "83a4c4" } },
          font: { sz: "11" },
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
        name: ["A2", "A3", "A4", "A5"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };
      this.styleCols2.push(style1);
      this.styleCols2.push(style3);
      this.styleCols2.push(style4);
      this.styleCols2.push(style5);
      this.styleCols2.push(style6);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
      //css cuối
      this.styleCols2.push(style2);
    },

    /**
     * bổi màu cho row tuần
     */
    tableRowStyleEvaluateWeek({ row }) {
      if (
        (row.content != null && row.content != "") ||
        row.evaluateWeekFileList.length > 0
      ) {
        return "color: #606266";
      } else {
        return "color: #409EFF";
      }
    },
    /**
     * bổi màu cho row tuần
     */
    tableRowStyleEvaluateMonth({ row }) {
      if (
        (row.content != null && row.content != "") ||
        row.evaluateMonthFileList.length > 0
      ) {
        return "color: #606266";
      } else {
        return "color: #409EFF";
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "evaluateDetail") {
        this.searchEvaluateDateDetailDate();
      } else if (tabNameClick == "evaluateDate") {
        this.getSearchEvaluateDate();
      } else if (tabNameClick == "evaluateWeek") {
        this.getSearchEvaluateWeek();
      } else if (tabNameClick == "evaluateMonth") {
        this.getSearchEvaluateMonth();
      } else if (tabNameClick == "evaluatePeriodic") {
        this.getSearchEvaluatePeriodic();
      }
    },

    resetData() {
      this.fileInputList = [];
      this.fileDeleteList = [];
      // this.evaluateDateKid.evaluateAttachFileList = [];
    },
    handleExceedDetailDate() {
      this.$message.warning(`Giới hạn là 3 file`);
    },
    handleChange(file, fileList) {
      this.fileInputList = fileList.filter((x) => x.id == undefined);
    },
    handleRemove(file, fileList) {
      if (file.id == undefined) {
        this.fileInputList = fileList.filter((x) => x.id == undefined);
      } else {
        this.fileDeleteList.push(file);
      }
    },
    downloadFile(file) {
      let id = file.id;
      let fileName = file.name;
      EvaluateService.downloadFileDate(id)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Dowload file thất bại",
            type: "error",
          });
        });
    },
    handleCommandEvaluateActionDetailDate(command) {
      if (command == "approvedTrue") {
        this.handleApprovedDetailDate(true);
      } else if (command == "approvedFalse") {
        this.handleApprovedDetailDate(false);
      }
    },
    handleCommandEvaluateActionDate(command) {
      if (command == "approvedTrue") {
        this.handleApprovedDate(true);
      } else if (command == "approvedFalse") {
        this.handleApprovedDate(false);
      }
    },
    /**
     * cập nhật xét duyệt tuần cho nhiều học sinh
     */
    handleCommandEvaluateActionWeek(command) {
      if (command == "approvedTrue") {
        this.handleApprovedWeek(true);
      } else if (command == "approvedFalse") {
        this.handleApprovedWeek(false);
      }
    },
    /**
     * cập nhật xét duyệt tháng cho nhiều học sinh
     */
    handleCommandEvaluateActionMonth(command) {
      if (command == "approvedTrue") {
        this.handleApprovedMonth(true);
      } else if (command == "approvedFalse") {
        this.handleApprovedMonth(false);
      }
    },
    /**
     * cập nhật xét duyệt định kỳ cho nhiều học sinh
     */
    handleCommandEvaluateActionPeriodic(command) {
      if (command == "approvedTrue") {
        this.handleApprovedPeriodic(true);
      } else if (command == "approvedFalse") {
        this.handleApprovedPeriodic(false);
      }
    },
    /**
     * lưu nhận xét cho một học sinh ở tab chi tiết ngày
     */
    handleRowSaveOnekidDetailDate(index, row) {
      let inputData = row;
      let formDatas = new FormData();
      for (var key in inputData) {
        let dataInput = inputData[key];
        formDatas.append(key, dataInput);
      }
      if (this.fileInputList.length > 0) {
        this.fileInputList.forEach((x) => {
          formDatas.append("multipartFileList", x.raw);
        });
      }
      if (this.fileDeleteList.length > 0) {
        this.fileDeleteList.forEach((x) => {
          formDatas.append("fileDeleteList", x.id);
        });
      }
      EvaluateService.saveOnekidDetailDate(formDatas)
        .then((resp) => {
          let dataSaved = resp.data.data;
          console.log(dataSaved);
          this.$message({
            message: "Lưu nhận xét thành công",
            type: "success",
          });
          this.searchEvaluateDateDetailDate();
          this.resetData();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu nhận xét thất bại",
            type: "error",
          });
        });
    },
    /**
     * lưu mẫu nhận xét cho nhiều học sinh ở tab chi tiết ngày
     */
    handleSampleDateSaveManyKid() {
      let kidList = this.multipleSelectionDetailDate;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.showDialogEvaluateDateManyKids = true;
      this.$refs.EvaluateDateManyKidsDialog.getEvaluateSampleDateKidsInitial(
        kidList
      );
    },
    /**
     * nhật xét tuần chung cho nhiều học sinh
     */
    evaluteWeekCommon() {
      let kidList = this.multipleSelectionEvaluateWeek;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.showDialogEvaluateWeekCommon = true;
      this.$refs.EvaluateWeekCommonDialog.getEvaluateWeekKidsInitial(kidList);
    },
    /**
     * nhật xét tháng chung cho nhiều học sinh
     */
    evaluteMonthCommon() {
      let kidList = this.multipleSelectionEvaluateMonth;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.showDialogEvaluateMonthCommon = true;
      this.$refs.EvaluateMonthCommonDialog.getEvaluateMonthKidsInitial(kidList);
    },
    /**
     * nhật xét định kỳ chung cho nhiều học sinh
     */
    evalutePeriodicCommon() {
      let kidList = this.multipleSelectionEvaluatePeriodic;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.showDialogEvaluatePeriodicCommon = true;
      this.$refs.EvaluatePeriodicCommonDialog.getEvaluatePeriodicKidsInitial(
        kidList
      );
    },
    /**
     * cập nhật nhận xét tuần cho một học sinh
     */
    updateEvaluateWeekOneMethod(index, row) {
      this.showDialogEvaluateWeekUpdate = true;
      this.$refs.EvaluateWeekUpdateDialog.getEvaluateWeekUpdateInitail(
        row,
        this.dataSearch.dateWeek
      );
    },
    /**
     * cập nhật nhận xét tháng cho một học sinh
     */
    updateEvaluateMonthOneMethod(index, row) {
      this.showDialogEvaluateMonthUpdate = true;
      this.$refs.EvaluateMonthUpdateDialog.getEvaluateMonthUpdateInitail(
        row,
        this.dataSearch.dateMonth
      );
    },
    /**
     * cập nhật nhận xét định kỳ cho một học sinh
     */
    updateEvaluatePeriodicOneMethod(index, row) {
      setTimeout(() => {
        this.showDialogEvaluatePeriodicUpdate = true;
      }, 200);
      this.$refs.EvaluatePeriodicUpdateDialog.getEvaluatePeriodicUpdateInitail(
        row
      );
    },
    /**
     * show kids
     */
    EvaluatePeriodicShowKidsMethod() {
      let idClass = this.dataSearch.idClass;
      if (idClass == "") {
        this.$message({
          message: "Chọn lớp để thêm mới nhận xét",
          type: "error",
        });
        return;
      }
      let dataClass = this.classOfGradeList.filter((x) => x.id == idClass)[0];
      this.$refs.EvaluatePeriodicKidsClassDialog.getDataInitial(
        idClass,
        dataClass.className
      );
      setTimeout(() => {
        this.showDialogEvaluatePeriodicKidsClass = true;
      }, 100);
    },
    /**
     * cập nhật nhận xét cho một học sinh theo ngày ở tab ngày
     */
    handleDateRowSave(index, row) {
      this.$refs.EvaluateDateDetailOfKid.getEvaluateSampleKidInitial(
        row.id,
        row.kids.fullName
      );
      setTimeout(() => {
        this.showEvaluateDateDetailOfKid = true;
      }, 100);
    },

    closeEvaluateDateDetailOfKid() {
      this.showEvaluateDateDetailOfKid = false;
      this.getSearchEvaluateDate();
    },

    handleSelectionChangeDate(val) {
      this.multipleSelectionDate = val;
    },
    handleSelectionChangeDetailDate(val) {
      this.multipleSelectionDetailDate = val;
    },
    handleSelectionEvaluateWeek(val) {
      this.multipleSelectionEvaluateWeek = val;
    },
    handleSelectionChangeMonth(val) {
      this.multipleSelectionEvaluateMonth = val;
    },
    handleSelectionChangePeriodic(val) {
      this.multipleSelectionEvaluatePeriodic = val;
    },
    toogleExpandDetailDate(index, row) {
      row.expandRow = !row.expandRow;
      let $tableDetailDate = this.$refs.tableDetailDate;
      $tableDetailDate.toggleRowExpansion(row);
    },
    /**
     * xóa một nội dung nhận xét cho một học sinh
     */
    handleClearContentRowDetailDate(row, type) {
      switch (type) {
        case "typeLearn": {
          row.evaluateLearn.content = null;
          break;
        }
        case "typeEat": {
          row.evaluateEat.content = null;
          break;
        }
        case "typeSleep": {
          row.evaluateSleep.content = null;
          break;
        }
        case "typeSanitary": {
          row.evaluateSanitary.content = null;
          break;
        }
        case "typeHealt": {
          row.evaluateHealt.content = null;
          break;
        }
        case "typeCommon": {
          row.evaluateCommon.content = null;
          break;
        }
        case "typeAttachFile": {
          row.evaluateAttachFile.content = null;
          break;
        }
      }
    },
    /**
     * xóa nội dung ở nhận xét tuần
     */
    handleEvaluateWeekClearRow(index, row) {
      row.content = null;
    },
    /**
     * chọn mẫu nhận xét cho một học sinh
     */
    handleShowSampleDateRow(row, type) {
      let a = row;
      console.log(a);
      this.sampleDateTempRow = row;
      this.$refs.EvaluateSampleDate.getEvaluateSampleDateInitial(type);
      setTimeout(() => {
        this.showDialogSampleDate = true;
      }, 100);
    },
    closeDialogEvaluateDateManyKids() {
      this.showDialogEvaluateDateManyKids = false;
      this.searchEvaluateDateDetailDate();
    },

    closeDialogEvaluateWeekComon() {
      this.showDialogEvaluateWeekCommon = false;
      this.getSearchEvaluateWeek();
    },
    closeDialogEvaluateMonthComon() {
      this.showDialogEvaluateMonthCommon = false;
      this.getSearchEvaluateMonth();
    },
    closeDialogEvaluatePeriodicComon() {
      this.showDialogEvaluatePeriodicCommon = false;
      this.getSearchEvaluatePeriodic();
    },
    closeDialogEvaluateWeekUpdate() {
      this.showDialogEvaluateWeekUpdate = false;
      this.getSearchEvaluateWeek();
    },
    closeDialogEvaluateMonthUpdate() {
      this.showDialogEvaluateMonthUpdate = false;
      this.getSearchEvaluateMonth();
    },
    closeDialogEvaluatePeriodicUpdate() {
      this.showDialogEvaluatePeriodicUpdate = false;
      this.getSearchEvaluatePeriodic();
    },
    closeDialogEvaluatePeriodicShowKids() {
      this.showDialogEvaluatePeriodicKidsClass = false;
      this.getSearchEvaluatePeriodic();
    },
    closeDialogSampleDate(data) {
      this.showDialogSampleDate = false;
      if (data != false) {
        let evaluateData = this.sampleDateTempRow;
        let learnList = data.learnList;
        let eatList = data.eatList;
        let sleepList = data.sleepList;
        let sanitaryList = data.sanitaryList;
        let healtList = data.healtList;
        let commonList = data.commonList;

        if (learnList.length != 0) {
          evaluateData.learnContent = learnList.join("\n");
        }
        if (eatList.length != 0) {
          evaluateData.eatContent = eatList.join("\n");
        }
        if (sleepList.length != 0) {
          evaluateData.sleepContent = sleepList.join("\n");
        }
        if (sanitaryList.length != 0) {
          evaluateData.sanitaryContent = sanitaryList.join("\n");
        }
        if (healtList.length != 0) {
          evaluateData.healtContent = healtList.join("\n");
        }
        if (commonList.length != 0) {
          evaluateData.commonContent = commonList.join("\n");
        }
      }
    },
    /**
     * cập nhật xét duyệt cho một học sinh theo ngày
     */
    changeRowIsApprovedDate(row) {
      let messageTitle = null;
      if (row.approved) {
        messageTitle = "Duyệt";
      } else {
        messageTitle = "Hủy duyệt";
      }
      EvaluateService.updateApprovedOnekidsDate(row)
        .then((resp) => {
          let checkUpdate = resp.data.data;
          if (checkUpdate) {
            this.$message({
              message: messageTitle + " thành công",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * cập nhật xét duyệt nhận xét tuần cho một học sinh
     */
    changeRowIsApprovedEvaluateWeek(index, row) {
      let messageTitle = null;
      if (row.approved) {
        messageTitle = "Duyệt";
      } else {
        messageTitle = "Hủy duyệt";
      }
      EvaluateService.updateApprovedWeekOne(row)
        .then((resp) => {
          let checkUpdate = resp;
          if (checkUpdate) {
            this.$message({
              message: messageTitle + " thành công",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * cập nhật xét duyệt nhận xét tháng cho một học sinh
     */
    changeRowIsApprovedEvaluateMonth(index, row) {
      let messageTitle = null;
      if (row.approved) {
        messageTitle = "Duyệt";
      } else {
        messageTitle = "Hủy duyệt";
      }
      EvaluateService.updateApprovedMonthOne(row)
        .then((resp) => {
          let checkUpdate = resp.data.data;
          if (checkUpdate) {
            this.$message({
              message: messageTitle + " thành công",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * cập nhật xét duyệt nhận xét định kỳ cho một học sinh
     */
    changeRowIsApprovedEvaluatePeriodic(index, row) {
      let messageTitle = null;
      if (row.approved) {
        messageTitle = "Duyệt";
      } else {
        messageTitle = "Hủy duyệt";
      }
      EvaluateService.updateApprovedPeriodicOne(row)
        .then((resp) => {
          let checkUpdate = resp.data.data;
          if (checkUpdate) {
            this.$message({
              message: messageTitle + " thành công",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * cập nhật xét duyệt cho nhiều học sinh ở tab chi tiết ngày
     */
    handleApprovedDetailDate(data) {
      let kidList = this.multipleSelectionDetailDate;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }

      let textApproved = "";
      let textApprovedTitle = "";
      if (data) {
        textApproved = "duyệt";
        textApprovedTitle = "Duyệt";
      } else {
        textApproved = "hủy duyệt";
        textApprovedTitle = "Hủy duyệt";
      }
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          textApproved +
          " nhận xét ngày cho " +
          kidList.length +
          " học sinh đã chọn?",
        textApprovedTitle + " nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        kidList.filter((x) => {
          x.approved = data;
        });
        EvaluateService.updateApprovedManykidsDate(kidList)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message:
                textApprovedTitle +
                " nhận xét ngày cho nhiều học sinh thành công",
              type: "success",
            });
            this.searchEvaluateDateDetailDate();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    /**
     * cập nhật xét duyệt cho nhiều học sinh ở tab ngày
     */
    handleApprovedDate(data) {
      let kidList = this.multipleSelectionDate;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }

      let kidApprovedList = kidList.filter((x) => {
        return (
          x.learnContent ||
          !!x.eatContent ||
          !!x.sleepContent ||
          !!x.healtContent ||
          !!x.sanitaryContent ||
          !!x.commonContent ||
          x.evaluateAttachFileList.length > 0
        );
      });
      if (kidApprovedList.length == 0) {
        this.$message({
          message: "Chọn học sinh có thể duyệt",
          type: "error",
        });
        return;
      }
      let textApproved = "";
      let textApprovedTitle = "";
      if (data) {
        textApproved = "duyệt";
        textApprovedTitle = "Duyệt";
      } else {
        textApproved = "hủy duyệt";
        textApprovedTitle = "Hủy duyệt";
      }
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          textApproved +
          " nhận xét ngày cho " +
          kidApprovedList.length +
          " học sinh?",
        textApprovedTitle + " nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        kidApprovedList.filter((x) => {
          x.approved = data;
        });
        EvaluateService.updateApprovedManykidsDate(kidApprovedList)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message:
                textApprovedTitle +
                " nhận xét ngày cho nhiều học sinh thành công",
              type: "success",
            });
            this.getSearchEvaluateDate();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    /**
     * cập nhật xét duyệt tuần cho nhiều học sinh
     */
    handleApprovedWeek(data) {
      let kidList = this.multipleSelectionEvaluateWeek;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }

      let kidApprovedList = kidList.filter((x) => {
        return (
          (x.content != null && x.content != "") ||
          (x.urlFileList != null && x.urlFileList != "")
        );
      });
      if (kidApprovedList.length == 0) {
        this.$message({
          message: "Chọn học sinh có thể duyệt",
          type: "error",
        });
        return;
      }
      let textApproved = "";
      let textApprovedTitle = "";
      if (data) {
        textApproved = "duyệt";
        textApprovedTitle = "Duyệt";
      } else {
        textApproved = "hủy duyệt";
        textApprovedTitle = "Hủy duyệt";
      }
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          textApproved +
          " nhận xét tuần cho " +
          kidApprovedList.length +
          " học sinh?",
        textApprovedTitle + " nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        kidApprovedList.filter((x) => {
          x.approved = data;
        });
        EvaluateService.updateApprovedWeekMany(kidApprovedList)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message:
                textApprovedTitle +
                " nhận xét tuần cho nhiều học sinh thành công",
              type: "success",
            });
            this.getSearchEvaluateWeek();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },

    /**
     * cập nhật xét duyệt tháng cho nhiều học sinh
     */
    handleApprovedMonth(data) {
      let kidList = this.multipleSelectionEvaluateMonth;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }

      let kidApprovedList = kidList.filter((x) => {
        return (
          (x.content != null && x.content != "") ||
          (x.urlFileList != null && x.urlFileList != "")
        );
      });
      if (kidApprovedList.length == 0) {
        this.$message({
          message: "Chọn học sinh có thể duyệt",
          type: "error",
        });
        return;
      }
      let textApproved = "";
      let textApprovedTitle = "";
      if (data) {
        textApproved = "duyệt";
        textApprovedTitle = "Duyệt";
      } else {
        textApproved = "hủy duyệt";
        textApprovedTitle = "Hủy duyệt";
      }
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          textApproved +
          " nhận xét tháng cho " +
          kidApprovedList.length +
          " học sinh?",
        textApprovedTitle + " nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        kidApprovedList.filter((x) => {
          x.approved = data;
        });
        EvaluateService.updateApprovedMonthMany(kidApprovedList)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message:
                textApprovedTitle +
                " nhận xét tháng cho nhiều học sinh thành công",
              type: "success",
            });
            this.getSearchEvaluateMonth();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },

    /**
     * cập nhật xét duyệt định kỳ cho nhiều học sinh
     */
    handleApprovedPeriodic(data) {
      let kidList = this.multipleSelectionEvaluatePeriodic;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }

      let kidApprovedList = kidList.filter((x) => {
        return (
          (x.content != null && x.content != "") ||
          (x.urlFileList != null && x.urlFileList != "")
        );
      });
      if (kidApprovedList.length == 0) {
        this.$message({
          message: "Chọn học sinh có thể duyệt",
          type: "error",
        });
        return;
      }
      let textApproved = "";
      let textApprovedTitle = "";
      if (data) {
        textApproved = "duyệt";
        textApprovedTitle = "Duyệt";
      } else {
        textApproved = "hủy duyệt";
        textApprovedTitle = "Hủy duyệt";
      }
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          textApproved +
          " nhận xét định kỳ cho " +
          kidApprovedList.length +
          " học sinh đã chọn?",
        textApprovedTitle + " nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        kidApprovedList.filter((x) => {
          x.approved = data;
        });
        EvaluateService.updateApprovedWeekMany(kidApprovedList)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message:
                textApprovedTitle +
                " nhận xét định kỳ cho nhiều học sinh thành công",
              type: "success",
            });
            this.getSearchEvaluatePeriodic();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },

    /**
     * tìm kiếm nhận xét chi tiết ngày cho các học sinh
     */
    searchEvaluateDateDetailDate() {
      this.loadingData = true;
      this.textTable = "";
      EvaluateService.searchDetailDate(
        this.dataSearch.date,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.approved
      )
        .then((resp) => {
          this.evaluateDateDetailDateList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.evaluateDateDetailDateList = [];
        })
        .finally(() => {
          if (this.evaluateDateDetailDateList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm nhận xét cho các học sinh trong ngày
     */
    getSearchEvaluateDate() {
      this.loadingData = true;
      this.textTable = "";
      EvaluateService.searchDate(
        this.dataSearch.date,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.approved
      )
        .then((resp) => {
          this.evaluateDateList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.evaluateDateList = [];
        })
        .finally(() => {
          if (this.evaluateDateList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm nhận xét tuần các học sinh theo
     */
    getSearchEvaluateWeek() {
      this.loadingData = true;
      this.textTable = "";
      EvaluateService.searchEvaluateWeek(
        this.dataSearch.dateWeek,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.approved
      )
        .then((resp) => {
          this.evaluateWeekKidsList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.evaluateWeekKidsList = [];
        })
        .finally(() => {
          if (this.evaluateWeekKidsList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm nhận xét tháng cho các học sinh
     */
    getSearchEvaluateMonth() {
      this.loadingData = true;
      this.textTable = "";
      EvaluateService.searchEvaluateMonth(
        this.dataSearch.dateMonth,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.approved
      )
        .then((resp) => {
          this.evaluateMonthList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.evaluateMonthList = [];
        })
        .finally(() => {
          if (this.evaluateMonthList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm nhận xét định kỳ cho các học sinh
     */
    getSearchEvaluatePeriodic() {
      this.loadingData = true;
      this.textTable = "";
      EvaluateService.searchEvaluatePeriodic(
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.approved
      )
        .then((resp) => {
          this.evaluatePeriodicList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.evaluatePeriodicList = [];
        })
        .finally(() => {
          if (this.evaluatePeriodicList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getCurrentDate() {
      this.dataSearch.date = moment(String(new Date())).format("YYYY-MM-DD");
      this.dataSearch.dateWeek = moment(String(new Date()))
        .startOf("isoweek")
        .format("YYYY-MM-DD");
      this.dataSearch.dateMonth = moment(String(new Date())).format(
        "YYYY-MM-DD"
      );
    },

    async searchDataMethod(type) {
      if (type == "changeGrade") {
        await this.getClassInGrade();
      }
      let tabName = this.activeTabName;
      if (tabName == "evaluateDetail") {
        this.searchEvaluateDateDetailDate();
      } else if (tabName == "evaluateDate") {
        this.getSearchEvaluateDate();
      } else if (tabName == "evaluateWeek") {
        this.getSearchEvaluateWeek();
      } else if (tabName == "evaluateMonth") {
        this.getSearchEvaluateMonth();
      } else if (tabName == "evaluatePeriodic") {
        this.getSearchEvaluatePeriodic();
      }
    },

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
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
        .then((resp) => {
          this.classOfGradeList = resp.data.data;
          this.dataSearch.idClass = this.classOfGradeList.filter(
            (x) => x.checked
          )[0].id;
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
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade()]);
        await this.getClassInGrade();
      } else if (this.getAppTypeUserLogin == "teacher") {
        await this.getClassListTeacher();
      }

      this.getSearchEvaluateDate();
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
/deep/.el-table th > .cell {
  text-align: center !important;
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
// /deep/.el-table th {
// //   font-size: 14px;
// // }//
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.el-row {
  margin-bottom: 15px;
}
/deep/.el-icon-arrow-right:before {
  content: "";
}
/deep/.el-table .cell {
  white-space: pre-line;
  word-break: break-all;
  line-height: 23px;
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
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
