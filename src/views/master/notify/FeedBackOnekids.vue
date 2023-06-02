<template>
  <div class="content">
    <div style="float: left" class="button-click-left">
      <!-- chọn đại lý -->
      <el-select
        class="button-left-class"
        v-model="dataSearch.idAgent"
        @change="changeAgentMethod()"
        placeholder="Chọn đại lý"
      >
        <el-option
          v-for="item in agentList"
          :key="item.id"
          :value="item.id"
          :label="item.agentName"
        ></el-option>
      </el-select>
      <!-- chọn trường -->
      <el-select
        class="button-left-class"
        filterable
        clearable
        v-model="dataSearch.idSchool"
        placeholder="Chọn trường"
        @change="searchHeaderMethod()"
      >
        <el-option
          v-for="item in schoolList"
          :key="item.id"
          :value="item.id"
          :label="item.schoolName"
        ></el-option>
      </el-select>
      <!-- trạng thái xóa -->
      <el-select
        class="button-left-class"
        v-model="dataSearch.deleteStatus"
        placeholder="Chọn trạng thái"
        @change="searchHeaderMethod()"
      >
        <el-option
          v-for="item in deleteList"
          :key="item.key"
          :value="item.key"
          :label="item.value"
        ></el-option>
      </el-select>
      <el-select
        style="width: 150px"
        @change="searchHeaderMethod()"
        v-model="dataSearch.accountType"
        placeholder="Chọn đối tượng"
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
    <div class="button-click row-data">
      <el-button
        @click="createFeedBackHiddenDialog"
        class="button-over"
        type="success"
      >
        <i class="el-icon-plus" />
        Tạo góp ý
      </el-button>
      <el-button
        @click="deleteMultiFeedBackById"
        class="button-over"
        type="success"
      >
        <i class="el-icon-delete" />
        Xóa tất cả
      </el-button>
    </div>
    <div style="margin-top: 20px" class="table-content row-data">
      <el-table
        :data="dataResponseList"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :default-sort="{ prop: 'createdDate', order: 'descending' }"
        :sort-chang="{ prop: 'createdBy', order: 'descending' }"
        highlight-current-row
        :cell-style="tableRowStyleDetail"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          width="140px"
          prop="createdDate"
          label="Thời gian"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          width="170px"
          prop="createdBy"
          label="Người góp ý"
        ></el-table-column>
        <el-table-column prop="hiddenStatus" label="Ẩn danh" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.hiddenStatus">Có</span>
            <span v-else>Không</span>
          </template>
        </el-table-column>

        <el-table-column
          width="200px"
          prop="feedbackTitle"
          label="Tiêu đề"
        ></el-table-column>
        <el-table-column
          min-width="300px"
          prop="feedbackContent"
          label="Nội dung"
        ></el-table-column>
        <el-table-column
          width="80px"
          prop="fileNumber"
          label="Số File"
          align="center"
        ></el-table-column>
        <el-table-column
          width="150px"
          prop="replyName"
          label="Người trả lời"
          align="center"
        ></el-table-column>
        <el-table-column label="Tình trạng" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.schoolUnread">Đã đọc</span>
            <span v-else>Chưa đọc</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          prop="schoolConfirmStatus"
          label="Trạng thái"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.schoolConfirmStatus">Đã xác nhận</span>
            <span v-else>Chưa xác nhận</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Tác vụ"
          width="160px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="viewFeedback(scope.row)"
              >Xem</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteFeedBackById(scope.row)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data">
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
    <FeedBackOnekidsDetail
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="FeedBackOnekidsDetail"
    />
    <CreateaFeedBackHidden
      :dialogVisible="showCreateFeedBackHiddenDialog"
      @dialog-close="dialogCloseFeedBackHidden()"
      ref="CreateaFeedBackHidden"
    />
  </div>
</template>

