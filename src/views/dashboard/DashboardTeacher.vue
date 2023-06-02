<template>
  <div>
    <el-row :gutter="50">
      <el-col :span="6" style="color: white"
        ><div class="grid-content bg-purple">
          <div class="content-line-1 color-1">
            <i class="el-icon-chat-line-square"></i>
            Số lời nhắn: {{ statisticalData.otherTotal.message }}
          </div>
        </div></el-col
      >
      <el-col :span="6" style="color: white"
        ><div class="grid-content bg-purple">
          <div class="content-line-1 color-2">
            <i class="el-icon-edit-outline"></i>
            Số dặn thuốc: {{ statisticalData.otherTotal.medicine }}
          </div>
        </div></el-col
      >
      <el-col :span="6" style="color: white"
        ><div class="grid-content bg-purple">
          <div class="content-line-1 color-3">
            <i class="el-icon-user-solid"></i>
            Số học sinh nghỉ học: {{ statisticalData.otherTotal.absent }}
          </div>
        </div></el-col
      >
      <el-col :span="6" style="color: white"
        ><div class="grid-content bg-purple">
          <div class="content-line-1 color-4">
            <i class="el-icon-document-remove"></i>
            Đơn xin nghỉ chưa duyệt:
            {{ statisticalData.otherTotal.absentLetterNoConfirm }}
          </div>
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="responseDataList"
          highlight-current-row
          :row-style="tableRowStyle"
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
          <el-table-column
            min-width="120px"
            prop="className"
            label="Lớp"
          ></el-table-column>
          <el-table-column
            min-width="110px"
            prop="gradeName"
            label="Khối"
          ></el-table-column>

          <el-table-column
            width="130px"
            prop="kidsTotalNumber"
            label="Tổng số HS"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attendanceYes"
            label="Đã điểm danh"
            min-width="130px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attendanceNo"
            label="Chưa điểm danh"
            min-width="130px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goSchoolNumber"
            label="Đi học"
            min-width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="absentNumber"
            label="Nghỉ học"
            min-width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="leaveYes"
            min-width="100px"
            label="Đã về"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="leaveNo"
            min-width="100px"
            label="Chưa về"
            align="center"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div style="text-align: center; margin-top: 150px">
      <img src="@/assets/images/onekids-logo.png" alt="1" />
    </div>
  </div>
</template>
<script>
import DashboardService from "@/services/DashboardService";
import CommonOnekidsService from "@/services/CommonOnekidsService";
export default {
  data() {
    return {
      tableDataFilter: [],
      statisticalData: {},
      responseDataList: [],
    };
  },
  created() {
    sessionStorage.removeItem("breadcrumbList");
    this.$store.dispatch("layout/setBreadcrumbActions", []);
    let appTypeUser = this.$store.state.auth.user.appType;
    // if (appTypeUser == "teacher") {
    //   this.$alert("Tính năng giành cho giáo viên đang được cập nhật", "Thông báo!", {
    //     confirmButtonText: "OK",
    //   });
    //   localStorage.removeItem("user");
    //   this.$router.push("/login");
    // }
    if (appTypeUser == "parent") {
      this.$alert("Tính năng giành cho Phụ huynh đang được cập nhật", "Thông báo!", {
        confirmButtonText: "OK",
      });
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    // set for hearder table
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      console.log(row);
    },
    getDataInitialInSchool() {
      DashboardService.getStatisticalInSchool()
        .then((resp) => {
          this.statisticalData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          // this.$message({
          //   message: err.response.data.message,
          //   type: "error",
          // });
        });
    },
    getDataInitialInClass() {
      DashboardService.getStatisticalInClass()
        .then((resp) => {
          this.responseDataList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          // this.$message({
          //   message: err.response.data.message,
          //   type: "error",
          // });
        });
    },
    getApiMethod() {
      CommonOnekidsService.getApiAgain()
        .then((resp) => {
          let user = JSON.parse(localStorage.getItem("user"));
          user.apiSet = resp.data.data;
          localStorage.setItem("user", JSON.stringify(user));
          this.$store.dispatch("auth/setUserActions", user);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getSchoolMethod() {
      CommonOnekidsService.getSchoolAgain()
        .then((resp) => {
          let user = JSON.parse(localStorage.getItem("user"));
          user.schoolInfor.schoolName = resp.data.data;
          localStorage.setItem("user", JSON.stringify(user));
          this.$store.dispatch("auth/setUserActions", user);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    fetchData() {
      //gọi lại api đăng nhập khi khác trường
      this.getDataInitialInSchool();
      this.getDataInitialInClass();
      this.getApiMethod();
      this.getSchoolMethod();
    },
  },
  beforeMount() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.class-flex {
  display: flex;
  flex-direction: row;
}
/deep/.el-table td {
  padding: 6px 0;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
    // .bg-over-1 {
    //   background: #7e96b9;
    // }
    // .bg-over-2 {
    //   background: #78a5e7;
    // }
    // .bg-over-3 {
    //   background: #83c45e;
    // }
    // .bg-over-4 {
    //   background: #cc92b2;
    // }
    .grid-content-over {
      font-size: 17px;
      border-radius: 10px;
      height: 150px;
      color: white;
    }
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
}
.content-line {
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 5px;
}
.content-line-1 {
  padding: 6px;
  margin-bottom: 5px;
  border-radius: 5px;
}
.color-1 {
  background: #c694f9;
}
.color-2 {
  background: #6aa5e3;
}
.color-3 {
  background: #feb683;
}
.color-4 {
  background: #ef5b5b;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-pagination {
  text-align: right;
  margin: 30px 0;
}
/deep/.el-pagination .el-select .el-input {
  width: 50px;
}
</style>
