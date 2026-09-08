const $=s=>document.querySelector(s);
const pages=[...document.querySelectorAll('.page')];
const show=n=>pages.forEach((p,i)=>p.classList.toggle('active',i===n));
const birthday=$('#birthdayAudio'),kumki=$('#kumkiAudio'),video=$('#breakVideo');

$('#startBtn').onclick=()=>{
  birthday.currentTime=0;
  birthday.play().catch(()=>{});

  // Start Kumki from the same user click so Chrome allows playback.
  kumki.currentTime=0;
  kumki.volume=0;
  kumki.play().catch(()=>{});

  setTimeout(()=>{
    show(1);
    birthday.pause();
    kumki.volume=1;
  },1400);
};

$('#nextBtn').onclick=()=>{
  kumki.pause();
  kumki.currentTime=0;
  show(2);
  $('#countdown').textContent='5';
  $('#countdown').style.display='block';
  let n=5;
  const t=setInterval(()=>{
    n--;
    $('#countdown').textContent=n;
    if(n<=0){
      clearInterval(t);
      $('#countdown').style.display='none';
      document.querySelector('#page3').classList.add('page3play');
      video.currentTime=0;
      video.play().catch(()=>{});
    }
  },1000);
};

video.onended=()=>{
  show(3);
  setTimeout(()=>{
    $('#miss').style.display='none';
    $('#finalWish').style.opacity=1;
    setTimeout(()=>{
      $('#finalWish').style.opacity=0;
      $('#lockScene').style.opacity=1;
      document.body.classList.add('locked');
    },2600);
  },5000);
};