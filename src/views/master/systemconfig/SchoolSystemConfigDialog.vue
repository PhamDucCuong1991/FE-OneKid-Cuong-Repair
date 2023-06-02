<template>
  <el-dialog
    title="Thông tin cấu hình nhà trường"
    :visible.sync="dialogVisible"
    width="1100px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <div
      v-if="systemConfigSchoolData != null"
      align="center"
      class="wrapper-table"
    >
      <table border class="table-data">
        <thead>
          <tr>
            <td style="width: 30px">STT</td>
            <td style="width: 800px">Nội dung thiết lập</td>
            <td align="center" class="table-action">Thiết lập</td>
          </tr>
        </thead>
        <tbody>
          <tr align="center">
            <td>1</td>
            <td align="left">Có cần duyệt Album ảnh hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="systemConfigSchoolData.schoolConfigInSysResponse.album"
              >
                <el-radio :label="false">Có</el-radio>
                <el-radio :label="true">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">2</td>
            <td>Có cần duyệt đánh giá nhận xét hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.evaluate
                "
              >
                <el-radio :label="false">Có</el-radio>
                <el-radio :label="true">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">3</td>
            <td>Có cho phép sửa đánh giá khi đã duyệt hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.editAproved
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">4</td>
            <td>Có hiển thị chức năng đánh giá ngày hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.evaluateDate
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">5</td>
            <td>Có hiển thị chức năng đánh giá tuần hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.evaluateWeek
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">6</td>
            <td>Có hiển thị chức năng đánh giá tháng hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.evaluateMonth
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">7</td>
            <td>Có hiển thị chức năng đánh giá định kỳ hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .evaluatePeriod
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .approvedAttendanceArrive
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .timeAttendanceArrive
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .approvedAttendanceLeave
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .timeAttendanceLeave
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .againAttendance
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.dateAbsent
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.timeAbsent
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .morningSaturday
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">16</td>
            <td>Mặc định có học chiều thứ 7 hàng tuần không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .afternoonSaturday
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">17</td>
            <td>Mặc định có học tối thứ 7 hàng tuần không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .eveningSaturday
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">18</td>
            <td>Mặc định có học chủ nhật hàng tuần không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.sunday
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .morningAttendanceArrive
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .afternoonAttendanceArrive
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .eveningAttendanceArrive
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.morningEat
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">23</td>
            <td>Hiển thị điểm danh ăn bữa phụ sáng không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .secondMorningEat
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">24</td>
            <td>Hiển thị điểm danh ăn bữa trưa không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.lunchEat
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">25</td>
            <td>Hiển thị điểm danh ăn bữa chiều không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.afternoonEat
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">26</td>
            <td>Hiển thị điểm danh ăn bữa phụ chiều không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .secondAfternoonEat
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">27</td>
            <td>Hiển thị điểm danh ăn bữa tối không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.eveningEat
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">28</td>
            <td>Có cần duyệt các thông báo gửi đi hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .appSendApproved
                "
              >
                <el-radio :label="false">Có</el-radio>
                <el-radio :label="true">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">29</td>
            <td>Có cần duyệt nội dung thời khóa biểu hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .approvedSchedule
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">30</td>
            <td>Có cần duyệt nội dung thực đơn hay không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.approvedMenu
                "
              >
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.parentPhone
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">32</td>
            <td>
              Cho phép giáo viên xem thông tin chi tiết của phụ huynh hay không?
            </td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.parentInfo
                "
              >
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.employeePhone
                "
              >
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.employeeInfo
                "
              >
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .historyViewParent
                "
              >
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .historyViewTeacher
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">37</td>
            <td>
              Giáo viên có được xem chi tiết các khoản thu của học sinh lớp mình
              hay không?
            </td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.feesInfo
                "
              >
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.feesNumber
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.timeArriveKid
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.timePickupKid
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .showEvaluateSys
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .showAttentendanceSys
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.showWishSys
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .timeArriveEmployee
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .timeLeaveEmployee
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.receiptNote
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">47</td>
            <td>Có tự động duyệt các phiếu chi không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.paymentNote
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoBillSalaryEmployee
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">49</td>
            <td>
              Có sinh tự động các khoản công lương cho nhân viên theo các khoản
              mặc định?
            </td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoSignSalaryEmployee
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">50</td>
            <td>
              Thiết lập ngày của tháng sẽ sinh tự động các khoản công lương cho
              nhân sự?
            </td>
            <td class="table-action">
              <el-input-number
                :disabled="
                  !systemConfigSchoolData.schoolConfigInSysResponse
                    .autoSignSalaryEmployee
                "
                :min="1"
                :max="31"
                size="mini"
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoNextmonthSalaryDate
                "
              ></el-input-number>
            </td>
          </tr>

          <tr>
            <td class="table-index">51</td>
            <td>Có tự động duyệt các khoản lương hàng tháng không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoApprovedSalary
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">52</td>
            <td>Có tự động khóa các khoản lương khi đã thanh toán đủ không?</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoLockSalarySuccess
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">53</td>
            <td>
              Có tự động hiển thị hóa đơn lương của cả tháng khi hóa đơn đã được
              sinh ra không?
            </td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoShowBillOfMonth
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoFeesApprovedKids
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoGenerateFeesKids
                "
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
                :disabled="
                  !systemConfigSchoolData.schoolConfigInSysResponse
                    .autoGenerateFeesKids
                "
                :min="1"
                :max="31"
                size="mini"
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoNexMonthFeesDate
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoApprovedFeesMonthKids
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoLockFeesSuccessKids
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoShowFeesMonth
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">60</td>
            <td>
              Có hiển thị thông tin các khoản thu dự kiến cho phụ huynh học sinh
              không?
            </td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoShowFeesFutureKids
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .showWalletParent
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td class="table-index">62</td>
            <td>
              Có hiển thị thông tin khoản thu dự kiến của học sinh cho giáo viên
              không?
            </td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .autoShowFeesFutureKidsForTeacher
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.deleteStatus
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse.verifyCode
                "
              >
              </el-input>
            </td>
          </tr>

          <tr>
            <td class="table-index">65</td>
            <td>
              Có cho phép ra trường, nghỉ học khi chưa hoàn thành học phí không?
            </td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .checkCompleteFeesStatus
                "
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .notifyWalletOutStatus
                "
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
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .showOnecamPlus
                "
              >
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
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .albumMaxNumber
                "
              >
              </el-input>
            </td>
          </tr>
          <tr>
            <td class="table-index">69</td>
            <td>Cho phép tài khoản mới đăng nhập đá tài khoản cũ nhất ra</td>
            <td class="table-action">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.schoolConfigInSysResponse
                    .approvedLogoutStatus
                "
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
              <el-radio-group v-model="systemConfigSchoolData.schoolConfigInSysResponse.breakfastAuto">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">71</td>
            <td>Áp dụng tự động điền điểm danh ăn phụ sáng theo đi học</td>
            <td class="table-action">
              <el-radio-group v-model="systemConfigSchoolData.schoolConfigInSysResponse.secondBreakfastAuto">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">72</td>
            <td>Áp dụng tự động điền điểm danh ăn trưa theo đi học</td>
            <td class="table-action">
              <el-radio-group v-model="systemConfigSchoolData.schoolConfigInSysResponse.lunchAuto">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">73</td>
            <td>Áp dụng tự động điền điểm danh ăn chiều theo đi học</td>
            <td class="table-action">
              <el-radio-group v-model="systemConfigSchoolData.schoolConfigInSysResponse.afternoonAuto">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">74</td>
            <td>Áp dụng tự động điền điểm danh ăn phụ chiều theo đi học</td>
            <td class="table-action">
              <el-radio-group v-model="systemConfigSchoolData.schoolConfigInSysResponse.secondAfternoonAuto">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="table-index">75</td>
            <td>Áp dụng tự động điền điểm danh ăn tối theo đi học</td>
            <td class="table-action">
              <el-radio-group v-model="systemConfigSchoolData.schoolConfigInSysResponse.dinnerAuto">
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <!-- ben co dinh -->
          <tr>
            <td class="table-index disable-row">68</td>
            <td class="disable-row">Thời gian gửi lời chúc mừng mặc định?</td>
            <td class="table-action">
              <el-time-picker
                class="input-data"
                size="mini"
                :clearable="false"
                type="time"
                value-format="HH:mm"
                format="HH:mm"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.timeSendCelebrate
                "
                :picker-options="{
                  selectableRange: '06:00:00 - 21:00:00',
                }"
                placeholder="Chọn"
              ></el-time-picker>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">69</td>
            <td>Chất lượng ảnh theo %?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.qualityPicture
                "
                placeholder="Nhập khoảng"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">70</td>
            <td>Chất lượng ảnh theo kích thước?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="systemConfigSchoolData.sysConfigResponse.widthPicture"
                placeholder="Nhập khoảng"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">71</td>
            <td>Chèn tiêu đề vào nội dung tin nhắn?</td>
            <td class="table-action" style="background: white">
              <el-radio-group
                v-model="systemConfigSchoolData.sysConfigResponse.showTitleSms"
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">72</td>
            <td>Nội dung tiêu đề mặc định trong tin nhắn SMS</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.titleContentSms
                "
                placeholder="Nhập tiêu đề"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">73</td>
            <td>
              Hiện phụ Huynh đã đọc hay chưa đọc với App giáo viên và Plus
              (Thông báo, Nhận xét)?
            </td>
            <td class="table-action" style="background: white">
              <el-radio-group
                v-model="systemConfigSchoolData.sysConfigResponse.appSendParent"
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">74</td>
            <td>
              Hiện giáo viên và nhà trường đã đọc hay chưa đọc với App phụ huynh
              (Lời nhắn, dặn thuốc, xin nghỉ, góp ý)?
            </td>
            <td class="table-action" style="background: white">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.sysConfigResponse.appSendTeacher
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">75</td>
            <td>Số lần nhắc lại khi có nội dung mới với App phụ Huynh?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.numberRemindParent
                "
                placeholder="Nhập số lần"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">76</td>
            <td>Khoảng thời gian nhắc giữa 2 lần của App Phụ Huynh(phút)?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.jumpTimeParent
                "
                placeholder="Nhập số phút"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">77</td>
            <td>Số lần nhắc lại khi có nội dung mới với App Giáo viên?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.numberRemindTeacher
                "
                placeholder="Nhập số lần"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">78</td>
            <td>Khoảng thời gian nhắc giữa 2 lần của App Giáo viên(phút)?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.jumpTimeTeacher
                "
                placeholder="Nhập số phút"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">79</td>
            <td>Số lần nhắc lại khi có nội dung mới với App Plus?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.numberRemindPlus
                "
                placeholder="Nhập số lần"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">80</td>
            <td>Khoảng thời gian nhắc giữa 2 lần của App Plus(phút)?</td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="systemConfigSchoolData.sysConfigResponse.jumpTimePlus"
                placeholder="Nhập số phút"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">81</td>
            <td>
              Thời gian bắt đầu nhắc lần đầu có thông tin mới(mặc định là 8h30)?
            </td>
            <td class="table-action" style="background: white">
              <el-time-picker
                class="input-data"
                size="mini"
                :clearable="false"
                type="time"
                value-format="HH:mm"
                format="HH:mm"
                v-model="systemConfigSchoolData.sysConfigResponse.timeFrom"
                :picker-options="{
                  selectableRange: '06:00:00 - 21:00:00',
                }"
                placeholder="Chọn"
              ></el-time-picker>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">82</td>
            <td>Thời gian cuối cùng có thể nhắc lần đầu(mặc định là 8h30)?</td>
            <td class="table-action" style="background: white">
              <el-time-picker
                class="input-data"
                size="mini"
                :clearable="false"
                type="time"
                value-format="HH:mm"
                format="HH:mm"
                v-model="systemConfigSchoolData.sysConfigResponse.timeTo"
                :picker-options="{
                  selectableRange: '06:00:00 - 21:00:00',
                }"
                placeholder="Chọn"
              ></el-time-picker>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">83</td>
            <td>
              Số ngày quy định sau khi học sinh sang trường mới hcoj sẽ báo nhà
              trường, nếu học sinh còn ở trạng thái đi học?
            </td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.numberOutSchool
                "
                placeholder="Nhập số phút"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">84</td>
            <td>
              Số lần sẽ gửi thông báo cho nhà trường với trường hợp sang trường
              mới học mà chưa nghỉ học tại trường?
            </td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="systemConfigSchoolData.sysConfigResponse.numberNotify"
                placeholder="Nhập số phút"
              ></el-input>
            </td>
          </tr>

          <tr class="disable-row">
            <td class="table-index">85</td>
            <td>
              Khoảng thời gian gửi thông báo cho nhà trường khi học sinh học
              trường mới(Đơn vị là ngày/1 lần)?
            </td>
            <td class="table-action" style="background: white">
              <el-input
                class="input-data"
                size="mini"
                v-model="systemConfigSchoolData.sysConfigResponse.jumpNumberOut"
                placeholder="Nhập số phút"
              ></el-input>
            </td>
          </tr>
          <tr class="disable-row">
            <td class="table-index">86</td>
            <td>Có tự động xóa tài khoản khi không còn đối tượng con không?</td>
            <td class="table-action" style="background: white">
              <el-radio-group
                v-model="
                  systemConfigSchoolData.sysConfigResponse.deleteAccountStatus
                "
              >
                <el-radio :label="true">Có</el-radio>
                <el-radio :label="false">Không</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr class="disable-row">
            <td class="table-index">87</td>
            <td>Thời gian xóa tự động tài khoản là sau mấy ngày?</td>
            <td class="table-action" style="background: white">
              <el-input-number
                class="input-data"
                size="mini"
                v-model="
                  systemConfigSchoolData.sysConfigResponse.deleteAccountDate
                "
                placeholder="Nhập số ngày"
              ></el-input-number>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else align="center">Không có dữ liệu</div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('systemConfigSchoolData')"
      >
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('systemConfigSchoolData')"
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
      systemConfigSchoolData: {},
      loadingButton: false,
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["systemConfigSchoolData"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["systemConfigSchoolData"].resetFields();
    },
    submitForm(fromData) {
      this.loadingButton = true;
      SystemConfigService.updateSchoolConfigSystem(this.systemConfigSchoolData)
        .then((response) => {
          let data = response.data.data;
          console.log(data);
          this.$message({
            message: "Cập nhật thành công",
            type: "success",
          });

          setTimeout(() => {
            this.closeDialogByButton(fromData);
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
      SystemConfigService.findSchoolConfigSystem(id)
        .then((resp) => {
          this.systemConfigSchoolData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.systemConfigSchoolData = null;
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
@media screen and (max-width: 1366px) {
  .wrapper-table {
    height: 480px;
  }
}
@media screen and (min-width: 1367px) {
  .wrapper-table {
    height: 740px;
  }
}
.wrapper-table {
  overflow-y: scroll;
  border-top: 1px solid #ebeef5;
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
  text-align: center;
}
.table-item-name {
  text-align: center;
}
.table-action {
  width: 50px;
  text-align: center;
}
.disable-row {
  background: #e4e7ed;
}
</style>
