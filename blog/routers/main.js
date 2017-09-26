var express = require('express');
var  router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
// User = require('../models/User');


var data ;
//通用数据
router.use(function (req,res,next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }
    Category.find().then(function (categories) {
        data.categories = categories ;
        next();
    });
});

//首页
router.get('/',function(req,res,next){

   // console.log(req.userInfo);

    data.category =  req.query.category || '';
        data.page = Number( req.query.page || 1 );//对url传过来的数据处理
        data.limit = 4;
        data.pages = 0;
        data.count = 0 ;

    //为where（）添加条件判断当前分类
    var where = {};
    if(data.category){
        where.category = data.category;
    }
    //获取对应的内容信息总数
    Content.where(where).count().then(function (count) {
       // console.log(count);
        data.count = count ;
        data.pages = Math.ceil( data.count / data.limit );
        //page取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //page 取值不能小于1
        data.page = Math.max( data.page , 1);
        var skip = (data.page - 1)*data.limit ;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({_id:-1});
    }).then(function (contents) {
        data.contents = contents ;
       // console.log(contents);
        //console.log(data);
        res.render('main/index',data);
    });

});

router.get('/view',function (req,res) {
    //获取文章id
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).populate(['category','user']).then(function (content) {
        data.content = content ;
        content.views++;
        content.save();
       // console.log(data);
        res.render('main/view',data);
    })
});

module.exports = router ;