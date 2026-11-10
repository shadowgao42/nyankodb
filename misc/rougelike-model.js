/* Event-only practice state. It never reads or changes a player's save. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RogueGuide=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  const count=(map,id)=>Number(map?.[id]||0);
  function draw(pool,n,weight,random=Math.random){
    const remaining=pool.filter(id=>weight(id)>0),result=[];
    while(result.length<n&&remaining.length){
      const sum=remaining.reduce((s,id)=>s+weight(id),0);let value=random()*sum,index=0;
      for(;index<remaining.length-1;index++){value-=weight(remaining[index]);if(value<0)break;}
      result.push(remaining.splice(index,1)[0]);
    }
    return result;
  }
  function mapFor(data,state){return data.maps.find(m=>m.id===state.mapId)||data.maps[0];}
  function earned(data,points,map){
    const result={};
    for(const reward of data.rewards)if(reward.Type===2&&reward.Point<=points&&map.permanent.includes(reward.ID)){
      result[reward.ID]=Math.min(count(result,reward.ID)+reward.Quantity,data.buffs[reward.ID].Limit);
    }
    return result;
  }
  function ownership(data,state){
    const ids=Array.isArray(state.ownedUnits)?state.ownedUnits:state.owned===true?Object.keys(data.units).map(Number):[];
    return [...new Set(ids.filter(id=>Number.isInteger(id)&&Object.prototype.hasOwnProperty.call(data.units,id)))];
  }
  function owns(data,state,id){return Array.isArray(state.ownedUnits)?state.ownedUnits.includes(id):state.owned===true;}
  function fresh(data,{mapId=data.maps[0].id,points=0,owned=false,ownedUnits,tutorial=true,cap=data.caps[0]}={}){
    const map=mapFor(data,{mapId});
    return {schema:1,mapId:map.id,points,ownedUnits:ownership(data,{owned,ownedUnits}),tutorial,lesson:0,cap,stage:0,view:'map',team:map.initial.map(c=>({...c})),retired:[],buffs:{},permanent:earned(data,points,map),offers:[],selected:null,pending:null,completed:[],lastPoints:0};
  }
  function buffLevel(state,id){return count(state.buffs,id)+count(state.permanent,id);}
  function globalLevel(data,state,unitId){
    return Object.keys({...state.buffs,...state.permanent}).reduce((n,id)=>{
      const b=data.buffs[id];return n+(b.BuffType===0&&(b.TargetCharaID===undefined||b.TargetCharaID===unitId)?b.LevelUp*buffLevel(state,id):0);
    },0);
  }
  function memberInfo(data,state,member){
    const unit=data.units[member.id],base=member.level+globalLevel(data,state,member.id),plus=owns(data,state,member.id)?data.plus:0,total=base+plus;
    const desired=total>=60?4:total>=30?3:total>=10?2:1;
    const available=Object.keys(unit.forms).map(Number).filter(f=>f<=desired);
    const form=Math.max(member.form||1,...available),profile=unit.forms[form];
    return {...member,base,plus,total,form,name:profile.name,icon:profile.icon,rarity:unit.rarity};
  }
  function charPool(data,state){
    return mapFor(data,state).chars.filter(id=>{const uid=data.chars[id].CharaID;return !state.team.some(c=>c.id===uid)&&!state.retired.includes(uid);});
  }
  function buffPool(data,state){
    return mapFor(data,state).buffs.filter(id=>{const b=data.buffs[id];return buffLevel(state,id)<b.Limit&&(b.TargetCharaID===undefined||state.team.some(c=>c.id===b.TargetCharaID));});
  }
  function offers(data,state,type,random=Math.random){
    const pool=type==='characters'?charPool(data,state):buffPool(data,state),records=type==='characters'?data.chars:data.buffs;
    if(state.tutorial&&state.lesson<5){
      const preferred=type==='characters'?[4,5,30]:[0,1,4];
      const fixed=preferred.filter(id=>pool.includes(id));
      if(fixed.length===3)return fixed;
    }
    return draw(pool,3,id=>data.weights[records[id].Rarity]||0,random);
  }
  function pointRate(data,state){return 100+state.team.reduce((sum,c)=>sum+(owns(data,state,c.id)?data.pointBonus[data.units[c.id].rarity]:0),0);}
  function win(data,state){
    if(state.view!=='map')throw Error('현재 단계에서는 클리어할 수 없습니다.');
    const map=mapFor(data,state),base=map.stages[state.stage].points;
    const gain=Math.min(Math.floor(base*pointRate(data,state)/100),Math.max(0,state.cap-state.points));
    state.points+=gain;state.lastPoints=gain;state.lastBase=base;state.lastRate=pointRate(data,state);state.completed.push(state.stage);state.view='clear';state.lesson=Math.max(state.lesson,1);return state;
  }
  function next(data,state,random=Math.random){
    if(state.view==='clear'){
      if(state.stage===mapFor(data,state).stages.length-1){state.view='finished';state.team=[];state.buffs={};state.retired=[];return state;}
      state.view='characters';state.offers=offers(data,state,'characters',random);state.selected=null;state.lesson=Math.max(state.lesson,2);
    }else if(state.view==='characters'||state.view==='replace'){
      state.view='buffs';state.offers=offers(data,state,'buffs',random);state.selected=null;state.pending=null;state.lesson=Math.max(state.lesson,4);
    }else if(state.view==='buffs'){
      state.stage++;state.view='map';state.offers=[];state.selected=null;state.lesson=Math.max(state.lesson,5);
    }else throw Error('다음 단계로 이동할 수 없습니다.');
    return state;
  }
  function chooseCharacter(data,state,id){
    if(state.view!=='characters'||!state.offers.includes(id)||!charPool(data,state).includes(id))throw Error('선택할 수 없는 캐릭터입니다.');
    state.pending=id;state.selected=null;
    if(state.team.length>=10){state.view='replace';state.lesson=Math.max(state.lesson,3);}else{const c=data.chars[id];state.team.push({id:c.CharaID,level:c.Level,form:1});next(data,state);}
    return state;
  }
  function replace(data,state,index){
    if(state.view!=='replace'||!state.team[index]||state.pending===null)throw Error('교체할 캐릭터를 선택해 주세요.');
    const c=data.chars[state.pending];state.retired.push(state.team[index].id);state.team[index]={id:c.CharaID,level:c.Level,form:1};return next(data,state);
  }
  function chooseBuff(data,state,id){
    if(state.view!=='buffs'||!state.offers.includes(id)||!buffPool(data,state).includes(id))throw Error('선택할 수 없는 파워 업입니다.');
    state.buffs[id]=count(state.buffs,id)+1;return next(data,state);
  }
  function restart(data,state){return fresh(data,{mapId:state.mapId,points:state.points,ownedUnits:ownership(data,state),tutorial:false,cap:state.cap});}
  function defeat(data,state){state.view='defeat';state.team=[];state.buffs={};state.retired=[];state.offers=[];return state;}
  return {draw,mapFor,earned,ownership,owns,fresh,buffLevel,memberInfo,charPool,buffPool,offers,pointRate,win,next,chooseCharacter,replace,chooseBuff,restart,defeat};
});
