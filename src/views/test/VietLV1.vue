<template>
  <div>
    <h1>Việt test</h1>
    <spinner :message="$tableLoadding" />
    <el-button @click="reloadPage()">OK</el-button>
    {{ listTest }}

    <el-button @click="testMethod()">Click</el-button>
    <div>{{ lastList }}</div>
    <hr />
    <!-- <el-calendar v-model="value">
      <template slot="dateCell" slot-scope="{ data }">
        <div>
          <div class="calendar-day">{{ data.day.split("-").slice(2).join("-") }}</div>
          <div v-for="(item, index) in calendarData" :key="index">
            <div
              v-if="
                item.years.indexOf(data.day.split('-').slice(0)[0]) != -1 &&
                item.months.indexOf(data.day.split('-').slice(1)[0]) != -1 &&
                item.days.indexOf(data.day.split('-').slice(2).join('-')) != -1
              "
            >
              <div class="mark">{{ item.things }}</div>
            </div>
            <div v-else></div>
          </div>
        </div>
      </template>
    </el-calendar> -->
    <!-- <div class="hh">kk</div> -->
    <!-- <div style="color: blue">vao duy</div>
    <el-button @click="KKKK()">OO</el-button> -->
    <div
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="false"
      filename="hehehe"
      :paginate-elements-by-height="1100"
      :pdf-quality="2"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      :manual-pagination="false"
      @progress="onProgress($event)"
      @startPagination="startPagination()"
      @hasPaginated="hasPaginated()"
      @beforeDownload="beforeDownload($event)"
      @hasDownloaded="hasDownloaded($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <hhhh slot=""></hhhh>
      </section>
    </div>
    <!-- <section class="title-container">
      <h1 class="title-header">Vue HTML2PDF</h1>
    </section> -->
    <div ref="document" style="color: red; font-size: 30px">this is document</div>
    <!-- <el-button @click="downloadPdf()">downloadPDF</el-button> -->
    <button @click="exportToPDF()">Export to PDF</button>
    <hr />
    <el-button type="success" @click="AddP()"> Add propertiest</el-button>
    {{ objectTest }}
    <hr />
    {{ myVar }}
    <el-button @click="changeText()">Chuyen doi</el-button>
    {{ myVar1 }}
    <hr />

    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
    <br />
    <el-table
      :data="tableData"
      border
      highlight-current-row
      :header-cell-style="tableHeaderColor"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>
  </div>
</template>
<script>
import http from "@/http-common";
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      moneyInp: "",
      money: "",
      aaa: "",
      custom: "",
      numberCustom: "",
      listTest: ["a", "b", "c"],
      lastList: "",

      value: this.moment(),
      calendarData: [
        { years: ["2021"], months: ["05"], days: ["14"], things: "" },
        { years: ["2021"], months: ["06"], days: ["12"], things: "" },
        { years: ["2021"], months: ["07"], days: ["10"], things: "" },
      ],
      pdfDownloaded: false,
      objectTest: {
        pro1: "this one",
        pro2: "this two",
      },
      objectA: {
        myob: "lll",
      },
      myVar: "Đây là nội dung tiếng việt có dấu",
      myVar1: "   Đây     là nội dung    tiếng việt có dấu",
      myVar2: "",

      tableData: [],
      tableData1: [],
      tableHeader: [],

      tableDataConvert: [],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    //check size file
    beforeUpload(file) {
      return this.$funcCommon.checkUploadExcelZize(file);
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      let bodyList = [];
      results.forEach((item) => {
        let i = 0;
        bodyList.push(
          this.loda.mapKeys(item, () => {
            i++;
            return "pro" + i;
          })
        );
      });
      http.post("/test/upload/excel", bodyList).then((resp) => {
        console.log(resp);
      });
    },

    changeText() {
      this.myVar2 = this.$funcCommon.removeSpaceAndAccent(this.myVar1);
    },
    exportToPDF() {
      let element = this.$refs.document;
      var opt = {
        margin: 0.2,
        filename: "myfile.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "A5", orientation: "portrait" },
      };
      html2pdf().from(element).set(opt).save();
    },
    reloadPage() {
      this.$router.go();
    },
    testMethod() {
      this.lastList = this.loda.fill(this.listTest, "g");
    },
    KKKK() {
      document.title = "My new title1";
      window.print();
    },
    AddP() {
      alert(this.$funcCommon.getDateFromMonthYear(2021, 4));
    },
  },
};
</script>
<style lang="scss" scoped>
@page {
  // margin: 5px;
  size: A5;
  //A5
  // size: 148mm 210mm;
  //A4
  // size: 210mm 297mm;
}
.classA {
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
input:focus,
textarea:focus {
  border: 1px solid #4aa3ff;
  outline: none;
}

/* .calendar-day {
  text-align: center;
  color: #202535;
  line-height: 30px;
  font-size: 12px;
} */
.mark {
  color: blue;
  background: red;
  padding: 20px;
}
/deep/.el-calendar-table {
  font-size: 20px;
  text-align: center;
}
/* #calendar .el-button-group > .el-button:not(:first-child):not(:last-child):after {
  content: "Current month";
} */
.hh {
  background: red;
}
@media screen and (min-width: 1367px) {
  .hh {
    height: 100px;
  }
}

@media screen and (max-width: 1366px) {
  .hh {
    height: 50px;
  }
}
</style>
