<template>
  <div class="content">
    <div style="margin-top: 5px; margin-bottom: 20px">
      <!-- button left -->
      <div class="button-click-left">
        <el-input
          style="width: 280px"
          placeholder="Nhập tên tiêu đề"
          clearable
          v-model="dataSearch.titleSearch"
          @clear="searchHeaderMethod()"
          @keyup.enter.native="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="table-content row-data">
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="tableDataList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="Thời gian gửi" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="Tiêu đề"
          width="240"
        ></el-table-column>
        <el-table-column prop="content" label="Nội dung"></el-table-column>
        <el-table-column
          prop="fullName"
          label="Người nhận"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          label="Tác vụ"
          width="150"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="changeDetailNotify(scope.row.id)"
              >Chi tiết</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data" style="margin-bottom: 10px">
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
    <AppSendDetailNotification
      :dialogVisible="showDetailDialog"
      @dialog-close="dialogCloseDetailMethod()"
      ref="AppSendDetailNotification"
    />
  </div>
</template>

<script>
import NotificationManageService from "@/services/NotificationManageService";
import AppSendDetailNotification from "./AppSendDetailNotification.vue";
export default {
  components: {
    AppSendDetailNotification,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      tableDataList: [],
      dataSearch: {
        titleSearch: "",
      },
      showDetailDialog: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
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
    dialogCloseDetailMethod() {
      this.showDetailDialog = false;
      this.searchByProperties();
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      NotificationManageService.searchInternalPlus(
        this.dataSearch.titleSearch,
        this.pageNumber,
        this.maxPageItem
      )
        .then((resp) => {
          this.tableDataList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.tableDataList = [];
          console.log(err);
        })
        .finally(() => {
          if (this.tableDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    //click view at detail notify
    changeDetailNotify(id) {
      this.showDetailDialog = true;
      this.$refs.AppSendDetailNotification.getDataInitial(id);
    },
  },

  beforeMount() {
    this.searchByProperties();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-left {
    margin-right: 5px;
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
  // /deep/.el-table .cell {
  //   box-sizing: border-box;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: pre-line;
  //   word-break: break-all;
  //   line-height: 23px;
  //   padding-right: 10px;
  //   // max-height: 50px;
  //   text-overflow: ellipsis;
  // }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    // margin-left: 5px;
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
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.click-in-row {
  border: none;
  padding: 0;
  color: #3a3ace;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
.date-notify {
  cursor: pointer;
  color: blue;
}
.date-notify:hover {
  color: #67c23a;
}
.date-notify1 {
  cursor: pointer;
  color: red;
}
.date-notify1:hover {
  color: #67c23a;
}
</style>
