/**
 * AES工具类
 */
// import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {//加密
  encrypt(word, keyStr){ 
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var iv=CryptoJS.enc.Utf8.parse(keyStr);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {iv:iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
  },
  //解密 

  decrypt(word, keyStr){  
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var iv=CryptoJS.enc.Utf8.parse(keyStr);    
    var decrypt = CryptoJS.AES.decrypt(word, key, {iv:iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }

}