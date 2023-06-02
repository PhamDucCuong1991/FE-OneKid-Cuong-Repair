<template>
  <div>
    <div>
      <!-- <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName"> -->
      <!-- <el-tab-pane label="Cấu hình chung" name="configCommon"> -->
      <div class="wrapper-table">
        <table border class="table-data">
          <thead class="table-header">
            <tr>
              <td class="table-index">STT</td>
              <td style="text-align: center">Nội dung</td>
              <td class="table-action">Thiết lập</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="table-index">1</td>
              <td>Có cần duyệt album ảnh hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.album">
                  <el-radio :label="false">Có</el-radio>
                  <el-radio :label="true">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">2</td>
              <td>Có cần duyệt đánh giá nhận xét hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.evaluate">
                  <el-radio :label="false">Có</el-radio>
                  <el-radio :label="true">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">3</td>
              <td>Có cho phép sửa đánh giá khi đã duyệt hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.editAproved">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">4</td>
              <td>Có hiển thị chức năng đánh giá ngày hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.evaluateDate">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">5</td>
              <td>Có hiển thị chức năng đánh giá tuần hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.evaluateWeek">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">6</td>
              <td>Có hiển thị chức năng đánh giá tháng hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.evaluateMonth">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">7</td>
              <td>Có hiển thị chức năng đánh giá định kỳ hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.evaluatePeriod">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">8</td>
              <td>Có gửi thông báo điểm danh đến hay không?</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.approvedAttendanceArrive"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">9</td>
              <td>Giới hạn thời gian gửi điểm danh đến trước mấy giờ?</td>
              <td class="table-action">
                <el-time-picker
                  class="input-data"
                  size="mini"
                  :clearable="false"
                  type="time"
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="configSchoolCommon.timeAttendanceArrive"
                  :picker-options="{
                    selectableRange: '06:00:00 - 21:00:00',
                  }"
                  placeholder="Chọn"
                ></el-time-picker>
              </td>
            </tr>

            <tr>
              <td class="table-index">10</td>
              <td>Có gửi thông báo điểm danh về hay không?</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.approvedAttendanceLeave"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">11</td>
              <td>Giới hạn thời gian gửi điểm danh về trước mấy giờ?</td>
              <td class="table-action">
                <el-time-picker
                  class="input-data"
                  size="mini"
                  :clearable="false"
                  type="time"
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="configSchoolCommon.timeAttendanceLeave"
                  :picker-options="{
                    selectableRange: '06:00:00 - 21:00:00',
                  }"
                  placeholder="Chọn"
                ></el-time-picker>
              </td>
            </tr>

            <tr>
              <td class="table-index">12</td>
              <td>Cho phép điểm danh lại với học sinh mấy ngày trước?</td>
              <td class="table-action">
                <el-input
                  class="input-data"
                  size="mini"
                  v-model="configSchoolCommon.againAttendance"
                  placeholder="Nhập số ngày"
                ></el-input>
              </td>
            </tr>

            <tr>
              <td class="table-index">13</td>
              <td>
                Gửi đơn xin nghỉ phải trước ngày đầu tiên muốn nghỉ số ngày là?
              </td>
              <td class="table-action">
                <el-input
                  class="input-data"
                  size="mini"
                  v-model="configSchoolCommon.dateAbsent"
                  placeholder="Nhập số ngày"
                ></el-input>
              </td>
            </tr>

            <tr>
              <td class="table-index">14</td>
              <td>Thời gian xin nghỉ phải trước mấy giờ?</td>
              <td class="table-action">
                <el-time-picker
                  class="input-data"
                  size="mini"
                  :clearable="false"
                  type="time"
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="configSchoolCommon.timeAbsent"
                  :picker-options="{
                    selectableRange: '06:00:00 - 21:00:00',
                  }"
                  placeholder="Chọn"
                ></el-time-picker>
              </td>
            </tr>

            <tr>
              <td class="table-index">15</td>
              <td>Mặc định có học sáng thứ 7 hàng tuần không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.morningSaturday">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">16</td>
              <td>Mặc định có học chiều thứ 7 hàng tuần không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.afternoonSaturday">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">17</td>
              <td>Mặc định có học tối thứ 7 hàng tuần không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.eveningSaturday">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">18</td>
              <td>Mặc định có học chủ nhật hàng tuần không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.sunday">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">19</td>
              <td>Hiển thị điểm danh đi học buổi sáng không?</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.morningAttendanceArrive"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">20</td>
              <td>Hiển thị điểm danh đi học buổi chiều không?</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.afternoonAttendanceArrive"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">21</td>
              <td>Hiển thị điểm danh đi học buổi tối không?</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.eveningAttendanceArrive"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">22</td>
              <td>Hiển thị điểm danh ăn bữa sáng không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.morningEat">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">23</td>
              <td>Hiển thị điểm danh ăn bữa phụ sáng không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.secondMorningEat">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">24</td>
              <td>Hiển thị điểm danh ăn bữa trưa không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.lunchEat">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">25</td>
              <td>Hiển thị điểm danh ăn bữa chiều không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.afternoonEat">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">26</td>
              <td>Hiển thị điểm danh ăn bữa phụ chiều không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.secondAfternoonEat">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">27</td>
              <td>Hiển thị điểm danh ăn bữa tối không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.eveningEat">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">28</td>
              <td>Có cần duyệt các thông báo gửi đi hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.appSendApproved">
                  <el-radio :label="false">Có</el-radio>
                  <el-radio :label="true">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">29</td>
              <td>Có cần duyệt nội dung thời khóa biểu hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.approvedSchedule">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">30</td>
              <td>Có cần duyệt nội dung thực đơn hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.approvedMenu">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">31</td>
              <td>
                Cho phép hiển thị số điện thoại của phụ huynh với App giáo viên?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.parentPhone">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">32</td>
              <td>
                Cho phép giáo viên xem thông tin chi tiết của phụ huynh hay
                không?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.parentInfo">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">33</td>
              <td>
                Cho phép hiển thị số điện thoại của giáo viên với App phụ huynh?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.employeePhone">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">34</td>
              <td>
                Cho phép phụ huynh xem thông tin chi tiết của giáo viên không?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.employeeInfo">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">35</td>
              <td>
                Cho phép phụ huynh xem lại lịch sử học của con khi đã chuyển
                trường hay không?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.historyViewParent">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">36</td>
              <td>
                Cho phép nhân viên xem lại lịch sử làm việc khi đã nghỉ làm ở
                trường hày không?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.historyViewTeacher">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">37</td>
              <td>
                Giáo viên có được xem chi tiết các khoản thu của học sinh lớp
                mình hay không?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.feesInfo">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">38</td>
              <td>
                Giáo viên có được xem số tiền học phí của học sinh hay không?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.feesNumber">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">39</td>
              <td>Thiết lập giờ đến quy định của nhà trường với học sinh?</td>
              <td class="table-action">
                <el-time-picker
                  class="input-data"
                  size="mini"
                  :clearable="false"
                  type="time"
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="configSchoolCommon.timeArriveKid"
                  :picker-options="{
                    selectableRange: '06:00:00 - 21:00:00',
                  }"
                  placeholder="Chọn"
                ></el-time-picker>
              </td>
            </tr>

            <tr>
              <td class="table-index">40</td>
              <td>Thiết lập giờ về quy định của nhà trường với học sinh?</td>
              <td class="table-action">
                <el-time-picker
                  class="input-data"
                  size="mini"
                  :clearable="false"
                  type="time"
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="configSchoolCommon.timePickupKid"
                  :picker-options="{
                    selectableRange: '06:00:00 - 21:00:00',
                  }"
                  placeholder="Chọn"
                ></el-time-picker>
              </td>
            </tr>

            <tr>
              <td class="table-index">41</td>
              <td>Hiển thị thêm mẫu nhận xét của hệ thống?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.showEvaluateSys">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">42</td>
              <td>Hiển thị thêm mẫu báo đến, báo về của hệ thống?</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.showAttentendanceSys"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">43</td>
              <td>Hiển thị thêm mẫu lời chúc của hệ thống?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.showWishSys">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">44</td>
              <td>Thiết lập giờ đi làm buổi sáng của nhân viên nhà trường?</td>
              <td class="table-action">
                <el-time-picker
                  class="input-data"
                  size="mini"
                  :clearable="false"
                  type="time"
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="configSchoolCommon.timeArriveEmployee"
                  :picker-options="{
                    selectableRange: '06:00:00 - 21:00:00',
                  }"
                  placeholder="Chọn"
                ></el-time-picker>
              </td>
            </tr>

            <tr>
              <td class="table-index">45</td>
              <td>Thiết lập giờ về của nhân viên nhà trường?</td>
              <td class="table-action">
                <el-time-picker
                  class="input-data"
                  size="mini"
                  :clearable="false"
                  type="time"
                  value-format="HH:mm"
                  format="HH:mm"
                  v-model="configSchoolCommon.timeLeaveEmployee"
                  :picker-options="{
                    selectableRange: '06:00:00 - 21:00:00',
                  }"
                  placeholder="Chọn"
                ></el-time-picker>
              </td>
            </tr>

            <tr>
              <td class="table-index">46</td>
              <td>Có tự động duyệt các phiếu thu không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.receiptNote">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">47</td>
              <td>Có tự động duyệt các phiếu chi không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.paymentNote">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">48</td>
              <td>
                Có sinh tự động hóa đơn công lương của nhân viên cho tháng tiếp
                theo không (sinh tự động vào ngày đầu tháng)?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoBillSalaryEmployee"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">49</td>
              <td>
                Có sinh tự động các khoản công lương cho nhân viên theo các
                khoản mặc định?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoSignSalaryEmployee"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">50</td>
              <td>
                Thiết lập ngày của tháng sẽ sinh tự động các khoản công lương
                cho nhân sự?
              </td>
              <td class="table-action">
                <el-input-number
                  :disabled="!configSchoolCommon.autoSignSalaryEmployee"
                  size="mini"
                  :min="1"
                  :max="31"
                  v-model="configSchoolCommon.autoNextmonthSalaryDate"
                ></el-input-number>
              </td>
            </tr>

            <tr>
              <td class="table-index">51</td>
              <td>Có tự động duyệt các khoản lương hàng tháng không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.autoApprovedSalary">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">52</td>
              <td>
                Có tự động khóa các khoản lương khi đã thanh toán đủ không?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoLockSalarySuccess"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">53</td>
              <td>
                Có tự động hiển thị hóa đơn lương của cả tháng khi hóa đơn đã
                được sinh ra không?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoShowBillOfMonth"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">54</td>
              <td>
                Có sinh tự động hóa đơn học phí của học sinh cho tháng tiếp theo
                không(sinh tự động vào ngày đầu tháng)?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoFeesApprovedKids"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">55</td>
              <td>
                Có sinh tự động các khoản thu với học sinh theo các khoản thu đã
                đăng ký?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoGenerateFeesKids"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">56</td>
              <td>
                Thiết lập ngày của tháng sẽ sinh tự động các khoản thu cho học
                sinh?
              </td>
              <td class="table-action">
                <el-input-number
                  :disabled="!configSchoolCommon.autoGenerateFeesKids"
                  size="mini"
                  :min="1"
                  :max="31"
                  v-model="configSchoolCommon.autoNexMonthFeesDate"
                ></el-input-number>
              </td>
            </tr>

            <tr>
              <td class="table-index">57</td>
              <td>
                Có tự động duyệt các khoản thu của học sinh hàng tháng không?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoApprovedFeesMonthKids"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">58</td>
              <td>
                Có tự động khóa các khoản thu khi phụ huynh đã thanh toán đủ
                không?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoLockFeesSuccessKids"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">59</td>
              <td>
                Có tự động hiển thị hóa đơn học phí của cả tháng khi hóa đơn đã
                được sinh ra không?
              </td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.autoShowFeesMonth">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">60</td>
              <td>
                Có hiển thị thông tin các khoản thu dự kiến cho phụ huynh học
                sinh không?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoShowFeesFutureKids"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">61</td>
              <td>Có cho phép phụ huynh truy cập ví hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.showWalletParent">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">62</td>
              <td>
                Có hiển thị thông tin khoản thu dự kiến của học sinh cho giáo
                viên không?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.autoShowFeesFutureKidsForTeacher"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">63</td>
              <td>Hiện thị nút xóa nhân sự, học sinh hay không?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.deleteStatus">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr>
              <td class="table-index">64</td>
              <td>Mã xử lý trùng tài khoản</td>
              <td class="table-action">
                <el-input
                  size="mini"
                  :maxlength="6"
                  v-model="configSchoolCommon.verifyCode"
                >
                </el-input>
              </td>
            </tr>

            <tr>
              <td class="table-index">65</td>
              <td>
                Có cho phép ra trường, nghỉ học khi chưa hoàn thành học phí
                không?
              </td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.checkCompleteFeesStatus"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">66</td>
              <td>Có gửi thông báo khi nhà trường rút tiền từ ví không?</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.notifyWalletOutStatus"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr> 
            <tr>
              <td class="table-index">67</td>
              <td>Hiện OneCam Plus trong danh sách Camera nhà trường?</td>
              <td class="table-action">
                <el-radio-group v-model="configSchoolCommon.showOnecamPlus">
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">68</td>
              <td>Số lượng ảnh tối đa khi đăng Album</td>
              <td class="table-action">
                <el-input
                  size="mini"
                  v-model="configSchoolCommon.albumMaxNumber"
                >
                </el-input>
              </td>
            </tr>
            <tr>
              <td class="table-index">69</td>
              <td>Cho phép tài khoản mới đăng nhập đá tài khoản cũ nhất ra</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.approvedLogoutStatus"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">70</td>
              <td>Áp dụng tự động điền điểm danh ăn sáng theo đi học</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.breakfastAuto"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">71</td>
              <td>Áp dụng tự động điền điểm danh ăn phụ sáng theo đi học</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.secondBreakfastAuto"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">72</td>
              <td>Áp dụng tự động điền điểm danh ăn trưa theo đi học</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.lunchAuto"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">73</td>
              <td>Áp dụng tự động điền điểm danh ăn chiều theo đi học</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.afternoonAuto"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">74</td>
              <td>Áp dụng tự động điền điểm danh ăn phụ chiều theo đi học</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.secondAfternoonAuto"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="table-index">75</td>
              <td>Áp dụng tự động điền điểm danh ăn tối theo đi học</td>
              <td class="table-action">
                <el-radio-group
                  v-model="configSchoolCommon.dinnerAuto"
                >
                  <el-radio :label="true">Có</el-radio>
                  <el-radio :label="false">Không</el-radio>
                </el-radio-group>
              </td>
            </tr>

            <tr class="disable-row">
              <td class="table-index">76</td>
              <td>Thời gian gửi lời chúc mừng mặc định?</td>
              <td class="table-action">
                <span>{{
                  configSchoolCommon.sysConfigShowResponse.timeSendCelebrate
                    | formatTime
                }}</span>
              </td>
            </tr>

            <tr class="disable-row">
              <td class="table-index">77</td>
              <td>Chất lượng ảnh theo %?</td>
              <td class="table-action">
                <span>{{
                  configSchoolCommon.sysConfigShowResponse.qualityPicture
                }}</span>
              </td>
            </tr>

            <tr class="disable-row">
              <td class="table-index">78</td>
              <td>Chất lượng ảnh theo kích thước?</td>
              <td class="table-action">
                <span>{{
                  configSchoolCommon.sysConfigShowResponse.widthPicture
                }}</span>
              </td>
            </tr>

            <tr class="disable-row">
              <td class="table-index">79</td>
              <td>Chèn tiêu đề vào nội dung tin nhắn?</td>
              <td class="table-action">
                <span
                  v-if="configSchoolCommon.sysConfigShowResponse.showTitleSms"
                  >Có</span
                >
                <span v-else>Không</span>
              </td>
            </tr>

            <tr>
              <td class="table-index disable-row">80</td>
              <td class="disable-row">
                Nội dung tiêu đề mặc định trong tin nhắn SMS
              </td>
              <td class="table-action">
                <el-popover
                  placement="top-start"
                  title="Nội dung tiêu đề"
                  width="300"
                  trigger="hover"
                  :content="
                    configSchoolCommon.sysConfigShowResponse.titleContentSms
                  "
                >
                  <el-button slot="reference" type="text">Xem</el-button>
                </el-popover>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <el-button
          class="button-click"
          style="border-radius: 0"
          @click="submitConfigCommon()"
          :loading="loaddingButton"
          size="medium"
          type="success"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  data() {
    return {
      showDataSearch: false,
      configSchoolCommon: {},
      configSchoolClassList: [],
      noSelect: "",
      albumRadio: false,
      loaddingButton: false,
      loaddingButtonClass: false,
      gradeList: [],
      classFirstGradeList: [],
      classList: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        className: "",
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeSettingDayOffMethod() {
      this.showSettingDayOff = false;
    },
    settingDayOffClassMethod(row) {
      this.showSettingDayOff = true;
      this.$refs.DayOffClassDialog.getDataInitial(row);
    },
    /**
     * lưu cấu hình chung
     */
    submitConfigCommon() {
      this.loaddingButton = true;
      SchoolConfigService.updateConfigCommon(this.configSchoolCommon)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButton = false;
          }, 500);
        });
    },
    /**
     * lấy cấu hình chung
     */
    getConfigCommonMethod() {
      SchoolConfigService.getConfigCommon()
        .then((resp) => {
          this.configSchoolCommon = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  beforeMount() {
    this.getConfigCommonMethod();
    // setTimeout(() => {
    //   this.getAllGrade();
    //   this.getAllClass();
    // }, 1000);
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
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
// /deep/.el-tabs--card > .el-tabs__header {
//   border-bottom: none;
// }
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 10px 0;
// }
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
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
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}

@media screen and (max-width: 1366px) {
  .wrapper-table {
    height: 490px;
  }
}
@media screen and (min-width: 1367px) {
  .wrapper-table {
    height: 760px;
  }
}
.wrapper-table {
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
// .table-header {
//   position: sticky;
// }
// table{

// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 90%;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  // height: 600px;
  font-family: Arial, Helvetica, sans-serif;
  // display: block;
  // width: 90%;
}
td {
  padding: 12px;
}
.table-index {
  width: 10px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
