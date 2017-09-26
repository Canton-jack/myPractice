var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];

//提交评论
$('#messageBtn').on('click',function () {
    $.ajax({
        url:'/api/comment/post',
        type:'POST',//大写
        data:{
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        dataType:'json',
        success:function (responseData) {

            //清空评论框
            $('#messageContent').val('');
            //评论显示顺序为降序 //原理：content数组反转
            comments = responseData.data.comments.reverse();
            renderComment();
        },
    })
    });

//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url: '/api/comment',
    data:{
        //将指定文章的id传递
        contentid: $('#contentId').val()
    },
    success:function (responseData) {
        //赋值
        comments = responseData.data.reverse();
        renderComment();
    }
});

//事件委托
$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    if(page >= 1 || page <= pages){
        renderComment();
    }

});

//渲染页面
function renderComment() {

    $('#messageCount').html(comments.length);
    //评论分页
    //总页数
    pages = Math.max(1,Math.ceil(comments.length / prepage));
    var start = (page-1)* prepage ;
    var ys = comments.length%prepage;
    //console.log(ys)
    var  end = ys=0?start + prepage:start + ys ;

    //页数状态显示
    var $li = $('.pager li');
    $li.eq(1).html( page + '/' + pages );

    if(page <= 1){
        page = 1 ;
        $li.eq(0).html('<span>没有上一页了</span>');

    }else{
        $li.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if(page >= pages){
        page = pages ;
        $li.eq(2).html('<span>没有下一页了</span>');
    }else{
        $li.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if(comments.length == 0){
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    }else {
        var html = '';
        for(var i=start;i<end;i++){
            html += '<div class="messageBox"><p class="name clear"><span class="fl">' + comments[i].userData.username +'</span><span class="fr">' + formatDate(comments[i].postTime) + '</span></p><p>'+ comments[i].content +'</p></div>';
        }
        $('.messageList').html(html);
        $('.colInfo').eq(3).html(comments.length);
    }

}

//日期格式转换
function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + (date1.getMonth()+1) + '月' + date1.getDate() + '日 ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}