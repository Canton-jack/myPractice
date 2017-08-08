

$(function(){
	//切换城市
	$('.city a').click(function(){
		$('.city').children().removeClass('active').css('color','#999','background','#efefef');
		$(this).css('color','red','background','#fff');
		//css({'color':red,'background':'#fff'})
	});
	
	//切换搜索选项卡
	(function(){
		var aLi = $('#menu li');
		var arrText = ['例如：荷棠鱼坊烧鱼 或 樱花日本料理',
				'例如：昌平区育新站龙旗广场2号楼609室',
				'例如：万达影院双人情侣券',
				'例如：东莞出事了，大老虎是谁？',
				'例如：北京初春降雪，天气变幻莫测'];
				
		aLi.each(function(index,elem){
			$(this).click(function(){
				//console.log(index);
				aLi.each(function(i,elem){
					$(elem).removeClass('active');
				});
				$(this).addClass('active');
				
				var iNow = $(this).index();
				
				$('#search .text').val(arrText[iNow]);
				$('#search .text').focus(function(){
					if($(this).val() == arrText[iNow]){
						$(this).val('');
					}
				});
				$('#search .text').blur(function(){
					if($(this).val() == ''){
						$(this).val(arrText[iNow]);
					}
				});
			});
		});
	})();

	//update文字滚动
	
	(function(){
		
		var arrData = [
				{ 'name':'萱萱', 'time':4, 'title':'那些灿烂华美的瞬间', 'url':'http://www.baidu.com/' },
				{ 'name':'畅畅', 'time':5, 'title':'广东3天抓获涉黄疑犯', 'url':'http://www.baidu.com/' },
				{ 'name':'萱萱', 'time':6, 'title':'国台办回应王郁琦', 'url':'http://www.baidu.com/' },
				{ 'name':'畅畅', 'time':7, 'title':'那些灿烂华美的瞬间', 'url':'http://www.baidu.com/' },
				{ 'name':'萱萱', 'time':8, 'title':'那些灿烂华美的瞬间', 'url':'http://www.baidu.com/' },
				{ 'name':'畅畅', 'time':9, 'title':'广东3天抓获涉黄疑犯', 'url':'http://www.baidu.com/' },
				{ 'name':'萱萱', 'time':10, 'title':'国台办回应王郁琦', 'url':'http://www.baidu.com/' },
				{ 'name':'畅畅', 'time':11, 'title':'那些灿烂华美的瞬间', 'url':'http://www.baidu.com/'}
		];
		var oDiv = $('#update');
		var oUl = $('#update ul');
		var iH = oUl.find('li').height();
		var str = '';
		var iNum = 0;
		var timer = null ;
		var iNow = 0;
		
		
		for(var i=0;i<arrData.length;i++){
			str += '<li><a href='+arrData[i].url+'><strong>'+arrData[i].name+'</strong><span>'+arrData[i].time+'分钟前</span> 写了一篇新文章：'+arrData[i].title+'</a></li>';
		}
		//console.log(str);
		oUl.html(str);
		
		//jQ的animate（）运动函数
		
		//点击上翻
		$('#update .triangle_up').click(function(){
			clearInterval('timer');
			if(oUl.position().top == -210 || iNum == arrData.length-1){
				return ;
			}
			iNum++;
			oUl.stop().animate({'top':-iNum*30},500);
			
		});
		//点击下翻
		$('#update .triangle_down_red').click(function(){
			clearInterval('timer');
			if(oUl.position().top == 0 || iNum == 0){
				return ;
			}			
			iNum--;
			oUl.stop().animate({'top':-iNum*30},500);		

		});
		
		
		oDiv.hover(function(){
			clearInterval(timer);
			//console.log(1);
		},autoPlay);
	
		function autoPlay(){			
			timer = setInterval(function(){
				doMove(-1);
			},4000);
			
		}
		//循环播放
		autoPlay();
		
		function doMove( num ){
			
			iNow += num;
			//console.log(iNow);
			if ( Math.abs(iNow) > arrData.length-1 ){
				iNow = 0;
			}
			if ( iNow > 0 ){
				iNow = -(arrData.length-1);
			}
			oUl.stop().animate({ 'top': 30*iNow }, 2500);	
		}
	})();
	
	
	//选项卡切换
	(function(){
		
		fnTab($('.tabNav1'),$('.tabCon1'),'click');
		fnTab($('.tabNav2'),$('.tabCon2'),'click');
		fnTab($('.tabNav3'),$('.tabCon3'),'mouseover');
		fnTab($('.tabNav4'),$('.tabCon4'),'mouseover');
		
		function fnTab(oNav,aCon,sEvent){
			var aElem = oNav.children();
			//console.log(aElem);
			aCon.hide().eq(0).show();
			
			aElem.each(function(index){
				$(this).on(sEvent,function(){
					
					aElem.removeClass('active').addClass('gradient');					
					$(this).removeClass('gradient').addClass('active');
					aElem.find('a').attr('class','triangle_down_gray');
					$(this).find('a').attr('class','triangle_down_red');
					$(aCon).hide().eq(index).show();
					
				});
			});			
		}
	})();
	
	//焦点图切换
	(function(){
		
		var oDiv = $('#fade');
		var aUlLi = oDiv.find('ul li');
		var aOlLi = oDiv.find('ol li');
		var oP = oDiv.find('p');
		var arr = ['爸爸去哪儿了','人物摄像的光影效果','夏日郊外旅游'];
		var timer = null;
		var iNow = 0;
		
		aOlLi.click(function(){
			iNow = $(this).index();			
			fnFade();
		});
		
		autoFade();
		aOlLi.hover(function(){
		 	clearInterval(timer);		 	
		 },autoFade);
		 
		function autoFade(){
			timer = setInterval(function(){
				iNow++;
				iNow %= arr.length;
				fnFade();
			},3000);
		}
		
		function fnFade(){
			aUlLi.hide().eq(0).show();
			aOlLi.removeClass('active').eq(iNow).addClass('active');			
			aUlLi.hide().eq(iNow).delay(200).fadeIn()
			oP.html(arr[iNow]);
		}
	})();
	
	
	//日历提示
	
	(function(){
		
		var aSpan = $('.calendar h3 span');
		var aImg = $('.calendar ol li img');
		var oTips = $('.today_info');
		var oImg = oTips.find('img');
		var oStrong = oTips.find('strong');
		var oP = oTips.find('p');
		
		aImg.hover(function(){
			var iTop = $(this).parent().position().top-20;
			var iLeft = $(this).parent().position().left+50;	
			var index = $(this).parent().index();
			var iText = aSpan.eq(index%aSpan.size()).text();
			
			oTips.show().css({'top':iTop,'left':iLeft});
			oImg.attr('src',$(this).attr('src'));
			oP.text($(this).attr('info'));			
			oStrong.text(iText);
		},function(){
			oTips.hide();
		});
	})();
	
	
	//bbs论坛高亮显示
	
	(function(){
		var oBbsDiv = $('.bbs');
		var aBbsLi = oBbsDiv.find('li');
		aBbsLi.hover(function(){
			aBbsLi.removeClass('active');
			$(this).addClass('active');
		
		},function(){});
		
	})();
	
	//半透明提示层
	
	(function(){
		var arr = [
			'',
			'用户：1<br />人气：110',
			'用户名：性感宝贝<br />区域：朝阳CBD<br />人气：124987',
			'用户：3<br />人气：330',
			'用户：4<br />人气：45999',
			'用户：5<br />人气：56855',
			'用户：6<br />人气：6778',
			'用户：7<br />人气：7355',
			'用户：8<br />人气：8688',
			'用户：9<br />人气：9999',
			'用户：10<br />人气：144550'
		];
		
		$('.hot_area li').mouseover(function(){

			if( $(this).index() == 0 ){
				return ;
			};
			$('.hot_area li p').remove();						
			$(this).append('<p style="width:'+($(this).width()-12) +'px;height:'+($(this).height()-12)+'px;">'+arr[$(this).index()]+'</p>');
			
		});
	})();
	
});
