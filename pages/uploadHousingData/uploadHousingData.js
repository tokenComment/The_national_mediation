// pages/index/index.js
var zhuan_dingwei = require('../../lib/dingwei.js');  //引入外部的js文件

Page({

  /**
   * 页面的初始数据
   */
  data: {

    videoUrl: '',  //视频的路径
    poster: '',  //海报
    duration: '',   // 时长

    Administrative_fee:0,   //管理费
    cash_pledge:0,       //押金
    commission:0,        //佣金
    discount_price:0,   // 租金
    furniture:[],     //配套的设施
    water_rate:0,     //水费
    electric_charge:0,  //电费
    household_type:'',//房型
    latitude:0,        //纬度
    longitude:0,       //经度
    speed:0,      //速度
    accuracy:0,    //精度

    clickFlag:true, //防重复点击
    progressBar:0,  //进度条的值
    imgs: [],       //存放图片的地址
    max_imgs_count:4,    //最多的图片张树   
    multiIndex: [0, 0, 0],
    //房型的默认选项
    index: -1,
    //房型
    household_type_array: ['单房', '一房一厅', '两房一厅'],
    //地区换名
    Housing_address: "",
    //默认地址滚动栏的可视数据
    multiArray: [
      ['区域'],
      ['罗湖区', '福田区', '南山区', '盐田区', '宝安区', '龙岗区', '龙华区', '光明区', '坪山区', '大鹏新区'],
      ['布心', '百仕达', '翠竹', '春风路', '地王', '东门', '黄贝岭', '洪湖', '黄木岗', '莲塘', '罗湖口岸', '螺岭', '清水河', '笋岗', '万象城', '新秀', '银湖']
    ],
    //地铁站换名
    subway_station: "",
    //默认地铁滚动栏的可视数据
    multiArray2: [
      ['地铁'],
      ['1号线(罗宝线)', '2号线(蛇口线)', '3号线(龙岗线)', '4号线(龙华线)', '5号线(环中线)', '6号线', '7号线', '8号线', '9号线', '10号线', '11号线'],
      ['罗湖', '国贸', '老街', '大剧院', '科学馆', '华强路', '岗厦', '会展中心', '购物公园', '香蜜湖', '车公庙', '竹子林', '侨城东', '华侨城', '世界之窗', '白石洲', '高新园', '深大', '桃园', '大新', '鲤鱼门', '前海湾', '新安', '宝安中心', '宝体', '坪洲', '西乡', '固戍', '后瑞', '机场东'],
    ],
    //被选择的每一个列的序列号的初始值（从0开始）（列：（0，3，1）现在被选的是第1列第1行数据，第2列第4行数据，第3列第2行数据）
    multiIndex2: [0, 0, 0],
  },
  //修改房型
  fangXingPicker: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  detailed_address_selection_function: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    //e.detail.column 是列 , data.multiIndex[0]是第1行
    data.multiIndex[e.detail.column] = e.detail.value;
    //每次选择后都会重新刷新整个滚动条
    switch (e.detail.column) {
      /**
       * 修改第一列的时候需要修改两列数据，修改第二列的时候需要修改一列数据。
       * 修改第1列的时候，就更改第2和第3列的数据，
       * 修改第2列的时候，就更改第3列的数据
       * 修改第3列的时候不需要修改别的数据
       */
      //修改第1列的时候
      case 0:
        //判断选择的值在第一列的哪一行
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['罗湖区', '福田区', '南山区', '盐田区', '宝安区', '龙岗区', '龙华区', '光明区', '坪山区', '大鹏新区'];
            //选择第二列后默认显示的第三列数据
            data.multiArray[2] = ['布心', '百仕达', '翠竹', '春风路', '地王', '东门', '黄贝岭', '洪湖', '黄木岗', '莲塘', '罗湖口岸', '螺岭', '清水河', '笋岗', '万象城', '新秀', '银湖'];
            break;
          case 1:
            data.multiArray[1] = ['1号线(罗宝线)', '2号线(蛇口线)', '3号线(龙岗线)', '4号线(龙华线)', '5号线(环中线)', '6号线', '7号线', '8号线', '9号线', '10号线', '11号线'];
            //选择第二列后默认显示的第三列数据
            data.multiArray[2] = ['罗湖', '国贸', '老街', '大剧院', '科学馆', '华强路', '岗厦', '会展中心', '购物公园', '香蜜湖', '车公庙', '竹子林', '侨城东', '华侨城', '世界之窗', '白石洲', '高新园', '深大', '桃园', '大新', '鲤鱼门', '前海湾', '新安', '宝安中心', '宝体', '坪洲', '西乡', '固戍', '后瑞', '机场东'];
            break;
        }
        //修改第一列的时候第二列和第三列的数据默认为第一行
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
        //修改第2列的时候
      case 1:
        //判断选择的值在第一列的哪一行
        switch (data.multiIndex[0]) {
          case 0:
            //判断选择的值在第二列的哪一行
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['布心', '百仕达', '翠竹', '春风路', '地王', '东门', '黄贝岭', '洪湖', '黄木岗', '莲塘', '罗湖口岸', '螺岭', '清水河', '笋岗', '万象城', '新秀', '银湖'];
                break;
              case 1:
                data.multiArray[2] = ['八卦岭', '百花', '车公庙', '赤尾', '福田中心', '福田保税区', '皇岗', '华强南', '华强北', '黄木岗', '景田', '莲花', '梅林', '上步', '石厦', '上下沙', '沙尾', '香蜜湖', '新洲', '香梅北', '银湖', '园岭', '竹子林'];
                break;
              case 2:
                data.multiArray[2] = ['白石洲', '大学城', '红树湾', '华侨城', '后海', '科技园', '南山中心', '南头', '前海', '蛇口', '深圳湾', '西丽'];
                break;
              case 3:
                data.multiArray[2] = ['梅沙', '沙头角', '盐田港'];
                break;
              case 4:
                data.multiArray[2] = ['宝安中心', '碧海', '福永', '翻身', '石岩', '松岗', '沙井', '桃源居', '西乡', '新安', '曦城'];
                break;
              case 5:
                data.multiArray[2] = ['坂田', '布吉街', '布吉南岭', '布吉关', '布吉大芬', '布吉水径', '布吉石芽岭', '大运新城', '丹竹头', '横岗', '龙岗双龙', '龙岗中心城', '龙岗宝荷', '民治', '坪地', '平湖'];
                break;
              case 6:
                data.multiArray[2] = ['坂田', '观澜', '红山', '龙华中心', '龙华新区', '梅林关', '石岩', '上塘'];
                break;
              case 7:
                data.multiArray[2] = ['公明', '桃源居'];
                break;
              case 8:
                data.multiArray[2] = ['坪山'];
                break;
              case 9:
                data.multiArray[2] = ['大鹏半岛'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['罗湖', '国贸', '老街', '大剧院', '科学馆', '华强路', '岗厦', '会展中心', '购物公园', '香蜜湖', '车公庙', '竹子林', '侨城东', '华侨城', '世界之窗', '白石洲', '高新园', '深大', '桃园', '大新', '鲤鱼门', '前海湾', '新安', '宝安中心', '宝体', '坪洲', '西乡', '固戍', '后瑞', '机场东'];
                break;
              case 1:
                data.multiArray[2] = ['新秀', '黄贝岭', '湖贝', '大剧院', '燕南', '华强北', '岗厦北', '市民中心', '福田', '莲花西', '景田', '香梅北', '香蜜', '侨香', '安托山', '深康', '侨城北', '世界之窗', '红树湾', '科苑', '后海', '登良', '海月', '湾厦', '东角头', '水湾', '海上世界', '蛇口港', '赤湾', '莲塘'];
                break;
              case 2:
                data.multiArray[2] = ['益田', '石厦', '购物公园', '福田', '少年宫', '莲花村', '华新', '通新岭', '红岭', '老街', '晒布', '翠竹', '田贝', '水贝', '草埔', '布吉', '木棉湾', '大芬', '丹竹头', '六约', '塘坑', '横岗', '永湖', '荷坳', '大运', '爱联', '吉祥', '龙城广场', '南联', '双龙'];
                break;
              case 3:
                data.multiArray[2] = ['福田口岸', '福民', '会展中心', '市民中心', '少年宫', '莲花北', '上梅林', '民乐', '白石龙', '深圳北站', '红山', '上塘', '龙胜', '龙华', '清湖', '清湖北', '竹村', '茜坑', '长湖', '观澜', '松元厦', '观澜湖', '牛湖'];
                break;
              case 4:
                data.multiArray[2] = ['赤湾', '荔湾', '铁路公园', '妈湾', '前湾公园', '前湾', '桂湾', '前海湾', '临海', '宝华', '宝安中心', '翻身', '灵芝', '洪浪北', '兴东', '留仙洞', '西丽', '大学城', '塘朗', '长岭陂', '深圳北站', '民治', '五和', '坂田', '杨美', '上水径', '下水径', '长龙', '布吉', '百鸽笼', '布心', '太安', '怡景', '黄贝岭'];
                break;
              case 5:
                data.multiArray[2] = ['公明广场', '松岗', '溪头', '松岗公园', '薯田埔', '合水口', '红花山', '楼村', '科学公园', '光明', '光明大街', '凤凰城', '长圳', '上屋', '官田', '阳台山东', '元芬', '上芬', '红山', '深圳北站', '梅林关', '翰岭', '银湖', '八卦岭', '体育中心', '通新岭', '科学馆'];
                break;
              case 6:
                data.multiArray[2] = ['西丽湖', '西丽', '茶光', '珠光', '龙井', '桃源村', '深云', '安托山', '农林', '车公庙', '上沙', '沙尾', '石厦', '皇岗村', '福民', '皇岗口岸', '赤尾', '华强南', '华强北', '华新', '黄木岗', '八卦岭', '红岭北', '笋岗', '洪湖', '田贝', '太安'];
                break;
              case 7:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 8:
                data.multiArray[2] = ['莲塘', '梧桐山南', '沙头角', '海山', '深外高中', '盐田路'];
                break;
              case 9:
                data.multiArray[2] = ['前湾', '梦海', '怡海', '荔林', '南油西', '南油', '南山书城', '深大南', '粤海门', '高新南', '红树湾', '深圳湾公园', '下沙', '车公庙', '香梅', '景田', '梅景', '下梅林', '梅村', '上梅林', '孖岭', '银湖', '泥岗', '红岭北', '园岭', '红岭', '红岭南', '鹿丹村', '人民南', '向西村', '文锦'];
                break;
              case 10:
                data.multiArray[2] = ['双拥街', '平湖', '禾花', '华南城', '木古', '上李朗', '凉帽山', '甘坑', '雪象', '岗头', '华为', '贝尔路', '坂田北', '五和', '光雅园', '南坑', '雅宝', '孖岭', '冬瓜岭', '莲花村', '岗厦', '福民', '福田口岸'];
                break;
              case 11:
                data.multiArray[2] = ['碧头', '松岗', '后亭', '沙井', '马安山', '塘尾', '桥头', '福永', '机场北', '机场', '碧海湾', '宝安', '前海湾', '南山', '后海', '红树湾南', '车公庙', '福田'];
                break;
            }
            break;
        }
        //修改第二列的时候第三列的数据默认为第一行
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
    this.setData({
      Housing_address: '广东省深圳市' + data.multiArray[1][data.multiIndex[1]] + data.multiArray[2][data.multiIndex[2]],
    });
  },
  house_type_selection_function: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    //e.detail.column 是列 , data.multiIndex2[0]是第1行
    data.multiIndex2[e.detail.column] = e.detail.value;
    //每次选择后都会重新刷新整个滚动条
    switch (e.detail.column) {
      /**
       * 修改第一列的时候需要修改两列数据，修改第二列的时候需要修改一列数据。
       * 修改第1列的时候，就更改第2和第3列的数据，
       * 修改第2列的时候，就更改第3列的数据
       * 修改第3列的时候不需要修改别的数据
       */
      //修改第1列的时候
      case 0:
        //判断选择的值在第一列的哪一行
        switch (1) {
          case 0:
            data.multiArray2[1] = ['罗湖区', '福田区', '南山区', '盐田区', '宝安区', '龙岗区', '龙华区', '光明区', '坪山区', '大鹏新区'];
            //选择第二列后默认显示的第三列数据
            data.multiArray2[2] = ['布心', '百仕达', '翠竹', '春风路', '地王', '东门', '黄贝岭', '洪湖', '黄木岗', '莲塘', '罗湖口岸', '螺岭', '清水河', '笋岗', '万象城', '新秀', '银湖'];
            break;
          case 1:
            data.multiArray2[1] = ['1号线(罗宝线)', '2号线(蛇口线)', '3号线(龙岗线)', '4号线(龙华线)', '5号线(环中线)', '6号线', '7号线', '8号线', '9号线', '10号线', '11号线'];
            //选择第二列后默认显示的第三列数据
            data.multiArray2[2] = ['罗湖', '国贸', '老街', '大剧院', '科学馆', '华强路', '岗厦', '会展中心', '购物公园', '香蜜湖', '车公庙', '竹子林', '侨城东', '华侨城', '世界之窗', '白石洲', '高新园', '深大', '桃园', '大新', '鲤鱼门', '前海湾', '新安', '宝安中心', '宝体', '坪洲', '西乡', '固戍', '后瑞', '机场东'];
            break;
        }
        //修改第一列的时候第二列和第三列的数据默认为第一行
        data.multiIndex2[1] = 0;
        data.multiIndex2[2] = 0;
        break;
        //修改第2列的时候
      case 1:
        //判断选择的值在第一列的哪一行
        switch (data.multiIndex2[0]) {
          case 0:
            //判断选择的值在第二列的哪一行
            switch (data.multiIndex2[1]) {
              case 0:
                data.multiArray2[2] = ['布心', '百仕达', '翠竹', '春风路', '地王', '东门', '黄贝岭', '洪湖', '黄木岗', '莲塘', '罗湖口岸', '螺岭', '清水河', '笋岗', '万象城', '新秀', '银湖'];
                break;
              case 1:
                data.multiArray2[2] = ['八卦岭', '百花', '车公庙', '赤尾', '福田中心', '福田保税区', '皇岗', '华强南', '华强北', '黄木岗', '景田', '莲花', '梅林', '上步', '石厦', '上下沙', '沙尾', '香蜜湖', '新洲', '香梅北', '银湖', '园岭', '竹子林'];
                break;
              case 2:
                data.multiArray2[2] = ['白石洲', '大学城', '红树湾', '华侨城', '后海', '科技园', '南山中心', '南头', '前海', '蛇口', '深圳湾', '西丽'];
                break;
              case 3:
                data.multiArray2[2] = ['梅沙', '沙头角', '盐田港'];
                break;
              case 4:
                data.multiArray2[2] = ['宝安中心', '碧海', '福永', '翻身', '石岩', '松岗', '沙井', '桃源居', '西乡', '新安', '曦城'];
                break;
              case 5:
                data.multiArray2[2] = ['坂田', '布吉街', '布吉南岭', '布吉关', '布吉大芬', '布吉水径', '布吉石芽岭', '大运新城', '丹竹头', '横岗', '龙岗双龙', '龙岗中心城', '龙岗宝荷', '民治', '坪地', '平湖'];
                break;
              case 6:
                data.multiArray2[2] = ['坂田', '观澜', '红山', '龙华中心', '龙华新区', '梅林关', '石岩', '上塘'];
                break;
              case 7:
                data.multiArray2[2] = ['公明', '桃源居'];
                break;
              case 8:
                data.multiArray2[2] = ['坪山'];
                break;
              case 9:
                data.multiArray2[2] = ['大鹏半岛'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex2[1]) {
              case 0:
                data.multiArray2[2] = ['罗湖', '国贸', '老街', '大剧院', '科学馆', '华强路', '岗厦', '会展中心', '购物公园', '香蜜湖', '车公庙', '竹子林', '侨城东', '华侨城', '世界之窗', '白石洲', '高新园', '深大', '桃园', '大新', '鲤鱼门', '前海湾', '新安', '宝安中心', '宝体', '坪洲', '西乡', '固戍', '后瑞', '机场东'];
                break;
              case 1:
                data.multiArray2[2] = ['新秀', '黄贝岭', '湖贝', '大剧院', '燕南', '华强北', '岗厦北', '市民中心', '福田', '莲花西', '景田', '香梅北', '香蜜', '侨香', '安托山', '深康', '侨城北', '世界之窗', '红树湾', '科苑', '后海', '登良', '海月', '湾厦', '东角头', '水湾', '海上世界', '蛇口港', '赤湾', '莲塘'];
                break;
              case 2:
                data.multiArray2[2] = ['益田', '石厦', '购物公园', '福田', '少年宫', '莲花村', '华新', '通新岭', '红岭', '老街', '晒布', '翠竹', '田贝', '水贝', '草埔', '布吉', '木棉湾', '大芬', '丹竹头', '六约', '塘坑', '横岗', '永湖', '荷坳', '大运', '爱联', '吉祥', '龙城广场', '南联', '双龙'];
                break;
              case 3:
                data.multiArray2[2] = ['福田口岸', '福民', '会展中心', '市民中心', '少年宫', '莲花北', '上梅林', '民乐', '白石龙', '深圳北站', '红山', '上塘', '龙胜', '龙华', '清湖', '清湖北', '竹村', '茜坑', '长湖', '观澜', '松元厦', '观澜湖', '牛湖'];
                break;
              case 4:
                data.multiArray2[2] = ['赤湾', '荔湾', '铁路公园', '妈湾', '前湾公园', '前湾', '桂湾', '前海湾', '临海', '宝华', '宝安中心', '翻身', '灵芝', '洪浪北', '兴东', '留仙洞', '西丽', '大学城', '塘朗', '长岭陂', '深圳北站', '民治', '五和', '坂田', '杨美', '上水径', '下水径', '长龙', '布吉', '百鸽笼', '布心', '太安', '怡景', '黄贝岭'];
                break;
              case 5:
                data.multiArray2[2] = ['公明广场', '松岗', '溪头', '松岗公园', '薯田埔', '合水口', '红花山', '楼村', '科学公园', '光明', '光明大街', '凤凰城', '长圳', '上屋', '官田', '阳台山东', '元芬', '上芬', '红山', '深圳北站', '梅林关', '翰岭', '银湖', '八卦岭', '体育中心', '通新岭', '科学馆'];
                break;
              case 6:
                data.multiArray2[2] = ['西丽湖', '西丽', '茶光', '珠光', '龙井', '桃源村', '深云', '安托山', '农林', '车公庙', '上沙', '沙尾', '石厦', '皇岗村', '福民', '皇岗口岸', '赤尾', '华强南', '华强北', '华新', '黄木岗', '八卦岭', '红岭北', '笋岗', '洪湖', '田贝', '太安'];
                break;
              case 7:
                data.multiArray2[2] = ['青蛙', '娃娃鱼'];
                break;
              case 8:
                data.multiArray2[2] = ['莲塘', '梧桐山南', '沙头角', '海山', '深外高中', '盐田路'];
                break;
              case 9:
                data.multiArray2[2] = ['前湾', '梦海', '怡海', '荔林', '南油西', '南油', '南山书城', '深大南', '粤海门', '高新南', '红树湾', '深圳湾公园', '下沙', '车公庙', '香梅', '景田', '梅景', '下梅林', '梅村', '上梅林', '孖岭', '银湖', '泥岗', '红岭北', '园岭', '红岭', '红岭南', '鹿丹村', '人民南', '向西村', '文锦'];
                break;
              case 10:
                data.multiArray2[2] = ['双拥街', '平湖', '禾花', '华南城', '木古', '上李朗', '凉帽山', '甘坑', '雪象', '岗头', '华为', '贝尔路', '坂田北', '五和', '光雅园', '南坑', '雅宝', '孖岭', '冬瓜岭', '莲花村', '岗厦', '福民', '福田口岸'];
                break;
              case 11:
                data.multiArray2[2] = ['碧头', '松岗', '后亭', '沙井', '马安山', '塘尾', '桥头', '福永', '机场北', '机场', '碧海湾', '宝安', '前海湾', '南山', '后海', '红树湾南', '车公庙', '福田'];
                break;
            }
            break;
        }
        //修改第二列的时候第三列的数据默认为第一行
        data.multiIndex2[2] = 0;
        console.log(data.multiIndex2);
        break;
    }
    this.setData(data);
    this.setData({
      subway_station: data.multiArray2[2][data.multiIndex2[2]] + '地铁站',
    });
  },

  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res)=> {
       let phone = wx.getStorageSync('user_only_ID');
       phone = phone -1111;//解密
       console.log("获取的电话号码是：：：="+phone)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= that.data.max_imgs_count) {
           //超出最大设定值的提示框函数
            wx.showLoading({
              title: '已超出范围 :)',
            });

            //隐藏提示框函数
            setTimeout(function () {
              wx.hideLoading()
            }, 2000);

            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  /**
   * @author 乔巴
   * @param {*} e 
   * 功能： 选择待上传的视频函数
   */
  chooseVideo:function(e){

    this.setData({clickFlag: false});

    let that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
      // maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: 'back',//默认拉起的是前置或者后置摄像头，默认back
      compressed: true,//是否压缩所选择的视频文件
      success: function(res){
      
        let tempFilePath = res.tempFilePath//选择定视频的临时文件路径（本地路径）
        let duration = res.duration //选定视频的时间长度
        let size = parseFloat(res.size/1024/1024).toFixed(1) //选定视频的数据量大小
       
        // let height = res.height //返回选定视频的高度
        // let width = res.width //返回选中视频的宽度
        // that.data.duration = duration
        console.log(size)
        
        if(parseFloat(size) > 50){
          that.setData({
            clickFlag: true,
            duration: ''
          })
          let beyondSize = parseFloat(size) - 100
          wx.showToast({
            title: '尊敬的用户上传的视频大小超限，超出'+beyondSize+'MB,请重新上传',
            //image: '',//自定义图标的本地路径，image的优先级高于icon
            fail:"失败",
            icon:'none'
          })
        }else{
          //2.本地视频资源上传到服务器
          console.log(tempFilePath)
          //that.uploadFile(tempFilePath)

          that.setData({
            videoUrl: tempFilePath
          })
        }
      },
      fail: function() {
        that.setData({
          clickFlag: true,
          duration: ''
        })
        console.log("没有选择视频")
        wx.showToast({
          title: '需要选择一个视频文件哦！！',
          icon: 'none'
        })
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * @author 乔巴
   * 将本地资源上传到服务器
   * 提交按钮功能函数
   */
  uploadFile:function(tempFilePath){
    console.log("开始调用");
    let that = this
   
    let Encrypted_phone_number = wx.getStorageSync('Encrypted_phone_number')//获取手机加密号
    

    console.log("家具数组"+that.data.Administrative_fee)
    console.log("家具数组"+that.data.commission)
    console.log("家具数组"+that.data.discount_price)
    console.log("家具数组"+that.data.water_rate)
    console.log("家具数组"+that.data.electric_charge)
    console.log("家具数组"+that.data.cash_pledge)


    const uploadTask = wx.uploadFile({
      url: 'https://weilaixiwang.mynatapp.cc/intermediary-service-back/video/uploadVideo?token=123',//开发者服务器地址
      filePath:tempFilePath,//要上传文件资源的路径（本地路径）
      name:'file',//文件对应key,开发者在服务端可以通过这个 key 获取文件的二进制内容
      // header: {}, // 设置请求的 header
      formData: {
        Encrypted_phone_number: Encrypted_phone_number,//将用户的电话密码发送给后端
        Housing_address: that.data.Housing_address,//大概的地址
        subway_station: that.data.subway_station,//附近的地铁站
        latitude: that.data.latitude,        //纬度
        longitude: that.data.longitude,       //经度
        Administrative_fee:that.data.Administrative_fee,//管理费
        commission:that.data.commission,//佣金
        discount_price:that.data.discount_price,// 租金
        furniture:JSON.stringify(that.data.furniture),  //自带的家具,转换为json字符串上传
        water_rate:that.data.water_rate, // 水费
        electric_charge:that.data.electric_charge,  //电费
        cash_pledge: that.data.cash_pledge,  //押金
        household_type:that.data.household_type //房型

      },// HTTP 请求中其他额外的 form data
      success: function(res){
        console.log("uploadFile",res)
        // success
        let data = JSON.parse(res.data)
        wx.hideLoading()
        if(data.returnCode == 200){
          that.setData({
            videoUrl: data.PlayURL,
            poster: data.CoverURL,
            duration: that.data.duration,
            clickFlag:true
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })
        }else{
    
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
       
      },
      fail: function() {
        // fail文件上传失败后调用的函数
        // wx.hideLoading()  //隐藏加载提示框
        that.setData.clickFlag=true;

        wx.showToast({
          title: '视频存在问题',
          icon: 'none'
        })
      }
    })
    //监听上传进度变化事件
    uploadTask.onProgressUpdate((res) =>{

      let that = this;
      that.progress(res.progress)
      console.log("上传进度",res.progress)
      console.log("已经上传的数据长度，单位 Bytes:",res.totalBytesSent)
      console.log("预期需要上传的数据总长度，单位 Bytes:",res.totalBytesExpectedToSend)
    })
  },
  progress: function(progress) {
   let that = this;
   let percent = progress; //获取percent
   that.setData({
     progressBar: percent
       })
   }
   ,
  //保存数据库
  saveVideo(){
    //调用服务器保存视频信息接口
    
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },

  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  /**
   * 获取绑定房源地址的备注信息编辑框数据
   * @param {*} e 
   */
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
  },
  /**
   * 获取自带设备的的数组值，复选框
   * @param {} e 
   */
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      furniture: e.detail.value
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  clearFont() {
    this.setData({
      placeholder: ''
    })
  },

  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //获取所有的上传数据
  all_form_data: function(e) {
    
    let that = this;
    console.log('form发生了submit事件，携带数据为：',that.data.household_type_array[that.data.index]);
    that.setData({
      household_type:that.data.household_type_array[that.data.index]
    })
    if(that.data.videoUrl != ""){
      that.uploadFile(that.data.videoUrl);//调用上传函数开始上传
    }
  },
  /**
   * 获取当前坐标的经度和维度
   */
  gets_the_current_location:function(){

    wx.getLocation({
      type: 'wgs84',
      success:(res) =>{

        console.log(res)
         this.setData({
          latitude:res.latitude-0.07695000000000007,  //纬度
          longitude:res.longitude-0.04659499999999639,  //经度
          speed:res.speed,   //速度
          accuracy:res.accuracy    //准确度
        })

        console.log("处理前");
        console.log(this.data.longitude+"经度比较"+(this.data.longitude-114.201195))
        console.log(this.data.latitude+"纬度比较"+(this.data.latitude-22.642960))


        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(this.data.longitude, this.data.latitude);
        console.log(gcj02tobd09);
        // this.setData({
        //   longitude: gcj02tobd09[0],
        //   latitude: gcj02tobd09[1]
        // })
        console.log("处理后")
        console.log(this.data.longitude+"经度比较"+"114.201195")
        console.log(this.data.latitude+"纬度比较"+"22.642960")
      }
     })
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

  /**
   * 绑定复选框的值
   */
  washingMachine_fun: function(e){
    console.log(e);
  },
/**
 * 乔巴
 * 获取租金输入框数据
 * @param {} e 
 */
  discount_price_fun:function(e){
    this.setData({
      discount_price:e.detail.value
    })
  },
/**
 * 乔巴
 * 获取押金输入框数据
 * @param {} e 
 */
  cashPledge_fun:function(e){
    this.setData({
      cash_pledge:e.detail.value
    })
  },
/**
 * 乔巴
 * 获取佣金输入框数据
 * @param {} e 
 */
commission_fun:function(e){
    this.setData({
      commission:e.detail.value
    })
  },
/**
 * 乔巴
 * 获取管理费输入框数据
 * @param {} e 
 */
Administrative_fee_fun:function(e){
    this.setData({
      Administrative_fee:e.detail.value
    })
  },
/**
 * 乔巴
 * 获取电费输入框数据
 * @param {} e 
 */
electric_charge_fun:function(e){
    this.setData({
      electric_charge:e.detail.value
    })
  },
/**
 * 乔巴
 * 获取水费输入框数据
 * @param {} e 
 */
water_rate_fun:function(e){
    this.setData({
      water_rate:e.detail.value
    })
  },
  /**
   * 乔巴
   *初始化加载函数，判断用户的权限
   * @param {} option 
   */
  onLoad:function(option){
    if(wx.getStorageSync('Encrypted_phone_number') == ""){

      /**
       * 如果会话过期就跳转到登陆界面，电话号码为空的时候
       */
      wx.switchTab({
        url: '/pages/my/my',
      })
      return;
    }
  }
})