const $=s=>document.querySelector(s);
function setViewportHeight(){document.documentElement.style.setProperty('--app-vh',(window.innerHeight*0.01)+'px');}
setViewportHeight();
window.addEventListener('resize',setViewportHeight,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(setViewportHeight,150),{passive:true});
const playAudio=audio=>{audio.muted=false;audio.volume=1;const p=audio.play();return p&&typeof p.catch==='function'?p:Promise.resolve();};
const pages=[...document.querySelectorAll('.page')];
const show=n=>pages.forEach((p,i)=>p.classList.toggle('active',i===n));
const birthday=$('#birthdayAudio'),rajarani=$('#rajaraniAudio'),rajarani2=$('#rajarani2Audio'),dc=$('#dcAudio'),video=$('#breakVideo');
birthday.loop=true;birthday.autoplay=false;birthday.muted=false;rajarani.loop=true;rajarani2.loop=false;dc.loop=true;dc.volume=1;
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

function makeEndingConfetti(){
  const layer=$('#endingConfetti');
  if(!layer || layer.childElementCount)return;
  const colors=['#ffd166','#ff6b8a','#fff1c7','#b9a0ff','#ff9f43','#ffffff'];
  for(let i=0;i<90;i++){
    const piece=document.createElement('i');
    piece.className='ending-confetti-piece';
    piece.style.left=(Math.random()*100)+'%';
    piece.style.background=colors[i%colors.length];
    piece.style.setProperty('--fall',(5+Math.random()*7)+'s');
    piece.style.setProperty('--delay',(Math.random()*2.5)+'s');
    piece.style.setProperty('--drift',((Math.random()-.5)*180)+'px');
    piece.style.setProperty('--rotation',Math.round(Math.random()*180)+'deg');
    piece.style.width=(5+Math.random()*7)+'px';
    piece.style.height=(9+Math.random()*12)+'px';
    layer.appendChild(piece);
  }
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
  if(tap){
    tap.addEventListener('touchend',startIntro,{passive:true});
    tap.addEventListener('click',startIntro);
  }
});
document.addEventListener('pointerdown',startIntro,{passive:true});
document.addEventListener('touchend',startIntro,{passive:true});

$('#nextPagePrompt').onclick=()=>{
  birthday.pause();
  birthday.currentTime=0;
  $('#nextPagePrompt').classList.remove('show');
  show(1);
  rajarani.currentTime=0;
  rajarani.volume=1;
  playAudio(rajarani).catch(()=>{});
};

$('#nextBtn').onclick=()=>{
  rajarani.pause();
  rajarani.currentTime=0;
  show(2);
  dc.currentTime=0;
  playAudio(dc).catch(()=>{});
};

$('#messageNextBtn').onclick=()=>{
  dc.pause();
  dc.currentTime=0;
  show(3);
  $('#countdown').textContent='5';
  $('#countdown').style.display='block';
  let n=5;
  const t=setInterval(()=>{
    n--;
    $('#countdown').textContent=n;
    if(n<=0){
      clearInterval(t);
      $('#countdown').style.display='none';
      document.querySelector('#page4').classList.add('page3play');
      video.currentTime=0;
      video.play().catch(()=>{});
    }
  },1000);
};

const secondVideo=$('#secondVideo');
const video2Overlay=$('#video2Overlay');
const finalEnding=$('#finalEnding');
const lastMessage=$('#lastMessage');
const endingShutter=$('#endingShutter');
const musicFallback=$('#musicFallback');
let finalEndingStarted=false;
let shutterStarted=false;

function startFinalMusic(){
  if(!rajarani2)return;
  rajarani2.pause();
  rajarani2.currentTime=0;
  rajarani2.muted=false;
  rajarani2.volume=1;
  const attempt=playAudio(rajarani2);
  if(attempt&&typeof attempt.then==='function'){
    attempt.then(()=>musicFallback?.classList.remove('show'))
      .catch(()=>musicFallback?.classList.add('show'));
  }
}
function closeEndingShutter(){
  if(shutterStarted||!endingShutter)return;
  shutterStarted=true;
  musicFallback?.classList.remove('show');
  endingShutter.classList.remove('shutter-close');
  void endingShutter.offsetWidth;
  endingShutter.classList.add('shutter-close');
}
if(rajarani2){
  rajarani2.loop=false;
  rajarani2.addEventListener('ended',closeEndingShutter);
}
musicFallback?.addEventListener('click',startFinalMusic);

