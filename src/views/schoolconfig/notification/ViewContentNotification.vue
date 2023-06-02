<template>
  <div class="content">
    <div style="margin-top: 5px; margin-bottom: 20px">
      <el-select
        class="button-click-left"
        clearable
        v-model="dataSearch.typeReceive"
        @change="searchHeaderMethod()"
        placeholder="Đối tượng"
      >
        <el-option
          v-for="item in typeReceiveList"
          :key="item.key"
          :value="item.key"
          :label="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="table-content row-data">
      <el-table
        :span-method="objectSpanMethod"
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
        <el-table-column label="Thời gian gửi" width="190"
          ><template slot-scope="scope">
            <el-span
              v-for="item in scope.row.notifyManageDateResponseList"
              :key="item.id"
              @click="changeDateNotify(item.id, scope.row)"
            >
              <span :class="item.status == true ? 'date-notify' : 'date-notify1'">
                <span v-if="item.hour != null">{{ item.hour }}h:</span
                ><span v-if="item.minute == 0">00</span>
                <span v-else>{{
                  item.minute > 10 ? item.minute : "0" + item.minute
                }}</span>
                <span v-if="item.day != null"> - ngày {{ item.day }}</span>
                <span v-if="item.day == null"> trong ngày</span>
                <span v-if="item.month != null"> - tháng {{ item.month }}</span>
                <span v-if="item.month == null && item.day != null"> trong tháng</span>
              </span>
              <br />
            </el-span> </template
        ></el-table-column>
        <el-table-column prop="typeReceive" label="Đối tượng" width="110" align="center"
          ><template slot-scope="scope">
            <span v-if="scope.row.typeReceive == 'teacher'">Giáo viên</span>
            <span v-else-if="scope.row.typeReceive == 'parent'">Phụ huynh</span>
            <span v-else-if="scope.row.typeReceive == 'plus'">Nhà trường</span>
          </template></el-table-column
        >
        <el-table-column prop="title" label="Tiêu đề" min-width="200"></el-table-column>
        <el-table-column
          prop="content"
          label="Nội dung"
          min-width="300"
        ></el-table-column>
        <el-table-column prop="note" label="Ghi chú"></el-table-column>
        <el-table-column
          fixed="right"
          prop="status"
          label="Trạng thái"
          width="90"
          align="center"
          ><template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.status"
              @change="getStatusNotification(scope.row)"
            ></el-checkbox> </template
        ></el-table-column>
        <el-table-column label="Tác vụ" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.row)"
              >Sửa</el-button
            >
            <!-- :disabled="
                scope.row.typeReceive == 'plus' &&
                (scope.row.type == 'fees' || scope.row.type == 'salary')
              " -->
            <el-button size="mini" type="primary" @click="handleCreate(scope.row)"
              >Thêm thời gian</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data" style="float: right; margin-bottom: 10px">
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
    <UpdateNotificationDialog
      :updateData="updateData"
      :dialogVisible="showDetailDialog"
      @dialog-close="dialogCloseDetailMethod()"
      ref="UpdateNotificationDialog"
    />
    <UpdateDateNotificationDialog
      :typeDate="typeDate"
      :dialogVisible="showDateDetailDialog"
      @dialog-close="dialogCloseDateDetailMethod()"
      ref="UpdateDateNotificationDialog"
    />
    <CreateDateNotificationDialog
      :dateNotify="dateNotify"
      :dialogVisible="showDateCreateDialog"
      @dialog-close="dialogCloseDateCreateMethod()"
      ref="CreateDateNotificationDialog"
    />
  </div>
</template>

<script>
import NotificationManageService from "@/services/NotificationManageService";
import UpdateNotificationDialog from "./UpdateNotificationDialog.vue";
import UpdateDateNotificationDialog from "./UpdateDateNotificationDialog.vue";
import CreateDateNotificationDialog from "./CreateDateNotificationDialog.vue";
export default {
  components: {
    UpdateNotificationDialog,
    UpdateDateNotificationDialog,
    CreateDateNotificationDialog,
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
        typeReceive: "",
      },
      typeReceiveList: [
        { key: "parent", value: "Phụ huynh" },
        { key: "teacher", value: "Giáo viên" },
        { key: "plus", value: "Nhà trường" },
      ],
      updateData: {
        id: "",
        title: "",
        content: "",
        type: "",
        typeReceive: "",
        status: "",
        note: "",
        month: "",
      },
      typeDate: {
        type: "",
        typeReceive: "",
      },
      showDetailDialog: false,
      showDateDetailDialog: false,
      showDateCreateDialog: false,
      dateNotify: "",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },

    objectSpanMethod({ row, rowIndex, columnIndex }) {
      if (row.type == "home" && (columnIndex === 1 || columnIndex === 7)) {
        if (rowIndex === 3) {
          return [6, 1];
        }
        if (rowIndex === 4) {
          return [5, 0];
        }
        if (rowIndex === 5) {
          return [4, 0];
        }
        if (rowIndex === 6) {
          return [3, 0];
        }
        if (rowIndex === 7) {
          return [2, 0];
        }
        if (rowIndex === 8) {
          return [1, 0];
        }
      }
    },

    dialogCloseDetailMethod() {
      this.showDetailDialog = false;
      this.searchByProperties();
    },
    dialogCloseDateDetailMethod() {
      this.showDateDetailDialog = false;
      this.searchByProperties();
    },
    dialogCloseDateCreateMethod() {
      this.showDateCreateDialog = false;
      this.searchByProperties();
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
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      NotificationManageService.searchNotification(
        this.dataSearch.typeReceive,
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
    //click edit at date notify
    changeDateNotify(id, row) {
      this.typeDate.type = row.type;
      this.typeDate.typeReceive = row.typeReceive;
      this.showDateDetailDialog = true;

      this.$refs.UpdateDateNotificationDialog.getDataInitial(id);
    },
    //click create at date notify
    handleCreate(row) {
      this.dateNotify = row;
      this.showDateCreateDialog = true;
    },
    //click edit at row
    handleEdit(row) {
      this.showDetailDialog = true;
      this.updateData.id = row.id;
      this.updateData.title = row.title;
      this.updateData.content = row.content;
      this.updateData.type = row.type;
      this.updateData.typeReceive = row.typeReceive;
      this.updateData.status = row.status;
      this.updateData.note = row.note;
      this.updateData.month = row.month;
    },
    /*
     * Trạng thái active
     */
    getStatusNotification(row) {
      let data = {
        id: row.id,
        status: row.status,
      };
      NotificationManageService.getStatusNotification(data)
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
