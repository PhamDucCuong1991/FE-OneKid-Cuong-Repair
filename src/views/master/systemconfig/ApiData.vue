<template>
  <div>
    <el-table
      ref="tableRef1"
      highlight-current-row
      :data="responseList.filter((x) => x.level1 != 0 && x.level2 == 0 && x.level3 == 0)"
      :cell-style="tableRowStyle1"
      :header-cell-style="tableHeaderColor1"
      :max-height="$tableMaxHeight"
      @selection-change="handleSelectionChange1"
      border
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="apiName" label="Tên quyền" width="250"></el-table-column>
      <el-table-column prop="apiDescription" label="Mô tả"></el-table-column>
      <el-table-column label="Tác vụ" width="170" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.expandRow"
            size="mini"
            type="primary"
            @click="toogleExpandDetailDate1(scope.row)"
            >Thu nhỏ</el-button
          >
          <el-button
            v-else
            type="primary"
            size="mini"
            @click="toogleExpandDetailDate1(scope.row)"
            >Mở rộng</el-button
          >
          <el-button type="success" size="mini" @click="updateApiMethod(scope.row)"
            >Sửa</el-button
          >
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="scope">
          <div
            style="text-align: center; color: orange"
            v-if="
              responseList.filter(
                (x) => x.level1 == scope.row.level1 && x.level2 != 0 && x.level3 == 0
              ).length == 0
            "
          >
            Không có
          </div>
          <el-table
            v-else
            ref="tableRef2"
            :data="
              responseList.filter(
                (x) => x.level1 == scope.row.level1 && x.level2 != 0 && x.level3 == 0
              )
            "
            :cell-style="tableRowStyle2"
            :header-cell-style="tableHeaderChidrenColor2"
            @selection-change="handleSelectionChange2"
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
              prop="apiName"
              label="Tên quyền"
              width="250"
            ></el-table-column>
            <el-table-column prop="apiDescription" label="Mô tả"></el-table-column>
            <el-table-column label="Tác vụ" width="170" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.expandRow1"
                  size="mini"
                  type="primary"
                  @click="toogleExpandDetailDate2(scope.row)"
                  >Thu nhỏ</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  @click="toogleExpandDetailDate2(scope.row)"
                  >Mở rộng</el-button
                >
                <el-button type="success" size="mini" @click="updateApiMethod(scope.row)"
                  >Sửa</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="expand" width="1">
              <template slot-scope="scope">
                <div
                  style="text-align: center; color: orange"
                  v-if="
                    responseList.filter(
                      (x) =>
                        x.level1 == scope.row.level1 &&
                        x.level2 == scope.row.level2 &&
                        x.level3 != 0
                    ).length == 0
                  "
                >
                  Không có
                </div>
                <el-table
                  v-else
                  ref="tableRef3"
                  :data="
                    responseList.filter(
                      (x) =>
                        x.level1 == scope.row.level1 &&
                        x.level2 == scope.row.level2 &&
                        x.level3 != 0
                    )
                  "
                  :header-cell-style="tableHeaderChidrenColor3"
                  @selection-change="handleSelectionChange3"
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
                    prop="apiName"
                    label="Tên quyền"
                    width="250"
                  ></el-table-column>
                  <el-table-column prop="apiDescription" label="Mô tả"></el-table-column>
                  <el-table-column label="Tác vụ" width="170" align="center">
                    <el-button
                      type="success"
                      size="mini"
                      @click="updateApiMethod(scope.row)"
                      >Sửa</el-button
                    >
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right; margin: 15px 0">
      <el-button class="button-bottom" type="success" @click="updateRanksMethod()"
        >Sắp xếp</el-button
      >
    </div>
    <ApiUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="closeUpdateDialogMethod()"
      ref="ApiUpdateDialog"
    />
  </div>
</template>
<script>
import SystemConfigService from "@/services/SystemConfigService";
import ApiUpdateDialog from "./ApiUpdateDialog";
export default {
  components: {
    ApiUpdateDialog,
  },
  data() {
    return {
      dataSearch: {
        type: "plus",
      },
      showUpdateDialog: false,
      multipleSelection: [],
      responseList: [],
    };
  },
  methods: {
    tableHeaderColor1() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableHeaderChidrenColor2() {
      return "background-color: rgb(116 191 172);color: #606266;";
    },
    tableHeaderChidrenColor3() {
      return "background-color: rgb(177 204 8);color: #606266;";
    },
    tableRowStyle1({ row }) {
      if (row.expandRow) {
        return "font-weight: bold";
      }
    },
    tableRowStyle2({ row }) {
      if (row.expandRow1) {
        return "font-weight: bold";
      }
    },
    handleSelectionChange1(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange2(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange3(val) {
      this.multipleSelection = val;
    },
    toogleExpandDetailDate1(row) {
      row.expandRow = !row.expandRow;
      let $tableRef1 = this.$refs.tableRef1;
      $tableRef1.toggleRowExpansion(row);
    },
    toogleExpandDetailDate2(row) {
      row.expandRow1 = !row.expandRow1;
      let $tableRef2 = this.$refs.tableRef2;
      $tableRef2.toggleRowExpansion(row);
    },
    closeUpdateDialogMethod() {
      this.showUpdateDialog = false;
      this.fetchData();
    },
    updateApiMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.ApiUpdateDialog.getDataInitial(row);
    },
    updateRanksMethod() {
      let selectRowList = this.multipleSelection;
      if (selectRowList.length != 2) {
        this.$message({
          message: "Chọn 2 quyền để thực hiện sắp xếp",
          type: "error",
        });
        return;
      }
      let dataInput = {
        id1: selectRowList[0].id,
        id2: selectRowList[1].id,
      };
      SystemConfigService.updateApiRanks(dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.fetchData();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    fetchData() {
      SystemConfigService.getApi(this.dataSearch.type)
        .then((resp) => {
          this.responseList = resp.data.data;
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
    this.fetchData();
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-table__expanded-cell {
  padding: 0px 0px;
}
/deep/.el-table th {
  padding: 6px 0;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
</style>
