"""Allowlisted inventory and positive stage records; no game credentials."""
ARRAY_ITEMS = {
    'battle': list(range(6)),
    'fruit': [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,160,161,164,167,168,169,170,171,179,180,181,182,183,184],
    'eyes': [50,51,52,53,54,58],
    'materials': [85,86,87,88,89,90,91,140,187,188,189,190,191,192,193,194],
    'drinks': [55,56,57],
    'lucky': [155,156],
}
SCALAR_ITEMS = {6:'xp',7:'np',20:'normal_tickets',21:'rare_tickets',22:'catfood',29:'platinum_tickets',
                105:'leadership',145:'legend_tickets',157:'platinum_shards',212:'hundred_million_ticket'}
INVENTORY_GROUPS = [
    ('전투 아이템', ARRAY_ITEMS['battle']),
    ('티켓', [20,21,157,29,145,212,155,156]),
    ('진화 재료', [30,31,32,33,34,43,160,41,164,35,36,37,38,39,40,161,42,44,167,168,169,170,171,184,179,180,181,182,183]),
    ('캣츠아이', ARRAY_ITEMS['eyes']), ('성 재료', ARRAY_ITEMS['materials']),
    ('기타', [6,7,22,55,56,57,105]),
]

def inventory_values(save):
    values={str(i):getattr(save,key) for i,key in SCALAR_ITEMS.items()}
    arrays={'battle':[i.amount for i in save.battle_items.items], 'fruit':save.catfruit, 'eyes':save.catseyes,
            'materials':save.ototo.base_materials.serialize(), 'drinks':save.catamins,
            'lucky':save.event_capsules_2}
    for key,ids in ARRAY_ITEMS.items():
        for index,item_id in enumerate(ids):
            # A missing slot is unknown, never an invented zero.
            values[str(item_id)]=arrays[key][index] if index<len(arrays[key]) else None
    return values

def cleared_stages(save):
    records=[]
    def add(href,count,crown=1,**extra):
        if type(count) is int and count>0:
            records.append({'href':href,'count':count,'crown':crown,**extra})
    for chapter in [0,1,2,4,5,6,7,8,9]:
        for index,stage in enumerate(save.story.chapters[chapter].stages[:48]):
            if chapter<3:
                file_index=47+chapter+1 if index==47 and chapter>0 else index
                href=f'stage/eoc/{file_index}.html'
            else:
                code=f'W{chapter:02d}' if chapter<7 else f'Space{chapter:02d}'
                href=f'stage/{code}/{index}.html'
            add(href,stage.clear_times,chapter=chapter)
    def group(code,chapters,event=False):
        for map_index,stars in enumerate(chapters):
            for crown,ch in enumerate(stars.chapters,1):
                for stage_index,stage in enumerate(ch.stages):
                    count=stage.clear_amount if event else stage.clear_times
                    add(f'stage/{code}{map_index:03d}/{stage_index}.html',count,crown)
    # Mappings follow the vendor's explicit edit_* code/base-index adapters.
    for index,code in enumerate(['N','S','C']):
        group(code,save.event_stages.chapters[index].chapters,event=True)
    for code,chapters in [('NA',save.uncanny.chapters.chapters),('ND',save.zero_legends.chapters),
                          ('V',save.tower.chapters.chapters),('B',save.catamin_stages.chapters.chapters),
                          ('A',save.gauntlets.chapters),('CA',save.collab_gauntlets.chapters),
                          ('Q',save.behemoth_culling.chapters),('H',save.enigma_clears.chapters),
                          ('D',save.legend_quest.chapters),('G',save.dojo_chapters.chapters),
                          ('DM',save.aku.chapters)]:
        group(code,chapters)
    for map_index,ch in enumerate(save.ex_stages.chapters):
        for index,stage in enumerate(ch.stages):
            add(f'stage/EX{map_index:03d}/{index}.html',stage.clear_amount)
    for chapter,ch in save.outbreaks.chapters.items():
        for index,stage in ch.outbreaks.items():
            if stage.cleared:
                # Boolean completion has no fabricated clear count.
                file_index=48+chapter if index==47 and chapter in (1,2) else index
                records.append({'href':f'stage/Z{chapter:03d}/{file_index}.html','count':None,'crown':1,'cleared':True})
    return records


def owned_medals(save):
    # Actual ownership uses the same ID list as the vendor has_medal method.
    return sorted({identity for identity in save.medals.medal_data_1
                   if type(identity) is int and identity >= 0})
