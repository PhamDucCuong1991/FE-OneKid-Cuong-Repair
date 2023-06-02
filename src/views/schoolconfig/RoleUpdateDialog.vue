<template>
  <el-dialog
    title="Cập nhật vai trò"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      label-width="100px"
      :model="roleData"
      label-position="left"
      :rules="rules"
      ref="roleData"
    >
      <el-form-item
        label="Tên vai trò"
        prop="roleName"
        style="display: inline-block; width: 45%"
      >
        <el-input
          :disabled="roleData.defaultStatus"
          v-model="roleData.roleName"
          placeholder="Nhập tên vai trò"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="description" style="float: right; width: 45%">
        <el-input v-model="roleData.description" placeholder="Nhập mô tả"></el-input>
      </el-form-item>
    </el-form>
    <el-table
      ref="tableRef1"
      highlight-current-row
      :data="responseList.filter((x) => x.level1 != 0 && x.level2 == 0 && x.level3 == 0)"
      :cell-style="tableRowStyle1"
      :header-cell-style="tableHeaderColor1"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="apiName" label="Tên quyền" width="250"></el-table-column>
      <el-table-column prop="apiDescription" label="Mô tả"></el-table-column>
      <el-table-column label="Sử dụng" width="200" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.used" @change="changeLevel1Method(scope.row)">
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Tác vụ" width="100" align="center">
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
          <!-- table 2 -->
          <el-table
            v-else
            default-expand-all
            ref="tableRef2"
            :data="
              responseList.filter(
                (x) => x.level1 == scope.row.level1 && x.level2 != 0 && x.level3 == 0
              )
            "
            :cell-style="tableRowStyle2"
            :header-cell-style="tableHeaderChidrenColor2"
            border
          >
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
            <el-table-column label="Sử dụng" width="200" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="
                    !responseList.filter(
                      (x) =>
                        x.level1 == scope.row.level1 && x.level2 == 0 && x.level3 == 0
                    )[0].used
                  "
                  v-model="scope.row.used"
                  @change="changeLevel2Method(scope.row)"
                >
                </el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="98" align="center"> </el-table-column>
            <el-table-column type="expand" width="1">
              <template slot-scope="scope">
                <span
                  v-if="
                    responseList.filter(
                      (x) =>
                        x.level1 == scope.row.level1 &&
                        x.level2 == scope.row.level2 &&
                        x.level3 != 0
                    ).length == 0
                  "
                ></span>
                <!-- table 3 -->
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
                  :cell-style="tableRowStyle3"
                  border
                >
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
                  <el-table-column label="Sử dụng" width="200" align="center">
                    <template slot-scope="scope">
                      <el-checkbox
                        :disabled="
                          !responseList.filter(
                            (x) =>
                              x.level1 == scope.row.level1 &&
                              x.level2 == scope.row.level2 &&
                              x.level3 == 0
                          )[0].used
                        "
                        v-model="scope.row.used"
                      >
                      </el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="Tác vụ" width="97" align="center">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('roleData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('roleData')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      roleData: {},
      responseList: [],
      loadingButton: false,
      rules: {
        roleName: [
          {
            required: true,
            message: "Tên quyền không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    tableHeaderColor1() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableHeaderChidrenColor2() {
      return "background-color: rgb(177 204 8);color: #606266;";
    },
    tableHeaderChidrenColor3() {
      return "background-color: #c0c4cc;color: #606266;";
    },
    tableRowStyle1({ row }) {
      if (row.expandRow) {
        return "font-weight: bold";
      }
    },
    tableRowStyle2() {
      return "color: #409EFF";
    },
    tableRowStyle3() {
      return "color: rgb(193 22 204)";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["roleData"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
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
    changeLevel1Method(row) {
      if (!row.used) {
        this.responseList
          .filter((x) => x.level1 == row.level1)
          .forEach((y) => {
            y.used = false;
          });
      }
    },
    changeLevel2Method(row) {
      if (!row.used) {
        this.responseList
          .filter(
            (x) => x.level1 == row.level1 && x.level2 == row.level2 && x.level3 != 0
          )
          .forEach((y) => {
            y.used = false;
          });
      }
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          let dataList = this.responseList.filter((x) => x.used);
          this.roleData.idApiList = dataList.map((x) => x.id);
          this.loadingButton = true;
          SchoolConfigService.upateRole(this.roleData)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getAllRoleInitial(row) {
      SchoolConfigService.findRole(row.id)
        .then((resp) => {
          this.roleData = resp.data.data;
          this.responseList = this.roleData.apiList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
  border: 1px solid #dcdfe6;
}
</style>
