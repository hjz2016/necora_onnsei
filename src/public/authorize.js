
const blocks = ['生产计划','报工模块','物料管理','质量管理','数据展示']; // '设备模具管理',
window.functionList_0 = ['销售订单;salesOrder','订单管理;orderManage','派工监控;dispatchMonitor','订单合格率;orderQualification','生产产量;productionOutput','分货记录;stockRecord','激活订单;activateOrder'],
window.functionList_1 = ['离线盘点;offlineInventory','盘点记录;offlineInventoryHistory','仓库收货;warehouse','报工配置;awSetting','扫码录入;awScan','当前记录;awCurrent','历史记录;awHistory','报工预留;awReserve','离线扫码;awOfflineScan','离线上传;awofflineUpload','预留收货;iRScan'];
window.functionList_2 = ['实时库存;currentInventory','位置库存;positionInventory','使用查询;useQueries','汇总统计;summaryStatistics','申领查询;claimInquiry','采购查询;purchaseInquiry'],
// window.functionList_3 = ['设备实时状态;equipmentState','设备报修;equipmentRepair','模具管理;mouldManagement'],
window.functionList_3 = ['首检录入;appIpcNewFir','巡检录入;appIpcNewRou','自检录入;appIpcNewSel','质量处理通知单;appunTreatedNoPass','质检个人配置;ipcSetting','客户投诉单;appcplrecord','来料检验单;phInsbill','不合格处理流程;phNopassbill','终检录入;InkjetPrinterEnd','工艺参数录入;technologyInsert'];
window.functionList_4 = ['设备;device'];


import _public from "@/public/public";
import _APIS from "@/api";

// 获取菜单权限
function getMenuAuth(cb){
    var authorize2 = _public.getStorage("authorize2");
console.log(authorize2,'authorize2')
    authorize2 = authorize2.map(function(item){
        if(item.children == null){
            item.children = []
        }

        var functionList = [];

        blocks.forEach(function(btem,b){
            if(item.name == btem){
                item.blockId = b;
                // item.children.forEach(function (ctem,c) {
                //     ctem.blockId = b;
                // });
            }
        });

        console.log('111:',item)

        if(typeof item.blockId == 'number'){
            window['functionList_'+item.blockId].forEach(function(wtem,w){
                var cateFlag = false
                var param = {
                    "name":wtem.split(';')[0],
                    "route":wtem.split(';')[1],
                    "icon":wtem.split(';')[1],
                    "selected":false,
                    "blockId":item.blockId
                }

                item.children.forEach(function(ktem,k){
                    if(ktem.name == param.name){
                        cateFlag = true
                        if(ktem.children){
                            param.listBtn = ktem.children
                        }else{
                            param.listBtn = []
                        }
                    }
                })

                if(cateFlag){
                    param["status"] = true
                }else{
                    param["status"] = false
                }
                functionList.push(param)
            })
        }



        return {
            blockName:item.name,
            functionList:functionList,
            blockId:item.blockId
        }
    })

    console.log(authorize2)
    _public.saveStorage("authorize_output",authorize2);
    cb()
}

// 获取上拉菜单权限
function getActionAuth(pageCode, allActions, callback) {
    let params = {
        resourceType: "1",
        code: pageCode,
        userName: _public.getStorage('userInfo').userName,
        type: "1"
    }
    _APIS.getAuthResource(params)
        .then(function(res){
            let data = res.data;
            if (data.code == 1){
                let authAction = data.rows.splice(0); //保存上拉菜单权限
                console.log(`authAction:${JSON.stringify(authAction)}`)
                let activeAction = [];
                // 遍历上拉菜单状态
                allActions.forEach(function(allItem){
                    authAction.forEach(function (authItem) {
                        if(allItem.name == authItem.name){
                            activeAction.push(allItem);
                        }
                    });
                });
                callback(activeAction);
            }
        });
}

export default {
    getMenuAuth,
    getActionAuth
}
