import constant from "@/public/constant";

const env = {
    dev: {
        auth_getData: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
    },
    qas: {
        auth_getData: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
        
    },
    app: {
        auth_getData: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
        
    }
};

export default env[constant.appenv];
