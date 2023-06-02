<template>
  <el-dialog
    :title="'Xem chiều cao, cân nặng: ' + kidsHeightWeight.fullName"
    :visible.sync="dialogVisible"
    width="1100px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="Lịch sử cân đo" name="KidWeightDetail">
        <!-- table -->
        <div class="table-content row-data">
          <!-- can -->
          <el-table
            class="table-icon-1"
            :data="kidsWeightList"
            highlight-current-row
            :header-cell-style="tableHeaderColor"
            :height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              sortable
              label="Lần cân"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="weight"
              label="Cân nặng (kg)"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column sortable label="Ngày cân" width="110" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.timeWeight | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdBy"
              label="Người cân"
              align="left"
            ></el-table-column>
            <el-table-column
              v-if="checkPermission(['studentQuality_heightWeight_update'])"
              label="Tác vụ"
              width="70"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteWeight(scope.$index, scope.row)"
                  >Xóa</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- do -->
          <el-table
            class="table-icon-2"
            :data="kidsHeightList"
            highlight-current-row
            :header-cell-style="tableHeaderColor"
            :height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="Lần đo"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="height"
              label="Chiều cao (cm)"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column sortable label="Ngày đo" width="110" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.timeHeight | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdBy"
              label="Người đo"
              align="left"
            ></el-table-column>
            <el-table-column
              v-if="checkPermission(['studentQuality_heightWeight_update'])"
              label="Tác vụ"
              width="70"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteHeight(scope.$index, scope.row)"
                  >Xóa</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- -- -->
      </el-tab-pane>

      <el-tab-pane label="Bảng tiêu chuẩn" name="StandardBoard">
        <div class="table-content row-data">
          <!-- can -->
          <el-table
            class="table-icon-3"
            :data="Listdata"
            highlight-current-row
            :header-cell-style="tableHeaderColor"
            :height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              sortable
              label="STT"
              width="70"
              align="center"
            ></el-table-column>

            <el-table-column prop="yearOld" label="Độ tuổi" align="center">
            </el-table-column>

            <el-table-column prop="minW" label="Cân nặng cận dưới (kg)" align="center">
            </el-table-column>
            <el-table-column
              prop="mediumW"
              label="Cân nặng trung bình (kg)"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="maxW" label="Cân nặng cận trên (kg)" align="center">
            </el-table-column>
            <el-table-column prop="minH" label="Chiều cao cận dưới (cm)" align="center">
            </el-table-column>
            <el-table-column
              prop="mediumH"
              label="Chiều cao trung bình (cm)"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="maxH" label="Chiều cao cận trên (cm)" align="center">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import KidsHeightWeightService from "@/services/KidsHeightWeightService";

export default {
  props: {
    dialogVisible: null,
    // weightSampleList: null,
  },
  data() {
    return {
      id: "",
      activeName: "KidWeightDetail",
      kidsWeightList: [],
      kidsHeightList: [],
      Listdata: [],
      kidsHeightWeight: [],
    };
  },
  methods: {
    checkPermission,
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.tableDataFilter = this.studentList.slice(0, maxPageItem);
      this.pageSize = maxPageItem;
      this.pageTotal = this.studentList.length;
    },
    closeDialog() {
      this.$emit("dialog-close");
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      let number = this.pageSize;
      this.tableDataFilter = this.studentList.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
    },
    getDetailKidsMethod(id) {
      KidsHeightWeightService.getById(id).then((resp) => {
        let data = (this.kidsHeightWeight = resp.data.data);
        this.kidsWeightList = data.kidsWeightList;
        this.kidsHeightList = data.kidsHeightList;
      });
      KidsHeightWeightService.getHeightWeightSample(id)
        .then((resp) => {
          this.Listdata = resp.data.data;
        })
        .then((err) => {
          console.log(err);
        });
      let a = this.Listdata;
      console.log(a);
    },

    //click delete at row
    handleDeleteWeight(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa số đo cân nặng đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        KidsHeightWeightService.delete(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa số đo cân nặng thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialog();
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa số đo cân nặng thất bại",
              type: "error",
            });
          });
      });
    },

    handleDeleteHeight(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa số đo chiều cao đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        KidsHeightWeightService.delete1(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa số đo chiều cao thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialog();
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa số đo chiều cao thất bại",
              type: "error",
            });
          });
      });
    },

    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
/deep/.el-table th > .cell {
  text-align: center !important;
  word-break: break-word;
}
.table-icon-1 {
  width: 47%;
  display: inline-block;
}

.table-icon-2 {
  width: 47%;
  // margin-right: 20%;
  // width: 650px;
  float: right;
}
.table-icon-3 {
  width: 100%;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
.paging-click {
  float: right;
  margin-top: 5px;
}

/deep/.el-tabs__nav-scroll {
  float: left !important;
}
// /deep/.el-tabs__nav-wrap {
//   float: left;
// }

.table {
  border-collapse: collapse;
}
.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid #78a5e7;
  }
}
.content .row-data {
  margin-bottom: 20px;
}
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}
</style>
