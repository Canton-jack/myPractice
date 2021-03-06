var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
//统一返回格式
var responseData ;
router.use(function (req,res,next) {
    responseData = {
        code: 0 ,
        message: ''
    }
    next();
});

/*用户注册
*   注册逻辑
*       1.用户名不能为空
*       2.密码不能为空
*       3.两次输入密码必须一致
*       4.用户名是否被注册   数据库查询
* */

router.post('/user/register',function(req,res,next){
    //console.log(req.body);
    var  username = req.body.username ;
    var  password = req.body.password;
    var  repassword = req.body.repassword ;


    //用户名为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空' ;
        res.json(responseData);//将返回数据转换成json格式
        return ;
    }
    //密码为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空' ;
        res.json(responseData);
        return ;
    }
    //二次密码不一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次密码不一致' ;
        res.json(responseData);
        return ;
    }
    //用户名是否已经被注册了，如果数据库存在，表明已被注册
    User.findOne({
        username : username
    }).then(function(userInfo){
        console.log(userInfo);
        if(userInfo){
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';

            res.json(responseData);
            return ;
        }
        //保存用户数据到数据库
        var user = new User({
            username: username ,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo){
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

/*用户登录逻辑
    1.验证用户名
    2.验证密码
*/
router.post('/user/login',function(req,res,next){

    var  username = req.body.username ;
    var  password = req.body.password;

    if(username == '' ||　password == ''){
        responseData.code = 1 ;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return ;
    }
    //查询数据库中用户名，密码是否存在并验证
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
       if(!userInfo){
           responseData.code = 2 ;
           responseData.message = '用户名或密码错误';
           res.json(responseData);
           return ;
       }
       //用户名，密码正确，登录成功
       responseData.message = '登录成功';
       responseData.userInfo = {
           _id: userInfo._id,
           username: userInfo.username
       }
       req.cookies.set('userInfo',JSON.stringify({
           _id: userInfo._id,
           username: userInfo.username
       }));
       res.json(responseData);
       return ;
    });
});

//退出登录

router.post('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

//获取指定文章的所有评论
router.get('/comment',function (req,res) {
    var contentid = req.query.contentid || '';
    if (contentid){
        Content.findOne({
            _id: contentid
        }).then(function (content) {
            responseData.data = content.comments ;
            //console.log(content.comments);
            res.json(responseData);
        })
    }
})

//评论提交
router.post('/comment/post',function (req,res) {
    //内容的ID
    var contentId = req.body.contentid || '';
    var postData = {
        userData: req.userInfo,
        postTime: new Date(),
        content: req.body.content
    }
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        //向对应文章添加评论数据
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent ;
        res.json(responseData);//以json数据类型返回值
    })
});


module.exports = router ;