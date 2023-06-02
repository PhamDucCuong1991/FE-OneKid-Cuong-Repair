import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'

Vue.use(Router)

import Layout from '@/layout'
import Master from '@/layout/components/Master.vue'

export const constantRoutes = [
  {
    path: '*',
    component: () => import('@/views/error-page/NotFound.vue'),
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue')
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue')
  },
  {
    path: '/axios',
    component: () => import('@/views/Axiostest.vue')
  },
  {
    path: '/change-language',
    component: () => import('@/views/ChangeLanguage.vue')
  },
  {
    path: '/test/vietlv1',
    component: () => import('@/views/test/VietLV1.vue')
  },
  {
    path: '/test',
    component: () => import('@/views/test/Test.vue')
  },
  {
    path: '/test/thanhnt',
    component: () => import('@/views/test/ThanhNT.vue')
  },
  {
    path: '/test/thangpn',
    component: () => import('@/views/test/ThangPN.vue')
  },
  {
    path: '/test/123',
    component: () => import('@/views/import-export/ExportCommon.vue')
  },
  {
    path: '/',
    name:"dashboardName",
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    children: [
      {
        path: 'forbidden',
        component: () => import('@/views/error-page/Error403.vue')
      }
    ]
  },
  
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'test',
        component: () => import('@/views/Test.vue')
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    children: [
      {
        path: 'grade',
        component: () => import('@/views/student/Grade.vue')
      },
      {
        path: 'students',
        component: () => import('@/views/student/Student.vue')
      },
      {
        path: 'class',
        component: () => import('@/views/student/MaClass.vue')
      },
      {
        path: 'students-group',
        component: () => import('@/views/student/StudentGroup.vue')
      },
      {
        path: 'students-transfer',
        component: () => import('@/views/student/StudentTransfer.vue')
      },
    ]
  },
  {
    path: '/employee',
    component: Layout,
    children: [
      {
        path: 'department',
        component: () => import('@/views/employee/Department.vue')
      },
      {
        path: 'employees',
        component: () => import('@/views/employee/Employee.vue')
      },
      {
        path: 'subjects',
        component: () => import('@/views/employee/Subject.vue')
      },
      {
        path: 'employees-plus',
        component: () => import('@/views/employee/EmployeeAppPlus.vue')
      },
    ]
  },
  {
    path: '/student-quality',
    component: Layout,
    children: [
      {
        path: 'attendance',
        component: () => import('@/views/studentquality/Attendance.vue')
      },
      {
        path: 'evaluate',
        component: () => import('@/views/studentquality/Evaluate.vue')
      },
      {
        path: 'height-weight',
        component: () => import('@/views/studentquality/KidsHeightWeight.vue')
      },
      {
        path: 'schedule',
        component: () => import('@/views/studentquality/Schedule.vue')
      },
      {
        path: 'class-menu',
        component: () => import('@/views/studentquality/ClassMenu.vue')
      },
      {
        path: 'album',
        component: () => import('@/views/album/Album.vue')
      },
      {
        path: 'album-detail/:id',
        props: true,
        component: () => import('@/views/album/AlbumDetail.vue')
      },
      {
        path: 'album/add',
        props: true,
        component: () => import('@/views/album/AddAlbum.vue')
      }
    ]
  },

  {
    path: '/appsend',
    component: Layout,
    children: [
      {
        path: 'notification',
        component: () => import('@/views/news/AppSend.vue')
      },
      {
        path: 'parent-feedback',
        component: () => import('@/views/news/ParentsFeedback.vue')
      },
      {
        path: 'teacher-feedback',
        component: () => import('@/views/news/TeacherFeedback.vue')
      },
    ]
  },
  {
    path: '/parentdiary',
    component: Layout,
    children: [
      {
        path: 'message-parent',
        component: () => import('@/views/parentdiary/MessageParent.vue')
      },
      {
        path: 'medicine',
        component: () => import('@/views/parentdiary/MedicationAdviceParent.vue')
      },
      {
        path: 'take-leave',
        component: () => import('@/views/parentdiary/TakeLeaveParent.vue')
      },


    ]
  },
  {
    path: '/birthday',
    component: Layout,
    children: [
      {
        path: 'kids',
        component: () => import('@/views/birthdaymanagement/KidsBirthday.vue')
      },
      {
        path: 'parent',
        component: () => import('@/views/birthdaymanagement/ParentBirthday.vue')
      },
      {
        path: 'employee',
        component: () => import('@/views/birthdaymanagement/TeacherBirthday.vue')
      },
    ]
  },
  //Quản lý ra trường
  {
    path: '/group-out',
    component: Layout,
    children: [
      {
        path: 'student',
        component: () => import('@/views/groupout/GroupOutStudent.vue')
      },
      {
        path: 'employee',
        component: () => import('@/views/groupout/GroupOutEmployee.vue')
      },
      {
        path: 'category',
        component: () => import('@/views/groupout/GroupOutCategory.vue')
      },
    ]
  },
  {
    path: '/school',
    component: Layout,
    children: [
      {
        path: 'infor',
        component: () => import('@/views/schoolconfig/SchoolInfor.vue')
      },
      {
        path: 'config',
        component: () => import('@/views/schoolconfig/SchoolConfiguration.vue')
      },
      {
        path: 'config-class',
        component: () => import('@/views/schoolconfig/AbsentConfigClass.vue')
      },
      {
        path: 'config-common',
        component: () => import('@/views/schoolconfig/ConfigCommon.vue')
      },
      {
        path: 'config-employee',
        component: () => import('@/views/schoolconfig/SchoolConfigAttendanceEmployee.vue')
      },
      {
        path: 'camera',
        component: () => import('@/views/schoolconfig/CameraConfig.vue')
      },
      {
        path: 'media',
        component: () => import('@/views/schoolconfig/MediaConfig.vue')
      },
      {
        path: 'subject',
        component: () => import('@/views/schoolconfig/SubjectManagement.vue')
      },
      {
        path: 'notification-manage',
        component: () => import('@/views/schoolconfig/notification/ViewContentNotification.vue')
      },
      {
        path: 'birthday-sample',
        component: () => import('@/views/schoolconfig/BirthdaySampleConfig.vue')
      },
      {
        path: 'evaluate-sample',
        component: () => import('@/views/schoolconfig/EvaluateSampleConfig.vue')
      },
      {
        path: 'attendance-sample',
        component: () => import('@/views/schoolconfig/AttendanceSampleConfig.vue')
      },
      {
        path: 'wish-sample',
        component: () => import('@/views/schoolconfig/WishSampleConfig.vue')
      },
      {
        path: 'account-type',
        component: () => import('@/views/schoolconfig/AccountType.vue')
      },
      {
        path: 'permission-manage',
        component: () => import('@/views/schoolconfig/UserRoleConfig.vue')
      },
      {
        path: 'config-fuction',
        component: () => import('@/views/schoolconfig/ConfigFunction.vue')
      }
    ]
  },
  {
    path: "/master",
    component: Layout,
    children: [
      {
        path: 'admin',
        component: Master,
        children: [
          {
            path: 'list',
            component: () => import('@/views/master/admin/Admin.vue')
          },
          {
            path: 'school',
            component: () => import('@/views/master/admin/AdminAccount.vue')
          },
        ]
      },
      {
        path: 'agent',
        component: Master,
        children: [
          {
            path: 'list',
            component: () => import('@/views/master/agent/Agent.vue')
          },
          {
            path: 'account',
            component: () => import('@/views/master/agent/AccountAgent.vue')
          },
          {
            path: 'add',
            component: () => import('@/views/master/agent/CreateAgent.vue')
          }
        ]
      },
      {
        path: 'school-agent',
        component: Master,
        children: [
          {
            path: 'list',
            component: () => import('@/views/master/school/School.vue')
          },
          {
            path: 'account-school',
            component: () => import('@/views/master/school/AccountSchool.vue')
          },
          {
            path: 'student-in-school',
            component: () => import('@/views/master/school/StudentInSchool.vue')
          },
          {
            path: 'employee-in-school',
            component: () => import('@/views/master/school/EmployeeInSchool.vue')
          },
        ]
      },
      {
        path: 'notify',
        component: Master,
        children: [
          {
            path: 'news-onekids',
            component: () => import('@/views/master/notify/News.vue')
          },
          {
            path: 'notify-onekids',
            component: () => import('@/views/master/notify/AppSendNotify.vue')
          },
          {
            path: 'history-sms',
            component: () => import('@/views/master/notify/HistorySms.vue')
          },
          {
            path: 'feedback-onekids',
            component: () => import('@/views/master/notify/FeedBackOnekids.vue')
          }
        ]
      },
      // {
      //   path: 'notification',
      //   component: Master,
      //   children: [
      //     {
      //       path: 'notify',
      //       component: () => import('@/views/master/notification/ViewContentNotification.vue')
      //     },
      //     {
      //       path: 'internal-notification',
      //       component: () => import('@/views/master/notification/AppSendNotification.vue')
      //     }
      //   ]
      // },
      {
        path: 'user',
        component: Master,
        children: [
          {
            path: 'account',
            component: () => import('@/views/master/account/AccountManage.vue')
          },
        ]
      },
      {
        path: 'system-config',
        component: Master,
        children: [
          {
            path: 'attendance-sample',
            component: () => import('@/views/master/systemconfig/AttendanceSampleConfig.vue')
          },
          {
            path: 'evaluate-sample',
            component: () => import('@/views/master/systemconfig/EvaluateSampleConfig.vue')
          },
          {
            path: 'web-system-title',
            component: () => import('@/views/master/systemconfig/WebSystemTitleConfig.vue')
          },
          {
            path: 'system-setting',
            component: () => import('@/views/master/systemconfig/SystemSettingConfig.vue')
          },
          {
            path: 'school',
            component: () => import('@/views/master/systemconfig/SchoolSystemConfig.vue')
          },
          {
            path: 'api',
            component: () => import('@/views/master/systemconfig/ApiData.vue')
          },
          {
            path: 'support',
            component: () => import('@/views/master/systemconfig/Support.vue')
          },
          {
            path: 'orther',
            component: () => import('@/views/master/systemconfig/BirthdaySampleConfig.vue')
          }
        ]
      },
      {
        path: 'other',
        component: Master,
        children: [
          {
            path: 'create-data-system',
            component: () => import('@/views/master/other/CreateDataSystem.vue')
          },
        ]
      },
    ]
  },
  {
    path: '/brandname',
    component: Layout,
    children: [
      {
        path: 'brand',
        component: () => import('@/views/brandname/Brand.vue')
      },
      {
        path: 'agent',
        component: () => import('@/views/brandname/AgentBrand.vue')
      },
      {
        path: 'school-brand',
        component: () => import('@/views/brandname/SchoolBrand.vue')
      },
    ]
  },
  {
    path: '/notifihis',
    component: Layout,
    children: [
      {
        path: 'schedulesms',
        component: () => import('@/views/notifihistory/Schedulesms.vue')
      },
      {
        path: 'custom',
        component: () => import('@/views/notifihistory/SmsCustom.vue')
      },
      {
        path: 'historysms',
        component: () => import('@/views/notifihistory/SmsSendHistory.vue')
      },
      {
        path: 'historyapp',
        component: () => import('@/views/notifihistory/SmsApp.vue')
      },
      {
        path: 'notify-school',
        component: () => import('@/views/notifySchool/NotifySchool.vue')
      },

    ]
  },
  {
    path: '/finace/fees',
    component: Layout,
    children: [
      {
        path: 'package',
        component: () => import('@/views/finance/Package.vue')
      },
      {
        path: 'package-kids',
        component: () => import('@/views/finance/PackageDefaultKids.vue')
      },
      {
        path: 'approved',
        component: () => import('@/views/finance/PackageKidsApproved.vue')
      },
      {
        path: 'approved/advance',
        component: () => import('@/views/finance/PackageKidsApprovedAdvance.vue')
      },
      {
        path: 'order',
        component: () => import('@/views/finance/OrderKids.vue')
      },
      {
        path: 'wallet',
        component: () => import('@/views/finance/WalletParent.vue')
      }
    ]
  },
  {
    path: '/finace/salary',
    component: Layout,
    children: [
      {
        path: 'institute',
        component: () => import('@/views/employeeSalary/SalaryInstitute.vue')
      },
      {
        path: 'attendance-config',
        component: () => import('@/views/employeeSalary/ConfigEmployeeAttendance.vue')
      },
      {
        path: 'sample',
        component: () => import('@/views/employeeSalary/SalarySample.vue')
      },
      {
        path: 'approved',
        component: () => import('@/views/employeeSalary/SalaryApproved.vue')
      },
      {
        path: 'paid',
        component: () => import('@/views/employeeSalary/SalaryPaid.vue')
      },
      {
        path: 'attendance',
        component: () => import('@/views/attendanceEmployee/AttendanceEmployee.vue')
      },
      {
        path: 'absent',
        component: () => import('@/views/attendanceEmployee/AbsentTeacher.vue')
      }
    ]
  },
  {
    path: '/finace/cashinternal',
    component: Layout,
    children: [
      {
        path: 'paymoney',
        component: () => import('@/views/cashinternal/CashInternalOut.vue')
      },
      {
        path: 'collectmoney',
        component: () => import('@/views/cashinternal/CashInternalIn.vue')
      },
      {
        path: 'peopletype',
        component: () => import('@/views/cashinternal/PeopleType.vue')
      },
      {
        path: 'bankinfo',
        component: () => import('@/views/cashinternal/FnBank.vue')
      },
      {
        path: 'cashbook',
        component: () => import('@/views/cashinternal/CashBook.vue')
      },
    ]
  },
  {
    path: '/finace/statistical',
    component: Layout,
    children: [
      {
        path: 'kids/group',
        component: () => import('@/views/financeStatistical/PackageGroup.vue')
      },
      {
        path: 'employee/group',
        component: () => import('@/views/financeStatistical/SalaryGroup.vue')
      },
      {
        path: 'finance',
        component: () => import('@/views/financeStatistical/StatisitcalFeesSalary.vue')
      },

      {
        path: 'money',
        component: () => import('@/views/financeStatistical/StatisticalMoney.vue')
      },
    ]
  },
  {
    path: '/chart/statistical',
    component: Layout,
    children: [
      {
        path: 'chart-status',
        component: () => import('@/views/chartStatistical/StudentChartStatus.vue')
      },
      {
        path: 'attendance',
        component: () => import('@/views/chartStatistical/StudentChartAttendance.vue')
      },
      {
        path: 'evaluate',
        component: () => import('@/views/chartStatistical/StudentChartEvaluate.vue')
      },
      {
        path: 'album',
        component: () => import('@/views/chartStatistical/StudentChartAlbum.vue')
      },
      {
        path: 'fees',
        component: () => import('@/views/chartStatistical/StudentChartFees.vue')
      },
      {
        path: 'chart-status-employee',
        component: () => import('@/views/chartStatistical/EmployeeChartStatus.vue')
      },
      {
        path: 'attendance-employee',
        component: () => import('@/views/chartStatistical/EmployeeChartAttendance.vue')
      },
      {
        path: 'finace',
        component: () => import('@/views/chartStatistical/EmployeeChartFinace.vue')
      },
      {
        path: 'cashinternal-paymoney',
        component: () => import('@/views/chartStatistical/CashinternalPayMoney.vue')
      },
      {
        path: 'cashinternal-cashbook',
        component: () => import('@/views/chartStatistical/CashinternalCashbook.vue')
      },
      {
        path: 'wallet-parent',
        component: () => import('@/views/chartStatistical/WalletParentChart.vue')
      },
    ]
  },
  {
    path: '/teacher',
    component: Layout,
    children: [
      {
        path: 'statistical',
        component: () => import('@/teacher/CommonData.vue')
      }
    ]
  },
  {
    path: '/parent',
    component: Layout,
    children: [
      {
        path: 'notify',
        component: () => import('@/parent/NotifyParent.vue')
      },
      {
        path: 'news',
        component: () => import('@/parent/NewsSchoolParent.vue')
      },
      {
        path: 'album',
        component: () => import('@/parent/album/Album.vue')
      },
      {
        path: 'album-detail/:id',
        props: true,
        component: () => import('@/parent/album/AlbumDetail.vue')
      },
      {
        path: 'video',
        props: true,
        component: () => import('@/parent/video/VideoParent.vue')
      },
      {
        path: 'video/other',
        props: true,
        component: () => import('@/parent/video/VideoParentOther.vue')
      },
    ]
  },

]

const createRouter = () => new Router({
  mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  
  //url công khai có thể truy cập không cần xác thực
  const publicPages = ['/login'];
  //url yêu cầu xác thực
  const authRequired = !publicPages.includes(to.path);
  //check xem có token hay không, không có trả về null
  const loggedIn = localStorage.getItem('user');

  // truy cập page yêu cầu xác thực và không được công khai thì chuyển về page login
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
