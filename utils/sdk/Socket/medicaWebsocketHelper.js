const app = getApp();
let medicaBase = app.globalData.medicaBase;
let lm600TcpApi = null

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
      deviceType: 0x800C,
      handler: (code, o) => {
        console.log("loginByToken:" + code + ",o:" + JSON.stringify(o));
        if (code == 0) {
          lm600TcpApi = new medicaBase.LM600TcpApi(client)
          // lm600TcpApi.registerRealDataCallback((res, val) => {
          //   console.log('real---', res, val)
          // })
          if (params && params.onSocketOpen) {
            params.onSocketOpen()
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


/**开始实时数据
 * start real time data
 * @param {*leftRight,*deviceId,*deviceType} data 
 */
function startRealtimeData(params) {
  if (lm600TcpApi) {
    lm600TcpApi.startRealData({
      networkDeviceId: params.data.deviceId,
      deviceId: params.data.deviceId,
      deviceType: params.data.deviceType,
      serialNumber: params.data.leftRight,
      handler: params.handler
    })
  }
}

/**停止实时数据
 * stop real time data
 * @param {*leftRight,*deviceId,*deviceType}
 */
function stopRealtimeData(params) {
  if (lm600TcpApi) {
    lm600TcpApi.stopRealData({
      networkDeviceId: params.data.deviceId,
      deviceId: params.data.deviceId,
      deviceType: params.data.deviceType,
      serialNumber: params.data.leftRight,
      handler: params.handler
    })
  }
}

/**停止采集
 * stop real time data
 * @param {*leftRight,*deviceId,*deviceType}
 */
function stopCollect(params) {
  if (lm600TcpApi) {
    lm600TcpApi.stopCollect({
      networkDeviceId: params.data.deviceId,
      deviceId: params.data.deviceId,
      deviceType: params.data.deviceType,
      serialNumber: params.data.leftRight,
      userId: params.data.userId,
      timestamp: new Date().getTime() / 1000,
      handler: params.handler
    })
  }
}

/**注册监听实时数据
 * stop real time data
 * @param callback 
 */
function registerRealDataCallback(callback){
  if (lm600TcpApi) {
    lm600TcpApi.registerRealDataCallback(callback)
  }
}

/**取消监听实时数据
 * stop real time data
 * @param callback 
 */
function unregisterRealDataCallback(id){
  if (lm600TcpApi) {
    lm600TcpApi.unregisterRealDataCallback(id)
  }
}


/**
 * 关闭websocket
 */
function closeWS() {
  console.log('closeSocket---')
  wx.closeSocket()
}

module.exports = {
  connectWS: connectWS,
  closeWS: closeWS,
  startRealtimeData: startRealtimeData,
  stopRealtimeData: stopRealtimeData,
  stopCollect: stopCollect,
  registerRealDataCallback: registerRealDataCallback,

}
