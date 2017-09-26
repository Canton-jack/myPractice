/**
 * Created by 毅 on 2016/8/28.
 */

$(function() {

    var $loginBox  = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $('#userInfo');
    var $logOut =  $('#logout');
    //切换到注册面板
    $loginBox.find('a').on('click',function(){
        $loginBox.hide();
        $registerBox.show();
    });

    //切换登陆面板
    $registerBox.find('a').on('click',function(){
        $registerBox.hide();
        $loginBox.show();
    });

    //注册
    $registerBox.find('button').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result){
              $registerBox.find('.colWarning').html(result.message);
              if(!result.code) {
                  //注册成功
                  setTimeout(function () {
                      $loginBox.show();
                      $registerBox.hide();
                  }, 1000);
              }
            }

        });
    });

    //登录
    $loginBox.find('button').on('click',function() {

        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success:function(result){
                $loginBox.find('.colWarning').html(result.message);
                //登录成功
                if(!result.code){
                    //重新加载页面
                    window.location.reload();
                }

            }
        });
    });



    //退出登录
    $logOut.on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/logout',
            success: function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    });
});