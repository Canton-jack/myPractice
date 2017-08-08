/*
 * 分层（功能）：jQuery,ui,
 * 规划（管理）：避免全局变量和方法*/


window.onload = function(){
	
	//搜索框
	mv.app.toTip();
	
	//轮播图
	mv.app.toBanner();
	
	//分类
	mv.app.toSort();
	
	
	//产品推荐无缝切换
	mv.app.toRun();
	
};


	var mv = {};//命名空间
	
	mv.tools = {};
	
	mv.tools.getByClass = function(oParent,sClass){
		
		var aEle = oParent.getElementsByTagName('*');
		var arr = [];
		
		for(var i=0;i<aEle.length;i++){
			
			if(aEle[i].getAttribute("class") == sClass){
				arr.push(aEle[i]);
			}
		}
		return arr;
	};
	
	mv.tools.getStyle = function(obj,attr){
	 	
	 	if(obj.currentStyle){
	 		return obj.currentStyle(attr);
	 	}else{
	 		return getComputedStyle(obj)[attr];
	 	}
	};
	 
	mv.ui = {};
	
	mv.ui.textChange = function(obj,str){
		
		obj.onfocus = function(){
			if(this.value == str){
				this.value = '';
			}
		};
		obj.onblur = function(){
			if(this.value == ''){
				this.value = str;
			}
		};
	};
	
	mv.ui.fadeIn = function(obj){
		//当前透明度为1时，不需要执行淡入操作
		var iCur = mv.tools.getStyle(obj,'opacity');
		if(iCur == 1){return false;}
		
		var value = 0;		
		clearInterval(obj.timer);
		
		obj.timer = setInterval(function(){
			var iSpeed = 5 ;
			if(value == 100){
				clearInterval(obj.timer);
			}else{
				value += iSpeed;
				obj.style.opacity = value/100;
				obj.style.filter = 'alpha(opacity='+value+');'
			}
		},30);
		
	};
	
	mv.ui.fadeOut = function(obj){
		//当前透明度为0时，不需要执行淡出操作
		var iCur = mv.tools.getStyle(obj,'opacity');
		if(iCur == 0){return false;}
		
		var value = 100;
		clearInterval(obj.timer);
		
		obj.timer = setInterval(function(){
			var iSpeed = -5 ;
			if(value == 0){				
				clearInterval(obj.timer);
			}else{
				value +=  iSpeed;
				obj.style.opacity = value/100;
				obj.style.filter = 'alpha(opacity='+value+');'
			}
				
		},30);
	};
	
	mv.ui.move = function(obj,old,now){
		
		clearInterval(obj.timer);
		
		obj.timer = setInterval(function(){
			
			var iSpeed = (now-old)/10;//now 目标点     old当前
			iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
			 
			if(now == old){
				clearInterval(obj.timer);
			}else{
				old += iSpeed;
				obj.style.left = old + 'px';
			}
		},30);
		
	}
	
	mv.app = {};
	
	mv.app.toTip = function(){
		
		var oText1= document.getElementById('text1');
		var oText2= document.getElementById('text2');
		
		mv.ui.textChange(oText1, 'Search website');
		mv.ui.textChange(oText2, 'Search website');
	};


	mv.app.toBanner = function(){
		
		var oDd = document.getElementById('ad');
		var aLi = oDd.getElementsByTagName('li');
	
		var oPrevBg = mv.tools.getByClass(oDd,'prev_bg')[0];
		var oNextBg = mv.tools.getByClass(oDd,'next_bg')[0];
	
		var oPrev = mv.tools.getByClass(oDd,'prev')[0];
		var oNext = mv.tools.getByClass(oDd,'next')[0];
		
		var timer = null;
		var iNow = 0;
		clearInterval(timer);
		timer = setInterval(autoPlay,3000);
		
		function autoPlay(){
			 if(iNow == aLi.length-1){
			 	iNow=0;
			 }else{
			 	iNow++;
			 }
			 for(var i=0;i<aLi.length;i++){
			 	mv.ui.fadeOut(aLi[i]);
			 }
			 mv.ui.fadeIn(aLi[iNow]);
		}
		
		function autoPrevPlay(){
			 if(iNow == 0 ){
			 	iNow=aLi.length-1;
			 }else{
			 	iNow--;
			 }
			 for(var i=0;i<aLi.length;i++){
			 	mv.ui.fadeOut(aLi[i]);
			 }
			 mv.ui.fadeIn(aLi[iNow]);
		}
		
		
		oPrevBg.onmouseover = oPrev.onmouseover= function(){
			
			oPrev.style.display = 'block';
			clearInterval(timer);		
		};
		oPrevBg.onmouseout = oPrev.onmouseout= function(){
			
			oPrev.style.display = 'none';
			timer = setInterval(autoPlay,3000);
		};
		oNextBg.onmouseover = oNext.onmouseover = function(){
			
			oNext.style.display = 'block';
			clearInterval(timer);		
		};
		oNextBg.onmouseout = oNext.onmouseout = function(){
			
			oNext.style.display = 'none';
			timer = setInterval(autoPlay,3000);
		};
		
		
		if(oPrev){			
			oPrev.onclick = function(){
				autoPrevPlay();
			};			
		}
		
		if(oNext){
			
			oNext.onclick = function(){
				autoPlay();
			};
		}
	};
	
	
	mv.app.toSort = function(){
		
		var oSel = document.getElementById('sell');
		var aDd = oSel.getElementsByTagName('dd');		
		var aUl = oSel.getElementsByTagName('ul');
		var aH = oSel.getElementsByTagName('h2');
		
		for(var i=0;i<aDd.length;i++){
			
			aDd[i].index = i;
			aDd[i].onclick= function(ev){
				
				var ev = ev || window.event;
				ev.stopPropagation();//阻止冒泡触发document的onclick
				//ev.cancelBubble = true;
				
				var This = this;
				for(var i=0;i<aDd.length;i++){
					aUl[i].style.display = 'none';
				}
				aUl[this.index].style.display = 'block';
				
				document.onclick = function(){
					aUl[This.index].style.display = 'none';			
				}
			};
						
		}
		for(var i=0;i<aUl.length;i++){
			
			aUl[i].index = i;
			(function(ul){				
				var aLi = ul.getElementsByTagName('li');
	
				for(var i=0;i<aLi.length;i++){
					aLi[i].onclick = function(ev){
						
						var ev = ev ||window.event;
						ev.cancelBubble = true ; //阻止冒泡
						
						aH[this.parentNode.index].innerHTML = this.innerHTML;
						this.parentNode.style.display = 'none';
					
					};
			
				}
				
			})(aUl[i]);
		}		
	};
	
	mv.app.toRun = function(){
		
		var oRun = document.getElementById('run1');
		var oUl = oRun.getElementsByTagName('ul')[0];
		var aLi = oUl.getElementsByTagName('li');
		var aAbtn = oRun.getElementsByTagName('a');
		
		
		var iNow = 0;
		oUl.innerHTML += oUl.innerHTML;
		oUl.style.width = aLi.length*aLi[0].offsetWidth + 'px';
		
		//点击prev
		aAbtn[0].onclick = function(){
			//alert(iNow);
			if(iNow == 0){
				iNow = aLi.length/2;
				oUl.style.left = -oUl.offsetWidth/2 + 'px';
				
			}
			mv.ui.move(oUl,-iNow*aLi[0].offsetWidth,-(iNow-1)*aLi[0].offsetWidth);
			iNow -- ;
		};
		
		
		//点击next
		aAbtn[1].onclick = function(){
			//alert(iNow);
			if(iNow == aLi.length/2){
				iNow = 0;
				oUl.style.left = 0;
				
			}
			mv.ui.move(oUl,-iNow*aLi[0].offsetWidth,-(iNow+1)*aLi[0].offsetWidth);
			iNow ++;
			
		};
		
	};
	
	
	



