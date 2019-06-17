
function start(){
var audiodata = new AudioData(audio);
angular_width = Math.PI*2/(audiodata.bufferLength);

function animate(){
    time++;    
    if(controls.is_audio_playing){
      if(time>=limit){
        controls.sides = Math.floor(Math.abs(Math.sin(Radius2)*3))+2;
        time = 0;
      }
      audio.play();
    }
    else 
    audio.pause();
    ctx.beginPath();
    animationref = requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);    

    let frequency_domain_data = audiodata.frequency_domain(1);
    let time_domain_data = audiodata.time_domain(2);
    Radius = controls.Radius+ (frequency_domain_data[80])*controls.intensity*200;
    Radius2 = controls.Radius+ (frequency_domain_data[80])*controls.intensity*8;
    Radius3 = controls.Radius+ (time_domain_data[80])*controls.intensity*8;

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
        bass_radius = time_domain_data[10]/3 ; 
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
    for(var i = 1;i < audiodata.bufferLength; i++){
        angle = i*(angular_width)*controls.separation; 
        angle2 = i*(angular_width)*controls.side_length ;
        if(angle>2*radian && angle<Math.PI/2-2*radian || angle>Math.PI/2+2*radian&&angle<Math.PI-2*radian||angle>Math.PI+2*radian&&angle<Math.PI*3/2-2*radian||angle>Math.PI*3/2+2*radian&&angle<Math.PI*2-2*radian){
          draw_bars(ctx,angle+omega2,-15,radius1); 
          draw_bars(ctx,angle+omega3,+18,radius2); 
         }
         draw_polygon(ctx,center,controls.sides ,Radius3/2.2+ frequency_domain_data[80]/2,omega1);
         draw_polygon(ctx,center,controls.sides,Radius3/2.2+ frequency_domain_data[80]/2,omega1 + Math.PI/3);
      }

}
animate();
}






