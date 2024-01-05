const app = getApp();
let medicaBase = app.globalData.medicaBase;

/*
 * 连接打开websocket
 参数：
 {
   data:{
    wsUrl: 
    deviceId: 
    deviceType: 
    leftRight: 
    sid: 
   }
   onSocketOpen:
   onSocketError:
   onSocketClose:
 }
 */
function connectWS(params) {
  console.log('--connectWS--', params)
  let client = new medicaBase.WXWebSocketClient(params.data.wsUrl);
  client.open(); //调用实例开启连接方法
  client.onOpen((res) => {
    console.log('WebSocket连接已打开！', res)
    //login
    let commWan = new medicaBase.MedicaCommonWAN(client);
    commWan.loginByToken({
      timeout: 5 * 1000,
      connectType: 0, //0表示长连接
      token: params.data.sid,
      deviceType: params.data.deviceType,
      handler: (code, o) => {
        console.log("loginByToken:" + code + ",o:" + JSON.stringify(o));
        if (code == 0) {
          if (params && params.onSocketOpen) {
            params.onSocketOpen(client)
          }
        }
        else {
          console.log('登录失败')
          if (params && params.onSocketError) {
            params.onSocketError({ code: null, reason: "login failed" })
          }
        }
      }
    })
  });
  client.onClose((res) => {/// 监听关闭连接回调
    console.log('###WebSocket 已关闭！')
    if (params && params.onSocketClose) {
      params.onSocketClose(res)
    }
  });
  client.onError((res) => {// 监听连接报错回调
    console.log('WebSocket连接打开失败，请检查！', res)
    if (params && params.onSocketError) {
      params.onSocketError(res)
    }
  });
  client.onPostMsg((res) => {
    console.log('onPostMsg-->', res)
  })
}

/*
 * 关闭websocket
 */
function closeWS() {
  console.log('closeSocket---')
  wx.closeSocket()
}

module.exports = {
  connectWS: connectWS,
  closeWS: closeWS
}
