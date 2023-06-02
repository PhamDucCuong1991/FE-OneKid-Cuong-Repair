<template>
  <VueFixedHeader
    @change="updateFixedStatus"
    :threshold="propsData.threshold"
    :headerClass="propsData.headerClass"
    :fixedClass="propsData.fixedClass"
    :hideScrollUp="propsData.hideScrollUp"
  >
    <div class="navbar">
      <div class="left-menu">
        <span style="float: left">
          <i
            v-if="getIsOpenCloseManu == false"
            @click="changeIsCollapse(true)"
            class="el-icon-s-fold"
          ></i>
          <i v-else @click="changeIsCollapse(false)" class="el-icon-s-unfold"></i>
        </span>

        <span>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-if="
                getAppTypeUserLogin == appType.SUPPER_SCHOOL ||
                getAppTypeUserLogin == appType.SCHOOL ||
                getAppTypeUserLogin == appType.TEACHER ||
                getAppTypeUserLogin == appType.PARENT
              "
              :to="{ path: '/' }"
              >Trang chủ</el-breadcrumb-item
            >
            <el-breadcrumb-item v-else :to="{ path: '/dashboard/admin' }"
              >Trang chủ</el-breadcrumb-item
            >
            <el-breadcrumb-item
              v-for="(item, index) in getBreadcrumbDataList"
              :key="index"
              :to="{ path: item.url }"
            >
              {{ item.name }}</el-breadcrumb-item
            >
          </el-breadcrumb>
        </span>
      </div>
      <div class="right-menu">
        <span
          v-if="
            getAppTypeUserLogin == appType.SUPPER_SCHOOL ||
            getAppTypeUserLogin == appType.SCHOOL ||
            getAppTypeUserLogin == appType.TEACHER ||
            getAppTypeUserLogin == appType.PARENT
          "
          class="school-name"
          >{{ getDataSchool.schoolName }}</span
        >
        <span class="fullname-login">{{ getUserLogin }}</span>
        <el-dropdown class="avatar-container" trigger="click" @command="handleDropdow">
          <div class="avatar-wrapper">
            <el-image
              style="width: 40px; height: 40px; line-height: 50px"
              class="user-avatar"
              :src="getAvatar"
              :fit="fit"
            ></el-image>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profileCommand">
              Cập nhật trang cá nhân
            </el-dropdown-item>
            <el-dropdown-item command="changePasswordCommand">
              Đổi mật khẩu
            </el-dropdown-item>
            <el-dropdown-item
              v-if="
                (getDataSchool != null &&
                  getDataSchool.manyStatus &&
                  getAppTypeUserLogin == appType.SUPPER_SCHOOL) ||
                getAppTypeUserLogin == appType.SCHOOL ||
                getAppTypeUserLogin == appType.TEACHER ||
                getAppTypeUserLogin == appType.PARENT
              "
              command="changeSchoolCommand"
            >
              <span v-if="getAppTypeUserLogin == appType.PARENT">Chọn con</span>
              <span v-else>Đổi trường</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span style="display: block" @click="logoutMethod()">Đăng xuất</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <ChangePassword
        :dialogVisible="showCreateDialog"
        @dialog-close="dialogCloseCreateMethod()"
      />
      <Profile
        :dialogVisible="showProfileDialog"
        @dialog-close="dialogCloseProfileMethod()"
        ref="Profile"
      />
      <ChangeSchool
        :dialogVisible="showChangeSchoolDialog"
        @dialog-close="dialogCloseChangeSchoolMethod()"
        ref="ChangeSchool"
      />
      <ChangeKidsDialog
        :dialogVisible="showChangeKidsDialog"
        @dialog-close="dialogCloseChangeKidsMethod()"
        ref="ChangeKidsDialog"
      />
    </div>
  </VueFixedHeader>
</template>

<script>
import VueFixedHeader from "vue-fixed-header";
import DeviceService from "@/services/DeviceService";
import ChangePassword from "@/views/login/ChangePassword.vue";
import Profile from "@/views/mauser/Profile.vue";
import ChangeSchool from "@/views/mauser/ChangeSchool.vue";
import ChangeKidsDialog from "@/views/mauser/ChangeKidsDialog.vue";

