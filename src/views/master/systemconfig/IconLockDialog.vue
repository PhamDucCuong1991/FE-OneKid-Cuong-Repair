<template>
  <el-dialog
    title="Cấu hình nội dung khóa biểu tượng"
    :visible.sync="dialogVisible"
    width="1300px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <div style="display: flex; justify-content: center">
      <div class="table-icon-1">
        <span class="text-header">App Parent</span>
        <el-input v-model="changeDataParent" class="input-size" size="small">
          <el-button
            slot="append"
            icon="el-icon-check"
            @click="changeParentMethod()"
          ></el-button>
        </el-input>
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Nội dung</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">1</td>
              <td>{{ responseData.iconLockParent.messageName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.messageLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>{{ responseData.iconLockParent.medicineName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.medicineLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>{{ responseData.iconLockParent.absentName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.absentLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>{{ responseData.iconLockParent.albumName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.albumLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>{{ responseData.iconLockParent.evaluateName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.evaluateLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>{{ responseData.iconLockParent.attendanceName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.attendanceLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>{{ responseData.iconLockParent.studentFeesName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.studentFeesLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">8</td>
              <td>{{ responseData.iconLockParent.learnName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.learnLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>{{ responseData.iconLockParent.menuName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.menuLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">10</td>
              <td>{{ responseData.iconLockParent.videoName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.videoLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">11</td>
              <td>{{ responseData.iconLockParent.cameraName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.cameraLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">12</td>
              <td>{{ responseData.iconLockParent.kidsInfoName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.kidsInfoLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">13</td>
              <td>{{ responseData.iconLockParent.utilityName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.utilityLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">14</td>
              <td>{{ responseData.iconLockParent.facebookName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.facebookLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">15</td>
              <td>{{ responseData.iconLockParent.feedbackName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.feedbackLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">16</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockParent.newsLock"
                ></el-input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-icon-2">
        <span class="text-header">App Teacher</span>
        <el-input v-model="changeDataTeacher" class="input-size" size="small">
          <el-button
            slot="append"
            icon="el-icon-check"
            @click="changeTeacherMethod()"
          ></el-button>
        </el-input>
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Nội dung</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">1</td>
              <td>{{ responseData.iconLockTeacher.messageName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.messageLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>{{ responseData.iconLockTeacher.medicineName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.medicineLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>{{ responseData.iconLockTeacher.absentName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.absentLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>{{ responseData.iconLockTeacher.healthName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.healthLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>{{ responseData.iconLockTeacher.attendanceName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.attendanceLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>{{ responseData.iconLockTeacher.albumName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.albumLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>{{ responseData.iconLockTeacher.evaluateName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.evaluateLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">8</td>
              <td>{{ responseData.iconLockTeacher.studentFeesName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.studentFeesLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>{{ responseData.iconLockTeacher.videoName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.videoLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">10</td>
              <td>{{ responseData.iconLockTeacher.learnName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.learnLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">11</td>
              <td>{{ responseData.iconLockTeacher.menuName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.menuLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">12</td>
              <td>{{ responseData.iconLockTeacher.birthdayName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.birthdayLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">13</td>
              <td>{{ responseData.iconLockTeacher.cameraName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.cameraLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">14</td>
              <td>{{ responseData.iconLockTeacher.utilityName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.utilityLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">15</td>
              <td>{{ responseData.iconLockTeacher.salaryName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.salaryLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">16</td>
              <td>{{ responseData.iconLockTeacher.facebookName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.facebookLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">17</td>
              <td>{{ responseData.iconLockTeacher.feedbackName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.feedbackLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">18</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockTeacher.newsLock"
                ></el-input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-icon-3">
        <span class="text-header">App Plus</span>
        <el-input v-model="changeDataPlus" class="input-size" size="small">
          <el-button
            slot="append"
            icon="el-icon-check"
            @click="changePlusMethod()"
          ></el-button>
        </el-input>
        <table border class="table-data">
          <thead class="table-header">
            <tr align="center">
              <td class="table-index">STT</td>
              <td style="text-align: center">Chức năng</td>
              <td class="table-action">Nội dung</td>
            </tr>
          </thead>
          <tbody>
            <tr align="center">
              <td class="table-index">1</td>
              <td>{{ responseData.iconLockPlus.employeeName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.employeeLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">2</td>
              <td>{{ responseData.iconLockPlus.kidsName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.kidsLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">3</td>
              <td>{{ responseData.iconLockPlus.feedbackName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.feedbackLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">4</td>
              <td>{{ responseData.iconLockPlus.attendanceName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.attendanceLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">5</td>
              <td>{{ responseData.iconLockPlus.messageName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.messageLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">6</td>
              <td>{{ responseData.iconLockPlus.medicineName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.medicineLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">7</td>
              <td>{{ responseData.iconLockPlus.absentName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.absentLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">8</td>
              <td>{{ responseData.iconLockPlus.evaluateName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.evaluateLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">9</td>
              <td>{{ responseData.iconLockPlus.albumName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.albumLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">10</td>
              <td>{{ responseData.iconLockPlus.videoName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.videoLock"
                ></el-input>
              </td>
            </tr>

            <tr align="center">
              <td class="table-index">11</td>
              <td>{{ responseData.iconLockPlus.cameraName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.cameraLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">12</td>
              <td>{{ responseData.iconLockPlus.smsAppHistoryName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.smsAppHistoryLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">13</td>
              <td>{{ responseData.iconLockPlus.learnName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.learnLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">14</td>
              <td>{{ responseData.iconLockPlus.menuName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.menuLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">15</td>
              <td>{{ responseData.iconLockPlus.birthdayName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.birthdayLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">16</td>
              <td>{{ responseData.iconLockPlus.notifyName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.notifyLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">17</td>
              <td>{{ responseData.iconLockPlus.salaryName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.salaryLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">18</td>
              <td>{{ responseData.iconLockPlus.utilityName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.utilityLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">19</td>
              <td>{{ responseData.iconLockPlus.facebookName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.facebookLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">20</td>
              <td>{{ responseData.iconLockPlus.supportName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.supportLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">21</td>
              <td>{{ responseData.iconLockPlus.studentFeesName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.studentFeesLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">22</td>
              <td>{{ responseData.iconLockPlus.healthName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.healthLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">23</td>
              <td>{{ responseData.iconLockPlus.cashInternalName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.cashInternalLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">24</td>
              <td>{{ responseData.iconLockPlus.walletName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.walletLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">25</td>
              <td>{{ responseData.iconLockPlus.notifySchoolName }}</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.notifySchoolLock"
                ></el-input>
              </td>
            </tr>
            <tr align="center">
              <td class="table-index">26</td>
              <td>Tin tức</td>
              <td class="table-action">
                <el-input
                  size="small"
                  v-model="responseData.iconLockPlus.newsLock"
                ></el-input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import SystemConfigService from "@/services/SystemConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      responseData: {},
      loadingButton: false,
      id: "",
      changeDataParent: "",
      changeDataTeacher: "",
      changeDataPlus: "",
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      this.changeDataParent = "";
      this.changeDataTeacher = "";
      this.changeDataPlus = "";
    },
    changeParentMethod() {
      let dataInput = this.changeDataParent;
      let dataChange = this.responseData.iconLockParent;
      dataChange.messageLock = dataInput;
      dataChange.medicineLock = dataInput;
      dataChange.absentLock = dataInput;
      dataChange.albumLock = dataInput;
      dataChange.evaluateLock = dataInput;
      dataChange.attendanceLock = dataInput;
      dataChange.studentFeesLock = dataInput;
      dataChange.learnLock = dataInput;
      dataChange.menuLock = dataInput;
      dataChange.videoLock = dataInput;
      dataChange.cameraLock = dataInput;
      dataChange.kidsInfoLock = dataInput;
      dataChange.utilityLock = dataInput;
      dataChange.facebookLock = dataInput;
      dataChange.feedbackLock = dataInput;
      dataChange.newsLock = dataInput;
    },
    changeTeacherMethod() {
      let dataInput = this.changeDataTeacher;
      let dataChange = this.responseData.iconLockTeacher;
      dataChange.messageLock = dataInput;
      dataChange.medicineLock = dataInput;
      dataChange.absentLock = dataInput;
      dataChange.healthLock = dataInput;
      dataChange.attendanceLock = dataInput;
      dataChange.albumLock = dataInput;
      dataChange.evaluateLock = dataInput;
      dataChange.studentFeesLock = dataInput;
      dataChange.videoLock = dataInput;
      dataChange.learnLock = dataInput;
      dataChange.menuLock = dataInput;
      dataChange.birthdayLock = dataInput;
      dataChange.cameraLock = dataInput;
      dataChange.utilityLock = dataInput;
      dataChange.salaryLock = dataInput;
      dataChange.facebookLock = dataInput;
      dataChange.feedbackLock = dataInput;
      dataChange.newsLock = dataInput;
    },
    changePlusMethod() {
      let dataInput = this.changeDataPlus;
      let dataChange = this.responseData.iconLockPlus;
      dataChange.employeeLock = dataInput;
      dataChange.kidsLock = dataInput;
      dataChange.feedbackLock = dataInput;
      dataChange.attendanceLock = dataInput;
      dataChange.messageLock = dataInput;
      dataChange.medicineLock = dataInput;
      dataChange.absentLock = dataInput;
      dataChange.evaluateLock = dataInput;
      dataChange.albumLock = dataInput;
      dataChange.videoLock = dataInput;
      dataChange.cameraLock = dataInput;
      dataChange.smsAppHistoryLock = dataInput;
      dataChange.learnLock = dataInput;
      dataChange.menuLock = dataInput;
      dataChange.birthdayLock = dataInput;
      dataChange.notifyLock = dataInput;
      dataChange.salaryLock = dataInput;
      dataChange.utilityLock = dataInput;
      dataChange.facebookLock = dataInput;
      dataChange.supportLock = dataInput;
      dataChange.studentFeesLock = dataInput;
      dataChange.healthLock = dataInput;
      dataChange.cashInternalLock = dataInput;
      dataChange.walletLock = dataInput;
      dataChange.notifySchoolLock = dataInput;
      dataChange.newsLock = dataInput;
    },
    submitForm() {
      this.loadingButton = true;
      SystemConfigService.updateIconLockConfig(this.responseData)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
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
    },
    getDataInitial(id) {
      this.id = id; //topdo
      SystemConfigService.getIconLocConfig(id)

        .then((resp) => {
          this.responseData = resp.data.data;
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
/deep/.el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
.table-icon-1 {
  margin-left: 20px;
  margin-right: 20px;
}
.table-icon-2 {
  margin-right: 20px;
  margin-left: 20px;
}
.table-icon-3 {
  margin-right: 20px;
  margin-left: 20px;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
}
td {
  padding: 10px;
}
.table-index {
  width: 30px;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.text-header {
  background-color: #e1e782;
  font-size: 17px;
  margin-right: 5px;
}
.input-size {
  width: 70%;
}
</style>
