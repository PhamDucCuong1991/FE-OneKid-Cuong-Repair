<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      title="Thực đơn tất cả các tuần trong năm"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
    >
      <el-form
        label-width="140px"
        label-position="left"
        :rules="rules"
        :model="tabClassMenuViewDetail"
        ref="createTabAllClassMenu"
      >
        <div class="table-content row-data">
          <el-table
            highlight-current-row
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :data="tabClassMenuViewDetail"
            @selection-change="handleSelectionChange"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              prop="weeknumber"
              label="Tuần"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="timeApplyWeek"
              label="Thời gian áp dụng"
              align="center"
            ></el-table-column>
            <el-table-column prop="approve" label="Duyệt" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="getAppTypeUserLogin != 'plus'"
                  v-if="
                    scope.row.listCheckContentday != null || scope.row.fileList != null
                  "
                  v-model="scope.row.approve"
                  @change="handleCheckBoxApprove(scope.$index, scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="listCheckContentday"
              label="Ngày có nội dung"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="contentClassMenu"
              label="Thực đơn dạng File,Ảnh"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.listFileOrPicture }}
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :auto-upload="false"
                  :on-change="handleChangeFile"
                  multiple
                  :limit="5"
                  :on-exceed="handleExceed"
                  :file-list="scope.row.fileList"
                  :on-preview="handleFileRequest"
                >
                  <!-- <el-button size="mini" type="primary">Tải lên</el-button>   -->
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column
              v-if="
                checkPermission(['studentQuality_menu_update']) &&
                getAppTypeUserLogin == 'plus'
              "
              label="Tác vụ"
              align="center"
              width="130"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEditViewDetail(scope.$index, scope.row, 2)"
                  >Sửa nội dung</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <div class="tab-infor-button">
        <el-button
          type="danger"
          size="medium"
          @click="closeDialogByButton('createTabAllClassMenu')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
      </div>
    </el-dialog>
    <UpdateClassMenu
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateClassMenu"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import UpdateClassMenu from "./UpdateClassMenu.vue";
import ClassMenuService from "@/services/ClassMenuService";
import moment from "moment";
export default {
  components: {
    UpdateClassMenu,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      idClass: "",
      createTimeClassMenu: "",
      listTimeClassMenu: "",
      listCreateTimeClassMenu: [],
      multipleSelection: [],
      activeNameTab: "monday",
      value: "",
      showUpdateDialog: false,
      listClass: [
        { id: 1, className: "Doraemon" },
        { id: 3, className: "Mầm" },
        // {id:4,className:"Chồi"},
        // {id:5,className:"Lá"},
        // {id:6,className:"MiMi"},
        // {id:7,className:"Takaka"}
      ],
      loadingButton: false,
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
                sessionDay: "Chiều",
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
                sessionDay: "Chiều",
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
                sessionDay: "Chiều",
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
                sessionDay: "Chiều",
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
                sessionDay: "Chiều",
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
                sessionDay: "Chiều",
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
                sessionDay: "Chiều",
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
      tabClassMenuViewDetail: [
        {
          weeknumber: "37",
          timeApplyWeek: "(29/06/2020-6/8/2020)",
          isApprove: true,
          listCheckContentday: "T2,T3,T4",
          listFileOrPicture: "chuongtrinhtoan.dox,anhdep.jpa",
          fileList: [
            {
              name: "food4.jpeg",
              url:
                "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
            },
            {
              name: "food3.jpeg",
              url:
                "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
            },
          ],
        },
      ],
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    checkPermission,
    handleRemove(file) {
      let a = file;
      console.log(a);
      ClassMenuService.deleteMenuFile(file.idUrlMenuFile)
        .then((res) => {
          console.log(res.data.data);
          this.$message({
            message: "Xóa file thực đơn thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Xóa file thực đơn thất bại",
            type: "error",
          });
        });
    },
    beforeRemove(file) {
      return this.$confirm(`Bạn có muốn xóa file ${file.name} ?`);
    },

    getTabClassMenuViewDetail(idClass) {
      this.idClass = idClass;
      ClassMenuService.searchClassMenuViewDetail(idClass)
        .then((res) => {
          let a = (this.tabClassMenuViewDetail = res.data.data);
          console.log(a);
        })
        .catch((err) => {
          console.log(err);
        });
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
      let a = this.createMultiClassMenu;
      console.log(a);
      if (
        this.createMultiClassMenu.listIdClass.length > 0 &&
        this.createMultiClassMenu.weekClassMenu.length > 0
      ) {
        ClassMenuService.createMultiClassMenuForClass(this.createMultiClassMenu)
          .then((response) => {
            console.log(response.data.data);
            this.$message({
              message: "Thêm mới thời khóa biểu thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton(fromData);
              location.reload();
            }, 500);
          })
          .catch((err) => {
            this.$message({
              message: "Thêm mới thời khóa biểu thất bại",
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
      let indexOfCreateTimeClassMenu = this.createMultiClassMenu.weekClassMenu.indexOf(a);
      if (indexOfCreateTimeClassMenu == -1) {
        this.createMultiClassMenu.weekClassMenu.push(a);
      } else {
        this.createMultiClassMenu.weekClassMenu.splice(indexOfCreateTimeClassMenu, 0);
      }
    },
    handleEditViewDetail(index, row, timeDay) {
      console.log(row);
      this.$refs.UpdateClassMenu.getClassMenuByIdClass(
        row.isMonday,
        row.idClass,
        timeDay
      );
      this.showUpdateDialog = true;
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties(
        this.timeClassMenu,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
      this.getTabClassMenuViewDetail(this.idClass);
    },
    handleCheckBoxApprove(index, row) {
      ClassMenuService.updateApprove(row)
        .then((res) => {
          console.log(res);
          if (row.approve) {
            this.$message({
              message: "Duyệt thực đơn thành công",
              type: "success",
            });
          } else {
            this.$message({
              message: "Hủy duyệt thực đơn thành công",
              type: "success",
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            message: "Duyệt thực đơn thất bại",
            type: "error",
          });
        })
        .finally(() => {
          this.getCurrentDate();
          this.getTabClassMenuViewDetail(this.idClass);
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
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
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
