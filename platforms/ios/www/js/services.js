angular.module('HT.services', [])

.factory('ajax', function($http){
  return {
    sign:function(param){
      obj = this.rebuild(param);
      base64 = this.base64(param);
      return this.sort(obj)
    },
    base64:function(param){
      var url = "appkey=F9dI3u&appsecret=y6NozP&appversion=1&market=a&channel=app_web"
      var a = [];
      for(var name in param){
        a.push(name+"="+BASE64.encoder(encodeURI(param[name])))
      }
      var text = ""
      for(var i = 0;i<a.length;i++){
        text += a[i]+"&"
      }
      text = url + "&" + text
      text = text.slice(0,length-1)//去除最后的&
      return text;
    },
    rebuild:function(param){
      param.appkey="F9dI3u";
      param.appsecret="y6NozP";
      param.appversion="1";
      param.market="a";
      param.channel="app_web";
      return param
    },
    sort:function(param){
      //按Key升序排序
      var a = [];
      for(var name in param){
        a.push(name+"="+encodeURI(param[name]))
      }
      var i = 0,
        len = a.length,
        j, d;
      for (; i < len; i++) {
        for (j = 0; j < len; j++) {
          if (a[i] < a[j]) {
            d = a[j];
            a[j] = a[i];
            a[i] = d;
          }
        }
      }
      var premd5 = "";
      //拼接字符串
      for(var i = 0;i<a.length;i++){
        premd5 += a[i]+"&"
      }

      premd5 = premd5.slice(0,length-1)//去除最后的&
      presign = hex_md5(premd5).toUpperCase();
      return this.encryptSign(presign)

    },
    encryptSign:function(text){
      //计算签名
      var chars = ["a" , "b" , "c" , "d" , "e" , "f" , "g" , "h" ,
        "i" , "j" , "k" , "l" , "m" , "n" , "o" , "p" , "q" , "r" , "s" , "t" ,
        "u" , "v" , "w" , "x" , "y" , "z" , "0" , "1" , "2" , "3" , "4" , "5" ,
        "6" , "7" , "8" , "9" , "A" , "B" , "C" , "D" , "E" , "F" , "G" , "H" ,
        "I" , "J" , "K" , "L" , "M" , "N" , "O" , "P" , "Q" , "R" , "S" , "T" ,
        "U" , "V" , "W" , "X" , "Y" , "Z"
      ];
      var sTempSubString = text.substring(0,8);
      sTempSubString = parseInt(sTempSubString,16);
      var lHexLong = 0x3FFFFFFF & sTempSubString;
      var outChars = "";
      for(var j = 0;j<6;j++){
        var index = 0x000003D & lHexLong
        outChars += chars[parseInt(index,10)]
        lHexLong = lHexLong>>5
      }
      return outChars;
    },
    httpsGetJSONP:function(url,params,$https,$state,callback,error){
      //var baseUrl = "http://172.16.11.200:8080/DLMiddleware_ht/";//内网开发环境
      var baseUrl = "http://139.129.118.77:8082/DLMiddleware_ht/";//公司阿里云调试环境
      var base64url = this.base64(params);
      var sign = this.sign(params);
      var paramUrl = "sign=" + sign +"&" +base64url;
      var link = $https.jsonp(baseUrl+url +"?"+paramUrl+"&callback=JSON_CALLBACK")
      //console.log(window.location.href)
      link.success(function(data){
        if(data.result.retcode == "0000"){
          callback(data.result)
        }else if(data.result.retcode == "0004"){
          //超时登出
          localStorage.removeItem("accesstoken")
          if(error){
            error(data)
          }
          $state.go("login",{})
        }else if(data.result.retcode == "1111"){
          //alert(data.result.retmsg)
          if(error){
            error(data)
          }
        }else{
          alert(data.result.retmsg)
          if(error){
            error(data)
          }
        }
      });
      link.error(function(data){
        console.log(data)
        if(error){
          error()
        }
        alert("服务器失去响应,请稍后再试")
      })
    },
    getJSONP:function(url,params,$http,$state,callback,error){
      //var baseUrl = "http://172.16.11.200:8080/DLMiddleware_ht/";//内网开发环境
      var baseUrl = "http://139.129.118.77:8082/DLMiddleware_ht/";//公司阿里云调试环境
      var base64url = this.base64(params);
      var sign = this.sign(params);
      var paramUrl = "sign=" + sign +"&" +base64url;
      var link = $http.jsonp(baseUrl+url +"?"+paramUrl+"&callback=JSON_CALLBACK")
      //console.log(window.location.href)
      link.success(function(data){
        if(data.result.retcode == "0000"){
          callback(data.result)
        }else if(data.result.retcode == "0004"){
          //超时登出
          localStorage.removeItem("accesstoken")
          if(error){
            error(data)
          }
          $state.go("login",{})
        }else if(data.result.retcode == "1111"){
          //alert(data.result.retmsg)
          if(error){
            error(data)
          }
        }else{
          alert(data.result.retmsg)
          if(error){
            error(data)
          }
        }
      });
      link.error(function(data){
        console.log(data)
        if(error){
          error()
        }
        alert("服务器失去响应,请稍后再试")
      })
    },
    getJSON:function(url,$http,callback){
      $http.get(url).success(function(data){
        callback(data)
      }).error(function(data){
        console.log("error");
      })
    }
  }
}).factory('base',function(){
  return {
    checklogin:function($state){
      if(localStorage.accesstoken){
        return true;
      }else{
        return false;
      }
    },
    tradedate:function(date){
      if(date){
        date = date.replace(/(.{6})/,'$1\.')
        date = date.replace(/(.{4})/,'$1\.')
      }
      return date;
    },
    state:function(code,msg){
      switch (code) {
        case "00":return "<span class='green'>"+msg+"</span>";
        case "01":return "<span class='red'>"+msg+"</span>";
        case "02":return "<span class='grey'>"+msg+"</span>";
        case "03":return "<span class='orange'>"+msg+"</span>";
      }
    },
    fundbusinesscode:function(value){
      //重构业务字符
      switch (value){
        case "20":return "认购";
        case "22":return "买入";//申购
        case "24":return "卖出";//赎回
        case "25":return "预约赎回";
        case "26":return "转托管";
        case "27":return "转托管转入";
        case "28":return "转托管转出";
        case "29":return "设置分红";
        case "30":return "认购结果";
        case "31":return "基金份额冻结";
        case "32":return "基金份额解冻";
        case "33":return "非交易过户";
        case "34":return "非交易过户转入";
        case "35":return "非交易过户转出";
        case "36":return "基金转换";
        case "37":return "基金转换转入";
        case "38":return "基金转换转出";
        case "39":return "定期定额申购";
        case "42":return "强制赎回";
        case "43":return "分红";
        case "44":return "强行调增";
        case "45":return "强行调减";
        case "49":return "基金募集失败";
        case "59":return "定投协议开通";
        case "60":return "定投协议撤销";
        case "61":return "定投协议变更";
        case "98":return "快速赎回";//T+0快速赎回
      }
    },
    fundType:function(text){
      switch (text){
        case "0":
          return "股票型"
          break;
        case "1":
          return "债券型"
          break;
        case "2":
          return "货币型"
          break;
        case "3":
          return "混合型"
          break;
        case "4":
          return "专户"
          break;
        case "5":
          return "指数型"
          break;
        case "6":
          return "QDII"
          break;
      }
    },
    fundBuildDate:function(time){
      var ttime = time.split("-")
      return ttime[1]+"."+ttime[2];
    },
    fundValue:function(value,type){
      if(value == ""){return ""}
      value = parseFloat(value);
      if(type=="Percentage"){
        if(value>1){
          return "+"+value+"%";
        }else{
          return value+"%";
        }
      }
    },
    fundUD:function(value){
      value = parseFloat(value);
      if(value == 0){
        return ""
      }
      if(value>0){
        return "red"
      }
      if(value<0){
        return "green"
      }
    },
    personRisk:function(text){
      switch (text){
        case "01":
          return "保守型"
          break;
        case "02":
          return "保守型"
          break;
        case "03":
          return "稳健型"
          break;
        case "04":
          return "积极型"
          break;
        default:
          return ""
      }
    },
    fundRisk:function(text){
      switch (text){
        case "02":
          return "低风险"
          break;
        case "03":
          return "中风险"
          break;
        case "04":
          return "高风险"
          break;
        default:
          return ""
      }
    },
    cardTail:function(cardnumber){
      return cardnumber.slice(-4);
    },
    certificatenoRebuild:function(value,type){
      var temp = '';
      if(type=='certificateno'){
        for(i in value){
          if(i < 4 || i>13){
            temp += value[i];
          }else{
            temp += '*';
          }
        }
        return temp.substring(0,18)
      }else if(type=='phone'){
        for(i in value){
          if(i < 3 || i>6){
            temp += value[i];
          }else{
            temp += '*';
          }
        }
        return temp.substring(0,11)
      }

    }
  }
})
  .factory('chart',function(){
    return {
      buildchart:function(dom,categories,data){
        $(dom).highcharts({
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            categories:categories,
            labels: {
              step: parseInt(data.length / 5),
              staggerLines: 1
            }
          },
          yAxis: {
            title: {
              text: ''
            }
          },
          tooltip: {
            shared: true
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            area: {
              color: "#f2264b",
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                  [0, "#f2264b"],
                  [1, "rgba(242, 38, 75, 0)"]
                  //[0, "rgba(255, 255, 255, 0)"],
                  //[1, "rgba(255, 255, 255, 0)"]
                ]
              },
              lineWidth: 1,
              marker: {
                enabled: false
              },
              shadow: false,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              threshold: null
            }
          },

          series: [{
            type: 'area',
            name: '净值',
            data: data,
          }],
          credits: {
            text: null,
          }
        });
      }
    }
});
