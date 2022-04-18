import constant from "@/public/constant";

const env = {
    dev: {
        auth: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
    },
    qas: {
        auth: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
        
    },
    app: {
        auth: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
        
    }
};

export default env[constant.appenv];
