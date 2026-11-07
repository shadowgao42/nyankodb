/* Same renderer/timeline as the former construction decoration; Luna 779 form 1. */
(() => {
  'use strict';
  const canvas = document.getElementById('loadingAnimation');
  const container = document.getElementById('accountLoading');
  if (!canvas || !container) return;
  const core = window.NyankoAnimationCore;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing=false, elapsed=0, started=0, request=0, lastFrame=-1;
  let bundle, clip, sprite, bounds;
  const visible = () => !container.hidden && !document.hidden;
  function render(now) {
    const frame=Math.floor((elapsed+(playing?Math.max(0,now-started):0))*30/1000)%(clip.lastFrame+1);
    const rect=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1;
    const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
    const resized=canvas.width!==width||canvas.height!==height;
    if(resized){canvas.width=width;canvas.height=height;}
    if(frame!==lastFrame||resized){
      const ctx=canvas.getContext('2d');ctx.clearRect(0,0,width,height);
      const scale=Math.min(width/(bounds.maxX-bounds.minX+32),height/(bounds.maxY-bounds.minY+32));
      core.draw(ctx,bundle,sprite,clip,frame,{scale,
        originX:width/2-(bounds.minX+bounds.maxX)/2*scale,
        originY:height/2-(bounds.minY+bounds.maxY)/2*scale});
      canvas.dataset.frame=String(frame);lastFrame=frame;
    }
    if(playing)request=requestAnimationFrame(render);
  }
  function sync() {
    if(!bounds)return;
    const now=performance.now();if(playing)elapsed+=now-started;
    cancelAnimationFrame(request);playing=visible()&&!motion.matches;started=now;
    canvas.dataset.animationState=playing?'playing':'paused';
    if(visible())render(now);
  }
  motion.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  new MutationObserver(sync).observe(container,{attributes:true,attributeFilter:['hidden']});
  new ResizeObserver(()=>{if(bounds){lastFrame=-1;if(visible()&&!playing)render(performance.now());}}).observe(canvas);
  async function load() {
    const response=await fetch('../img/u/779/a');if(!response.ok)throw new Error('Animation data unavailable');
    const packed=await response.json();bundle=core.parseBundle(packed[0]);clip=bundle.animations[2];
    sprite=new Image();sprite.src='../img/u/779/c0.png';await sprite.decode();
    bounds={minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity};
    for(let f=0;f<=clip.lastFrame;f++){
      const p=core.bounds(core.evaluate(bundle,clip,f),bundle.cuts);
      bounds.minX=Math.min(bounds.minX,p.minX);bounds.minY=Math.min(bounds.minY,p.minY);
      bounds.maxX=Math.max(bounds.maxX,p.maxX);bounds.maxY=Math.max(bounds.maxY,p.maxY);
    }
    sync();
  }
  load().catch(()=>{canvas.dataset.animationState='error';canvas.hidden=true;});
})();
