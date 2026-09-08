const $=s=>document.querySelector(s);
const pages=[...document.querySelectorAll('.page')];
const show=n=>pages.forEach((p,i)=>p.classList.toggle('active',i===n));
const birthday=$('#birthdayAudio'),kumki=$('#kumkiAudio'),video=$('#breakVideo');

// Start the opening sequence immediately when the site loads.
let introStarted=false;
const startIntro=()=>{
  if(introStarted)return;
  introStarted=true;
  birthday.currentTime=0;
  birthday.play().catch(()=>{});

  let n=5;
  const number=$('#countNumber');
  number.textContent=n;
  const timer=setInterval(()=>{
    n--;
    number.textContent=n;
    if(n<=0){
      clearInterval(timer);
      $('#introCountdown').classList.add('fadeout');
      setTimeout(()=>$('#birthdayTitle').classList.remove('hidden'),500);
    }
  },1000);
};

window.addEventListener('load',startIntro);

// Clicking anywhere is also a fallback for browsers that block autoplay.
document.addEventListener('click',()=>{
  if(birthday.paused) birthday.play().catch(()=>{});
  if(!introStarted) startIntro();
},{once:false});

// After the birthday MP3 finishes, automatically open the letter page.
birthday.addEventListener('ended',()=>{
  show(1);
  kumki.currentTime=0;
  kumki.volume=1;
  kumki.play().catch(()=>{});
},{once:true});

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