<script>
import FeedBackOneKidsService from "../../../services/FeedBackOneKidsService";
import AgentService from "../../../services/AgentService";
import SchoolService from "../../../services/SchoolService";
import FeedBackOnekidsDetail from "../notify/FeedBackOnekidsDetail";
import CreateaFeedBackHidden from "../notify/CreateaFeedBackHidden";
import http from "../../../http-download";
export default {
  components: {
    FeedBackOnekidsDetail,
    CreateaFeedBackHidden,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      dataResponseList: [],
      multipleSelection: [],
      schoolListSearch: [],
      agentListSearch: [],
      schoolOfAgentList: [],
      showTransferDialog: false,
      showCreateDialog: false,
      showUpdateDialog: false,
      showListReceiver: false,
      showExportDialog: false,
      filterValue: "",
      showCreateFeedBackHiddenDialog: false,
      deleteList: [
        { key: true, value: "Chưa xóa" },
        { key: false, value: "Đã xóa" },
      ],
      appTypeList: [
        {
          name: "parent",
          value: "Phụ huynh",
        },
        {
          name: "teacher",
          value: "Giáo viên",
        },
        {
          name: "sys",
          value: "Hệ thống",
        },
      ],

      feedBackOnekidsList: [],
      dataSearch: {
        deleteStatus: true,
        idAgent: "",
        idSchool: "",
        accountType: "",
      },
    };
  },
  methods: {
    tableRowStyleDetail({ row }) {
      if (!row.schoolUnread) {
        return "color: #409EFF";
      }
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      // location.reload();
      // setTimeout(() => {
      this.searchByProperties();
      // }, 500);
    },
    dialogCloseFeedBackHidden() {
      this.showCreateFeedBackHiddenDialog = false;
      // location.reload()
      // setTimeout(() => {
      this.searchByProperties();
      // }, 500);
      // this.$router.go("/master/notify/feedback-onekids");
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
      this.maxPageItem = maxPageItem;
      this.searchByProperties();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByProperties();
    },
    viewFeedback(row) {
      this.showCreateDialog = true;
      this.$refs.FeedBackOnekidsDetail.getFeedBackDetail(row.id);
    },
    createFeedBackHiddenDialog(index, row) {
      this.showCreateFeedBackHiddenDialog = true;
      this.$refs.CreateaFeedBackHidden.getAllSchool(this.dataSearch.idAgent);
      console.log(row);
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      console.log("edit " + index, row);
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      FeedBackOneKidsService.searchFeedBackOneKids(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.deleteStatus,
        this.dataSearch.idAgent,
        this.dataSearch.idSchool,
        this.dataSearch.accountType
      )
        .then((response) => {
          this.dataResponseList = response.data.data.dataList;
          this.pageTotal = response.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.dataResponseList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.dataResponseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    // getAllSchoolNoSearch(idAgentSearch, check) {
    //   let length = (this.schoolOfAgentList = this.schoolListSearch.filter(
    //     (item) => item.agent.id == idAgentSearch
    //   ));
    //   if (length != 0) {
    //     if (check == "changeAgent") {
    //       this.dataSearch.idSchool = this.schoolOfAgentList[0].id;
    //     }
    //   } else {
    //     this.dataSearch.idSchool = "";
    //   }
    // },
    deleteFeedBackById(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa góp ý không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FeedBackOneKidsService.deleteFeedBackById(row.id)
          .then(() => {
            this.$message({
              message: "Xóa góp ý thành công",
              type: "success",
            });
            this.searchByProperties();
          })
          .catch(() => {
            this.$message({
              message: "Xóa góp ý thất bại",
              type: "success",
            });
          });
      });
    },
    deleteMultiFeedBackById() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(
          "Bạn có chắc chắn muốn xóa tất cả góp ý đã chọn không?",
          "Thông báo!",
          {
            distinguishCancelAndClose: true,
            closeOnClickModal: false,
            confirmButtonText: "Có",
            cancelButtonText: "Không",
          }
        ).then(() => {
          let idList = this.multipleSelection.map((item) => item.id);
          // let a=this.multipleSelection;
          FeedBackOneKidsService.deleteMultiFeedBackById(idList)
            .then(() => {
              this.$message({
                message: "Xóa góp tất cả góp ý thành công",
                type: "success",
              });
              this.searchByProperties();
            })
            .catch(() => {
              this.$message({
                message: "Xóa tất cả góp ý thất bại",
                type: "error",
              });
            });
        });
      } else {
        this.$message({
          message: "Bạn chưa chọn góp ý nào",
          type: "error",
        });
      }
    },
    // handleFileRequest(file) {
    //   let a = file;
    //   console.log(a);
    //   let extensionFile = file.name.split(".").pop();
    //   let label = file.name;
    //   let idUrlFile = file.idUrlFile;

    //   this.downloadItem(label, extensionFile, idUrlFile);
    // },

    downloadItem(label, extensionFile, idUrlFile) {
      //   .catch(console.error)
      http
        .get(`/feedback-onekids/download/${idUrlFile}`)
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
            message: "Thất bại",
            type: "error",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * thay đổi đại lý
     */
    async changeAgentMethod() {
      await this.getSchoolMethod();
      this.searchHeaderMethod();
    },

    /**
     * danh sách đại lý
     */
    async getAgentMethod() {
      await AgentService.getAllCommon()
        .then((resp) => {
          this.agentList = resp.data.data;
          if (this.agentList.length > 0) {
            this.dataSearch.idAgent = this.agentList[0].id;
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
     * danh sách trường theo đại lý đã chọn
     */
    async getSchoolMethod() {
      await SchoolService.getSchoolInAgent(this.dataSearch.idAgent)
        .then((resp) => {
          this.schoolList = resp.data.data;
          this.dataSearch.idSchool = "";
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    /**
     * get data initial
     */
    async fetchDataMany() {
      await this.getAgentMethod();
      await Promise.all([this.getSchoolMethod()])
        .then((resp) => {
          console.log(resp);
          this.searchByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
  beforeMount() {
    this.fetchDataMany();
    // this.getAllAgent();
  },
};
</script>

<style lang="scss" scoped>
.button-left-class {
  margin-right: 5px;
  width: 140px;
}
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
