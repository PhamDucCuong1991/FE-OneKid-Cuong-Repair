<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
    >
      <el-form
        label-width="140px"
        :model="tabClassMenuInWeekClass"
        label-position="left"
        :rules="rules"
        ref="formAllTabClassMenu"
      >
        <h2 style="margin-top: 10px; display: inline-block">Thực đơn Lớp</h2>
        <el-tabs type="card" @tab-click="handleClick" v-model="activeNameTab">
          <el-tab-pane label="Thứ 2" name="monday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabClassMenuInWeekClass[0].tabClassMenuDayClassList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentClassMenu"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      v-model="scope.row.contentClassMenu"
                      placeholder="Nhập thực đơn..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_menu_update'])"
                  label="Tác vụ"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 0)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 3" name="tuesday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabClassMenuInWeekClass[1].tabClassMenuDayClassList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentClassMenu"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      v-model="scope.row.contentClassMenu"
                      placeholder="Nhập thực đơn..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_menu_update'])"
                  label="Tác vụ"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 1)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 4" name="wednesday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabClassMenuInWeekClass[2].tabClassMenuDayClassList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentClassMenu"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      v-model="scope.row.contentClassMenu"
                      placeholder="Nhập thực đơn..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_menu_update'])"
                  label="Tác vụ"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 2)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 5" name="thursday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabClassMenuInWeekClass[3].tabClassMenuDayClassList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentClassMenu"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      v-model="scope.row.contentClassMenu"
                      placeholder="Nhập thực đơn..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_menu_update'])"
                  label="Tác vụ"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 3)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 6" name="friday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabClassMenuInWeekClass[4].tabClassMenuDayClassList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentClassMenu"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      v-model="scope.row.contentClassMenu"
                      placeholder="Nhập thực đơn..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_menu_update'])"
                  label="Tác vụ"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 4)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Thứ 7" name="saturday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="tabClassMenuInWeekClass[5].tabClassMenuDayClassList"
                :header-cell-style="tableHeaderColor"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column
                  prop="sessionDay"
                  label="Buổi"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="timeContent"
                  label="Thời gian"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.timeContent"
                      placeholder="Nhập thời gian..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contentClassMenu"
                  label="Nội dung"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      v-model="scope.row.contentClassMenu"
                      placeholder="Nhập thực đơn..."
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission(['studentQuality_menu_update'])"
                  label="Tác vụ"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 5)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div class="tab-infor-button">
        <el-button
          type="danger"
          size="medium"
          @click="closeDialogByButton('formAllTabClassMenu')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
        <el-button
          v-if="checkPermission(['studentQuality_menu_update'])"
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm('formAllTabClassMenu')"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import ClassMenuService from "../../services/ClassMenuService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",

      timeSchedule: "",
      tabDayInWeek: [],
      tabAllDayInWeek: [],
      tabClassMenuInWeekClass: [
        {
          tabClassMenuDayClassList: [
            {
              sessionDay: "Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Trưa",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Tối",
              timeContent: "",
              contentClassMenu: "",
            },
          ],
        },
        {
          tabClassMenuDayClassList: [
            {
              sessionDay: "Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Trưa",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Tối",
              timeContent: "",
              contentClassMenu: "",
            },
          ],
        },
        {
          tabClassMenuDayClassList: [
            {
              sessionDay: "Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Trưa",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Tối",
              timeContent: "",
              contentClassMenu: "",
            },
          ],
        },
        {
          tabClassMenuDayClassList: [
            {
              sessionDay: "Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Trưa",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Tối",
              timeContent: "",
              contentClassMenu: "",
            },
          ],
        },
        {
          tabClassMenuDayClassList: [
            {
              sessionDay: "Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Trưa",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Tối",
              timeContent: "",
              contentClassMenu: "",
            },
          ],
        },
        {
          tabClassMenuDayClassList: [
            {
              sessionDay: "Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Trưa",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Tối",
              timeContent: "",
              contentClassMenu: "",
            },
          ],
        },
        {
          tabClassMenuDayClassList: [
            {
              sessionDay: "Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Sáng",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Trưa",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Phụ Chiều",
              timeContent: "",
              contentClassMenu: "",
            },
            {
              sessionDay: "Tối",
              timeContent: "",
              contentClassMenu: "",
            },
          ],
        },
      ],
    };
  },
  methods: {
    checkPermission,
    deleteRow(index, day) {
      let a = this.tabClassMenuInWeekClass[day].tabClassMenuDayClassList[index];
      a.contentClassMenu = "";
      a.timeContent = "";
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    closeDialog() {
      this.$refs["formAllTabClassMenu"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    handleClose(done) {
      this.$confirm("Are you sure to close this dialog?")
        .then((_) => {
          console.log(_);
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    submitForm(fromData) {
      let a = this.tabClassMenuInWeekClass;
      console.log(a);
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          ClassMenuService.createClassMenuInClassInWeek(
            this.tabClassMenuInWeekClass
          )
            .then((response) => {
              console.log(response.data.data);
              this.$message({
                message: "Thêm mới thực đơn thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: "Thêm mới thực đơn thất bại",
                type: "error",
              });

              console.log(err);
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
    getClassMenuByIdClass(timeSchedule, idClass, timeDay) {
      let a = timeSchedule;
      this.timeSchedule = a;
      console.log(a);
      if (timeDay == 2) {
        this.activeNameTab = "monday";
      }
      if (timeDay == 3) {
        this.activeNameTab = "tuesday";
      }
      if (timeDay == 4) {
        this.activeNameTab = "wednesday";
      }
      if (timeDay == 5) {
        this.activeNameTab = "thursday";
      }
      if (timeDay == 6) {
        this.activeNameTab = "friday";
      }
      if (timeDay == 7) {
        this.activeNameTab = "saturday";
      }
      if (timeDay == 8) {
        this.activeNameTab = "sunday";
      }
      ClassMenuService.getClassMenuByIdClass(a, idClass)
        .then((res) => {
          let b = (this.tabClassMenuInWeekClass = res.data.data);
          console.log(b);
        })
        .catch((e) => {
          console.log(e);
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
/deep/.el-button--primary {
  width: 100%;
  background: #409eff;
}
/deep/.upload-demo {
  text-align: center;
  .el-upload {
    width: 100%;
  }
}
/deep/.el-avatar {
  display: inline;
  img {
    border-radius: 5px;
    width: 100%;
  }
}
/deep/.el-input.is-disabled .el-input__inner {
  text-align: center;
  color: #d13b93;
  font-weight: bold;
}
.el-select {
  display: block;
}

.tab-infor-button {
  text-align: right;
  margin-top: 20px;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.group-radio-status {
  margin: 0 50px;
  .kids-status {
    margin-bottom: 10px;
  }
}
// /deep/.el-tabs__nav {
//   background: #a0a19ce0;
// }
// /deep/.el-tabs__item {
//   color: white;
// }
// /deep/.el-tabs__item.is-active {
//   color: white;
//   background: #67c23a;
// }
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
.table-icon-1 {
  width: 30%;
  margin-left: 15%;
  display: inline-block;
}
.table-icon-2 {
  width: 30%;
  margin-right: 15%;
  float: right;
}
</style>
