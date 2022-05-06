import constant from "@/public/constant";
console.log(process.env.BASE_URL,'process.env.BASE_URL')
const env = {
    dev: {
        auth: '/tongji/',  //获取网站概况
    },
    qas: {
        auth: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
        
    },
    app: {
        auth: 'https://www.necora-nyaru.site/tongji/',  //获取网站概况
        
    }
};

export default env[constant.appenv];
