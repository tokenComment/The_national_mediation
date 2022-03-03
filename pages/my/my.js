// pages/my/my.js
Page({
  data: {
    userInfo:{},
    hasUserInfo: false,
    token:'',
    isAuth:1,
    my_list_item: [
      
      {
        name: "信用分",
        url: "",
        open_type: "navigate",
      },
      {
        name: "账单",
        url: "",
        open_type: "navigate",
      },
      {
        name: "房租宝",
        url: "",
        open_type: "navigate",
      },
      {
        name: "订单",
        url: "",
        open_type: "navigate",
      },
      {
        name: "合同",
        url: "",
        open_type: "navigate",
      },
      {
        name: "保险",
        url: "",
        open_type: "navigate",
      },
      {
        name: "今年赚钱目标",
        url: "",
        open_type: "navigate",
      },
      {
        name: "被动收入",
        url: "",
        open_type: "navigate",
      },
      {
        name: "世界财富排名",
        url: "",
        open_type: "navigate",
      },
      {
        name: "邀请好友",
        url: "",
        open_type: "navigate",
      },
      {
        name: "全民中介规则",
        url: "",
        open_type: "navigate",
      },
      {
        name: "设置",
        url: "",
        open_type: "navigate",
      },
      {
        name: "注销",
        url: "",
        open_type: "navigate",
      },
      {
        name: "退出登录",
        url: "",
        open_type: "navigate",
      },
      {
        name: "关于我们",
        url: "",
        open_type: "navigate",
      },
      {
        name: "加入我们",
        url: "",
        open_type: "navigate",
      },
      {
        name: "公益中国",
        url: "",
        open_type: "navigate",
      },
      {
        name: "上传房源(需要中介权限)",
        url: "",
        open_type: "navigate",
      },
    ],
  },
  //获取手机号
  getPhoneNumber(e) {


    //查看session_key是否过期
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        //重新登录
        wx.login({
          success(res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://weilaixiwang.mynatapp.cc/service-console/user/auth',
                data: {
                  code: res.code,
                  token:123
                
                },
                header: {
                  'content-type': 'application/json' // 默认值
                }, method: "GET",
                success(res) {

                  // 将后台返回的session_key写入缓存
                  wx.setStorageSync("session_key", res.data.data["session_key"])
                }
              })
              console.log("登录成功了")
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })




    /**
     * author 乔巴
     * 解密手机号码明文
     */
    wx.request({
      url: 'https://weilaixiwang.mynatapp.cc/service-console/user/auth/phone',
      data: {
        token:123,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        session_key: wx.getStorageSync("session_key"),
        nickName: wx.getStorageSync("nickName"),
        avatarUrl: wx.getStorageSync("avatarUrl"),
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      }, method: "GET",
      success:(ress) => {
        

      // 将电话号码密文添加到缓存
      let temporary_phone = ress.data['phone'];  //temporary_phone 定义为是临时存放变量                
      wx.setStorageSync('Encrypted_phone_number', temporary_phone);  // 手机号码的密文存放在缓存中

      console.log("手机密文号码:" + temporary_phone);   //调试

        if (ress.data["msg"] == "获取失败") {
          // 提示框
          wx.showLoading({
            title: '登录失败重新操作',
          });
          setTimeout(function () {
            wx.hideLoading()
          }, 3000)
        } else {
          /**
           * 解密手机号码成功
           */
          if (ress.data["code"] == 100) {

            /**
      * author 乔巴
      * 功能：用户的角色选择
      * 请求参数：nickName ，tapIndex
      */
            wx.showActionSheet({
              itemList: ['我要租房', '成为中介', '我是房东'],
              success(res) {
                console.log(res.tapIndex)



                /**
                 * 注册用户的角色信息
                 */
                wx.request({
                  url: 'https://weilaixiwang.mynatapp.cc/service-console/user/addCharacterUser',
                  data: {
                    token:123,
                    userphone: wx.getStorageSync('Encrypted_phone_number'),//获取电话号码
                    myuserChara: res.tapIndex,
                    
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  }, method: "GET",
                  success(characterRes) {
                    console.log(characterRes)
                    console.log("用户的角色信息")
                  }, fail(res) {
                    console.log(res.errMsg)
                  }
                })
              },
              fail(res) {
                console.log(res.errMsg)
              }
            })
          }
        }

        this.setData({
          userInfo: wx.getStorageSync("userInfo"),
          hasUserInfo: true

        });
      }
      
    })





    // wx.request({
    //   url: 'https://weilaixiwang.mynatapp.cc/auth/phone', //仅为示例，并非真实的接口地址
    //   data: {
    //     encryptedData: e.detail.errMsg,
    //     iv: e.detail.iv,
    //     encryptedData: e.detail.encryptedData
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })

    console.log(e.detail.errMsg)
    console.log(e.detail.iv + "密钥")
    console.log(e.detail.encryptedData)


  },
  //获取用户姓名与头像
  getUserProfile(e) {
    /**
    *  Author  乔巴
    * 功能：登录函数将code传递给后端获取session_key,保存到缓存中，用来获取电话号码的明文
    */
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://weilaixiwang.mynatapp.cc/service-console/user/auth',
            data: {
              token:123,
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            }, method: "GET",
            success(res) {

              // 将后台返回的session_key写入缓存
              wx.setStorageSync("session_key", res.data.data["session_key"])


            }
          })
          console.log("登录成功了")
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    wx.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户的信息")
        console.log(res);
        console.log("获取到用户的昵称")
        console.log(res.userInfo.avatarUrl)

        /**
         * Author  乔巴
         * 功能: 将用户的昵称保存到缓存中用来传送到后端保存
         */
        wx.setStorageSync("nickName", res.userInfo.nickName)
        

        /**
         * Author 乔巴
         * 功能： 将用户的头像的url保存到缓存中用来传送到后端保存
         */
        wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl)

        wx.setStorageSync("userInfo", res.userInfo);

        this.setData({
          
          token:"非空",
          isAuth:0,
        
        });
      },
    });

   
  },
  /**
   * 初始化页面，判断缓存是否过期
   */
  onLoad:function(){
    if(wx.getStorageSync('avatarUrl')!="")
    {
      this.setData({
        hasUserInfo:true,
        userInfo:{
          avatarUrl:wx.getStorageSync('avatarUrl'),
          nickName:wx.getStorageSync('nickName')
        }
      })
    }
    console.log("用户信息页面 avatarUrl= " + wx.getStorageSync('avatarUrl'))
  }

});
