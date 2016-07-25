function palette(cobj,canvas,copy){
	this.o=cobj;//绘制对象
	this.canvas=canvas;//标签
	this.copy=copy
	this.width=canvas.width;//画布宽度
	this.height=canvas.height//画布高度
	this.fillStyle='#000000';//填充颜色
	this.strokeStyle='#000000';//描边颜色
	this.type='pencil';//绘画类型   "line 线" "rect 矩形"  'tirangle 三角形' 'circle 圆' 'pencil' 'poly 多边形' 'poly 星型'
	this.style='stroke';//绘图的样式
	this.lineWidth=1;//描边的宽度
	this.status=[];//保存上一次绘画结果
	this.num=5;//多边形,多角形 数
};
// 设置样式
palette.prototype.init=function(){
	this.o.strokeStyle=this.strokeStyle;
	this.o.fillStyle=this.fillStyle;
	this.o.lineWidth=this.lineWidth;
}
//画布的逻辑
palette.prototype.draw=function(){
	var that=this;
	this.copy.onmousedown=function(e){//当在画布上点下鼠标时记录鼠标位置
		var sx=e.offsetX;
		var sy=e.offsetY;
		that.init();
		document.onmousemove=function(e){
			var ex=e.offsetX;
			var ey=e.offsetY;
			that.o.clearRect(0,0,that.width,that.height);
			if(that.status.length>0){		
				that.o.putImageData(that.status[that.status.length-1],0,0,0,0,that.width,that.height);
			};
				that[that.type](sx,sy,ex,ey);
		};
		document.onmouseup=function(e){
			document.onmousemove=null;
			document.onmouseup=null;
			that.status.push(that.o.getImageData(0,0,that.width,that.height));
		};
	};
};
//铅笔
palette.prototype.pencil=function(){
	var that=this;
	this.copy.onmousedown=function(){
		that.o.beginPath();
		that.init();
		document.onmousemove=function(e){
			var px=e.offsetX;
			var py=e.offsetY;
			that.o.lineTo(px,py);
			that.o.stroke();
		};
		document.onmouseup=function(){
			that.o.closePath();
			that.status.push(that.o.getImageData(0,0,that.width,that.height));
			document.onmousemove=null;
			document.onmouseup=null;
		};
	};
};
//画一条直线
palette.prototype.line=function(x1,y1,x2,y2){
	this.o.beginPath();
	this.o.moveTo(x1,y1);
	this.o.lineTo(x1,y1);
	this.o.lineTo(x2,y2);
	this.o.closePath();
	this.o.stroke();
};
//画一个矩形
palette.prototype.rect=function(x1,y1,x2,y2){
	var w=x2-x1;
	var h=y2-y1
	this.o.beginPath();
	this.o.moveTo(x1,y1);
	this.o.rect(x1,y1,w,h);
	this.o.closePath();
	this.o[this.style]();
};
//画一个三角形
palette.prototype.tirangle=function(x1,y1,x2,y2){
	this.o.beginPath();
	this.o.moveTo(x1,y1);
	this.o.lineTo(x1,y1);
	this.o.lineTo(x1,y2);
	this.o.lineTo(x2,y2);
	this.o.closePath();
	this.o[this.style]();
};
//画一个圆，把矩形的对角线长度当成圆的半径
palette.prototype.circle=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	this.o.beginPath();
	this.o.arc(x1,y1,r,0,Math.PI*2);
	this.o.closePath();
	this.o[this.style]();
};
//求矩形对角线的长度（勾股定理）
palette.prototype._r=function(x1,y1,x2,y2){
	var a=x2-x1;
	var b=y2-y1;
	return Math.sqrt(a*a+b*b);
};
// 多边形
palette.prototype.poly=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var n=this.num;
	var ang=360/n;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r,y1+Math.sin(Math.PI/180*ang*i)*r)
	};
	this.o.closePath();
	this.o[this.style]();
};
// 多角形
palette.prototype.polystar=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var r1=r*0.5;
	var n=this.num*2;
	var ang=360/n;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		if(i%2==0){
			this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r,y1+Math.sin(Math.PI/180*ang*i)*r)
		}else{
			this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r1,y1+Math.sin(Math.PI/180*ang*i)*r1)
		};
		
	};
	this.o.closePath();
	this.o[this.style]();
};

// 橡皮擦
palette.prototype.eraser=function(){
	var that=this;
	this.copy.onmousedown=function(e){
		var er=that.lineWidth;
		var dx=e.offsetX;
		var dy=e.offsetY;
		var a=document.createElement("div");
		a.style.cssText="width:"+er+"px;height:"+er+"px;border:2px dotted #666;position:absolute";
		document.onmousemove=function(e){
			var mx=e.offsetX;
			var my=e.offsetY;
			that.o.clearRect(mx-er/2,my-er/2,er,er);
			a.style.left=mx-er/2+"px";//有偏差
			a.style.top=my-er/2+"px";//有偏差
			console.log(a.style.top);
			console.log(a.style.left);
			console.log(mx);
			console.log(my);
			that.copy.parentNode.appendChild(a);
		};
		document.onmouseup=function(){
			that.copy.parentNode.removeChild(a);
			that.status.push(that.o.getImageData(0,0,that.width,that.height));
			document.onmousemove=null;
			document.onmouseup=null;
		};
	};
};