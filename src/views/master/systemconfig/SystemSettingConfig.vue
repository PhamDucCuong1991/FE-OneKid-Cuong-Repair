<template>
  <div>
    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- cấu chình chung -->
        <el-tab-pane label="Cấu hình chung" name="sysInforTab">
          <div class="wrapper-table">
            <table border class="table-data">
              <thead class="table-header">
                <tr>
                  <td class="table-index">STT</td>
                  <td style="text-align: center">Nội dung thiết lập</td>
                  <td class="table-action">Giá trị thiết lập</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="table-index">1</td>
                  <td>Tên số điện thoại 1</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.namePhone1"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">2</td>
                  <td>Số điện thoại 1</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.phone1"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">3</td>
                  <td>Tên số điện thoại 2</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.namePhone2"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">4</td>
                  <td>Số điện thoại 2</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.phone2"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">5</td>
                  <td>Tên số điện thoại 3</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.namePhone3"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">6</td>
                  <td>Số điện thoại 3</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.phone3"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">7</td>
                  <td>Tỷ lệ nén ảnh trong Album theo chiều rộng</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.widthAlbum"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">8</td>
                  <td>Tỷ lệ nén ảnh các mục khách theo chiều rộng</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.widthOther"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">9</td>
                  <td>Link Api backend Web</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.urlApiBackend"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">10</td>
                  <td>Link Url lưu trữ trên Server</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.localUrl"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">11</td>
                  <td>Link Url đường dẫn lưu trữ sử dụng trong môi trường internet</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.webUrl"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">12</td>
                  <td>Số lượng khi phân trang cho mobile</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.mobileSizePage"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">13</td>
                  <td>Url ảnh đại diện của OneKids trên local</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureSystemLocal"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">14</td>
                  <td>Url ảnh đại diện của OneKids trên internet</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureSystem"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">15</td>
                  <td>Url ảnh đại diện mặc định của nhà trường trên Local</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureSchoolLocal"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">16</td>
                  <td>Url ảnh đại diện mặc định của nhà trường trên internet</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureSchool"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">17</td>
                  <td>Url ảnh đại diện mặc định của nhân viên trên Local</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureEmployeeLocal"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">18</td>
                  <td>Url ảnh đại diện mặc định của nhân viên trên internet</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureEmployee"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">19</td>
                  <td>Url ảnh đại diện mặc định của phụ Huynh trên Local</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureParentLocal"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">20</td>
                  <td>Url ảnh đại diện mặc định của phụ huynh trên internet</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureParent"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">21</td>
                  <td>Url ảnh đại diện mặc định của học sinh trên Local</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureKidsLocal"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">22</td>
                  <td>Url ảnh đại diện mặc định của học sinh trên internet</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      disabled
                      autosize
                      v-model="sysInforData.urlPictureKids"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">23</td>
                  <td>Link thông tin điều khoản</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.policyLink"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">24</td>
                  <td>Link hướng dẫn sử dụng cho phụ huynh</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.guideLink"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">25</td>
                  <td>Link hướng dẫn sử dụng cho giáo viên</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.guideTeacherLink"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">26</td>
                  <td>Link hướng dẫn sử dụng cho nhà trường</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.guidePlusLink"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">27</td>
                  <td>Link hỗ trợ trực tuyến</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.supportLink"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">28</td>
                  <td>Link kênh Video OneKids</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.videoLink"
                    ></el-input>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">29</td>
                  <td>Thời gian gửi lời chúc</td>
                  <td class="table-action">
                    <el-time-picker
                      class="input-data"
                      :clearable="false"
                      type="time"
                      value-format="HH:mm"
                      format="HH:mm"
                      v-model="sysInforData.timeSend"
                      :picker-options="{
                        selectableRange: '08:00:00 - 21:00:00',
                      }"
                    ></el-time-picker>
                  </td>
                </tr>

                <tr>
                  <td class="table-index">30</td>
                  <td>Mã xác thực</td>
                  <td class="table-action">
                    <el-input v-model.trim="sysInforData.verificationCode"></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">31</td>
                  <td>Có gửi thông báo hết hạn trường cho plus không</td>
                  <td class="table-action">
                    <el-checkbox v-model="sysInforData.schoolTrialStatus"></el-checkbox>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">32</td>
                  <td>Thời gian gửi thông báo hết hạn trường là mấy ngày</td>
                  <td class="table-action">
                    <el-input-number
                      :disabled="!sysInforData.schoolTrialStatus"
                      v-model.trim="sysInforData.schoolTrailNumber"
                    ></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">33</td>
                  <td>Có gửi thông báo hết hạn tài khoản không</td>
                  <td class="table-action">
                    <el-checkbox v-model="sysInforData.accountTrialStatus"></el-checkbox>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">34</td>
                  <td>Thời gian gửi thông báo hết hạn tài khoản là mấy ngày</td>
                  <td class="table-action">
                    <el-input-number
                      :disabled="!sysInforData.accountTrialStatus"
                      v-model.trim="sysInforData.accountTrailNumber"
                    ></el-input-number>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">35</td>
                  <td>Ảnh mặc định OneCam</td>
                  <td class="table-action">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="sysInforData.oneCamePicture"
                    ></el-input>
                  </td>
                </tr>
                <!-- <tr>
                  <td class="table-index">35</td>
                  <td>Giới hạn số lượng thiết bị App phụ huynh</td>
                  <td class="table-action">
                    <el-tooltip content="Giá trị 0 là không giới hạn" placement="right">
                      <el-input-number
                        v-model.trim="sysInforData.limitDeviceParentNumber"
                        :min="0"
                      ></el-input-number>
                    </el-tooltip>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">36</td>
                  <td>Giới hạn số lượng thiết bị App giáo viên</td>
                  <td class="table-action">
                    <el-tooltip content="Giá trị 0 là không giới hạn" placement="right">
                      <el-input-number
                        v-model.trim="sysInforData.limitDeviceTeacherNumber"
                        :min="0"
                      ></el-input-number>
                    </el-tooltip>
                  </td>
                </tr>
                <tr>
                  <td class="table-index">37</td>
                  <td>Giới hạn số lượng thiết bị App nhà trường</td>
                  <td class="table-action">
                    <el-tooltip content="Giá trị 0 là không giới hạn" placement="right">
                      <el-input-number
                        v-model.trim="sysInforData.limitDevicePlusNumber"
                        :min="0"
                      ></el-input-number>
                    </el-tooltip>
                  </td>
                </tr> -->
              </tbody>
            </table>
          </div>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButtonSys"
              @click="updateSysInforMethod()"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- ios onekids -->
        <el-tab-pane label="IOS OneKids" name="onekidsIosTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appParentIos.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appParentIos.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appParentIos.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appParentIos.updateContent"
                  ></el-input>
                </td>
              </tr>
              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appParentIos.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(appParentIos)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- android onekids -->
        <el-tab-pane label="Android OneKids" name="onekidsAndroidTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appParentAndroid.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appParentAndroid.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appParentAndroid.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appParentAndroid.updateContent"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appParentAndroid.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(appParentAndroid)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- ios teacher -->
        <el-tab-pane label="IOS Teacher" name="teacherIosTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appTeacherIos.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appTeacherIos.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appTeacherIos.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appTeacherIos.updateContent"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appTeacherIos.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(appTeacherIos)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- android teacher -->
        <el-tab-pane label="Android Teacher" name="teacherAndroidTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appTeacherAndroid.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appTeacherAndroid.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appTeacherAndroid.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appTeacherAndroid.updateContent"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appTeacherAndroid.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(appTeacherAndroid)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- ios plus -->
        <el-tab-pane label="IOS Plus" name="plusIosTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appPlusIos.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appPlusIos.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appPlusIos.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appPlusIos.updateContent"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appPlusIos.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(appPlusIos)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- android plus -->
        <el-tab-pane label="Android Plus" name="plusAndroidTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appPlusAndroid.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appPlusAndroid.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="appPlusAndroid.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appPlusAndroid.updateContent"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="appPlusAndroid.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0; border: 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(appPlusAndroid)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="IOS OneCam" name="iosOneCamTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="oneCamIos.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="oneCamIos.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="oneCamIos.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="oneCamIos.updateContent"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="oneCamIos.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0; border: 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(oneCamIos)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Android OneCam" name="oneCamAndroidTab">
          <table border class="table-data">
            <thead class="table-header">
              <tr>
                <td class="table-index">STT</td>
                <td style="text-align: center">Nội dung thiết lập</td>
                <td class="table-action">Giá trị thiết lập</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-index">1</td>
                <td>Tên phiên bản</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="oneCamAndroid.version"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">2</td>
                <td>Có thông báo Update hay Không?</td>
                <td class="table-action">
                  <el-radio-group v-model="oneCamAndroid.versionUpdate">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">3</td>
                <td>Có bắt buộc Update hay không?</td>
                <td class="table-action">
                  <el-radio-group v-model="oneCamAndroid.compulsory">
                    <el-radio :label="true">Có</el-radio>
                    <el-radio :label="false">Không</el-radio>
                  </el-radio-group>
                </td>
              </tr>

              <tr>
                <td class="table-index">4</td>
                <td>Nội dung trong thông báo Update</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="oneCamAndroid.updateContent"
                  ></el-input>
                </td>
              </tr>

              <tr>
                <td class="table-index">5</td>
                <td>Link API</td>
                <td class="table-action">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="oneCamAndroid.apiUrl"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="float: right; margin: 15px 0; border: 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateAppVersionMethod(oneCamAndroid)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SystemConfigService from "@/services/SystemConfigService";

