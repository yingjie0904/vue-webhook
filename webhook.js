let http = require('http');
let crypto = require('crypto');
let SECRET = "123456";
function sign(body){
    return `sha1=`+crypto.createHmac('sha1', SECRET).update(body).digest('hex');
}
let server = http.createServer(function(req, res){
    console.log(req.method, req.url)
    if(req.method == 'POST' || req.url == '/webhook'){
        let buffers = [];
        req.on('data', function(buffer){
            buffers.push(buffer);
        });
        req.on('end', function(){
            let body = Buffer.concat(buffers);
            let event = req.headers['x-gitHub-event']; // event=push
            // github会传请求体，还有一个signature，需要验证签名对不对
            let signature = req.headers['x-hub-signature']
            if(signature !== sign(body)){
                return res.end('not-alowed')
            }
        })
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ok: true}))
    }else{
        res.end('not found')
    }
})

server.listen("4000", ()=>{
    console.log('webhook服务已经在4000端口启动');
})