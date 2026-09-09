const $=s=>document.querySelector(s);
const pages=[...document.querySelectorAll('.page')];
const show=n=>pages.forEach((p,i)=>p.classList.toggle('active',i===n));
const birthday=$('#birthdayAudio'),kumki=$('#kumkiAudio'),video=$('#breakVideo');
birthday.loop=true;kumki.loop=true;
let introStarted=false,letterTimer=null;

function makeConfetti(){
  const box=$('#confettiLayer');
  box.innerHTML='';
  const symbols=['●','■','◆','✦','▲'];
  for(let i=0;i<90;i++){
    const el=document.createElement('i');
    el.textContent=symbols[i%symbols.length];
    el.style.setProperty('--x',`${(Math.random()-.5)*110}vw`);
    el.style.setProperty('--y',`${(Math.random()-.35)*85}vh`);
    el.style.setProperty('--r',`${(Math.random()-.5)*900}deg`);
    el.style.fontSize=`${7+Math.random()*12}px`;
    el.style.animationDelay=`${Math.random()*.18}s`;
    box.appendChild(el);
  }
  box.classList.remove('burst');
  void box.offsetWidth;
  box.classList.add('burst');
}

const startIntro=()=>{
  if(introStarted)return;
  introStarted=true;
  const countdown=$('#introCountdown'),title=$('#birthdayTitle'),prompt=$('#nextPagePrompt'),tap=$('#tapToStart');
  countdown.classList.add('fadeout');
  title.classList.remove('hidden');title.textContent='';prompt.classList.remove('show');
  if(tap)tap.classList.add('hide');
  const text='HAPPY BIRTHDAY MITHRA';let i=0;
  letterTimer=setInterval(()=>{
    title.textContent=text.slice(0,++i);
    if(i>=text.length){
      clearInterval(letterTimer);letterTimer=null;
      setTimeout(()=>{makeConfetti();setTimeout(()=>prompt.classList.add('show'),1300)},300);
    }
  },170);
  birthday.currentTime=0;birthday.volume=1;birthday.play().catch(()=>{});
};

window.addEventListener('load',()=>{
  const tap=$('#tapToStart');
  if(tap)tap.addEventListener('click',startIntro,{once:true});
});
document.addEventListener('pointerdown',startIntro,{once:true});

$('#nextPagePrompt').onclick=()=>{
  birthday.pause();birthday.currentTime=0;$('#nextPagePrompt').classList.remove('show');show(1);
  kumki.currentTime=0;kumki.volume=1;kumki.play().catch(()=>{});
};

$('#nextBtn').onclick=()=>{
  kumki.pause();kumki.currentTime=0;show(2);$('#countdown').textContent='5';$('#countdown').style.display='block';
  let n=5;const t=setInterval(()=>{n--;$('#countdown').textContent=n;if(n<=0){clearInterval(t);$('#countdown').style.display='none';document.querySelector('#page3').classList.add('page3play');video.currentTime=0;video.play().catch(()=>{});}},1000);
};

video.onended=()=>{show(3);setTimeout(()=>{$('#miss').style.display='none';$('#finalWish').style.opacity=1;setTimeout(()=>{$('#finalWish').style.opacity=0},2600)},5000)};

if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
