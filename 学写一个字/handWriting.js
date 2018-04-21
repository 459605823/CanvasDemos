var canvas = document.getElementById("canvas");
var cxt = canvas.getContext("2d");
//自适应大小
canvas.width = Math.min(800,$(window).width()-20);
canvas.height = Math.min(800,$(window).width()-20);
var strokeColor = "black";
window.onload = function(){
  drawGrid();
  prepareActions();
  prepareButtons();
  $(".control").css("width",canvas.width+"px");
}
function drawGrid(){
  cxt.save();
  cxt.strokeStyle = "rgb(230,11,9)";
  //绘制外边框
  cxt.beginPath();
  cxt.moveTo(3,3);
  cxt.lineTo(canvas.width-3,3);
  cxt.lineTo(canvas.width-3,canvas.height-3);
  cxt.lineTo(3,canvas.height-3);
  cxt.closePath();
  cxt.lineWidth = 6;
  cxt.stroke();
  //绘制米字格
  cxt.setLineDash([2, 5]);
  cxt.beginPath();
  //绘制对角线
  cxt.moveTo(0,0);
  cxt.lineTo(canvas.width,canvas.height);
  cxt.moveTo(canvas.width,0);
  cxt.lineTo(0,canvas.height);
  //绘制十字线
  cxt.moveTo(canvas.width/2,0);
  cxt.lineTo(canvas.width/2,canvas.height);
  cxt.moveTo(0,canvas.height/2);
  cxt.lineTo(canvas.width,canvas.height/2);
  cxt.lineWidth = 1;
  cxt.stroke();
  cxt.restore();
}
function windowToCanvas(x,y){//获取鼠标在canvas的点击位置
  var box = canvas.getBoundingClientRect();
  return {x:Math.round(x-box.left),y:Math.round(y-box.top)};
}
function prepareActions(){
  var isMouseDown = false;
  var lastLoc = {x:0,y:0};
  var lastTimeStamp = 0;//开始绘制的时间戳
  var lastLineWidth = -1;//初次线条宽度
  //鼠标事件
  canvas.onmousedown = function(e){
    e.preventDefault();
    isMouseDown = true;
    lastLoc = windowToCanvas(e.clientX,e.clientY);//鼠标点击位置的坐标
    lastTimeStamp = new Date().getTime();//获取开始绘制的时间戳
  }
  canvas.onmousemove = function(e){
    e.preventDefault();
    if(isMouseDown){
      var curLoc = windowToCanvas(e.clientX,e.clientY);//鼠标移动后的位置坐标
      var curTimeStamp = new Date().getTime();//鼠标移动后的时间戳
      var s = calcDistance(curLoc,lastLoc);//移动后坐标与上次坐标之间的距离
      var t = curTimeStamp - lastTimeStamp;//移动共需的时间
      var lineWidth = calcLineWidth(t,s,lastLineWidth);//根据鼠标的移动速度设置线条宽度
      drawLine(curLoc,lastLoc,lineWidth);
      lastLoc = curLoc;//更新起点位置坐标为此次结束点位置坐标
      lastTimeStamp = curTimeStamp;//更新起点时间戳为此次结束点时间戳
      lastLineWidth = lineWidth;//更新起点线条宽度为此次结束点线条宽度
    }
  }
  canvas.onmouseup = function(e){
    e.preventDefault();
    isMouseDown = false;
  }
  canvas.onmouseout = function(e){
    e.preventDefault();
    isMouseDown = false;
  }
  //移动端触摸事件
  canvas.addEventListener("touchstart",function(e){
    e.preventDefault();
    var touch = e.touches[0];//设置初始坐标为第一个触摸点
    isMouseDown = true;
    lastLoc = windowToCanvas(touch.pageX,touch.pageY);
    lastTimeStamp = new Date().getTime();
  })
  canvas.addEventListener("touchmove",function(e){
    e.preventDefault();
    if(isMouseDown){
      var touch = e.touches[0];//设置初始坐标为第一个触摸点
      var curLoc = windowToCanvas(touch.pageX,touch.pageY);
      var curTimeStamp = new Date().getTime();
      var s = calcDistance(curLoc,lastLoc);
      var t = curTimeStamp - lastTimeStamp;
      var lineWidth = calcLineWidth(t,s,lastLineWidth);
      drawLine(curLoc,lastLoc,lineWidth);
      lastLoc = curLoc;
      lastTimeStamp = curTimeStamp;
      lastLineWidth = lineWidth;
    }
  })
  canvas.addEventListener("touchend",function(e){
    e.preventDefault();
    isMouseDown = false;
  })
}
function prepareButtons(){
  $("#clearBtn").click(
    function(e){
      cxt.clearRect(0,0,canvas.width,canvas.height);
      drawGrid();
    }
  )
  $(".colorBtn").click(
    function(e){
      $(".colorBtn").removeClass("colorBtnSelected");
      $(this).addClass("colorBtnSelected");
      strokeColor = $(this).css("background-color");
    }
  )
}
function drawLine(curLoc,lastLoc,lineWidth){
  cxt.save();
  cxt.beginPath();
  cxt.moveTo(lastLoc.x,lastLoc.y);
  cxt.lineTo(curLoc.x,curLoc.y);
  cxt.lineWidth = lineWidth;
  cxt.lineCap = "round";
  cxt.lineJoin = "round";
  cxt.strokeStyle = strokeColor;
  cxt.stroke();
  cxt.restore();
}
function calcDistance(loc1,loc2){//计算两点之间的距离
  return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
}
function calcLineWidth(t,s,lastLineWidth){
  var maxSpeed = 10;
  var minSpeed = 0.1;
  var maxLineWidth = 25;
  var minLineWidth = 1;
  var v = s/t;//获取鼠标移动速度
  var resultLineWidth  = 0;
  if(v <= minSpeed){
    resultLineWidth = maxLineWidth;
  }else if(v >= maxSpeed){
    resultLineWidth = minLineWidth;
  }
  else{
    //(v-minSpeed)/(maxSpeed-minSpeed)：获取此速度占总速度的比例
    //*(maxLineWidth-minLineWidth)：获取此速度占总宽度的比例
    resultLineWidth = maxLineWidth - (v-minSpeed)/(maxSpeed-minSpeed)*(maxLineWidth-minLineWidth);
  }
  if(lastLineWidth == -1){
    return resultLineWidth;
  }else{
    //设置平滑过渡:上次线条宽度占2/3,这次的占1/3
    return Math.sqrt(resultLineWidth*resultLineWidth*1/3 + lastLineWidth*lastLineWidth*2/3);
  }
}
