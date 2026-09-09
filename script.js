const $=s=>document.querySelector(s);
const pages=[...document.querySelectorAll('.page')];
const show=n=>pages.forEach((p,i)=>p.classList.toggle('active',i===n));
const birthday=$('#birthdayAudio'),kumki=$('#kumkiAudio'),video=$('#breakVideo');

birthday.loop=true;
kumki.loop=true;

let introStarted=false;
let letterTimer=null;

const startIntro=()=>{
  if(introStarted)return;
  introStarted=true;
  const countdown=$('#introCountdown');
  const title=$('#birthdayTitle');
  const prompt=$('#nextPagePrompt');
  countdown.classList.add('fadeout');
  title.classList.remove('hidden');
  title.textContent='';
  prompt.classList.remove('show');

  const text='HAPPY BIRTHDAY MITHRA';
  let i=0;
  letterTimer=setInterval(()=>{
    title.textContent=text.slice(0,++i);
    if(i>=text.length){
      clearInterval(letterTimer);
      letterTimer=null;
      setTimeout(()=>{
        $('#confetti').classList.add('burst');
        setTimeout(()=>prompt.classList.add('show'),650);
      },180);
    }
  },95);

  birthday.currentTime=0;
  birthday.volume=1;
  birthday.play().catch(()=>{});
};

// Mobile browsers require a user gesture for audio. Desktop autoplay is attempted too.
window.addEventListener('load',()=>{
  birthday.play().then(startIntro).catch(()=>{});
});

// The first tap/click starts the birthday experience and audio on mobile.
document.addEventListener('pointerdown',startIntro,{once:true});

$('#nextPagePrompt').onclick=()=>{
  birthday.pause();
  birthday.currentTime=0;
  $('#nextPagePrompt').classList.remove('show');
  show(1);
  kumki.currentTime=0;
  kumki.volume=1;
  kumki.play().catch(()=>{});
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
    },2600);
  },5000);
};

// Cache the local assets for reliable offline reopening when served from HTTPS/local server.
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
}
