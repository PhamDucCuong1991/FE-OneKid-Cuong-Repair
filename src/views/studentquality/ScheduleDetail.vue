<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :title="'Thời khóa biểu các tuần : ' + this.className"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
    >
      <el-form
        label-width="140px"
        label-position="left"
        :rules="rules"
        :model="tabSchduleViewDetail"
        ref="createTabAllSchedule"
      >
        <div class="table-content row-data">
          <el-table
            highlight-current-row
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :data="tabSchduleViewDetail"
            @selection-change="handleSelectionChange"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              prop="weeknumber"
              width="100px"
              label="Tuần"
              align="center"
              ><template slot-scope="scope" align="center">
                <span style="margin: 0 40%">{{ scope.row.weeknumber }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="timeApplyWeek"
              label="Thời gian áp dụng"
            ></el-table-column>
            <el-table-column prop="approve" label="Trạng thái duyệt">
              <template slot-scope="scope">
                <el-checkbox
                  v-if="
                    scope.row.listCheckContentday != null ||
                    scope.row.fileList != null
                  "
                  v-model="scope.row.approve"
                  @change="handleCheckBoxApprove(scope.$index, scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="listCheckContentday"
              label="Ngày có nội dung"
            ></el-table-column>
            <el-table-column prop="contentSchedule" label="TKB dạng File,Ảnh">
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
                  <!-- <el-button size="mini" type="primary">Tải lên</el-button> -->
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['studentQuality_schedule_update'])"
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
          @click="closeDialogByButton('createTabAllSchedule')"
        >
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
      </div>
    </el-dialog>
    <UpdateSchedule
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateSchedule"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import UpdateSchedule from "./UpdateSchedule.vue";
import ScheduleService from "@/services/ScheduleService";
import moment from "moment";
import http from "../../http-download";
export default {
  components: {
    UpdateSchedule,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      className: "",
      createTimeSchedule: "",
      listTimeSchedule: "",
      listCreateTimeSchedule: [],
      multipleSelection: [],
      activeNameTab: "monday",
      value: "",
      showUpdateDialog: false,
      listClass: [],
      loadingButton: false,
      createMultiSchedule: {
        createTabAllSchedule: [
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
          {
            createTabDayInWeek: [
              {
                sessionDay: "Sáng",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Chiều",
                timeContent: "",
                contentSchedule: "",
              },
              {
                sessionDay: "Tối",
                timeContent: "",
                contentSchedule: "",
              },
            ],
          },
        ],
        weekSchedule: [],
        listIdClass: "",
      },
      tabSchduleViewDetail: [
        // {
        //   weeknumber: "37",
        //   timeApplyWeek: "(29/06/2020-6/8/2020)",
        //   isApprove: true,
        //   listCheckContentday: "T2,T3,T4",
        //   listFileOrPicture: "chuongtrinhtoan.dox,anhdep.jpa",
        //   fileList: [
        //   ],
        // },
      ],
    };
  },
  methods: {
    checkPermission,
    myFunction() {
      document.getElementsByClassName("el-upload-list__item-name").click(); // Click on the checkbox
    },
    handleRemove(file) {
      let a = file;
      console.log(a);
      ScheduleService.deleteScheduleFile(file.idUrlScheduleFile)
        .then((res) => {
          console.log(res.data.data);
          this.$message({
            message: "Xóa file thời khóa biểu thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Xóa file thời khóa biểu thất bại",
            type: "error",
          });
        });
    },
    beforeRemove(file) {
      return this.$confirm(`Bạn có muốn xóa file ${file.name} ?`);
    },
    handleChangeFile(file, fileList) {
      let a = file;
      let b = fileList;
      console.log(a);
      console.log(b);
    },
    getTabScheduleViewDetail(idClass) {
      ScheduleService.searchScheduleViewDetail(idClass)
        .then((res) => {
          let a = (this.tabSchduleViewDetail = res.data.data);
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
      let c = this.listCreateTimeSchedule;
      this.createMultiSchedule.weekSchedule = [];
      c.forEach((element) => {
        {
          let date = element.slice(-11, -1);
          var newdate = date.split("-").reverse().join("-");
          this.createMultiSchedule.weekSchedule.push(newdate);
        }
      });
    },
    closeDialog() {
      this.$refs["createTabAllSchedule"].resetFields();
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
      let a = this.createMultiSchedule;
      console.log(a);
      if (
        this.createMultiSchedule.listIdClass.length > 0 &&
        this.createMultiSchedule.weekSchedule.length > 0
      ) {
        ScheduleService.createMultiScheduleForClass(this.createMultiSchedule)
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
    getValueDateSchedule(createTimeSchedule) {
      this.createTimeSchedule = createTimeSchedule;
      let a = this.createTimeSchedule;
      let weeknumber = moment(a, "YYYY-MM-DD").isoWeek();
      let formatweek =
        "Tuần " + weeknumber + "(từ " + moment(a).format("DD-MM-YYYY") + ")";
      let indexOfFormatWeek = this.listCreateTimeSchedule.indexOf(formatweek);
      if (indexOfFormatWeek == -1) {
        this.listCreateTimeSchedule.push(formatweek);
      } else {
        this.listCreateTimeSchedule.splice(indexOfFormatWeek, 0);
      }
      let indexOfCreateTimeSchedule =
        this.createMultiSchedule.weekSchedule.indexOf(a);
      if (indexOfCreateTimeSchedule == -1) {
        this.createMultiSchedule.weekSchedule.push(a);
      } else {
        this.createMultiSchedule.weekSchedule.splice(
          indexOfCreateTimeSchedule,
          0
        );
      }
    },
    handleEditViewDetail(index, row, timeDay) {
      console.log(row);
      this.$refs.UpdateSchedule.getScheduleInClassWeek(
        row.isMonday,
        row.idClass,
        timeDay
      );
      this.showUpdateDialog = true;
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties(
        this.timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
    handleCheckBoxApprove(index, row) {
      ScheduleService.updateApprove(row)
        .then((res) => {
          console.log(res);
          if (row.approve) {
            this.$message({
              message: "Duyệt thời khóa biểu thành công",
              type: "success",
            });
          } else {
            this.$message({
              message: "Hủy duyệt thời khóa biểu thành công",
              type: "success",
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            message: "Duyệt thời khóa biểu thất bại",
            type: "error",
          });
        })
        .finally(() => {
          this.getCurrentDate();
          this.searchByProperties(
            this.timeSchedule,
            this.dataSearch.idGrade,
            this.dataSearch.idClass
          );
        });
    },
    getClassName(className) {
      this.className = className;
    },
    handleFileRequest(file) {
      let a = file;
      console.log(a);
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlScheduleFile = file.idUrlScheduleFile;
      this.downloadItem(label, extensionFile, idUrlScheduleFile);
    },
    downloadItem(label, extensionFile, idUrlScheduleFile) {
      http
        .get(`/schedules/download2/${idUrlScheduleFile}`)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", label + "." + extensionFile);
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
