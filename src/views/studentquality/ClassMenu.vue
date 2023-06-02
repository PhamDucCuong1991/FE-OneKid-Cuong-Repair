<template>
  <div class="content">
    <div style="margin-top: 5px">
      <!-- Tìm kiếm xem -->
      <div v-if="radio == 1" class="button-click-left">
        <el-date-picker
          v-model="timeClassMenu"
          type="week"
          value-format="yyyy-MM-dd"
          format="Tuần WW(từ dd-MM-yyyy)"
          placeholder="Chọn tuần"
          :clearable="false"
          @change="
            searchByProperties(
              timeClassMenu,
              dataSearch.idGrade,
              dataSearch.idClass
            )
          "
        ></el-date-picker>
        <!-- <el-button slot="append" icon="el-icon-search" @click="searchByProperties(timeClassMenu)"></el-button> -->
        <el-select
          v-if="getAppTypeUserLogin == 'plus'"
          class="button-left"
          v-model="dataSearch.idGrade"
          @change="changeGrade()"
          placeholder="Chọn khối"
          clearable
          style="margin-left: 5px"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :label="item.gradeName"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-select
          class="button-left"
          v-model="dataSearch.idClass"
          @change="
            searchByProperties(
              timeClassMenu,
              dataSearch.idGrade,
              dataSearch.idClass
            )
          "
          placeholder="Chọn lớp"
          :clearable="getAppTypeUserLogin == 'plus'"
          style="margin-left: 5px"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <!-- Tìm kiếm chi tiết -->
      <div v-if="radio == 2" class="button-click-left">
        <el-date-picker
          v-model="timeClassMenu"
          type="week"
          value-format="yyyy-MM-dd"
          format="Tuần WW(từ dd-MM-yyyy)"
          placeholder="Chọn tuần"
          :clearable="false"
          @change="getAllClassMenuDetail(timeClassMenu)"
        ></el-date-picker>
        <!-- <el-button slot="append" icon="el-icon-search" @click="searchByProperties(timeClassMenu)"></el-button> -->
        <el-select
          v-if="getAppTypeUserLogin == 'plus'"
          class="button-left"
          v-model="dataSearch.idGrade"
          @change="changeGradeDetail(timeClassMenu)"
          placeholder="Chọn khối"
          clearable
          style="margin-left: 5px; margin-right: 5px"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :label="item.gradeName"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-select
          class="button-left"
          style="margin-left: 5px"
          v-model="dataSearch.idClass"
          @change="getAllClassMenuDetail(timeClassMenu)"
          placeholder="Chọn lớp"
          :clearable="getAppTypeUserLogin == 'plus'"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <el-radio
        style="margin-left: 50px"
        @change="handleRadio()"
        v-model="radio"
        label="1"
        >Xem</el-radio
      >
      <el-radio v-model="radio" @change="handleRadio()" label="2"
        >Chi tiết</el-radio
      >

      <div class="button-click row-data" v-if="getAppTypeUserLogin == 'plus'">
        <el-dropdown
          v-if="checkPermission(['studentQuality_menu_update'])"
          @command="handleCommandAdd"
        >
          <el-button class="button-over" type="success">
            <i class="el-icon-plus" />
            Thêm mới
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="createClassMenu"
              >Nhập Thực Đơn</el-dropdown-item
            >
            <el-dropdown-item command="createClassMenuFile"
              >Thêm dạng File,Ảnh</el-dropdown-item
            >
            <el-dropdown-item command="createClassMenuExcel"
              >Thực đơn từ Excel</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown
          @command="handleCommandAction"
          v-if="getAppTypeUserLogin == 'plus'"
        >
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <span v-if="checkPermission(['studentQuality_menu_update'])">
              <el-dropdown-item command="activeAccount"
                >Duyệt Thực Đơn</el-dropdown-item
              >
              <el-dropdown-item command="unactiveAccount"
                >Hủy Duyệt Thực Đơn</el-dropdown-item
              >
              <el-dropdown-item command="deleteContentClassMenu"
                >Xóa Nội Dung Thực Đơn</el-dropdown-item
              >
            </span>
            <el-dropdown-item command="exportExcel"
              >Xuất File Excel</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- Màn hình xem -->
    <div
      v-show="radio == 1"
      class="table-content row-data"
      v-for="item in tabAllListClassMenu"
      :key="item.idClass"
    >
      <h3 style="color: blue; margin-top: 50px">
        Thực đơn lớp: {{ item.className }}
      </h3>

      <el-table
        :data="item.tabClassMenuList"
        border
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
      >
        <el-table-column
          prop="sessionDay"
          label="Buổi"
          align="center"
        ></el-table-column>
        <el-table-column prop="monday" label="Thứ 2" align="center">
          <template slot-scope="scope">
            {{ scope.row.monday }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEdit(scope.$index, scope.row, 2)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="tuesday" label="Thứ 3" align="center">
          <template slot-scope="scope">
            {{ scope.row.tuesday }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEdit(scope.$index, scope.row, 3)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="wednesday" label="Thứ 4" align="center">
          <template slot-scope="scope">
            {{ scope.row.wednesday }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEdit(scope.$index, scope.row, 4)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="thursday" label="Thứ 5" align="center">
          <template slot-scope="scope">
            {{ scope.row.thursday }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEdit(scope.$index, scope.row, 5)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="friday" label="Thứ 6" align="center">
          <template slot-scope="scope">
            {{ scope.row.friday }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEdit(scope.$index, scope.row, 6)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            item.morningSaturday ||
            item.afternoonSaturday ||
            item.eveningSaturday
          "
          prop="saturday"
          label="Thứ 7"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.saturday }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEdit(scope.$index, scope.row, 7)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="item.sunday"
          prop="sunday"
          label="CN"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.sunday }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEdit(scope.$index, scope.row, 8)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <br />
    <!-- Màn hình chi tiết -->
    <div v-if="radio == 2" class="table-content row-data">
      <el-table
        @selection-change="handleSelectionChange"
        :data="tabListClassMenuDetail"
        border
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
      >
        <el-table-column
          v-if="getAppTypeUserLogin == 'plus'"
          type="selection"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="gradeName"
          label="Tên khối học"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="className"
          label="Tên lớp"
          align="center"
        ></el-table-column>
        <el-table-column prop="approve" align="center" label="Duyệt" width="70">
          <template slot-scope="scope">
            <el-checkbox
              :disabled="getAppTypeUserLogin != 'plus'"
              v-if="
                scope.row.listCheckContentDay !== null ||
                scope.row.fileList != null
              "
              v-model="scope.row.approve"
              @change="handleCheckBoxApprove(scope.$index, scope.row)"
            ></el-checkbox>
            <el-checkbox v-else disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="listCheckContentDay"
          label="Các ngày có thực đơn"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.listCheckContentDay }}
            <el-button
              v-if="getAppTypeUserLogin == 'plus'"
              size="mini"
              class="clickCellClassMenu"
              @click="handleEditDetailClass(scope.$index, scope.row, 2)"
            >
              <div>
                <h4 class="edit" style="color: #00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getAppTypeUserLogin == 'plus'"
          prop="listFileOrPicture"
          label="Thực đơn dạng File,Ảnh"
          align="center"
        >
          <template slot-scope="scope">
            <el-upload
              class="upload-demo"
              ref="upload"
              action
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="handleBeforeUpload"
              multiple
              :auto-upload="false"
              :on-change="handleChangeFile"
              :limit="5"
              :on-exceed="handleExceed"
              :file-list="scope.row.fileList == null ? [] : scope.row.fileList"
              :on-preview="handleFileRequest"
            >
              <el-button
                v-if="checkPermission(['studentQuality_menu_update'])"
                @click="getIndexRow(scope.$index)"
                size="mini"
                type="primary"
                >Nhập File</el-button
              >
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" align="center" width="140">
          <template slot-scope="scope">
            <el-button
              v-if="
                checkPermission(['studentQuality_menu_update']) &&
                getAppTypeUserLogin == 'plus'
              "
              style="margin-bottom: 20px; width: 95px"
              size="mini"
              type="primary"
              :loading="loadingButton"
              :disabled="checkSave"
              @click="handleChangeFileMenu()"
              >Lưu File</el-button
            >

            <el-button
              style="margin-left: 0"
              size="mini"
              type="primary"
              @click="handleViewDetail(scope.$index, scope.row)"
              >Xem chi tiết</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <UpdateClassMenu
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateClassMenu"
    />
    <CreateClassMenu
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateClassMenu"
    />

    <CreateClassMenuExcel
      :dialogVisibleEx="showCreateExDialog"
      @dialog-close="dialogCloseCreateExMethod()"
      ref="CreateClassMenuExcel"
    />
    <CreateClassMenuFile
      :dialogVisibleFile="showCreateFileDialog"
      @dialog-close="dialogCloseCreateFileMethod()"
      ref="CreateClassMenuFile"
    />
    <ClassMenuDetail
      :dialogVisible="showViewDetailDialog"
      @dialog-close="dialogCloseViewDetailMethod()"
      ref="ClassMenuDetail"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import ClassMenuService from "../../services/ClassMenuService";
import TeacherService from "../../services/TeacherService";
import UpdateClassMenu from "./UpdateClassMenu.vue";
import CreateClassMenu from "./CreateClassMenu.vue";
import ClassMenuDetail from "./ClassMenuDetail.vue";
import CreateClassMenuExcel from "./CreateClassMenuExcel.vue";
import CreateClassMenuFile from "./CreateClassMenuFile.vue";
import moment from "moment";
import http from "../../http-download";
import {mapActions, mapState} from "vuex";

export default {
  components: {
    UpdateClassMenu,
    CreateClassMenu,
    ClassMenuDetail,
    CreateClassMenuExcel,
    CreateClassMenuFile,
  },
  data() {
    return {
      layout: "sizes, prev, pager, next",
      total: 10,
      pageSize: 10,
      currentPageNumber: 1,
      radio: "1",
      multipleSelection: [],
      pageList: [10, 20, 30, 40, 50, 10000],
      tableDataFilter: [],
      multipartFileList: [],
      loadingButton: false,
      checkSave: false,

      tabAllListClassMenu: [],
      indexRow: 0,
      timeClassMenu: "",
      dataSearch: {
        idClass: "",
        idGrade: "",
      },
      tabListClassMenuDetail: [],
      showUpdateDialog: false,
      showCreateDialog: false,
      showCreateExDialog: false,
      showCreateFileDialog: false,
      showViewDetailDialog: false,
      checkboxAllLeave: false,
      classOfGradeList: [],
      gradeOfSchoolList: [],
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
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    handleEdit(index, row, timeDay) {
      this.$refs.UpdateClassMenu.getClassMenuByIdClass(
        this.timeClassMenu,
        row.idClass,
        timeDay
      );
      this.showUpdateDialog = true;
    },
    handleEditDetailClass(index, row, timeDay) {
      this.$refs.UpdateClassMenu.getClassMenuByIdClass(
        this.timeClassMenu,
        row.idClass,
        timeDay
      );
      this.showUpdateDialog = true;
    },
    handleCheckBoxApprove(index, row) {
      ClassMenuService.updateApprove(row)
        .then((res) => {
          console.log(res);
          if (row.approve) {
            this.$message({
              message: "Duyệt thực đơn thành công",
              type: "success",
            });
          } else {
            this.$message({
              message: "Hủy duyệt thực đơn thành công",
              type: "success",
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            message: "Duyệt thực đơn thất bại",
            type: "error",
          });
        })
        .finally(() => {
          this.getCurrentDate();
          this.searchByProperties(
            this.timeClassMenu,
            this.dataSearch.idGrade,
            this.dataSearch.idClass
          );
        });
    },
    handleRadio() {
      let a = this.radio;
      if (a == 2) {
        this.getAllClassMenuDetail(this.timeClassMenu);
      } else if (a == 1) {
        this.searchByProperties(
          this.timeClassMenu,
          this.dataSearch.idGrade,
          this.dataSearch.idClass
        );
      }
    },
    handleBeforeUpload() {
      this.$refs.upload.clearFiles();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties(
        this.timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
      this.getAllClassMenuDetail(this.timeClassMenu);
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties(
        this.timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
    dialogCloseCreateExMethod() {
      this.showCreateExDialog = false;
      this.searchByProperties(
        this.timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
    dialogCloseCreateFileMethod() {
      this.showCreateFileDialog = false;
      this.searchByProperties(
        this.timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
      this.getAllClassMenuDetail(this.timeClassMenu);
    },
    dialogCloseViewDetailMethod() {
      this.showViewDetailDialog = false;
      this.getAllClassMenuDetail(this.timeClassMenu);
      // this.searchByProperties(
      //   this.timeClassMenu,
      //   this.dataSearch.idGrade,
      //   this.dataSearch.idClass
      // );
    },
    searchByProperties(timeClassMenu, idGrade, idClass) {
      ClassMenuService.getClassMenuAllClassInWeek(
        timeClassMenu,
        idGrade,
        idClass
      )
        .then((response) => {
          // this.tabAllListClassMenu = response.data.data;
          if (this.getAppTypeUserLogin == "teacher") {
            this.tabAllListClassMenu = idClass != "" ? response.data.data : [];
          } else {
            this.tabAllListClassMenu = response.data.data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getCurrentDate() {
      let monday = (this.timeClassMenu = moment(String(new Date()))
        .startOf("isoweek")
        .format("YYYY-MM-DD"));
      let tuesday = moment(String(new Date()))
        .startOf("isoweek")
        .add(1, "days")
        .format("YYYY-MM-DD");
      console.log(tuesday);
      console.log(monday);
    },
    handleCommandAdd(command) {
      if (command == "createClassMenu") {
        this.showCreateDialog = true;
        this.$refs.CreateClassMenu.getAllClass();
      }
      if (command == "createClassMenuFile") {
        this.showCreateFileDialog = true;
        this.$refs.CreateClassMenuFile.getAllClass();
      }
      if (command == "createClassMenuExcel") {
        this.showCreateExDialog = true;
        this.$refs.CreateClassMenuExcel.getAllClass();
      }
    },

    handleCommandAction(command) {
      if (command == "activeAccount") {
        this.updateMultiActivated(true);
      } else if (command == "unactiveAccount") {
        this.updateMultiActivated(false);
      } else if (command == "deleteContentClassMenu") {
        this.deleteContentClassMenu();
      } else if (command == "exportExcel") {
        this.exportExcelSchedule();
      }
    },

    /**Xuất file excel */
    // exportExcelSchedule() {
    //   let id = this.dataSearch.idClass;
    //   let date = this.timeClassMenu;
    //   if (id == "" || id == undefined) {
    //     this.$message({
    //       message: "Chưa chọn lớp",
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
    //         `/class-menu/export-menu-class?idClass=` +
    //           id +
    //           `&timeClassMenu=` +
    //           date
    //       )
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute(
    //           "download",
    //           "QUAN_LY_THUC_DON_HOC_SINH_" + myDate + ".xlsx"
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
    exportExcelSchedule() {
      let id = this.dataSearch.idClass;
      let date = this.timeClassMenu;
      if (id == "" || id == undefined) {
        this.$message({
          message: "Chưa chọn lớp",
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
        this.getStyleExcelMenu();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        ClassMenuService.getExportExcel(id, date)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_THUC_DON_HOC_SINH_${myDate}`;
                const merges = ["A1:H1"];
                const tHeader = [
                  "Bữa ăn",
                  "Thứ hai/Monday",
                  "Thứ ba/Tuesday",
                  "Thứ tư/Wednesday",
                  "Thứ năm/Thursday",
                  "Thứ sáu/Friday",
                  "Thứ bảy/Sat",
                  "Chủ nhật/Sun",
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
                ];
                let columnList = [
                  { col: 20 },
                  { col: 20 },
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
                  checkCustom: "menu",
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
    //Style css Excel Menu
    getStyleExcelMenu() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();

      let style1 = {
        name: "A5:H5",
        style: {
          fill: { fgColor: { rgb: "ffff00" } },
          font,
          alignment,
          border,
        },
      };
      let style2 = {
        name: "A6:A11",
        style: {
          fill: { fgColor: { rgb: "95d240" } },
          font: { color: { rgb: "ffffff" }, bold: true, sz: "11" },
          alignment,
          border,
        },
      };

      let styleCol01 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
          alignment: { horizontal: "center", vertical: "center" },
        },
      };
      let styleCol02 = {
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };
      this.styleCols2.push(style1);
      this.styleCols2.push(style2);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
    },
    handleRemove(file) {
      ClassMenuService.deleteMenuFile(file.idUrlMenuFile)
        .then((res) => {
          console.log(res.data.data);
          this.$message({
            message: "Xóa file thực đơn thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Xóa file thực đơn thất bại",
            type: "error",
          });
        });
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed() {
      this.$message.warning(`Chỉ được chọn 5 File Ảnh`);
    },
    beforeRemove(file) {
      return this.$confirm(`Bạn có muốn xóa file ${file.name} ?`);
    },
    getAllClassMenuDetail(timeClassMenu) {
      // this.$refs.upload.clearFiles();
      let d = this.dataSearch.idGrade;
      let e = this.dataSearch.idClass;
      console.log(d);
      console.log(e);
      ClassMenuService.getAllClassMenuDetail(
        timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      )
        .then((res) => {
          // this.tabListClassMenuDetail = res.data.data;
          if (this.getAppTypeUserLogin == "teacher") {
            this.tabListClassMenuDetail =
              this.dataSearch.idClass != "" ? res.data.data : [];
          } else {
            this.tabListClassMenuDetail = res.data.data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateMultiActivated(statusApprove) {
      let e = this.multipleSelection.filter((element) => {
        return element.listCheckContentDay != null;
      });
      e.forEach((element) => {
        element.approve = statusApprove;
        let r = element;
        console.log(r);
      });

      ClassMenuService.updateMultiApprove(e)
        .then((res) => {
          console.log(res.data.data);
          if (statusApprove == true) {
            this.$message({
              message: "Duyệt thời khóa biểu thành công",
              type: "success",
            });
          } else if (statusApprove == false) {
            this.$message({
              message: "Hủy duyệt thời khóa biểu thành công",
              type: "success",
            });
          }
          this.getAllClassMenuDetail(this.timeClassMenu);
        })
        .catch((err) => {
          console.log(err);
          if (statusApprove == true) {
            this.$message({
              message: "Duyệt thời khóa biểu thất bại",
              type: "error",
            });
          } else if (statusApprove == false) {
            this.$message({
              message: "Hủy duyệt thời khóa biểu thất bại",
              type: "error",
            });
          }
        });
    },
    handleViewDetail(index, row) {
      console.log(row);
      this.$refs.ClassMenuDetail.getTabClassMenuViewDetail(row.idClass);
      this.showViewDetailDialog = true;
    },
    deleteContentClassMenu() {
      let e = this.multipleSelection.filter((element) => {
        return element.listCheckContentDay != null;
      });
      console.log(e);
      ClassMenuService.deleteContentClassMenu(e)
        .then((res) => {
          console.log(res.data.data);
          this.$message({
            message: "Xóa nội dung thực đơn thành công",
            type: "success",
          });
          this.getAllClassMenuDetail(this.timeClassMenu);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    handleChangeFile(file, fileList) {
      this.multipartFileList = fileList;
    },
    handleChangeFileMenu() {
      // this.loadingButton = true;
      this.checkSave = true;
      let formData = new FormData();
      let idClass = this.tabListClassMenuDetail[this.indexRow].idClass;
      let approved = this.tabListClassMenuDetail[this.indexRow].approve;
      if (this.multipartFileList.length > 0) {
        this.multipartFileList.forEach((element) => {
          formData.append("multipartFileList", element.raw);
        });
      }
      formData.append("fromFileTime", this.timeClassMenu);
      formData.append("Approved", approved);
      formData.append("idClass", idClass);

      // ClassMenuService.createFileAndPicture(formData)
      ClassMenuService.createFileAndPicture(formData)
        .then((res) => {
          if (res.data) {
            this.$message({
              message: "Tải lên file thực đơn thành công",
              type: "success",
            });
            this.getAllClassMenuDetail(this.timeClassMenu);
            this.multipartFileList = [];
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.checkSave = false;
          }, 500);
        });
    },
    getIndexRow(index) {
      this.indexRow = index;
    },
    handleFileRequest(file) {
      let a = file;
      console.log(a);
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlMenuFile = file.idUrlMenuFile;
      this.downloadItem(label, extensionFile, idUrlMenuFile);
    },
    downloadItem(label, extensionFile, idUrlMenuFile) {
      http
        .get(`/class-menu/download2/${idUrlMenuFile}`)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", label);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Tải về thất bại",
            type: "error",
          });
        });
    },
    /**
     * đối khối cho tab detail
     */
    async changeGrade() {
      await this.getClassInGrade();
      this.dataSearch.idClass = "";
      this.searchByProperties(
        this.timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
    async changeGradeDetail(timeClassMenu) {
      await this.getClassInGrade();
      this.dataSearch.idClass = "";
      this.getAllClassMenuDetail(timeClassMenu);
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
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade()]);
        await this.getClassInGrade();
      } else if (this.getAppTypeUserLogin == "teacher") {
        await this.getClassListTeacher();
      }

      this.searchByProperties(
        this.timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
  },

  beforeMount() {
    this.getCurrentDate();
    this.fetchDataMany();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }

  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-left {
    width: 145px;
  }
  .button-click-left {
    display: inline-block;
  }
  .button-click {
    float: right;
  }
  .table-content {
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
  /deep/.el-table th.gutter {
    background-color: #78a5e7;
  }
  /deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto;
  }
  /deep/.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
    word-break: break-word;
    line-height: 23px;
    padding-right: 10px;
    // max-height: 50px;
    text-align: left;
    text-overflow: ellipsis;
  }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    margin-left: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}

.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: rgb(95, 180, 74);
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.clickCellClassMenu {
  border: none;
  padding: 0;
}
.clickCellClassMenu:hover {
  color: red;
}
.el-table .line-break .cell {
  white-space: pre;
}
h4.edit {
  color: #00a1ff;
  position: absolute;
  bottom: -12px;
  right: 18px;
}
</style>
