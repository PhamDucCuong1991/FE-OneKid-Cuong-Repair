<template>
  <div class="menu-main">
    <!-- manu dành cho nhà trường -->
    <el-menu
        v-if="
        getAppTypeUserLogin == appType.SUPPER_SCHOOL ||
        getAppTypeUserLogin == appType.SCHOOL ||
        getAppTypeUserLogin == appType.TEACHER ||
        getAppTypeUserLogin == appType.PARENT
      "
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="getIsOpenCloseManu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :unique-opened="true"
    >
      <router-link to="/" class="router-link">
        <el-menu-item index="98">
          <i class="el-icon-s-home"></i>
          <span
              slot="title"
              class="onekids-title"
              v-if="getAppTypeUserLogin == appType.SCHOOL"
          >ONEKIDS PLUS</span
          >
          <span
              slot="title"
              class="onekids-title"
              v-if="getAppTypeUserLogin == appType.TEACHER"
          >ONEKIDS TEACHER</span
          >
          <span
              slot="title"
              class="onekids-title"
              v-if="getAppTypeUserLogin == appType.PARENT"
          >ONEKIDS PARENT</span
          >
          <span
              slot="title"
              class="onekids-title"
              v-if="getAppTypeUserLogin == appType.SUPPER_SCHOOL"
          >SUPPER PLUS</span
          >
        </el-menu-item>
      </router-link>

      <el-submenu
          index="1"
          v-if="getAppTypeUserLogin != appType.SUPPER_SCHOOL && checkPermission(['news'])"
      >
        <template slot="title">
          <i class="el-icon-notebook-2"/>
          <span>Bảng tin</span>
        </template>
        <router-link
            v-if="checkPermission(['news_notifySystem'])"
            to="/appsend/notification"
            class="router-link"
        >
          <el-menu-item
              index="1-1"
              @click="changeBreadcrumbMethod('appsend-notification')"
          >Thông báo hệ thống
          </el-menu-item
          >
        </router-link>
        <router-link to="/notifihis/notify-school" class="router-link">
          <el-menu-item
              index="10-5"
              @click="changeBreadcrumbMethod('notifihis-notify-school')"
          >Tin tức nhà trường
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['news_feedbackParent'])"
            to="/appsend/parent-feedback"
            class="router-link"
        >
          <el-menu-item
              index="1-2"
              @click="changeBreadcrumbMethod('appsend-parent-feedback')"
          >Phụ huynh góp ý
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['news_feedbackTeacher'])"
            to="/appsend/teacher-feedback"
            class="router-link"
        >
          <el-menu-item
              index="1-3"
              @click="changeBreadcrumbMethod('appsend-teacher-feedback')"
          >Giáo viên góp ý
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="2"
          v-if="
          getAppTypeUserLogin != appType.SUPPER_SCHOOL && checkPermission(['parentDiary'])
        "
      >
        <template slot="title">
          <i class="el-icon-reading"/>
          <span>Nhật ký phụ huynh</span>
        </template>
        <router-link
            v-if="checkPermission(['parentDiary_message'])"
            to="/parentdiary/message-parent"
            class="router-link"
        >
          <el-menu-item
              index="2-1"
              @click="changeBreadcrumbMethod('parentdiary-message-parent')"
          >Lời nhắn
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['parentDiary_medicine'])"
            to="/parentdiary/medicine"
            class="router-link"
        >
          <el-menu-item
              index="2-2"
              @click="changeBreadcrumbMethod('parentdiary-medicine')"
          >Dặn thuốc
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['parentDiary_absenLetter'])"
            to="/parentdiary/take-leave"
            class="router-link"
        >
          <el-menu-item
              index="2-3"
              @click="changeBreadcrumbMethod('parentdiary-take-leave')"
          >Xin nghỉ
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu v-if="checkPermission(['infoEmployee'])" index="3">
        <template slot="title">
          <i class="el-icon-user"/>
          <span>Quản lý nhân sự</span>
        </template>
        <router-link
            to="/employee/department"
            class="router-link"
            v-if="
            getAppTypeUserLogin != appType.SUPPER_SCHOOL &&
            checkPermission(['infoEmployee_department'])
          "
        >
          <el-menu-item index="3-1" @click="changeBreadcrumbMethod('employee-department')"
          >Danh sách phòng ban
          </el-menu-item
          >
        </router-link>
        <router-link
            to="/employee/employees"
            class="router-link"
            v-if="
            getAppTypeUserLogin != appType.SUPPER_SCHOOL &&
            checkPermission(['infoEmployee_list'])
          "
        >
          <el-menu-item index="3-2" @click="changeBreadcrumbMethod('employee-employees')"
          >Danh sách nhân sự
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="4"
          v-if="getAppTypeUserLogin != appType.SUPPER_SCHOOL && checkPermission(['kids'])"
      >
        <template slot="title">
          <i class="el-icon-user-solid"/>
          <span>Quản lý học sinh</span>
        </template>
        <router-link
            v-if="checkPermission(['kids_grade'])"
            to="/student/grade"
            class="router-link"
        >
          <el-menu-item index="4-1" @click="changeBreadcrumbMethod('student-grade')"
          >Danh sách khối
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['kids_class'])"
            @click="getBreadList('classList')"
            to="/student/class"
            class="router-link"
        >
          <el-menu-item index="4-2" @click="changeBreadcrumbMethod('student-class')"
          >Danh sách lớp
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['kids_list'])"
            to="/student/students"
            class="router-link"
        >
          <el-menu-item index="4-3" @click="changeBreadcrumbMethod('student-students')"
          >Danh sách học sinh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['kids_group'])"
            to="/student/students-group"
            class="router-link"
        >
          <el-menu-item
              index="4-4"
              @click="changeBreadcrumbMethod('student-students-group')"
          >Nhóm học sinh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['kids_transfer'])"
            to="/student/students-transfer"
            class="router-link"
        >
          <el-menu-item index="4-4-1" @click="changeBreadcrumbMethod('student-students-transfer')"
          >Thông tin mở rộng
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="5"
          v-if="
          getAppTypeUserLogin != appType.SUPPER_SCHOOL &&
          checkPermission(['studentQuality'])
        "
      >
        <template slot="title">
          <i class="el-icon-document-checked"/>
          <span>Chất lượng học sinh</span>
        </template>
        <router-link
            v-if="checkPermission(['studentQuality_attendance'])"
            to="/student-quality/attendance"
            class="router-link"
        >
          <el-menu-item
              index="5-1"
              @click="changeBreadcrumbMethod('student-quality-attendance')"
          >Điểm danh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['studentQuality_evaluate'])"
            to="/student-quality/evaluate"
            class="router-link"
        >
          <el-menu-item
              index="5-2"
              @click="changeBreadcrumbMethod('student-quality-evaluate')"
          >Nhận xét
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['studentQuality_ablum'])"
            to="/student-quality/album"
            class="router-link"
        >
          <el-menu-item
              index="5-3"
              @click="changeBreadcrumbMethod('student-quality-album')"
          >Album ảnh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['studentQuality_heightWeight'])"
            to="/student-quality/height-weight"
            class="router-link"
        >
          <el-menu-item
              index="5-4"
              @click="changeBreadcrumbMethod('student-quality-height-weight')"
          >Chiều cao, cân nặng
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['studentQuality_schedule'])"
            to="/student-quality/schedule"
            class="router-link"
        >
          <el-menu-item
              index="5-5"
              @click="changeBreadcrumbMethod('student-quality-schedule')"
          >Thời khóa biểu
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['studentQuality_menu'])"
            to="/student-quality/class-menu"
            class="router-link"
        >
          <el-menu-item
              index="5-6"
              @click="changeBreadcrumbMethod('student-quality-class-menu')"
          >Thực đơn
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="6"
          v-if="getAppTypeUserLogin != appType.SUPPER_SCHOOL && checkPermission(['fees'])"
      >
        <template slot="title">
          <i class="el-icon-money"/>
          <span>Học phí &amp; dịch vụ </span>
        </template>

        <router-link
            v-if="checkPermission(['fees_order'])"
            to="/finace/fees/order"
            class="router-link"
        >
          <el-menu-item index="6-1" @click="changeBreadcrumbMethod('finace-fees-order')"
          >Thu học phí
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['fees_approved_advance'])"
            to="/finace/fees/approved/advance"
            class="router-link"
        >
          <el-menu-item
              index="6-6"
              @click="changeBreadcrumbMethod('finace-fees-approved-advance')"
          >Duyệt nâng cao
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['fees_approved'])"
            to="/finace/fees/approved"
            class="router-link"
        >
          <el-menu-item
              index="6-2"
              @click="changeBreadcrumbMethod('finace-fees-approved')"
          >Duyệt học phí
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['fees_kidsPackage'])"
            to="/finace/fees/package-kids"
            class="router-link"
        >
          <el-menu-item
              index="6-3"
              @click="changeBreadcrumbMethod('finace-fees-package-kids')"
          >Đăng ký khoản
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['fees_package'])"
            to="/finace/fees/package"
            class="router-link"
        >
          <el-menu-item index="6-4" @click="changeBreadcrumbMethod('finace-fees-package')"
          >Danh sách khoản
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['fees_wallet'])"
            to="/finace/fees/wallet"
            class="router-link"
        >
          <el-menu-item index="6-5" @click="changeBreadcrumbMethod('finace-fees-wallet')"
          >Quản lý ví
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu
          index="7"
          v-if="getAppTypeUserLogin != appType.SUPPER_SCHOOL && checkPermission(['salary'])"
      >
        <template slot="title">
          <i class="el-icon-coin"/>
          <span> Công lương </span>
        </template>

        <router-link
            v-if="checkPermission(['salary_order'])"
            to="/finace/salary/paid"
            class="router-link"
        >
          <el-menu-item index="7-3" @click="changeBreadcrumbMethod('finace-salary-paid')"
          >Thanh toán lương
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['salary_approved'])"
            to="/finace/salary/approved"
            class="router-link"
        >
          <el-menu-item
              index="7-4"
              @click="changeBreadcrumbMethod('finace-salary-approved')"
          >Duyệt bảng lương
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['salary_setting'])"
            to="/finace/salary/institute"
            class="router-link"
        >
          <el-menu-item
              index="7-5"
              @click="changeBreadcrumbMethod('finace-salary-institute')"
          >Thiết lập tiền lương
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['salary_sample'])"
            to="/finace/salary/sample"
            class="router-link"
        >
          <el-menu-item
              index="7-6"
              @click="changeBreadcrumbMethod('finace-salary-sample')"
          >Mẫu công lương
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu
          index="13"
          v-if="
          getAppTypeUserLogin != appType.SUPPER_SCHOOL &&
          checkPermission(['attendanceEmployee'])
        "
      >
        <template slot="title">
          <i class="el-icon-document-checked"/>
          <span>Chấm công</span>
        </template>
        <router-link
            v-if="checkPermission(['attendanceEmployee_absentTeacher'])"
            to="/finace/salary/absent"
            class="router-link"
        >
          <el-menu-item
              index="13-3"
              @click="changeBreadcrumbMethod('finace-salary-absent')"
          >Xin nghỉ nhân sự
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['attendanceEmployee_attendance'])"
            to="/finace/salary/attendance"
            class="router-link"
        >
          <el-menu-item
              index="13-1"
              @click="changeBreadcrumbMethod('finace-salary-attendance')"
          >Chấm công nhân viên
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['attendanceEmployee_config'])"
            to="/finace/salary/attendance-config"
            class="router-link"
        >
          <el-menu-item
              index="13-2"
              @click="changeBreadcrumbMethod('finace-salary-attendance-config')"
          >Thiết lập chấm công
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu
          index="8"
          v-if="
          getAppTypeUserLogin != appType.SUPPER_SCHOOL &&
          checkPermission(['cashInternal'])
        "
      >
        <template slot="title">
          <i class="el-icon-suitcase-1"/>
          <span
          ><el-button type="text" style="color: rgb(191, 203, 217)"
          >Thu chi nội bộ</el-button
          ></span
          >
        </template>

        <router-link
            v-if="checkPermission(['cashInternal_out'])"
            to="/finace/cashinternal/paymoney"
            class="router-link"
        >
          <el-menu-item
              index="8-1"
              @click="changeBreadcrumbMethod('finace-cashinternal-paymoney')"
          >Quản lý phiếu chi
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['cashInternal_in'])"
            to="/finace/cashinternal/collectmoney"
            class="router-link"
        >
          <el-menu-item
              index="8-2"
              @click="changeBreadcrumbMethod('finace-cashinternal-collectmoney')"
          >Quản lý phiếu thu
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['cashInternal_cashbook'])"
            to="/finace/cashinternal/cashbook"
            class="router-link"
        >
          <el-menu-item
              index="8-3"
              @click="changeBreadcrumbMethod('finace-cashinternal-cashbook')"
          >Quản lý quỹ
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['cashInternal_people'])"
            to="/finace/cashinternal/peopletype"
            class="router-link"
        >
          <el-menu-item
              index="8-4"
              @click="changeBreadcrumbMethod('finace-cashinternal-peopletype')"
          >Danh sách đối tượng
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['cashInternal_bank'])"
            to="/finace/cashinternal/bankinfo"
            class="router-link"
        >
          <el-menu-item
              index="8-5"
              @click="changeBreadcrumbMethod('finace-cashinternal-bankinfo')"
          >Thông tin thanh toán
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu
          index="22"
          v-if="getAppTypeUserLogin == appType.SCHOOL && checkPermission(['statistical'])"
      >
        <template slot="title">
          <i class="el-icon-s-data"/>
          <span>Thống kê</span>
        </template>
        <el-submenu index="22-1" v-if="checkPermission(['statistical_kids'])">
          <template slot="title">Học sinh</template>
          <router-link to="/chart/statistical/chart-status" class="router-link">
            <el-menu-item
                index="22-1-1"
                v-if="checkPermission(['statistical_kids_status'])"
                @click="changeBreadcrumbMethod('chart-statistical-status')"
            >Trạng thái
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/attendance" class="router-link">
            <el-menu-item
                index="22-1-2"
                v-if="checkPermission(['statistical_kids_attendance'])"
                @click="changeBreadcrumbMethod('chart-statistical-attendance')"
            >Điểm danh
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/evaluate" class="router-link">
            <el-menu-item
                index="22-1-3"
                v-if="checkPermission(['statistical_kids_evaluate'])"
                @click="changeBreadcrumbMethod('chart-statistical-evaluate')"
            >Nhận xét
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/album" class="router-link">
            <el-menu-item
                index="22-1-4"
                v-if="checkPermission(['statistical_kids_album'])"
                @click="changeBreadcrumbMethod('chart-statistical-album')"
            >Album ảnh
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/fees" class="router-link">
            <el-menu-item
                index="22-1-5"
                v-if="checkPermission(['statistical_kids_fees'])"
                @click="changeBreadcrumbMethod('chart-statistical-fees')"
            >Học phí
            </el-menu-item
            >
          </router-link>
        </el-submenu>
        <el-submenu index="22-2" v-if="checkPermission(['statistical_employee'])">
          <template slot="title">Nhân sự</template>
          <router-link to="/chart/statistical/chart-status-employee" class="router-link">
            <el-menu-item
                index="22-2-1"
                v-if="checkPermission(['statistical_employee_status'])"
                @click="changeBreadcrumbMethod('chart-statistical-status-employee')"
            >Trạng thái
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/attendance-employee" class="router-link">
            <el-menu-item
                index="22-2-2"
                v-if="checkPermission(['statistical_employee_attendance'])"
                @click="changeBreadcrumbMethod('chart-statistical-attendance-employee')"
            >Điểm danh
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/finace" class="router-link">
            <el-menu-item
                index="22-2-3"
                v-if="checkPermission(['statistical_employee_salary'])"
                @click="changeBreadcrumbMethod('chart-statistical-finace')"
            >Công lương
            </el-menu-item
            >
          </router-link>
        </el-submenu>
        <el-submenu index="22-3" v-if="checkPermission(['statistical_internal'])">
          <template slot="title">Nội bộ</template>
          <router-link to="/chart/statistical/cashinternal-paymoney" class="router-link">
            <el-menu-item
                index="22-3-1"
                v-if="checkPermission(['statistical_internal_inout'])"
                @click="changeBreadcrumbMethod('chart-statistical-cashinternal-paymoney')"
            >Thu chi
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/cashinternal-cashbook" class="router-link">
            <el-menu-item
                index="22-3-2"
                v-if="checkPermission(['statistical_internal_cashbook'])"
                @click="changeBreadcrumbMethod('chart-statistical-cashinternal-cashbook')"
            >Quỹ nhà trường
            </el-menu-item
            >
          </router-link>
          <router-link to="/chart/statistical/wallet-parent" class="router-link">
            <el-menu-item
                index="22-3-3"
                v-if="checkPermission(['statistical_internal_wallet'])"
                @click="changeBreadcrumbMethod('chart-statistical-wallet-parent')"
            >Ví phụ huynh
            </el-menu-item
            >
          </router-link>
        </el-submenu>
        <el-submenu index="22-4" v-if="checkPermission(['statisticalFinance'])">
          <template slot="title">
            <span>Thống kê báo cáo</span>
          </template>
          <router-link
              v-if="checkPermission(['statisticalFinance_statistical'])"
              to="/finace/statistical/money"
              class="router-link"
          >
            <el-menu-item
                index="22-4-1"
                @click="changeBreadcrumbMethod('finace-statistical-money')"
            >Thống kê
            </el-menu-item
            >
          </router-link>
          <router-link
              v-if="checkPermission(['statisticalFinance_money'])"
              to="/finace/statistical/finance"
              class="router-link"
          >
            <el-menu-item
                index="22-4-2"
                @click="changeBreadcrumbMethod('finace-statistical-finance')"
            >Số liệu báo cáo
            </el-menu-item
            >
          </router-link>
          <router-link
              v-if="checkPermission(['statisticalFinance_groupFees'])"
              to="/finace/statistical/kids/group"
              class="router-link"
          >
            <el-menu-item
                index="22-4-3"
                @click="changeBreadcrumbMethod('finace-statistical-kids-group')"
            >Nhóm học phí
            </el-menu-item
            >
          </router-link>
          <router-link
              v-if="checkPermission(['statisticalFinance_groupSalary'])"
              to="/finace/statistical/employee/group"
              class="router-link"
          >
            <el-menu-item
                index="22-4-4"
                @click="changeBreadcrumbMethod('finace-statistical-employee-group')"
            >Nhóm công lương
            </el-menu-item
            >
          </router-link>
        </el-submenu>
      </el-submenu>
      <el-submenu v-if="getAppTypeUserLogin == appType.TEACHER">
        <template slot="title">
          <i class="el-icon-s-data"/>
          <span>Thống kê</span>
        </template>
        <router-link to="/chart/statistical/attendance" class="router-link">
          <el-menu-item
              index="22-1-2"
              @click="changeBreadcrumbMethod('chart-statistical-attendance')"
          >Điểm danh
          </el-menu-item
          >
        </router-link>
        <router-link to="/chart/statistical/evaluate" class="router-link">
          <el-menu-item
              index="22-1-3"
              @click="changeBreadcrumbMethod('chart-statistical-evaluate')"
          >Nhận xét
          </el-menu-item
          >
        </router-link>
        <router-link to="/chart/statistical/album" class="router-link">
          <el-menu-item
              index="22-1-4"
              @click="changeBreadcrumbMethod('chart-statistical-album')"
          >Album ảnh
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu
          index="15"
          v-if="
          getAppTypeUserLogin == appType.TEACHER && checkPermission(['statisticalCommon'])
        "
      >
        <template slot="title">
          <i class="el-icon-s-operation"/>
          <span>Thống kê chung</span>
        </template>
        <router-link
            v-if="checkPermission(['statisticalCommon_attendance'])"
            to="/teacher/statistical"
            class="router-link"
        >
          <el-menu-item
              index="15-1"
              @click="changeBreadcrumbMethod('teacher-statistical')"
          >Thống kê điểm danh
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu
          index="9"
          v-if="
          getAppTypeUserLogin != appType.SUPPER_SCHOOL && checkPermission(['birthday'])
        "
      >
        <template slot="title">
          <i class="el-icon-burger"/>
          <span>Quản lý sinh nhật</span>
        </template>
        <router-link
            v-if="checkPermission(['birthday_kids'])"
            to="/birthday/kids"
            class="router-link"
        >
          <el-menu-item index="9-1" @click="changeBreadcrumbMethod('birthday-kids')"
          >Sinh nhật học sinh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['birthday_parent'])"
            to="/birthday/parent"
            class="router-link"
        >
          <el-menu-item index="9-2" @click="changeBreadcrumbMethod('birthday-parent')"
          >Sinh nhật phụ huynh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['birthday_teacher'])"
            to="/birthday/employee"
            class="router-link"
        >
          <el-menu-item index="9-3" @click="changeBreadcrumbMethod('birthday-employee')"
          >Sinh nhật nhân viên
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="10"
          v-if="
          getAppTypeUserLogin != appType.SUPPER_SCHOOL &&
          checkPermission(['notifyHistory'])
        "
      >
        <template slot="title">
          <i class="el-icon-chat-dot-round"/>
          <span>Lịch sử thông báo</span>
        </template>
        <router-link
            v-if="checkPermission(['notifyHistory_schedule'])"
            to="/notifihis/schedulesms"
            class="router-link"
        >
          <el-menu-item
              index="10-1"
              @click="changeBreadcrumbMethod('notifihis-schedulesms')"
          >Tin nhắn đặt lịch
          </el-menu-item
          >
        </router-link>

        <router-link
            v-if="checkPermission(['notifyHistory_custom'])"
            to="/notifihis/custom"
            class="router-link"
        >
          <el-menu-item index="10-2" @click="changeBreadcrumbMethod('notifihis-custom')"
          >Tin nhắn tùy chỉnh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['notifyHistory_historySms'])"
            to="/notifihis/historysms"
            class="router-link"
        >
          <el-menu-item
              index="10-3"
              @click="changeBreadcrumbMethod('notifihis-historysms')"
          >Lịch sử nhắn tin SMS
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['notifyHistory_historyApp'])"
            to="/notifihis/historyapp"
            class="router-link"
        >
          <el-menu-item
              index="10-4"
              @click="changeBreadcrumbMethod('notifihis-historyapp')"
          >Lịch sử thông báo App
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <!-- quản lý ra trường -->
      <el-submenu
          index="16"
          v-if="getAppTypeUserLogin == appType.SCHOOL && checkPermission(['outSchool'])"
      >
        <template slot="title">
          <i class="el-icon-s-promotion"/>
          <span>Quản lý ra trường</span>
        </template>
        <router-link
            to="/group-out/student"
            class="router-link"
            v-if="checkPermission(['outSchool_student'])"
        >
          <el-menu-item index="16-1" @click="changeBreadcrumbMethod('group-out-student')"
          >Học sinh
          </el-menu-item
          >
        </router-link>
        <router-link
            to="/group-out/employee"
            class="router-link"
            v-if="checkPermission(['outSchool_employee'])"
        >
          <el-menu-item index="16-2" @click="changeBreadcrumbMethod('group-out-employee')"
          >Nhân sự
          </el-menu-item
          >
        </router-link>
        <router-link
            to="/group-out/category"
            class="router-link"
            v-if="checkPermission(['outSchool_folder'])"
        >
          <el-menu-item index="16-3" @click="changeBreadcrumbMethod('group-out-category')"
          >Thư mục
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <!-- cấu hình nhà trường cho phần plus -->
      <el-submenu
          index="12"
          v-if="
          getAppTypeUserLogin != appType.SUPPER_SCHOOL &&
          checkPermission(['schoolConfig'])
        "
      >
        <template slot="title">
          <i class="el-icon-setting"/>
          <span>Cấu hình nhà trường</span>
        </template>
        <router-link
            v-if="checkPermission(['schoolConfig_school'])"
            to="/school/infor"
            class="router-link"
        >
          <el-menu-item index="12-1" @click="changeBreadcrumbMethod('school-infor')"
          >Thông tin trường
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['schoolConfig_absentTeacher'])"
            to="/school/config-class"
            class="router-link"
        >
          <el-menu-item
              index="12-24"
              @click="changeBreadcrumbMethod('school-config-class')"
          >Cấu hình ngày nghỉ
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['schoolConfig_attendanceEmployee'])"
            to="/school/config-employee"
            class="router-link"
        >
          <el-menu-item
              index="12-11"
              @click="changeBreadcrumbMethod('school-config-employee')"
          >Cấu hình nhân sự
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['schoolConfig_finance'])"
            to="/school/config-common"
            class="router-link"
        >
          <el-menu-item
              index="12-12"
              @click="changeBreadcrumbMethod('school-config-common')"
          >Cấu hình tài chính
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['schoolConfig_subject'])"
            to="/school/subject"
            class="router-link"
        >
          <el-menu-item index="12-6" @click="changeBreadcrumbMethod('school-subject')"
          >Quản lý môn học
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['schoolConfig_attendanceSample'])"
            to="/school/attendance-sample"
            class="router-link"
        >
          <el-menu-item
              index="12-7"
              @click="changeBreadcrumbMethod('school-attendance-sample')"
          >Mẫu điểm danh
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['schoolConfig_evaluateSample'])"
            to="/school/evaluate-sample"
            class="router-link"
        >
          <el-menu-item
              index="12-8"
              @click="changeBreadcrumbMethod('school-evaluate-sample')"
          >Mẫu nhận xét
          </el-menu-item
          >
        </router-link>

        <router-link
            v-if="checkPermission(['schoolConfig_wishSample'])"
            to="/school/wish-sample"
            class="router-link"
        >
          <el-menu-item index="12-9" @click="changeBreadcrumbMethod('school-wish-sample')"
          >Mẫu lời chúc
          </el-menu-item
          >
        </router-link>
        <router-link
            v-if="checkPermission(['schoolConfig_accountType'])"
            to="/school/account-type"
            class="router-link"
        >
          <el-menu-item
              index="12-10"
              @click="changeBreadcrumbMethod('school-account-type')"
          >Quản lý đối tượng
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <span v-if="getAppTypeUserLogin == appType.PARENT">
        <el-submenu index="13">
          <template slot="title">
            <i class="el-icon-document"/>
            <span>Bản tin</span>
          </template>
          <router-link to="/parent/notify" class="router-link">
            <el-menu-item index="13-10" @click="changeBreadcrumbMethod('parent-notify')"
            >Thông báo</el-menu-item
            >
          </router-link>
          <router-link to="/parent/news" class="router-link">
            <el-menu-item index="13-11" @click="changeBreadcrumbMethod('parent-news')"
            >Tin tức nhà trường</el-menu-item
            >
          </router-link>
        </el-submenu>
        <el-submenu index="14">
          <template slot="title">
            <i class="el-icon-notebook-1"/>
            <span>Hoạt động</span>
          </template>
          <router-link to="/parent/album" class="router-link">
            <el-menu-item index="14-10" @click="changeBreadcrumbMethod('parent-album')"
            >Album ảnh</el-menu-item
            >
          </router-link>
          <router-link to="/parent/video" class="router-link">
            <el-menu-item index="14-11" @click="changeBreadcrumbMethod('parent-video')"
            >Video</el-menu-item
            >
          </router-link>
          <router-link to="/parent/video/other" class="router-link">
            <el-menu-item
                index="14-12"
                @click="changeBreadcrumbMethod('parent-video-other')"
            >Thư viện</el-menu-item
            >
          </router-link>
        </el-submenu>
      </span>
      <el-submenu
          index="17"
          v-if="getAppTypeUserLogin != appType.SUPPER_SCHOOL && supportList.length > 0"
      >
        <template slot="title">
          <i class="el-icon-question"/>
          <span>Hỗ trợ &amp; hướng dẫn</span>
        </template>
        <a
            v-for="item in supportList"
            :key="item.name"
            class="router-link"
            :href="item.link"
            target="_blank"
            style="color: #bfcbd9; display: block"
        >
          <el-menu-item :index="item.name">{{ item.name }}</el-menu-item>
        </a>
      </el-submenu>

      <el-submenu v-if="getAppTypeUserLogin == appType.SUPPER_SCHOOL" index="13">
        <template slot="title">
          <i class="el-icon-user"/>
          <span>Quản lý nhân sự</span>
        </template>
        <router-link
            v-if="getAppTypeUserLogin == appType.SUPPER_SCHOOL"
            to="/employee/employees-plus"
            class="router-link"
        >
          <el-menu-item
              index="3-3"
              @click="changeBreadcrumbMethod('employee-employees-plus')"
          >Quản lý Plus
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu v-if="getAppTypeUserLogin == appType.SUPPER_SCHOOL" index="12">
        <template slot="title">
          <i class="el-icon-setting"/>
          <span>Cấu hình nhà trường</span>
        </template>
        <router-link to="/school/config" class="router-link">
          <el-menu-item index="12-2" @click="changeBreadcrumbMethod('school-config')"
          >Cấu hình chung
          </el-menu-item
          >
        </router-link>
        <router-link to="/school/camera" class="router-link">
          <el-menu-item index="12-3" @click="changeBreadcrumbMethod('school-camera')"
          >Cấu hình Camera
          </el-menu-item
          >
        </router-link>
        <router-link to="/school/media" class="router-link">
          <el-menu-item index="12-4" @click="changeBreadcrumbMethod('school-media')"
          >Cấu hình Media
          </el-menu-item
          >
        </router-link>

        <router-link to="/school/birthday-sample" class="router-link">
          <el-menu-item
              index="12-13"
              @click="changeBreadcrumbMethod('school-birthday-sample')"
          >Cấu hình gửi tin
          </el-menu-item
          >
        </router-link>
        <router-link to="/school/notification-manage" class="router-link">
          <el-menu-item
              index="12-5"
              @click="changeBreadcrumbMethod('school-notification-manage')"
          >Tự động gửi tin
          </el-menu-item
          >
        </router-link>
        <router-link to="/school/config-fuction" class="router-link">
          <el-menu-item
              index="12-19"
              @click="changeBreadcrumbMethod('school-config-fuction')"
          >Ẩn hiển chức năng
          </el-menu-item
          >
        </router-link>
        <router-link to="/school/permission-manage" class="router-link">
          <el-menu-item
              index="12-10"
              @click="changeBreadcrumbMethod('school-permission-manage')"
          >Quản lý quyền
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <!-- <el-submenu
        index="13"
        v-if="getAppTypeUserLogin != appType.SUPPER_SCHOOL"
      >
        <template slot="title">
          <i class="el-icon-office-building" />
          <span>Thông tin sử dụng</span>
        </template>
      </el-submenu> -->
    </el-menu>

    <!-- manu dành cho nhân viên công ty, đại lý -->
    <el-menu
        v-if="
        getAppTypeUserLogin == appType.SUPPER_SYSTEM ||
        getAppTypeUserLogin == appType.SYSTEM ||
        getAppTypeUserLogin == appType.AGENT
      "
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="getIsOpenCloseManu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :unique-opened="true"
    >
      <router-link to="/" class="router-link">
        <el-menu-item index="100">
          <i class="el-icon-s-home"></i>
          <span slot="title" class="onekids-title">ONEKIDS ADMIN</span>
        </el-menu-item>
      </router-link>

      <el-submenu index="1" v-if="getAppTypeUserLogin == appType.SUPPER_SYSTEM">
        <template slot="title">
          <i class="el-icon-notebook-2"/>
          <span>Quản lý nhân viên</span>
        </template>
        <router-link to="/master/admin/list" class="router-link">
          <el-menu-item index="1-1" @click="changeBreadcrumbMethod('master-admin-list')"
          >Danh sách nhân viên
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/admin/school" class="router-link">
          <el-menu-item index="1-2" @click="changeBreadcrumbMethod('master-admin-school')"
          >Phân quản lý trường
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="2"
          v-if="
          getAppTypeUserLogin == appType.SUPPER_SYSTEM ||
          getAppTypeUserLogin == appType.SYSTEM
        "
      >
        <template slot="title">
          <i class="el-icon-notebook-2"/>
          <span>Quản lý đại lý</span>
        </template>
        <router-link to="/master/agent/list" class="router-link">
          <el-menu-item index="2-1" @click="changeBreadcrumbMethod('master-agent-list')"
          >Danh sách đại lý
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/agent/account" class="router-link">
          <el-menu-item
              index="2-2"
              @click="changeBreadcrumbMethod('master-agent-account')"
          >Tài khoản đại lý
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-reading"/>
          <span>Quản lý trường</span>
        </template>
        <router-link to="/master/school-agent/list" class="router-link">
          <el-menu-item
              index="3-1"
              @click="changeBreadcrumbMethod('master-school-agent-list')"
          >Danh sách trường
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/school-agent/account-school" class="router-link">
          <el-menu-item
              index="3-2"
              @click="changeBreadcrumbMethod('master-school-agent-account-school')"
          >Tài khoản nhà trường
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/school-agent/employee-in-school" class="router-link">
          <el-menu-item
              index="3-3"
              @click="changeBreadcrumbMethod('master-school-agent-employee-in-school')"
          >Danh sách nhân sự
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/school-agent/student-in-school" class="router-link">
          <el-menu-item
              index="3-4"
              @click="changeBreadcrumbMethod('master-school-agent-student-in-school')"
          >Danh sách học sinh
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="4"
          v-if="
          getAppTypeUserLogin == appType.SUPPER_SYSTEM ||
          getAppTypeUserLogin == appType.SYSTEM
        "
      >
        <template slot="title">
          <i class="el-icon-user"/>
          <span>Quản lý BrandName</span>
        </template>
        <router-link to="/brandname/brand" class="router-link">
          <el-menu-item index="4-1" @click="changeBreadcrumbMethod('brandname-brand')"
          >Cấu hình kết nối
          </el-menu-item
          >
        </router-link>
        <router-link to="/brandname/agent" class="router-link">
          <el-menu-item index="4-2" @click="changeBreadcrumbMethod('brandname-agent')"
          >Thiết lập Brand đại lý
          </el-menu-item
          >
        </router-link>
        <router-link to="/brandname/school-brand" class="router-link">
          <el-menu-item
              index="4-3"
              @click="changeBreadcrumbMethod('brandname-school-brand')"
          >Thiết lập Brand Trường
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu
          index="5"
          v-if="
          getAppTypeUserLogin == appType.SUPPER_SYSTEM ||
          getAppTypeUserLogin == appType.SYSTEM
        "
      >
        <template slot="title">
          <i class="el-icon-user-solid"/>
          <span>Quản lý thông báo</span>
        </template>
        <router-link to="/master/notify/news-onekids" class="router-link">
          <el-menu-item
              index="5-1"
              @click="changeBreadcrumbMethod('master-notify-news-onekids')"
          >Tin tức Onekids
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/notify/notify-onekids" class="router-link">
          <el-menu-item
              index="5-2"
              @click="changeBreadcrumbMethod('master-notify-notify-onekids')"
          >Thông báo Onekids
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/notify/history-sms" class="router-link">
          <el-menu-item
              index="5-3"
              @click="changeBreadcrumbMethod('master-notify-history-sms')"
          >Lịch sử nhắn SMS
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/notify/feedback-onekids" class="router-link">
          <el-menu-item
              index="5-4"
              @click="changeBreadcrumbMethod('master-notify-feedback-onekids')"
          >Góp ý Onekids
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <!-- <el-submenu
        index="6"
        v-if="
          getAppTypeUserLogin == appType.SUPPER_SYSTEM ||
          getAppTypeUserLogin == appType.SYSTEM
        "
      >
        <template slot="title">
          <i class="el-icon-notebook-2" />
          <span>Quản lý gửi tin</span>
        </template>
        <router-link to="/master/notification/notify" class="router-link">
          <el-menu-item
            index="6-1"
            @click="changeBreadcrumbMethod('master-notification-notify')"
            >Cấu hình gửi tin</el-menu-item
          >
        </router-link>
        <router-link
          to="/master/notification/internal-notification"
          class="router-link"
        >
          <el-menu-item
            index="6-2"
            @click="changeBreadcrumbMethod('master-internal-notification-plus')"
            >Thông báo nội bộ</el-menu-item
          >
        </router-link>
      </el-submenu> -->
      <el-submenu index="7" v-if="getAppTypeUserLogin == appType.SUPPER_SYSTEM">
        <template slot="title">
          <i class="el-icon-s-custom"/>
          <span>Quản lý tài khoản</span>
        </template>
        <router-link to="/master/user/account" class="router-link">
          <el-menu-item index="7-1" @click="changeBreadcrumbMethod('master-user-account')"
          >Tài khoản người dùng
          </el-menu-item
          >
        </router-link>
      </el-submenu>

      <el-submenu index="8" v-if="getAppTypeUserLogin == appType.SUPPER_SYSTEM">
        <template slot="title">
          <i class="el-icon-setting"/>
          <span>Cấu hình hệ thống</span>
        </template>
        <router-link to="/master/system-config/attendance-sample" class="router-link">
          <el-menu-item
              index="8-1"
              @click="changeBreadcrumbMethod('master-system-config-attendance-sample')"
          >Mẫu điểm danh, lời chúc
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/system-config/evaluate-sample" class="router-link">
          <el-menu-item
              index="8-2"
              @click="changeBreadcrumbMethod('master-system-config-evaluate-sample')"
          >Mẫu nhận xét
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/system-config/school" class="router-link">
          <el-menu-item
              index="8-3"
              @click="changeBreadcrumbMethod('master-system-config-school')"
          >Cấu hình nhà trường
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/system-config/system-setting" class="router-link">
          <el-menu-item
              index="8-4"
              @click="changeBreadcrumbMethod('master-system-config-system-setting')"
          >Thiết lập hệ thống
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/system-config/web-system-title" class="router-link">
          <el-menu-item
              index="8-5"
              @click="changeBreadcrumbMethod('master-system-config-web-system-title')"
          >Thiết lập tiêu đề, nội dung
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/system-config/api" class="router-link">
          <el-menu-item
              index="8-6"
              @click="changeBreadcrumbMethod('master-system-config-api')"
          >Cập nhật quyền
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/system-config/support" class="router-link">
          <el-menu-item
              index="8-7"
              @click="changeBreadcrumbMethod('master-system-config-orther')"
          >Thiết lập hỗ trợ
          </el-menu-item
          >
        </router-link>
        <router-link to="/master/system-config/orther" class="router-link">
          <el-menu-item
              index="8-8"
              @click="changeBreadcrumbMethod('master-system-config-orther')"
          >Thiết lập khác
          </el-menu-item
          >
        </router-link>
      </el-submenu>
      <el-submenu index="9" v-if="getAppTypeUserLogin == appType.SUPPER_SYSTEM">
        <template slot="title">
          <i class="el-icon-s-shop"/>
          <span>Tạo dữ liệu hệ thống</span>
        </template>
        <router-link to="/master/other/create-data-system" class="router-link">
          <el-menu-item
              index="9-1"
              @click="changeBreadcrumbMethod('master-other-create-data-system')"
          >Tạo dữ liệu chung
          </el-menu-item
          >
        </router-link>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import CommonDataService from "@/services/CommonDataService";

