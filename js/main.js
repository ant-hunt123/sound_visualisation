function start() {
  var audiodata = new AudioData(audio);
  angular_width = Math.PI * 2 / (audiodata.bufferLength);

  function animate2(canvas , ctx, tweakX = 1, tweakY = 1,) {
    this.tweakX = tweakX;
    this.tweakY = tweakY;
    this.canvas = canvas;
    this.ctx = ctx;
    this.Particles = [];
    this.direction = 'right';
    

    this.drawPoint =  function(x,y,size,color) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, size*2, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.strokeStyle = 'cyan';
      this.ctx.shadowBlur = .1 ;
      this.ctx.shadowColor = "white";
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      this.ctx.fillStyle = 'rgba(' + color + ' ,' + color / 200 + ',' + color / 2 + ',' + color / 50 + ')';
      this.ctx.fill();
      // console.log(x, y, size, 0, Math.PI * 2)
    }
    
    this.init = function(){
      if(this.direction =='right')
        for (let i = 0; i < 1000; i++) {
          this.Particles[i] = [600* (Math.random()*this.canvas.width/2 + this.canvas.width/2), 500 * (Math.random() * this.canvas.height - this.canvas.height / 2), Math.random() * 100 + 1, Math.random() * 255];
        }
        else if(this.direction=='left')
        for (let i = 0; i < 1000; i++) {
          this.Particles[i] = [-600* (Math.random()*this.canvas.width/2 + this.canvas.width/2), 500 * (Math.random() * this.canvas.height - this.canvas.height / 2), Math.random() * 100 + 1, Math.random() * 255];
        }
    }
  
    this.update = function() {
      for (let i = 0; i < this.Particles.length; i++) {
       this.Particles[i][2] -= 1;
        if (this.Particles[i][2] < 1) {
          this.Particles[i][2] = Math.random() * 1000 + 1;
        }
      }
    }
  
    this.draw  = function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let angle = Math.random() * Math.PI * 2;
  
      for (let i = 0; i < this.Particles.length; i++) {
        this.drawPoint(this.canvas.width / 2 + (this.Particles[i][0] / this.Particles[i][2]) / this.tweakX, this.canvas.height / 2 + (this.Particles[i][1] /this.Particles[i][2]) / this.tweakY, 500 /this. Particles[i][2],this.Particles[i][3]);
      }
    }
    this.loop = function(){
      this.update();
      this.draw();
      console.log("hello")
      // requestAnimationFrame(loop);
    }
  }


  var animate21 = new animate2(canvas2, ctx2);
  var animate22 = new animate2(canvas3, ctx3);
  animate21.direction = 'right';
  animate22.direction = 'left';


  animate21.init();
  animate22.init();


  function animate() {
    time++;
    if (controls.is_audio_playing) {
      if (time >= limit) {
        controls.sides = Math.floor(Math.abs(Math.sin(Radius2) * 3)) + 2;
        time = 0;
      }
      audio.play();
    } else
      audio.pause();
    ctx.beginPath();
    animationref = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    var  frequency_domain_data = audiodata.frequency_domain(1);
    var  time_domain_data = audiodata.time_domain(2);
    // if(frequency_domain_data &&time_domain_data)


    Radius = controls.Radius + (frequency_domain_data[80]) * controls.intensity * 200;
    Radius2 = controls.Radius + (frequency_domain_data[80]) * controls.intensity * 8;
    Radius3 = controls.Radius + (time_domain_data[80]) * controls.intensity * 8;

    if (controls.is_circle) {
      if (time_domain_data[80] / 3 > 49) {
        high = true;
        limit = 25;
        bass_radius = time_domain_data[10] * 7 / 3;
        ctx.beginPath();
        ctx.arc(innerWidth / 2, innerHeight / 2, bass_radius * 1.5, 0, Math.PI * 2, 0);
        ctx.strokeStyle = controls.color;
        ctx.shadowBlur = 200;
        ctx.stroke();
        ctx.closePath();
      } else limit = 100;

      if (time_domain_data[30] / 3 < 40) {
        high = false;
        bass_radius = time_domain_data[10] / 3;
        ctx.beginPath();
        ctx.arc(innerWidth / 2, innerHeight / 2, bass_radius, 0, Math.PI * 2, 0);
        ctx.stroke();
        ctx.closePath();
      }
    }



    radius1 = Radius / 3;
    radius2 = Radius2 / 1.2;
    radius3 = Radius2 / 4;

    omega1 = Math.sin(time * controls.frequency * 2);
    omega2 = Math.sin(time * controls.frequency + Math.PI);
    omega3 = Math.sin(time * controls.frequency + Math.PI / 2);
    for (var i = 1; i < audiodata.bufferLength; i++) {
      angle = i * (angular_width) * controls.separation;
      angle2 = i * (angular_width) * controls.side_length;
      if (angle > 2 * radian && angle < Math.PI / 2 - 2 * radian || angle > Math.PI / 2 + 2 * radian && angle < Math.PI - 2 * radian || angle > Math.PI + 2 * radian && angle < Math.PI * 3 / 2 - 2 * radian || angle > Math.PI * 3 / 2 + 2 * radian && angle < Math.PI * 2 - 2 * radian) {
        draw_bars(ctx, angle + omega2, -15, radius1);
        draw_bars(ctx, angle + omega3, +18, radius2);
      }
      draw_polygon(ctx, center, controls.sides, Radius3 / 2.2 + frequency_domain_data[80] / 2, omega1);
      draw_polygon(ctx, center, controls.sides, Radius3 / 2.2 + frequency_domain_data[80] / 2, omega1 + Math.PI / 3);
    }
    if(radius1 ){

     animate21.tweakX = radius1/1000 + 5  ;
    //  animate21.tweakY = radius1/500 + 5;
     
     animate21.loop();
    }
    if(radius1 ){

      animate22.tweakX = radius1/1000 + 5;
      // animate21.direction = 'left';
      // animate22.tweakY = radius1/5+ 1;
      
      animate22.loop();
     }
    
    

  
  }

  animate();


}
