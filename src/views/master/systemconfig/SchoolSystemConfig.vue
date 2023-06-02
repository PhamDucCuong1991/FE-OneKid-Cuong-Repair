<template>
  <div>
    <div>
      <div style="margin-bottom: 20px">
        <!-- chọn khối -->
        <el-select
          style="width: 200px; margin-right: 6px"
          v-model="dataSearch.idAgent"
          @change="findAllAppIconForSchool()"
          placeholder="Chọn đại lý"
          clearable
        >
          <el-option
            v-for="item in agentList"
            :key="item.id"
            :label="item.agentName"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-input
          style="width: 280px"
          placeholder="Nhập tên trường"
          clearable
          v-model="dataSearch.schoolName"
          @clear="findAllAppIconForSchool()"
          @keyup.enter.native="findAllAppIconForSchool()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="findAllAppIconForSchool()"
          ></el-button>
        </el-input>
      </div>

      <el-table
        ref="multipleTable"
        highlight-current-row
        :data="appIconForSchoolList"
        :cell-style="tableRowStyle"
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
        <el-table-column prop="schoolName" label="Tên trường"></el-table-column>
        <el-table-column prop="agent.agentName" label="Tên đại lý"></el-table-column>
        <el-table-column label="Tình trạng" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.schoolActive">Kích hoạt</span>
            <span v-else>Chưa kích hoạt</span>
          </template>
        </el-table-column>
        <el-table-column label="Notify Firebase" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="settingNotifyMethod(scope.row.id)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="Icon lock" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="settingIconLockMethod(scope.row.id)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="App OneKids" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="settingAppIconParent(scope.row.id)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="App Teacher" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="settingAppIconTeacher(scope.row.id)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="App Plus" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="settingAppIconPlus(scope.row.id)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="OneCam" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="oneCamConfigMethod(scope.row.id)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="School config" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="settingSchoolConfig(scope.row.id)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AttendanceSampleUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="AttendanceSampleUpdate"
    />
    <SchoolSystemIconParentDialog
      :dialogVisible="showIconParentDialog"
      @dialog-close="dialogCloseCreateIconParentMethod()"
      ref="SchoolSystemIconParentDialog"
    />
    <SchoolSystemIconTeacherDialog
      :dialogVisible="showIconTeacherDialog"
      @dialog-close="dialogCloseCreateIconTeacherMethod()"
      ref="SchoolSystemIconTeacherDialog"
    />
    <SchoolSystemIconPlusDialog
      :dialogVisible="showIconPlusDialog"
      @dialog-close="dialogCloseCreateIconPlusMethod()"
      ref="SchoolSystemIconPlusDialog"
    />
    <SchoolSystemConfigDialog
      :dialogVisible="showSchoolConfigDialog"
      @dialog-close="dialogCloseSchoolConfigMethod()"
      ref="SchoolSystemConfigDialog"
    />
    <NotifyFirebaseDialog
      :dialogVisible="showNotifyFirebaseDialog"
      @dialog-close="closesNotifyFirebaseDialogMethod()"
      ref="NotifyFirebaseDialog"
    />
    <IconLockDialog
      :dialogVisible="showIconLockDialog"
      @dialog-close="closesIconLockDialogMethod()"
      ref="IconLockDialog"
    />
    <OneCamConfigDialog
      :dialogVisible="showOneCamConfigDialog"
      @dialog-close="closesOneCamConfigDialogMethod()"
      ref="OneCamConfigDialog"
    />
  </div>
</template>

<script>
import SystemConfigService from "@/services/SystemConfigService";
import AgentService from "@/services/AgentService";

import AttendanceSampleUpdate from "./AttendanceSampleUpdate.vue";
import SchoolSystemIconParentDialog from "./SchoolSystemIconParentDialog.vue";
import SchoolSystemIconTeacherDialog from "./SchoolSystemIconTeacherDialog.vue";
import SchoolSystemIconPlusDialog from "./SchoolSystemIconPlusDialog.vue";
import SchoolSystemConfigDialog from "./SchoolSystemConfigDialog.vue";
import NotifyFirebaseDialog from "./NotifyFirebaseDialog.vue";
import IconLockDialog from "./IconLockDialog.vue";
import OneCamConfigDialog from "./OneCamConfigDialog.vue";

