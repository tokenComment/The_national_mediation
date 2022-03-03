// pages/detailPage/detailPage.js
Page({ 
  
  data: {
    // banner 轮播图
    banner_list: [
      {
        type: 1,
        video: "https://www.runoob.com/try/demo_source/movie.mp4"}
    ],
    userId:'',//用户的id
    indicatorDots: true,
    autoplay: false, // 自动播放
    interval: 5000, //轮播时间
    duration: 300, // 滑动速度越大越慢
    circular: true, //是否循环
    beforeColor: "lightgray", //指示点颜色
    afterColor: "red", //当前选中的指示点颜色
    // 轮播数据 + 效果 E                                                 
    controls: false,
    //家具配置情况
    washing_machine:true,   //洗衣机
    air_conditioner:false,//空调1有/0无
    closet:false,//衣柜
    refrigerator:false,//冰箱
    calorifier:false,//热水器
    bed:false,//床
    tv:false,//电视
    wifi:false,//WIFI

    //基本参数
    houseType:'',//房屋类型
    subwayStation:'',//地铁站

    //费用详细
    discount_price:0,  //租金
    cash_pledge:0,//押金
    Administrative_fee:0,//管理费
    electric_charge:0,//电费
    water_rate:0,//水费
    commission:0,//佣金
    
    //房源视频路径
    videoPath:'',

    // 房源的所有数据
    renters_list_all:[],
    //房源的id
    videoId:"",
    detailVideo:[],  //房源的详细信息



    // 保障显示
    ensureOverflow: false,
    // 参数显示
    parameteraOverflow: false,
    //地理位置
    latitude:0,//纬度
    longitude: 0,//经度
    markers: [
      {
        latitude: 22.655473410209627,
        longitude: 114.02486917664336,
      }
    ],
    
  },

  //预览图片
  previewImage: function (e) {
    console.log(e.target.dataset.src);
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.banner_list,
      // urls: this.data.imgUrls // 需要预览的图片http链接列表
    });
  },
  // 播放
  videoPlay: function () {
    console.log("开始播放");
    var videoplay = wx.createVideoContext("video");
    videoplay.play();
    this.setData({
      controls: true,
    });
  },
  // 点击保障按钮
  clickEnsure: function () {
    this.setData({
      ensureOverflow: !this.data.ensureOverflow,
    });
  },
  // 点击参数按钮
  clickParametera: function() {
    this.setData({
      parameteraOverflow: !this.data.parameteraOverflow,
    });
  },
  // 初始化加载
  onLoad: function(option){

    let tempVideoId = "x";// 存放当前的视频id，用来搜索视频信息
    let that = this

    // console.log("接收参数:"+option.id)
    
    if( option.id != undefined)
    {
      //这里处理分享连接进入的业务
      wx.request({
        url: "https://weilaixiwang.mynatapp.cc/intermediary-service-back/video/getVideoList?token=123",
        success:(resData) => {
          if(resData.data!=0){
            console.log("视频数据"+resData.data[0]["propertyId"]);
            wx.setStorageSync('renters_list_all', resData.data);
          }
        }
      })
      tempVideoId = option.id;
      wx.setStorageSync('tempVideoId', tempVideoId);
      
      that.setVideoData()
    }else{
      const eventChannel = that.getOpenerEventChannel()
      eventChannel.emit('acceptDataFromOpenedPage', {data: '后线1'});
      eventChannel.emit('someEvent', {data: '后线2'});
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      wx.setStorageSync('tempVideoId','0')
  
      // 这里的代码是最后运行的
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log("接收数据")
        console.log(data.data);
        tempVideoId = data.data;
        
        //str表示的是视频的id
        wx.setStorageSync('tempVideoId', tempVideoId)
        
        that.setVideoData()
        
      })
    }
    
  },
  // 处理视频id在视频列表的逻辑算法
  setVideoData(){


    if (wx.getStorageSync('tempVideoId') != '0') {

   console.log("获取到的值" + wx.getStorageSync('tempVideoId'))

   this.data.renters_list_all = wx.getStorageSync('renters_list_all')
 
   //读取选取的视频列表中的视频的详细信息
   for (let index = 0; index < this.data.renters_list_all.length; index++) {
     //wx.getStorageSync('tempVideoId')是页面带来的视频id
     if (this.data.renters_list_all[index]["propertyId"] == wx.getStorageSync('tempVideoId')) {
       this.setData({
         detailVideo : this.data.renters_list_all[index]
       })
       break;
     }
   }

   console.log("类型"+this.data.detailVideo["houseType"]);
   this.setData({
     videoId:this.data.detailVideo["propertyId"],
     videoPath:this.data.detailVideo["videoPath"],
     discount_price:this.data.detailVideo["discountedPrice"],
     cash_pledge:this.data.detailVideo["cashPledge"],//押金
     Administrative_fee:this.data.detailVideo["administrativeFee"],//管理费
     electric_charge:this.data.detailVideo["electricCharge"],//电费
     water_rate:this.data.detailVideo["waterRate"],//水费
     houseType:this.data.detailVideo["houseType"],//房屋类型
     subwayStation:this.data.detailVideo["subwayStation"],//地铁站
     commission:this.data.detailVideo["commission"],//佣金
     latitude:this.data.detailVideo["latitude"],//纬度
     longitude:this.data.detailVideo["longitude"],//经度
     userId:this.data.detailVideo["userId"],
     markers: [
      {
        latitude: this.data.detailVideo["latitude"],
        longitude: this.data.detailVideo["longitude"],
      }
    ],
   })
 
   //判断家具是否有配套
   //洗衣机
   if (this.data.detailVideo["washingMachine"] == 1) {
     this.setData({
       washing_machine:true
     })
   } else {
     this.setData({
       washing_machine:false
     })
   };
 
    //判断家具是否有配套
   //空调
   if (this.data.detailVideo["airConditioner"] == 1) {
     this.setData({
       air_conditioner:true
     })
   } else {
     this.setData({
       air_conditioner:false
     })
   };
       //判断家具是否有配套
   //衣柜
   if (this.data.detailVideo["closet"] == 1) {
     this.setData({
       closet:true
     })
   } else {
     this.setData({
       closet:false
     })
   };
       //判断家具是否有配套
   //冰箱
   if (this.data.detailVideo["refrigerator"] == 1) {
     this.setData({
       refrigerator:true
     })
   } else {
     this.setData({
       refrigerator:false
     })
   };
       //判断家具是否有配套
   //热水器
   if (this.data.detailVideo["calorifier"] == 1) {
     this.setData({
       calorifier:true
     })
   } else {
     this.setData({
       calorifier:false
     })
   };
       //判断家具是否有配套
   //床
   if (this.data.detailVideo["bed"] == 1) {
     this.setData({
       bed:true
     })
   } else {
     this.setData({
       bed:false
     })
   };
       //判断家具是否有配套
   //电视
   if (this.data.detailVideo["tv"] == 1) {
     this.setData({
       tv:true
     })
   } else {
     this.setData({
       tv:false
     })
   };
           //判断家具是否有配套
   //WIFI
   if (this.data.detailVideo["wifi"] == 1) {
     this.setData({
       wifi:true
     })
   } else {
     this.setData({
       wifi:false
     })
   };
    }

  },
  /**
   * 点击分享触发的函数
   * @param {*} options 
   */
  onShareAppMessage: function( options ){

    /**
     * 显示当前页面的转发按钮
     * https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html
     */
    wx.showShareMenu({
      withShareTicket: true
    })
    
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "快来和我一起看看吧",    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/detailPage/detailPage',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res){
        // 转发成功之后的回调
        if(res.errMsg == 'shareAppMessage:ok'){
        }
      },
      fail: function(){
        // 转发失败之后的回调
        if(res.errMsg == 'shareAppMessage:fail cancel'){
          // 用户取消转发
        }else if(res.errMsg == 'shareAppMessage:fail'){
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      
    }
    // 来自页面内的按钮的转发
    if( options.from == 'button' ){

      var eData = options.target.dataset.videoid;

      /**
       * 日志调试
       */
      console.log("123:"+ eData);   // shareBtn
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/detailPage/detailPage?id=' + that.data.videoId;
    }
    // 返回shareObj
    return shareObj;
  },
  //进入客服按钮
  kehu_btn:function(e){

    wx.navigateTo({  //跳转到聊天界面
      url: '../chat/chat?userID=' + e.currentTarget.dataset.userid,
    })
  },
  /**
  * 向店铺的店铺页面跳转并传送数据
  * author 乔巴
  */
 shopFunc: function(e){

  console.log("界面参数值：  "+e.currentTarget.dataset.userid)
  let getUserId = e.currentTarget.dataset.userid;
  wx.navigateTo({
    url: '/pages/shop/shop',
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function(data) {
        console.log("前线1")
        console.log(data)
      },
      someEvent: function(data) {
        console.log("前线2")
        console.log(data)
      }
    },
    success: function(res) {
      // 通过eventChannel向被打开页面传送数据
      res.eventChannel.emit('acceptDataFromOpenerPage', { data: getUserId})
    }
  })
},
});
