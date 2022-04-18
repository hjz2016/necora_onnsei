import constant from "@/public/constant";

const env = {
    dev: {
        auth: 'http://www.necora-nyaru.site:8888/tongji/',  //获取网站概况
    },
    qas: {
        auth: 'http://www.necora-nyaru.site:8888/tongji/',  //获取网站概况
        
    },
    app: {
        auth: 'http://www.necora-nyaru.site:8888/tongji/',  //获取网站概况
        
    }
};

export default env[constant.appenv];
