// pages/home/home.js
import { request } from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    tuiGuang2List: [],
    // 响应式字体
    smallScreen: false,
    // 所有商品列表数据
    renters_list_all: [],
    //要显示的商品列表数据
    renters_list: [],
    //房源详细列表数据
    detailData:[],
    //每次加载的商品列表数据
    dataSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /**
     * 乔巴
     * 停止刷新
     */
    wx.stopPullDownRefresh();


    this.getSeviperList();
    this.getTuiGuang2List();
    if (wx.getSystemInfoSync().windowWidth < 370) {
      this.setData({
        smallScreen: true,
      });
    }
    this.postRentersList();
  },

  // 获取轮播图数据
  getSeviperList() {
    // 发送异步请求获取轮播图数据
    let request = wx.request({
      url: "https://www.fastmock.site/mock/405926450f4d7aaf4153a0c16b9ad424/intermediary/HomeLunBoTu",
      method: "GET",
      success: (result) => {
        this.setData({
          swiperList: result.data.data,
        });
      },
    });
  },

  // 获取推广栏2的数据
  getTuiGuang2List() {
    // 发送异步请求获取推广栏2的数据
    let request = wx.request({
      url: "https://www.fastmock.site/mock/405926450f4d7aaf4153a0c16b9ad424/intermediary/tuiGuangLan2",
      method: "GET",
      success: (result) => {
        this.setData({
          tuiGuang2List: result.data.data,
        });
      },
    });
  },

  //获取房源信息
  async postRentersList() {
    // const res = await request({
    //   url: "https://weilaixiwang.mynatapp.cc/intermediary-service-back/video/getVideoList?token=123",
    //   success :function(redata){
    //     console.log("视频数据"+redata)
    //   }
    // });
    await wx.request({
      url: "https://weilaixiwang.mynatapp.cc/intermediary-service-back/video/getVideoList?token=123",
      success:(resData) => {
        if(resData.data!=0){

          /**
           * 日志调试代码
           */
          console.log("视频数据"+resData.data[0]["propertyId"]);

          wx.setStorageSync('renters_list_all', resData.data);//将所有的房源都放到缓存中
          this.setData({
            renters_list_all: resData.data,
            renters_list: resData.data.slice(0, this.data.dataSize),
          });
        }
          

      }
    })
    // console.log("房源的数据=="+ res.data)
    
  },

  //点击收藏
  clickCollect: function (e) {

    //解密手机号吗：
    let phone = wx.getStorageSync('Encrypted_phone_number')-1111
      //调试
      console.log("加入心动的视频id = " + e.target.dataset.userid)
      //添加心动
      wx.request({
        url: 'https://weilaixiwang.mynatapp.cc/intermediary-service-back/video/addHoseInBeckoning',
        data:{
          token:123,
          userId:phone,//获取页面标签的data-后的参数
          hoseId:e.target.dataset.videoid
        }
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("开始加载下一轮");
    const renters_list_length = this.data.renters_list.length;
    const renters_list_all_length = this.data.renters_list_all.length;
    const dataSize = this.data.dataSize;
    console.log(this.data.renters_list.length);
    if (renters_list_length < renters_list_all_length) {
      if (renters_list_all_length - renters_list_length + dataSize > 0) {
        this.setData({
          renters_list: [
            ...this.data.renters_list,
            ...this.data.renters_list_all.slice(
              renters_list_length,
              renters_list_length + dataSize
            ),
          ],
        });
      } else {
        this.setData({
          renters_list: [
            ...this.data.renters_list,
            ...this.data.renters_list_all.slice(
              renters_list_length,
              renters_list_all_length
            ),
          ],
        });
      }
    } else {
      console.log("已经到最低了");
    }
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
  },/**
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

  /**
   * 乔巴
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    
  },
  /**
   * jian听下拉刷新事件，执行函数
   */
  onPullDownRefresh:function(){
    let that = this;
    that.postRentersList();
    that.onLoad()
    console.log("下拉")
  },
  /**
   * 超市按钮的函数
   */
  supermarket:function(){
    //界面跳转
    wx.navigateTo({
      url: '/pages/chat/chat',
    })
  }

});