export default {
  data() {
    return {
      appType: {
        SUPPER_SYSTEM: "supperSys",
        SYSTEM: "sys",
        AGENT: "agent",
        SUPPER_SCHOOL: "supperPlus",
        SCHOOL: "plus",
        TEACHER: "teacher",
        PARENT: "parent",
      },
      supportList: [],
      breadcrumbDataList: [
        //bản tin
        {
          key: "appsend-notification",
          value: [{url: "/appsend/notification", name: "Thông báo hệ thống"}],
        },
        {
          key: "appsend-parent-feedback",
          value: [{url: "/appsend/parent-feedback", name: "Phụ huynh góp ý"}],
        },
        {
          key: "appsend-teacher-feedback",
          value: [{url: "/appsend/teacher-feedback", name: "Giáo viên góp ý"}],
        },
        //nhật ký phụ huynh
        {
          key: "parentdiary-message-parent",
          value: [{url: "/parentdiary/message-parent", name: "Lời nhắn"}],
        },
        {
          key: "parentdiary-medicine",
          value: [{url: "/parentdiary/medicine", name: "Dặn thuốc"}],
        },
        {
          key: "parentdiary-take-leave",
          value: [{url: "/parentdiary/take-leave", name: "Xin nghỉ"}],
        },
        //quản lý nhân sự
        {
          key: "employee-department",
          value: [{url: "/employee/department", name: "Danh sách phòng ban"}],
        },
        {
          key: "employee-employees",
          value: [{url: "/employee/employees", name: "Danh sách nhân sự"}],
        },
        //danh sách học sinh
        {
          key: "student-grade",
          value: [{url: "/student/grade", name: "Danh sách khối"}],
        },
        {
          key: "student-class",
          value: [{url: "/student/class", name: "Danh sách lớp"}],
        },
        {
          key: "student-students",
          value: [{url: "/student/students", name: "Danh sách học sinh"}],
        },
        {
          key: "student-students-group",
          value: [{url: "/student/students-group", name: "Nhóm học sinh"}],
        },
        {
          key: "student-students-transfer",
          value: [{url: "/student/students-transfer", name: "Thông tin mở rộng"}],
        },
        //chất lượng học sinh
        {
          key: "student-quality-attendance",
          value: [{url: "/student-quality/attendance", name: "Điểm danh"}],
        },
        {
          key: "student-quality-evaluate",
          value: [{url: "/student-quality/evaluate", name: "Nhận xét"}],
        },
        {
          key: "student-quality-album",
          value: [{url: "/student-quality/album", name: "Album ảnh"}],
        },
        {
          key: "student-quality-height-weight",
          value: [
            {
              url: "/student-quality/height-weight",
              name: "Chiều cao, cân nặng",
            },
          ],
        },
        {
          key: "student-quality-schedule",
          value: [{url: "/student-quality/schedule", name: "Thời khóa biểu"}],
        },
        {
          key: "student-quality-class-menu",
          value: [{url: "/student-quality/class-menu", name: "Thực đơn"}],
        },
        //học phí & dịch vụ
        {
          key: "finace-fees-order",
          value: [{url: "/finace/fees/order", name: "Thu học phí"}],
        },
        {
          key: "finace-fees-approved",
          value: [{url: "/finace/fees/approved", name: "Duyệt học phí"}],
        },
        {
          key: "finace-fees-approved-advance",
          value: [{url: "/finace/fees/approved/advance", name: "Duyệt nâng cao"}],
        },
        {
          key: "finace-fees-package-kids",
          value: [{url: "/finace/fees/package-kids", name: "Đăng ký khoản"}],
        },
        {
          key: "finace-fees-package",
          value: [{url: "/finace/fees/package", name: "Danh sách khoản"}],
        },
        {
          key: "finace-fees-wallet",
          value: [{url: "/finace/fees/wallet", name: "Quản lý ví"}],
        },
        //Công lương
        {
          key: "finace-salary-attendance",
          value: [{url: "/finace/salary/attendance", name: "Chấm công nhân viên"}],
        },
        {
          key: "finace-salary-absent",
          value: [{url: "/finace/salary/absent", name: "Quản lý xin nghỉ"}],
        },
        {
          key: "finace-salary-paid",
          value: [{url: "/finace/salary/paid", name: "Thanh toán lương"}],
        },
        {
          key: "finace-salary-approved",
          value: [{url: "/finace/salary/approved", name: "Duyệt bảng lương"}],
        },
        {
          key: "finace-salary-institute",
          value: [{url: "/finace/salary/institute", name: "Thiết lập tiền lương"}],
        },
        {
          key: "finace-salary-attendance-config",
          value: [
            {
              url: "/finace/salary/attendance-config",
              name: "Thiết lập chấm công",
            },
          ],
        },
        {
          key: "finace-salary-sample",
          value: [{url: "/finace/salary/sample", name: "Mẫu công lương"}],
        },
        //thu chi nội bộ
        {
          key: "finace-cashinternal-paymoney",
          value: [{url: "/finace/cashinternal/paymoney", name: "Quản lý phiếu chi"}],
        },
        {
          key: "finace-cashinternal-collectmoney",
          value: [
            {
              url: "/finace/cashinternal/collectmoney",
              name: "Quản lý phiếu thu",
            },
          ],
        },
        {
          key: "finace-cashinternal-cashbook",
          value: [{url: "/finace/cashinternal/cashbook", name: "Quản lý quỹ"}],
        },
        {
          key: "finace-cashinternal-peopletype",
          value: [
            {
              url: "/finace/cashinternal/peopletype",
              name: "Danh sách đối tượng",
            },
          ],
        },
        {
          key: "finace-cashinternal-bankinfo",
          value: [
            {
              url: "/finace/cashinternal/bankinfo",
              name: "Thông tin thanh toán",
            },
          ],
        },
        //quản lý sinh nhật
        {
          key: "birthday-kids",
          value: [{url: "/birthday/kids", name: "Sinh nhật học sinh"}],
        },
        {
          key: "birthday-parent",
          value: [{url: "/birthday/parent", name: "Sinh nhật phụ huynh"}],
        },
        {
          key: "birthday-employee",
          value: [{url: "/birthday/employee", name: "Sinh nhật nhân viên"}],
        },
        //thống kê báo cáo
        {
          key: "finace-statistical-money",
          value: [{url: "/finace/statistical/money", name: "Thống kê"}],
        },
        {
          key: "finace-statistical-kids-group",
          value: [{url: "/finace/statistical/kids/group", name: "Nhóm học phí"}],
        },
        {
          key: "finace-statistical-finance",
          value: [{url: "/finace/statistical/finance", name: "Số liệu báo cáo"}],
        },
        {
          key: "finace-statistical-employee-group",
          value: [
            {
              url: "/finace/statistical/employee/group",
              name: "Nhóm công lương",
            },
          ],
        },
        //thống kê báo cáo
        {
          key: "finace-statistical-money",
          value: [{url: "/finace/statistical/money", name: "Thống kê"}],
        },
        {
          key: "finace-statistical-kids-group",
          value: [{url: "/finace/statistical/kids/group", name: "Nhóm học phí"}],
        },
        {
          key: "finace-statistical-finance",
          value: [{url: "/finace/statistical/finance", name: "Số liệu báo cáo"}],
        },
        {
          key: "finace-statistical-employee-group",
          value: [
            {
              url: "/finace/statistical/employee/group",
              name: "Nhóm công lương",
            },
          ],
        },
        //thống kê biểu đồ
        {
          key: "chart-statistical-status",
          value: [{url: "/chart/statistical/chart-status", name: "Trạng thái"}],
        },
        {
          key: "chart-statistical-attendance",
          value: [{url: "/chart/statistical/attendance", name: "Điểm danh"}],
        },
        {
          key: "chart-statistical-evaluate",
          value: [{url: "/chart/statistical/evaluate", name: "Nhận xét"}],
        },
        {
          key: "chart-statistical-album",
          value: [{url: "/chart/statistical/album", name: "Album ảnh"}],
        },
        {
          key: "chart-statistical-fees",
          value: [{url: "/chart/statistical/fees", name: "Học phí"}],
        },
        {
          key: "chart-statistical-status-employee",
          value: [
            {
              url: "/chart/statistical/chart-status-employee",
              name: "Trạng thái",
            },
          ],
        },
        {
          key: "chart-statistical-attendance-employee",
          value: [
            {
              url: "/chart/statistical/attendance-employee",
              name: "Điểm danh",
            },
          ],
        },
        {
          key: "chart-statistical-finace",
          value: [{url: "/chart/statistical/finnace", name: "Công lương"}],
        },
        {
          key: "chart-statistical-cashinternal-paymoney",
          value: [
            {
              url: "/chart/statistical/cashinternal-paymoney",
              name: "Thu chi",
            },
          ],
        },
        {
          key: "chart-statistical-cashinternal-cashbook",
          value: [
            {
              url: "/chart/statistical/cashinternal-cashbook",
              name: "Quỹ nhà trường",
            },
          ],
        },
        {
          key: "chart-statistical-wallet-parent",
          value: [{url: "/chart/statistical/wallet-parent", name: "Ví phụ huynh"}],
        },

        //lịch sử thông báo
        {
          key: "notifihis-schedulesms",
          value: [{url: "/notifihis/schedulesms", name: "Tin nhắn đặt lịch"}],
        },
        {
          key: "notifihis-custom",
          value: [{url: "/notifihis/custom", name: "Tin nhắn tùy chỉnh"}],
        },
        {
          key: "notifihis-historysms",
          value: [{url: "/notifihis/historysms", name: "Lịch sử nhắn tin SMS"}],
        },
        {
          key: "notifihis-historyapp",
          value: [{url: "/notifihis/historyapp", name: "Lịch sử thông báo App"}],
        },
        {
          key: "notifihis-notify-school",
          value: [{url: "/notifihis/notify-school", name: "Tin tức nhà trường"}],
        },
        //thống kê chung
        {
          key: "teacher-statistical",
          value: [{url: "/teacher/statistical", name: "Thống kê điểm danh"}],
        },

        /**
         * menu danh cho đối tượng supper school
         */
        //quản lý nhân sự plus
        {
          key: "employee-employees-plus",
          value: [{url: "/employee/employees-plus", name: "Quản lý Plus"}],
        },
        //Quản lý ra trường
        {
          key: "group-out-student",
          value: [
            {
              url: "/group-out/student",
              name: "Quản lý ra trường học sinh",
            },
          ],
        },
        {
          key: "group-out-employee",
          value: [
            {
              url: "/group-out/employee",
              name: "Quản lý ra trường nhân sự",
            },
          ],
        },
        {
          key: "group-out-category",
          value: [{url: "/group-out/category", name: "Quản lý thư mục"}],
        },
        //Cấu hình nhà trường
        {
          key: "school-infor",
          value: [{url: "/school/infor", name: "Thông tin trường"}],
        },
        {
          key: "school-config",
          value: [{url: "/school/config", name: "Cấu hình chung"}],
        },
        {
          key: "school-config-class",
          value: [{url: "/school/config-class", name: "Cấu hình ngày nghỉ"}],
        },
        {
          key: "school-config-employee",
          value: [{url: "/school/config-employee", name: "Cấu hình nhân sự"}],
        },
        {
          key: "school-config-common",
          value: [{url: "/school/config-common", name: "Cấu hình tài chính"}],
        },
        {
          key: "school-camera",
          value: [{url: "/school/camera", name: "Cấu hình Camera"}],
        },
        {
          key: "school-media",
          value: [{url: "/school/media", name: "Cấu hình Media"}],
        },
        {
          key: "school-notification-manage",
          value: [{url: "/school/notification-manage", name: "Tự động gửi tin"}],
        },
        {
          key: "school-config-fuction",
          value: [{url: "/school/config-fuction", name: "Ẩn hiển chức năng"}],
        },
        {
          key: "school-birthday-sample",
          value: [{url: "/school/birthday-sample", name: "Cấu hình gửi tin"}],
        },
        {
          key: "school-subject",
          value: [{url: "/school/subject", name: "Quản lý môn học"}],
        },
        {
          key: "school-evaluate-sample",
          value: [{url: "/school/evaluate-sample", name: "Mẫu nhận xét"}],
        },
        {
          key: "school-attendance-sample",
          value: [
            {
              url: "/school/attendance-sample",
              name: "Mẫu điểm danh",
            },
          ],
        },
        {
          key: "school-wish-sample",
          value: [
            {
              url: "/school/wish-sample",
              name: "Mẫu lời chúc",
            },
          ],
        },
        {
          key: "school-account-type",
          value: [{url: "/school/account-type", name: "Quản lý đối tượng"}],
        },
        {
          key: "parent-notify",
          value: [{url: "/parent/notify", name: "Thông báo"}],
        },
        {
          key: "parent-news",
          value: [{url: "/parent/news", name: "Tin tức nhà trường"}],
        },
        {
          key: "parent-album",
          value: [{url: "/parent/album", name: "Album ảnh"}],
        },
        {
          key: "parent-video",
          value: [{url: "/parent/video", name: "Video"}],
        },
        {
          key: "parent-video-other",
          value: [{url: "/parent/video/other", name: "Thư viện"}],
        },
        {
          key: "school-permission-manage",
          value: [{url: "/school/permission-manage", name: "Quản lý quyền"}],
        },

        /**
         * menu dành cho nhân viên công ty, admin
         */
        //quản lý nhân viên
        {
          key: "master-admin-list",
          value: [{url: "/master/admin/list", name: "Danh sách nhân viên"}],
        },
        {
          key: "master-admin-school",
          value: [{url: "/master/admin/school", name: "Phân quản lý trường"}],
        },
        //quản lý đại lý
        {
          key: "master-agent-list",
          value: [{url: "/master/agent/list", name: "Danh sách đại lý"}],
        },
        {
          key: "master-agent-account",
          value: [{url: "/master/agent/account", name: "Tài khoản đại lý"}],
        },
        //quản lý trường
        {
          key: "master-school-agent-list",
          value: [{url: "/master/school-agent/list", name: "Danh sách trường"}],
        },
        {
          key: "master-school-agent-account-school",
          value: [
            {
              url: "/master/school-agent/account-school",
              name: "Tài khoản nhà trường",
            },
          ],
        },
        {
          key: "master-school-agent-employee-in-school",
          value: [
            {
              url: "/master/school-agent/employee-in-school",
              name: "Danh sách nhân sự",
            },
          ],
        },
        {
          key: "master-school-agent-student-in-school",
          value: [
            {
              url: "/master/school-agent/student-in-school",
              name: "Danh sách học sinh",
            },
          ],
        },
        //quản lý brand name
        {
          key: "brandname-brand",
          value: [{url: "/brandname/brand", name: "Cấu hình kết nối"}],
        },
        {
          key: "brandname-agent",
          value: [{url: "/brandname/agent", name: "Thiết lập Brand đại lý"}],
        },
        {
          key: "brandname-school-brand",
          value: [{url: "/brandname/school-brand", name: "Thiết lập Brand Trường"}],
        },
        //quản lý thông báo
        {
          key: "master-notify-news-onekids",
          value: [{url: "/master/notify/news-onekids", name: "Tin tức Onekids"}],
        },
        {
          key: "master-notify-notify-onekids",
          value: [{url: "/master/notify/notify-onekids", name: "Thông báo Onekids"}],
        },
        {
          key: "master-notify-history-sms",
          value: [{url: "/master/notify/history-sms", name: "Lịch sử nhắn SMS"}],
        },
        {
          key: "master-notify-feedback-onekids",
          value: [{url: "/master/notify/feedback-onekids", name: "Góp ý Onekids"}],
        },
        //thông báo nội bộ
        {
          key: "master-notification-notify",
          value: [{url: "/master/notification/notify", name: "Cấu hình gửi tin"}],
        },
        {
          key: "master_internal_notification_plus",
          value: [
            {
              url: "/master/notification/internal-notification",
              name: "Thông báo nội bộ",
            },
          ],
        },
        //quản lý tài khoản
        {
          key: "master-user-account",
          value: [{url: "/master/user/account", name: "Tài khoản người dùng"}],
        },
        //cấu hình hệ thống
        {
          key: "master-system-config-attendance-sample",
          value: [
            {
              url: "/master/system-config/attendance-sample",
              name: "Mẫu điểm danh, lời chúc",
            },
          ],
        },
        {
          key: "master-system-config-evaluate-sample",
          value: [
            {
              url: "/master/system-config/evaluate-sample",
              name: "Mẫu nhận xét",
            },
          ],
        },
        {
          key: "master-system-config-school",
          value: [
            {
              url: "/master/system-config/school",
              name: "Cấu hình nhà trường",
            },
          ],
        },
        {
          key: "master-system-config-system-setting",
          value: [
            {
              url: "/master/system-config/system-setting",
              name: "Thiết lập hệ thống",
            },
          ],
        },
        {
          key: "master-system-config-web-system-title",
          value: [
            {
              url: "/master/system-config/web-system-title",
              name: "Thiết lập tiêu đề, nội dung",
            },
          ],
        },
        {
          key: "master-system-config-api",
          value: [{url: "/master/system-config/api", name: "Cập nhật quyền"}],
        },
        {
          key: "master-system-config-orther",
          value: [{url: "/master/system-config/orther", name: "Thiết lập khác"}],
        },
        //tạo dữ liệu hệ thống
        {
          key: "master-other-create-data-system",
          value: [
            {
              url: "/master/other/create-data-system",
              name: "Tạo dữ liệu chung",
            },
          ],
        },
      ],
    };
  },
  computed: {
    getIsOpenCloseManu() {
      return this.$store.getters["layout/getIsOpenClose"];
    },
    getAppTypeUserLogin() {
      console.log(this.$store.state.auth.user.appType)
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    checkPermission,
    showButton() {
      this.$alert("Chức năng đang được cập nhật", "Thông báo!", {
        confirmButtonText: "OK",
      });
    },
    changeBreadcrumbMethod(val) {
      let selectUrl = this.breadcrumbDataList.filter((x) => x.key === val);
      if (selectUrl.length === 1) {
        let dataList = selectUrl[0].value;
        sessionStorage.setItem("breadcrumbList", JSON.stringify(dataList));
        this.$store.dispatch("layout/setBreadcrumbActions", dataList);
      }
    },
    getDataSupport() {
      CommonDataService.showSupportSearch()
          .then((resp) => {
            this.supportList = resp.data.data;
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
    this.getDataSupport();
  },
};
</script>

<style lang="scss" scoped>
.menu-main {
  min-height: 950px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 210px;
  min-height: 700px;
  font-family: Arial;
}

.router-link {
  text-decoration: none;
}

.el-menu-item {
  background-color: #1f2d3d !important;
}

.el-menu-item:hover {
  background-color: #49575f !important;
}

/deep/ .el-message-box {
  display: inline-block;
  vertical-align: top !important;
  width: 420px;
  padding-bottom: 10px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 18px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: left;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/deep/ .el-message-box__wrapper::after {
  content: "";
  display: inline-block;
  height: 100%;
  width: 0;
  vertical-align: top !important;
}

.el-menu {
  margin-bottom: 20px;
}

.onekids-title {
  font-weight: bold;
}
</style>
