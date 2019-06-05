var Radius;
var time = 0;
var bass_radius;
var frequency = 0.005;
var radian = Math.PI/180;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
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

function start(){
var audioctx = new AudioContext();
const source = audioctx.createMediaElementSource(audio); 
const gainNode = audioctx.createGain();
gainNode.gain.value = 7;
source.connect(gainNode).connect(audioctx.destination);
var analyser = audioctx.createAnalyser();
source.disconnect();
source.connect(analyser);
analyser.fftSize =1024;
analyser.connect(audioctx.destination);
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var dataArray2 = new Uint8Array(bufferLength);
var angular_width = Math.PI*2/(bufferLength);
function animate(){
    if(controls.is_audio_playing){
      audio.play();
    }
    else 
    audio.pause();

    ctx.beginPath();
    animationref = requestAnimationFrame(animate) ;
    ctx.clearRect(0,0,innerWidth,innerHeight);    
    analyser.getByteTimeDomainData(dataArray);  
    analyser.getByteFrequencyData(dataArray2);
    Radius = controls.Radius + (dataArray2[bufferLength-2])*controls.intensity;
    time++;    
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
        draw_bars(ctx,angle+omega3+Math.PI,dataArray[i]/12,Radius/2);    
        }
        if(angle<=Math.PI*2)
        draw_bars(ctx,angle+omega2 ,dataArray[100]/10,dataArray2[0]/60);

  
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
  ctx.strokeStyle =  controls.color;
  ctx.stroke();
  ctx.beginPath();
  ctx.rotate(-angle);
  ctx.translate(-innerWidth/2, -innerHeight/2);
}

