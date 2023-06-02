/* eslint-disable */
import { saveAs } from 'file-saver'
import XLSX from 'xlsx-style-correct'

function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        });
      };

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan)
        for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
};

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });
      if (typeof cell.v === 'number') cell.t = 'n'; 
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';
      
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), "test.xlsx")
}

function formatJson(filterVal, jsonData) {
  return jsonData.map((v) =>
    filterVal.map((j) => {
      return v[j];
    })
  );
}

export function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  filename,
  sheetName,
  title,
  merges = [],
  columnsWidth=[],
  autoWidth = false,
  checkCustom = "",
  bookType = 'xlsx',
  styleCols1,
  styleCols2,
  nameCol
} = {}) {
  debugger
  var wb = new Workbook();
  data.forEach(x=>{
  data=x.bodyList;
  data = formatJson(title, data);
  filename = filename || 'dataExcel'
  data = [...data]
  data.unshift(header);
  setDataList(x.headerList, title, data, x.sheetName,  merges, columnsWidth, autoWidth,checkCustom, wb, styleCols1, styleCols2, nameCol);
})

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), `${filename}.${bookType}`);
}


function setDataList(
  multiHeader,
  title,
  data,
  sheetName,
  merges,
  columnsWidth,
  autoWidth,
  checkCustom,
 wb,styleCols1, styleCols2, nameCol){
  multiHeader=formatJson(title, multiHeader);
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  var ws_name = sheetName||"mysheet1";
  var ws = sheet_from_array_of_arrays(data);
  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = [];
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }
  if (autoWidth) {
    debugger;
    const colWidth = data.map(row => row.map(val => {
      if (val == null) {
        return {
          'wch': 10
        };
      }else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        };
      }else {
        return {
          'wch': val.toString().length
        };
      }
      
    }))
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }else{
    let result = columnsWidth;
    for(let i=0; i<result.length;i++){
      result[i]['wch']=result[i].col
    }
    ws['!cols'] = result
  }

  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  
  var dataInfo = wb.Sheets[sheetName];
  const borderAll = {
    //Outside border of the cell
      top: {
        style: "thin"
      },
      bottom: {
        style: "thin"
      },
      left: {
        style: "thin"
      },
      right: {
        style: "thin"
      }
  };
  // Add borders to all cells
  for (var i in dataInfo) {
    if (i == '!ref' || i == '!merges' || i == '!cols') {
      
    } else {
      if(checkCustom == "tkb"|| checkCustom == "menu"){
        dataInfo[i + ''].s = {
          border: borderAll,
          font: { sz: "10" },
          alignment:{ wrapText: true },
        }
      }else{
        dataInfo[i + ''].s = {
          border: borderAll,
          font: { sz: "11" },
          alignment:{ horizontal: "center", vertical: "center", wrapText: true },
        }
      }
    }
  }

  getStyleColRow2(ws, styleCols2);
  getStyleColRow1(wb, styleCols1, sheetName||"mysheet1");
  if(nameCol != undefined){
    getNameColMerges(ws, nameCol);
  }

  if(checkCustom == "tkb"){
    getExcelTKB(ws);
  }
  
}
function getStyleColRow2(ws, style){
  debugger;
  if(style != undefined){
    for(var i = 0; i < style.length; i++){
      const range = XLSX.utils.decode_range(style[i].name);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
          if(cell == undefined){
          }else{
            cell.s = style[i].style;
          }
        }
      }
    }
  }
}
function getStyleColRow1(wb, styleCols1, sheetName){
  debugger;
  if(styleCols1 != undefined){
    var dataInfo = wb.Sheets[sheetName];
    for(var i = 0; i < styleCols1.length; i++){
      for(var j = 0; j< styleCols1[i].name.length; j++){
        if(dataInfo[styleCols1[i].name[j]] == undefined){
        }else{
          dataInfo[styleCols1[i].name[j]].s = styleCols1[i].style;
        }
      }
    }
  }
}

