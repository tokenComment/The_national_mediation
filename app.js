//app.js
App({
	 /**
   * 页面的初始数据
   */
  data: {
    
    openid:null,
    list : [] , 
		height : '100%' , 
		msg : '' , //信息存储
		scrollTop : 0 , 
		
		activeLook : 'w' , // 选择的表情包分组
		openLook : false , //打开选择表情包
		useLook : false , //选择好后表情包
		cursor : 0 , // 输入光标位置
    count : 0 , // 总人数
    avatarUrl:wx.getStorageSync('avatarUrl'),//本地头像
    socketTask : '' , //websocket对象
    errorCode : 0 , // 错误代码
    interval : 0 , // 定时器标识
    intervalNumber : 0 , // 定时重连的次数
    state : 0 , // 重连状态 0 离线 1 在线 2 重连
    bindMessage : 0 , // 绑定回调
    whether_sendMsg:0, //是否发送成功
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLaunch: function(options) {
		console.log("kaishi ")
    var _this = this;
    wx.getStorage({
      key: 'OPENID',
      success: function(res) {
        _this.setData({
          openid:res.data
        })
      },
    })
    var _this = this;

    if(_this.data.socketTask == "")  //如果连接不在的话就重新连接
    //建立连接
    _this.openConnect()

    // wx.connectSocket({
    //   url: 'wss://weilaixiwang.mynatapp.cc',
    // })

    // //连接成功
    // wx.onSocketOpen(function () {
    //   console.log('连接成功');
    // })
    // wx.onSocketMessage(function(res){
      
    //    var list = [];
    //    list = _this.data.newsList;
    //   var  _data = JSON.parse(res.data);
     
    //    list.push(_data);
    //    console.log(list)
    //    _this.setData({
    //      newsList:list
    //    })
       
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  //关闭连接
  back:function(){
    wx.closeSocket();
    console.log('连接断开');
  },
 
   
	// 连接服务器
	openConnect : function( ){
		if(!this.data.socketTask){
      console.log("连接的状态 = "+ this.data.state)
     
			this.data.socketTask = wx.connectSocket({
				url: 'wss://weilaixiwang.mynatapp.cc'
      });
      console.log("连接头 ： " + this.data.socketTask )
			// socket连接成功
			this.data.socketTask.onOpen(() => {
				if (this.data.state == 2) {
					this.data.state = 1;
					wx.showToast({
						icon : 'none' , 
						mask : true , 
						title : '服务器连接成功' , 
					})
					if (this.interval) {
						clearInterval(this.interval);//清空计时器，关闭计时器
					}
        }
        this.data.state = 1;
        console.log('连接服务器成功！' + this.data.socketTask);
        // let data = {
        //   data : "123" , 
        //   type : 1 , 
        //   time : this.getTime() , 
        //   ownId :  wx.getStorageSync('Encrypted_phone_number') , 
        //   otherId : '0'
        // };
        // this.data.socketTask.send({data : JSON.stringify(data)});
			
			})
			// socket连接错误
      this.data.socketTask.onError(this.errorConnect)
          // socket被关闭
      this.data.socketTask.onClose(this.colseConnect)
      
      
			
		}

	} , 
	getPager(){
		let pager = getCurrentPages()
		let page = pager[pager.length - 1]
		return page;
	} , 
	// 连接被关闭
	colseConnect : function(res){

    console.log("连接关闭 是否发送成功 = " + this.data.whether_sendMsg)
    this.data.socketTask = '';//清空websocket内容
    this.data.state = 0;//修改连接状态
    this.reconnect();
	} , 
	// 连接错误
	errorConnect : function(res){
		console.log('WebSocket连接打开失败，请检查！ ==' + this.data.whether_sendMsg)
		console.log(res);
		this.errorCode = 404;
		this.data.socketTask = '';
		if (this.data.state == 0) {
			// wx.showModal({
			// 	content : '服务器未开启' , 
			// 	confirmText : '尝试重连' , 
			// 	success : (res) => {
			// 		if (res.confirm) {
			// 			this.reconnect();
			// 		}
			// 	}
			// })
		}
	} , 
	// 重连机制
	reconnect : function(){
    
		this.data.state = 2; // 重连
		this.interval = setInterval(() => {
			this.intervalNumber ++;
			if (this.data.state == 1) {
				clearInterval(this.interval);
				return;
			}
			// wx.showToast({
			// 	icon : 'none' , 
			// 	mask : true , 
			// 	title : '正在重连第' + this.intervalNumber + '次' , 
			// 	// duration : 1500 ,
			// })
      // 定时检查服务器是否可连接
      
     
      this.openConnect();
      
      console.log("重新连接  + " )
		} , 200);
	} ,
  onShow: function(options){

  },
  onHide: function(){

  },
  onError: function(msg){

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function(options){

  }
})