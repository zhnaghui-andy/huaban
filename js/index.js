$(function(){
	var newP=$('.newP');
	var $palette=$('.palette');
	var PW=$palette.width();
	var PH=$palette.height(); 
	var capacity=$('.capacity');
	// newP.click(function(){
	// 	$palette.append("<canvas id='canvas' width="+PW+" height="+PH+">");
	// 	var p=new palette(canvas.getContext('2d'),canvas);
	// 	p.draw();
	// })
  	var canvas=null;
  	var copy=null;
	var parent=null;
  	newP.click(function(){
		var h=null;
  		var w=null;
  		var yes=$('.yes');//画布高度确认按钮；
  		var none=$('.none');//画布取消按钮；
  		var nwidth=$('.nwidth input');//宽度输入框；
  		var nheight=$('.nheight input');//高度输入框；
  		var strokeColor=$('.strokeColor').find('input');//描边调色框
  		var fillColor=$('.fillColor').find('input');//填充调色框
  		var lineWidth=$('.lineWidth').find('input');
  		var $fill=$('.fill');
  		var $stroke=$('.stroke');
  		var $back=$('.back');
  		var $next=$('.next');
  		var $clear=$('.clear')
  		var $xianshi=$('.xianshi')
  		var $save=$('.save');
  		capacity.css({display:"block"})//点击时显示；
  		yes.click(function(){
  			w=nwidth.val();
  			h=nheight.val();
			canvas=$("<canvas>").attr({width:w,height:h}).css({position:"absolute",left:0,top:0,bottom:0});//创建画布
			copy=$('<div>').css({width:w,height:h,position:'absolute',margin:'auto',left:0,top:0,right:0,bottom:0,zIndex:99});
			parent=$('<div>').css({width:w,height:h,position:"absolute",margin:"auto",left:0,right:0,top:0,bottom:0});
			$palette.append(parent);
			parent.append(copy);
			parent.append(canvas);//插入画布；
			capacity.css({display:"none"});//点击时消失
			var p=new palette(canvas[0].getContext('2d'),canvas[0],copy[0]);//构造函数
			var divs=$('div[role]');
			p.pencil();

			//改变填充或描边颜色；
			strokeColor.change(function(){//当颜色改变时，赋值改变；
				p.strokeStyle=strokeColor.val();
			});
			fillColor.change(function(){ //当颜色改变时，赋值改变；
				p.fillStyle=fillColor.val();
			});
			//保持图片
			$save.click(function(){
				var a=canvas[0].toDataURL();
				console.log(a)
				location.href= a.replace('image/png','image/octet-stream')
			})
			//选择绘制图案
			divs.click(function(){
				if($(this).attr('role')=='pencli'){//铅笔
						p.pencil();
				}else{
					p.type=$(this).attr("role")//其他类型
					if($(this).attr("role")=='poly'||$(this).attr("role")=='polystar'){
						var num=prompt("请输入边数",5);
						p.num=num
					}
					p.draw()
				};
			});

			//选择绘制方法
			$fill.click(function(){
				p.style="fill";
			});
			$stroke.click(function(){
				p.style="stroke";
			});

			//返回上一步：
			var spare=[];
			$back.click(function(){
				if(p.status.length>1){	
					var leng=p.status.pop();
				 	spare.push(leng)
					p.o.putImageData(p.status[p.status.length-1],0,0,0,0,p.width,p.height);
				}else if(p.status.length==1){
					p.status.pop();
					p.o.clearRect(0,0,p.width,p.height)
				}else{
					alert('没有上一步')
				};
			});
			//当前下一步
			$next.click(function(){
				if(spare.length==0){
					alert("没有下一步了");
				}else if(spare.length==1){
					p.status.push(spare[0]);
					p.o.putImageData(p.status[p.status.length-1],0,0,0,0,p.width,p.height);
					spare=[];
				}else{
					p.status.push(spare[spare.length-1]);
					p.o.putImageData(p.status[p.status.length-1],0,0,0,0,p.width,p.height);
					spare.pop();
				};
			});
			//描边粗细
			lineWidth.change(function(){
				p.lineWidth=lineWidth.val();
				console.log(lineWidth.val())
				$xianshi.html(lineWidth.val());

			});

			//橡皮擦
			$clear.click(function(){
				p.eraser();
			});
			 //保存
			// $save.click(function(){
			// 	var base64=canvas.o.toDataURL('image/jpeg');
			// 	console.log(base64)
			// })
			$


  		});
  		none.click(function(){
  			capacity.css({display:'none'});
  		});
	});













})