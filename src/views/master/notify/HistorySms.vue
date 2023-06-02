<template>
  <div class="content">
    <div class="button-click-left">
      <el-select
        @change="getAllHistorySms('changeAgent')"
        v-model="dataSearch.idAgent"
        style="margin-right: 30px"
        class="button-left"
        placeholder="Chọn đại lý"
      >
        <el-option
          v-for="item in agentListSearch"
          :key="item.id"
          :label="item.agentName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        @change="getAllHistorySms()"
        v-model="dataSearch.idSchool"
        style="margin-right: 30px"
        class="button-left"
        placeholder="Chọn trường"
      >
        <el-option
          v-for="item in schoolOfAgentList"
          :key="item.id"
          :label="item.schoolName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        @change="getAllHistorySms()"
        v-model="dataSearch.appType"
        class="button-left"
        placeholder="Tất cả"
        clearable
      >
        <el-option
          v-for="item in appTypeList"
          :key="item.name"
          :label="item.value"
          :value="item.name"
        ></el-option>
      </el-select>
    </div>
    <div style="display: inline-block" class="block">
      <span class="demonstration">Từ ngày</span>
      <el-date-picker
        style="margin-left: 20px"
        v-model="dataSearch.fromTimeSend"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="Pick a day"
      ></el-date-picker>
    </div>
    <div
      style="
        display: inline-block;
        margin-left: 30px;
        margin-top: 20px;
        margin-bottom: 20px;
      "
      class="block"
    >
      <span class="demonstration">Đến ngày</span>
      <el-date-picker
        style="margin-left: 20px"
        value-format="yyyy-MM-dd"
        v-model="dataSearch.toTimeSend"
        type="date"
        placeholder="Pick a day"
      ></el-date-picker>
    </div>
    <el-button style="margin: 20px" type="success" round @click="getAllHistorySms()">
      Tìm kiếm
      <i class="el-icon-search"></i>
    </el-button>
    <div
      style="
        display: inline-block;
        margin-left: 30px;
        margin-top: 20px;
        margin-bottom: 20px;
      "
      class="block"
    >
      <span class="demonstration">Loại gửi</span>
      <el-select
        @change="getAllHistorySms()"
        style="margin-left: 20px"
        v-model="dataSearch.typeSend"
        class="button-left"
        placeholder="Chọn loại gửi"
      >
        <el-option
          v-for="item in typeSendList"
          :key="item.name"
          :label="item.value"
          :value="item.name"
        ></el-option>
      </el-select>
    </div>
    <div class="table-content row-data">
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :data="tableDataFilter"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createdBy"
          label="Người gửi"
          align="center"
        ></el-table-column>
        <el-table-column prop="createdDate" label="Thời gian gửi" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sendType"
          label="Kiểu gửi"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="totalSms"
          label="Tổng số Sms"
          align="center"
        ></el-table-column>
        <el-table-column prop="successNumber" label="Thành công" align="center">
          <template slot-scope="scope">
            {{ scope.row.successNumber }}(
            <el-button
              @click="createListReceiverSmsView(scope.$index, scope.row, 'Thành công')"
              type="text"
              >Xem</el-button
            >)
          </template>
        </el-table-column>
        <el-table-column prop="failureNumber" label="Thất bại" align="center">
          <template slot-scope="scope">
            {{ scope.row.failureNumber }}
            (
            <el-button
              @click="createListReceiverSmsView(scope.$index, scope.row, 'Thất bại')"
              type="text"
              >Xem</el-button
            >)
          </template>
        </el-table-column>
        <el-table-column prop="receiversNumber" label="Số người nhận" align="center">
          <template slot-scope="scope">
            {{ scope.row.receiversNumber }}
            (
            <el-button
              @click="createListReceiverSmsView(scope.$index, scope.row, 'SMS')"
              type="text"
              >Xem</el-button
            >)
          </template>
        </el-table-column>
        <el-table-column label="Nội dung tin" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >Xem nội dung</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pageList"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
      ></el-pagination>
    </div>
    <ListReceiverSms
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="ListReceiverSms"
    />
  </div>
</template>

