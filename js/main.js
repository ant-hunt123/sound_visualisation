const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
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
audioctx = new AudioContext();
source = audioctx.createMediaElementSource(audio); 
analyser = audioctx.createAnalyser();
source.disconnect();
source.connect(analyser);
analyser.fftSize = 512/2;
analyser.connect(audioctx.destination);
bufferLength = analyser.frequencyBinCount;
time_domain_data = new Uint8Array(bufferLength);
frequency_domain_data = new Uint8Array(bufferLength);
angular_width = Math.PI*2/(bufferLength);

function animate(){
    if(controls.is_audio_playing){
      audio.play();
    }
    else 
    audio.pause();

    ctx.beginPath();
    animationref = requestAnimationFrame(animate) ;
    ctx.clearRect(0,0,innerWidth,innerHeight);    

    analyser.getByteTimeDomainData(time_domain_data);  
    analyser.getByteFrequencyData(frequency_domain_data);

    Radius = controls.Radius+ (frequency_domain_data[80])*controls.intensity*200;
    Radius2 = controls.Radius+ (frequency_domain_data[80])*controls.intensity*8;
    Radius3 = controls.Radius+ (time_domain_data[80])*controls.intensity*8;
    time++;    

    if(controls.is_circle){
      if(time_domain_data[80]/3 > 49){
        high = true;      
        limit = 25 ;

       
        bass_radius = time_domain_data[10]*7/3;
        ctx.beginPath();
        ctx.arc(innerWidth/2, innerHeight/2, bass_radius*1.5, 0 , Math.PI*2 ,0 );
        ctx.strokeStyle = controls.color;
        ctx.shadowBlur = 200;
        ctx.stroke();
        ctx.closePath();
      }

      else limit  = 100;

      
       if( time_domain_data[30]/3 < 40) {
    
         high = false ;
        //  limit  = 3 ;
        bass_radius =time_domain_data[10]/3 ; 
        ctx.beginPath();
        ctx.arc(innerWidth/2, innerHeight/2, bass_radius, 0 , Math.PI*2 ,0 );
        ctx.stroke();
        ctx.closePath();
      }
    }
    


    radius1 = Radius/3;
    radius2 = Radius2/1.2;
    radius3 = Radius2/4;
    
    omega1 = Math.sin(time*controls.frequency*2);
    omega2 = Math.sin(time*controls.frequency + Math.PI);
    omega3 = Math.sin(time*controls.frequency + Math.PI/2);


    if(controls.is_audio_playing){
      if(time>=limit){
       controls.sides = Math.floor(Math.abs(Math.sin(Radius2)*3))+2;
       time = 0;
       }
     }
    for(var i = 1;i < bufferLength; i++){
        angle = i*(angular_width)*controls.separation; 
        angle2 = i*(angular_width)*controls.side_length ;
        if(angle>2*radian && angle<Math.PI/2-2*radian || angle>Math.PI/2+2*radian&&angle<Math.PI-2*radian||angle>Math.PI+2*radian&&angle<Math.PI*3/2-2*radian||angle>Math.PI*3/2+2*radian&&angle<Math.PI*2-2*radian){
          draw_bars(ctx,angle+omega2,-15,radius1); 
          draw_bars(ctx,angle+omega3,+18,radius2); 
         }
       draw_polygon(ctx,center,controls.sides ,Radius3/2.2+ frequency_domain_data[80]/2,omega1);
       draw_polygon(ctx,center,controls.sides,Radius3/2.2+ frequency_domain_data[80]/2,omega1 + Math.PI/3);
      //  draw_polygon(ctx,center,Math.floor(Math.abs(Math.sin(Radius)*3)) ,Radius3/1.2+ frequency_domain_data[80]/2,omega2); 
      }

}
animate();
}

function draw_bars(ctx, angle,height,Radius){
  ctx.translate(innerWidth/2, innerHeight/2);
  ctx.moveTo(0, 0);
  ctx.lineWidth = 3;
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0,-Radius);
  ctx.lineTo(0,-(Radius+height));
  ctx.moveTo(0,0);
  if(high) ctx.strokeStyle = "red";
  else 
  ctx.strokeStyle =  controls.color;

  ctx.stroke();
  ctx.closePath();
  ctx.rotate(-angle);
  ctx.translate(-innerWidth/2, -innerHeight/2);
}

function draw_polygon(ctx, center, sides, radius, omega){
  let angular_width = Math.PI*2/sides;
  ctx.beginPath();
  for(let i = 0; i<sides; i++){
    ctx.moveTo(move_point(center,i,radius,angular_width,omega).x,move_point(center,i,radius,angular_width,omega).y);
    ctx.lineTo(move_point(center,i+1,radius,angular_width,omega).x,move_point(center,i+1,radius,angular_width,omega).y);
  }
  ctx.closePath();
  ctx.lineWidth = .5;
  ctx.strokeStyle = 'cyan';
  ctx.shadowBlur = 200 ;
  ctx.stroke();
  
}
function move_point(center,index,radius,angular_width,omega){
  let angle = index*angular_width;
  return position = {x:center.x + (radius)*Math.cos(angle+omega),y:center.y + (radius)*Math.sin(angle+omega) };
}




