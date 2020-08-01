const axios = require('axios').default;

const APPID = '______';
const APP_SECRET = '______';


function getAccessToken(){
    return new Promise(next => {
        axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APP_SECRET}`)
            .then(res=>{
                if(res && res.data && res.data.access_token){
                    next(res.data.access_token);
                }else{
                    next();
                }
            })
            .catch(err=>{
                next();
            });
    })
}

function submitPages(token, pages){
    return new Promise(next => {
        axios.post(`https://api.weixin.qq.com/wxa/search/wxaapi_submitpages?access_token=${token}`, {
            pages: pages
        })
            .then(res => {
                if(res.data && res.data.errcode == 0){
                    next(true);
                }
                else{
                    next(false);
                }
            })
            .catch(err => {
                next(false);
            });
    });
}

function getPages(){
    let pages = [];
    pages.push({
        path: 'pages/index/index',
    });

    for(let i=1; i<=127; i++){
        pages.push({
            path: 'pages/element/element',
            query: 'number=' + i
        });
    }

    pages.push({
        path: 'pages/search/search'
    });
    pages.push({
        path: 'pages/listing/listing'
    });
    pages.push({
        path: 'packages/tools/pages/counter/counter'
    });
    pages.push({
        path: 'packages/tables/pages/color-changes/color-changes'
    });
    pages.push({
        path: 'pages/other/other'
    });
    pages.push({
        path: 'pages/about/about'
    })
    return pages;
}

async function main(){
    let token = await getAccessToken();
    let pages = getPages();
    let result = await submitPages(token, pages);
    console.log(token, pages, result);
}

main();