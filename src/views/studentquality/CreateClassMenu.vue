<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Thêm thực đơn"
    >
      <el-form
        label-width="140px"
        label-position="left"
        :rules="rules"
        :model="createMultiClassMenu"
        ref="createTabAllClassMenu"
      >
        <el-tabs type="card" @tab-click="handleClick" v-model="activeNameTab">
          <el-tab-pane label="Thứ 2" name="monday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :data="
                  createMultiClassMenu.createTabAllClassMenu[0]
                    .createTabDayInWeek
                "
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
                :data="
                  createMultiClassMenu.createTabAllClassMenu[1]
                    .createTabDayInWeek
                "
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
                    <!-- <el-button
                      size="mini"
                      type="warning"
                      @click="addRowTableTuesday(scope.row.sessionDay)"
                    >Thêm</el-button> -->
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
                :data="
                  createMultiClassMenu.createTabAllClassMenu[2]
                    .createTabDayInWeek
                "
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
                    <!-- <el-button
                      size="mini"
                      type="warning"
                      @click="addRowTableWednesday(scope.row.sessionDay)"
                    >Thêm</el-button> -->
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
                :data="
                  createMultiClassMenu.createTabAllClassMenu[3]
                    .createTabDayInWeek
                "
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
                    <!-- <el-button
                      size="mini"
                      type="warning"
                      @click="addRowTableThursday(scope.row.sessionDay)"
                    >Thêm</el-button> -->
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
                :data="
                  createMultiClassMenu.createTabAllClassMenu[4]
                    .createTabDayInWeek
                "
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
                    <!-- <el-button
                      size="mini"
                      type="warning"
                      @click="addRowTableFriday(scope.row.sessionDay)"
                    >Thêm</el-button> -->
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
                :data="
                  createMultiClassMenu.createTabAllClassMenu[5]
                    .createTabDayInWeek
                "
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
                    <!-- <el-button
                      size="mini"
                      type="warning"
                      @click="addRowTableSaturday(scope.row.sessionDay)"
                    >Thêm</el-button> -->
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
          <el-tab-pane label="CN" name="sunday">
            <div class="table-content row-data">
              <el-table
                highlight-current-row
                :row-style="tableRowStyle"
                :header-cell-style="tableHeaderColor"
                :data="
                  createMultiClassMenu.createTabAllClassMenu[6]
                    .createTabDayInWeek
                "
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
                    <!-- <el-button
                      size="mini"
                      type="warning"
                      @click="addRowTableSunday(scope.row.sessionDay)"
                    >Thêm</el-button> -->
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteRow(scope.$index, 6)"
                      >Xóa</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div style="margin-top: 50px">
        <div class="button-click-left;" style="display: inline-block">
          <el-date-picker
            v-model="createTimeClassMenu"
            type="week"
            value-format="yyyy-MM-dd"
            format="Tuần WW(từ dd-MM-yyyy)"
            placeholder="Chọn tuần"
            :clearable="false"
            @change="getValueDateClassMenu(createTimeClassMenu)"
          ></el-date-picker>
          <el-select
            style="width: 400px; display: inline-block; margin-left: 5px"
            v-model="listCreateTimeClassMenu"
            multiple
            @change="changeWeek()"
            placeholder="Tuần đã chọn"
          ></el-select>
        </div>
        <div
          style="text-align: center; display: inline-block; margin-left: 200px"
        >
          <el-select
            v-model="createMultiClassMenu.listIdClass"
            class="button-left"
            placeholder="Chọn lớp"
            clearable="true"
            style="margin-right: 10px; width: 300px"
            multiple="true"
          >
            <el-option
              v-for="item in listClass"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="tab-infor-button">
        <el-button
          type="danger"
          size="medium"
          @click="closeDialogByButton('createTabAllClassMenu')"
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
          @click="submitForm('createTabAllClassMenu')"
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
import ClassMenuService from "@/services/ClassMenuService";
import moment from "moment";
import {mapActions, mapState} from "vuex";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      createTimeClassMenu: "",
      listTimeClassMenu: "",
      listCreateTimeClassMenu: [],
      activeNameTab: "monday",
      loadingButton: false,
      value: "",
      listClass: [
        // {id:4,className:"Chồi"},
        // {id:5,className:"Lá"},
        // {id:6,className:"MiMi"},
        // {id:7,className:"Takaka"}
      ],

      createMultiClassMenu: {
        createTabAllClassMenu: [
          {
            createTabDayInWeek: [
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
            createTabDayInWeek: [
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
            createTabDayInWeek: [
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
            createTabDayInWeek: [
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
                sessionDay: "PHụ Chiều",
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
            createTabDayInWeek: [
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
            createTabDayInWeek: [
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
            createTabDayInWeek: [
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
        weekClassMenu: [],
        listIdClass: "",
      },
    };
  },
  computed: {
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    checkPermission,
    deleteRow(index, day) {
      let a =
        this.createMultiClassMenu.createTabAllClassMenu[day].createTabDayInWeek[
          index
        ];
      a.contentClassMenu = "";
      a.timeContent = "";
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;border:1px solid #fff";
    },
    changeWeek() {
      let c = this.listCreateTimeClassMenu;
      this.createMultiClassMenu.weekClassMenu = [];
      c.forEach((element) => {
        {
          let date = element.slice(-11, -1);
          var newdate = date.split("-").reverse().join("-");
          this.createMultiClassMenu.weekClassMenu.push(newdate);
        }
      });
    },
    closeDialog() {
      this.$refs["createTabAllClassMenu"].resetFields();
      this.$emit("dialog-close");
      this.resetData();
    },
    //click when click button

    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
      this.resetData();
    },
    resetData() {
      this.activeNameTab = "monday";
      this.listCreateTimeClassMenu = [];
      this.createMultiClassMenu.listIdClass = "";
      this.createMultiClassMenu.createTabAllClassMenu.forEach((x) => {
        x.createTabDayInWeek.forEach((y) => {
          y.timeContent = "";
          y.contentClassMenu = "";
        });
      });
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
      let a = this.createMultiClassMenu;
      console.log(a);
      if (
        this.createMultiClassMenu.listIdClass.length > 0 &&
        this.createMultiClassMenu.weekClassMenu.length > 0
      ) {
        this.loadingButton = true;
        ClassMenuService.createMultiClassMenuForClass(this.createMultiClassMenu)
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
        this.$message({
          message: "Bạn phải chọn lớp và tuần áp dụng",
          type: "error",
        });
      }
    },
    getAllClass() {

          this.listClass = mapState(['serverDataClass']);

    },

    getValueDateClassMenu(createTimeClassMenu) {
      this.createTimeClassMenu = createTimeClassMenu;
      let a = this.createTimeClassMenu;
      let weeknumber = moment(a, "YYYY-MM-DD").isoWeek();
      let formatweek =
        "Tuần " + weeknumber + "(từ " + moment(a).format("DD-MM-YYYY") + ")";
      let indexOfFormatWeek = this.listCreateTimeClassMenu.indexOf(formatweek);
      if (indexOfFormatWeek == -1) {
        this.listCreateTimeClassMenu.push(formatweek);
      } else {
        this.listCreateTimeClassMenu.splice(indexOfFormatWeek, 0);
      }
      let indexOfCreateTimeClassMenu =
        this.createMultiClassMenu.weekClassMenu.indexOf(a);
      if (indexOfCreateTimeClassMenu == -1) {
        this.createMultiClassMenu.weekClassMenu.push(a);
      } else {
        this.createMultiClassMenu.weekClassMenu.splice(
          indexOfCreateTimeClassMenu,
          0
        );
      }
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
