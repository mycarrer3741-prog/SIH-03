const $=s=>document.querySelector(s);
const pages=[...document.querySelectorAll('.page')];
const show=n=>pages.forEach((p,i)=>p.classList.toggle('active',i===n));
const birthday=$('#birthdayAudio'),kumki=$('#kumkiAudio'),video=$('#breakVideo');
birthday.loop=true;birthday.autoplay=false;birthday.muted=false;kumki.loop=true;
let introStarted=false,letterTimer=null;

function makeConfetti(){
  const box=$('#confettiLayer');
  box.innerHTML='';
  const colors=['#ff1744','#ff4081','#ffeb3b','#00e5ff','#76ff03','#ff9100','#d500f9','#ffffff'];
  const shapes=['●','■','◆','✦','▲','★'];
  for(let i=0;i<140;i++){
    const el=document.createElement('i');
    const fromLeft=i%2===0;
    el.className='confetti-piece';
    el.textContent=shapes[i%shapes.length];
    el.style.color=colors[i%colors.length];
    el.style.left=fromLeft?'0%':'100%';
    el.style.top=`${18+Math.random()*42}%`;
    el.style.setProperty('--dir',fromLeft?'1':'-1');
    el.style.setProperty('--x',`${Math.random()*42+18}vw`);
    el.style.setProperty('--y',`${-(Math.random()*42+12)}vh`);
    el.style.setProperty('--r',`${(Math.random()-.5)*1200}deg`);
    el.style.fontSize=`${10+Math.random()*18}px`;
    el.style.animationDelay=`${Math.random()*.35}s`;
    box.appendChild(el);
  }
  box.classList.remove('burst');
  void box.offsetWidth;
  box.classList.add('burst');
}

function startIntro(){
  if(introStarted)return;
  const tap=$('#tapToStart');
  birthday.currentTime=0;
  birthday.muted=false;
  birthday.volume=1;
  const playAttempt=birthday.play();
  if(!playAttempt){
    finishIntroStart(tap);
    return;
  }
  playAttempt.then(()=>finishIntroStart(tap)).catch(()=>{
    if(tap){tap.classList.remove('hide');tap.textContent='TAP HERE TO PLAY 🎵';}
  });
}

function finishIntroStart(tap){
  if(introStarted)return;
  introStarted=true;
  const countdown=$('#introCountdown');
  const title=$('#birthdayTitle');
  const prompt=$('#nextPagePrompt');
  const text='HAPPY BIRTHDAY MITHRA';
  if(letterTimer)clearTimeout(letterTimer);
  countdown.classList.add('fadeout');
  title.classList.remove('hidden');
  title.style.visibility='visible';
  title.style.opacity='1';
  title.textContent='';
  prompt.classList.remove('show');
  if(tap)tap.classList.add('hide');
  let i=0;
  const typeNext=()=>{
    i++;
    title.textContent=text.slice(0,i);
    if(i<text.length){
      letterTimer=setTimeout(typeNext,180);
    }else{
      letterTimer=null;
      setTimeout(()=>{
        makeConfetti();
        setTimeout(()=>prompt.classList.add('show'),1400);
      },350);
    }
  };
  typeNext();
}

window.addEventListener('load',()=>{
  const tap=$('#tapToStart');
  if(tap)tap.addEventListener('click',startIntro);
});

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
  const miss=$('#miss');
  const finalWish=$('#finalWish');
  finalWish.style.display='none';
  finalWish.style.opacity='0';
  miss.style.display='block';
  miss.style.opacity='1';
  setTimeout(()=>{
    miss.style.display='none';
    miss.style.opacity='0';
    finalWish.style.display='block';
    finalWish.style.opacity='1';
    finalWish.classList.add('wishShow');
  },5000);
};

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
}
