// pages/renters/renters.js
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
    if (wx.getSystemInfoSync().windowWidth < 370) {
      this.setData({
        smallScreen: true,
      });
    }
    this.postRentersList();
  },

  //获取房源信息
  async postRentersList(){
    const res = await request({url: "https://www.fastmock.site/mock/405926450f4d7aaf4153a0c16b9ad424/intermediary/renters_list"});
    console.log('sfd');
    this.setData({
      renters_list_all: res.data.data,
      renters_list: res.data.data.slice(0,this.data.dataSize),
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
});
