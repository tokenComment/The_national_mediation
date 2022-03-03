// pages/beckoning/beckoning.js

import { request } from '../../request/index.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 响应式字体
    smallScreen: false,
    // 数据表有没有数据
    renters_list_data: false,
    // 所有数据
    renters_list_all: [],
    //要显示的数据
    renters_list: [],
    //每次加载的数据量
    dataSize: 10,  
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function () {
    if (wx.getSystemInfoSync().windowWidth < 370) {
      this.setData({
        smallScreen: true,
      });
    }

    this.data.renters_list_all = []

    console.log("清空数据")

    //判断用户是否登录
    if(wx.getStorageSync('Encrypted_phone_number') == ""){

      /**
       * 如果缓存的最新用户信息过期就跳转到登陆界面，电话号码为空的时候
       */
      wx.switchTab({
        url: '/pages/my/my',
      })
      return;
    }
    console.log("刷新")
    this.postRentersList();
  },
  
  /**
  * 向房源的详细页面跳转并传送数据
  * author 乔巴
  */
 detailFunc: function(e){

   console.log("界面参数值：  "+e.currentTarget.dataset.videoid)
   let getVideoId = e.currentTarget.dataset.videoid;


   for (let index = 0; index < this.data.renters_list_all.length; index++) {

     if (this.data.renters_list_all[index]["propertyId"] == getVideoId) {
       this.setData({
         detailData : this.data.renters_list_all[index]
       })
       break;
     }
     
   }
   wx.navigateTo({
     url: '/pages/detailPage/detailPage',
     events: {
       // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
       acceptDataFromOpenedPage: function(data) {
         console.log("前线3")
         console.log(data)
       },
       someEvent: function(data) {
         console.log("前线4")
         console.log(data)
       }
     },
     success: function(res) {
       // 通过eventChannel向被打开页面传送数据
       res.eventChannel.emit('acceptDataFromOpenerPage', { data: getVideoId})
     }
   })
 },

  //获取心动房源信息
  async postRentersList(){

    //头指针
    let that = this;

    /**
     * 调试模块信息
     */
    console.log("电话号码"+(wx.getStorageSync('Encrypted_phone_number')-1111))

    //解密手机号吗：
    let phone = wx.getStorageSync('Encrypted_phone_number')-1111

    console.log("电话号码 = "+phone)
    // 请求心动数据 结果集放在res中
    const res = await request({
      url: "https://weilaixiwang.mynatapp.cc/intermediary-service-back/video/findUserBeckoningAll",
    data:{
      token:123,
      userId:phone
    }
    });
    //声明数组来存放心动的视频结果数组
    let beckoningList = [];

    beckoningList = res.data["hoseList"]//从结果集中取到hoseList  格式：{"count":2,"hoseList":[]}

    let hoseVideoAll = wx.getStorageSync('renters_list_all')

    //循环读取心动的数据
    for (let index = 0; index < beckoningList.length; index++) {

      //所有房源数据
      for (let hoseAllIndex = 0; hoseAllIndex < hoseVideoAll.length; hoseAllIndex++) {
        
        if (beckoningList[index]["hoseId"] == hoseVideoAll[hoseAllIndex]["propertyId"] ) {
          that.data.renters_list_all.push(hoseVideoAll[hoseAllIndex]);
          continue;
        }
        
      }
    }
    console.log("完成心动数据的查找");
    this.setData({
      renters_list: that.data.renters_list_all.slice(0,this.data.dataSize),
      renters_list_data: true,
    });
  },

  //点击收藏
  clickCollect: function (e) {
    wx.showToast({
      title: "收藏失败!服务器没效应!",
      icon: "none",
    });
  },

  emptyFunc: function(){},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('开始加载下一轮')
    const renters_list_length = this.data.renters_list.length;
    const renters_list_all_length = this.data.renters_list_all.length;
    const dataSize = this.data.dataSize;
    console.log(this.data.renters_list.length);
    if (renters_list_length < renters_list_all_length) {
      if (renters_list_all_length - renters_list_length + dataSize > 0) {
        this.setData({
          renters_list:[...this.data.renters_list,...this.data.renters_list_all.slice(renters_list_length,renters_list_length+dataSize)],
        })
      } else {
        this.setData({
          renters_list:[...this.data.renters_list,...this.data.renters_list_all.slice(renters_list_length,renters_list_all_length)]
        })
      }

    } else {
      console.log('已经到最低了');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  /**
  * jian听下拉刷新事件，执行函数
  */
 onPullDownRefresh:function(){
   let that = this;
   that.onLoad()
   console.log("下拉")
 },
});