export default {
  components: {
    AttendanceSampleUpdate,
    SchoolSystemIconParentDialog,
    SchoolSystemIconTeacherDialog,
    SchoolSystemIconPlusDialog,
    SchoolSystemConfigDialog,
    NotifyFirebaseDialog,
    IconLockDialog,
    OneCamConfigDialog,
  },
  data() {
    return {
      activeTabName: "arriveTab",
      appIconForSchoolList: [],
      agentList: [],
      leaveDataList: [],
      wishDataList: [],
      loaddingButton: false,
      showUpdateDialog: false,
      showAddMediaDialog: false,
      showIconParentDialog: false,
      showIconTeacherDialog: false,
      showIconPlusDialog: false,
      showSchoolConfigDialog: false,
      showNotifyFirebaseDialog: false,
      showIconLockDialog: false,
      showOneCamConfigDialog: false,
      loaddingButtonClass: false,
      dataSearch: {
        idAgent: "",
        schoolName: "",
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (!row.schoolActive) {
        return "color: red";
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "wishTab") {
        this.findAllMediaMethod();
      }
    },
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.findAllAppIconForSchool();
    },
    dialogCloseAddMediaMethod() {
      this.showAddMediaDialog = false;
      this.findAllAppIconForSchool();
    },
    updateAttendanceSampleRow(row) {
      this.showUpdateDialog = true;
      this.$refs.AttendanceSampleUpdate.getAttendanceSampleUpdateInitial(row);
    },
    dialogCloseCreateIconParentMethod() {
      this.showIconParentDialog = false;
    },
    dialogCloseCreateIconTeacherMethod() {
      this.showIconTeacherDialog = false;
    },
    dialogCloseCreateIconPlusMethod() {
      this.showIconPlusDialog = false;
    },
    dialogCloseSchoolConfigMethod() {
      this.showSchoolConfigDialog = false;
    },
    closesNotifyFirebaseDialogMethod() {
      this.showNotifyFirebaseDialog = false;
    },
    closesIconLockDialogMethod() {
      this.showIconLockDialog = false;
    },
    closesOneCamConfigDialogMethod() {
      this.showOneCamConfigDialog = false;
    },

    /**
     * update icon parent
     */
    settingAppIconParent(id) {
      setTimeout(() => {
        this.showIconParentDialog = true;
      }, 100);

      this.$refs.SchoolSystemIconParentDialog.getDataInitial(id);
    },
    /**
     * update icon teacher
     */
    settingAppIconTeacher(id) {
      setTimeout(() => {
        this.showIconTeacherDialog = true;
      }, 100);

      this.$refs.SchoolSystemIconTeacherDialog.getDataInitial(id);
    },
    /**
     * update icon plus
     */
    settingAppIconPlus(id) {
      setTimeout(() => {
        this.showIconPlusDialog = true;
      }, 100);
      this.$refs.SchoolSystemIconPlusDialog.getDataInitial(id);
    },
    settingSchoolConfig(id) {
      setTimeout(() => {
        this.showSchoolConfigDialog = true;
      }, 100);
      this.$refs.SchoolSystemConfigDialog.getDataInitial(id);
    },
    settingNotifyMethod(id) {
      setTimeout(() => {
        this.showNotifyFirebaseDialog = true;
      }, 100);
      this.$refs.NotifyFirebaseDialog.getDataInitial(id);
    },
    settingIconLockMethod(id) {
      setTimeout(() => {
        this.showIconLockDialog = true;
      }, 100);
      this.$refs.IconLockDialog.getDataInitial(id);
    },
    oneCamConfigMethod(id) {
      setTimeout(() => {
        this.showOneCamConfigDialog = true;
      }, 100);
      this.$refs.OneCamConfigDialog.getDataInitial(id);
    },
    /**
     * xóa 1 mẫu điểm danh
     */
    deleteAttendanceSampleOneMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa mẫu điểm danh đã chọn?",
        "Xóa mẫu điểm danh",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SystemConfigService.deleteAttendanceSampleOne(row.id)
          .then((resp) => {
            let data = resp.data.data;
            console.log(data);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.findAllAppIconForSchool();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa thất bại",
              type: "error",
            });
          });
      });
    },

    /**
     * tìm kiếm tất cả các loại điểm danh đến và về
     */
    findAllAppIconForSchool() {
      SystemConfigService.findSchoolConfig(
        this.dataSearch.idAgent,
        this.dataSearch.schoolName
      )
        .then((resp) => {
          this.appIconForSchoolList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.appIconForSchoolList = null;
        });
    },
    // chon đại lý
    findAllAgentUnique() {
      AgentService.getAll()
        .then((resp) => {
          this.agentList = resp.data.data.agentList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  beforeMount() {
    this.findAllAgentUnique();
    this.findAllAppIconForSchool();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 10px 0;
}
/deep/.el-table .cell {
  line-height: 15px;
}
/deep/.el-table th > .cell {
  font-size: 13px;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