function playSecondVideo(){
  if(!secondVideo||!video2Overlay)return;
  video2Overlay.classList.add('video2-playing');
  video2Overlay.setAttribute('aria-hidden','false');
  secondVideo.currentTime=0;
  const attempt=secondVideo.play();
  if(attempt&&typeof attempt.catch==='function'){
    attempt.catch(()=>{
      video2Overlay.classList.remove('video2-playing');
      video2Overlay.setAttribute('aria-hidden','true');
      runFinalEnding();
    });
  }
}
function runFinalEnding(){
  if(!finalEnding||finalEndingStarted)return;
  finalEndingStarted=true;
  shutterStarted=false;
  video2Overlay?.classList.remove('video2-playing');
  video2Overlay?.setAttribute('aria-hidden','true');
  secondVideo?.pause();
  rajarani2?.pause();
  if(rajarani2)rajarani2.currentTime=0;
  endingShutter?.classList.remove('shutter-close');
  musicFallback?.classList.remove('show');
  finalEnding.classList.add('ending-show');
  finalEnding.setAttribute('aria-hidden','false');
  if(lastMessage){
    lastMessage.classList.remove('last-message-show');
    void lastMessage.offsetWidth;
    lastMessage.classList.add('last-message-show');
  }
  startFinalMusic();
}
if(secondVideo){
  secondVideo.addEventListener('ended',runFinalEnding);
  secondVideo.addEventListener('error',runFinalEnding);
}
function triggerCakeTouch(){
  const prompt=$('#touchCakePrompt');
  if(!prompt||prompt.dataset.started==='yes')return;
  prompt.dataset.started='yes';
  prompt.classList.add('prompt-touched');
  playSecondVideo();
}
const touchPrompt=$('#touchCakePrompt');
const cakeArt=$('#page5 .falling-cake');
if(touchPrompt){
  touchPrompt.addEventListener('click',triggerCakeTouch);
  touchPrompt.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();triggerCakeTouch();}});
}
if(cakeArt) cakeArt.addEventListener('click',triggerCakeTouch);

function startPostVideoSequence(){
  const page=$('#page5');
  const reveal=$('#birthdayReveal');
  const prompt=$('#touchCakePrompt');
  if(!page||!reveal||!prompt)return;
  show(4);
  page.classList.remove('red-impact','birthday-mode');
  reveal.classList.remove('reveal-show','cake-drop');
  prompt.classList.remove('prompt-show','prompt-touched');
  prompt.dataset.started='';
  finalEndingStarted=false;
  shutterStarted=false;
  if(secondVideo){secondVideo.pause();secondVideo.currentTime=0;}
  if(rajarani2){rajarani2.pause();rajarani2.currentTime=0;}
  video2Overlay?.classList.remove('video2-playing');
  video2Overlay?.setAttribute('aria-hidden','true');
  finalEnding?.classList.remove('ending-show');
  finalEnding?.setAttribute('aria-hidden','true');
  lastMessage?.classList.remove('last-message-show');
  endingShutter?.classList.remove('shutter-close');
  musicFallback?.classList.remove('show');
  void page.offsetWidth;
  page.classList.add('red-impact');
  setTimeout(()=>{
    page.classList.add('birthday-mode');
    reveal.classList.add('reveal-show');
    const title=reveal.querySelector('.birthday-reveal-title');
    if(title){
      let delay=0;
      title.querySelectorAll('.title-line').forEach(line=>{
        const value=line.textContent;
        line.textContent='';
        [...value].forEach(char=>{
          const letter=document.createElement('span');
          letter.className='letter-pop';
          letter.textContent=char;
          letter.style.animationDelay=(delay*0.075)+'s';
          line.appendChild(letter);
          delay++;
        });
      });
    }
  },450);
  setTimeout(()=>reveal.classList.add('cake-drop'),2800);
  setTimeout(()=>prompt.classList.add('prompt-show'),6100);
}
video.onended=()=>{
  video.pause();
  startPostVideoSequence();
};

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js?v=38').catch(()=>{}));
}
