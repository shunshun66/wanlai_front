<template>
  <content-module name="dashboard">
    <div id="building" style="/*height: 1280px;background:gold;width: 2820px;*/ ">
    </div>
    <el-button id="screenBtn" type="primary" style="position: absolute;" @click="setFullScreen()">{{screenLabel}}</el-button>
    <el-dialog title="用户信息" v-model="dialogVisible" size="tiny">
      <div class="contentCls"><span>用户名称:</span><span>{{name}}</span></div>
      <div class="contentCls"><span>企业名称:</span><span>{{companyName}}</span></div>
      <div class="contentCls"><span>企业地址:</span><span>{{address}}</span></div>
      <div class="contentCls"><span>联系电话:</span><span>{{tel}}</span></div>
      <div class="contentCls"><span>移动电话:</span><span>{{mobileTel}}</span></div>

      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
  </content-module>
</template>

<script>
  import echarts from 'echarts';
  import 'echarts/dist/extension/bmap.js';
  import 'echarts/map/js/china.js'
  import { user as userRes } from 'resources'

  var that;
  var fullScreenFlag = false
//  var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
//
//  var convertData1 = function (data) {
//    var res = [];
//    for (var i = 0; i < data.length; i++) {
//      var dataItem = data[i];
//      var fromCoord = [dataItem[0].longitude, dataItem[0].latitude];
//      var toCoord = [dataItem[1].longitude, dataItem[1].latitude];
//      if (fromCoord && toCoord) {
//        res.push({
//          fromName: dataItem[0].name,
//          toName: dataItem[1].name,
//          coords: [fromCoord, toCoord]
//        });
//      }
//    }
//    return res;
//  };

  var color = ['#a6c84c', '#ffa022', '#46bee9', '#FFF68F', '#FFEC8B', '#FFF0F5', '#FFB90F', '#FF83FA', '#FCFCFC', '#FAF0E6',
                '#F5FFFA', '#EEEE00', '#EED2EE', '#EEC900', '#EEAD0E', '#E8E8E8', '#EE00EE', '#E066FF', '#CDCD00', '#CD96CD',
                '#C0FF3E', '#CAFF70', '#BF3EFF', '#BBFFFF', '	#B23AEE', '#97FFFF', '#00FF00', '	#00FFFF', '#0000FF', '#00CD00'];
  var series = [];
  var initSeries = function () {
      var cpArrs = []
      for (var i = 0; i < that.companys.length; i++) {
        var company = that.companys[i];
         var name = company.name;
         cpArrs[name] = [];
//         var childNodeArrs = [];
//        var node = {};
//        node.name = name
//        node.latitude = company.latitude || 0;
//        node.longitude = company.longitude || 0;
//         for (var j = 0; j < that.companys.length; j++) {
//             var obj = that.companys[j];
//             if (obj.father_id === companyId) {
//                var childNode = {};// = new Object();
//                childNode.name = obj.companyName;
//                childNode.value = 95;
//                childNode.latitude = obj.latitude;
//                childNode.longitude = obj.longitude;
//                if (childNode.latitude === null || childNode.longitude === null) {
//                    break
//                }
//                var arr = [node, childNode];
//                childNodeArrs.push(arr)
//             }
//         }
//          var arr = [node];
//         childNodeArrs.push(arr)
        var lng = company.longitude || 0
        var lat = company.latitude || 0
        var o = { name, lng, lat }
//         var o = { name, childNodeArrs, lng, lat }
        cpArrs.push(o);
      }
    cpArrs.forEach(function (item, i) {
      series.push(
//        {
//          name: item.name,
//          type: 'lines',
//          zlevel: 1,
//          effect: {
//            show: true,
//            period: 6,
//            trailLength: 0.7,
//            color: '#fff',
//            symbolSize: 3
//          },
//          lineStyle: {
//            normal: {
//              color: color[i % 30],
//              width: 0,
//              curveness: 0.2
//            }
//          },
//          data: convertData1(item.childNodeArrs)
//        },
//        {
//          name: item.name,
//          type: 'lines',
//          zlevel: 2,
//          symbol: ['none', 'arrow'],
//          symbolSize: 10,
//          effect: {
//            show: true,
//            period: 6,
//            trailLength: 0,
//            symbol: planePath,
//            symbolSize: 15
//          },
//          lineStyle: {
//            normal: {
//              color: color[i],
//              width: 1,
//              opacity: 0.6,
//              curveness: 0.2
//            }
//          },
//          data: convertData1(item.childNodeArrs)
//        },
        {
          name: item.name,
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{b}'
            }
          },
          symbolSize: function (val) {
            return val[2] / 8;
          },
          itemStyle: {
            normal: {
              color: color[i]
            }
          },
          data: setData(item)
        });
    });
  }
  var setData = function (item) {
    var datas = []
//    item.childNodeArrs.map(function (dataItem) {
//      var obj = { name: dataItem[0].name, value: [dataItem[0].longitude, dataItem[0].latitude].concat([dataItem[0].value]) }
//      datas.push(obj)
//    });
//    var dataItem = item.childNodeArrs[0]
//    if (dataItem) {
//      var obj = {
//        name: dataItem[0].name,
//        value: [dataItem[0].longitude, dataItem[0].latitude].concat([90 * 2])
//      }
//      datas.push(obj)
//    } else {
//      obj = {
//        name: item.name,
//        value: [item.lng, item.lat].concat([90 * 2])
//      }
//      datas.push(obj)
//    }
    const obj = {
      name: item.name,
      value: [item.lng, item.lat].concat([90 * 2])
    }
    datas.push(obj)
    return datas
  }
  var option = {
    backgroundColor: '#404a59',
    title : {
      text: '用户分布图',
      subtext: '数据真实有效',
      left: 'center',
      textStyle : {
        color: '#fff'
      }
    },
    tooltip : {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      top: 'bottom',
      left: 'right',
      data:[/** '北京 Top101', '上海 Top101', '广州 Top101'**/],
      textStyle: {
        color: '#fff'
      },
      selectedMode: 'single'
    },
    geo: {
      map: 'china',
      label: {
        emphasis: {
          show: false
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#404a59'
        },
        emphasis: {
          areaColor: '#2a333d'
        }
      }
    },
    series: series
  };
  export default {
    data () {
      return {
        chart: null,
        companys: [],
        dialogVisible: false,
        name: '',
        companyName: '',
        address: '',
        tel: '',
        mobileTel: '',
        company_lat: '',
        company_long: '',
        screenLabel: '全屏显示'
      };
    },
    methods: {
      getAllComps () {
        this.companys = []
        userRes.getFarmers().then(res => {
          this.companys = res.body
          this.drawMap('building');
        })
      },
      getCompanyInfo (name) {
          for (var i = 0; i < this.companys.length; i++) {
              var company = this.companys[i];
              if (company.name === name) {
                  return company
              }
          }
      },
      addMarker () {
          var objArr = []
          for (var i = 0; i < this.companys.length; i++) {
              var comp = this.companys[i]
              objArr.push({
                  name: comp.name,
                  value: [comp.longitude, comp.latitude].concat(9)
              })
          }
          return objArr
      },
      drawMap (id) {
        this.chart = echarts.init(document.getElementById(id));

        this.chart.on('click', function (params) {
          if (params.componentType !== 'series' || params.componentSubType !== 'effectScatter') {
                return
          }
          var city = params.name;
          that.dialogVisible = true
          var company = that.getCompanyInfo(city)
          if (company) {
            that.companyName = company.companyName
            that.name = company.name
            that.address = company.address
            that.tel = company.tel
            that.mobileTel = company.mobileTel
          }
        });
        initSeries()
        this.chart.setOption(option);
      },
      setFullScreen () {
          if (fullScreenFlag) {
            document.getElementById('app-menu').style.display = 'block'
            document.getElementById('header').style.display = 'block'
            document.getElementsByClassName('app-container')[0].style.margin = '1rem'
            document.getElementsByClassName('app-container')[0].style.padding = '1rem'
            this.exitFullScreen()
            this.screenLabel = '全屏显示'
          } else {
            document.getElementById('app-menu').style.display = 'none'
            document.getElementById('header').style.display = 'none'
            document.getElementsByClassName('app-container')[0].style.margin = '0'
            document.getElementsByClassName('app-container')[0].style.padding = '0'
            this.fullScreen()
            this.screenLabel = '退出全屏'
          }

        fullScreenFlag = !fullScreenFlag
      },
      fullScreen () {
        var docElm = document.documentElement;
        // W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      },
      exitFullScreen () {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
  },
    mounted () {
      this.getAllComps()
      this.$nextTick(function () {
        document.getElementById('building').style.width = document.body.clientWidth + 'px'
        document.getElementById('building').style.height = document.body.clientHeight + 'px'

        that = this
        var resizeTimer = null;
        window.onresize = function () {
          if (resizeTimer) clearTimeout(resizeTimer);
          document.getElementById('building').style.width = document.body.clientWidth + 'px'
          document.getElementById('building').style.height = document.body.clientHeight + 'px'
          resizeTimer = setTimeout(function () {
            that.drawMap('building');
          }, 100);
        }
      })
    }
  }
</script>

<style scoped>
  #building {
    position: relative;
    left: 0%;
    width: 100%;
    height: 150%;
    margin-left: -0%;
    margin-top: -0%;
    box-shadow: 0 0 10px #A6E3E9;
    border-radius: 10px;
  }
  .contentCls {
    color: #20A0FF;
    height: 30px;
  }
  .contentCls span {
    margin-left: 20px;
  }
</style>
