
    var canvasID = document.getElementById("jdq-canvas");
    if (canvasID.getContext) {
        var ctx = canvasID.getContext("2d");
        /*-----------------------
        
         ctx.arc(75,75,50,0,Math.PI*2,true); //x , y ,圆弧（圆），开始 , endAngle结束 ， 默认为顺时针。
         ctx.fillRect (10, 10, 55, 50); //填充矩形  x y width height
         ctx.clearRect(45,45,60,60); //清楚指定区域，使其透明
         ctx.strokeRect(50,50,50,50); //绘制矩形边框
         ctx.moveTo(35,50); //将笔触移动到指定的坐标x以及y上 第一个点
         ctx.lineTo(100,75); //第二个点 下面
         ctx.fill(); 线条填色
         ctx.stroke(); 图形绘制
        -----------------------*/
        
        
        
        // ctx.fillStyle = "rgb(200,0,0)";
        // ctx.fillRect (10, 10, 55, 50); //填充矩形  x y width height
        // ctx.fillStyle = "rgba(0, 0, 200, 0.5)"; //颜色,透明
        // ctx.fillRect (30, 30, 55, 50);

        // ctx.fillRect(25,25,100,100); //填充矩形
        // ctx.clearRect(45,45,60,60); //清楚指定区域，使其透明
        // ctx.strokeRect(50,50,50,50); //绘制矩形边框
        
        // ctx.beginPath();
        // ctx.moveTo(35,50); //将笔触移动到指定的坐标x以及y上 第一个点
        // ctx.lineTo(100,75); //第二个点 下面
        // ctx.lineTo(100,25);
        // ctx.fill();
        
        // ctx.beginPath();
        // ctx.arc(75,75,50,0,Math.PI*2,true); //x , y ,圆弧（圆），开始 , endAngle结束 ， 默认为顺时针。
        // ctx.moveTo(110,75);
        // ctx.arc(75,75,35,0,Math.PI,false);   // 口(顺时针)
        // ctx.moveTo(65,65);
        // ctx.arc(60,65,5,0,Math.PI*2,true);  // 左眼
        // ctx.moveTo(95,65);
        // ctx.arc(90,65,5,0,Math.PI*2,true);  // 右眼
        // ctx.stroke();
        
        //  // 填充三角形
        // ctx.beginPath();
        // ctx.moveTo(25,25);
        // ctx.lineTo(105,25);
        // ctx.lineTo(25,105);
        // ctx.fill();

        // // 描边三角形
        // ctx.beginPath();
        // ctx.moveTo(125,125);
        // ctx.lineTo(125,45);
        // ctx.lineTo(45,125);
        // ctx.closePath();
        // ctx.stroke();
        
        // ctx.beginPath();
        // ctx.moveTo(75,15);
        // ctx.quadraticCurveTo(15,15,15,62.5);
        // ctx.quadraticCurveTo(15,100,50,100);
        // ctx.quadraticCurveTo(50,120,30,145);
        // ctx.quadraticCurveTo(60,120,65,100);
        // ctx.quadraticCurveTo(145,100,145,62.5);
        // ctx.quadraticCurveTo(145,15,75,15);
        // ctx.stroke();
        
        //三次曲线
        // ctx.beginPath();
        // ctx.moveTo(75,40);
        // ctx.bezierCurveTo(75,37,70,25,50,25);
        // ctx.bezierCurveTo(20,25,20,62.5,20,62.5);
        // ctx.bezierCurveTo(20,80,40,102,75,120);
        // ctx.bezierCurveTo(110,102,130,80,130,62.5);
        // ctx.bezierCurveTo(130,62.5,130,25,100,25);
        // ctx.bezierCurveTo(85,25,75,37,75,40);
        // ctx.fill();
        
        // 色值
        // for (var i=0;i<6;i++){
        //     for (var j=0;j<6;j++){
        //         ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*i) + ',' + 
        //         Math.floor(255-42.5*j) + ')';
        //         ctx.beginPath();
        //         ctx.arc(12.5+j*25,12.5+i*25,10,0,Math.PI*2,true);
        //         ctx.stroke();
        //     }
        // }


        // // 画背景
        // ctx.fillStyle = '#FD0';
        // ctx.fillRect(0,0,75,75);
        // ctx.fillStyle = '#6C0';
        // ctx.fillRect(75,0,75,75);
        // ctx.fillStyle = '#09F';
        // ctx.fillRect(0,75,75,75);
        // ctx.fillStyle = '#F30';
        // ctx.fillRect(75,75,75,75);
        // ctx.fillStyle = '#fff';
        // // 设置透明度值
        // ctx.globalAlpha = 0.2;
        // // 画半透明圆
        // for (var i=0; i<7; i++) {
        //     ctx.beginPath();
        //     ctx.arc(75,75,10+10*i,0,Math.PI*2,true);
        //     ctx.fill();
        // }

    }

var canvas = document.getElementById("jdq-canvas");
var ctx = canvas.getContext('2d');
var raf;


var ball = {
  x: 100,
  y: 100,
  vx: 5,
  vy: 2,
  radius: 25,
  color: 'blue',
  draw: function() {
    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

function draw() {

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ball.draw();
  ball.x += ball.vx;
  ball.y += ball.vy;
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('mouseover', function(e){
  raf = window.requestAnimationFrame(draw);
});

canvas.addEventListener("mouseout",function(e){
  window.cancelAnimationFrame(raf);
});

ball.draw();
/**
<style type="text/css">
    canvas { border: 1px solid black; }
</style>
<div class="min-height350 row">
    <canvas width="300" height="300" id="jdq-canvas"></canvas>
</div>
**/