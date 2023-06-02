<template>
  <div class="content">
    <!-- add -->
    <div class="hasagi" style="margin-top: 5px">
      <el-date-picker
        class="button-left-class1"
        v-model="dataSearch.date"
        type="date"
        @change="searchHeaderMethod()"
        value-format="yyyy-MM-dd"
        clearable
        format="dd-MM-yyyy"
        placeholder="Chọn ngày"
      ></el-date-picker>
      <el-date-picker
        class="input-common input-date"
        style="width: 140px"
        type="week"
        clearable
        v-model="dataSearch.week"
        format="Tuần WW"
        value-format="yyyy-MM-dd"
        placeholder="Chọn tuần"
        :picker-options="startDayOfWeek"
        @change="searchHeaderMethod()"
      ></el-date-picker>

      <el-date-picker
        class="input-common input-date"
        style="width: 165px; margin-left: 5px"
        type="month"
        v-model="dataSearch.month"
        clearable
        format="'Tháng 'MM-yyyy"
        value-format="yyyy-MM-dd"
        placeholder="Chọn tháng"
        @change="searchHeaderMethod()"
      ></el-date-picker>

      <el-input
        class="button-left-class"
        style="width: 220px; margin-left: 5px"
        placeholder="Nhập tên"
        clearable
        v-model="dataSearch.name"
        @change="searchHeaderMethod()"
        @keyup.enter.native="searchHeaderMethod()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHeaderMethod()"
        ></el-button>
      </el-input>
      <el-button
        v-if="checkPermission(['birthday_kids_update'])"
        class="button-over"
        type="success"
        @click="handleSendMultiNotifi()"
        >Gửi lời chúc</el-button
      >
    </div>

    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="kidsbirthdaylist"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
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
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="fullName"
          label="Họ và tên"
          align="left"
        ></el-table-column>
        <el-table-column prop="className" label="Lớp" width="260" align="left ">
          <template slot-scope="scope">
            <span>{{ scope.row.maClass.className }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="birthDay"
          width="150"
          label="Ngày sinh"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="yearsOld"
          label="Số tuổi"
          width="120"
          align="center "
        ></el-table-column>
        <el-table-column
          prop="gender"
          label="Giới tính"
          width="120"
          align="center "
        ></el-table-column>
        <el-table-column
          prop="kidPhone"
          label="Số điện thoại"
          width="200"
          align="center "
        ></el-table-column>

        <el-table-column
          v-if="checkPermission(['birthday_kids_update'])"
          label="Tác vụ"
          width="160"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.kidPhone"
              type="primary"
              @click="handleSendNotifi(scope.$index, scope.row)"
              >Gửi lời chúc</el-button
            >

            <el-button size="mini" v-else disabled type="info"
              >Chưa có SĐT</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data" style="float: right">
      <el-pagination
        background
        :current-page="pageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultNew"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>
    <ViewKidsBirthDay
      :dialogVisible="showCreateDialog"
      @dialog-close="showCreateDialog = false"
      ref="ViewKidsBirthDay"
    />
    <SendNotificationBirthday
      :dialogVisible="showViewDetailSend"
      @dialog-close="showViewDetailSend = false"
      ref="SendNotificationBirthday"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import KidsBirhtdayService from "@/services/KidsBirhtdayService";
import ViewKidsBirthDay from "./ViewKidsBirthDay.vue";
import SendNotificationBirthday from "./SendNotificationBirthday.vue";
import moment from "moment";
export default {
  components: {
    ViewKidsBirthDay,
    SendNotificationBirthday,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      date: "",
      week: "",
      month: "",
      showCreateDialog: false,
      showViewDetailSend: false,
      maClassList: [],
      kidsbirthdaylist: [],
      multipleSelection: [],
      checkDisable: false,
      value: "",

      dataSearch: {
        date: "",
        week: "",
        month: "",
        name: "",
      },
    };
  },
  computed: {
    isEditing: function () {
      return this.editing !== null;
    },
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.getAllKidsBirthday();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getAllKidsBirthday();
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.getAllKidsBirthday();
    },
    getAllKidsBirthday() {
      if (this.dataSearch.date == null) {
        this.dataSearch.date = [];
      }
      if (this.dataSearch.week == null) {
        this.dataSearch.week = [];
      }
      if (this.dataSearch.week == null) {
        this.dataSearch.week = [];
      }
      if (this.dataSearch.month == null) {
        this.dataSearch.month = [];
      }
      this.loadingData = true;
      KidsBirhtdayService.searchKidsBirthdayNew(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.date,
        this.dataSearch.week,
        this.dataSearch.month,
        this.dataSearch.name
      )
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          this.kidsbirthdaylist = resp.data.data.responseList;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.kidsbirthdaylist = [];
          console.log(err);
        })
        .finally(() => {
          if (this.kidsbirthdaylist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    handleViewDetail(index, row) {
      this.showCreateDialog = true;
      this.$refs.ViewKidsBirthDay.getDetailMethod(row.id);
    },
    handleSendNotifi(index, row) {
      this.showViewDetailSend = true;
      this.$refs.SendNotificationBirthday.getDetailMethodSend(row.id);
      this.$refs.SendNotificationBirthday.getAllAppSend();
    },
    handleSendMultiNotifi() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length < 1) {
        this.$message({
          message: "Bạn chưa chọn học sinh",
          type: "error",
        });
      } else {
        this.showViewDetailSend = true;
        this.$refs.SendNotificationBirthday.getDetailMultiMethodSend(list);
        this.$refs.SendNotificationBirthday.getAllAppSend();
      }
    },
    getCurrentDate() {
      let a = (this.dataSearch.date = moment(String(new Date())).format(
        "YYYY-MM-DD"
      ));
      console.log(a);
    },
  },

  beforeMount() {
    this.getAllKidsBirthday();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}
.buttondropdown {
  float: right;
  border-radius: 0;
  margin-left: 3px;
  margin-top: 15px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
  max-height: 50px;
  text-overflow: ellipsis;
}
.button-select {
  margin-right: 5px;
  width: 150px;
}
.hasagi {
  margin-bottom: 20px;
}
/deep/.el-table th {
  padding: 10px 0;
}

.paging-click {
  float: left;
  margin-top: 5px;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/[data-v-5ed4c166] .el-tabs--card > .el-tabs__header {
  border-bottom: none;
  margin-top: -8px;
}
/deep/.el-tabs__nav-wrap {
  margin-top: 0px;
  margin-bottom: -15px;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
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
.btt {
  float: right;
  margin-top: 10px;
}

.button-over {
  float: right;
}
/deep/.date[data-v-5ed4c166] {
  margin-bottom: -25px;
  z-index: 2;
  position: relative;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}

.content .row-data {
  margin-bottom: 20px;
}
.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border: 1px solid #78a5e7;
  }
}

.button-left-class {
  margin-right: 5px;
  width: 170px;
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
}
/deep/.el-table th > .cell {
  text-align: center !important;
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
.button-left-class1 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class0 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class3 {
  margin-left: -10px;
  width: 140px;
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
/deep/.el-table th {
  padding: 6px 0;
}
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}
// /deep/.button-over[data-v-45cb37af] {
//   margin-right: 5px;
//   float: right;
//   margin-top: -38px;
// }
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
</style>
