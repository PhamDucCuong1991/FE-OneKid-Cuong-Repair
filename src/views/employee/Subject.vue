<template>
  <div class="content">
    <div class="button-click row-data">
      <el-button class="button-over" type="success" @click="createGradeDialog()">
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
      <el-dropdown>
        <el-button class="button-over" type="success">
          Gửi tin
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu>
          <el-dropdown-item>Gửi qua App</el-dropdown-item>
          <el-dropdown-item>Gửi qua Email</el-dropdown-item>
          <el-dropdown-item>Gửi qua Sms</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="button-over" type="success">Xuất file excel</el-button>
    </div>
    <div class="table-content row-data">
      <el-table
        :data="tableDataFilter"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="STT" width="50" align="center"></el-table-column>
        <el-table-column prop="subjectName" sortable label="Tên Môn Học" align="center"></el-table-column>
        <el-table-column prop="subjectCode" label="Mã môn học" align="center"></el-table-column>
        <el-table-column prop="note" label="Mô tả" align="center"></el-table-column>
        <el-table-column width="140" label="Tác vụ" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">Sửa</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Xóa</el-button>
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
    <CreateSubject :dialogVisible="showCreateDialog" @dialog-close="showCreateDialog=false" />
    <UpdateSubject
      :dialogVisible="showUpdateDialog"
      :editSubject="updateSubject"
      @dialog-close="showUpdateDialog=false"
    />
  </div>
</template>

<script>
import SubjectDataService from "../../services/SubjectDataService";
import CreateSubject from "./CreateSubject.vue";
import UpdateSubject from "./UpdateSubject.vue";
export default {
  components: {
    CreateSubject,
    UpdateSubject,
  },
  data() {
    return {
      layout: "sizes, prev, pager, next",
      total: 10,
      pageSize: 10,
      currentPageNumber: 1,
      pageList: [2, 4, 20, 30, 40, 50],
      tableDataFilter: [],
      multipleSelection: [],
      subjectData: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      updateSubject: {
        id: "",
        subjectName: "",
        note: "",
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      console.log(row);
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.tableDataFilter = this.subjectData.slice(0, maxPageItem);
      this.pageSize = maxPageItem;
      this.total = this.subjectData.length;
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      let number = this.pageSize;
      this.currentPageNumber = pageNumber;
      this.tableDataFilter = this.subjectData.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      this.updateSubject.id = row.id;
      this.updateSubject.subjectName = row.subjectName;
      this.updateSubject.note = row.note;
      // console.log("edit " + index, row);
    },
    //click delete at row
    handleDelete(index, row) {
      // console.log("delete " + index, row);
      this.$confirm(
        "Bạn có chắc chắn muốn xóa môn học đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SubjectDataService.delete(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa môn học thành công",
              type: "success",
            });
            setTimeout(() => {
              location.reload();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa môn học thất bại",
              type: "error",
            });
          });
      });
    },
    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    createGradeDialog() {
      this.showCreateDialog = true;
    },
    getAllSubject() {
      SubjectDataService.getAll()
        .then((response) => {
          this.subjectData = response.data.data.subjectList;
          this.tableDataFilter = this.subjectData.slice(0, this.pageSize);
          console.log(response.data.data.subjectList);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  beforeMount() {
    this.getAllSubject();
    this.total = this.subjectData.length;
    // this.tableDataFilter=this.agent
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