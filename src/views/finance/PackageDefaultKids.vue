<template>
  <div>
    <div style="margin-top: 5px">
      <div style="margin-bottom: -20px; position: relative; z-index: 1">
        <el-date-picker
          v-if="activeTabName != 'tabName2'"
          style="width: 130px"
          class="input-common"
          :clearable="false"
          @change="changeSearchMethod()"
          v-model="dataSearch.date"
          type="month"
          value-format="yyyy-MM-dd"
          format="MM-yyyy"
        >
        </el-date-picker>
        <!-- chọn trạng thái -->
        <el-select
          style="width: 120px"
          class="input-common"
          v-model="dataSearch.status"
          @change="changeSearchMethod()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in kidStatusList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>

        <!-- chọn khối -->
        <el-select
          class="input-common input-grade"
          style="width: 110px"
          v-model="dataSearch.idGrade"
          @change="changeGradeSearch()"
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
          style="width: 120px"
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          @change="changeSearchMethod()"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>
        <el-input
          style="width: 220px"
          placeholder="Nhập tên học sinh"
          clearable
          v-model="dataSearch.fullName"
          @clear="changeFullName()"
          @keyup.enter.native="changeFullName()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeSearchMethod()"
          ></el-button>
        </el-input>
      </div>

      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- danh sách khoản các khoản trong một lớp -->
        <el-tab-pane label="Đăng ký lớp" name="tabName1">
          <el-table
            ref="multipleTable"
            :data="responseTab1DataList"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeKids"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column type="selection" align="center" width="55"></el-table-column>
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
              min-width="170"
              label="Họ tên"
            ></el-table-column>
            <el-table-column label="Ngày sinh" align="center" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.birthDay | formatDate }}</span>
              </template></el-table-column
            >
            <el-table-column width="90" align="center" label="Khoản khác">
              <template slot-scope="scope">
                <span v-if="scope.row.number > 0">{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <!-- danh sách khoản -->
            <el-table-column
              align="center"
              v-for="(item, index) in headerTab1List"
              :key="item"
            >
              <template slot="header" slot-scope="scope">
                <el-popover
                  placement="bottom-start"
                  width="200"
                  trigger="hover"
                  :content="item.name"
                >
                  <span slot="reference">Khoản {{ index + 1 }}</span>
                </el-popover>
                <br />
                <el-checkbox
                  @change="
                    checkHeaderPackageKidsMethod(scope.$index, item.id, item.check)
                  "
                  v-model="item.check"
                ></el-checkbox>
              </template>

              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.fnKidsPackageList.filter((x) => x.fnPackage.id == item.id)
                      .length == 1
                  "
                >
                  <el-checkbox
                    v-model="
                      scope.row.fnKidsPackageList.filter(
                        (x) => x.fnPackage.id == item.id
                      )[0].active
                    "
                  ></el-checkbox>
                  <span
                    v-if="
                      scope.row.fnKidsPackageList.filter(
                        (x) => x.fnPackage.id == item.id
                      )[0].fnPackageKidsExtend != null
                    "
                  >
                    <el-tooltip
                      effect="dark"
                      :content="
                        'Khoản đính kèm: ' +
                        scope.row.fnKidsPackageList.filter(
                          (x) => x.fnPackage.id == item.id
                        )[0].fnPackageKidsExtend.name
                      "
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        :style="
                          scope.row.fnKidsPackageList.filter(
                            (x) => x.fnPackage.id == item.id
                          )[0].fnPackageKidsExtend.active
                            ? 'margin-left: 10px; color: #409eff'
                            : 'margin-left: 10px; color: red'
                        "
                      />
                    </el-tooltip>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" fixed="right" width="320" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  style="color: #fff; background-color: #608800"
                  @click="generatePackageKidsOneMethod(scope.row)"
                  >Khởi tạo</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="addPackageKidsMethod(scope.row)"
                  >Thêm</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="activePackageKidsOneMethod(scope.row)"
                  >Lưu</el-button
                >

                <el-button
                  size="mini"
                  type="warning"
                  @click="packageKidsDetailMethod(scope.row)"
                  >Chi tiết</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0px">
            <el-button
              :loading="loaddingButtonSaveTab1"
              class="button-bottom"
              type="success"
              @click="activePackageKidsManyMethod()"
              >Lưu</el-button
            >
            <el-button
              :loading="loaddingButtonGenerateTab1"
              class="button-bottom"
              type="success"
              @click="generatePackageKidsManyMethod()"
              >Khởi tạo</el-button
            >
            <el-button
              :loading="loaddingButtonAddTab1"
              class="button-bottom"
              type="success"
              @click="showAddPackageInKidsDialogMethod()"
              >Thêm khoản khác</el-button
            >
            <el-dropdown @command="handlePackageKidsExtend">
              <el-button
                :loading="loaddingButtonExtend"
                class="button-bottom"
                type="success"
              >
                Khoản đính kèm
                <i class="el-icon-caret-bottom" />
              </el-button>
              <el-dropdown-menu>
                <el-dropdown-item command="createExtendCommand"
                  >Thêm khoản</el-dropdown-item
                >
                <el-dropdown-item command="activeExtendCommand"
                  >Kích hoạt</el-dropdown-item
                >
                <el-dropdown-item command="unActiveExtendCommand"
                  >Bỏ kích hoạt</el-dropdown-item
                >
                <el-dropdown-item command="deleteExtendCommand"
                  >Xóa khoản</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              :loading="loaddingButtonDelete"
              class="button-bottom"
              type="danger"
              @click="deleteManyPackageMethod()"
              >Xóa khoản</el-button
            >
          </div>
        </el-tab-pane>

        <!-- list chi tiết học sinh -->
        <el-tab-pane label="Chi tiết học sinh" name="tabName3">
          <el-table
            ref="kidsPackageForKidsRef"
            :data="responseTab3DataList"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            :cell-style="tableRowStyleDetail"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column type="expand" width="1">
              <template slot-scope="scope">
                <el-table
                  ref="kidsPackageForKidsRef1"
                  :data="scope.row.fnKidsPackageList"
                  :empty-text="textTable"
                  :element-loading-text="$tableLoadding"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(255,255,255, 0)"
                  highlight-current-row
                  :cell-style="tableRowStyleChildren"
                  :header-cell-style="tableHeaderChidrenColor"
                  :max-height="$tableMaxHeightMini"
                  border
                >
                  <el-table-column
                    fixed
                    type="index"
                    label="STT"
                    width="50"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    fixed
                    label="Tên khoản"
                    prop="fnPackage.name"
                    min-width="150"
                  ></el-table-column>
                  <el-table-column fixed label="Kiểu đóng" align="center" width="90">
                    <template slot-scope="scope">
                      <span v-if="scope.row.fnPackage.type == 'single'">Một lần</span>
                      <span v-else-if="scope.row.fnPackage.type == 'multiple'"
                        >Nhiều lần</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column fixed align="center" label="Đăng ký">
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.active"
                        @change="activePackageKidsMethod(scope.row)"
                      ></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="Loại" width="80">
                    <template slot-scope="scope">
                      <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
                      <span v-else-if="scope.row.fnPackage.category == 'out'">Chi</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="Duyệt" width="90">
                    <template slot-scope="scope">
                      <span v-if="scope.row.approved">Đã duyệt</span>
                      <span v-else>Chưa duyệt</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="Khóa" width="90">
                    <template slot-scope="scope">
                      <span v-if="scope.row.locked">Đã khóa</span>
                      <span v-else>Chưa khóa</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="Thanh toán" width="120">
                    <template slot-scope="scope">
                      <span v-if="scope.row.paid > 0">Đã thanh toán</span>
                      <span v-else>Chưa thanh toán</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Khoản đính kèm" align="center" width="125">
                    <template
                      v-if="scope.row.fnPackageKidsExtend != null"
                      slot-scope="scope"
                    >
                      <el-button
                        style="text-decoration: underline"
                        type="text"
                        size="mini"
                        @click="updatePackageExtend(scope.row)"
                        >Sửa</el-button
                      >&nbsp;
                      <el-tooltip
                        effect="dark"
                        :content="'Khoản đính kèm: ' + scope.row.fnPackageKidsExtend.name"
                        placement="top"
                      >
                        <i
                          class="el-icon-circle-check"
                          :style="
                            scope.row.fnPackageKidsExtend.active
                              ? 'margin-left: 10px; color: #409eff'
                              : 'margin-left: 10px; color: red'
                          "
                        />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="Mô tả"
                    min-width="200"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="fnPackage.unit"
                    label="Đơn vị"
                    width="100"
                  ></el-table-column>
                  <el-table-column
                    prop="number"
                    align="center"
                    label="Số lượng"
                    width="80"
                  ></el-table-column>
                  <el-table-column align="right" label="Đơn giá" width="120">
                    <template slot-scope="scope">
                      <span>{{ scope.row.price | formatCurrency }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="discount"
                    align="center"
                    label="Giảm giá"
                    width="80"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.discount">Có</span>
                      <span v-else>Không</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="discountPrice"
                    align="right"
                    label="Đơn giá sau giảm"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.discount">{{
                        scope.row.discountPrice | formatCurrency
                      }}</span>
                      <span v-else>{{ scope.row.price | formatCurrency }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="expired"
                    align="center"
                    label="Hết hạn"
                    width="80"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.expired">Có</span>
                      <span v-else>Không</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="Điểm danh" width="85">
                    <template slot-scope="scope">
                      <span v-if="scope.row.fnPackage.attendance">Có</span>
                      <span v-else>Không</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Tác vụ"
                    fixed="right"
                    width="140"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="
                          !scope.row.approved && !scope.row.locked && scope.row.paid == 0
                        "
                      >
                        <el-button
                          size="mini"
                          type="success"
                          @click="updateDialogMethod(scope.row)"
                          >{{ $t("button.update") }}</el-button
                        >
                        <el-button
                          :disabled="
                            !scope.row.approved &&
                            !scope.row.locked &&
                            scope.row.paid == 0
                              ? false
                              : true
                          "
                          size="mini"
                          type="danger"
                          @click="deletePackageDefaultMethod(scope.row)"
                          >{{ $t("button.delete") }}</el-button
                        >
                      </span>
                      <span v-else>
                        <el-button disabled size="mini" type="success">{{
                          $t("button.update")
                        }}</el-button>
                        <el-button disabled size="mini" type="danger">{{
                          $t("button.delete")
                        }}</el-button>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column width="200" prop="fullName" label="Họ tên"></el-table-column>
            <el-table-column label="Ngày sinh" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.birthDay | formatDate }}</span>
              </template></el-table-column
            >
            <el-table-column label="Số khoản" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.fnKidsPackageList.length }}</span>
              </template></el-table-column
            >
            <el-table-column label="Tác vụ" width="110" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.fnKidsPackageList.length > 0">
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
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- khoản mặc định -->
        <el-tab-pane label="Mặc định" name="tabName2">
          <el-table
            ref="multipleTableDefault"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="responseTab2DataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeDefault"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="fullName"
              min-width="170"
              label="Họ tên"
            ></el-table-column>
            <el-table-column label="Ngày sinh" align="center" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.birthDay | formatDate }}</span>
              </template></el-table-column
            >
            <el-table-column label="Khoản khác" align="center" width="90">
              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.fnKidsPackageDefaultList.filter((x) => x.idClass == 0)
                      .length > 0
                  "
                  >{{
                    scope.row.fnKidsPackageDefaultList.filter((x) => x.idClass == 0)
                      .length
                  }}</span
                >
              </template></el-table-column
            >
            <!-- danh sách khoản -->
            <el-table-column
              align="center"
              v-for="(item, index) in headerTab2List"
              :key="item"
            >
              <template slot="header" slot-scope="scope">
                <el-popover
                  placement="bottom-start"
                  width="200"
                  trigger="hover"
                  :content="item.name"
                >
                  <span slot="reference">Khoản {{ index + 1 }}</span>
                </el-popover>
                <br />
                <el-checkbox
                  @change="checkHeaderMethod(scope.$index, item.id, item.check)"
                  v-model="item.check"
                ></el-checkbox>
              </template>

              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.fnKidsPackageDefaultList.filter(
                      (x) => x.idClass != 0 && x.fnPackage.id == item.id
                    ).length == 1
                  "
                >
                  <el-checkbox
                    v-model="
                      scope.row.fnKidsPackageDefaultList.filter(
                        (x) => x.idClass != 0 && x.fnPackage.id == item.id
                      )[0].active
                    "
                  ></el-checkbox>
                  <span
                    v-if="
                      scope.row.fnKidsPackageDefaultList.filter(
                        (x) => x.idClass != 0 && x.fnPackage.id == item.id
                      )[0].fnPackageDefaultExtend != null
                    "
                  >
                    <el-tooltip
                      effect="dark"
                      :content="
                        'Khoản đính kèm: ' +
                        scope.row.fnKidsPackageDefaultList.filter(
                          (x) => x.idClass != 0 && x.fnPackage.id == item.id
                        )[0].fnPackageDefaultExtend.name
                      "
                      placement="top"
                    >
                      <i
                        class="el-icon-circle-check"
                        :style="
                          scope.row.fnKidsPackageDefaultList.filter(
                            (x) => x.idClass != 0 && x.fnPackage.id == item.id
                          )[0].fnPackageDefaultExtend.active
                            ? 'margin-left: 10px; color: #409eff'
                            : 'margin-left: 10px; color: red'
                        "
                      />
                    </el-tooltip>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" fixed="right" width="230" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="addDefaultPackageMethod(scope.row)"
                  >Thêm</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="activePackageDefaultOneMethod(scope.row)"
                  >Lưu</el-button
                >

                <el-button
                  size="mini"
                  type="warning"
                  @click="detailPackageDefaultMethod(scope.row)"
                  >Chi tiết</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              :loading="loaddingButtonTab2"
              class="button-bottom"
              type="success"
              @click="activePackageDefaultManyMethod()"
              >Lưu</el-button
            >
            <el-tooltip
              effect="dark"
              content="Bổ sung khoản cho học sinh từ mặc định với tháng hiện tại"
              placement="top"
            >
              <el-button
                class="button-bottom"
                type="success"
                @click="addKidsPackageFromDefaultMethod()"
                >Bổ sung</el-button
              >
            </el-tooltip>
            <el-dropdown @command="handlePackageDefaultExtend">
              <el-button
                :loading="loaddingButtonExtend"
                class="button-bottom"
                type="success"
              >
                Khoản đính kèm
                <i class="el-icon-caret-bottom" />
              </el-button>
              <el-dropdown-menu>
                <el-dropdown-item command="createExtendCommand"
                  >Thêm khoản</el-dropdown-item
                >
                <el-dropdown-item command="activeExtendCommand"
                  >Kích hoạt</el-dropdown-item
                >
                <el-dropdown-item command="unActiveExtendCommand"
                  >Bỏ kích hoạt</el-dropdown-item
                >
                <el-dropdown-item command="deleteExtendCommand"
                  >Xóa khoản</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <PackageCreateDialog
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
    <PackageUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="PackageUpdateDialog"
    />
    <DefaultPackageAddDialog
      :dialogVisible="showAddDefaultPackage"
      @dialog-close="dialogCloseAddDefaultPackageMethod()"
      ref="DefaultPackageAddDialog"
    />
    <PackageDefaultKidDialog
      :dialogVisible="showPackageDefaultKid"
      @dialog-close="dialogClosePackageDefaultKidMethod()"
      ref="PackageDefaultKidDialog"
    />
    <PackageKidsAddDialog
      :dialogVisible="showAddPackageKids"
      @dialog-close="dialogCloseAddPackageKidsMethod()"
      ref="PackageKidsAddDialog"
    />
    <PackageKidDetailDialog
      :dialogVisible="showPackageKidsDetail"
      @dialog-close="dialogCloseAddPackageKidsDetailMethod()"
      ref="PackageKidDetailDialog"
    />
    <PackageKidsUpdateDialog
      :dialogVisible="showUpdatePackageKidsDialog"
      @dialog-close="dialogCloseUpdatePackageKidsMethod()"
      ref="PackageKidsUpdateDialog"
    />
    <PackageDefaultInClassDialog
      :dialogVisible="showAddPackageInClassDialog"
      @dialog-close="dialogCloseAddPackageInClassDialog()"
      ref="PackageDefaultInClassDialog"
    />
    <PackageExtendCreateDialog
      :dialogVisible="showCreateExtendDialog"
      @dialog-close="dialogCloseCreateExtendMethod()"
      ref="PackageExtendCreateDialog"
    />
    <AddPackageInKidsDialog
      :dialogVisible="showAddPackageInKidsDialog"
      @dialog-close="closeAddPackageInKidsDialogMethod()"
      ref="AddPackageInKidsDialog"
    />
    <PackageDefaultKidsDeleteDialog
      :dialogVisible="showDeleteManyDialog"
      @dialog-close="closeDeleteManyDialog()"
      ref="PackageDefaultKidsDeleteDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import FnPackageExtendService from "@/services/FnPackageExtendService";

