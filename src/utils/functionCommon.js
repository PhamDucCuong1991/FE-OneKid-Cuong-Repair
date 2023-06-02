import moment from "moment";
import loda from "lodash";
export const funcCommon = {
   //hàm test
   functionName: (data) => {
      let a = data + "ff";
      alert(a);
   },
   //format money
   formatMoney(money) {
      if (typeof money == "number") {
         return new Intl.NumberFormat().format(money).replaceAll(",", ".")
      }
      return "Not number"
   },
   formarDDMMYYYY() {
      return moment().format("DD_MM_YYYY")
   },
   /**
    * convert month, year to date(YYYY-MM-DD)
    * @param {*} month 
    * @param {*} year 
    * @returns 
    */
   getDateFromMonthYear(year, month) {
      return moment([year, month - 1, 1]);
   },
   /**
    * chuyển đổi tiếng việt có dấu thành không dấu
    * @param {*} str 
    * @returns 
    */
   removeAccent(str) {
      if (typeof str == "string") {
         return loda.deburr(str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      }
      return "";
   },
   checkUploadExcelZize(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (isLt5M) {
         return true;
      }
      alert("Vui lòng chọn file có kích thước nhỏ hơn 5M")
      return false;
   },

   removeSpaceAndAccent(str) {
      return this.removeAccent(str.replace(/ /g, ""));
   },
   //background for header table
   tableHeaderColorFunction() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
   },
   quickOptionDate() {
      return {
         shortcuts: [
            {
               text: "Tuần trước",
               onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit("pick", [start, end]);
               },
            },
            {
               text: "1 tháng trước",
               onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit("pick", [start, end]);
               },
            },
            {
               text: "3 tháng trước",
               onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
                  picker.$emit("pick", [start, end]);
               },
            },
            {
               text: "6 tháng trước",
               onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
                  picker.$emit("pick", [start, end]);
               },
            },
         ],
      }
   }

}