
export const styleExcel = {
  //Tên thuộc tính trong table
  fontTitle(){
    return { bold: true, sz: "11" };
  },
  alignmentTitle(){
    return { horizontal: "center", vertical: "center", wrapText:true };
  },
  borderTitle(){
    return {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  }
}