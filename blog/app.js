/*
* 应用（启动）入口文件
*
* */

//加载Express模块
var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库处理模块
var mongoose = require('mongoose');
//加载body-parser模块
var bodyParser = require('body-parser');
//加载cookie模块
var Cookies = require('cookies');

//创建app应用   等同node.js 的http.createServer()
var app = express();

var User = require('./models/User');

//设置静态文件托管目录
//当用户访问的url以/public开始，那么对应直接返回__dirname + '/public'下的文件
app.use('/public',express.static(__dirname + '/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀,第二个参数表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);

//设置模板文件存放的目录,第一个参数必须是views，第二个参数是目录
app.set('views','./views');

//注册模板引擎,第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine','html');

//开发过程中，需要取消模板缓存的限制
swig.setDefaults({cache:false});

//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));

//设置cookie
app.use(function (req,res,next) {
   req.cookies = new Cookies(req,res);

    //解析登录用户的cookies信息
    req.userInfo = {};
   if (req.cookies.get('userInfo')){
       try{
           req.userInfo = JSON.parse(req.cookies.get('userInfo'));

           //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
       }catch(e){}

   }else{
       next();
   }


});
/*根据不同的功能，划分不同的模块*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//连接数据库
mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if(err){
        console.log('连接数据库失败');
    }else{
        console.log('数据库连接成功');
    }
});

//监听http请求

app.listen(8081);

/*
*
* 用户发送http请求》》解析路由》》找到匹配的规则》》执行指定的绑定函数，返回对应内容给用户
*
*
* /public 静态  直接读取指定目录下的文件，返回给用户
*
* 》》动态》》处理业务逻辑》》加载模块》》解析模块》》返回数据给用户
* */