import moment from "moment";
import PackageUpdateDialog from "./PackageUpdateDialog.vue";
import PackageCreateDialog from "./PackageCreateDialog.vue";
import DefaultPackageAddDialog from "./DefaultPackageAddDialog.vue";
import PackageDefaultKidDialog from "./PackageDefaultKidDialog.vue";
import PackageKidsAddDialog from "./PackageKidsAddDialog.vue";
import PackageKidDetailDialog from "./PackageKidDetailDialog.vue";
import PackageKidsUpdateDialog from "./PackageKidsUpdateDialog.vue";
import PackageDefaultInClassDialog from "./PackageDefaultInClassDialog.vue";
import PackageExtendCreateDialog from "./PackageExtendCreateDialog.vue";
import AddPackageInKidsDialog from "./AddPackageInKidsDialog.vue";
import PackageDefaultKidsDeleteDialog from "./PackageDefaultKidsDeleteDialog.vue";
import {mapActions, mapState} from "vuex";
const valMonthList = [
  { key: "pastMonth", value: "Tháng trước" },
  { key: "nowMonth", value: "Tháng hiện tại" },
  { key: "nextMonth", value: "Tháng kế tiếp" },
];
const valkidStatusList = [
  { key: "STUDYING", value: "Đang học" },
  { key: "STUDY_WAIT", value: "Chờ học" },
  { key: "RESERVE", value: "Bảo lưu" },
  { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
];
export default {
  components: {
    PackageUpdateDialog,
    PackageCreateDialog,
    DefaultPackageAddDialog,
    PackageDefaultKidDialog,
    PackageKidsAddDialog,
    PackageKidDetailDialog,
    PackageKidsUpdateDialog,
    PackageDefaultInClassDialog,
    PackageExtendCreateDialog,
    AddPackageInKidsDialog,
    PackageDefaultKidsDeleteDialog,
  },
  data() {
    return {
      textTable: "",
      loadingData: true,
      activeTabName: "tabName1",
      multipleSelectionKids: [],
      multipleSelectionDefault: [],
      loaddingButtonSaveTab1: false,
      loaddingButtonGenerateTab1: false,
      loaddingButtonTab2: false,
      loaddingButtonExtend: false,
      responseTab3DataList: [],
      responseTab2DataList: [],
      headerTab2List: [],
      responseTab1DataList: [],
      headerTab1List: [],
      responseClassList: [],
      responsePackageKidList: [],
      monthList: valMonthList,
      showCreateDialog: false,
      showUpdateDialog: false,
      showAddDefaultPackage: false,
      showAddPackageKids: false,
      showPackageKidsDetail: false,
      showPackageDefaultKid: false,
      showUpdatePackageKidsDialog: false,
      showAddPackageInClassDialog: false,
      showCreateExtendDialog: false,
      showAddPackageInKidsDialog: false,
      showDeleteManyDialog: false,
      gradeOfSchoolList: [],
      classOfGradeList: [],
      kidStatusList: valkidStatusList,
      // nowDate: "",
      dataSearch: {
        date: "",
        month: "nowMonth",
        status: "STUDYING",
        idClass: "",
        fullName: "",
      },
    };
  },
  computed:{
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableHeaderChidrenColor() {
      return "background-color: #b0d3f7;color: #606266;";
    },
    tableRowStyleDetail({ row }) {
      if (row.expandRow) {
        return "font-weight: bold";
      }
    },
    tableRowStyleChildren({ row }) {
      if (row.fnPackage.category == "out") {
        return "color: #409EFF";
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "tabName1") {
        this.searchClassPackageByProperties();
      } else if (tabNameClick == "tabName2") {
        this.searchPackageDefaultProperties();
      } else if (tabNameClick == "tabName3") {
        this.searchKidsPackageForKidsByProperties();
      }
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchPackageDefaultProperties();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchPackageDefaultProperties();
    },
    dialogCloseAddDefaultPackageMethod() {
      this.showAddDefaultPackage = false;
      this.searchPackageDefaultProperties();
    },
    dialogCloseAddPackageKidsMethod() {
      this.showAddPackageKids = false;
      this.searchClassPackageByProperties();
    },
    dialogCloseAddPackageKidsDetailMethod() {
      this.showPackageKidsDetail = false;
      this.searchClassPackageByProperties();
    },
    dialogClosePackageDefaultKidMethod() {
      this.showPackageDefaultKid = false;
      this.searchPackageDefaultProperties();
    },
    updateDialogMethod(row) {
      this.showUpdatePackageKidsDialog = true;
      this.$refs.PackageKidsUpdateDialog.getDataInitial(row.id);
    },
    dialogCloseUpdatePackageKidsMethod() {
      this.showUpdatePackageKidsDialog = false;
      this.searchKidsPackageForKidsByProperties();
    },
    dialogCloseAddPackageInClassDialog() {
      this.showAddPackageInClassDialog = false;
      this.$refs.multipleTableDefault.clearSelection();
    },
    dialogCloseCreateExtendMethod() {
      this.showCreateExtendDialog = false;
      this.searchKidsPackageForKidsByProperties();
    },
    closeAddPackageInKidsDialogMethod() {
      this.showAddPackageInKidsDialog = false;
      this.searchClassPackageByProperties();
    },
    closeDeleteManyDialog() {
      this.showDeleteManyDialog = false;
      this.searchClassPackageByProperties();
    },
    handleSelectionChangeKids(val) {
      this.multipleSelectionKids = val;
    },
    handleSelectionChangeDefault(val) {
      this.multipleSelectionDefault = val;
    },
    toogleExpandDetailDate(index, row) {
      row.expandRow = !row.expandRow;
      let $kidsPackageForKidsRef = this.$refs.kidsPackageForKidsRef;
      $kidsPackageForKidsRef.toggleRowExpansion(row);
    },
    activePackageKidsMethod(row) {
      FnFeesService.activePackageKids(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    deletePackageDefaultMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản này không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.loadingData = true;
        FnFeesService.deletePackageKidsById(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchKidsPackageForKidsByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    generatePackageKidsOneMethod(row) {
      let messageMonth = this.moment(this.dataSearch.date).format("MM-YYYY");
      this.$confirm(
        "Bạn có chắc chắn muốn khởi tạo không?",
        "Khởi tạo các khoản tháng " + messageMonth,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        FnFeesService.generatePackageKidsOne(row.id, this.dataSearch.date)
          .then((resp) => {
            if (resp.data.data == 0) {
              this.$message({
                message: resp.data.message,
                type: "warning",
              });
              this.loadingData = false;
            } else {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              this.searchClassPackageByProperties();
            }
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    checkBeforeSelect(list) {
      if (list.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    generatePackageKidsManyMethod() {
      let selectRowList = this.multipleSelectionKids;
      this.checkBeforeSelect(selectRowList);
      let messageMonth = this.moment(this.dataSearch.date).format("MM-YYYY");
      this.$confirm(
        "Bạn có chắc chắn muốn khởi tạo cho " +
          selectRowList.length +
          " học sinh đã chọn không?",
        "Khởi tạo các khoản tháng " + messageMonth,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loaddingButtonGenerateTab1 = true;
        this.loadingData = true;
        let dataInput = {
          date: this.dataSearch.date,
          idKidList: selectRowList,
        };
        FnFeesService.generatePackageKidsMany(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchClassPackageByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loaddingButtonGenerateTab1 = false;
            }, 500);
          });
      });
    },
    /**
     * click check header ở khoản mặc định
     */
    checkHeaderPackageKidsMethod(index, id, check) {
      this.responseTab1DataList.forEach((x) => {
        let filterList = x.fnKidsPackageList.filter((a) => a.fnPackage.id == id);
        if (filterList.length == 1) {
          filterList[0].active = check;
        }
      });
    },
    /**
     * click check header ở khoản mặc định
     */
    checkHeaderMethod(index, id, check) {
      this.responseTab2DataList.forEach((x) => {
        let filterList = x.fnKidsPackageDefaultList.filter((a) => a.fnPackage.id == id);
        if (filterList.length == 1) {
          filterList[0].active = check;
        }
      });
    },

    /**
     * kích hoạt/hủy kích hoạt khoản mặc định cho một học sinh
     */
    activePackageDefaultOneMethod(row) {
      FnFeesService.updatePackageKidsDefaultOne(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchPackageDefaultProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    /**
     * kích hoạt/hủy kích hoạt khoản cho một học sinh
     */
    activePackageKidsOneMethod(row) {
      FnFeesService.activePackageKidsOne(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchClassPackageByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    addDefaultPackageMethod(row) {
      this.showAddDefaultPackage = true;
      this.$refs.DefaultPackageAddDialog.getDataInitialAddDefaultPackage(row.id);
    },

    addPackageKidsMethod(row) {
      this.showAddPackageKids = true;
      this.$refs.PackageKidsAddDialog.getDataInitialAddPackageKids(
        row.id,
        this.dataSearch.date
      );
    },

    packageKidsDetailMethod(row) {
      this.showPackageKidsDetail = true;
      this.$refs.PackageKidDetailDialog.getDataInitialPackageKidsDetail(
        row,
        this.dataSearch.date,
        this.dataSearch.idClass
      );
    },

    detailPackageDefaultMethod(row) {
      this.showPackageDefaultKid = true;
      this.$refs.PackageDefaultKidDialog.getDataInitialPackageDefaultKid(row);
    },
    /**
     * Bổ sung
     */
    addKidsPackageFromDefaultMethod() {
      let idKidList = this.multipleSelectionDefault.filter((x) => x.id).map((x) => x.id);
      this.checkBeforeSelect(idKidList);
      let className = this.classOfGradeList.filter(
        (x) => x.id == this.dataSearch.idClass
      )[0].className;
      this.showAddPackageInClassDialog = true;
      this.$refs.PackageDefaultInClassDialog.getAddDataInitial(
        this.dataSearch.idClass,
        className,
        idKidList
      );
    },
    updatePackageExtend(row) {
      this.$refs.PackageExtendCreateDialog.getDataExtendInitial(
        "kids",
        "update",
        row.fnPackageKidsExtend.id,
        row.fnPackage.name
      );
      setTimeout(() => {
        this.showCreateExtendDialog = true;
      }, 100);
    },
    showAddPackageInKidsDialogMethod() {
      this.checkBeforeSelect(this.multipleSelectionKids);
      this.showAddPackageInKidsDialog = true;
      this.$refs.AddPackageInKidsDialog.getAddDataInitial();
    },
    deleteManyPackageMethod() {
      this.checkBeforeSelect(this.multipleSelectionKids);
      this.showDeleteManyDialog = true;
      this.$refs.PackageDefaultKidsDeleteDialog.getInitialDataDelete();
    },
    handlePackageDefaultExtend(command) {
      let idKidList = this.multipleSelectionDefault.map((x) => x.id);
      this.checkBeforeSelect(idKidList);
      this.loaddingButtonExtend = true;
      if (command == "createExtendCommand") {
        this.createDefaultExtendMethod(idKidList);
      } else if (command == "activeExtendCommand") {
        this.activeDefaultExtendMethod(idKidList, true);
      } else if (command == "unActiveExtendCommand") {
        this.activeDefaultExtendMethod(idKidList, false);
      } else if (command == "deleteExtendCommand") {
        this.deleteDefaultExtendMethod(idKidList);
      }
    },
    handlePackageKidsExtend(command) {
      let idKidList = this.multipleSelectionKids.map((x) => x.id);
      this.checkBeforeSelect(idKidList);
      this.loaddingButtonExtend = true;
      if (command == "createExtendCommand") {
        this.createKidsExtendMethod(idKidList);
      } else if (command == "activeExtendCommand") {
        this.activeKidsExtendMethod(idKidList, true);
      } else if (command == "unActiveExtendCommand") {
        this.activeKidsExtendMethod(idKidList, false);
      } else if (command == "deleteExtendCommand") {
        this.deleteKidsExtendMethod(idKidList);
      }
    },
    createDefaultExtendMethod(idKidList) {
      FnPackageExtendService.createDefaultExtendFromKid(idKidList)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchPackageDefaultProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonExtend = false;
          }, 500);
        });
    },
    activeDefaultExtendMethod(idKidList, active) {
      FnPackageExtendService.activeDefaultExtendFromKid(idKidList, active)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchPackageDefaultProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonExtend = false;
          }, 500);
        });
    },
    deleteDefaultExtendMethod(idKidList) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản đính kèm không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FnPackageExtendService.deleteDefaultExtendFromKid(idKidList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchPackageDefaultProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loaddingButtonExtend = false;
            }, 500);
          });
      });
    },
    createKidsExtendMethod(idKidList) {
      FnPackageExtendService.createKidsExtendFromKid(idKidList, this.dataSearch.date)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchClassPackageByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonExtend = false;
          }, 500);
        });
    },
    activeKidsExtendMethod(idKidList, active) {
      FnPackageExtendService.activeKidsExtendFromKid(
        idKidList,
        active,
        this.dataSearch.date
      )
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchClassPackageByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonExtend = false;
          }, 500);
        });
    },
    deleteKidsExtendMethod(idKidList) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản đính kèm không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FnPackageExtendService.deleteKidsExtendFromKid(idKidList, this.dataSearch.date)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchClassPackageByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loaddingButtonExtend = false;
            }, 500);
          });
      });
    },

    /**
     * kích hoạt/hủy kích hoạt khoản mặc định cho nhiều học sinh
     */
    activePackageDefaultManyMethod() {
      let selectRowList = this.multipleSelectionDefault;
      this.checkBeforeSelect(selectRowList);
      this.loaddingButtonTab2 = true;
      this.loadingData = true;
      FnFeesService.updatePackageKidsDefaultMany(selectRowList)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchPackageDefaultProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonTab2 = false;
          }, 500);
        });
    },

    /**
     * kích hoạt/hủy kích hoạt khoản cho nhiều học sinh
     */
    activePackageKidsManyMethod() {
      let selectRowList = this.multipleSelectionKids;
      this.checkBeforeSelect(selectRowList);
      this.loaddingButtonSaveTab1 = true;
      this.loadingData = true;
      FnFeesService.activePackageKidsMany(selectRowList)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchClassPackageByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonSaveTab1 = false;
          }, 500);
        });
    },

    /**
     * thêm khoản
     */
    createDialogMethod() {
      setTimeout(() => {
        this.showCreateDialog = true;
      }, 100);
    },

    getCurrentDate() {
      let date = moment(String(new Date())).format("YYYY-MM-DD");
      this.dataSearch.date = date;
      // this.nowDate = moment(date).add(-1, "M").set("date", 1).format("YYYY-MM-DD");
    },
    changeSearchMethod() {
      if (this.activeTabName == "tabName1") {
        this.searchClassPackageByProperties();
      } else if (this.activeTabName == "tabName2") {
        this.searchPackageDefaultProperties();
      } else if (this.activeTabName == "tabName3") {
        this.searchKidsPackageForKidsByProperties();
      }
    },
    /**
     * đối khối
     */
    async changeGradeSearch() {
      await this.getClassInGrade();
      this.changeSearchMethod();
    },

    // changeClassSearch() {
    //   if (this.activeTabName == "tabName1") {
    //     this.searchClassPackageByProperties();
    //   } else if (this.activeTabName == "tabName2") {
    //     this.searchPackageDefaultProperties();
    //   }
    // },

    // changeFullName() {
    //   if (this.activeTabName == "tabName1") {
    //     this.searchClassPackageByProperties();
    //   } else if (this.activeTabName == "tabName2") {
    //     this.searchPackageDefaultProperties();
    //   }
    // },

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
     * danh sách các khoản mặc định
     */
    searchPackageDefaultProperties() {
      this.textTable = "";
      this.loadingData = true;
      FnFeesService.searchPackageKidsDefault(
        this.dataSearch.status,
        this.dataSearch.idClass,
        this.dataSearch.fullName
      )
        .then((resp) => {
          this.responseTab2DataList = resp.data.data.dataList;
          this.headerTab2List = resp.data.data.packageList;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseTab2DataList = [];
          this.headerTab2List = [];
        })
        .finally(() => {
          if (this.responseTab2DataList.lenght == 0) {
            this.textTable = this.$tableEmpty;
          }
          setTimeout(() => {
            this.loadingData = false;
          }, 300);
        });
    },
    /**
     * tìm kiếm các khoản theo lớp
     */
    searchClassPackageByProperties() {
      this.textTable = "";
      this.loadingData = true;
      FnFeesService.searchPackageKids(
        this.dataSearch.date,
        this.dataSearch.status,
        this.dataSearch.idClass,
        this.dataSearch.fullName
      )
        .then((resp) => {
          this.responseTab1DataList = resp.data.data.dataList;
          this.headerTab1List = resp.data.data.packageList;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseTab1DataList = [];
          this.headerTab1List = [];
        })
        .finally(() => {
          if (this.responseTab1DataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          setTimeout(() => {
            this.loadingData = false;
          }, 300);
        });
    },
    /**
     * tìm kiếm tất cả khoản theo học sinh
     */
    searchKidsPackageForKidsByProperties() {
      this.textTable = "";
      this.loadingData = true;
      FnFeesService.searchPackageKidsForKids(
        this.dataSearch.date,
        this.dataSearch.status,
        this.dataSearch.idClass,
        this.dataSearch.fullName
      )
        .then((resp) => {
          this.responseTab3DataList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseTab3DataList = [];
        })
        .finally(() => {
          if (this.responseTab3DataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          setTimeout(() => {
            this.loadingData = false;
          }, 300);
        });
    },

    async fetchDataMany() {
      this.getCurrentDate();
      await Promise.all([this.getAllGrade()]);
      await this.getClassInGrade();
      this.searchClassPackageByProperties();
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
  padding: 12px 0;
}
/deep/.el-icon-arrow-right:before {
  content: "";
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 5px;
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
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
