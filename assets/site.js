/* Studio Bobine — comportements communs a toutes les pages.
   Charge via <script src="/assets/site.js" defer>. */
(function(){
'use strict';

  const hd=document.getElementById('hd');
  // Barre de progression de lecture (accueil). Elle partage l'ecouteur de
  // l'en-tete : un seul passage par evenement de defilement.
  const progress=document.getElementById('progress');
  if(hd||progress){
    const onScroll=()=>{
      const y=window.scrollY;
      if(hd)hd.classList.toggle('scrolled',y>20);
      if(progress){
        const max=document.documentElement.scrollHeight-window.innerHeight;
        progress.style.width=(max>0?Math.min(y/max,1)*100:0)+'%';
      }
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
    onScroll();
  }
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%3*70)+'ms';io.observe(el)});

  // Formulaire de devis (page Contact). Les mêmes règles sont revérifiées
  // côté serveur dans api/contact.js : ce contrôle-ci sert seulement à
  // prévenir le visiteur avant l'envoi.
  const form=document.getElementById('devis-form');
  if(form){
    const track=(n,d)=>{if(window.sbTrack)window.sbTrack(n,d);};
    const alerte=document.getElementById('devis-alerte');
    const merci=document.getElementById('devis-merci');
    const envoi=document.getElementById('devis-envoi');
    const libelleEnvoi=envoi.innerHTML;
    form.noValidate=true; // le script prend le relais des bulles du navigateur
    const t=document.getElementById('devis-t'); if(t)t.value=String(Date.now());

    const REGLES={
      prenom:v=>!v.trim()?'Indiquez votre prénom.':v.trim().length>60?'Ce prénom est trop long (60 caractères maximum).':!/^[\p{L}][\p{L}\p{M}' .-]*$/u.test(v.trim())?'Utilisez uniquement des lettres, espaces, tirets ou apostrophes.':'',
      email:v=>!v.trim()?'Indiquez votre email : c’est là qu’arrivera le devis.':!/^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i.test(v.trim())?'Cette adresse email semble incomplète. Exemple : camille@exemple.fr':'',
      telephone:v=>v.trim()&&!/^\+?\d{8,15}$/.test(v.replace(/[\s.\-()]/g,''))?'Ce numéro semble incomplet. Exemple : 06 12 34 56 78':'',
      message:v=>v.trim().length<20?'Dites-nous-en un peu plus (20 caractères minimum).':v.length>4000?'Votre message est trop long (4 000 caractères maximum).':'',
      accord:(v,el)=>!el.checked?'Cochez cette case pour que nous puissions vous répondre.':''
    };
    const erreurDe=nom=>document.getElementById(nom+'-erreur');
    function afficher(nom,msg){
      const el=form.elements[nom],p=erreurDe(nom);
      if(!el||!p)return;
      el.setAttribute('aria-invalid',msg?'true':'false');
      if(msg)p.textContent=msg;
      p.classList.toggle('visible',!!msg);
    }
    function verifier(nom){
      const el=form.elements[nom];
      const msg=REGLES[nom](el.value||'',el);
      afficher(nom,msg);
      return !msg;
    }
    // On ne signale une erreur qu'une fois le champ quitté, puis on la
    // retire dès que la saisie devient correcte.
    Object.keys(REGLES).forEach(nom=>{
      const el=form.elements[nom];
      el.addEventListener('blur',()=>{if(el.value||nom==='accord')verifier(nom);});
      el.addEventListener(nom==='accord'?'change':'input',()=>{if(el.getAttribute('aria-invalid')==='true')verifier(nom);});
    });

    let commence=false;
    form.addEventListener('focusin',()=>{if(!commence){commence=true;track('formulaire_debut');}});

    const echapper=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function montrerAlerte(html){alerte.innerHTML=html;alerte.hidden=false;}
    function lienSecours(){
      const f=form.elements;
      const corps=`Prénom : ${f.prenom.value}\nTéléphone : ${f.telephone.value}\nProjet : ${f.type_de_projet.value}\nDurée : ${f.duree_souhaitee.value}\nRushs : ${f.volume_de_rushs.value}\n\n${f.message.value}`;
      return 'mailto:hello.studiobobine@gmail.com?subject='+encodeURIComponent('Demande de devis — '+f.prenom.value)+'&body='+encodeURIComponent(corps.slice(0,1500));
    }
    function confirmer(){
      form.hidden=true;merci.hidden=false;merci.focus();
      merci.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    }
    function chargement(actif){
      envoi.disabled=actif;
      form.setAttribute('aria-busy',actif?'true':'false');
      envoi.innerHTML=actif?'<span class="devis-roue" aria-hidden="true"></span>Envoi en cours…':libelleEnvoi;
    }

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      alerte.hidden=true;
      const invalides=Object.keys(REGLES).filter(nom=>!verifier(nom));
      if(invalides.length){
        montrerAlerte(invalides.length===1?'Un champ est à corriger avant l’envoi.':invalides.length+' champs sont à corriger avant l’envoi.');
        form.elements[invalides[0]].focus();
        track('formulaire_invalide',{champs:invalides.join(',')});
        return;
      }
      const f=form.elements;
      const donnees={prenom:f.prenom.value,email:f.email.value,telephone:f.telephone.value,type_de_projet:f.type_de_projet.value,
        duree_souhaitee:f.duree_souhaitee.value,volume_de_rushs:f.volume_de_rushs.value,message:f.message.value,
        accord:f.accord.checked,site_web:f.site_web.value,t:f.t.value};
      chargement(true);
      const ctrl=new AbortController();const minuterie=setTimeout(()=>ctrl.abort(),15000);
      try{
        const r=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(donnees),signal:ctrl.signal});
        const rep=await r.json().catch(()=>({}));
        if(r.ok&&rep.ok){track('formulaire_envoye',{projet:donnees.type_de_projet});confirmer();return;}
        if(r.status===400&&rep.erreurs){
          Object.entries(rep.erreurs).forEach(([nom,msg])=>afficher(nom,msg));
          const premier=Object.keys(rep.erreurs)[0];
          if(form.elements[premier])form.elements[premier].focus();
          montrerAlerte(echapper(rep.message||'Certains champs sont à corriger.'));
          track('formulaire_invalide',{champs:Object.keys(rep.erreurs).join(','),serveur:true});
          return;
        }
        throw new Error(rep.message||'HTTP '+r.status);
      }catch(err){
        const msg=err&&err.name!=='AbortError'&&err.message&&!/^HTTP|fetch|network/i.test(err.message)?err.message:'Votre message n’a pas pu partir (connexion interrompue ou serveur indisponible).';
        montrerAlerte(echapper(msg)+' <a href="'+echapper(lienSecours())+'">Envoyer la même demande depuis ma messagerie</a>.');
        alerte.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
        track('formulaire_echec',{raison:err&&err.name==='AbortError'?'delai':'serveur'});
      }finally{clearTimeout(minuterie);chargement(false);}
    });

  }

  // Menu mobile
  const burger=document.getElementById('burger');
  const menu=document.getElementById('mobileMenu');
  const overlay=document.getElementById('overlay');
  function toggleMenu(open){
    burger.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',open?'true':'false');
    menu.classList.toggle('open',open);
    overlay.classList.toggle('open',open);
    document.body.classList.toggle('menu-open',open);
    document.body.style.overflow=open?'hidden':'';
  }
  if(burger&&menu&&overlay){
    burger.addEventListener('click',()=>toggleMenu(!menu.classList.contains('open')));
    overlay.addEventListener('click',()=>toggleMenu(false));
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false);});
    const fermer=document.getElementById('menuClose');
    if(fermer)fermer.addEventListener('click',()=>toggleMenu(false));
  }

  // Accordéon FAQ
  // aria-expanded annonce aux lecteurs d'écran si la réponse est ouverte.
  const faqBtns=document.querySelectorAll('.faq button');
  faqBtns.forEach(btn=>{
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click',()=>{
      const item=btn.parentElement;
      const wasOpen=item.classList.contains('open');
      document.querySelectorAll('.faq').forEach(f=>f.classList.remove('open'));
      faqBtns.forEach(b=>b.setAttribute('aria-expanded','false'));
      if(!wasOpen){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
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
        if(p2)p2.style.transform='rotate(-2deg) translateY('+(y*0.05)+'px)';
        if(p3)p3.style.transform='rotate(-3deg) translateY('+(y*-0.03)+'px)';
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
    const calc=document.getElementById('estimation')||document.getElementById('devis');
    if(!calc)return;
    // Groupes à choix unique
    calc.querySelectorAll('.opts[data-group]').forEach(group=>{
      group.querySelectorAll('.opt').forEach(opt=>{
        const choose=()=>{
          group.querySelectorAll('.opt').forEach(o=>{o.classList.remove('active');o.setAttribute('aria-pressed','false');});
          opt.classList.add('active');
          opt.setAttribute('aria-pressed','true');
          update();
        };
        opt.setAttribute('aria-pressed',opt.classList.contains('active')?'true':'false');
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
      // Délai : celui des formules affichées plus haut. L'option express
      // prime ; au-delà de la formule Avancé, le délai se fixe au devis.
      const duree=val('duree');
      const express=calc.querySelector('.opt-check[data-express].active');
      let delay='Délai confirmé dans votre devis';
      if(express)delay='Livraison express en moins de 72 h';
      else if(duree===189)delay='Livraison estimée entre 7 et 12 jours';
      document.getElementById('calcTotal').textContent=total;
      document.getElementById('calcBase').textContent=base+'€';
      document.getElementById('calcExtra').textContent='+'+complexite+'€';
      document.getElementById('calcOpts').textContent='+'+opts+'€';
      document.getElementById('calcDelay').textContent=delay;
    }
    update();
  })();
})();
