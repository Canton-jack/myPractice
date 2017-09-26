
var express = require('express');
var  router = express.Router();

var User = require('../models/User');
//引入分类模型
var Category = require('../models/Category');

//内容模型
var Content = require('../models/Content');

//判断是否是管理员用户,{用户从/admin接口进入}
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        //如果用户是非管理员
        res.send('对不起，您没有管理员权限');
        return ;
    }
    next();
});

//后台管理首页
router.get('/',function (req,res,next) {
    res.render('admin/index',{})
});

//用户管理
router.get('/user',function (req,res) {
    /*
    * 从数据库中读取所有用户的用户数据
    *
    * limit(Number)限制数据中取出的数据
    *
    * skip(2)  忽略数据的条数
    *
    * 每页显示2条
    * 1： 1-2 skip :0 >  (当前页-1)*limit
    * 2:  3-4 skip:2
    *
    * count()  用户数据总条数
    *
    *
    * sort({_id: -1})  -1 降序    1 升序
    * */

    var page = Number( req.query.page || 1 );//对url传过来的数据处理
    var limit = 2 ;
    var pages = 0 ;

    User.count().then(function (count) {

        //计算总页数、
        pages = Math.ceil(count/limit);
        //page取值不能超过pages
        page = Math.min(page,pages);
        //page 取值不能小于1
        page = Math.max(page,1);
        var skip = (page - 1)*limit ;

        User.find().limit(limit).skip(skip).then(function (users) {
            //console.log(users);
            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users: users,
                limit: limit,
                count: count,
                pages: pages,
                page: page,
                urlName: 'user'
            });
        });
    });

});

//博客分类首页
router.get('/category',function (req,res) {

    var page = Number( req.query.page || 1 );//对url传过来的数据处理
    var limit = 2 ;
    var pages = 0 ;

    Category.count().then(function (count) {

        //计算总页数、
        pages = Math.ceil(count/limit);
        //page取值不能超过pages
        page = Math.min(page,pages);
        //page 取值不能小于1
        page = Math.max(page,1);
        var skip = (page - 1)*limit ;

        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            //console.log(users);
            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categories: categories,
                limit: limit,
                count: count,
                pages: pages,
                page: page,
                urlName: 'category'
            });
        });
    });
});
//分类的添加
router.get('/category/add',function (req,res) {

    res.render('admin/category_add',{
        userInfo: req.userInfo
    });
});
//分类的保存
router.post('/category/add',function (req,res) {
    //console.log(req.body);
    var name = req.body.name ||　'';
    if(name == ''){
        res.render('admin/error',{
            userInfo: req.userInfo ,
            message: '名称不能为空',

        });
    }

    //数据库中是否存在同名分类名称
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类已经存在'
            })
            return Promise.reject();
        }else{
            //数据库中不存在该分类
            return new Category({
                name: name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '分类保存成功',
            url:'/admin/category'
        });
    });

});


//分类修改
router.get('/category/edit',function (req,res) {
    //获取要修改的分类的信息，并且用表单的形式表现
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        //分类不存在
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        }else {
            //分类存在
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            });
        }
    })
    
});

//分类的修改保存
router.post('/category/edit',function(req,res){
    //获取要修改的分类的信息，并且用表单的形式表现
    var id = req.query.id || '';
    var name = req.body.name ||　'';
   //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        //分类不存在
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        }else {
            //用户没有修改并提交
            if(name == category.name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            }else{
                //要修改的名称是否存在于数据库中
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
        }).then(function (sameCategory) {
            if(sameCategory){
                res.render('admin/error',{
                    userInfo: req.userInfo,
                    message: '数据库中已存在同名分类'
                });
                return Promise.reject('调用失败的状态');
            }else{
                //不存在同名分类，
                return Category.update({
                    _id: id
                },{
                    name: name
                });
            }
        }).then(function () {
            //跳转页面提示修改成功
            res.render('admin/success',{
                userInfo: req.userInfo,
                message: '修改成功',
                url: '/admin/category'
            });
        });
});

//分类删除

router.get('/category/delete',function (req,res) {
   //获取要删除的分类id
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'

        });
    });
});

//内容首页
router.get('/content',function (req,res) {
    var page = Number( req.query.page || 1 );//对url传过来的数据处理
    var limit = 2 ;
    var pages = 0 ;

    Content.count().then(function (count) {

        //计算总页数、
       // pages = Math.max(pages,0);
        pages = Math.ceil( count / limit );

        //page取值不能超过pages
        page = Math.min( page, pages );
        //page 取值不能小于1
        page = Math.max( page , 1);
        var skip = (page - 1)*limit ;

        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            //console.log(contents);
            //console.log(count);
            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents: contents,
                limit: limit,
                count: count,
                pages: pages,
                page: page,
                urlName: 'content'
            });
        });
    });

});

//添加内容页面
router.get('/content/add',function (req,res) {
    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: categories
        });
    })
});


//内容的保存
router.post('/content/add',function (req,res) {
    //console.log(req.body);
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return ;
    }

    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return ;
    }
    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        });
    });
});

//内容的编辑修改

router.get('/content/edit',function (req,res) {

    var id = req.query.id || '';
    var categories = [] ;

    Category.find().then(function (rs) {
        categories = rs ;
    //获取要修改的内容信息
        return Content.findOne({
            _id: id
        }).populate('category').then(function (content) {
            //内容不存在
            if(!content){
                res.render('admin/error',{
                    userInfo: req.userInfo,
                    message: '指定内容不存在'
                });
                return Promise.reject();
            }else {
                res.render('admin/content_edit',{
                    userInfo: req.userInfo,
                    categories: categories ,
                    content: content
                });
            }
        });
    });
});

//修改内容的保存
router.post('/content/edit',function (req,res) {

    var id = req.query.id || '';
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return ;
    }

    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return ;
    }
    if(req.body.description == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容简介不能为空'
        });
        return ;
    }
    if(req.body.content == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容不能为空'
        });
        return ;
    }
    //update
    Content.update({
        _id: id
    },{
       category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    //修改成功，跳转页面
    }).then(function () {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/content'
        });
    });
});

//内容的删除
router.get('/content/delete',function (req,res) {
    //获取要删除的内容id
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'

        });
    });
});

module.exports = router ;