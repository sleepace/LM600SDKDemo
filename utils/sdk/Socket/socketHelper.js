let heartInterval = null

/*
打开连接socket
参数：{
	data:{
		leftRight: *,
		deviceId: *,
		deviceType: *
	},
	onSocketOpen(res){

	},
	onSocketError(res){

	},
	onSocketClose(res){

	},
	onSocketMessage(res){

	}
}
*/
function connectWS(params) {
	var that = this
	wx.connectSocket({
		url: params.data.wsUrl,
	})

	wx.onSocketOpen((result) => {
		console.log('WebSocket连接已打开！', res)
		that.heartInterval && clearInterval(that.heartInterval)
		that.heartInterval = setInterval(() => {
			that.sendHeartbeatData(params.data)
		}, 20 * 1000)
		if (params && params.onSocketOpen) {
			params.onSocketOpen(res)
		}
	})

	wx.onSocketError(function (res) {
		console.log('WebSocket连接打开失败，请检查！', res)
		that.heartInterval && clearInterval(that.heartInterval)
		if (params && params.onSocketError) {
			params.onSocketError(res)
		}
	})

	wx.onSocketClose(function (res) {
		console.log('###WebSocket 已关闭！')
		that.heartInterval && clearInterval(that.heartInterval)
		if (params && params.onSocketClose) {
			params.onSocketClose(res)
		}
	})

	wx.onSocketMessage(function (res) {
		console.log('onSocketMessage---', res)
		var jsonData = JSON.parse(res.data)
		if (params && params.onSocketMessage) {
			params.onSocketMessage(jsonData)
		}
	})
}

/**
 * 关闭websocket
 */
function closeWS() {
	wx.closeSocket()
}

/**登录设备
 * login device
 * @param {*leftRight,*deviceId,*deviceType} data 
 */
function login(data) {
	const _data = Object.assign({}, data);
	_data.msgType = 1000
	this.sendMessage(_data)
}

/**开始实时数据
 * start real time data
 * @param {*leftRight,*deviceId,*deviceType} data 
 */
function startRealtimeData(data) {
	const _data = Object.assign({}, data);
	_data.msgType = 1003
	this.sendMessage(_data)
}

/**停止实时数据
 * stop real time data
 * @param {*leftRight,*deviceId,*deviceType}
 */
function stopRealtimeData(data) {
	const _data = Object.assign({}, data);
	_data.msgType = 1004
	this.sendMessage(_data)
}


/**心跳包
 * heartbeat Data
 * @param {*leftRight,*deviceId,*deviceType}
 */
function sendHeartbeatData(data) {
	const _data = Object.assign({}, data);
	_data.msgType = 5010
	this.sendMessage(_data)
}

/**
 * 发送数据
 * 
 * @param {} data 
 */
function sendMessage(data) {
	//  1000 log in
	//  1001 start working
	//  1002 stop working
	//  1003 start real time
	//  1004 stop real time
	const msg = {
		messageid: 'xxse',
		type: data.msgType,
		leftRright: data.leftRight,
		deviceId: data.deviceId,
		deviceType: data.deviceType,
		sid: '',
	}
	console.log('socket message---', msg)
	wx.sendSocketMessage({
		data: JSON.stringify(msg)
	})
}

module.exports = {
	connectWS: connectWS,
	closeWS: closeWS,
	sendMessage: sendMessage,
	login: login,
	startRealtimeData: startRealtimeData,
	stopRealtimeData: stopRealtimeData,
	sendHeartbeatData: sendHeartbeatData

}

