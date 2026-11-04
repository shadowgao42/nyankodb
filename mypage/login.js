/* Login-only entry point; account collection/editor code is not loaded here. */
(() => {
  'use strict';
  const root=new URL('../',document.currentScript.src),$=id=>document.getElementById(id);
  const unavailable='로그인 서비스를 준비 중입니다.';
  let busy=false;
  function status(message){$('status').textContent=message;}
  async function api(path,body){
    const csrf=document.cookie.split('; ').find(value=>value.startsWith('nyanko_csrf='))?.split('=')[1]||'';
    const response=await fetch(new URL(path,root),{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000),headers:body?{'Content-Type':'application/json','X-CSRF-Token':csrf}:{},body:body?JSON.stringify(body):undefined});
    let data;try{data=await response.json();}catch(_){throw new Error(unavailable);}
    if(!response.ok)throw new Error(data.error||unavailable);return data;
  }
  $('googleLogin').disabled=true;
  $('googleNote').hidden=false;
  $('googleLogin').addEventListener('click',()=>location.assign(new URL('api/auth/google',root)));
  $('authForm').addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    const button=event.currentTarget.querySelector('button[type="submit"]');
    busy=true;button.disabled=true;status('로그인 중입니다.');
    try{await api('api/auth/login',Object.fromEntries(new FormData(event.currentTarget)));$('password').value='';location.assign(new URL('mypage/',root));}
    catch(error){status(error.name==='TimeoutError'||error instanceof TypeError?unavailable:error.message);}
    finally{busy=false;button.disabled=false;}
  });
  api('api/bootstrap').then(boot=>{$('googleLogin').disabled=!boot.googleEnabled;$('googleNote').hidden=!!boot.googleEnabled;}).catch(()=>status(unavailable));
})();