const createData = () => ({
  threshold: 0,
  headerClass: "vue-fixed-header",
  fixedClass: "vue-fixed-header--isFixed",
  hideScrollUp: false,
});
export default {
  components: {
    ChangePassword,
    Profile,
    ChangeSchool,
    ChangeKidsDialog,
    VueFixedHeader,
  },
  data() {
    return {
      fixedStatus: {
        headerIsFixed: false,
      },
      propsData: { ...createData() },
      formData: { ...createData() },
      openClose: "",
      showCreateDialog: false,
      showProfileDialog: false,
      showChangeSchoolDialog: false,
      showChangeKidsDialog: false,
      appType: {
        SUPPER_SYSTEM: "supperSys",
        SYSTEM: "sys",
        AGENT: "agent",
        SUPPER_SCHOOL: "supperPlus",
        SCHOOL: "plus",
        TEACHER: "teacher",
        PARENT: "parent",
      },
    };
  },

  computed: {
    getBreadcrumbDataList() {
      let breadcrumbSession = JSON.parse(sessionStorage.getItem("breadcrumbList"));
      let breadcrumbState = this.$store.getters["layout/getBreadcrumbList"];
      if (breadcrumbState.length == 0) {
        return breadcrumbSession;
      } else {
        return breadcrumbState;
      }
    },
    getIsOpenCloseManu() {
      return this.$store.getters["layout/getIsOpenClose"];
    },
    getUserLogin() {
      return this.$store.state.auth.user.currentUser;
    },
    getAvatar() {
      return this.$store.state.auth.user.avatar;
    },
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
    getDataSchool() {
      return this.$store.state.auth.user.schoolInfor;
    },
  },
  methods: {
    changeIsCollapse(data) {
      this.$store.dispatch("layout/setIsOpenCloseMenu", data);
    },
    async logoutMethod() {
      await this.logoutDeviceMethod();
      //gọi đến actions authenmodule.js login
      this.$store.dispatch("auth/logout");
      //quay về url /login
      this.$router.push("/login");
    },
    async logoutDeviceMethod() {
      let deviceData = { idDevice: "" };
      deviceData.idDevice = this.$browserDetect.meta.ua;
      await DeviceService.deviceLogout(deviceData)
        .then((resp) => {
          let data = resp.data.data;
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDropdow(command) {
      if (command == "profileCommand") {
        this.profileDialog();
      } else if (command == "changePasswordCommand") {
        this.changePasswordDialog();
      } else if (command == "changeSchoolCommand") {
        if (this.getAppTypeUserLogin == this.appType.PARENT) {
          this.changeKidsDialog();
        } else {
          this.changeSchoolDialog();
        }
      }
    },
    changePasswordDialog() {
      this.showCreateDialog = true;
      // this.$refs.CreateGrade.resetFormData();
    },
    profileDialog() {
      this.showProfileDialog = true;
      this.$refs.Profile.getInitialData();
    },
    changeSchoolDialog() {
      this.showChangeSchoolDialog = true;
      this.$refs.ChangeSchool.getChangeSchoolInitialData();
    },
    changeKidsDialog() {
      this.showChangeKidsDialog = true;
      this.$refs.ChangeKidsDialog.getChangeKidsInitialData();
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },
    dialogCloseProfileMethod() {
      this.showProfileDialog = false;
    },
    dialogCloseChangeSchoolMethod() {
      this.showChangeSchoolDialog = false;
    },
    dialogCloseChangeKidsMethod() {
      this.showChangeKidsDialog = false;
    },
    updateFixedStatus(next) {
      this.fixedStatus.headerIsFixed = next;
    },
    handleClickUpdate() {
      this.propsData = { ...this.formData };
    },
    handleClickCancel() {
      this.formData = { ...this.propsData };
    },
  },
};
</script>

<style lang="scss" scoped>
//--cuộn chuột
.navbar.vue-fixed-header--isFixed {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-74px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  i {
    font-size: 20px;
  }

  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .left-menu {
    display: inline-block;
    height: 100%;
    line-height: 50px;
    margin-left: 6px;
    .el-icon-s-fold {
      cursor: pointer;
      height: 100%;
      line-height: 50px;
    }
    .el-icon-s-unfold {
      cursor: pointer;
      height: 100%;
      line-height: 50px;
    }
  }
  .right-menu {
    float: right;
    .el-icon-search {
      margin-right: 15px;
      height: 100%;
      line-height: 50px;
      display: block;
      float: left;
    }
    .el-icon-message-solid {
      margin-right: 15px;
      height: 100%;
      line-height: 50px;
      display: block;
      float: left;
    }
    .avatar-container {
      // display: block;
      // float: left;
      margin-right: 15px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50px;
        }
      }
    }
    .year {
      line-height: 50px;
      height: 100%;
      margin-right: 10px;
      width: 115px;
      .el-dropdown-link {
        cursor: pointer;
        color: gray;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
  }
}
.router-link {
  text-decoration: none;
}
.fullname-login {
  float: right;
  margin-right: 15px;
  color: #1d04fdef;
  line-height: 50px;
}
.school-name {
  float: left;
  margin-right: 15px;
  color: #606266;
  line-height: 50px;
}
.el-breadcrumb {
  float: left;
  line-height: 50px;
  margin-left: 10px;
  font-size: 18px;
}
</style>
