var time = 0;
var Radius;
var params = {
  color: "rgb(230,148, 1)"
};

var bass_radius;
var frequency = 0.005;
var radian = Math.PI/180;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var animationref = null ;
const audioLoader = new AudioLoader();
var audios = ['audio_test','audio_test2','audio_test3','audio_test4','audio_test5','audio_test6','audio_test7','audio_test8','audio_test9','audio_test10','audio_test11'];
var controls = {
  current_audio:'audio_test7',
  is_audio_playing:false,
  intensity:1.7,
  auto_play:true,
  Radius:250,
  separation:1.8,
  frequency:0.005,
  font_size:'8vw',
  is_circle:true,
  vibrate:true
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
colorFolder.addColor( params, 'color' );
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
controlFolder.add(controls,'Radius',10,250).name('RADIUS').onChange(()=>{});
controlFolder.add(controls,'is_circle').name('CIRCLE').onChange(()=>{});
controlFolder.add(controls,'vibrate').name('VIBRATE');
// controlFolder.add(controls,'frequency',0.005,0.009).listen();

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
analyser.fftSize = 2048/2;
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
    Radius = controls.Radius + (dataArray[0]/20)*controls.intensity;
    time++;
    if(controls.vibrate)
    document.querySelector('img').style = ' transform:skewX('+Math.cos(dataArray2[100]/70)+'deg);';
    if(controls.is_circle){
    if(dataArray[30]/3 > 49){
    bass_radius = dataArray[10]*7/3;
    ctx.arc(innerWidth/2, innerHeight/2, bass_radius*1.5, 0 , Math.PI*2 ,0 );
    }

    else {
     bass_radius =dataArray[10]/3 ; 
     ctx.arc(innerWidth/2, innerHeight/2, bass_radius, 0 , Math.PI*2 ,0 );
    }

  }
    
    for(var i = 0;i < bufferLength; i++){
        let angle = i*angular_width*controls.separation;
        let omega1 = Math.sin(time*controls.frequency);
        let omega2 = Math.cos(time*controls.frequency);
        let omega3 = Math.sin(time*controls.frequency+Math.PI)
        if(i*angular_width*2.7<=Math.PI*2){
        draw_bars(ctx,i*angular_width*2.7 + omega1 ,dataArray2[i]/3 ,Radius);
        }
        if(angle>=(Math.PI*2)/3 && angle<Math.PI*13/6){
        draw_bars(ctx,angle+omega3,dataArray[i]/12,Radius/1.3);   
        }
        if(angle<=Math.PI*2)
        draw_bars(ctx,angle+omega2 ,dataArray[100]/4,dataArray2[0]/60);

  
    }
   
}
animate();
}
function draw_bars(ctx, angle,height,Radius){
 ctx.translate(innerWidth/2, innerHeight/2);
  ctx.moveTo(0, 0);
  ctx.lineWidth = 3;
  ctx.rotate(angle);
  ctx.moveTo(0,-Radius);
  ctx.lineTo(0,-(Radius+height));
  ctx.moveTo(0,0);
  ctx.strokeStyle =  params.color;
  ctx.stroke();
  ctx.beginPath();
  ctx.rotate(-angle);
  ctx.translate(-innerWidth/2, -innerHeight/2);
}

