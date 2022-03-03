// pages/shop/shop.js
import { request } from '../../request/index.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 响应式字体
    smallScreen: false,
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

    let userId = "";
    let that = this;


    if (wx.getSystemInfoSync().windowWidth < 370) {
      this.setData({
        smallScreen: true,
      });
    }

    const eventChannel = that.getOpenerEventChannel()
      eventChannel.emit('acceptDataFromOpenedPage', {data: '后线1'});
      eventChannel.emit('someEvent', {data: '后线2'});
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      wx.setStorageSync('str','0')
  
      // 这里的代码是最后运行的
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log("接收数据")
        console.log(data.data);
        userId = data.data
        /**
         * 调用
         */
        that.postRentersList(userId);
        
      })
  },

  //获取房源信息
 postRentersList(userId){

    let that = this;

    /**
     * 日志调试
     */
    console.log("geted userId = "+ userId)

    //设置缓存中所有房源的数据存放到变量renters_list_all中
    that.data.renters_list_all = wx.getStorageSync('renters_list_all');

    //循环房源列表
    for (let index = 0; index < that.data.renters_list_all.length; index++) {

      //过滤匹配用户的房源数据
      if(that.data.renters_list_all[index]["userId"] == userId){ 
          that.data.renters_list.push(that.data.renters_list_all[index])
      }
      
    }

    /**
     * 日志调试，查看用户房东房源列表
     */
    console.log("匹配的个数 = " + that.data.renters_list.length)

    that.setData({
      renters_list:that.data.renters_list
    })

    // const res = await request({url: "https://www.fastmock.site/mock/405926450f4d7aaf4153a0c16b9ad424/intermediary/renters_list"});
    // this.setData({
    //   renters_list_all: res.data.data,
    //   renters_list: res.data.data.slice(0,this.data.dataSize),
    // });
  },/**
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

  //点击收藏
  clickCollect: function (e) {
    wx.showToast({
      title: "收藏失败!服务器没效应!",
      icon: "none",
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
