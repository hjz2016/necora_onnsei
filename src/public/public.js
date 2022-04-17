// 请求方法
import _APIS from "@/api";
// import store from '@/store';

// 起始定时器 结束定时器
var classStartTimer = null
var classOverTimer = null

class Public {
  constructor() {

  }

  // 随机字符串
  randomStr() {
    return Math.random().toString(36).substr(2)
  }

  // 存入本地存储
  saveStorage(key, obj) {
    key = key ? key : 'default';
    localStorage[key] = JSON.stringify(obj)
  }

  // 取出本地存储
  getStorage(key) {
    key = key ? key : 'default';
    return localStorage[key] ?
      JSON.parse(localStorage[key]) : {
        list: []
      }
  }
  //移除本地存储
  removeStorage(key) {
    key = key ? key : 'default';
    return localStorage.removeItem(key);
  }

  //数组/对象深拷贝
  deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  // 清除浏览历史
  clearHistory() {
    if (window.navigator && window.navigator.app) {
      window.navigator.app.clearHistory();
      console.log('app.cleatHistory');
    }
  }

  // 确定该项目保留小数点位数
  saveZeroDetail(item) {
    // item.meaValue = '0.3152'
    var handleList = []

    if (item.meaValue1 || item.meaValue1 === 0) {
      handleList.push('meaValue1')
    }
    if (item.maxStandard || item.maxStandard === 0) {
      handleList.push('maxStandard')
    }
    if (item.minStandard || item.minStandard === 0) {
      handleList.push('minStandard')
    }
    if (item.standard || item.standard === 0) {
      handleList.push('standard')
    }
    if (item.meaValue || item.meaValue === 0) {
      handleList.push('meaValue')
    }
    if (item.pstandard || item.pstandard === 0) {
      handleList.push('pstandard')
    }
    if (item.nstandard || item.nstandard === 0) {
      handleList.push('nstandard')
    }
    if (item.mmeaValue || item.mmeaValue === 0) {
      handleList.push('mmeaValue')
    }
    if (item.smeaValue || item.smeaValue === 0) {
      handleList.push('smeaValue')
    }

    var isFixedNum = false

    if (typeof item.decNum == 'number') {
      // 有确切位数
      isFixedNum = true
    }

    for (let index = 0; index < handleList.length; index++) {
      const thing = handleList[index];
      // console.log(thing,item[thing])
      item[thing] = parseFloat(item[thing])

      if (item[thing] == 0) {
        if (item.iiname == '长度' || item.IIName == '长度') {
          item[thing] = isFixedNum ? 0.0000.toFixed(item.decNum) : '0.0000'
          continue;
        }
        if (item.iiname == '重量' || item.IIName == '重量') {
          item[thing] = isFixedNum ? 0.0000.toFixed(item.decNum) : '0.0000'
          continue;
        }

        item[thing] = isFixedNum ? 0.0000.toFixed(item.decNum) : '0.00'

        continue;
      }

      if (item.iiname == '长度' || item.IIName == '长度' || item.iiname == '重量' || item.IIName == '重量') {
        item[thing] = isFixedNum ? item[thing].toFixed(item.decNum) : item[thing].toFixed(4)
        continue
      }

      item[thing] = isFixedNum ? item[thing].toFixed(item.decNum) : item[thing].toFixed(2)


    }

  }

  // 时间格式化
  dateFormat(fmt, date) {
    if (date === null) {
      date = new Date()
    } else if (typeof date === 'string') {
      date = dateFormatSplit(date)
    } else {
      date = new Date(date);
    }

    let o = {
      "M+": date.getMonth() + 1, //月份   
      "d+": date.getDate(), //日   
      "h+": date.getHours(), //小时   
      "m+": date.getMinutes(), //分   
      "s+": date.getSeconds(), //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return fmt;

    // 时间格式化-细拆分
    function dateFormatSplit(date) {
      console.log(date, typeof date, 'stringdatexxxxxxxxxxxxxxxxx')
      var t = date.split(/[- :]/);

      // Apply each element to the Date function
      var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
      var actiondate = new Date(d);

      console.log(actiondate, typeof actiondate, 'objactiondatexxxxxxxxxxxxxxxxx')

      return actiondate

    }
  }

  // 提示错误
  errorToast(that, err) {
    var err_str = err.toString()

    if (err_str.indexOf('timeout') > -1) {
      // 超时
      that.$toast.fail('操作超时！');
      return;
    }

    that.$toast.fail('网络错误：' + err.response.data.info)
  }

  /**
   * 处理不合格备注
   */
  handleNopassMemo(memo) {
    var splitArr = memo.split(';')

    if (!splitArr[0] && splitArr[0] !== 0) {
      // 选项为空
      return splitArr[1]
    }

    if (!splitArr[1] && splitArr[1] !== 0) {
      // 选项为空
      return splitArr[0]
    }

    return splitArr[0] + ' ; ' + splitArr[1]
  }

  /**
   * 判断lims返回的参数格式
   *
   *
   */
  handleLimsReturns(ctx, data) {
    if (Object.prototype.toString.call(data) == "[object Object]") {
      // 对象 非联动
      ctx.LimsTplList = [data.prodgroup]
      ctx.LimsTpl = ctx.LimsTplList[0]
      ctx.isBindingMat = true

      if (data.progname.length == data.spcode.length) {
        ctx.LimsPlanList = []
        data.progname.forEach((item, index) => {
          ctx.LimsPlanList.push({
            progname: item,
            spcode: data.spcode[index]
          })
        })
        ctx.LimsPlan = ctx.LimsPlanList[0].spcode
      } else {
        console.log('计划无法对应！')
      }

      ctx.LimsPlanChange()

      ctx.isTree = false
    } else {
      // 数组 联动
      ctx.LimsTplList = data.splice(0)
      ctx.isTree = true
      ctx.isBindingMat = false
    }
  }

  /**
   * 判断不合格类型
   *
   *
   */
  judgeFailType(data) {
    if (typeof data == 'string') {
      data = data.split(',')
      if (data.length == 0) {
        return;
      } else {
        var returnList = []
        data.forEach(item => {
          if (item == 1) {
            returnList.push('第一类')
          } else if (item == 2) {
            returnList.push('第二类')
          } else if (item == 3) {
            returnList.push('第三类')
          }
        })

        return returnList.join('，')
      }
    }
  }

  /**
   * 获取创建人和修改人
   *
   *
   */
  getCreatorAndModifier(ctx, userInfo) {
    if (ctx.isRoleZhijianyuan && ctx.QUALITY_PAGE_VARS.pageInsType == '首检') {
      // 质检员
      return {
        creator: ctx.resourceData.creator,
        creatorId: ctx.resourceData.creatorId,
        modifier: userInfo.employeeName,
        modifierId: userInfo.userId,
      }
    } else {
      return {
        creator: userInfo.employeeName,
        creatorId: userInfo.userId,
        modifier: userInfo.employeeName,
        modifierId: userInfo.userId,
      }
    }
  }

  clearCache() {
    console.log('clearCacheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    window.navigator.app.clearCache()
    window.cookieManager.clear(function () {
      console.log('Cookies cleared!');
    });
  }

}

export default new Public()
