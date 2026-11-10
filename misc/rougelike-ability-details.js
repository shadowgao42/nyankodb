/* Built from existing unit calculator orange-summary functions. */
(function(root){
  'use strict';
  const unitData={abilityMeta:{"1":{"key":"weaken","label":"공격력 다운","icon":"../img/i/195.png","description":"타겟이 되는 적 캐릭터의 공격력을 일정 시간 낮춥니다"},"2":{"key":"freeze","label":"움직임을 멈춘다","icon":"../img/i/197.png","description":"타겟이 되는 적 캐릭터의 움직임을 일정 시간 멈춥니다"},"3":{"key":"slow","label":"움직임을 느리게 한다","icon":"../img/i/198.png","description":"타겟이 되는 적 캐릭터의 이동 속도를 일정 시간 느리게 합니다"},"4":{"key":"attack_only","label":"공격 타겟 한정","icon":"../img/i/202.png","description":"타겟이 되는 적 캐릭터만 공격할 수 있습니다"},"5":{"key":"strong","label":"엄청 강하다","icon":"../img/i/203.png","description":"타겟이 되는 적 캐릭터에게 입히는 데미지가 오르고 받는 데미지는 줄어듭니다"},"6":{"key":"resistant","label":"맷집이 좋다","icon":"../img/i/204.png","description":"타겟이 되는 적 캐릭터에게 받는 데미지가 크게 줄어듭니다"},"7":{"key":"massive_damage","label":"초 데미지","icon":"../img/i/206.png","description":"타겟이 되는 적 캐릭터에게 입히는 데미지가 크게 오릅니다"},"8":{"key":"knockback","label":"날려버린다","icon":"../img/i/207.png","description":"일정 확률로 타겟이 되는 적 캐릭터를 멀리 날려버립니다"},"9":{"key":"warp","label":"워프","icon":"../img/i/266.png","description":"적 캐릭터를 워프시킵니다"},"10":{"key":"strengthen","label":"공격력 업","icon":"../img/i/196.png","description":"이 능력을 가진 캐릭터의 체력이 일정 수치 이하로 감소하면 공격력이 상승합니다"},"11":{"key":"survive","label":"살아남는다","icon":"../img/i/199.png","description":"캐릭터가 쓰러질 정도의 데미지를 받았을 때 일정 확률로 딱 한 번 버텨 냅니다"},"12":{"key":"base_destroyer","label":"성 파괴가 특기","icon":"../img/i/200.png","description":"적의 성 공격 시 입히는 데미지가 크게 상승합니다"},"13":{"key":"critical","label":"크리티컬","icon":"../img/i/201.png","description":"일정 확률로 평소보다 높은 데미지를 입힙니다 「메탈 적」에게도 2배의 데미지를 입힙니다"},"14":{"key":"zombie_killer","label":"좀비 킬러","icon":"../img/i/260.png","description":"이 능력을 가진 캐릭터가 좀비 속성의 적 캐릭터를 쓰러뜨리면 좀비의 부활을 막습니다"},"15":{"key":"barrier_breaker","label":"배리어 브레이커","icon":"../img/i/264.png","description":""},"16":{"key":"double_bounty","label":"격파 시 머니 UP","icon":"../img/i/205.png","description":"이 능력을 가진 캐릭터가 적 캐릭터를 쓰러뜨리면 보다 많은 머니를 얻습니다"},"17":{"key":"wave","label":"파동","icon":"../img/i/208.png","description":"공격 성공 시 범위 내에 있는 모든 적 캐릭터에게 추가 데미지를 입히는 파동을 냅니다"},"18":{"key":"weaken_resist","label":"공격력 다운 내성","icon":"../img/i/43.png","description":"적 캐릭터에게 받은 「공격력 다운」 효과를 경감시킵니다"},"19":{"key":"freeze_resist","label":"움직임을 멈춘다 내성","icon":"../img/i/45.png","description":"적 캐릭터에게 받은 「움직임을 멈춘다」 효과를 경감시킵니다"},"20":{"key":"slow_resist","label":"움직임을 느리게 한다 내성","icon":"../img/i/47.png","description":"적 캐릭터에게 받은 「움직임을 느리게 한다」 효과를 경감시킵니다"},"21":{"key":"knockback_resist","label":"날려버린다 내성","icon":"../img/i/49.png","description":"적 캐릭터에게 받은 「날려버린다」 효과를 경감시킵니다"},"22":{"key":"wave_resist","label":"파동 내성","icon":"../img/i/51.png","description":"적 캐릭터에게 받은 파동 공격 데미지를 경감시킵니다"},"23":{"key":"wave_blocker","label":"파동 스톱퍼","icon":"../img/i/218.png","description":"이 능력을 가진 캐릭터보다 뒤쪽으로 파동이 가지 않도록 파동을 없애고 데미지를 무효화합니다"},"24":{"key":"warp_resist","label":"워프 내성","icon":"../img/i/53.png","description":"적 캐릭터에게 받은 「워프」 효과를 경감시킵니다"},"29":{"key":"curse_immune","label":"고대의 저주 무효","icon":"../img/i/116.png","description":"일시적으로 아군의 「효과」를 무효화시키는 「고대의 저주」 효과를 받지 않습니다"},"30":{"key":"curse_resist","label":"저주 내성","icon":"../img/i/109.png","description":"일시적으로 아군의 「효과」를 무효화시키는 「고대의 저주」 효과를 경감시킵니다"},"44":{"key":"weaken_immune","label":"공격력 다운 무효","icon":"../img/i/213.png","description":"적 캐릭터로부터 「공격력 다운」 효과를 받지 않습니다"},"45":{"key":"freeze_immune","label":"움직임을 멈춘다 무효","icon":"../img/i/214.png","description":"적 캐릭터로부터 「움직임을 멈춘다」 효과를 받지 않습니다"},"46":{"key":"slow_immune","label":"움직임을 느리게 한다 무효","icon":"../img/i/215.png","description":"적 캐릭터로부터 「움직임을 느리게 한다」 효과를 받지 않습니다"},"47":{"key":"knockback_immune","label":"날려버린다 무효","icon":"../img/i/216.png","description":"적 캐릭터로부터 「날려버린다」 효과를 받지 않습니다"},"48":{"key":"wave_immune","label":"파동 무효","icon":"../img/i/210.png","description":"적 캐릭터의 파동 공격 데미지를 받지 않습니다"},"49":{"key":"warp_immune","label":"워프 무효","icon":"../img/i/262.png","description":"적 캐릭터로부터 「워프」 효과를 받지 않습니다"},"50":{"key":"savage_blow","label":"혼신의 일격","icon":"../img/i/229.png","description":"일정 확률로 평소보다 높은 데미지를 입힙니다"},"51":{"key":"dodge","label":"공격 무효","icon":"../img/i/231.png","description":"타겟이 되는 적 캐릭터에게 데미지를 일정 시간 받지 않습니다"},"52":{"key":"toxic_resist","label":"독 내성","icon":"../img/i/235.png","description":"적 캐릭터에게 받은 「독 공격」 효과를 경감시킵니다"},"53":{"key":"toxic_immune","label":"독 무효","icon":"../img/i/237.png","description":"적 캐릭터의 독 공격 데미지를 받지 않습니다"},"54":{"key":"surge_resist","label":"열파 내성","icon":"../img/i/241.png","description":"적 캐릭터에게 받은 열파 공격 데미지를 경감시킵니다"},"55":{"key":"surge_immune","label":"열파 무효","icon":"../img/i/243.png","description":"적 캐릭터의 열파 공격 데미지를 받지 않습니다"},"56":{"key":"surge","label":"열파","icon":"../img/i/239.png","description":"공격 성공 시 랜덤한 장소에 추가 데미지를 입히는 열파를 냅니다"},"58":{"key":"shield_piercer","label":"쉴드 브레이커","icon":"../img/i/296.png","description":"악마 쉴드를 가진 적 캐릭터를 공격하면 일정 확률로 악마 쉴드를 파괴하고 파괴 시의 공격으로 데미지를 입힙니다"},"59":{"key":"soulstrike","label":"영혼 공격","icon":"../img/i/300.png","description":"가사 상태인 좀비 속성의 적 캐릭터를 공격할 수 있습니다"},"60":{"key":"curse","label":"저주","icon":"../img/i/289.png","description":"타겟이 되는 적 캐릭터의 「효과」를 일정 시간 무효화시킵니다"},"62":{"key":"mini_wave","label":"소파동","icon":"../img/i/293.png","description":"공격 성공 시 범위 내에 있는 모든 적 캐릭터에게 추가 데미지를 입히는 작은 파동을 냅니다"},"63":{"key":"colossus_slayer","label":"초생명체 특효","icon":"../img/i/297.png","description":"초생명체에 입히는 데미지가 오르고 받는 데미지가 줄어듭니다"},"64":{"key":"behemoth_slayer","label":"초수 특효","icon":"../img/i/302.png","description":"초수에 입히는 데미지가 크게 오르고 받는 데미지가 줄어들며 가끔 공격을 회피합니다"},"65":{"key":"mini_surge","label":"소열파","icon":"../img/i/310.png","description":"공격 성공 시 랜덤한 장소에 추가 데미지를 입히는 작은 열파를 냅니다"},"66":{"key":"sage_slayer","label":"초현자 특효","icon":"../img/i/319.png","description":"초현자에 입히는 데미지가 조금 오르고 받는 데미지가 줄며 방해 효과를 경감시킵니다 게다가 초현자가 가진 방해 내성을 무효화합니다"},"67":{"key":"explosion","label":"폭파","icon":"../img/i/335.png","description":"공격 성공 시 좌우로 퍼지면서 추가 데미지를 입히는 폭파를 일으킵니다"},"68":{"key":"counter_surge","label":"열파 카운터","icon":"../img/i/315.png","description":"적 캐릭터의 열파 공격으로 데미지를 받으면 적 캐릭터에게 열파 공격을 되돌려줍니다"},"69":{"key":"explosion_immune","label":"폭파 무효","icon":"../img/i/337.png","description":"적 캐릭터의 폭파 공격 데미지를 받지 않습니다"},"72":{"key":"production_speed","label":"생산 시간 단축","description":"생산 시간을 단축시키는 능력이 2번 생산할 때마다 부여됩니다 (중복 불가)","icon":"../img/i/396.png"}}};
  const profiles={"0":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"1":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"2":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"3":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"4":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"5":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"6":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"7":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"8":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0}},"24":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0}},"25":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"30":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":40,"slowFrames":120},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":40,"slowFrames":120},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":40,"slowFrames":120}},"31":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"relic","label_ko":"고대종"}],"slowChance":0,"slowFrames":0}},"32":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":40,"slowFrames":120},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":40,"slowFrames":120},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":60,"slowFrames":120}},"33":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"35":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":100,"slowFrames":60}},"36":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"37":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"38":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"39":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"40":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"41":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"42":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"43":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"44":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"47":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"48":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"50":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":20,"slowFrames":120},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":20,"slowFrames":120},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":20,"slowFrames":120}},"51":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"52":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"55":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":20,"slowFrames":120},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":20,"slowFrames":120},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":20,"slowFrames":150}},"56":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"57":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"58":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"59":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"61":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"71":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"72":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"73":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"75":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"76":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"83":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"84":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":50,"slowFrames":150},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":50,"slowFrames":150},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":50,"slowFrames":150}},"85":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":50,"slowFrames":150},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":50,"slowFrames":150},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":50,"slowFrames":150}},"86":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":50,"slowFrames":150},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":50,"slowFrames":150},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":50,"slowFrames":150}},"87":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"91":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"92":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"93":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"97":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"105":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"106":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"107":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"124":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"125":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"134":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"135":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"136":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"137":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"138":{"1":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"}],"slowChance":20,"slowFrames":70},"2":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":110},"3":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"}],"slowChance":100,"slowFrames":110},"4":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"}],"slowChance":20,"slowFrames":70}},"143":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":50,"slowFrames":120},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":50,"slowFrames":120},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":50,"slowFrames":120}},"145":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":30,"slowFrames":60},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":30,"slowFrames":60},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":30,"slowFrames":120}},"146":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"147":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"148":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"149":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"150":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"151":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"152":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"relic","label_ko":"고대종"}],"slowChance":0,"slowFrames":0}},"153":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":30,"slowFrames":90},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":30,"slowFrames":90},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":30,"slowFrames":150}},"158":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"159":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"177":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":120},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":120},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":100,"slowFrames":120},"4":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":120}},"194":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"195":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":150}},"196":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"relic","label_ko":"고대종"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"relic","label_ko":"고대종"}],"slowChance":0,"slowFrames":0}},"197":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":50,"slowFrames":120},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":50,"slowFrames":120},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":50,"slowFrames":120}},"198":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0}},"199":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"203":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"212":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":140},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":140}},"226":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"257":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"258":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"259":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"260":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"261":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":50,"slowFrames":100},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":50,"slowFrames":100}},"271":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"272":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"284":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"287":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"303":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"307":{"1":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":50,"slowFrames":120},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":50,"slowFrames":120},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":50,"slowFrames":150}},"308":{"1":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"316":{"1":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"322":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"324":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"325":{"1":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"334":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":150},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":150},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":180}},"335":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"336":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"338":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"351":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"357":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"358":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"376":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"377":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"396":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"427":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"relic","label_ko":"고대종"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"relic","label_ko":"고대종"}],"slowChance":0,"slowFrames":0}},"431":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"4":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"439":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"444":{"1":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"445":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"447":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"495":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"496":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":100,"slowFrames":75},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":100,"slowFrames":75},"3":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":100,"slowFrames":75},"4":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":100,"slowFrames":75}},"502":{"1":{"traits":[{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0}},"505":{"1":{"traits":[{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":50,"slowFrames":150},"2":{"traits":[{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":50,"slowFrames":150},"3":{"traits":[{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":100,"slowFrames":150}},"519":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"522":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"523":{"1":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"525":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":30,"slowFrames":75},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":150},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":50,"slowFrames":150}},"533":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"relic","label_ko":"고대종"}],"slowChance":0,"slowFrames":0}},"534":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"543":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0}},"607":{"1":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"617":{"1":{"traits":[{"key":"aku","label_ko":"악마"}],"slowChance":100,"slowFrames":120},"2":{"traits":[{"key":"aku","label_ko":"악마"}],"slowChance":100,"slowFrames":180},"3":{"traits":[{"key":"aku","label_ko":"악마"}],"slowChance":100,"slowFrames":180}},"618":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"619":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"620":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"633":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"634":{"1":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"642":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"647":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":60},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":120},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":120}},"649":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"658":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"659":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"660":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":100,"slowFrames":90},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":100,"slowFrames":120},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"angel","label_ko":"천사"}],"slowChance":100,"slowFrames":120}},"663":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"664":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"668":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"675":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"676":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"682":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"},{"key":"black","label_ko":"검은 적"},{"key":"metal","label_ko":"메탈 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"},{"key":"relic","label_ko":"고대종"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"684":{"1":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"692":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0}},"697":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"698":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"},{"key":"aku","label_ko":"악마"}],"slowChance":0,"slowFrames":0}},"706":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"723":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[],"slowChance":0,"slowFrames":0},"3":{"traits":[],"slowChance":0,"slowFrames":0}},"725":{"1":{"traits":[{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"aku","label_ko":"악마"},{"key":"traitless","label_ko":"속성이 없는 적"}],"slowChance":0,"slowFrames":0}},"733":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"floating","label_ko":"떠있는 적"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"754":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"3":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"760":{"1":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":50,"slowFrames":240},"2":{"traits":[{"key":"black","label_ko":"검은 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":100,"slowFrames":240}},"763":{"1":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"}],"slowChance":0,"slowFrames":0}},"769":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"774":{"1":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":30,"slowFrames":120},"2":{"traits":[{"key":"metal","label_ko":"메탈 적"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"811":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"824":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"}],"slowChance":50,"slowFrames":100},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"floating","label_ko":"떠있는 적"}],"slowChance":50,"slowFrames":150}},"830":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":100,"slowFrames":150},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":100,"slowFrames":150}},"850":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":100,"slowFrames":50},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"},{"key":"angel","label_ko":"천사"}],"slowChance":100,"slowFrames":50}},"861":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"aku","label_ko":"악마"}],"slowChance":100,"slowFrames":60},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"aku","label_ko":"악마"}],"slowChance":100,"slowFrames":60}},"869":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"},{"key":"black","label_ko":"검은 적"}],"slowChance":0,"slowFrames":0}},"877":{"1":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"alien","label_ko":"에이리언"}],"slowChance":0,"slowFrames":0}},"882":{"1":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"red","label_ko":"빨간 적"}],"slowChance":0,"slowFrames":0}},"883":{"1":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"floating","label_ko":"떠있는 적"}],"slowChance":0,"slowFrames":0}},"884":{"1":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}},"885":{"1":{"traits":[],"slowChance":0,"slowFrames":0},"2":{"traits":[{"key":"angel","label_ko":"천사"},{"key":"zombie","label_ko":"좀비"}],"slowChance":0,"slowFrames":0}}};
  const currentData={fps:30},currentTimeUnit='seconds',currentRangeUnit='rng';
  const rangeUnitFactors={rng:1,spu:2,u:4},formatter=new Intl.NumberFormat('ko-KR');
  const fruitTreasureKeyByTrait={black:'black_fruit',red:'red_fruit',floating:'floating_fruit',angel:'angel_fruit',metal:'metal_fruit',zombie:'zombie_fruit',alien:'alien_fruit'};
  const comboValue=()=>0,orbAttackAddition=()=>0,orbReceivedDamageFactor=()=>1,treasurePercent=()=>300;
  const warpParts={"27":{"1":[{"type":"text","value":"확률 50%"},{"type":"time","frames":30},{"type":"text","value":"이동 거리 300~500"}]}};
    function formatOrbNumber(value) {
      return String(Number(Number(value).toFixed(3)));
    }

    function describeOrb(record) {
      const firstValue = Number(record.values[0]) || 0;
      const secondValue = Number(record.values[1]) || 0;
      switch (record.contentId) {
        case 0:
          return `기본 공격력 +${formatOrbNumber(firstValue / 100)}×`;
        case 1:
          return `받는 피해 ${formatOrbNumber(firstValue)}% 경감`;
        case 2:
          return (
            `주는 피해 +${formatOrbNumber(firstValue / 1000)}×`
            + ` · 받는 피해 ${formatOrbNumber(secondValue)}% 추가 경감`
          );
        case 3:
          return `주는 피해 +${formatOrbNumber(firstValue / 300)}×`;
        case 4:
          return `받는 피해 ${formatOrbNumber(firstValue)}% 추가 경감`;
        case 5:
          return (
            "2회마다 사망 시 소열파"
            + ` · 확률 ${formatOrbNumber(firstValue)}%`
            + " · Lv.1 · 생성 200~500 · 주는 피해 20%"
          );
        case 6:
          return `파동 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        case 7:
          return (
            "2회마다 사망 시 "
            + `생산 코스트 ${formatOrbNumber(firstValue)}% 환급`
          );
        case 8:
          return `날려버린다 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 9:
          return (
            "레전드 스토리에서 "
            + `체력 +${formatOrbNumber(firstValue)}%`
            + ` · 공격력 +${formatOrbNumber(secondValue)}%`
          );
        case 10:
          return (
            "2회마다 초생명체에게 "
            + `주는 피해 ${formatOrbNumber(firstValue / 100)}×`
            + ` · 받는 피해 ${formatOrbNumber(secondValue / 100)}×`
          );
        case 11:
          return (
            "2회마다 사망 시 "
            + `냥코 대포 ${formatOrbNumber(firstValue)}% 충전`
          );
        case 12:
          return `독 공격 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        case 13:
          return (
            "2회마다 전 공격 무효 "
            + `(확률 ${formatOrbNumber(firstValue)}% · `
            + `${formatOrbNumber(secondValue / 30)}초)`
          );
        case 14:
          return `느리게 한다 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 15:
          return `고대의 저주 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 16:
          return (
            "신 레전드 스토리에서 "
            + `체력 +${formatOrbNumber(firstValue)}%`
            + ` · 공격력 +${formatOrbNumber(secondValue)}%`
          );
        case 17:
          return (
            "2회마다 1회 열파 카운터"
            + ` · 주는 피해 ${formatOrbNumber(firstValue)}%`
          );
        case 18:
          return (
            "10마리 격파 시 "
            + `공격력 +${formatOrbNumber(firstValue)}%`
          );
        case 19:
          return `2회마다 생산 시간 ${formatOrbNumber(firstValue)}% 단축`;
        case 20:
          return `멈춘다 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 21:
          return `공격력 다운 효과 ${formatOrbNumber(firstValue)}% 경감`;
        case 22:
          return `2회마다 생산 코스트 ${formatOrbNumber(firstValue)}% 할인`;
        case 23:
          return `열파 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        case 24:
          return `2회마다 첫 격파 시 머니 +${formatOrbNumber(firstValue)}%`;
        case 25:
          return `폭파 데미지 ${formatOrbNumber(firstValue)}% 경감`;
        default:
          return "";
      }
    }

    function textPart(value) {
      return { type: "text", value: String(value) };
    }

    function timePart(frames) {
      return { type: "time", frames: Math.max(0, Math.trunc(frames)) };
    }

    function timeGroupPart(prefix, frames, suffix = "") {
      return {
        type: "time_group",
        prefix,
        frames: Math.max(0, Math.trunc(frames)),
        suffix,
      };
    }

    function timeRangePart(minimumFrames, maximumFrames) {
      return {
        type: "time_range",
        minimumFrames: Math.max(0, Math.trunc(minimumFrames)),
        maximumFrames: Math.max(0, Math.trunc(maximumFrames)),
      };
    }

    function generationRangePart(anchorRaw, spanRaw) {
      const start = Number(anchorRaw) / 4;
      const end = (Number(anchorRaw) + Number(spanRaw)) / 4;
      const range = {
        type: "generation_range",
        minimum: Math.min(start, end),
        maximum: Math.max(start, end),
      };
      return { ...range, value: `생성 ${formatRangeSpan(range)}` };
    }

    function roundDistanceValue(value) {
      return Math.round((Number(value) || 0) * 1000) / 1000;
    }

    function rangeRawToDisplay(value, unit = currentRangeUnit) {
      return Number(value) * (rangeUnitFactors[unit] || 1);
    }

    function formatDistanceNumber(value) {
      return formatter.format(roundDistanceValue(value));
    }

    function formatRangeSpan(range, includeUnit = false) {
      const minimum = Number(range?.minimum);
      const maximum = Number(range?.maximum);
      if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) {
        return String(range?.text || "—");
      }
      const minimumText = formatDistanceNumber(rangeRawToDisplay(minimum));
      const maximumText = formatDistanceNumber(rangeRawToDisplay(maximum));
      const span = Math.abs(minimum - maximum) < 1e-9
        ? minimumText
        : `${minimumText}~${maximumText}`;
      return includeUnit ? `${span} ${currentRangeUnit}` : span;
    }

    function formatEffectMultiplier(value) {
      return String(Number(value.toFixed(3)));
    }

    function effectMultiplierRange(values, descending = false) {
      const minimum = Math.min(...values);
      const maximum = Math.max(...values);
      const minimumText = formatEffectMultiplier(minimum);
      const maximumText = formatEffectMultiplier(maximum);
      if (minimum === maximum) return `${minimumText}×`;
      return descending
        ? `${maximumText}~${minimumText}×`
        : `${minimumText}~${maximumText}×`;
    }

    function reciprocalMultiplierRange(values) {
      const denominators = values.map((value) => 1 / value);
      const minimum = Math.min(...denominators);
      const maximum = Math.max(...denominators);
      const minimumText = String(Number(minimum.toFixed(2)));
      const maximumText = String(Number(maximum.toFixed(2)));
      return minimum === maximum
        ? `1/${minimumText}×`
        : `1/${minimumText}×~1/${maximumText}×`;
    }

    function fruitProfilesForTraits(traits) {
      if (!traits.length) {
        return [{ key: "", labels: [], percent: 0 }];
      }
      return traits.map((trait) => {
        const treasureKey = fruitTreasureKeyByTrait[trait.key];
        return {
          key: trait.key,
          labels: [trait.label_ko],
          percent: treasureKey ? treasurePercent(treasureKey) : 0,
        };
      });
    }

    function fruitLinearValue(percent, minimum, maximum) {
      const progress = Math.min(300, Math.max(0, percent)) / 300;
      return minimum + (maximum - minimum) * progress;
    }

    function fruitValueProfiles(traits, resolveValue) {
      return fruitProfilesForTraits(traits).map((profile) => ({
        label: profile.labels.join("·"),
        value: resolveValue(profile.percent, profile.key),
      }));
    }

    function fruitDurationData(baseFrames, traits, detailTraits = traits) {
      const profiles = fruitValueProfiles(
        traits,
        (percent) => Math.floor(
          baseFrames * (1500 + percent) / 1500
        ),
      );
      const values = profiles.map((profile) => profile.value);
      const minimum = Math.min(...values);
      const maximum = Math.max(...values);
      return {
        summaryParts: [
          minimum === maximum
            ? timePart(minimum)
            : timeRangePart(minimum, maximum),
        ],
        details: fruitValueProfiles(
          detailTraits,
          (percent) => Math.floor(
            baseFrames * (1500 + percent) / 1500
          ),
        )
          .filter((profile) => profile.label)
          .map((profile) => ({
            label: profile.label,
            parts: [timePart(profile.value)],
          })),
      };
    }

    function fruitMultiplierData(
      traits,
      detailTraits,
      resolveValue,
      formatParts,
    ) {
      const profiles = fruitValueProfiles(traits, resolveValue);
      return {
        summaryParts: formatParts(profiles.map((profile) => profile.value)),
        details: fruitValueProfiles(detailTraits, resolveValue)
          .filter((profile) => profile.label)
          .map((profile) => ({
            label: profile.label,
            parts: formatParts([profile.value]),
          })),
      };
    }

    function comboDurationData(baseFrames, traits, detailTraits, effectId) {
      if (!comboValue(effectId)) return fruitDurationData(baseFrames, traits, detailTraits);
      const resolve = percent => Nyancombo.duration(baseFrames, percent, comboValue(effectId));
      const values = fruitValueProfiles(traits, resolve).map(profile => profile.value);
      const minimum = Math.min(...values), maximum = Math.max(...values);
      return {
        summaryParts: [minimum === maximum ? timePart(minimum) : timeRangePart(minimum, maximum)],
        details: fruitValueProfiles(detailTraits, resolve).filter(profile => profile.label)
          .map(profile => ({label:profile.label, parts:[timePart(profile.value)]})),
      };
    }

    function applyFruitEffectsToAbility(ability, raw, traits, activeOrbs, sageResistanceApplies = false) {
      let summaryParts = ability.summary_parts;
      let fruitDetails = [];
      const summaryTraits = traits;
      const applyDuration = (chance, baseFrames, trailingParts = []) => {
        const duration = comboDurationData(baseFrames, summaryTraits, traits, {slow:18, freeze:19, weaken:20}[ability.key]);
        summaryParts = [
          textPart(`확률 ${chance}%`),
          ...duration.summaryParts,
          ...trailingParts,
        ];
        fruitDetails = duration.details;
      };
      switch (ability.key) {
        case "weaken":
          applyDuration(
            raw[37],
            raw[38],
            [textPart(`공격력을 ${raw[39]}%로 감소`)],
          );
          break;
        case "freeze":
          applyDuration(raw[25], raw[26]);
          break;
        case "slow":
          applyDuration(raw[27], raw[28]);
          break;
        case "curse":
          applyDuration(raw[92], raw[93]);
          break;
        case "dodge":
          applyDuration(raw[84], raw[85]);
          break;
        case "strong": {
          const multipliers = fruitMultiplierData(
            summaryTraits,
            traits,
            (percent, traitKey) => [
              (fruitLinearValue(percent, 1.5, 1.8)
                + orbAttackAddition(activeOrbs, 2, traitKey, 1000)) * (100 + comboValue(14)) / 100,
              fruitLinearValue(percent, 0.5, 0.4) * (100 - comboValue(14)) / 100
                * orbReceivedDamageFactor(activeOrbs, 2, traitKey, 1),
            ],
            (values) => [
              textPart(
                `주는 피해 ${effectMultiplierRange(
                  values.map(([dealt]) => dealt)
                )}`
              ),
              textPart(
                `받는 피해 ${effectMultiplierRange(
                  values.map(([, received]) => received),
                  true,
                )}`
              ),
            ],
          );
          summaryParts = multipliers.summaryParts;
          fruitDetails = multipliers.details;
          break;
        }
        case "resistant": {
          const multipliers = fruitMultiplierData(
            summaryTraits,
            traits,
            (percent, traitKey) => (
              fruitLinearValue(percent, 1 / 4, 1 / 5) * (100 - comboValue(16)) / 100
              * orbReceivedDamageFactor(activeOrbs, 4, traitKey)
            ),
            (values) => [textPart(
              `받는 피해 ${reciprocalMultiplierRange(values)}`
            )],
          );
          summaryParts = multipliers.summaryParts;
          fruitDetails = multipliers.details;
          break;
        }
        case "insanely_tough": {
          const multipliers = fruitMultiplierData(
            summaryTraits,
            traits,
            (percent) => fruitLinearValue(percent, 1 / 6, 1 / 7),
            (values) => [textPart(
              `받는 피해 ${reciprocalMultiplierRange(values)}`
            )],
          );
          summaryParts = multipliers.summaryParts;
          fruitDetails = multipliers.details;
          break;
        }
        case "massive_damage": {
          const multipliers = fruitMultiplierData(
            summaryTraits,
            traits,
            (percent, traitKey) => (
              (fruitLinearValue(percent, 3, 4)
              + orbAttackAddition(activeOrbs, 3, traitKey, 300)) * (100 + comboValue(15)) / 100
            ),
            (values) => [textPart(
              `주는 피해 ${effectMultiplierRange(values)}`
            )],
          );
          summaryParts = multipliers.summaryParts;
          fruitDetails = multipliers.details;
          break;
        }
        case "insane_damage": {
          const multipliers = fruitMultiplierData(
            summaryTraits,
            traits,
            (percent) => fruitLinearValue(percent, 5, 6),
            (values) => [textPart(
              `주는 피해 ${effectMultiplierRange(values)}`
            )],
          );
          summaryParts = multipliers.summaryParts;
          fruitDetails = multipliers.details;
          break;
        }
      }
      if (["witch_killer", "eva_killer"].includes(ability.key)) {
        const effectId = ability.key === "witch_killer" ? 22 : 23;
        if (comboValue(effectId)) {
          const dealt = 5 * (100 + comboValue(effectId)) / 100;
          const received = (ability.key === "witch_killer" ? 0.1 : 0.2)
            * (5 - Math.trunc(comboValue(effectId) / 100)) / 5;
          summaryParts = [textPart(`주는 피해 ${formatEffectMultiplier(dealt)}×`), textPart(`받는 피해 ${formatEffectMultiplier(received)}×`)];
        }
      }
      if (sageResistanceApplies && ["weaken", "freeze", "slow", "curse", "warp"].includes(ability.key)) {
        const reduceSageFrames = (parts) => parts.map((part) => {
          if (part?.type === "time") {
            return { ...part, frames: Math.floor(Number(part.frames) * 0.3 + 1e-9) };
          }
          // Targeted effects with treasure variation are represented as
          // a time_range.  Sage resistance applies after that variation,
          // so both endpoints must be truncated independently.
          if (part?.type === "time_range") {
            return {
              ...part,
              minimumFrames: Math.floor(Number(part.minimumFrames) * 0.3 + 1e-9),
              maximumFrames: Math.floor(Number(part.maximumFrames) * 0.3 + 1e-9),
            };
          }
          return part;
        });
        summaryParts = reduceSageFrames(summaryParts);
        fruitDetails = fruitDetails.map((entry) => ({ ...entry, parts: reduceSageFrames(entry.parts || []) }));
        ability = { ...ability, tooltip_parts: reduceSageFrames(ability.tooltip_parts || ability.detail_parts || []) };
      }
      return {
        ...ability,
        summary_parts: summaryParts,
        fruit_details: fruitDetails,
      };
    }

    function buildTalentAbility(talent, raw, values, provenance) {
      const abilityId = talent.abilityId;
      const meta = unitData.abilityMeta[String(abilityId)];
      if (!meta) return null;
      let category = "본능";
      if ([18, 19, 20, 21, 22, 24, 30, 52, 54].includes(abilityId)) {
        category = "내성";
      } else if ([29, 44, 45, 46, 47, 48, 49, 53, 55, 69].includes(abilityId)) {
        category = "무효";
      }
      const summaryParts = [];
      const numericData = {};

      switch (abilityId) {
        case 72:
          summaryParts.push(textPart(describeOrb({ contentId: 19, values: [Number(raw[118]) || values[0]] })));
          break;
        case 1:
          summaryParts.push(
            textPart(`확률 ${raw[37]}%`),
            timePart(raw[38]),
            textPart(`공격력을 ${raw[39]}%로 감소`),
          );
          break;
        case 2:
          summaryParts.push(textPart(`확률 ${raw[25]}%`), timePart(raw[26]));
          break;
        case 3:
          summaryParts.push(textPart(`확률 ${raw[27]}%`), timePart(raw[28]));
          break;
        case 5:
          summaryParts.push(
            textPart("주는 피해 1.5~1.8×"),
            textPart("받는 피해 0.5~0.4×"),
          );
          break;
        case 6:
          summaryParts.push(textPart("받는 피해 1/4~1/5"));
          break;
        case 7:
          summaryParts.push(textPart("주는 피해 3~4×"));
          break;
        case 8:
          summaryParts.push(textPart(`확률 ${raw[24]}%`));
          break;
        case 9:
          summaryParts.push(textPart(`확률 ${raw[71]}%`), timePart(raw[72]));
          break;
        case 10:
          numericData.threshold_percent = raw[40];
          numericData.boost_percent = raw[41];
          summaryParts.push(
            textPart(`체력 ${raw[40]}% 이하`),
            textPart(`공격력 +${raw[41]}% (${(100 + Number(raw[41])) / 100}×)`),
          );
          break;
        case 11:
          summaryParts.push(textPart(`확률 ${raw[42]}%`));
          break;
        case 12:
          summaryParts.push(textPart("적 성에 주는 피해 4×"));
          break;
        case 13:
          numericData.chance = raw[31];
          summaryParts.push(
            textPart(`확률 ${raw[31]}%`),
            textPart("주는 피해 2×"),
            textPart("메탈 능력 무시"),
          );
          break;
        case 15:
          summaryParts.push(textPart(`확률 ${raw[70]}%`));
          break;
        case 16:
          summaryParts.push(textPart("적 처치 시 획득 머니 2×"));
          break;
        case 17:
        case 62:
          numericData.chance = raw[35];
          numericData.level = raw[36];
          summaryParts.push(textPart(`확률 ${raw[35]}%`), textPart(`Lv.${raw[36]}`));
          if (abilityId === 62) summaryParts.push(textPart("직접 타격의 20% 피해"));
          break;
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 24:
        case 30:
        case 52:
        case 54:
          summaryParts.push(textPart(`내성 ${values[0]}%`));
          break;
        case 50:
          numericData.chance = raw[82];
          numericData.boost_percent = raw[83];
          summaryParts.push(
            textPart(`확률 ${raw[82]}%`),
            textPart(
              `주는 피해 ${formatEffectMultiplier(1 + raw[83] / 100)}×`
            ),
          );
          break;
        case 51:
          summaryParts.push(textPart(`확률 ${raw[84]}%`), timePart(raw[85]));
          break;
        case 56:
        case 65:
          numericData.chance = raw[86];
          numericData.level = raw[89];
          numericData.anchor = raw[87] / 4;
          numericData.span = raw[88] / 4;
          summaryParts.push(
            textPart(`확률 ${raw[86]}%`),
            textPart(`Lv.${raw[89]}`),
            generationRangePart(raw[87], raw[88]),
          );
          if (abilityId === 65) summaryParts.push(textPart("직접 타격의 20% 피해"));
          break;
        case 58:
          summaryParts.push(textPart(`확률 ${raw[95]}%`));
          break;
        case 60:
          summaryParts.push(textPart(`확률 ${raw[92]}%`), timePart(raw[93]));
          break;
        case 63:
          summaryParts.push(
            textPart("주는 피해 1.6×"),
            textPart("받는 피해 0.7×"),
          );
          break;
        case 64:
          summaryParts.push(
            textPart("주는 피해 2.5×"),
            textPart("받는 피해 0.6×"),
          );
          if (raw[106]) {
            summaryParts.push(
              timeGroupPart(
                `초수 공격 무효(확률 ${raw[106]}% · `,
                raw[107],
                ")",
              )
            );
          }
          break;
        case 66:
          summaryParts.push(
            textPart("주는 피해 1.2×"),
            textPart("받는 피해 0.5×"),
            textPart("방해 효과 70% 경감"),
          );
          break;
        case 67:
          numericData.chance = raw[113];
          numericData.anchor = raw[114] / 4;
          numericData.span = raw[115] / 4;
          summaryParts.push(
            textPart(`확률 ${raw[113]}%`),
            generationRangePart(raw[114], raw[115]),
            textPart("피해대 100/70/40%"),
          );
          break;
      }

      const tooltipText =
        meta.description || talent.description || `${meta.label} 효과`;
      return {
        key: meta.key,
        label_ko: meta.label,
        label_en: meta.key,
        category,
        icon: meta.icon,
        summary_parts: summaryParts,
        detail_parts: summaryParts,
        tooltip_parts: [textPart(tooltipText)],
        resistancePercent: category === "내성" ? values[0] : null,
        provenance,
        ...numericData,
      };
    }

    function setTimeData(element, frames, isAvailable = true) {
      if (!isAvailable) {
        element.dataset.seconds = "—";
        element.dataset.frames = "—";
        element.textContent = "—";
        element.title = "공격 애니메이션 데이터가 없어 계산할 수 없습니다.";
        return;
      }
      element.dataset.seconds = `${(frames / currentData.fps).toFixed(2)}초`;
      element.dataset.frames = `${frames}f`;
      element.textContent = element.dataset[currentTimeUnit];
      element.title = "";
    }

    function setTimeRangeData(element, minimumFrames, maximumFrames) {
      const minimumSeconds = Number(
        (minimumFrames / currentData.fps).toFixed(2)
      );
      const maximumSeconds = Number(
        (maximumFrames / currentData.fps).toFixed(2)
      );
      element.dataset.seconds = `${minimumSeconds}~${maximumSeconds}초`;
      element.dataset.frames = `${minimumFrames}~${maximumFrames}f`;
      element.title = "";
    }

    function appendAbilityParts(container, parts, separated = false) {
      parts.forEach((part, index) => {
        if (separated && index > 0) container.append(" · ");
        if (part.type === "generation_range") {
          const range = document.createElement("span");
          range.className = "ability-generation-range";
          range.dataset.minimum = String(part.minimum);
          range.dataset.maximum = String(part.maximum);
          range.textContent = `생성 ${formatRangeSpan(part)}`;
          container.append(range);
          return;
        }
        if (part.type === "time_range") {
          const duration = document.createElement("span");
          duration.className = "time-value";
          setTimeRangeData(
            duration,
            part.minimumFrames,
            part.maximumFrames,
          );
          duration.textContent = duration.dataset[currentTimeUnit];
          container.append(duration);
          return;
        }
        if (
          part.type === "time"
          || part.type === "time_group"
        ) {
          if (part.type === "time_group" && part.prefix) {
            container.append(part.prefix);
          }
          const duration = document.createElement("span");
          duration.className = "time-value";
          setTimeData(duration, part.frames);
          duration.textContent = duration.dataset[currentTimeUnit];
          container.append(duration);
          if (part.type === "time_group" && part.suffix) {
            container.append(part.suffix);
          }
        } else {
          container.append(part.value);
        }
      });
    }

  const targetKeys={33:'red',34:'floating',35:'black',36:'metal',37:'angel',38:'alien',39:'zombie',40:'relic',41:'traitless',57:'aku'};
  function details(data,id,level=1,state=null){
    const buff=data.buffs[id],skill=data.skills[buff?.BuffSkillID];
    if(!skill||(skill.AbilityID>=1000&&![1008,1010,1011].includes(skill.AbilityID))||[27,31,32,61].includes(skill.AbilityID))return null;
    const abilityId=skill.AbilityID;
    if(targetKeys[abilityId])return {text:'',parts:[],abilityId};
    const extraKey={1010:'insane_damage',1011:'insanely_tough'}[abilityId];
    if(abilityId!==1008&&!extraKey&&!unitData.abilityMeta[String(abilityId)])return null;
    const parameters=skill.Parameters||[],values=[];
    const progress=(Math.min(Math.max(1,level),skill.MaxLevel)-1)/Math.max(1,skill.MaxLevel-1);
    for(let i=0;i<parameters.length;i+=2)values.push(Math.trunc(parameters[i]+(parameters[i+1]-parameters[i])*progress));
    if(abilityId===1008){const text=describeOrb({contentId:18,values});return {text,parts:[textPart(text)],abilityId};}
    const member=state?.team.find(c=>c.id===buff.TargetCharaID);
    const form=member?root.RogueGuide.memberInfo(data,state,member).form:2;
    const unitProfiles=profiles[buff.TargetCharaID]||{},profile=unitProfiles[form]||unitProfiles[1];
    const raw=Array(119).fill(0),v=index=>Number(values[index])||0;
    switch(abilityId){
      case 1:raw[37]=v(0);raw[38]=v(1);raw[39]=100-v(2);break;
      case 2:raw[25]=v(0);raw[26]=v(1);break;
      case 3:raw[27]=v(0);raw[28]=v(1);if(buff.nameKey==='500'&&profile){raw[27]+=profile.slowChance;raw[28]=profile.slowFrames;}break;
      case 8:raw[24]=v(0);break;
      case 9:raw[71]=v(0);raw[72]=v(1);raw[73]=v(2);raw[74]=v(3);break;
      case 11:raw[42]=v(0);break;
      case 13:raw[31]=v(0);break;
      case 17:raw[35]=v(0);raw[36]=v(1);break;
      case 50:raw[82]=v(0);raw[83]=v(1);break;
      case 56:raw[86]=v(0);raw[89]=v(1);raw[87]=v(2);raw[88]=v(3);break;
      case 67:raw[113]=v(0);raw[114]=v(1);raw[115]=v(2);break;
    }
    const traits=(profile?.traits||[]).map(t=>({...t}));
    if(state){
      for(const otherId of Object.keys({...state.buffs,...state.permanent})){
        if(!root.RogueGuide.buffLevel(state,otherId))continue;
        const other=data.buffs[otherId],otherSkill=data.skills[other?.BuffSkillID],key=targetKeys[otherSkill?.AbilityID];
        if(key&&(other.TargetCharaID===buff.TargetCharaID||(other.TargetCharaID===undefined&&(other.TargetRarity<0||other.TargetRarity===data.units[buff.TargetCharaID]?.rarity)))&&!traits.some(t=>t.key===key))traits.push({key,label_ko:key});
      }
    }
    const ability=extraKey?{key:extraKey,summary_parts:[]}:buildTalentAbility({abilityId},raw,values,'');
    if(!ability)return null;
    if(abilityId===9)ability.summary_parts=warpParts[buff.BuffSkillID][Math.min(Math.max(1,level),skill.MaxLevel)];
    const resolved=applyFruitEffectsToAbility(ability,raw,traits,[]);
    const holder=root.document.createElement('span');appendAbilityParts(holder,resolved.summary_parts,true);
    return {text:holder.textContent,parts:resolved.summary_parts,raw,traits,abilityId,form};
  }
  root.RogueAbilityDetails={details,summary:(...args)=>details(...args)?.text??null};
})(window);
