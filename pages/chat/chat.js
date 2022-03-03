var utils = require("../utils/util.js")
var app = getApp()
Page({
  data:{
    input:null, //输入的数据
    newsList:[], //聊天数据
    // looks : app.globalData.looks , //表情包
  },

  onLoad:function(option){

    	// 收到服务器消息
    app.data.socketTask.onMessage((res) => {

      this.receiveMessage(res.data)

      console.log("收到服务器的消息" + res.data);
      
    })

  },

   // 接收到的值
   receiveMessage:function( res){
    let  _data = JSON.parse(res);//将字符串转为json格式的对象
    console.log("收到消息 " + _data.time);
    var list = [];
    list = this.data.newsList;
    let number = 0;
    var temp = { 'message': res, 'date': _data.time, type: 0 ,id: number++};
    list.push(temp);
    wx.setStorageSync('chatList', list)
    this.setData({
      newsList:list,
      input:null
    })
  },
  // 发送socket消息
	sendMsg : function(msg , type){
		var data = {
			data : msg , 
			type : type , 
			time : this.getTime() , 
			ownId :  wx.getStorageSync('Encrypted_phone_number') , 
			otherId : '12344'
    };
      console.log("----------------------------------------------------")
      console.log("开始发送")
      app.data.whether_sendMsg = 0;
      app.data.socketTask.send({data : JSON.stringify(data)});
      app.data.whether_sendMsg = 1
      console.log("发送成功 " )
      app.data.socketTask.colse({
        success: function() {
          console.log("连接已经将被关闭");
        }
      })
      if(app.data.state == 0){
        app.reconnect();
      }
    
		
		return data;
	} ,
  
	getTime : function(){
		var myDate = new Date();
		return myDate.toLocaleString();
	} , 
	// 显示消息
	showMsg : function(msg){
		var preg = /(\[([\:a-z0-9]+)\])/g , look = [] , names = [];
		// 匹配数据
		var data = msg.replace(preg , (arg1 , arg2 , arg3 , arg4 , arg5) => {
			let splits = arg3.split(':');
			if (splits[0] in this.globalData.looks) {
				let items = this.globalData.looks[splits[0]]
				items.forEach((item , index) => {
					if(item.name == splits[1]){
						names.push(item.url);
					}
				});
			}
			return '';
		});
		var pushItem = {msg : data};
		if(names.length > 0){
			pushItem.looks = names;
			pushItem.type = 'look';//表明是表情类型
		}
		return pushItem;
  } ,
  // 发送消息到对方
  sendMesg :function(){

    // console.log("电话号码 "+ wx.getStorageSync('Encrypted_phone_number'))
    console.log("连接的状态0断开1连接 "+ app.data.state)
    
    app.data.msg= this.data.input;


    if(app.data.state == 0){
      wx.setStorageSync('delayInfo', app.data.msg) //延迟信息 delayInfo
      app.reconnect();
      return;
      
    }
    console.log("开始发送信息0" + app.data.msg)
    if(!app.data.msg){
			return;
    }
    console.log("开始发送信息")
		this.sendMsg(app.data.msg , 'normal');
		this.setData({
			msg : '' , 
    })
    
    var list = [];
    list = this.data.newsList;
    var temp = { 'message': this.data.input, 'date': this.getTime() , type: 1 };
    list.push(temp);
    this.setData({
      newsList:list,
      input:null
    })
    
  },
  // 绑定输入框的值变化
  bindKeyInput:function(e){

    if(e.detail.value != " "){
      console.log("输入的值+"+ e.detail.value)
      this.setData({
        input: e.detail.value
      })
    }
  }
})