function getNameColMerges(ws, nameCol){
  if (!ws['!merges']) ws['!merges'] = [];
  const range1 = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range1.s.r; R <= range1.e.r; ++R) {
    for (let C = range1.s.c; C <= range1.e.c; ++C) {
      const cell1 = ws[XLSX.utils.encode_cell({ c: C, r: R })];
      if(cell1 == undefined){
      }else{
        if(cell1.v == nameCol.name){
          for(let i = 0 ; i <= range1.e.c ; i++){
            const cell2 = ws[XLSX.utils.encode_cell({ c: i, r: R })];
            cell2.s = nameCol.style
          }
          let colMerges1 = XLSX.utils.encode_cell({ c: C, r: R });
          let colMerges2 = XLSX.utils.encode_cell({ c: C + nameCol.numberMerges, r: R });
          ws['!merges'].push(XLSX.utils.decode_range(colMerges1+":"+colMerges2));
        }
      }
    }
  }
}

//css cứng TKB
function getExcelTKB(ws){
  var cellName1;
  var cellName2;
  var cellName3;
  const range1 = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range1.s.r; R <= range1.e.r; ++R) {
    for (let C = range1.s.c; C <= range1.e.c; ++C) {
      const cell1 = ws[XLSX.utils.encode_cell({ c: C, r: R })];
      if(cell1 != undefined){
        if(cell1.v == "Buổi sáng/Morning"){
          cellName1 = R;
        }
        if(cell1.v == "Buổi chiều/Afternoon"){
          cellName2 = R;
        }
        if(cell1.v == "Buổi tối/Evening"){
          cellName3 = R;
        }
      }
    }
  }
  const range2 = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range2.s.r; R <= range2.e.r; ++R) {
    for (let C = range2.s.c; C <= range2.e.c; ++C) {
      const cell1 = ws[XLSX.utils.encode_cell({ c: C, r: R })];
      if(cell1 != undefined){
        if(cell1.v == "Buổi sáng/Morning"){
          for(let i = cellName1 ; i < cellName2 ; i++){
            const cell2 = ws[XLSX.utils.encode_cell({ c: C, r: i })];
            cell2.s = {
              fill: { fgColor: { rgb: "95d240" } },
              font: { bold: true, sz: "11" },
              alignment:{ horizontal: "center", vertical: "center" },
              border:{
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              }
            }
          }
          let colMerges1 = XLSX.utils.encode_cell({ c: C, r: cellName1 });
          let colMerges2 = XLSX.utils.encode_cell({ c: C, r: cellName2-1 });
          ws['!merges'].push(XLSX.utils.decode_range(colMerges1+":"+colMerges2));
        }
        if(cell1.v == "Buổi chiều/Afternoon"){
          for(let i = cellName2 ; i < cellName3 ; i++){
            const cell2 = ws[XLSX.utils.encode_cell({ c: C, r: i })];
            cell2.s = {
              fill: { fgColor: { rgb: "ef965b" } },
              font: { bold: true, sz: "11" },
              alignment:{ horizontal: "center", vertical: "center" },
              border:{
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              }
            }
          }
          let colMerges1 = XLSX.utils.encode_cell({ c: C, r: cellName2 });
          let colMerges2 = XLSX.utils.encode_cell({ c: C, r: cellName3-1 });
          ws['!merges'].push(XLSX.utils.decode_range(colMerges1+":"+colMerges2));
        }
        if(cell1.v == "Buổi tối/Evening"){
          for(let i = cellName3 ; i <= range2.e.r ; i++){
            const cell2 = ws[XLSX.utils.encode_cell({ c: C, r: i })];
            cell2.s = {
              fill: { fgColor: { rgb: "efd139" } },
              font: { bold: true, sz: "11" },
              alignment:{ horizontal: "center", vertical: "center" },
              border:{
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              }
            }
          }
          let colMerges1 = XLSX.utils.encode_cell({ c: C, r: cellName3 });
          let colMerges2 = XLSX.utils.encode_cell({ c: C, r: range2.e.r });
          ws['!merges'].push(XLSX.utils.decode_range(colMerges1+":"+colMerges2));
        }
      }
    }
  }
}