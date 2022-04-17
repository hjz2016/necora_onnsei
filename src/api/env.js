import constant from "@/public/constant";

const env = {
    dev: {
        auth: 'https://openapi.baidu.com/rest/2.0/tongji/',  //获取网站概况
    },
    qas: {
        auth: 'https://openapi.baidu.com/rest/2.0/tongji/',  //获取网站概况
        
    },
    app: {
        auth: 'https://openapi.baidu.com/rest/2.0/tongji/',  //获取网站概况
        
    }
};

export default env[constant.appenv];
