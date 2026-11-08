(() => {
  'use strict';
  const input=document.getElementById('medalSearch'),results=document.getElementById('medalResults'),count=document.getElementById('medalCount');
  const normalize=value=>String(value).normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,'');
  const guide=window.NyankoMedalGuide.create({root:results});
  fetch('catalog.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error();return response.json();}).then(data=>{
    function render(){
      const query=normalize(input.value),matches=data.entries.filter(entry=>!query||normalize([entry.id,entry.name,entry.description].join(' ')).includes(query));count.textContent=`${matches.length}개`;
      guide.render(matches);
      if(!matches.length){const empty=document.createElement('p');empty.className='empty-results';empty.textContent='검색 결과가 없습니다.';results.append(empty);}
    }
    function revealTarget(){
      const match=location.hash.match(/^#medal-(\d+)$/);
      if(!match||!data.entries.some(entry=>entry.id===Number(match[1])))return;
      if(input.value){input.value='';render();}
      const target=document.getElementById(`medal-${Number(match[1])}`);
      if(target)requestAnimationFrame(()=>{target.focus({preventScroll:true});target.scrollIntoView({block:'center'});});
    }
    input.addEventListener('input',render);render();revealTarget();window.addEventListener('hashchange',revealTarget);window.addEventListener('nyanko-search-target',revealTarget);
  }).catch(()=>{count.textContent='';const empty=document.createElement('p');empty.className='empty-results';empty.textContent='메달 목록을 불러오지 못했습니다.';results.replaceChildren(empty);});
})();