export default {
  data() {
    return {
      activeTabName: "sysInforTab",
      sysInforData: {},
      appVersionList: [],
      appParentIos: "",
      appParentAndroid: "",
      appTeacherIos: "",
      appTeacherAndroid: "",
      appPlusIos: "",
      appPlusAndroid: "",
      oneCamAndroid: "",
      oneCamIos: "",
      loaddingButton: false,
      loaddingButtonSys: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "sysInforTab") {
        this.findSysInforMethod();
      } else if (tabNameClick == "onekidsIosTab") {
        this.findAllAppVersionMethod();
      } else if (tabNameClick == "onekidsAndroidTab") {
        this.findAllAppVersionMethod();
      } else if (tabNameClick == "teacherIosTab") {
        this.findAllAppVersionMethod();
      } else if (tabNameClick == "teacherAndroidTab") {
        this.findAllAppVersionMethod();
      } else if (tabNameClick == "plusIosTab") {
        this.findAllAppVersionMethod();
      } else if (tabNameClick == "plusAndroidTab") {
        this.findAllAppVersionMethod();
      } else if (tabNameClick == "iosOneCamTab") {
        this.findAllAppVersionMethod();
      } else if (tabNameClick == "oneCamAndroidTab") {
        this.findAllAppVersionMethod();
      }
    },
    /**
     * update sysinfo
     */
    updateSysInforMethod() {
      this.loaddingButtonSys = true;
      SystemConfigService.updateSysInfor(this.sysInforData)
        .then((resp) => {
          let checkUpdate = resp.data.data;
          console.log(checkUpdate);
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.findSysInforMethod();
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
            this.loaddingButtonSys = false;
          }, 500);
        });
    },

    /**
     * cập nhật thông tin
     */
    updateAppVersionMethod(data) {
      this.loaddingButton = true;
      SystemConfigService.updateAppVersion(data)
        .then((resp) => {
          let checkUpdate = resp.data.data;
          console.log(checkUpdate);
          this.$message({
            message: "Cập nhật thành công",
            type: "success",
          });
          this.findAllAppVersionMethod();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Cập nhật thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButton = false;
          }, 500);
        });
    },

    getAppParentIosMethod() {
      this.appParentIos = this.appVersionList.filter(
        (x) => x.appType == "parent" && x.appOs == "ios"
      )[0];
    },
    getAppParentAndroidMethod() {
      this.appParentAndroid = this.appVersionList.filter(
        (x) => x.appType == "parent" && x.appOs == "android"
      )[0];
    },
    getAppTeacherIosMethod() {
      this.appTeacherIos = this.appVersionList.filter(
        (x) => x.appType == "teacher" && x.appOs == "ios"
      )[0];
    },
    getAppTeacherAndroidMethod() {
      this.appTeacherAndroid = this.appVersionList.filter(
        (x) => x.appType == "teacher" && x.appOs == "android"
      )[0];
    },
    getAppPlusIosMethod() {
      this.appPlusIos = this.appVersionList.filter(
        (x) => x.appType == "plus" && x.appOs == "ios"
      )[0];
    },
    getAppPlusAndroidMethod() {
      this.appPlusAndroid = this.appVersionList.filter(
        (x) => x.appType == "plus" && x.appOs == "android"
      )[0];
    },
    getOneCamAndroidMethod() {
      this.oneCamAndroid = this.appVersionList.filter(
        (x) => x.appType == "onecame" && x.appOs == "android"
      )[0];
    },
    getOneCamIosMethod() {
      this.oneCamIos = this.appVersionList.filter(
        (x) => x.appType == "onecame" && x.appOs == "ios"
      )[0];
    },

    /**
     * tìm kiếm tất cả tiều đề, nội dung
     */

    findAllAppVersionMethod() {
      SystemConfigService.findAllAppVersion()
        .then((resp) => {
          this.appVersionList = resp.data.data;
          this.getAppParentIosMethod();
          this.getAppParentAndroidMethod();
          this.getAppTeacherIosMethod();
          this.getAppTeacherAndroidMethod();
          this.getAppPlusIosMethod();
          this.getAppPlusAndroidMethod();
          this.getOneCamAndroidMethod();
          this.getOneCamIosMethod();
        })
        .catch((err) => {
          console.log(err);
          this.appVersionList = null;
        });
    },
    /**
     * find sysinfo
     */
    findSysInforMethod() {
      SystemConfigService.findSysInfor()
        .then((resp) => {
          this.sysInforData = resp.data.data;
        })
        .catch((err) => {
          this.sysInforData = {};
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },

  beforeMount() {
    this.findSysInforMethod();
    this.findAllAppVersionMethod();
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
/deep/.el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  // border-radius: 0;
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
// /deep/.input-data[data-v-449bb2b0] {
//     width: 100% !important;
// }
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
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
  width: 50%;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 100%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
