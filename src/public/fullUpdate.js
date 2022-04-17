/**
 * 软件升级
 * 1.获取当前版本号
 * 2.获取服务器端的最新版本的数据源
 * 3.进行版本比较,如果当前的版本号与服务器的版本号不一致时,下载并安装最新的应用程序安装包  
 */

import _APIS from "@/api";
import waterfall from 'async-es/waterfall';


// 苹果更新 
function iosUpdate(downloadUrl) {
    window.location.href = downloadUrl;
};

// 安卓更新
function androidUpdate(downloadUrl,that) {
    // var that = this;
    
    //APP下载存放的路径，可以使用cordova file插件进行相关配置
    var targetPath = cordova.file.externalDataDirectory + 'mes_update.apk';

    var options = {};

    // 定义进度条
    var progress = window.navigator.dialogsPlus.progressStart("软件更新", "获取中....");

    var ft = new FileTransfer();
    var trustHosts = true;
    var options = {};

    // 下载安装文件
    ft.download(
        downloadUrl, //uri网络下载路径
        targetPath, //url本地存储路径
        function success(entry) {
            console.log("download complete: " + entry.toURL());
            progress.hide();//下载完成后隐藏进度条
            cordova.plugins.fileOpener2.open(
                entry.toURL(),
                'application/vnd.android.package-archive',
                {
                    success: function () { },
                    error: function (e) {
                        console.log(`file open error:${JSON.stringify(e)},${entry.toURL()}`);
                    },
                });
        },
        function error(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
            progress.hide();
            that.$toast.fail('下载失败');
        },
        trustHosts,
        options);

    // 下载进度条
    ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            //下载进度条显示
            progress.setValue((progressEvent.loaded / progressEvent.total) * 100);
            // if ((progressEvent.loaded / progressEvent.total) == 1) {
            //     progress.hide();
            // }
        } else {
        // alert(progressEvent.loaded+":"+progressEvent.total)
        }
    };
};

// 检查安卓权限
function checkAndroidPermission(downloadUrl,that) {
    var permissions = cordova.plugins.permissions;
    permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback(status,downloadUrl,that), null);

      function checkPermissionCallback(status,downloadUrl,that) {
        if (status.hasPermission) {
          //有权限-->下载更新
          console.log("Yes :hasPermission ");
          androidUpdate(downloadUrl,that) 
        //   downloadAndAutoInstallForAndroid(ENV.androidUpdateUrl);
        } else {
          //无权限-->请求权限-->下载更新
          console.warn("No :hasNotPermission ");
          var deniedCallback = function () {
            console.warn('READ_EXTERNAL_STORAGE permission is not turned on');
          };
          //请求权限
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function (status) {
              if (status.hasPermission) {
                // 请求权限 continue with downloading/ Accessing operation
                androidUpdate(downloadUrl,that) 
              } else {
                deniedCallback();
              }
            },
            deniedCallback);
        }
      }
};


// 全量更新
function fullUpdate() {
    var that = this;
    // var curVer = getAppVersion();
    cordova.getAppVersion.getVersionNumber().then(function (version) {
        var curVer = parseInt(version.toString().replace(/\./g, ''));
        console.log(`curVer: ${version},${curVer}`);
        _APIS.getUpdateInfo()
            .then(function success(res) {
                var data = res.data;
                if (data.code == 1) {
                    var rows = data.rows;
                    var netVer = parseInt(rows.version.toString().replace(/\./g, ''));
                    console.log(`netVer: ${rows.version},${netVer}`);
                    var content = rows.content;
                    var devicePlatform = device.platform;
                    var downloadUrl;
    
                    //获取下载地址
                    if (devicePlatform == 'iOS') {
                        downloadUrl = rows['ios_url'];
                    } else if (devicePlatform == 'Android') {
                        downloadUrl = rows['apk_url'];
                    };
                    console.log(`dlUrl: ${downloadUrl}`);
                    console.log(`cur: ${curVer},net: ${netVer}`);
                    console.log(`comp: ${netVer > curVer}`);
    
                    if (netVer > curVer){
                        that.$dialog.confirm({
                            title: '软件更新',
                            message: content
                        }).then(function () {
                            //确认回调
                            if (devicePlatform == 'iOS') {
                                iosUpdate(downloadUrl);
                            } else if (devicePlatform == 'Android') {
                                // androidUpdate(downloadUrl,that);
                                checkAndroidPermission(downloadUrl,that);
                            };
                        }).catch(function () {
                            // on cancel
                        });
                    }
                } else {
                    console.log('getUpdateInfo error', res);
                }
            }, function error(err) {
                console.log('getUpdateInfo error', err)
            });
    });
};



export default fullUpdate;