var Radius;
var radian = Math.PI/180;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var animationref = null ;
const audioLoader = new AudioLoader();
var audios = ['audio_test','audio_test2','audio_test3'];
var controls = {
  current_audio:'audio_test3',
  is_audio_playing:false,
  intensity:3.3,
  auto_play:true,
  Radius:250,
  font_size:'8vw'
}
var colors = {
  outer:270,
  inner:184
}
var gui = new dat.GUI({ height:500});
var txt = "PLAY THEN !!" ;
var controlFolder = gui.addFolder('CONTROLS_BASIC');
var colorFolder  = gui.addFolder('STROKE_COLOR');
var audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');

audio.crossOrigin = "anonymous";
canvas.width = innerWidth;
canvas.height = innerHeight;
if(window.innerWidth<300)
controls.font_size = '8vw' ;
else
controls.font_size = '6vw' ;
ctx.font = ''+ controls.font_size+' Cinzel, serif';
ctx.fillStyle = 'rgba(255,255,255,0.5)';
ctx.textAlign = "center";
ctx.fillText(txt, canvas.width/2, canvas.height/2); 
colorFolder.add(colors,'outer',0,360);
colorFolder.add(colors,'inner',0,360);
colorFolder.open();

controlFolder.add(controls, 'is_audio_playing').name('PLAY/PAUSE').listen().onChange(()=>{ if(controls.is_audio_playing){ start()}});
controlFolder.add(controls, 'current_audio',audios).name('PLAYLIST').onChange(()=>{ audio.pause(); 
  cancelAnimationFrame(animationref);  
  audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');
  controls.is_audio_playing = false;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.font = ''+ controls.font_size+' Cinzel, serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.textAlign = "center";
  ctx.fillText(txt, canvas.width/2, canvas.height/2); 
}
);
controlFolder.add(controls,'Radius',10,250).name('Radius').onChange(()=>{});
controlFolder.add(controls,'intensity',1,15).name('VIBRATIONS').onChange(()=>{});

controlFolder.open();  


function start(){
var audioctx = new AudioContext();
const source = audioctx.createMediaElementSource(audio); 
const gainNode = audioctx.createGain();
gainNode.gain.value = 7;
source.connect(gainNode).connect(audioctx.destination);
var analyser = audioctx.createAnalyser();
source.disconnect();
source.connect(analyser);
analyser.fftSize = 512;
analyser.connect(audioctx.destination);
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var dataArray2 = new Uint8Array(bufferLength);
var angular_width = Math.PI*2/(bufferLength);
var rect_width = innerWidth/bufferLength ;
function animate(){

    if(controls.is_audio_playing){
      audio.play();
    }
    else 
    audio.pause();

    ctx.beginPath();
    analyser.getByteTimeDomainData(dataArray);  
    analyser.getByteFrequencyData(dataArray2);
    animationref = requestAnimationFrame(animate) ;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    Radius = controls.Radius + (dataArray2[10]/100)*controls.intensity;
    for(var i = 0;i*angular_width*3<Math.PI*2; i++){
      if(i*angular_width*3 < Math.PI/2-radian*4&&i*angular_width*3 >0+4*radian ||i*angular_width*3<Math.PI - 4*radian&&i*angular_width*3> Math.PI/2 + 4*radian||i*angular_width*3>Math.PI + 4*radian &&i*angular_width*3 <Math.PI*3/2-4*radian ||i*angular_width*3>Math.PI*3/2+radian*4&&i*angular_width*3<Math.PI*2 -4*radian)
        draw_particles(ctx,i*angular_width*3 ,dataArray[0]/9,Radius/1.9);
        else{}
        draw_bars(ctx,i*angular_width*3,dataArray2[i]/3.5 ,Radius);  
    }
   
}
animate();
}

function draw_bars(ctx, angle,height,Radius){
 ctx.translate(innerWidth/2, innerHeight/2);
  ctx.lineWidth = "2.2";
  ctx.moveTo(0, 0);
  ctx.rotate(angle);
  ctx.moveTo(0,-Radius);
  ctx.lineTo(0,-(Radius+height));
  ctx.moveTo(0,0);
  ctx.strokeStyle = 'hsl('+colors.outer+',64%,57%)';
   ctx.stroke();
  ctx.beginPath();
  ctx.rotate(-angle);
  ctx.translate(-innerWidth/2, -innerHeight/2);
}

function draw_particles(ctx,angle,height,radius){
  ctx.translate(innerWidth/2, innerHeight/2);
  ctx.rotate(angle);
  ctx.moveTo(0, 0);
   ctx.moveTo(0,-radius-height);
  ctx.arc(0,-radius-height,3.5,0,Math.PI*2);
  ctx.fillStyle = 'hsl('+colors.inner+', 64%,57%)';
  ctx.fill();
  ctx.beginPath();
  ctx.rotate(-angle);
  ctx.translate(-innerWidth/2, -innerHeight/2);
}

