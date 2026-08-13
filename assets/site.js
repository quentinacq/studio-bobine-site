/* Studio Bobine — comportements communs a toutes les pages.
   Charge via <script src="/assets/site.js" defer>. */
(function(){
'use strict';

  const hd=document.getElementById('hd');
  if(hd){window.addEventListener('scroll',()=>{hd.classList.toggle('scrolled',window.scrollY>20)},{passive:true});}
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%3*70)+'ms';io.observe(el)});
  // === Formspree : remplacez VOTRE_ID_CONTACT par l'ID de votre formulaire Formspree ===
  // (créez un formulaire sur formspree.io, il vous donne une URL du type https://formspree.io/f/xxxxxxx)
  const FORMSPREE_CONTACT = "https://formspree.io/f/VOTRE_ID_CONTACT";

  async function submitForm(){
    const nom=document.getElementById('nom').value.trim();
    const email=document.getElementById('email').value.trim();
    const type=document.getElementById('type').value;
    const msg=document.getElementById('msg').value.trim();
    if(!nom||!email||!type){alert('Merci de renseigner votre nom, votre email et le type de projet.');return;}
    const btn=document.querySelector('#formArea .btn');
    const original=btn.textContent;
    btn.textContent='Envoi en cours…';
    btn.style.pointerEvents='none';
    btn.style.opacity='.7';
    try{
      const res=await fetch(FORMSPREE_CONTACT,{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:(()=>{const d=new FormData();d.append('nom',nom);d.append('email',email);d.append('type_projet',type);d.append('message',msg);d.append('_subject','Nouvelle demande de devis — '+nom);return d;})()
      });
      if(res.ok){
        document.getElementById('formArea').style.display='none';
        document.getElementById('okBox').classList.add('show');
      }else{
        throw new Error('Réponse non OK');
      }
    }catch(e){
      btn.textContent=original;
      btn.style.pointerEvents='';
      btn.style.opacity='';
      alert("Oups, l'envoi n'a pas fonctionné. Réessayez, ou écrivez-nous directement à hello.studiobobine@gmail.com.");
    }
  }

  const btnContact=document.getElementById('btnContact');
  if(btnContact)btnContact.addEventListener('click',submitForm);

  // Menu mobile
  const burger=document.getElementById('burger');
  const menu=document.getElementById('mobileMenu');
  const overlay=document.getElementById('overlay');
  function toggleMenu(open){
    burger.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',open?'true':'false');
    menu.classList.toggle('open',open);
    overlay.classList.toggle('open',open);
    document.body.style.overflow=open?'hidden':'';
  }
  if(burger&&menu&&overlay){
    burger.addEventListener('click',()=>toggleMenu(!menu.classList.contains('open')));
    overlay.addEventListener('click',()=>toggleMenu(false));
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false);});
  }

  // Accordéon FAQ
  document.querySelectorAll('.faq button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item=btn.parentElement;
      const wasOpen=item.classList.contains('open');
      document.querySelectorAll('.faq').forEach(f=>f.classList.remove('open'));
      if(!wasOpen)item.classList.add('open');
    });
  });

  // Compteurs animés
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCount(el){
    const to=parseFloat(el.dataset.to);
    const dec=parseInt(el.dataset.dec||'0');
    const suffix=el.dataset.suffix||'';
    const fmt=v=>(dec?v.toFixed(dec).replace('.',','):Math.round(v).toString())+suffix;
    if(reduce){el.textContent=fmt(to);return;}
    const dur=1400;let start=null;
    function step(ts){
      if(!start)start=ts;
      const p=Math.min((ts-start)/dur,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=fmt(to*eased);
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const countIO=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){animateCount(e.target);countIO.unobserve(e.target)}})
  },{threshold:.6});
  document.querySelectorAll('.stat .n[data-to]').forEach(el=>countIO.observe(el));

  // Parallax léger du collage hero
  const collage=document.querySelector('.collage');
  if(collage && !reduce){
    window.addEventListener('scroll',()=>{
      const y=window.scrollY;
      if(y<800){
        const p1=collage.querySelector('.p1'),p2=collage.querySelector('.p2'),p3=collage.querySelector('.p3');
        if(p1)p1.style.transform='rotate(2deg) translateY('+(y*-0.04)+'px)';
        if(p2)p2.style.transform='rotate(-3deg) translateY('+(y*0.05)+'px)';
        if(p3)p3.style.transform='rotate(-6deg) translateY('+(y*-0.03)+'px)';
      }
    },{passive:true});
  }

  // Boutons flottants (apparaissent après le hero)
  const floatEl=document.getElementById('float');
  const toTop=document.getElementById('toTop');
  if(floatEl||toTop){
    window.addEventListener('scroll',()=>{
      const on=window.scrollY>600;
      if(floatEl)floatEl.classList.toggle('show',on);
      if(toTop)toTop.classList.toggle('show',on);
    },{passive:true});
  }
  if(toTop)toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

  // Calculateur de devis
  (function(){
    const calc=document.getElementById('devis');
    if(!calc)return;
    // Groupes à choix unique
    calc.querySelectorAll('.opts[data-group]').forEach(group=>{
      group.querySelectorAll('.opt').forEach(opt=>{
        const choose=()=>{
          group.querySelectorAll('.opt').forEach(o=>o.classList.remove('active'));
          opt.classList.add('active');
          update();
        };
        opt.addEventListener('click',choose);
        opt.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();choose();}});
      });
    });
    // Options multiples
    calc.querySelectorAll('.opt-check').forEach(chk=>{
      const toggle=()=>{chk.classList.toggle('active');chk.setAttribute('aria-checked',chk.classList.contains('active'));update();};
      chk.addEventListener('click',toggle);
      chk.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();toggle();}});
    });
    function val(group){
      const el=calc.querySelector(`.opts[data-group="${group}"] .opt.active`);
      return el?parseInt(el.dataset.val):0;
    }
    function update(){
      const base=val('duree');
      const complexite=val('type')+val('rushs');
      let opts=0;
      calc.querySelectorAll('.opt-check.active').forEach(c=>opts+=parseInt(c.dataset.val));
      const total=base+complexite+opts;
      // Délai selon la durée
      const duree=val('duree');
      let delay='Livraison estimée en 72 h';
      if(duree>=329)delay='Livraison estimée en 5 à 7 jours';
      else if(duree>=189)delay='Livraison estimée en 48 h';
      document.getElementById('calcTotal').textContent=total;
      document.getElementById('calcBase').textContent=base+'€';
      document.getElementById('calcExtra').textContent='+'+complexite+'€';
      document.getElementById('calcOpts').textContent='+'+opts+'€';
      document.getElementById('calcDelay').textContent=delay;
    }
    update();
  })();
})();