<script>
import HistoryService from "../../../services/HistorySmsService";
import AgentService from "../../../services/AgentService";
// import SchoolService from "../../../services/SchoolService";
import ListReceiverSms from "../notify/ListReceiverSms";
export default {
  components: {
    ListReceiverSms,
  },
  data() {
    return {
      tableData: [],
      loadingData: true,
      layout: "sizes, prev, pager, next",
      total: 10,
      pageSize: 10,
      pageList: [2, 10, 20, 30, 40, 50],
      tableDataFilter: [],
      multipleSelection: [],
      schoolListSearch: [],
      agentListSearch: [],
      schoolOfAgentList: [],
      showTransferDialog: false,
      departmentData: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showListReceiver: false,
      showExportDialog: false,
      appTypeList: [
        {
          name: "teacher",
          value: "App Teacher gửi",
        },
        {
          name: "plus",
          value: "App Plus gửi",
        },
        {
          name: "onekids",
          value: "App Onekids gửi",
        },
      ],
      typeSendList: [
        {
          name: "autoSend",
          value: "Tự động gửi",
        },
        {
          name: "userSend",
          value: "Người dùng gửi",
        },
      ],
      historySmsList: [],
      dataSearch: {
        typeSend: "autoSend",
        idAgent: "",
        idSchool: "",
        appType: "",
        fromTimeSend: "",
        toTimeSend: "",
      },
    };
  },
  methods: {
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      setTimeout(() => {
        this.getAllHistorySms();
      }, 500);
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.getAllHistorySms();
    },
    dialogCloseListReceiverMethod() {
      this.showListReceiver = false;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      console.log(row);
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.tableDataFilter = this.historySmsList.slice(0, maxPageItem);
      this.pageSize = maxPageItem;
      this.total = this.historySmsList.length;
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      let number = this.pageSize;
      this.tableDataFilter = this.historySmsList.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
    },
    createListReceiverSmsView(index, row, status) {
      this.showCreateDialog = true;
      this.$refs.ListReceiverSms.getListReceiverSms(row.id, status);
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      console.log("edit " + index, row);
    },
    getAllHistorySms(checkSearch) {
      this.loadingData = true;
      this.getAllSchoolNoSearch(this.dataSearch.idAgent, checkSearch);
      HistoryService.getAllHistorySms(
        this.dataSearch.idSchool,
        this.dataSearch.appType,
        this.dataSearch.fromTimeSend,
        this.dataSearch.toTimeSend,
        this.dataSearch.typeSend
      )
        .then((response) => {
          this.historySmsList = response.data.data;
          this.tableDataFilter = this.historySmsList.slice(0, this.pageSize);
          this.total = this.historySmsList.length;
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          if (this.historySmsList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getAllAgent() {
      AgentService.getAll().then((res) => {
        this.agentListSearch = res.data.data.agentList;
        this.dataSearch.idAgent = this.agentListSearch[0].id;
        this.getAllSchool(this.dataSearch.idAgent);
      });
    },
    getAllSchool(idAgentSearch) {
      HistoryService.getAllSchool().then((res) => {
        this.schoolListSearch = res.data.data.schoolList;
        this.schoolOfAgentList = this.schoolListSearch.filter(
          (item) => item.agent.id == idAgentSearch
        );
        this.dataSearch.idSchool = this.schoolOfAgentList[0].id;
        if (this.dataSearch.idSchool != "") {
          this.getAllHistorySms();
        }
      });
    },
    getAllSchoolNoSearch(idAgentSearch, check) {
      let length = (this.schoolOfAgentList = this.schoolListSearch.filter(
        (item) => item.agent.id == idAgentSearch
      ));
      if (length != 0) {
        if (check == "changeAgent") {
          this.dataSearch.idSchool = this.schoolOfAgentList[0].id;
        }
      } else {
        this.dataSearch.idSchool = "";
      }
    },
  },
  beforeMount() {
    this.getAllHistorySms();
    this.getAllAgent();
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
  .button-click {
    text-align: right;
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
  /deep/.el-table td,
  /deep/.el-table th {
    padding: 6px 0;
  }
}
</style>
