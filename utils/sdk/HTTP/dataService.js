const baseService = require('./baseService.js')
const app = getApp();

/*
名称： 日报告数据
参数：
  {
    data:{
      startTime: (Integer）开始时间戳,
      num: 返回记录数目,
      order: 返回数据顺序，0降序，1升序，
      deviceType: 设备类型(可选)
    }
  }
返回结果：
*/
function getDailyReport(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.data.getDailyReport;
  baseService.request(_params);
}

/*
名称： 日报告分数
参数：
  {
    data:{
      startTime: (Integer）开始时间戳,
      endTime: 截止时间戳,
      dateFormate: 返回日期格式（yyyy-MM-dd）
    }
  }
返回结果：
*/
function getReportScore(params) {
  const _params = Object.assign({}, params);
  _params.url = baseService.urlList.data.getReportScore;
  baseService.request(_params);
}



module.exports = {
  getDailyReport: getDailyReport,
  getReportScore: getReportScore
}