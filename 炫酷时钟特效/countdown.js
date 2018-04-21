var window_width,window_height,margin_top,margin_left,radius;
// const endTime = new Date(2018,3,12,18,47,52);//结束日期!!因为小时为两位数，所以天数不能超过4天，月份从0开始
var curShowTimeSeconds = 0;//保存现在到结束日期相差的秒数
var balls = [];//用于保存小球的数组
var colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC00CC"];
window.onload = function(){
  window_width = document.documentElement.clientWidth-20;
  window_height = document.documentElement.clientHeight-20;
  //margin_left占屏幕十分之一
  margin_left = Math.round(window_width/10);
  //window_width*4/5所有文字所占宽度,最后一个数字距左边距离为93*(radius+1),则总距离为93+15=108个(radius+1)
  radius = Math.round(window_width*4/5/108)-1;
  margin_top = Math.round(window_height/5);
  var canvas = document.getElementById("canvas");
  var cxt = canvas.getContext("2d");
  canvas.width = window_width;
  canvas.height = window_height;
  curShowTimeSeconds = getCurrentShowTimeSeconds();
  setInterval(function(){
    render(cxt);
    update();
  },50)
}
//获取现在到结束日期相差的秒数
function getCurrentShowTimeSeconds(){
  var curTime = new Date();
  //改进为时钟效果
  var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
  // ret = Math.round(ret/1000);//将毫秒转化为秒
  return ret;
}
function update(){
  var nextShowTimeSeconds = getCurrentShowTimeSeconds();
  var nextHours = parseInt(nextShowTimeSeconds/3600);
  var nextMinutes = parseInt(nextShowTimeSeconds-nextHours*3600)/60;
  var nextSeconds = nextShowTimeSeconds % 60;
  var curHours = parseInt(curShowTimeSeconds/3600);
  var curMinutes = parseInt(curShowTimeSeconds-curHours*3600)/60;
  var curSeconds = curShowTimeSeconds % 60;
  if(nextSeconds !== curSeconds){//如果时间发生变化，则将时间更新为现在的时间
    curShowTimeSeconds = nextShowTimeSeconds;
  }
  //当每个数字改变时就添加小球
    if(parseInt(curHours/10) !== parseInt(nextHours/10)){
      addBalls(margin_left,margin_top,parseInt(curHours/10));
    }
    if(parseInt(curHours%10) !== parseInt(nextHours%10)){
      addBalls(margin_left+15*(radius+1),margin_top,parseInt(curHours%10));
    }
    if(parseInt(curMinutes/10) !== parseInt(nextMinutes/10)){
      addBalls(margin_left+39*(radius+1),margin_top,parseInt(curMinutes/10));
    }
    if(parseInt(curMinutes%10) !== parseInt(nextMinutes%10)){
      addBalls(margin_left+54*(radius+1),margin_top,parseInt(curMinutes%10));
    }
    if(parseInt(curSeconds/10) !== parseInt(nextSeconds/10)){
      addBalls(margin_left+78*(radius+1),margin_top,parseInt(curSeconds/10));
    }
    if(parseInt(curSeconds%10) !== parseInt(nextSeconds%10)){
      addBalls(margin_left+93*(radius+1),margin_top,parseInt(curSeconds%10));
    }
  updateBalls();
}
function updateBalls(){//设置小球的运动状态
  for(var i=0;i<balls.length;i++){
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;
    //碰撞检测：当小球碰撞到底部发生反弹
    if(balls[i].y >= window_height-radius){
      balls[i].y = window_height-radius;
      balls[i].vy = -balls[i].vy*0.7;
    }
  }
  for(var i=0;i<balls.length;i++){
    //balls[i].x+radius小球的右边缘超过左边且左边缘超过右边则小球不在画面内
    if(balls[i].x+radius<0 && balls[i].x-radius>window_width){
      balls.splice(i,1);//如果这个小球超出画面，则将其从数组中移除
     }
   }
}
function addBalls(x,y,num){//遍历这个数字的数据结构，添加相应数目小球
  for(var i=0;i<digit[num].length;i++){
    for(var j=0;j<digit[num][i].length;j++){
      if(digit[num][i][j] === 1){
        var aBall = {//初始化小球信息
          x:x+j*2*(radius+1)+(radius+1),
          y:y+i*2*(radius+1)+(radius+1),
          g:1.5+Math.random(),
          //Math.pow(x,y)x为底，y为幂,Math.pow(-1,Math.ceil(Math.random()*1000))随机产生正负一
          vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
          vy:-4,
          //Math.floor(Math.random()*colors.length)产生0-10不包含10的随机数
          color:colors[Math.floor(Math.random()*colors.length)]
        }
        balls.push(aBall);//将小球添加到balls数组中
      }
    }
  }
}
function render(cxt){
  //clearRect() 方法清空给定矩形内的指定像素。
  //context.clearRect(x,y,width,height);(x,y)要清除矩形左上角坐标
  cxt.clearRect(0,0,window_width,window_height);
  var hours = parseInt(curShowTimeSeconds/3600);
  var minutes = parseInt(curShowTimeSeconds-hours*3600)/60;
  var seconds = curShowTimeSeconds%60;
  renderDigit(margin_left,margin_top,parseInt(hours/10),cxt);//绘制个位数
  // 15*(radius+1):digit为7乘10数据,所以一行宽度为7*2*(radius+1),使用15是让数字之间有一定空隙
  renderDigit(margin_left+15*(radius+1),margin_top,parseInt(hours%10),cxt);//绘制十位数
  renderDigit(margin_left+30*(radius+1),margin_top,10,cxt);//绘制冒号,digit的第十个数据为冒号
  //冒号为4乘10数据,所以宽度为4*2*(radius+1)
  renderDigit(margin_left+39*(radius+1),margin_top,parseInt(minutes/10),cxt);
  renderDigit(margin_left+54*(radius+1),margin_top,parseInt(minutes%10),cxt);
  renderDigit(margin_left+69*(radius+1),margin_top,10,cxt);
  renderDigit(margin_left+78*(radius+1),margin_top,parseInt(seconds/10),cxt);
  renderDigit(margin_left+93*(radius+1),margin_top,parseInt(seconds%10),cxt);
  for(var i=0;i<balls.length;i++){//绘制掉落的彩色小球
    cxt.globalCompositeOperation = "xor";
    cxt.fillStyle = balls[i].color;
    cxt.beginPath();
    cxt.arc(balls[i].x,balls[i].y,radius,0,2*Math.PI);
    cxt.fill();
  }
}
function renderDigit(x,y,num,cxt){//绘制组成数字的小球
  cxt.fillStyle = "rgb(0,102,153)";
  for(var i=0;i<digit[num].length;i++){//i行数
    for(var j=0;j<digit[num][i].length;j++){//j列数
      if(digit[num][i][j] === 1){
        cxt.beginPath();
        //第(i,j)个圆圆心位置:x+j*2*(radius+1)+(radius+1),y+i*2*(radius+1)+(radius+1)
        cxt.arc(x+j*2*(radius+1)+(radius+1),y+i*2*(radius+1)+(radius+1),radius,0,2*Math.PI);
        cxt.fill();
      }
    }
  }
}
