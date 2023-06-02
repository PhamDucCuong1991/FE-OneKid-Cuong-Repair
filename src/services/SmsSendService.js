import http from "../http-common";
class SmsSendService {

  searchSmsSend(dateStartEnd) {
    return http.get(`/schedulesms/search?dateStartEnd=${dateStartEnd}`);
  }
  createVerifyAccountKid(id,phone,appType) {
     return http.get(`/schedulesms/create-code?id=${id}&phone=${phone}&appType=${appType}`);
  }
  getKidsByIdClass(idClassList){
    return http.get(`/schedulesms/find-kids-byClass?idClassList=${idClassList}`);
  }
  getKidsByIdGrade(idGradeList){
    return http.get(`/schedulesms/find-kids-byGrade?idGradeList=${idGradeList}`);
  }

  getSmsFirebaseSendCustom(sendType, dataList){
    if(sendType=="smsType"){
      return http.post(`/smscustom/send-sms`,dataList);
    }else if(sendType=="firebaseType"){
      return http.post(`/smscustom/send-firebase`,dataList);
    }
  }

}
export default new SmsSendService();