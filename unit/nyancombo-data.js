window.NYANKODB_COMBO_CATALOG = {
  "categories": [
    {
      "label": "전체",
      "effects": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "subcategories": []
    },
    {
      "label": "캐릭터 성능",
      "effects": [
        0,
        1,
        2,
        27
      ],
      "subcategories": [
        {
          "label": "공격력",
          "effectId": 0
        },
        {
          "label": "체력",
          "effectId": 1
        },
        {
          "label": "이동 속도",
          "effectId": 2
        }
      ]
    },
    {
      "label": "캐릭터 특수 능력",
      "effects": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        28
      ],
      "subcategories": [
        {
          "label": "엄청 강하다",
          "effectId": 14
        },
        {
          "label": "초 데미지",
          "effectId": 15
        },
        {
          "label": "맷집이 좋다",
          "effectId": 16
        },
        {
          "label": "날려버린다",
          "effectId": 17
        },
        {
          "label": "느리게 한다",
          "effectId": 18
        },
        {
          "label": "움직임을 멈춘다",
          "effectId": 19
        },
        {
          "label": "공격력 다운",
          "effectId": 20
        },
        {
          "label": "공격력 업",
          "effectId": 21
        },
        {
          "label": "크리티컬",
          "effectId": 24
        }
      ]
    },
    {
      "label": "냥코성",
      "effects": [
        3,
        6,
        7,
        10
      ],
      "subcategories": [
        {
          "label": "초기 게이지",
          "effectId": 3
        },
        {
          "label": "공격력",
          "effectId": 6
        },
        {
          "label": "충전 속도",
          "effectId": 7
        },
        {
          "label": "내구력",
          "effectId": 10
        }
      ]
    },
    {
      "label": "소지금·일 고양이",
      "effects": [
        5,
        4,
        9
      ],
      "subcategories": [
        {
          "label": "초기 소지금",
          "effectId": 5
        },
        {
          "label": "초기 레벨",
          "effectId": 4
        },
        {
          "label": "지갑",
          "effectId": 9
        }
      ]
    },
    {
      "label": "전투효과",
      "effects": [
        11,
        12,
        13
      ],
      "subcategories": [
        {
          "label": "연구력",
          "effectId": 11
        },
        {
          "label": "회계력",
          "effectId": 12
        },
        {
          "label": "공부력",
          "effectId": 13
        }
      ]
    }
  ],
  "combos": [
    {
      "id": 0,
      "name": "냥코군단",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 0,
          "form": 1,
          "name": "고양이",
          "icon": "../img/u/0/0.png"
        },
        {
          "unitId": 1,
          "form": 1,
          "name": "탱크 고양이",
          "icon": "../img/u/1/0.png"
        },
        {
          "unitId": 2,
          "form": 1,
          "name": "배틀 고양이",
          "icon": "../img/u/2/0.png"
        },
        {
          "unitId": 3,
          "form": 1,
          "name": "징글 고양이",
          "icon": "../img/u/3/0.png"
        },
        {
          "unitId": 4,
          "form": 1,
          "name": "황소 고양이",
          "icon": "../img/u/4/0.png"
        }
      ]
    },
    {
      "id": 1,
      "name": "수상한 관계",
      "effectId": 6,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【소】",
      "members": [
        {
          "unitId": 13,
          "form": 1,
          "name": "여왕 고양이",
          "icon": "../img/u/13/0.png"
        },
        {
          "unitId": 12,
          "form": 1,
          "name": "고양이 밧줄",
          "icon": "../img/u/12/0.png"
        }
      ]
    },
    {
      "id": 2,
      "name": "고래잡이",
      "effectId": 10,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "성 내구력 UP  【소】",
      "members": [
        {
          "unitId": 51,
          "form": 2,
          "name": "고양이 어부",
          "icon": "../img/u/51/1.png"
        },
        {
          "unitId": 6,
          "form": 2,
          "name": "고양이 고래",
          "icon": "../img/u/6/1.png"
        }
      ]
    },
    {
      "id": 3,
      "name": "데스메탈",
      "effectId": 3,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【소】",
      "members": [
        {
          "unitId": 19,
          "form": 1,
          "name": "고양이 좀비",
          "icon": "../img/u/19/0.png"
        },
        {
          "unitId": 148,
          "form": 1,
          "name": "고양이 로커",
          "icon": "../img/u/148/0.png"
        }
      ]
    },
    {
      "id": 4,
      "name": "재팬 코스프레",
      "effectId": 0,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【중】",
      "members": [
        {
          "unitId": 18,
          "form": 1,
          "name": "고양이 닌자",
          "icon": "../img/u/18/0.png"
        },
        {
          "unitId": 21,
          "form": 1,
          "name": "스모 고양이",
          "icon": "../img/u/21/0.png"
        },
        {
          "unitId": 20,
          "form": 1,
          "name": "고양이 무사",
          "icon": "../img/u/20/0.png"
        },
        {
          "unitId": 61,
          "form": 1,
          "name": "고양이 스시",
          "icon": "../img/u/61/0.png"
        }
      ]
    },
    {
      "id": 5,
      "name": "일광욕",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 6,
          "form": 3,
          "name": "고양이 섬",
          "icon": "../img/u/6/2.png"
        },
        {
          "unitId": 199,
          "form": 2,
          "name": "표류 고양이",
          "icon": "../img/u/199/1.png"
        }
      ]
    },
    {
      "id": 6,
      "name": "파닥파닥",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 56,
          "form": 2,
          "name": "고양이 큐피트",
          "icon": "../img/u/56/1.png"
        },
        {
          "unitId": 5,
          "form": 1,
          "name": "고양이 새",
          "icon": "../img/u/5/0.png"
        }
      ]
    },
    {
      "id": 7,
      "name": "도끼의 달인",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 13,
          "form": 2,
          "name": "처형인",
          "icon": "../img/u/13/1.png"
        },
        {
          "unitId": 2,
          "form": 1,
          "name": "배틀 고양이",
          "icon": "../img/u/2/0.png"
        },
        {
          "unitId": 72,
          "form": 2,
          "name": "분노의 백호",
          "icon": "../img/u/72/1.png"
        }
      ]
    },
    {
      "id": 8,
      "name": "귤과 사과",
      "effectId": 10,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "성 내구력 UP  【소】",
      "members": [
        {
          "unitId": 14,
          "form": 2,
          "name": "고양이 갱단",
          "icon": "../img/u/14/1.png"
        },
        {
          "unitId": 39,
          "form": 1,
          "name": "고양이 사과",
          "icon": "../img/u/39/0.png"
        }
      ]
    },
    {
      "id": 9,
      "name": "바른 인사",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 1,
          "form": 1,
          "name": "탱크 고양이",
          "icon": "../img/u/1/0.png"
        },
        {
          "unitId": 169,
          "form": 2,
          "name": "쿠비란파사란",
          "icon": "../img/u/169/1.png"
        }
      ]
    },
    {
      "id": 10,
      "name": "아이돌 지망생",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 16,
          "form": 1,
          "name": "귀여미",
          "icon": "../img/u/16/0.png"
        },
        {
          "unitId": 131,
          "form": 1,
          "name": "귀요미",
          "icon": "../img/u/131/0.png"
        }
      ]
    },
    {
      "id": 11,
      "name": "바이크 투어링",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 17,
          "form": 2,
          "name": "고양이 와일드",
          "icon": "../img/u/17/1.png"
        },
        {
          "unitId": 158,
          "form": 1,
          "name": "사라만다",
          "icon": "../img/u/158/0.png"
        }
      ]
    },
    {
      "id": 12,
      "name": "속옷 세트",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 123,
          "form": 2,
          "name": "럽럽 냥코",
          "icon": "../img/u/123/1.png"
        },
        {
          "unitId": 15,
          "form": 1,
          "name": "고양이 팬티",
          "icon": "../img/u/15/0.png"
        }
      ]
    },
    {
      "id": 13,
      "name": "ㅇㅇㅇ꽃이 피었습니다!",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 72,
          "form": 2,
          "name": "분노의 백호",
          "icon": "../img/u/72/1.png"
        },
        {
          "unitId": 127,
          "form": 1,
          "name": "고양이 플라워",
          "icon": "../img/u/127/0.png"
        }
      ]
    },
    {
      "id": 14,
      "name": "작은 고양이의 우정",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 269,
          "form": 1,
          "name": "요수 가오",
          "icon": "../img/u/269/0.png"
        },
        {
          "unitId": 209,
          "form": 1,
          "name": "꼬맹이 고양이",
          "icon": "../img/u/209/0.png"
        }
      ]
    },
    {
      "id": 15,
      "name": "카우보이",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 4,
          "form": 1,
          "name": "황소 고양이",
          "icon": "../img/u/4/0.png"
        },
        {
          "unitId": 145,
          "form": 2,
          "name": "웨스턴 고양이",
          "icon": "../img/u/145/1.png"
        }
      ]
    },
    {
      "id": 16,
      "name": "인형사 협회 회원",
      "effectId": 3,
      "effectLevel": 1,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【중】",
      "members": [
        {
          "unitId": 226,
          "form": 1,
          "name": "주술사 데스삐에로",
          "icon": "../img/u/226/0.png"
        },
        {
          "unitId": 126,
          "form": 2,
          "name": "고양이 인형사",
          "icon": "../img/u/126/1.png"
        }
      ]
    },
    {
      "id": 17,
      "name": "둘이서 깡충깡충",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 37,
          "form": 1,
          "name": "고양이 홉핑",
          "icon": "../img/u/37/0.png"
        },
        {
          "unitId": 88,
          "form": 1,
          "name": "고양이 줄넘기",
          "icon": "../img/u/88/0.png"
        }
      ]
    },
    {
      "id": 18,
      "name": "보살&성모",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 30,
          "form": 1,
          "name": "고양이 보살",
          "icon": "../img/u/30/0.png"
        },
        {
          "unitId": 9,
          "form": 2,
          "name": "고양이 성모",
          "icon": "../img/u/9/1.png"
        }
      ]
    },
    {
      "id": 19,
      "name": "폴인러브",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 56,
          "form": 2,
          "name": "고양이 큐피트",
          "icon": "../img/u/56/1.png"
        },
        {
          "unitId": 109,
          "form": 1,
          "name": "마담・더・신부",
          "icon": "../img/u/109/0.png"
        }
      ]
    },
    {
      "id": 20,
      "name": "개구리 왕자님",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 150,
          "form": 2,
          "name": "창가의 공주 고양이",
          "icon": "../img/u/150/1.png"
        },
        {
          "unitId": 18,
          "form": 2,
          "name": "개구리 고양이 닌자",
          "icon": "../img/u/18/1.png"
        }
      ]
    },
    {
      "id": 21,
      "name": "손자 만세",
      "effectId": 3,
      "effectLevel": 1,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【중】",
      "members": [
        {
          "unitId": 59,
          "form": 1,
          "name": "고양이 베이비",
          "icon": "../img/u/59/0.png"
        },
        {
          "unitId": 132,
          "form": 1,
          "name": "쿵후 냥코G",
          "icon": "../img/u/132/0.png"
        }
      ]
    },
    {
      "id": 22,
      "name": "무대위의 꽃",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 9,
          "form": 1,
          "name": "고양이 여배우",
          "icon": "../img/u/9/0.png"
        },
        {
          "unitId": 41,
          "form": 2,
          "name": "고양이 젠느",
          "icon": "../img/u/41/1.png"
        }
      ]
    },
    {
      "id": 23,
      "name": "바이오하자드",
      "effectId": 11,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【소】",
      "members": [
        {
          "unitId": 19,
          "form": 1,
          "name": "고양이 좀비",
          "icon": "../img/u/19/0.png"
        },
        {
          "unitId": 11,
          "form": 1,
          "name": "Mr.",
          "icon": "../img/u/11/0.png"
        }
      ]
    },
    {
      "id": 24,
      "name": "한여름날의 태양",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 127,
          "form": 2,
          "name": "냥코 선풍기",
          "icon": "../img/u/127/1.png"
        },
        {
          "unitId": 38,
          "form": 2,
          "name": "고양이 태양",
          "icon": "../img/u/38/1.png"
        }
      ]
    },
    {
      "id": 25,
      "name": "순록의 선물",
      "effectId": 5,
      "effectLevel": 0,
      "value": 300,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【소】",
      "members": [
        {
          "unitId": 74,
          "form": 1,
          "name": "순록피쉬",
          "icon": "../img/u/74/0.png"
        },
        {
          "unitId": 244,
          "form": 1,
          "name": "고양이의 선물",
          "icon": "../img/u/244/0.png"
        }
      ]
    },
    {
      "id": 26,
      "name": "영화 스타",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 153,
          "form": 2,
          "name": "고양이 영사기",
          "icon": "../img/u/153/1.png"
        },
        {
          "unitId": 9,
          "form": 1,
          "name": "고양이 여배우",
          "icon": "../img/u/9/0.png"
        }
      ]
    },
    {
      "id": 27,
      "name": "내다리는 길다냥",
      "effectId": 18,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 3,
          "form": 1,
          "name": "징글 고양이",
          "icon": "../img/u/3/0.png"
        },
        {
          "unitId": 168,
          "form": 2,
          "name": "아시란파사란",
          "icon": "../img/u/168/1.png"
        }
      ]
    },
    {
      "id": 28,
      "name": "술상무",
      "effectId": 10,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "성 내구력 UP  【소】",
      "members": [
        {
          "unitId": 128,
          "form": 2,
          "name": "냥코안경",
          "icon": "../img/u/128/1.png"
        },
        {
          "unitId": 32,
          "form": 2,
          "name": "고양이 알몸 댄스",
          "icon": "../img/u/32/1.png"
        }
      ]
    },
    {
      "id": 29,
      "name": "굳잡",
      "effectId": 13,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "공부력 UP  【소】",
      "members": [
        {
          "unitId": 237,
          "form": 2,
          "name": "고양이 대박사",
          "icon": "../img/u/237/1.png"
        }
      ]
    },
    {
      "id": 30,
      "name": "써틴",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 239,
          "form": 2,
          "name": "고양고르고",
          "icon": "../img/u/239/1.png"
        }
      ]
    },
    {
      "id": 31,
      "name": "고양이 도련님",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 238,
          "form": 2,
          "name": "고양이 도령의 파파",
          "icon": "../img/u/238/1.png"
        }
      ]
    },
    {
      "id": 1000,
      "name": "진격의 미니 고양이",
      "effectId": 2,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【중】",
      "members": [
        {
          "unitId": 209,
          "form": 1,
          "name": "꼬맹이 고양이",
          "icon": "../img/u/209/0.png"
        },
        {
          "unitId": 210,
          "form": 1,
          "name": "꼬맹이 탱크 고양이",
          "icon": "../img/u/210/0.png"
        },
        {
          "unitId": 211,
          "form": 1,
          "name": "꼬맹이 배틀 고양이",
          "icon": "../img/u/211/0.png"
        },
        {
          "unitId": 245,
          "form": 1,
          "name": "꼬맹이 징글 고양이",
          "icon": "../img/u/245/0.png"
        },
        {
          "unitId": 246,
          "form": 1,
          "name": "꼬맹이 황소 고양이",
          "icon": "../img/u/246/0.png"
        }
      ]
    },
    {
      "id": 1001,
      "name": "사이언스 픽션",
      "effectId": 6,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【소】",
      "members": [
        {
          "unitId": 197,
          "form": 2,
          "name": "네오 사이킥 냥코",
          "icon": "../img/u/197/1.png"
        },
        {
          "unitId": 5,
          "form": 2,
          "name": "고양이UFO",
          "icon": "../img/u/5/1.png"
        }
      ]
    },
    {
      "id": 1002,
      "name": "뷰티풀 레그",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 3,
          "form": 2,
          "name": "각선미 고양이",
          "icon": "../img/u/3/1.png"
        },
        {
          "unitId": 94,
          "form": 2,
          "name": "광란의 각선미 고양이",
          "icon": "../img/u/94/1.png"
        }
      ]
    },
    {
      "id": 1003,
      "name": "미술 교실",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 148,
          "form": 2,
          "name": "고양이 아티스트",
          "icon": "../img/u/148/1.png"
        },
        {
          "unitId": 60,
          "form": 2,
          "name": "예술의 고양이스테츄",
          "icon": "../img/u/60/1.png"
        }
      ]
    },
    {
      "id": 1004,
      "name": "큰고래 잡이",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 51,
          "form": 2,
          "name": "고양이 어부",
          "icon": "../img/u/51/1.png"
        },
        {
          "unitId": 6,
          "form": 2,
          "name": "고양이 고래",
          "icon": "../img/u/6/1.png"
        },
        {
          "unitId": 97,
          "form": 2,
          "name": "광란의 고양이 고래",
          "icon": "../img/u/97/1.png"
        }
      ]
    },
    {
      "id": 1005,
      "name": "생선 천국",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 6,
          "form": 1,
          "name": "고양이 피쉬",
          "icon": "../img/u/6/0.png"
        },
        {
          "unitId": 97,
          "form": 1,
          "name": "광란의 고양이 피쉬",
          "icon": "../img/u/97/0.png"
        },
        {
          "unitId": 74,
          "form": 1,
          "name": "순록피쉬",
          "icon": "../img/u/74/0.png"
        }
      ]
    },
    {
      "id": 1006,
      "name": "스톰 일가족",
      "effectId": 1,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【중】",
      "members": [
        {
          "unitId": 60,
          "form": 1,
          "name": "고양이브・론즈",
          "icon": "../img/u/60/0.png"
        },
        {
          "unitId": 88,
          "form": 1,
          "name": "고양이 줄넘기",
          "icon": "../img/u/88/0.png"
        },
        {
          "unitId": 78,
          "form": 1,
          "name": "고양이와 우주",
          "icon": "../img/u/78/0.png"
        },
        {
          "unitId": 126,
          "form": 1,
          "name": "꼭두각시 냥코",
          "icon": "../img/u/126/0.png"
        },
        {
          "unitId": 154,
          "form": 1,
          "name": "고양이 훌라",
          "icon": "../img/u/154/0.png"
        }
      ]
    },
    {
      "id": 1007,
      "name": "모히칸 애호가",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 0,
          "form": 3,
          "name": "고양이 모히칸",
          "icon": "../img/u/0/2.png"
        },
        {
          "unitId": 98,
          "form": 2,
          "name": "광란의 고양이 드래곤",
          "icon": "../img/u/98/1.png"
        }
      ]
    },
    {
      "id": 1008,
      "name": "미확인 비행물체",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 5,
          "form": 2,
          "name": "고양이UFO",
          "icon": "../img/u/5/1.png"
        },
        {
          "unitId": 96,
          "form": 2,
          "name": "광란의 고양이 UFO",
          "icon": "../img/u/96/1.png"
        }
      ]
    },
    {
      "id": 1009,
      "name": "로봇친구",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 78,
          "form": 2,
          "name": "냐앙소령",
          "icon": "../img/u/78/1.png"
        },
        {
          "unitId": 81,
          "form": 2,
          "name": "야징가 로보",
          "icon": "../img/u/81/1.png"
        }
      ]
    },
    {
      "id": 1010,
      "name": "마초맨",
      "effectId": 21,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 업」 효과 UP  【소】",
      "members": [
        {
          "unitId": 3,
          "form": 3,
          "name": "불끈다리 고양이",
          "icon": "../img/u/3/2.png"
        },
        {
          "unitId": 9,
          "form": 3,
          "name": "고양이 마초",
          "icon": "../img/u/9/2.png"
        }
      ]
    },
    {
      "id": 1011,
      "name": "넷이서 깡총깡총",
      "effectId": 5,
      "effectLevel": 1,
      "value": 500,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【중】",
      "members": [
        {
          "unitId": 123,
          "form": 2,
          "name": "럽럽 냥코",
          "icon": "../img/u/123/1.png"
        },
        {
          "unitId": 88,
          "form": 2,
          "name": "고양고양 줄넘기",
          "icon": "../img/u/88/1.png"
        }
      ]
    },
    {
      "id": 1012,
      "name": "부두술사의 저주",
      "effectId": 5,
      "effectLevel": 0,
      "value": 300,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【소】",
      "members": [
        {
          "unitId": 52,
          "form": 2,
          "name": "고양이 라만사",
          "icon": "../img/u/52/1.png"
        },
        {
          "unitId": 126,
          "form": 2,
          "name": "고양이 인형사",
          "icon": "../img/u/126/1.png"
        }
      ]
    },
    {
      "id": 1013,
      "name": "킹 앤 퀸",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 7,
          "form": 3,
          "name": "고양이 킹드래곤",
          "icon": "../img/u/7/2.png"
        },
        {
          "unitId": 42,
          "form": 2,
          "name": "고양이 아이스퀸",
          "icon": "../img/u/42/1.png"
        }
      ]
    },
    {
      "id": 1014,
      "name": "더・닌자",
      "effectId": 2,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【중】",
      "members": [
        {
          "unitId": 18,
          "form": 1,
          "name": "고양이 닌자",
          "icon": "../img/u/18/0.png"
        },
        {
          "unitId": 261,
          "form": 1,
          "name": "천주 송골매",
          "icon": "../img/u/261/0.png"
        }
      ]
    },
    {
      "id": 1015,
      "name": "중2병",
      "effectId": 21,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 업」 효과 UP  【소】",
      "members": [
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        },
        {
          "unitId": 194,
          "form": 1,
          "name": "아키라",
          "icon": "../img/u/194/0.png"
        }
      ]
    },
    {
      "id": 1016,
      "name": "듀엣",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 16,
          "form": 1,
          "name": "귀여미",
          "icon": "../img/u/16/0.png"
        },
        {
          "unitId": 148,
          "form": 1,
          "name": "고양이 로커",
          "icon": "../img/u/148/0.png"
        }
      ]
    },
    {
      "id": 1017,
      "name": "불 조심",
      "effectId": 20,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【소】",
      "members": [
        {
          "unitId": 7,
          "form": 1,
          "name": "고양이 도마뱀",
          "icon": "../img/u/7/0.png"
        },
        {
          "unitId": 98,
          "form": 1,
          "name": "광란의 고양이 도마뱀",
          "icon": "../img/u/98/0.png"
        },
        {
          "unitId": 203,
          "form": 2,
          "name": "화염돌격대 너굴냥즈",
          "icon": "../img/u/203/1.png"
        }
      ]
    },
    {
      "id": 1018,
      "name": "돼지고기 덮밥",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 106,
          "form": 1,
          "name": "카이",
          "icon": "../img/u/106/0.png"
        },
        {
          "unitId": 21,
          "form": 3,
          "name": "고양이 주먹밥",
          "icon": "../img/u/21/2.png"
        }
      ]
    },
    {
      "id": 1019,
      "name": "고양이를 보면 행복해져",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 0,
          "form": 1,
          "name": "고양이",
          "icon": "../img/u/0/0.png"
        },
        {
          "unitId": 107,
          "form": 2,
          "name": "갓파κ",
          "icon": "../img/u/107/1.png"
        }
      ]
    },
    {
      "id": 1020,
      "name": "사자의 왕",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 4,
          "form": 3,
          "name": "고양이 라이온",
          "icon": "../img/u/4/2.png"
        },
        {
          "unitId": 109,
          "form": 2,
          "name": "마담・더・킹",
          "icon": "../img/u/109/1.png"
        }
      ]
    },
    {
      "id": 1021,
      "name": "복숭아와 바나나",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 136,
          "form": 1,
          "name": "복숭아 동자",
          "icon": "../img/u/136/0.png"
        },
        {
          "unitId": 14,
          "form": 1,
          "name": "고양이 한박스",
          "icon": "../img/u/14/0.png"
        }
      ]
    },
    {
      "id": 1022,
      "name": "원령의 한",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 128,
          "form": 1,
          "name": "처녀귀신 냥코",
          "icon": "../img/u/128/0.png"
        },
        {
          "unitId": 73,
          "form": 1,
          "name": "하데스",
          "icon": "../img/u/73/0.png"
        }
      ]
    },
    {
      "id": 1023,
      "name": "뜨거운 날도 시원하게",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 42,
          "form": 1,
          "name": "고양이 아이스",
          "icon": "../img/u/42/0.png"
        },
        {
          "unitId": 127,
          "form": 2,
          "name": "냥코 선풍기",
          "icon": "../img/u/127/1.png"
        }
      ]
    },
    {
      "id": 1024,
      "name": "아폴로",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 78,
          "form": 1,
          "name": "고양이와 우주",
          "icon": "../img/u/78/0.png"
        },
        {
          "unitId": 138,
          "form": 2,
          "name": "파괴위성 데스문",
          "icon": "../img/u/138/1.png"
        }
      ]
    },
    {
      "id": 1025,
      "name": "네크로맨서",
      "effectId": 11,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【소】",
      "members": [
        {
          "unitId": 52,
          "form": 2,
          "name": "고양이 라만사",
          "icon": "../img/u/52/1.png"
        },
        {
          "unitId": 19,
          "form": 3,
          "name": "고양이 해골",
          "icon": "../img/u/19/2.png"
        }
      ]
    },
    {
      "id": 1026,
      "name": "기사도와 과자도",
      "effectId": 18,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 85,
          "form": 1,
          "name": "용기사 바르스",
          "icon": "../img/u/85/0.png"
        },
        {
          "unitId": 20,
          "form": 3,
          "name": "고양이 파티쉐",
          "icon": "../img/u/20/2.png"
        }
      ]
    },
    {
      "id": 1027,
      "name": "드라마에서 만났어요",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 196,
          "form": 1,
          "name": "캣맨대디",
          "icon": "../img/u/196/0.png"
        },
        {
          "unitId": 9,
          "form": 1,
          "name": "고양이 여배우",
          "icon": "../img/u/9/0.png"
        }
      ]
    },
    {
      "id": 1028,
      "name": "고양이 앤 탱크 고양이",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 63,
          "form": 1,
          "name": "고양이 운동회",
          "icon": "../img/u/63/0.png"
        },
        {
          "unitId": 81,
          "form": 1,
          "name": "냥코 부부",
          "icon": "../img/u/81/0.png"
        },
        {
          "unitId": 80,
          "form": 3,
          "name": "고양이 신사 동맹",
          "icon": "../img/u/80/2.png"
        }
      ]
    },
    {
      "id": 1029,
      "name": "머리띠",
      "effectId": 6,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【소】",
      "members": [
        {
          "unitId": 63,
          "form": 1,
          "name": "고양이 운동회",
          "icon": "../img/u/63/0.png"
        },
        {
          "unitId": 70,
          "form": 2,
          "name": "고양이 원혼",
          "icon": "../img/u/70/1.png"
        },
        {
          "unitId": 136,
          "form": 1,
          "name": "복숭아 동자",
          "icon": "../img/u/136/0.png"
        }
      ]
    },
    {
      "id": 1030,
      "name": "왕누님들",
      "effectId": 3,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【소】",
      "members": [
        {
          "unitId": 13,
          "form": 1,
          "name": "여왕 고양이",
          "icon": "../img/u/13/0.png"
        },
        {
          "unitId": 122,
          "form": 2,
          "name": "평범한 오피스 레이디",
          "icon": "../img/u/122/1.png"
        }
      ]
    },
    {
      "id": 1031,
      "name": "가면무도회",
      "effectId": 17,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        },
        {
          "unitId": 13,
          "form": 2,
          "name": "처형인",
          "icon": "../img/u/13/1.png"
        },
        {
          "unitId": 80,
          "form": 1,
          "name": "내가 도깨비라오",
          "icon": "../img/u/80/0.png"
        }
      ]
    },
    {
      "id": 2000,
      "name": "진격의 광란의 고양이",
      "effectId": 5,
      "effectLevel": 2,
      "value": 1000,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【대】",
      "members": [
        {
          "unitId": 91,
          "form": 1,
          "name": "광란의 고양이",
          "icon": "../img/u/91/0.png"
        },
        {
          "unitId": 92,
          "form": 1,
          "name": "광란의 탱크 고양이",
          "icon": "../img/u/92/0.png"
        },
        {
          "unitId": 93,
          "form": 1,
          "name": "광란의 배틀 고양이",
          "icon": "../img/u/93/0.png"
        },
        {
          "unitId": 94,
          "form": 1,
          "name": "광란의 징글 고양이",
          "icon": "../img/u/94/0.png"
        },
        {
          "unitId": 95,
          "form": 1,
          "name": "광란의 황소 고양이",
          "icon": "../img/u/95/0.png"
        }
      ]
    },
    {
      "id": 2001,
      "name": "암흑의 힘",
      "effectId": 20,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【중】",
      "members": [
        {
          "unitId": 2,
          "form": 3,
          "name": "암흑 고양이",
          "icon": "../img/u/2/2.png"
        },
        {
          "unitId": 13,
          "form": 3,
          "name": "다크 라이더",
          "icon": "../img/u/13/2.png"
        }
      ]
    },
    {
      "id": 2002,
      "name": "징글징글",
      "effectId": 19,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 3,
          "form": 1,
          "name": "징글 고양이",
          "icon": "../img/u/3/0.png"
        },
        {
          "unitId": 94,
          "form": 1,
          "name": "광란의 징글 고양이",
          "icon": "../img/u/94/0.png"
        },
        {
          "unitId": 176,
          "form": 2,
          "name": "징글마시멜로 냥코",
          "icon": "../img/u/176/1.png"
        }
      ]
    },
    {
      "id": 2003,
      "name": "주식회사 냥코",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 70,
          "form": 1,
          "name": "고양리맨",
          "icon": "../img/u/70/0.png"
        },
        {
          "unitId": 122,
          "form": 2,
          "name": "평범한 오피스 레이디",
          "icon": "../img/u/122/1.png"
        }
      ]
    },
    {
      "id": 2004,
      "name": "신록과 꽃의 계절",
      "effectId": 14,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 100,
          "form": 1,
          "name": "고양이 소녀",
          "icon": "../img/u/100/0.png"
        },
        {
          "unitId": 104,
          "form": 1,
          "name": "물 만난 물고기",
          "icon": "../img/u/104/0.png"
        },
        {
          "unitId": 109,
          "form": 1,
          "name": "마담・더・신부",
          "icon": "../img/u/109/0.png"
        }
      ]
    },
    {
      "id": 2005,
      "name": "노출광",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 32,
          "form": 2,
          "name": "고양이 알몸 댄스",
          "icon": "../img/u/32/1.png"
        },
        {
          "unitId": 80,
          "form": 2,
          "name": "고양이 신사",
          "icon": "../img/u/80/1.png"
        }
      ]
    },
    {
      "id": 2006,
      "name": "꽃놀이",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 72,
          "form": 2,
          "name": "분노의 백호",
          "icon": "../img/u/72/1.png"
        },
        {
          "unitId": 79,
          "form": 1,
          "name": "냥코 성인",
          "icon": "../img/u/79/0.png"
        }
      ]
    },
    {
      "id": 2007,
      "name": "일식 요리",
      "effectId": 5,
      "effectLevel": 1,
      "value": 500,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【중】",
      "members": [
        {
          "unitId": 74,
          "form": 2,
          "name": "고양이회 모듬",
          "icon": "../img/u/74/1.png"
        },
        {
          "unitId": 61,
          "form": 1,
          "name": "고양이 스시",
          "icon": "../img/u/61/0.png"
        }
      ]
    },
    {
      "id": 2008,
      "name": "자칭 타칭 도깨비",
      "effectId": 12,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【중】",
      "members": [
        {
          "unitId": 44,
          "form": 1,
          "name": "도깨비 야옹마",
          "icon": "../img/u/44/0.png"
        },
        {
          "unitId": 80,
          "form": 1,
          "name": "내가 도깨비라오",
          "icon": "../img/u/80/0.png"
        }
      ]
    },
    {
      "id": 2009,
      "name": "전통예능",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 126,
          "form": 2,
          "name": "고양이 인형사",
          "icon": "../img/u/126/1.png"
        },
        {
          "unitId": 152,
          "form": 2,
          "name": "고양이 요요",
          "icon": "../img/u/152/1.png"
        }
      ]
    },
    {
      "id": 2010,
      "name": "여성 운동선수",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 100,
          "form": 2,
          "name": "모솔 고양이",
          "icon": "../img/u/100/1.png"
        },
        {
          "unitId": 36,
          "form": 2,
          "name": "고양이 버터플라이",
          "icon": "../img/u/36/1.png"
        }
      ]
    },
    {
      "id": 2011,
      "name": "젠틀맨",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 80,
          "form": 2,
          "name": "고양이 신사",
          "icon": "../img/u/80/1.png"
        },
        {
          "unitId": 49,
          "form": 2,
          "name": "괴도 야콘",
          "icon": "../img/u/49/1.png"
        }
      ]
    },
    {
      "id": 2012,
      "name": "풍차",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 17,
          "form": 1,
          "name": "고양이 세발자전거",
          "icon": "../img/u/17/0.png"
        },
        {
          "unitId": 104,
          "form": 1,
          "name": "물 만난 물고기",
          "icon": "../img/u/104/0.png"
        }
      ]
    },
    {
      "id": 2013,
      "name": "롱 넥",
      "effectId": 4,
      "effectLevel": 1,
      "value": 2,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【중】",
      "members": [
        {
          "unitId": 4,
          "form": 2,
          "name": "기린 고양이",
          "icon": "../img/u/4/1.png"
        },
        {
          "unitId": 169,
          "form": 2,
          "name": "쿠비란파사란",
          "icon": "../img/u/169/1.png"
        }
      ]
    },
    {
      "id": 2014,
      "name": "댄서즈",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 22,
          "form": 2,
          "name": "고양이 카니발",
          "icon": "../img/u/22/1.png"
        },
        {
          "unitId": 32,
          "form": 1,
          "name": "고양이 댄스",
          "icon": "../img/u/32/0.png"
        },
        {
          "unitId": 10,
          "form": 3,
          "name": "고양이 댄서",
          "icon": "../img/u/10/2.png"
        }
      ]
    },
    {
      "id": 2015,
      "name": "조금 따끔할거예요!",
      "effectId": 17,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 143,
          "form": 1,
          "name": "고양이 간호사",
          "icon": "../img/u/143/0.png"
        },
        {
          "unitId": 79,
          "form": 2,
          "name": "냥코 환자",
          "icon": "../img/u/79/1.png"
        }
      ]
    },
    {
      "id": 2016,
      "name": "호러 영화",
      "effectId": 16,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 19,
          "form": 1,
          "name": "고양이 좀비",
          "icon": "../img/u/19/0.png"
        },
        {
          "unitId": 128,
          "form": 1,
          "name": "처녀귀신 냥코",
          "icon": "../img/u/128/0.png"
        },
        {
          "unitId": 33,
          "form": 2,
          "name": "고양이TV",
          "icon": "../img/u/33/1.png"
        }
      ]
    },
    {
      "id": 2017,
      "name": "냥코 학원",
      "effectId": 20,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【소】",
      "members": [
        {
          "unitId": 201,
          "form": 2,
          "name": "플랜카드 냥코",
          "icon": "../img/u/201/1.png"
        },
        {
          "unitId": 31,
          "form": 1,
          "name": "고양이 일진",
          "icon": "../img/u/31/0.png"
        },
        {
          "unitId": 100,
          "form": 1,
          "name": "고양이 소녀",
          "icon": "../img/u/100/0.png"
        }
      ]
    },
    {
      "id": 2018,
      "name": "창 시합",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 138,
          "form": 1,
          "name": "대나무 공주",
          "icon": "../img/u/138/0.png"
        },
        {
          "unitId": 24,
          "form": 1,
          "name": "고양이 발키리",
          "icon": "../img/u/24/0.png"
        }
      ]
    },
    {
      "id": 2019,
      "name": "마음이 깡총깡총",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 212,
          "form": 1,
          "name": "화이트 래빗",
          "icon": "../img/u/212/0.png"
        },
        {
          "unitId": 88,
          "form": 1,
          "name": "고양이 줄넘기",
          "icon": "../img/u/88/0.png"
        }
      ]
    },
    {
      "id": 3000,
      "name": "막대 사탕이 짱이야",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 15,
          "form": 3,
          "name": "고양이 캔디",
          "icon": "../img/u/15/2.png"
        },
        {
          "unitId": 172,
          "form": 1,
          "name": "꼬맹이 야옹마",
          "icon": "../img/u/172/0.png"
        }
      ]
    },
    {
      "id": 3001,
      "name": "사범님과 함께",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 10,
          "form": 1,
          "name": "쿵후 냥코",
          "icon": "../img/u/10/0.png"
        },
        {
          "unitId": 132,
          "form": 1,
          "name": "쿵후 냥코G",
          "icon": "../img/u/132/0.png"
        }
      ]
    },
    {
      "id": 3002,
      "name": "3마리의 왕",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 109,
          "form": 2,
          "name": "마담・더・킹",
          "icon": "../img/u/109/1.png"
        },
        {
          "unitId": 7,
          "form": 3,
          "name": "고양이 킹드래곤",
          "icon": "../img/u/7/2.png"
        },
        {
          "unitId": 4,
          "form": 3,
          "name": "고양이 라이온",
          "icon": "../img/u/4/2.png"
        }
      ]
    },
    {
      "id": 3003,
      "name": "소녀",
      "effectId": 10,
      "effectLevel": 1,
      "value": 50,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "성 내구력 UP  【중】",
      "members": [
        {
          "unitId": 100,
          "form": 1,
          "name": "고양이 소녀",
          "icon": "../img/u/100/0.png"
        },
        {
          "unitId": 150,
          "form": 1,
          "name": "창가의 소녀 고양이",
          "icon": "../img/u/150/0.png"
        }
      ]
    },
    {
      "id": 3004,
      "name": "팀:헤드뱅잉",
      "effectId": 5,
      "effectLevel": 1,
      "value": 500,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【중】",
      "members": [
        {
          "unitId": 4,
          "form": 1,
          "name": "황소 고양이",
          "icon": "../img/u/4/0.png"
        },
        {
          "unitId": 95,
          "form": 1,
          "name": "광란의 황소 고양이",
          "icon": "../img/u/95/0.png"
        },
        {
          "unitId": 148,
          "form": 1,
          "name": "고양이 로커",
          "icon": "../img/u/148/0.png"
        }
      ]
    },
    {
      "id": 3005,
      "name": "곡예 고양이",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 17,
          "form": 3,
          "name": "고양이 외발자전거",
          "icon": "../img/u/17/2.png"
        },
        {
          "unitId": 154,
          "form": 2,
          "name": "고양이 트리플 훌라",
          "icon": "../img/u/154/1.png"
        }
      ]
    },
    {
      "id": 3006,
      "name": "스위트",
      "effectId": 7,
      "effectLevel": 1,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【중】",
      "members": [
        {
          "unitId": 15,
          "form": 3,
          "name": "고양이 캔디",
          "icon": "../img/u/15/2.png"
        },
        {
          "unitId": 20,
          "form": 3,
          "name": "고양이 파티쉐",
          "icon": "../img/u/20/2.png"
        },
        {
          "unitId": 176,
          "form": 1,
          "name": "마시멜로 냥코",
          "icon": "../img/u/176/0.png"
        }
      ]
    },
    {
      "id": 3007,
      "name": "뾰족뾰족",
      "effectId": 21,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 업」 효과 UP  【소】",
      "members": [
        {
          "unitId": 240,
          "form": 2,
          "name": "가시란파사란",
          "icon": "../img/u/240/1.png"
        },
        {
          "unitId": 7,
          "form": 3,
          "name": "고양이 킹드래곤",
          "icon": "../img/u/7/2.png"
        }
      ]
    },
    {
      "id": 3008,
      "name": "어제의 적은 오늘의 동지",
      "effectId": 3,
      "effectLevel": 1,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【중】",
      "members": [
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        },
        {
          "unitId": 172,
          "form": 1,
          "name": "꼬맹이 야옹마",
          "icon": "../img/u/172/0.png"
        },
        {
          "unitId": 268,
          "form": 1,
          "name": "고양이 냥미",
          "icon": "../img/u/268/0.png"
        }
      ]
    },
    {
      "id": 3009,
      "name": "펀치! 펀치! 펀치!",
      "effectId": 0,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【중】",
      "members": [
        {
          "unitId": 8,
          "form": 1,
          "name": "거신 고양이",
          "icon": "../img/u/8/0.png"
        },
        {
          "unitId": 99,
          "form": 1,
          "name": "광란의 거신 고양이",
          "icon": "../img/u/99/0.png"
        },
        {
          "unitId": 100,
          "form": 1,
          "name": "고양이 소녀",
          "icon": "../img/u/100/0.png"
        },
        {
          "unitId": 34,
          "form": 2,
          "name": "케사란파사란",
          "icon": "../img/u/34/1.png"
        }
      ]
    },
    {
      "id": 3010,
      "name": "전투광들의 모임",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 2,
          "form": 1,
          "name": "배틀 고양이",
          "icon": "../img/u/2/0.png"
        },
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        },
        {
          "unitId": 44,
          "form": 1,
          "name": "도깨비 야옹마",
          "icon": "../img/u/44/0.png"
        }
      ]
    },
    {
      "id": 3011,
      "name": "변태신사에게는 천벌을",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 80,
          "form": 2,
          "name": "고양이 신사",
          "icon": "../img/u/80/1.png"
        },
        {
          "unitId": 257,
          "form": 1,
          "name": "천공신 제우스",
          "icon": "../img/u/257/0.png"
        }
      ]
    },
    {
      "id": 3012,
      "name": "이인일조",
      "effectId": 1,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【중】",
      "members": [
        {
          "unitId": 152,
          "form": 1,
          "name": "고양이 스케이트",
          "icon": "../img/u/152/0.png"
        },
        {
          "unitId": 81,
          "form": 1,
          "name": "냥코 부부",
          "icon": "../img/u/81/0.png"
        },
        {
          "unitId": 123,
          "form": 1,
          "name": "콩콩 냥코",
          "icon": "../img/u/123/0.png"
        },
        {
          "unitId": 104,
          "form": 1,
          "name": "물 만난 물고기",
          "icon": "../img/u/104/0.png"
        },
        {
          "unitId": 88,
          "form": 2,
          "name": "고양고양 줄넘기",
          "icon": "../img/u/88/1.png"
        }
      ]
    },
    {
      "id": 3013,
      "name": "태풍경고",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 75,
          "form": 1,
          "name": "바람의 신・윈디",
          "icon": "../img/u/75/0.png"
        },
        {
          "unitId": 267,
          "form": 1,
          "name": "고양이 타이푼",
          "icon": "../img/u/267/0.png"
        }
      ]
    },
    {
      "id": 3014,
      "name": "바람의 장난",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 267,
          "form": 1,
          "name": "고양이 타이푼",
          "icon": "../img/u/267/0.png"
        },
        {
          "unitId": 23,
          "form": 1,
          "name": "고양이 스커트",
          "icon": "../img/u/23/0.png"
        }
      ]
    },
    {
      "id": 3015,
      "name": "대세는 IT",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 260,
          "form": 1,
          "name": "냥웨이",
          "icon": "../img/u/260/0.png"
        },
        {
          "unitId": 35,
          "form": 1,
          "name": "오덕 고양이",
          "icon": "../img/u/35/0.png"
        }
      ]
    },
    {
      "id": 3016,
      "name": "공중탐정 부대",
      "effectId": 11,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【중】",
      "members": [
        {
          "unitId": 5,
          "form": 1,
          "name": "고양이 새",
          "icon": "../img/u/5/0.png"
        },
        {
          "unitId": 96,
          "form": 1,
          "name": "광란의 고양이 새",
          "icon": "../img/u/96/0.png"
        },
        {
          "unitId": 18,
          "form": 3,
          "name": "날다람 고양이 닌자",
          "icon": "../img/u/18/2.png"
        },
        {
          "unitId": 260,
          "form": 2,
          "name": "고양이 드론",
          "icon": "../img/u/260/1.png"
        }
      ]
    },
    {
      "id": 3017,
      "name": "체포하겠어☆",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 212,
          "form": 1,
          "name": "화이트 래빗",
          "icon": "../img/u/212/0.png"
        },
        {
          "unitId": 79,
          "form": 3,
          "name": "냥코 죄수",
          "icon": "../img/u/79/2.png"
        }
      ]
    },
    {
      "id": 3018,
      "name": "냥코 서커스",
      "effectId": 5,
      "effectLevel": 1,
      "value": 500,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【중】",
      "members": [
        {
          "unitId": 4,
          "form": 3,
          "name": "고양이 라이온",
          "icon": "../img/u/4/2.png"
        },
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        },
        {
          "unitId": 226,
          "form": 1,
          "name": "주술사 데스삐에로",
          "icon": "../img/u/226/0.png"
        }
      ]
    },
    {
      "id": 3019,
      "name": "체크 스커트",
      "effectId": 11,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【소】",
      "members": [
        {
          "unitId": 23,
          "form": 1,
          "name": "고양이 스커트",
          "icon": "../img/u/23/0.png"
        },
        {
          "unitId": 159,
          "form": 2,
          "name": "명계의X칼리파",
          "icon": "../img/u/159/1.png"
        }
      ]
    },
    {
      "id": 9000,
      "name": "더블 데이트",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 152,
          "form": 1,
          "name": "고양이 스케이트",
          "icon": "../img/u/152/0.png"
        },
        {
          "unitId": 81,
          "form": 1,
          "name": "냥코 부부",
          "icon": "../img/u/81/0.png"
        }
      ]
    },
    {
      "id": 9001,
      "name": "게으름쟁이들",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 33,
          "form": 1,
          "name": "고타츠양이",
          "icon": "../img/u/33/0.png"
        },
        {
          "unitId": 79,
          "form": 1,
          "name": "냥코 성인",
          "icon": "../img/u/79/0.png"
        }
      ]
    },
    {
      "id": 9002,
      "name": "원~망~스럽다~냥~",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 128,
          "form": 1,
          "name": "처녀귀신 냥코",
          "icon": "../img/u/128/0.png"
        },
        {
          "unitId": 70,
          "form": 2,
          "name": "고양이 원혼",
          "icon": "../img/u/70/1.png"
        }
      ]
    },
    {
      "id": 9003,
      "name": "팬티 페스티벌",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 23,
          "form": 3,
          "name": "고양이 훈도시",
          "icon": "../img/u/23/2.png"
        },
        {
          "unitId": 51,
          "form": 2,
          "name": "고양이 어부",
          "icon": "../img/u/51/1.png"
        }
      ]
    },
    {
      "id": 9004,
      "name": "스튜디오 냥브리",
      "effectId": 6,
      "effectLevel": 1,
      "value": 50,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【중】",
      "members": [
        {
          "unitId": 5,
          "form": 3,
          "name": "천공의 고양이",
          "icon": "../img/u/5/2.png"
        },
        {
          "unitId": 8,
          "form": 2,
          "name": "고양이 다라보치",
          "icon": "../img/u/8/1.png"
        },
        {
          "unitId": 55,
          "form": 1,
          "name": "고양이 마녀",
          "icon": "../img/u/55/0.png"
        }
      ]
    },
    {
      "id": 9005,
      "name": "호박 바지",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 3,
          "form": 2,
          "name": "각선미 고양이",
          "icon": "../img/u/3/1.png"
        },
        {
          "unitId": 227,
          "form": 2,
          "name": "랜턴 냥프킨",
          "icon": "../img/u/227/1.png"
        }
      ]
    },
    {
      "id": 9006,
      "name": "백귀야행",
      "effectId": 4,
      "effectLevel": 1,
      "value": 2,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【중】",
      "members": [
        {
          "unitId": 38,
          "form": 1,
          "name": "고양이 차륜",
          "icon": "../img/u/38/0.png"
        },
        {
          "unitId": 128,
          "form": 1,
          "name": "처녀귀신 냥코",
          "icon": "../img/u/128/0.png"
        },
        {
          "unitId": 80,
          "form": 1,
          "name": "내가 도깨비라오",
          "icon": "../img/u/80/0.png"
        }
      ]
    },
    {
      "id": 9007,
      "name": "주정뱅이",
      "effectId": 6,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【소】",
      "members": [
        {
          "unitId": 79,
          "form": 1,
          "name": "냥코 성인",
          "icon": "../img/u/79/0.png"
        },
        {
          "unitId": 10,
          "form": 2,
          "name": "취권 냥코",
          "icon": "../img/u/10/1.png"
        }
      ]
    },
    {
      "id": 9008,
      "name": "쥬라기 시대",
      "effectId": 10,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "성 내구력 UP  【소】",
      "members": [
        {
          "unitId": 7,
          "form": 1,
          "name": "고양이 도마뱀",
          "icon": "../img/u/7/0.png"
        },
        {
          "unitId": 46,
          "form": 1,
          "name": "고양이 쥬라",
          "icon": "../img/u/46/0.png"
        }
      ]
    },
    {
      "id": 32,
      "name": "장난감!?!",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 147,
          "form": 1,
          "name": "양철 고양이",
          "icon": "../img/u/147/0.png"
        },
        {
          "unitId": 127,
          "form": 1,
          "name": "고양이 플라워",
          "icon": "../img/u/127/0.png"
        },
        {
          "unitId": 81,
          "form": 2,
          "name": "야징가 로보",
          "icon": "../img/u/81/1.png"
        }
      ]
    },
    {
      "id": 33,
      "name": "서민과 부유층",
      "effectId": 5,
      "effectLevel": 0,
      "value": 300,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【소】",
      "members": [
        {
          "unitId": 0,
          "form": 1,
          "name": "고양이",
          "icon": "../img/u/0/0.png"
        },
        {
          "unitId": 129,
          "form": 1,
          "name": "골드 고양이",
          "icon": "../img/u/129/0.png"
        }
      ]
    },
    {
      "id": 34,
      "name": "개천에서 난 용",
      "effectId": 7,
      "effectLevel": 1,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【중】",
      "members": [
        {
          "unitId": 104,
          "form": 1,
          "name": "물 만난 물고기",
          "icon": "../img/u/104/0.png"
        },
        {
          "unitId": 86,
          "form": 1,
          "name": "신룡 카무쿠라",
          "icon": "../img/u/86/0.png"
        }
      ]
    },
    {
      "id": 35,
      "name": "용사! 용을 물리쳐라!",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 2,
          "form": 2,
          "name": "용사 고양이",
          "icon": "../img/u/2/1.png"
        },
        {
          "unitId": 177,
          "form": 1,
          "name": "패룡 디오라무스",
          "icon": "../img/u/177/0.png"
        }
      ]
    },
    {
      "id": 1032,
      "name": "천지의 분노",
      "effectId": 20,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【소】",
      "members": [
        {
          "unitId": 5,
          "form": 3,
          "name": "천공의 고양이",
          "icon": "../img/u/5/2.png"
        },
        {
          "unitId": 83,
          "form": 1,
          "name": "지룡 소돔",
          "icon": "../img/u/83/0.png"
        }
      ]
    },
    {
      "id": 3020,
      "name": "메카메카",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 195,
          "form": 1,
          "name": "메카소녀 진",
          "icon": "../img/u/195/0.png"
        },
        {
          "unitId": 260,
          "form": 2,
          "name": "고양이 드론",
          "icon": "../img/u/260/1.png"
        }
      ]
    },
    {
      "id": 3021,
      "name": "W바주카",
      "effectId": 6,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【소】",
      "members": [
        {
          "unitId": 11,
          "form": 2,
          "name": "Super Mr.",
          "icon": "../img/u/11/1.png"
        },
        {
          "unitId": 268,
          "form": 1,
          "name": "고양이 냥미",
          "icon": "../img/u/268/0.png"
        }
      ]
    },
    {
      "id": 3022,
      "name": "라이벌 선언",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 268,
          "form": 1,
          "name": "고양이 냥미",
          "icon": "../img/u/268/0.png"
        },
        {
          "unitId": 24,
          "form": 1,
          "name": "고양이 발키리",
          "icon": "../img/u/24/0.png"
        }
      ]
    },
    {
      "id": 3023,
      "name": "위태천 트리오",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 71,
          "form": 3,
          "name": "비약의 무신・그리폰",
          "icon": "../img/u/71/2.png"
        },
        {
          "unitId": 25,
          "form": 3,
          "name": "각성의 고양이 무트",
          "icon": "../img/u/25/2.png"
        },
        {
          "unitId": 95,
          "form": 3,
          "name": "대광란의 고양이 라이온",
          "icon": "../img/u/95/2.png"
        }
      ]
    },
    {
      "id": 36,
      "name": "일동 발사",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 11,
          "form": 1,
          "name": "Mr.",
          "icon": "../img/u/11/0.png"
        },
        {
          "unitId": 87,
          "form": 1,
          "name": "용병기 라이덴",
          "icon": "../img/u/87/0.png"
        }
      ]
    },
    {
      "id": 37,
      "name": "강철의 구세주",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 81,
          "form": 2,
          "name": "야징가 로보",
          "icon": "../img/u/81/1.png"
        },
        {
          "unitId": 43,
          "form": 1,
          "name": "고양이 머신",
          "icon": "../img/u/43/0.png"
        }
      ]
    },
    {
      "id": 38,
      "name": "은하를 달리다",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 78,
          "form": 1,
          "name": "고양이와 우주",
          "icon": "../img/u/78/0.png"
        },
        {
          "unitId": 135,
          "form": 2,
          "name": "은하전사 코스모",
          "icon": "../img/u/135/1.png"
        }
      ]
    },
    {
      "id": 1033,
      "name": "번개를 맞아서",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 76,
          "form": 1,
          "name": "번개의 신・산디아",
          "icon": "../img/u/76/0.png"
        },
        {
          "unitId": 19,
          "form": 3,
          "name": "고양이 해골",
          "icon": "../img/u/19/2.png"
        }
      ]
    },
    {
      "id": 1034,
      "name": "목실종 스타일",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 8,
          "form": 3,
          "name": "고양이 쟈라미",
          "icon": "../img/u/8/2.png"
        },
        {
          "unitId": 171,
          "form": 2,
          "name": "바라란파사란",
          "icon": "../img/u/171/1.png"
        }
      ]
    },
    {
      "id": 1035,
      "name": "남국제도",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 134,
          "form": 2,
          "name": "용궁수 거북레온",
          "icon": "../img/u/134/1.png"
        },
        {
          "unitId": 6,
          "form": 3,
          "name": "고양이 섬",
          "icon": "../img/u/6/2.png"
        }
      ]
    },
    {
      "id": 2020,
      "name": "개귀신님",
      "effectId": 6,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【소】",
      "members": [
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        },
        {
          "unitId": 258,
          "form": 1,
          "name": "수호신 아누비스",
          "icon": "../img/u/258/0.png"
        }
      ]
    },
    {
      "id": 3024,
      "name": "풍림화산",
      "effectId": 3,
      "effectLevel": 1,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【중】",
      "members": [
        {
          "unitId": 125,
          "form": 1,
          "name": "아수라",
          "icon": "../img/u/125/0.png"
        },
        {
          "unitId": 97,
          "form": 3,
          "name": "대광란의 고양이 섬",
          "icon": "../img/u/97/2.png"
        }
      ]
    },
    {
      "id": 39,
      "name": "저주받은 힘",
      "effectId": 7,
      "effectLevel": 1,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【중】",
      "members": [
        {
          "unitId": 70,
          "form": 2,
          "name": "고양이 원혼",
          "icon": "../img/u/70/1.png"
        },
        {
          "unitId": 57,
          "form": 1,
          "name": "고양이 슈발리에",
          "icon": "../img/u/57/0.png"
        }
      ]
    },
    {
      "id": 40,
      "name": "스파이 활동",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 18,
          "form": 1,
          "name": "고양이 닌자",
          "icon": "../img/u/18/0.png"
        },
        {
          "unitId": 134,
          "form": 1,
          "name": "냥꼬북",
          "icon": "../img/u/134/0.png"
        }
      ]
    },
    {
      "id": 41,
      "name": "사랑으로 살아가는 자",
      "effectId": 6,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【소】",
      "members": [
        {
          "unitId": 100,
          "form": 1,
          "name": "고양이 소녀",
          "icon": "../img/u/100/0.png"
        },
        {
          "unitId": 259,
          "form": 1,
          "name": "미의 여신 아프로디테",
          "icon": "../img/u/259/0.png"
        }
      ]
    },
    {
      "id": 1036,
      "name": "견원지간",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        },
        {
          "unitId": 105,
          "form": 1,
          "name": "쿠우",
          "icon": "../img/u/105/0.png"
        }
      ]
    },
    {
      "id": 1037,
      "name": "하늘에의 동경",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 135,
          "form": 1,
          "name": "크레인 냥코",
          "icon": "../img/u/135/0.png"
        },
        {
          "unitId": 18,
          "form": 3,
          "name": "날다람 고양이 닌자",
          "icon": "../img/u/18/2.png"
        }
      ]
    },
    {
      "id": 1038,
      "name": "신에게 바치는 제물",
      "effectId": 10,
      "effectLevel": 1,
      "value": 50,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "성 내구력 UP  【중】",
      "members": [
        {
          "unitId": 271,
          "form": 1,
          "name": "태양신 아마테라스",
          "icon": "../img/u/271/0.png"
        },
        {
          "unitId": 74,
          "form": 2,
          "name": "고양이회 모듬",
          "icon": "../img/u/74/1.png"
        }
      ]
    },
    {
      "id": 2021,
      "name": "성스러운 힘",
      "effectId": 3,
      "effectLevel": 1,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【중】",
      "members": [
        {
          "unitId": 24,
          "form": 3,
          "name": "고양이 발키리・성",
          "icon": "../img/u/24/2.png"
        },
        {
          "unitId": 84,
          "form": 1,
          "name": "성룡 메기도라",
          "icon": "../img/u/84/0.png"
        }
      ]
    },
    {
      "id": 3025,
      "name": "암살자 콤비",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 212,
          "form": 2,
          "name": "블랙 캣",
          "icon": "../img/u/212/1.png"
        },
        {
          "unitId": 268,
          "form": 1,
          "name": "고양이 냥미",
          "icon": "../img/u/268/0.png"
        }
      ]
    },
    {
      "id": 42,
      "name": "김삿갓",
      "effectId": 3,
      "effectLevel": 1,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【중】",
      "members": [
        {
          "unitId": 282,
          "form": 1,
          "name": "냥코 오도리",
          "icon": "../img/u/282/0.png"
        },
        {
          "unitId": 137,
          "form": 1,
          "name": "석공 냥돌이",
          "icon": "../img/u/137/0.png"
        }
      ]
    },
    {
      "id": 1039,
      "name": "삼두근 자랑",
      "effectId": 1,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【중】",
      "members": [
        {
          "unitId": 8,
          "form": 1,
          "name": "거신 고양이",
          "icon": "../img/u/8/0.png"
        },
        {
          "unitId": 10,
          "form": 1,
          "name": "쿵후 냥코",
          "icon": "../img/u/10/0.png"
        },
        {
          "unitId": 9,
          "form": 3,
          "name": "고양이 마초",
          "icon": "../img/u/9/2.png"
        },
        {
          "unitId": 170,
          "form": 2,
          "name": "테사란파사란",
          "icon": "../img/u/170/1.png"
        }
      ]
    },
    {
      "id": 2022,
      "name": "빙빙 대회전",
      "effectId": 6,
      "effectLevel": 1,
      "value": 50,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【중】",
      "members": [
        {
          "unitId": 124,
          "form": 2,
          "name": "분노의 오딘",
          "icon": "../img/u/124/1.png"
        },
        {
          "unitId": 267,
          "form": 1,
          "name": "고양이 타이푼",
          "icon": "../img/u/267/0.png"
        },
        {
          "unitId": 88,
          "form": 1,
          "name": "고양이 줄넘기",
          "icon": "../img/u/88/0.png"
        }
      ]
    },
    {
      "id": 3026,
      "name": "대박번영기원",
      "effectId": 9,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【중】",
      "members": [
        {
          "unitId": 272,
          "form": 1,
          "name": "번영신 가네샤",
          "icon": "../img/u/272/0.png"
        },
        {
          "unitId": 260,
          "form": 1,
          "name": "냥웨이",
          "icon": "../img/u/260/0.png"
        }
      ]
    },
    {
      "id": 43,
      "name": "베스트 프렌드",
      "effectId": 22,
      "effectLevel": 3,
      "value": 400,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「마녀 킬러」 효과 UP  【궁극】",
      "members": [
        {
          "unitId": 299,
          "form": 1,
          "name": "꼬마 마도카",
          "icon": "../img/u/299/0.png"
        },
        {
          "unitId": 300,
          "form": 1,
          "name": "꼬마 호무라",
          "icon": "../img/u/300/0.png"
        }
      ]
    },
    {
      "id": 44,
      "name": "요식업",
      "effectId": 12,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【중】",
      "members": [
        {
          "unitId": 303,
          "form": 1,
          "name": "타코야끼냥",
          "icon": "../img/u/303/0.png"
        },
        {
          "unitId": 283,
          "form": 1,
          "name": "묘반권 파이파이",
          "icon": "../img/u/283/0.png"
        }
      ]
    },
    {
      "id": 3027,
      "name": "출장명령",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 70,
          "form": 1,
          "name": "고양리맨",
          "icon": "../img/u/70/0.png"
        },
        {
          "unitId": 284,
          "form": 1,
          "name": "냥코 우등",
          "icon": "../img/u/284/0.png"
        }
      ]
    },
    {
      "id": 3028,
      "name": "한여름의 야구장",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 201,
          "form": 2,
          "name": "플랜카드 냥코",
          "icon": "../img/u/201/1.png"
        },
        {
          "unitId": 287,
          "form": 1,
          "name": "고양이 야구",
          "icon": "../img/u/287/0.png"
        },
        {
          "unitId": 38,
          "form": 2,
          "name": "고양이 태양",
          "icon": "../img/u/38/1.png"
        }
      ]
    },
    {
      "id": 45,
      "name": "가드닝",
      "effectId": 5,
      "effectLevel": 0,
      "value": 300,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【소】",
      "members": [
        {
          "unitId": 308,
          "form": 1,
          "name": "고양이 가위",
          "icon": "../img/u/308/0.png"
        },
        {
          "unitId": 127,
          "form": 1,
          "name": "고양이 플라워",
          "icon": "../img/u/127/0.png"
        }
      ]
    },
    {
      "id": 46,
      "name": "명예의 부상",
      "effectId": 20,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【소】",
      "members": [
        {
          "unitId": 304,
          "form": 1,
          "name": "강철육군 카타바르스",
          "icon": "../img/u/304/0.png"
        },
        {
          "unitId": 79,
          "form": 2,
          "name": "냥코 환자",
          "icon": "../img/u/79/1.png"
        }
      ]
    },
    {
      "id": 47,
      "name": "물고기떼 발견!",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 305,
          "form": 2,
          "name": "무적함대 시갈레온",
          "icon": "../img/u/305/1.png"
        },
        {
          "unitId": 6,
          "form": 1,
          "name": "고양이 피쉬",
          "icon": "../img/u/6/0.png"
        },
        {
          "unitId": 311,
          "form": 1,
          "name": "꼬맹이 고양이 피쉬",
          "icon": "../img/u/311/0.png"
        }
      ]
    },
    {
      "id": 48,
      "name": "페달링",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 306,
          "form": 1,
          "name": "비행습격 바머스",
          "icon": "../img/u/306/0.png"
        },
        {
          "unitId": 17,
          "form": 1,
          "name": "고양이 세발자전거",
          "icon": "../img/u/17/0.png"
        }
      ]
    },
    {
      "id": 1040,
      "name": "전국대회출전",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 201,
          "form": 2,
          "name": "플랜카드 냥코",
          "icon": "../img/u/201/1.png"
        },
        {
          "unitId": 307,
          "form": 1,
          "name": "고양이 점퍼",
          "icon": "../img/u/307/0.png"
        }
      ]
    },
    {
      "id": 1041,
      "name": "남는건 사진뿐",
      "effectId": 3,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포의 초기 게이지 UP  【소】",
      "members": [
        {
          "unitId": 284,
          "form": 1,
          "name": "냥코 우등",
          "icon": "../img/u/284/0.png"
        },
        {
          "unitId": 149,
          "form": 3,
          "name": "카메라맨 고양이",
          "icon": "../img/u/149/2.png"
        }
      ]
    },
    {
      "id": 2023,
      "name": "브런치 러쉬",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 273,
          "form": 2,
          "name": "웨이트리스 냥코",
          "icon": "../img/u/273/1.png"
        },
        {
          "unitId": 153,
          "form": 1,
          "name": "고양이 토스터",
          "icon": "../img/u/153/0.png"
        }
      ]
    },
    {
      "id": 49,
      "name": "블랙 앤 화이트",
      "effectId": 9,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【소】",
      "members": [
        {
          "unitId": 319,
          "form": 1,
          "name": "살의의 고양이",
          "icon": "../img/u/319/0.png"
        },
        {
          "unitId": 0,
          "form": 1,
          "name": "고양이",
          "icon": "../img/u/0/0.png"
        }
      ]
    },
    {
      "id": 50,
      "name": "해저 보물 발굴 명령",
      "effectId": 4,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【소】",
      "members": [
        {
          "unitId": 316,
          "form": 1,
          "name": "해왕신 포세이돈",
          "icon": "../img/u/316/0.png"
        },
        {
          "unitId": 109,
          "form": 2,
          "name": "마담・더・킹",
          "icon": "../img/u/109/1.png"
        }
      ]
    },
    {
      "id": 2024,
      "name": "인공지능",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 286,
          "form": 1,
          "name": "광전기병 레이",
          "icon": "../img/u/286/0.png"
        },
        {
          "unitId": 260,
          "form": 2,
          "name": "고양이 드론",
          "icon": "../img/u/260/1.png"
        }
      ]
    },
    {
      "id": 2025,
      "name": "최강 격투기 결정전",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 325,
          "form": 1,
          "name": "고양이 복서",
          "icon": "../img/u/325/0.png"
        },
        {
          "unitId": 21,
          "form": 1,
          "name": "스모 고양이",
          "icon": "../img/u/21/0.png"
        },
        {
          "unitId": 10,
          "form": 1,
          "name": "쿵후 냥코",
          "icon": "../img/u/10/0.png"
        },
        {
          "unitId": 100,
          "form": 3,
          "name": "장미냥",
          "icon": "../img/u/100/2.png"
        }
      ]
    },
    {
      "id": 3029,
      "name": "빙상경기",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 152,
          "form": 1,
          "name": "고양이 스케이트",
          "icon": "../img/u/152/0.png"
        },
        {
          "unitId": 324,
          "form": 1,
          "name": "고양이 스톤",
          "icon": "../img/u/324/0.png"
        }
      ]
    },
    {
      "id": 3030,
      "name": "일도양단",
      "effectId": 6,
      "effectLevel": 1,
      "value": 50,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 공격력 UP  【중】",
      "members": [
        {
          "unitId": 323,
          "form": 1,
          "name": "무사시",
          "icon": "../img/u/323/0.png"
        },
        {
          "unitId": 125,
          "form": 1,
          "name": "아수라",
          "icon": "../img/u/125/0.png"
        }
      ]
    },
    {
      "id": 51,
      "name": "감사의 사례",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 342,
          "form": 1,
          "name": "은혜 갚는 고양이",
          "icon": "../img/u/342/0.png"
        }
      ]
    },
    {
      "id": 52,
      "name": "이번에야말로 너를 행복하게",
      "effectId": 23,
      "effectLevel": 3,
      "value": 400,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「사도 킬러」 효과 UP  【궁극】",
      "members": [
        {
          "unitId": 402,
          "form": 1,
          "name": "꼬맹이 신지",
          "icon": "../img/u/402/0.png"
        },
        {
          "unitId": 405,
          "form": 1,
          "name": "꼬맹이 카오루",
          "icon": "../img/u/405/0.png"
        }
      ]
    },
    {
      "id": 53,
      "name": "미라클 라이브!",
      "effectId": 24,
      "effectLevel": 1,
      "value": 2,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「크리티컬」 발동률 UP  【중】",
      "members": [
        {
          "unitId": 16,
          "form": 1,
          "name": "귀여미",
          "icon": "../img/u/16/0.png"
        },
        {
          "unitId": 418,
          "form": 1,
          "name": "광란의 귀여미",
          "icon": "../img/u/418/0.png"
        }
      ]
    },
    {
      "id": 54,
      "name": "구운 마시멜로",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 359,
          "form": 1,
          "name": "불의 정령 메라라",
          "icon": "../img/u/359/0.png"
        },
        {
          "unitId": 176,
          "form": 1,
          "name": "마시멜로 냥코",
          "icon": "../img/u/176/0.png"
        }
      ]
    },
    {
      "id": 55,
      "name": "장대같은 비가 좋아",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 360,
          "form": 1,
          "name": "물의 정령 마리",
          "icon": "../img/u/360/0.png"
        },
        {
          "unitId": 343,
          "form": 1,
          "name": "민달팽이 고양이",
          "icon": "../img/u/343/0.png"
        }
      ]
    },
    {
      "id": 1042,
      "name": "폭풍 때론 토네이도",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 361,
          "form": 1,
          "name": "바람의 정령 에어리",
          "icon": "../img/u/361/0.png"
        },
        {
          "unitId": 267,
          "form": 1,
          "name": "고양이 타이푼",
          "icon": "../img/u/267/0.png"
        }
      ]
    },
    {
      "id": 2026,
      "name": "위험! 고전압 배터리",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 401,
          "form": 1,
          "name": "번개의 정령 볼트",
          "icon": "../img/u/401/0.png"
        },
        {
          "unitId": 260,
          "form": 1,
          "name": "냥웨이",
          "icon": "../img/u/260/0.png"
        }
      ]
    },
    {
      "id": 56,
      "name": "완전 일심동체",
      "effectId": 7,
      "effectLevel": 1,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【중】",
      "members": [
        {
          "unitId": 351,
          "form": 1,
          "name": "시시루와 코마리",
          "icon": "../img/u/351/0.png"
        },
        {
          "unitId": 123,
          "form": 1,
          "name": "콩콩 냥코",
          "icon": "../img/u/123/0.png"
        }
      ]
    },
    {
      "id": 57,
      "name": "온천 달걀",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 417,
          "form": 1,
          "name": "온천천국 테르마이",
          "icon": "../img/u/417/0.png"
        },
        {
          "unitId": 329,
          "form": 1,
          "name": "고양이 에그",
          "icon": "../img/u/329/0.png"
        }
      ]
    },
    {
      "id": 58,
      "name": "바람을 의심",
      "effectId": 11,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【중】",
      "members": [
        {
          "unitId": 431,
          "form": 1,
          "name": "망자탐정 비그라",
          "icon": "../img/u/431/0.png"
        },
        {
          "unitId": 21,
          "form": 2,
          "name": "마담·더·스모",
          "icon": "../img/u/21/1.png"
        }
      ]
    },
    {
      "id": 2027,
      "name": "알바 동료",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 397,
          "form": 2,
          "name": "JK사쿠라",
          "icon": "../img/u/397/1.png"
        },
        {
          "unitId": 273,
          "form": 2,
          "name": "웨이트리스 냥코",
          "icon": "../img/u/273/1.png"
        }
      ]
    },
    {
      "id": 59,
      "name": "나는 고양이로소이다",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 338,
          "form": 1,
          "name": "누아다",
          "icon": "../img/u/338/0.png"
        },
        {
          "unitId": 81,
          "form": 1,
          "name": "냥코 부부",
          "icon": "../img/u/81/0.png"
        }
      ]
    },
    {
      "id": 60,
      "name": "신축성과 탄력",
      "effectId": 10,
      "effectLevel": 1,
      "value": 50,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "성 내구력 UP  【중】",
      "members": [
        {
          "unitId": 436,
          "form": 1,
          "name": "노비루가",
          "icon": "../img/u/436/0.png"
        },
        {
          "unitId": 176,
          "form": 2,
          "name": "징글마시멜로 냥코",
          "icon": "../img/u/176/1.png"
        }
      ]
    },
    {
      "id": 61,
      "name": "숫자의 위력",
      "effectId": 20,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【소】",
      "members": [
        {
          "unitId": 427,
          "form": 1,
          "name": "고양이 퀘스트",
          "icon": "../img/u/427/0.png"
        },
        {
          "unitId": 63,
          "form": 1,
          "name": "고양이 운동회",
          "icon": "../img/u/63/0.png"
        }
      ]
    },
    {
      "id": 1043,
      "name": "가벼운 코디",
      "effectId": 15,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【중】",
      "members": [
        {
          "unitId": 336,
          "form": 2,
          "name": "미라공주 레이카",
          "icon": "../img/u/336/1.png"
        },
        {
          "unitId": 23,
          "form": 1,
          "name": "고양이 스커트",
          "icon": "../img/u/23/0.png"
        },
        {
          "unitId": 15,
          "form": 1,
          "name": "고양이 팬티",
          "icon": "../img/u/15/0.png"
        }
      ]
    },
    {
      "id": 1044,
      "name": "악플러 전쟁",
      "effectId": 21,
      "effectLevel": 1,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 업」 효과 UP  【중】",
      "members": [
        {
          "unitId": 357,
          "form": 2,
          "name": "늑대공주 딜",
          "icon": "../img/u/357/1.png"
        },
        {
          "unitId": 70,
          "form": 3,
          "name": "고양이 분노",
          "icon": "../img/u/70/2.png"
        }
      ]
    },
    {
      "id": 62,
      "name": "종말세계",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 322,
          "form": 2,
          "name": "폭주 락밴드 몽키헤븐",
          "icon": "../img/u/322/1.png"
        },
        {
          "unitId": 17,
          "form": 2,
          "name": "고양이 와일드",
          "icon": "../img/u/17/1.png"
        },
        {
          "unitId": 14,
          "form": 2,
          "name": "고양이 갱단",
          "icon": "../img/u/14/1.png"
        }
      ]
    },
    {
      "id": 63,
      "name": "긴 소매 선수권",
      "effectId": 11,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【대】",
      "members": [
        {
          "unitId": 334,
          "form": 1,
          "name": "여우아가씨 하늘나리",
          "icon": "../img/u/334/0.png"
        },
        {
          "unitId": 128,
          "form": 1,
          "name": "처녀귀신 냥코",
          "icon": "../img/u/128/0.png"
        },
        {
          "unitId": 282,
          "form": 1,
          "name": "냥코 오도리",
          "icon": "../img/u/282/0.png"
        }
      ]
    },
    {
      "id": 64,
      "name": "한창 먹고 자랄 때",
      "effectId": 9,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【중】",
      "members": [
        {
          "unitId": 358,
          "form": 1,
          "name": "좀비아가씨 버베나",
          "icon": "../img/u/358/0.png"
        },
        {
          "unitId": 21,
          "form": 1,
          "name": "스모 고양이",
          "icon": "../img/u/21/0.png"
        }
      ]
    },
    {
      "id": 65,
      "name": "아버지와 아들",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 396,
          "form": 1,
          "name": "고룡 강글리온",
          "icon": "../img/u/396/0.png"
        },
        {
          "unitId": 312,
          "form": 2,
          "name": "꼬맹이 고양이 드래곤",
          "icon": "../img/u/312/1.png"
        }
      ]
    },
    {
      "id": 66,
      "name": "운명의 수레바퀴",
      "effectId": 7,
      "effectLevel": 1,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【중】",
      "members": [
        {
          "unitId": 439,
          "form": 1,
          "name": "시간의 신 크로노스",
          "icon": "../img/u/439/0.png"
        },
        {
          "unitId": 17,
          "form": 1,
          "name": "고양이 세발자전거",
          "icon": "../img/u/17/0.png"
        },
        {
          "unitId": 14,
          "form": 2,
          "name": "고양이 갱단",
          "icon": "../img/u/14/1.png"
        }
      ]
    },
    {
      "id": 67,
      "name": "인디펜던스 데이",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 355,
          "form": 2,
          "name": "시공기지 아마겟돈",
          "icon": "../img/u/355/1.png"
        },
        {
          "unitId": 5,
          "form": 2,
          "name": "고양이UFO",
          "icon": "../img/u/5/1.png"
        },
        {
          "unitId": 247,
          "form": 2,
          "name": "꼬맹이 고양이 UFO",
          "icon": "../img/u/247/1.png"
        }
      ]
    },
    {
      "id": 68,
      "name": "갓잡은 생선",
      "effectId": 16,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【대】",
      "members": [
        {
          "unitId": 335,
          "form": 1,
          "name": "인어아가씨 루리",
          "icon": "../img/u/335/0.png"
        },
        {
          "unitId": 6,
          "form": 1,
          "name": "고양이 피쉬",
          "icon": "../img/u/6/0.png"
        },
        {
          "unitId": 311,
          "form": 1,
          "name": "꼬맹이 고양이 피쉬",
          "icon": "../img/u/311/0.png"
        },
        {
          "unitId": 74,
          "form": 2,
          "name": "고양이회 모듬",
          "icon": "../img/u/74/1.png"
        }
      ]
    },
    {
      "id": 69,
      "name": "창과 방패",
      "effectId": 12,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【소】",
      "members": [
        {
          "unitId": 505,
          "form": 1,
          "name": "각룡 그라디오스",
          "icon": "../img/u/505/0.png"
        },
        {
          "unitId": 210,
          "form": 1,
          "name": "꼬맹이 탱크 고양이",
          "icon": "../img/u/210/0.png"
        }
      ]
    },
    {
      "id": 70,
      "name": "파트너",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 502,
          "form": 1,
          "name": "멜슈",
          "icon": "../img/u/502/0.png"
        },
        {
          "unitId": 74,
          "form": 1,
          "name": "순록피쉬",
          "icon": "../img/u/74/0.png"
        },
        {
          "unitId": 104,
          "form": 1,
          "name": "물 만난 물고기",
          "icon": "../img/u/104/0.png"
        }
      ]
    },
    {
      "id": 3031,
      "name": "악에 물든 자들",
      "effectId": 11,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【대】",
      "members": [
        {
          "unitId": 519,
          "form": 1,
          "name": "라스트 보스",
          "icon": "../img/u/519/0.png"
        },
        {
          "unitId": 172,
          "form": 1,
          "name": "꼬맹이 야옹마",
          "icon": "../img/u/172/0.png"
        },
        {
          "unitId": 319,
          "form": 1,
          "name": "살의의 고양이",
          "icon": "../img/u/319/0.png"
        }
      ]
    },
    {
      "id": 3032,
      "name": "고양이 귀는 진리",
      "effectId": 18,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 496,
          "form": 1,
          "name": "미네르바",
          "icon": "../img/u/496/0.png"
        },
        {
          "unitId": 268,
          "form": 1,
          "name": "고양이 냥미",
          "icon": "../img/u/268/0.png"
        },
        {
          "unitId": 16,
          "form": 1,
          "name": "귀여미",
          "icon": "../img/u/16/0.png"
        }
      ]
    },
    {
      "id": 71,
      "name": "先生になりたいでにゃ～る",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 542,
          "form": 1,
          "name": "ネコ少年",
          "icon": "../img/u/542/0.png"
        }
      ]
    },
    {
      "id": 72,
      "name": "빙글빙글",
      "effectId": 5,
      "effectLevel": 0,
      "value": 300,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【소】",
      "members": [
        {
          "unitId": 558,
          "form": 1,
          "name": "레어 뽑기 고양이",
          "icon": "../img/u/558/0.png"
        }
      ]
    },
    {
      "id": 73,
      "name": "도련님 도련님",
      "effectId": 5,
      "effectLevel": 1,
      "value": 500,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【중】",
      "members": [
        {
          "unitId": 238,
          "form": 3,
          "name": "고양이 도령의 파파의 파파",
          "icon": "../img/u/238/2.png"
        }
      ]
    },
    {
      "id": 74,
      "name": "둔갑술",
      "effectId": 24,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「크리티컬」 발동률 UP  【소】",
      "members": [
        {
          "unitId": 397,
          "form": 3,
          "name": "천주 사쿠라",
          "icon": "../img/u/397/2.png"
        }
      ]
    },
    {
      "id": 3033,
      "name": "내일은 맑음",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 287,
          "form": 3,
          "name": "고양이 골퍼",
          "icon": "../img/u/287/2.png"
        },
        {
          "unitId": 376,
          "form": 3,
          "name": "고양이 위성",
          "icon": "../img/u/376/2.png"
        }
      ]
    },
    {
      "id": 3034,
      "name": "술은 성인이 되고부터!",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 528,
          "form": 2,
          "name": "고양이 보드카",
          "icon": "../img/u/528/1.png"
        },
        {
          "unitId": 452,
          "form": 3,
          "name": "미래 고양이",
          "icon": "../img/u/452/2.png"
        }
      ]
    },
    {
      "id": 75,
      "name": "마녀재판",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 55,
          "form": 1,
          "name": "고양이 마녀",
          "icon": "../img/u/55/0.png"
        },
        {
          "unitId": 12,
          "form": 1,
          "name": "고양이 밧줄",
          "icon": "../img/u/12/0.png"
        }
      ]
    },
    {
      "id": 76,
      "name": "모닝 팬티",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 153,
          "form": 1,
          "name": "고양이 토스터",
          "icon": "../img/u/153/0.png"
        },
        {
          "unitId": 15,
          "form": 1,
          "name": "고양이 팬티",
          "icon": "../img/u/15/0.png"
        }
      ]
    },
    {
      "id": 77,
      "name": "대나무 장사",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 146,
          "form": 1,
          "name": "죽마 고양이",
          "icon": "../img/u/146/0.png"
        },
        {
          "unitId": 303,
          "form": 1,
          "name": "타코야끼냥",
          "icon": "../img/u/303/0.png"
        }
      ]
    },
    {
      "id": 1045,
      "name": "워케이션",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 40,
          "form": 1,
          "name": "고양이 욕조",
          "icon": "../img/u/40/0.png"
        },
        {
          "unitId": 14,
          "form": 3,
          "name": "중기 C・A・T",
          "icon": "../img/u/14/2.png"
        }
      ]
    },
    {
      "id": 78,
      "name": "드릴러래곤",
      "effectId": 20,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【소】",
      "members": [
        {
          "unitId": 443,
          "form": 2,
          "name": "전대 파워 드릴러",
          "icon": "../img/u/443/1.png"
        },
        {
          "unitId": 312,
          "form": 2,
          "name": "꼬맹이 고양이 드래곤",
          "icon": "../img/u/312/1.png"
        }
      ]
    },
    {
      "id": 79,
      "name": "드라이보치",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 444,
          "form": 2,
          "name": "전대 파워 드라이버",
          "icon": "../img/u/444/1.png"
        },
        {
          "unitId": 313,
          "form": 2,
          "name": "꼬맹이 고양이 다라보치",
          "icon": "../img/u/313/1.png"
        }
      ]
    },
    {
      "id": 80,
      "name": "커터용사",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 445,
          "form": 2,
          "name": "전대 파워 커터 고양이",
          "icon": "../img/u/445/1.png"
        },
        {
          "unitId": 211,
          "form": 2,
          "name": "꼬맹이 용사 고양이",
          "icon": "../img/u/211/1.png"
        }
      ]
    },
    {
      "id": 81,
      "name": "포코래인",
      "effectId": 24,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「크리티컬」 발동률 UP  【소】",
      "members": [
        {
          "unitId": 446,
          "form": 2,
          "name": "전대 파워 포클레인 고양이",
          "icon": "../img/u/446/1.png"
        },
        {
          "unitId": 311,
          "form": 2,
          "name": "꼬맹이 고양이 고래",
          "icon": "../img/u/311/1.png"
        }
      ]
    },
    {
      "id": 82,
      "name": "직썬미",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 447,
          "form": 2,
          "name": "전대 파워 직쏘고양이",
          "icon": "../img/u/447/1.png"
        },
        {
          "unitId": 245,
          "form": 2,
          "name": "꼬맹이 각선미 고양이",
          "icon": "../img/u/245/1.png"
        }
      ]
    },
    {
      "id": 83,
      "name": "미니 사우루스",
      "effectId": 11,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【소】",
      "members": [
        {
          "unitId": 209,
          "form": 2,
          "name": "꼬맹이 고양이 빌더",
          "icon": "../img/u/209/1.png"
        },
        {
          "unitId": 46,
          "form": 2,
          "name": "고양이 쥬라싯터",
          "icon": "../img/u/46/1.png"
        }
      ]
    },
    {
      "id": 84,
      "name": "리틀 군단",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 210,
          "form": 2,
          "name": "꼬맹이 고양이 벽",
          "icon": "../img/u/210/1.png"
        },
        {
          "unitId": 149,
          "form": 2,
          "name": "솔져 고양이",
          "icon": "../img/u/149/1.png"
        }
      ]
    },
    {
      "id": 85,
      "name": "미크로 파이터",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 211,
          "form": 2,
          "name": "꼬맹이 용사 고양이",
          "icon": "../img/u/211/1.png"
        },
        {
          "unitId": 47,
          "form": 2,
          "name": "메간톤 파이터",
          "icon": "../img/u/47/1.png"
        }
      ]
    },
    {
      "id": 86,
      "name": "미니 살롱",
      "effectId": 17,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 245,
          "form": 2,
          "name": "꼬맹이 각선미 고양이",
          "icon": "../img/u/245/1.png"
        },
        {
          "unitId": 38,
          "form": 2,
          "name": "고양이 태양",
          "icon": "../img/u/38/1.png"
        }
      ]
    },
    {
      "id": 87,
      "name": "희귀종 헌터",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 246,
          "form": 2,
          "name": "꼬맹이 고양이 기린",
          "icon": "../img/u/246/1.png"
        },
        {
          "unitId": 49,
          "form": 2,
          "name": "괴도 야콘",
          "icon": "../img/u/49/1.png"
        }
      ]
    },
    {
      "id": 88,
      "name": "미스테리 동아리",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 247,
          "form": 2,
          "name": "꼬맹이 고양이 UFO",
          "icon": "../img/u/247/1.png"
        },
        {
          "unitId": 308,
          "form": 2,
          "name": "고양이 톱",
          "icon": "../img/u/308/1.png"
        }
      ]
    },
    {
      "id": 89,
      "name": "우습게 보지 말라냥!",
      "effectId": 4,
      "effectLevel": 1,
      "value": 2,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【중】",
      "members": [
        {
          "unitId": 624,
          "form": 1,
          "name": "열혈경파 쿠니오군",
          "icon": "../img/u/624/0.png"
        }
      ]
    },
    {
      "id": 90,
      "name": "３連単",
      "effectId": 2,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【중】",
      "members": [
        {
          "unitId": 626,
          "form": 1,
          "name": "ネコキリンモドキ",
          "icon": "../img/u/626/0.png"
        },
        {
          "unitId": 627,
          "form": 1,
          "name": "ネコノトリッキー",
          "icon": "../img/u/627/0.png"
        },
        {
          "unitId": 628,
          "form": 1,
          "name": "ネコノドラゴーン",
          "icon": "../img/u/628/0.png"
        }
      ]
    },
    {
      "id": 91,
      "name": "춤추는 생선",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 311,
          "form": 2,
          "name": "꼬맹이 고양이 고래",
          "icon": "../img/u/311/1.png"
        },
        {
          "unitId": 495,
          "form": 2,
          "name": "고양이 플라멩코",
          "icon": "../img/u/495/1.png"
        }
      ]
    },
    {
      "id": 92,
      "name": "원조 미니 전사",
      "effectId": 0,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【소】",
      "members": [
        {
          "unitId": 312,
          "form": 2,
          "name": "꼬맹이 고양이 드래곤",
          "icon": "../img/u/312/1.png"
        },
        {
          "unitId": 37,
          "form": 2,
          "name": "고양이 마사이",
          "icon": "../img/u/37/1.png"
        }
      ]
    },
    {
      "id": 93,
      "name": "미니멈 에투알",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 313,
          "form": 2,
          "name": "꼬맹이 고양이 다라보치",
          "icon": "../img/u/313/1.png"
        },
        {
          "unitId": 41,
          "form": 2,
          "name": "고양이 젠느",
          "icon": "../img/u/41/1.png"
        }
      ]
    },
    {
      "id": 94,
      "name": "제물",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 617,
          "form": 1,
          "name": "소환소년 사토루",
          "icon": "../img/u/617/0.png"
        },
        {
          "unitId": 12,
          "form": 1,
          "name": "고양이 밧줄",
          "icon": "../img/u/12/0.png"
        }
      ]
    },
    {
      "id": 3035,
      "name": "정의의 전사",
      "effectId": 7,
      "effectLevel": 2,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【대】",
      "members": [
        {
          "unitId": 525,
          "form": 2,
          "name": "맹총전대 긴레인저",
          "icon": "../img/u/525/1.png"
        },
        {
          "unitId": 78,
          "form": 3,
          "name": "우주전사 고양이",
          "icon": "../img/u/78/2.png"
        },
        {
          "unitId": 2,
          "form": 2,
          "name": "용사 고양이",
          "icon": "../img/u/2/1.png"
        }
      ]
    },
    {
      "id": 95,
      "name": "지옥행 급행열차",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 534,
          "form": 2,
          "name": "데스 하데스",
          "icon": "../img/u/534/1.png"
        },
        {
          "unitId": 13,
          "form": 2,
          "name": "처형인",
          "icon": "../img/u/13/1.png"
        }
      ]
    },
    {
      "id": 1046,
      "name": "컬링 스톤즈",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 569,
          "form": 1,
          "name": "돌의 정령 롤링스톤",
          "icon": "../img/u/569/0.png"
        },
        {
          "unitId": 324,
          "form": 1,
          "name": "고양이 스톤",
          "icon": "../img/u/324/0.png"
        }
      ]
    },
    {
      "id": 96,
      "name": "주식회사 냥코택배",
      "effectId": 4,
      "effectLevel": 1,
      "value": 2,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【중】",
      "members": [
        {
          "unitId": 594,
          "form": 1,
          "name": "공중상사 콜럼버스",
          "icon": "../img/u/594/0.png"
        },
        {
          "unitId": 658,
          "form": 3,
          "name": "배달 고양이",
          "icon": "../img/u/658/2.png"
        }
      ]
    },
    {
      "id": 1047,
      "name": "꿈의 상자",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 607,
          "form": 1,
          "name": "모험가 칸나",
          "icon": "../img/u/607/0.png"
        },
        {
          "unitId": 14,
          "form": 3,
          "name": "중기 C・A・T",
          "icon": "../img/u/14/2.png"
        }
      ]
    },
    {
      "id": 3036,
      "name": "육공군 합동작전",
      "effectId": 0,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【중】",
      "members": [
        {
          "unitId": 632,
          "form": 3,
          "name": "초전자전기 디아 볼로스",
          "icon": "../img/u/632/2.png"
        },
        {
          "unitId": 96,
          "form": 3,
          "name": "대광란의 천공의 고양이",
          "icon": "../img/u/96/2.png"
        }
      ]
    },
    {
      "id": 97,
      "name": "금단의 조합",
      "effectId": 7,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【소】",
      "members": [
        {
          "unitId": 619,
          "form": 3,
          "name": "와이즈 리린π",
          "icon": "../img/u/619/2.png"
        }
      ]
    },
    {
      "id": 3037,
      "name": "광전사들",
      "effectId": 12,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【대】",
      "members": [
        {
          "unitId": 618,
          "form": 3,
          "name": "원망의 마신 아레스",
          "icon": "../img/u/618/2.png"
        },
        {
          "unitId": 323,
          "form": 3,
          "name": "각성의 주연 무사시",
          "icon": "../img/u/323/2.png"
        },
        {
          "unitId": 99,
          "form": 3,
          "name": "대광란의 고양이 쟈라미",
          "icon": "../img/u/99/2.png"
        }
      ]
    },
    {
      "id": 3038,
      "name": "가시돋친 천사",
      "effectId": 14,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「엄청 강하다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 642,
          "form": 3,
          "name": "G그랜드 루시퍼",
          "icon": "../img/u/642/2.png"
        },
        {
          "unitId": 669,
          "form": 3,
          "name": "고양이 선인장",
          "icon": "../img/u/669/2.png"
        }
      ]
    },
    {
      "id": 3039,
      "name": "바캉스 증후군",
      "effectId": 16,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 631,
          "form": 3,
          "name": "암흑의 정령왕 야미슈발츠",
          "icon": "../img/u/631/2.png"
        },
        {
          "unitId": 442,
          "form": 3,
          "name": "바캉스 고양이",
          "icon": "../img/u/442/2.png"
        }
      ]
    },
    {
      "id": 3040,
      "name": "엘로힘 엣사임",
      "effectId": 18,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【대】",
      "members": [
        {
          "unitId": 617,
          "form": 3,
          "name": "데빌 헌터 사토루",
          "icon": "../img/u/617/2.png"
        },
        {
          "unitId": 93,
          "form": 3,
          "name": "대광란의 암흑 고양이",
          "icon": "../img/u/93/2.png"
        },
        {
          "unitId": 8,
          "form": 3,
          "name": "고양이 쟈라미",
          "icon": "../img/u/8/2.png"
        },
        {
          "unitId": 247,
          "form": 3,
          "name": "꼬맹이 천공의 고양이",
          "icon": "../img/u/247/2.png"
        }
      ]
    },
    {
      "id": 3041,
      "name": "사룡흑염파",
      "effectId": 1,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【중】",
      "members": [
        {
          "unitId": 620,
          "form": 3,
          "name": "사룡황제 헤비저크",
          "icon": "../img/u/620/2.png"
        },
        {
          "unitId": 663,
          "form": 3,
          "name": "고양이 방독면",
          "icon": "../img/u/663/2.png"
        },
        {
          "unitId": 319,
          "form": 3,
          "name": "개심의 고양이",
          "icon": "../img/u/319/2.png"
        }
      ]
    },
    {
      "id": 3042,
      "name": "요괴 바스터즈!",
      "effectId": 11,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【소】",
      "members": [
        {
          "unitId": 633,
          "form": 3,
          "name": "대요괴 결사 짹짹",
          "icon": "../img/u/633/2.png"
        }
      ]
    },
    {
      "id": 3043,
      "name": "고결한 기사도",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 634,
          "form": 3,
          "name": "신마기사 키클롭스",
          "icon": "../img/u/634/2.png"
        }
      ]
    },
    {
      "id": 3044,
      "name": "분노 조절",
      "effectId": 4,
      "effectLevel": 1,
      "value": 2,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이의 초기 레벨 UP  【중】",
      "members": [
        {
          "unitId": 625,
          "form": 3,
          "name": "극대노 파사란",
          "icon": "../img/u/625/2.png"
        },
        {
          "unitId": 621,
          "form": 3,
          "name": "냥코 연구가",
          "icon": "../img/u/621/2.png"
        }
      ]
    },
    {
      "id": 98,
      "name": "덤벼라냥!",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 721,
          "form": 1,
          "name": "화원고교 번장 리키",
          "icon": "../img/u/721/0.png"
        }
      ]
    },
    {
      "id": 3045,
      "name": "Go to Hell!",
      "effectId": 20,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 다운」 효과 UP  【대】",
      "members": [
        {
          "unitId": 559,
          "form": 3,
          "name": "염라 대장 엠마",
          "icon": "../img/u/559/2.png"
        },
        {
          "unitId": 227,
          "form": 3,
          "name": "사신 냥프킨",
          "icon": "../img/u/227/2.png"
        },
        {
          "unitId": 268,
          "form": 3,
          "name": "각성의 러블리 냥미",
          "icon": "../img/u/268/2.png"
        }
      ]
    },
    {
      "id": 2028,
      "name": "사냥 친구",
      "effectId": 18,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 647,
          "form": 1,
          "name": "테룬",
          "icon": "../img/u/647/0.png"
        },
        {
          "unitId": 130,
          "form": 1,
          "name": "울프와 우루룬",
          "icon": "../img/u/130/0.png"
        }
      ]
    },
    {
      "id": 3046,
      "name": "연막 은신술",
      "effectId": 19,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 649,
          "form": 2,
          "name": "분노의 흑표",
          "icon": "../img/u/649/1.png"
        },
        {
          "unitId": 18,
          "form": 3,
          "name": "날다람 고양이 닌자",
          "icon": "../img/u/18/2.png"
        },
        {
          "unitId": 545,
          "form": 2,
          "name": "연기 고양이",
          "icon": "../img/u/545/1.png"
        }
      ]
    },
    {
      "id": 99,
      "name": "냥코 학교 교가 제창",
      "effectId": 11,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【대】",
      "members": [
        {
          "unitId": 650,
          "form": 1,
          "name": "소꿉친구 냥코",
          "icon": "../img/u/650/0.png"
        },
        {
          "unitId": 651,
          "form": 1,
          "name": "말괄량이 고양이 라이온",
          "icon": "../img/u/651/0.png"
        },
        {
          "unitId": 652,
          "form": 1,
          "name": "고양이 칠판지우개",
          "icon": "../img/u/652/0.png"
        },
        {
          "unitId": 696,
          "form": 1,
          "name": "고양이 반장",
          "icon": "../img/u/696/0.png"
        },
        {
          "unitId": 735,
          "form": 1,
          "name": "고양이 교장",
          "icon": "../img/u/735/0.png"
        }
      ]
    },
    {
      "id": 3047,
      "name": "렛잇고",
      "effectId": 12,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "회계력 UP  【중】",
      "members": [
        {
          "unitId": 655,
          "form": 2,
          "name": "빙결의 정령 블리자나",
          "icon": "../img/u/655/1.png"
        },
        {
          "unitId": 382,
          "form": 3,
          "name": "크리스탈 고양이 빌더",
          "icon": "../img/u/382/2.png"
        }
      ]
    },
    {
      "id": 3048,
      "name": "해룡관",
      "effectId": 2,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【중】",
      "members": [
        {
          "unitId": 660,
          "form": 1,
          "name": "해룡 다라이어던",
          "icon": "../img/u/660/0.png"
        },
        {
          "unitId": 311,
          "form": 1,
          "name": "꼬맹이 고양이 피쉬",
          "icon": "../img/u/311/0.png"
        }
      ]
    },
    {
      "id": 3049,
      "name": "강풍림",
      "effectId": 17,
      "effectLevel": 2,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【대】",
      "members": [
        {
          "unitId": 668,
          "form": 2,
          "name": "대요괴 고양이 텐구",
          "icon": "../img/u/668/1.png"
        },
        {
          "unitId": 24,
          "form": 2,
          "name": "고양이 발키리·진",
          "icon": "../img/u/24/1.png"
        },
        {
          "unitId": 659,
          "form": 3,
          "name": "고양이 타장",
          "icon": "../img/u/659/2.png"
        }
      ]
    },
    {
      "id": 3050,
      "name": "무중력 체험 투어",
      "effectId": 7,
      "effectLevel": 2,
      "value": 40,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【대】",
      "members": [
        {
          "unitId": 674,
          "form": 2,
          "name": "기습괴광 유에포즈",
          "icon": "../img/u/674/1.png"
        },
        {
          "unitId": 247,
          "form": 2,
          "name": "꼬맹이 고양이 UFO",
          "icon": "../img/u/247/1.png"
        },
        {
          "unitId": 260,
          "form": 2,
          "name": "고양이 드론",
          "icon": "../img/u/260/1.png"
        }
      ]
    },
    {
      "id": 3051,
      "name": "#극비임무",
      "effectId": 24,
      "effectLevel": 0,
      "value": 1,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「크리티컬」 발동률 UP  【소】",
      "members": [
        {
          "unitId": 397,
          "form": 4,
          "name": "천주Z 사쿠라",
          "icon": "../img/u/397/3.png"
        }
      ]
    },
    {
      "id": 3052,
      "name": "어둠을 품은 계약자",
      "effectId": 5,
      "effectLevel": 2,
      "value": 1000,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【대】",
      "members": [
        {
          "unitId": 682,
          "form": 2,
          "name": "환영의 가호여신 베가",
          "icon": "../img/u/682/1.png"
        },
        {
          "unitId": 13,
          "form": 3,
          "name": "다크 라이더",
          "icon": "../img/u/13/2.png"
        },
        {
          "unitId": 211,
          "form": 3,
          "name": "꼬맹이 암흑 고양이",
          "icon": "../img/u/211/2.png"
        },
        {
          "unitId": 531,
          "form": 2,
          "name": "네코 블랙쿠마",
          "icon": "../img/u/531/1.png"
        }
      ]
    },
    {
      "id": 3053,
      "name": "작은 냥코가 맵다",
      "effectId": 15,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【중】",
      "members": [
        {
          "unitId": 692,
          "form": 1,
          "name": "엄지 동자",
          "icon": "../img/u/692/0.png"
        },
        {
          "unitId": 209,
          "form": 1,
          "name": "꼬맹이 고양이",
          "icon": "../img/u/209/0.png"
        },
        {
          "unitId": 313,
          "form": 1,
          "name": "꼬맹이 거신 고양이",
          "icon": "../img/u/313/0.png"
        }
      ]
    },
    {
      "id": 3054,
      "name": "썬더 힐 드롭",
      "effectId": 1,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 체력 UP  【소】",
      "members": [
        {
          "unitId": 698,
          "form": 1,
          "name": "썬더 잭",
          "icon": "../img/u/698/0.png"
        },
        {
          "unitId": 245,
          "form": 3,
          "name": "꼬맹이 불끈다리 고양이",
          "icon": "../img/u/245/2.png"
        }
      ]
    },
    {
      "id": 3055,
      "name": "한숨",
      "effectId": 11,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "연구력 UP  【중】",
      "members": [
        {
          "unitId": 712,
          "form": 2,
          "name": "카오란파사란",
          "icon": "../img/u/712/1.png"
        },
        {
          "unitId": 98,
          "form": 2,
          "name": "광란의 고양이 드래곤",
          "icon": "../img/u/98/1.png"
        }
      ]
    },
    {
      "id": 100,
      "name": "パッカーン",
      "effectId": 9,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "일 고양이 지갑 UP  【중】",
      "members": [
        {
          "unitId": 784,
          "form": 1,
          "name": "チョコサプネコC",
          "icon": "../img/u/784/0.png"
        }
      ]
    },
    {
      "id": 3056,
      "name": "특별교통안전교육",
      "effectId": 16,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 715,
          "form": 1,
          "name": "건설병단 스핑크스",
          "icon": "../img/u/715/0.png"
        },
        {
          "unitId": 14,
          "form": 2,
          "name": "고양이 갱단",
          "icon": "../img/u/14/1.png"
        },
        {
          "unitId": 17,
          "form": 2,
          "name": "고양이 와일드",
          "icon": "../img/u/17/1.png"
        }
      ]
    },
    {
      "id": 3057,
      "name": "메탈 테니스",
      "effectId": 2,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【중】",
      "members": [
        {
          "unitId": 719,
          "form": 1,
          "name": "철의 정령 메탈릭",
          "icon": "../img/u/719/0.png"
        },
        {
          "unitId": 675,
          "form": 3,
          "name": "고양이 스매시",
          "icon": "../img/u/675/2.png"
        }
      ]
    },
    {
      "id": 3058,
      "name": "전장과 장송",
      "effectId": 21,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 업」 효과 UP  【소】",
      "members": [
        {
          "unitId": 723,
          "form": 1,
          "name": "광익신 이시스",
          "icon": "../img/u/723/0.png"
        },
        {
          "unitId": 24,
          "form": 3,
          "name": "고양이 발키리・성",
          "icon": "../img/u/24/2.png"
        }
      ]
    },
    {
      "id": 3059,
      "name": "숨길 수 없는 식욕",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 725,
          "form": 2,
          "name": "식도락 닌자 토모에",
          "icon": "../img/u/725/1.png"
        }
      ]
    },
    {
      "id": 3060,
      "name": "해후의 전사",
      "effectId": 5,
      "effectLevel": 1,
      "value": 500,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【중】",
      "members": [
        {
          "unitId": 733,
          "form": 1,
          "name": "페가사",
          "icon": "../img/u/733/0.png"
        },
        {
          "unitId": 78,
          "form": 2,
          "name": "냐앙소령",
          "icon": "../img/u/78/1.png"
        }
      ]
    },
    {
      "id": 3061,
      "name": "총포화약법",
      "effectId": 17,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「날려버린다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 754,
          "form": 1,
          "name": "알리칸토",
          "icon": "../img/u/754/0.png"
        },
        {
          "unitId": 11,
          "form": 1,
          "name": "Mr.",
          "icon": "../img/u/11/0.png"
        }
      ]
    },
    {
      "id": 101,
      "name": "레드 파워",
      "effectId": 25,
      "effectLevel": 5,
      "value": 2500,
      "groupId": 10,
      "eligibleUnitIds": [
        831,
        832,
        833,
        834,
        835,
        836,
        857,
        858
      ],
      "restriction": "냥코 레인저 한정",
      "effect": "「괴인 특효」 효과  부여",
      "members": [
        {
          "unitId": 831,
          "form": 1,
          "name": "스카프 냥코",
          "icon": "../img/u/831/0.png"
        }
      ]
    },
    {
      "id": 102,
      "name": "블루 파워",
      "effectId": 11,
      "effectLevel": 3,
      "value": 50,
      "groupId": 10,
      "eligibleUnitIds": [
        831,
        832,
        833,
        834,
        835,
        836,
        857,
        858
      ],
      "restriction": "냥코 레인저 한정",
      "effect": "연구력 UP  【궁극】",
      "members": [
        {
          "unitId": 832,
          "form": 1,
          "name": "페도라 냥코",
          "icon": "../img/u/832/0.png"
        }
      ]
    },
    {
      "id": 103,
      "name": "옐로 파워",
      "effectId": 26,
      "effectLevel": 5,
      "value": 1,
      "groupId": 10,
      "eligibleUnitIds": [
        831,
        832,
        833,
        834,
        835,
        836,
        857,
        858
      ],
      "restriction": "냥코 레인저 한정",
      "effect": "「파동 데미지 무효」 효과  부여",
      "members": [
        {
          "unitId": 833,
          "form": 1,
          "name": "헬멧 냥코",
          "icon": "../img/u/833/0.png"
        }
      ]
    },
    {
      "id": 104,
      "name": "그린 파워",
      "effectId": 27,
      "effectLevel": 3,
      "value": 20,
      "groupId": 10,
      "eligibleUnitIds": [
        831,
        832,
        833,
        834,
        835,
        836,
        857,
        858
      ],
      "restriction": "냥코 레인저 한정",
      "effect": "생산 코스트 할인  【궁극】",
      "members": [
        {
          "unitId": 834,
          "form": 1,
          "name": "고글 냥코",
          "icon": "../img/u/834/0.png"
        }
      ]
    },
    {
      "id": 105,
      "name": "핑크 파워",
      "effectId": 2,
      "effectLevel": 3,
      "value": 30,
      "groupId": 10,
      "eligibleUnitIds": [
        831,
        832,
        833,
        834,
        835,
        836,
        857,
        858
      ],
      "restriction": "냥코 레인저 한정",
      "effect": "캐릭터의 이동 속도 UP  【궁극】",
      "members": [
        {
          "unitId": 835,
          "form": 1,
          "name": "리본 냥코",
          "icon": "../img/u/835/0.png"
        }
      ]
    },
    {
      "id": 3062,
      "name": "왕국 붕괴",
      "effectId": 0,
      "effectLevel": 1,
      "value": 15,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 공격력 UP  【중】",
      "members": [
        {
          "unitId": 760,
          "form": 1,
          "name": "포룡 건듀로스",
          "icon": "../img/u/760/0.png"
        },
        {
          "unitId": 109,
          "form": 2,
          "name": "마담・더・킹",
          "icon": "../img/u/109/1.png"
        },
        {
          "unitId": 20,
          "form": 2,
          "name": "고양이 나이트",
          "icon": "../img/u/20/1.png"
        }
      ]
    },
    {
      "id": 106,
      "name": "キンギンパワー",
      "effectId": 28,
      "effectLevel": 5,
      "value": 1,
      "groupId": 10,
      "eligibleUnitIds": [
        831,
        832,
        833,
        834,
        835,
        836,
        857,
        858
      ],
      "restriction": "냥코 레인저 한정",
      "effect": "「열파 데미지 무효」 효과  부여",
      "members": [
        {
          "unitId": 857,
          "form": 1,
          "name": "バリスタにゃんこ",
          "icon": "../img/u/857/0.png"
        },
        {
          "unitId": 858,
          "form": 1,
          "name": "司令官にゃんこ",
          "icon": "../img/u/858/0.png"
        }
      ]
    },
    {
      "id": 3063,
      "name": "폐쇄된 마을",
      "effectId": 16,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 769,
          "form": 2,
          "name": "폭식괴수 빅트리",
          "icon": "../img/u/769/1.png"
        },
        {
          "unitId": 531,
          "form": 3,
          "name": "네코 프랑켄슈타인 베어",
          "icon": "../img/u/531/2.png"
        },
        {
          "unitId": 697,
          "form": 3,
          "name": "고양이 촌장",
          "icon": "../img/u/697/2.png"
        }
      ]
    },
    {
      "id": 3064,
      "name": "밀림의 외침",
      "effectId": 15,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「초 데미지」 효과 UP  【소】",
      "members": [
        {
          "unitId": 763,
          "form": 1,
          "name": "고양이 다이너사우루스",
          "icon": "../img/u/763/0.png"
        },
        {
          "unitId": 659,
          "form": 3,
          "name": "고양이 타장",
          "icon": "../img/u/659/2.png"
        }
      ]
    },
    {
      "id": 3065,
      "name": "교통안전 특별주간",
      "effectId": 18,
      "effectLevel": 1,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「느리게 한다」 효과 UP  【중】",
      "members": [
        {
          "unitId": 774,
          "form": 1,
          "name": "특수기동대 엑셀",
          "icon": "../img/u/774/0.png"
        },
        {
          "unitId": 17,
          "form": 2,
          "name": "고양이 와일드",
          "icon": "../img/u/17/1.png"
        }
      ]
    },
    {
      "id": 107,
      "name": "PAC-MAN 피버",
      "effectId": 16,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「맷집이 좋다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 866,
          "form": 1,
          "name": "PAC-MAN",
          "icon": "../img/u/866/0.png"
        }
      ]
    },
    {
      "id": 108,
      "name": "잘 왔다냥!",
      "effectId": 2,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "캐릭터의 이동 속도 UP  【소】",
      "members": [
        {
          "unitId": 874,
          "form": 1,
          "name": "류이치",
          "icon": "../img/u/874/0.png"
        }
      ]
    },
    {
      "id": 109,
      "name": "살려 보내지 않겠다냥!",
      "effectId": 5,
      "effectLevel": 0,
      "value": 300,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "초기 소지금 UP  【소】",
      "members": [
        {
          "unitId": 874,
          "form": 2,
          "name": "류이치 & 류지",
          "icon": "../img/u/874/1.png"
        }
      ]
    },
    {
      "id": 3066,
      "name": "요지부동",
      "effectId": 7,
      "effectLevel": 1,
      "value": 30,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "냥코 대포 충전 속도 UP  【중】",
      "members": [
        {
          "unitId": 781,
          "form": 2,
          "name": "마모란파사란",
          "icon": "../img/u/781/1.png"
        },
        {
          "unitId": 689,
          "form": 1,
          "name": "10년이면 고양이",
          "icon": "../img/u/689/0.png"
        }
      ]
    },
    {
      "id": 3067,
      "name": "퇴마(물리)",
      "effectId": 19,
      "effectLevel": 0,
      "value": 10,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「움직임을 멈춘다」 효과 UP  【소】",
      "members": [
        {
          "unitId": 799,
          "form": 1,
          "name": "곡사포대 런처즈",
          "icon": "../img/u/799/0.png"
        },
        {
          "unitId": 665,
          "form": 3,
          "name": "냥소시스트",
          "icon": "../img/u/665/2.png"
        }
      ]
    },
    {
      "id": 3068,
      "name": "地獄の国盗り",
      "effectId": 21,
      "effectLevel": 0,
      "value": 20,
      "groupId": -1,
      "eligibleUnitIds": null,
      "restriction": "",
      "effect": "「공격력 업」 효과 UP  【소】",
      "members": [
        {
          "unitId": 880,
          "form": 1,
          "name": "志々雄真実",
          "icon": "../img/u/880/0.png"
        }
      ]
    }
  ],
  "unitForms": {
    "0": [
      {
        "unitId": 0,
        "form": 1,
        "name": "고양이",
        "icon": "../img/u/0/0.png"
      },
      {
        "unitId": 0,
        "form": 2,
        "name": "고양이 빌더",
        "icon": "../img/u/0/1.png"
      },
      {
        "unitId": 0,
        "form": 3,
        "name": "고양이 모히칸",
        "icon": "../img/u/0/2.png"
      }
    ],
    "1": [
      {
        "unitId": 1,
        "form": 1,
        "name": "탱크 고양이",
        "icon": "../img/u/1/0.png"
      },
      {
        "unitId": 1,
        "form": 2,
        "name": "고양이 벽",
        "icon": "../img/u/1/1.png"
      },
      {
        "unitId": 1,
        "form": 3,
        "name": "고무 고양이",
        "icon": "../img/u/1/2.png"
      }
    ],
    "2": [
      {
        "unitId": 2,
        "form": 1,
        "name": "배틀 고양이",
        "icon": "../img/u/2/0.png"
      },
      {
        "unitId": 2,
        "form": 2,
        "name": "용사 고양이",
        "icon": "../img/u/2/1.png"
      },
      {
        "unitId": 2,
        "form": 3,
        "name": "암흑 고양이",
        "icon": "../img/u/2/2.png"
      }
    ],
    "3": [
      {
        "unitId": 3,
        "form": 1,
        "name": "징글 고양이",
        "icon": "../img/u/3/0.png"
      },
      {
        "unitId": 3,
        "form": 2,
        "name": "각선미 고양이",
        "icon": "../img/u/3/1.png"
      },
      {
        "unitId": 3,
        "form": 3,
        "name": "불끈다리 고양이",
        "icon": "../img/u/3/2.png"
      }
    ],
    "4": [
      {
        "unitId": 4,
        "form": 1,
        "name": "황소 고양이",
        "icon": "../img/u/4/0.png"
      },
      {
        "unitId": 4,
        "form": 2,
        "name": "기린 고양이",
        "icon": "../img/u/4/1.png"
      },
      {
        "unitId": 4,
        "form": 3,
        "name": "고양이 라이온",
        "icon": "../img/u/4/2.png"
      }
    ],
    "5": [
      {
        "unitId": 5,
        "form": 1,
        "name": "고양이 새",
        "icon": "../img/u/5/0.png"
      },
      {
        "unitId": 5,
        "form": 2,
        "name": "고양이UFO",
        "icon": "../img/u/5/1.png"
      },
      {
        "unitId": 5,
        "form": 3,
        "name": "천공의 고양이",
        "icon": "../img/u/5/2.png"
      }
    ],
    "6": [
      {
        "unitId": 6,
        "form": 1,
        "name": "고양이 피쉬",
        "icon": "../img/u/6/0.png"
      },
      {
        "unitId": 6,
        "form": 2,
        "name": "고양이 고래",
        "icon": "../img/u/6/1.png"
      },
      {
        "unitId": 6,
        "form": 3,
        "name": "고양이 섬",
        "icon": "../img/u/6/2.png"
      }
    ],
    "7": [
      {
        "unitId": 7,
        "form": 1,
        "name": "고양이 도마뱀",
        "icon": "../img/u/7/0.png"
      },
      {
        "unitId": 7,
        "form": 2,
        "name": "고양이 드래곤",
        "icon": "../img/u/7/1.png"
      },
      {
        "unitId": 7,
        "form": 3,
        "name": "고양이 킹드래곤",
        "icon": "../img/u/7/2.png"
      }
    ],
    "8": [
      {
        "unitId": 8,
        "form": 1,
        "name": "거신 고양이",
        "icon": "../img/u/8/0.png"
      },
      {
        "unitId": 8,
        "form": 2,
        "name": "고양이 다라보치",
        "icon": "../img/u/8/1.png"
      },
      {
        "unitId": 8,
        "form": 3,
        "name": "고양이 쟈라미",
        "icon": "../img/u/8/2.png"
      }
    ],
    "9": [
      {
        "unitId": 9,
        "form": 1,
        "name": "고양이 여배우",
        "icon": "../img/u/9/0.png"
      },
      {
        "unitId": 9,
        "form": 2,
        "name": "고양이 성모",
        "icon": "../img/u/9/1.png"
      },
      {
        "unitId": 9,
        "form": 3,
        "name": "고양이 마초",
        "icon": "../img/u/9/2.png"
      }
    ],
    "10": [
      {
        "unitId": 10,
        "form": 1,
        "name": "쿵후 냥코",
        "icon": "../img/u/10/0.png"
      },
      {
        "unitId": 10,
        "form": 2,
        "name": "취권 냥코",
        "icon": "../img/u/10/1.png"
      },
      {
        "unitId": 10,
        "form": 3,
        "name": "고양이 댄서",
        "icon": "../img/u/10/2.png"
      }
    ],
    "11": [
      {
        "unitId": 11,
        "form": 1,
        "name": "Mr.",
        "icon": "../img/u/11/0.png"
      },
      {
        "unitId": 11,
        "form": 2,
        "name": "Super Mr.",
        "icon": "../img/u/11/1.png"
      },
      {
        "unitId": 11,
        "form": 3,
        "name": "Hyper Mr.",
        "icon": "../img/u/11/2.png"
      }
    ],
    "12": [
      {
        "unitId": 12,
        "form": 1,
        "name": "고양이 밧줄",
        "icon": "../img/u/12/0.png"
      },
      {
        "unitId": 12,
        "form": 2,
        "name": "고양이 밧줄NEO",
        "icon": "../img/u/12/1.png"
      },
      {
        "unitId": 12,
        "form": 3,
        "name": "고양이 밧줄 궁극",
        "icon": "../img/u/12/2.png"
      }
    ],
    "13": [
      {
        "unitId": 13,
        "form": 1,
        "name": "여왕 고양이",
        "icon": "../img/u/13/0.png"
      },
      {
        "unitId": 13,
        "form": 2,
        "name": "처형인",
        "icon": "../img/u/13/1.png"
      },
      {
        "unitId": 13,
        "form": 3,
        "name": "다크 라이더",
        "icon": "../img/u/13/2.png"
      }
    ],
    "14": [
      {
        "unitId": 14,
        "form": 1,
        "name": "고양이 한박스",
        "icon": "../img/u/14/0.png"
      },
      {
        "unitId": 14,
        "form": 2,
        "name": "고양이 갱단",
        "icon": "../img/u/14/1.png"
      },
      {
        "unitId": 14,
        "form": 3,
        "name": "중기 C・A・T",
        "icon": "../img/u/14/2.png"
      }
    ],
    "15": [
      {
        "unitId": 15,
        "form": 1,
        "name": "고양이 팬티",
        "icon": "../img/u/15/0.png"
      },
      {
        "unitId": 15,
        "form": 2,
        "name": "고양이 잎사귀",
        "icon": "../img/u/15/1.png"
      },
      {
        "unitId": 15,
        "form": 3,
        "name": "고양이 캔디",
        "icon": "../img/u/15/2.png"
      }
    ],
    "16": [
      {
        "unitId": 16,
        "form": 1,
        "name": "귀여미",
        "icon": "../img/u/16/0.png"
      },
      {
        "unitId": 16,
        "form": 2,
        "name": "스타 귀여미",
        "icon": "../img/u/16/1.png"
      },
      {
        "unitId": 16,
        "form": 3,
        "name": "슈퍼 스타 귀여미",
        "icon": "../img/u/16/2.png"
      }
    ],
    "17": [
      {
        "unitId": 17,
        "form": 1,
        "name": "고양이 세발자전거",
        "icon": "../img/u/17/0.png"
      },
      {
        "unitId": 17,
        "form": 2,
        "name": "고양이 와일드",
        "icon": "../img/u/17/1.png"
      },
      {
        "unitId": 17,
        "form": 3,
        "name": "고양이 외발자전거",
        "icon": "../img/u/17/2.png"
      }
    ],
    "18": [
      {
        "unitId": 18,
        "form": 1,
        "name": "고양이 닌자",
        "icon": "../img/u/18/0.png"
      },
      {
        "unitId": 18,
        "form": 2,
        "name": "개구리 고양이 닌자",
        "icon": "../img/u/18/1.png"
      },
      {
        "unitId": 18,
        "form": 3,
        "name": "날다람 고양이 닌자",
        "icon": "../img/u/18/2.png"
      }
    ],
    "19": [
      {
        "unitId": 19,
        "form": 1,
        "name": "고양이 좀비",
        "icon": "../img/u/19/0.png"
      },
      {
        "unitId": 19,
        "form": 2,
        "name": "데빌 고양이",
        "icon": "../img/u/19/1.png"
      },
      {
        "unitId": 19,
        "form": 3,
        "name": "고양이 해골",
        "icon": "../img/u/19/2.png"
      }
    ],
    "20": [
      {
        "unitId": 20,
        "form": 1,
        "name": "고양이 무사",
        "icon": "../img/u/20/0.png"
      },
      {
        "unitId": 20,
        "form": 2,
        "name": "고양이 나이트",
        "icon": "../img/u/20/1.png"
      },
      {
        "unitId": 20,
        "form": 3,
        "name": "고양이 파티쉐",
        "icon": "../img/u/20/2.png"
      }
    ],
    "21": [
      {
        "unitId": 21,
        "form": 1,
        "name": "스모 고양이",
        "icon": "../img/u/21/0.png"
      },
      {
        "unitId": 21,
        "form": 2,
        "name": "마담·더·스모",
        "icon": "../img/u/21/1.png"
      },
      {
        "unitId": 21,
        "form": 3,
        "name": "고양이 주먹밥",
        "icon": "../img/u/21/2.png"
      }
    ],
    "22": [
      {
        "unitId": 22,
        "form": 1,
        "name": "고양이 피버",
        "icon": "../img/u/22/0.png"
      },
      {
        "unitId": 22,
        "form": 2,
        "name": "고양이 카니발",
        "icon": "../img/u/22/1.png"
      },
      {
        "unitId": 22,
        "form": 3,
        "name": "고양이 아미고",
        "icon": "../img/u/22/2.png"
      }
    ],
    "23": [
      {
        "unitId": 23,
        "form": 1,
        "name": "고양이 스커트",
        "icon": "../img/u/23/0.png"
      },
      {
        "unitId": 23,
        "form": 2,
        "name": "고양이 타이츠",
        "icon": "../img/u/23/1.png"
      },
      {
        "unitId": 23,
        "form": 3,
        "name": "고양이 훈도시",
        "icon": "../img/u/23/2.png"
      }
    ],
    "24": [
      {
        "unitId": 24,
        "form": 1,
        "name": "고양이 발키리",
        "icon": "../img/u/24/0.png"
      },
      {
        "unitId": 24,
        "form": 2,
        "name": "고양이 발키리·진",
        "icon": "../img/u/24/1.png"
      },
      {
        "unitId": 24,
        "form": 3,
        "name": "고양이 발키리・성",
        "icon": "../img/u/24/2.png"
      }
    ],
    "25": [
      {
        "unitId": 25,
        "form": 1,
        "name": "고양이 무트",
        "icon": "../img/u/25/0.png"
      },
      {
        "unitId": 25,
        "form": 2,
        "name": "광란의 고양이 무트",
        "icon": "../img/u/25/1.png"
      },
      {
        "unitId": 25,
        "form": 3,
        "name": "각성의 고양이 무트",
        "icon": "../img/u/25/2.png"
      }
    ],
    "30": [
      {
        "unitId": 30,
        "form": 1,
        "name": "고양이 보살",
        "icon": "../img/u/30/0.png"
      },
      {
        "unitId": 30,
        "form": 2,
        "name": "고양이 천수관음",
        "icon": "../img/u/30/1.png"
      },
      {
        "unitId": 30,
        "form": 3,
        "name": "고양이 여래",
        "icon": "../img/u/30/2.png"
      }
    ],
    "31": [
      {
        "unitId": 31,
        "form": 1,
        "name": "고양이 일진",
        "icon": "../img/u/31/0.png"
      },
      {
        "unitId": 31,
        "form": 2,
        "name": "분노의 고양이 일진",
        "icon": "../img/u/31/1.png"
      },
      {
        "unitId": 31,
        "form": 3,
        "name": "격노의 고양이 일진",
        "icon": "../img/u/31/2.png"
      }
    ],
    "32": [
      {
        "unitId": 32,
        "form": 1,
        "name": "고양이 댄스",
        "icon": "../img/u/32/0.png"
      },
      {
        "unitId": 32,
        "form": 2,
        "name": "고양이 알몸 댄스",
        "icon": "../img/u/32/1.png"
      },
      {
        "unitId": 32,
        "form": 3,
        "name": "고양이 캉캉",
        "icon": "../img/u/32/2.png"
      }
    ],
    "33": [
      {
        "unitId": 33,
        "form": 1,
        "name": "고타츠양이",
        "icon": "../img/u/33/0.png"
      },
      {
        "unitId": 33,
        "form": 2,
        "name": "고양이TV",
        "icon": "../img/u/33/1.png"
      },
      {
        "unitId": 33,
        "form": 3,
        "name": "고양이 문어단지",
        "icon": "../img/u/33/2.png"
      }
    ],
    "34": [
      {
        "unitId": 34,
        "form": 1,
        "name": "고양이 루가",
        "icon": "../img/u/34/0.png"
      },
      {
        "unitId": 34,
        "form": 2,
        "name": "케사란파사란",
        "icon": "../img/u/34/1.png"
      },
      {
        "unitId": 34,
        "form": 3,
        "name": "울트라 케사란",
        "icon": "../img/u/34/2.png"
      }
    ],
    "35": [
      {
        "unitId": 35,
        "form": 1,
        "name": "오덕 고양이",
        "icon": "../img/u/35/0.png"
      },
      {
        "unitId": 35,
        "form": 2,
        "name": "고양이 해커",
        "icon": "../img/u/35/1.png"
      },
      {
        "unitId": 35,
        "form": 3,
        "name": "고양이 슈퍼 해커",
        "icon": "../img/u/35/2.png"
      }
    ],
    "36": [
      {
        "unitId": 36,
        "form": 1,
        "name": "고양이 스위머",
        "icon": "../img/u/36/0.png"
      },
      {
        "unitId": 36,
        "form": 2,
        "name": "고양이 버터플라이",
        "icon": "../img/u/36/1.png"
      },
      {
        "unitId": 36,
        "form": 3,
        "name": "고양이 반인어",
        "icon": "../img/u/36/2.png"
      }
    ],
    "37": [
      {
        "unitId": 37,
        "form": 1,
        "name": "고양이 홉핑",
        "icon": "../img/u/37/0.png"
      },
      {
        "unitId": 37,
        "form": 2,
        "name": "고양이 마사이",
        "icon": "../img/u/37/1.png"
      },
      {
        "unitId": 37,
        "form": 3,
        "name": "고양이 강시",
        "icon": "../img/u/37/2.png"
      }
    ],
    "38": [
      {
        "unitId": 38,
        "form": 1,
        "name": "고양이 차륜",
        "icon": "../img/u/38/0.png"
      },
      {
        "unitId": 38,
        "form": 2,
        "name": "고양이 태양",
        "icon": "../img/u/38/1.png"
      },
      {
        "unitId": 38,
        "form": 3,
        "name": "고양이 쿨",
        "icon": "../img/u/38/2.png"
      }
    ],
    "39": [
      {
        "unitId": 39,
        "form": 1,
        "name": "고양이 사과",
        "icon": "../img/u/39/0.png"
      },
      {
        "unitId": 39,
        "form": 2,
        "name": "왕대갈이군",
        "icon": "../img/u/39/1.png"
      },
      {
        "unitId": 39,
        "form": 3,
        "name": "iCat",
        "icon": "../img/u/39/2.png"
      }
    ],
    "40": [
      {
        "unitId": 40,
        "form": 1,
        "name": "고양이 욕조",
        "icon": "../img/u/40/0.png"
      },
      {
        "unitId": 40,
        "form": 2,
        "name": "섹시 고양이 욕조",
        "icon": "../img/u/40/1.png"
      },
      {
        "unitId": 40,
        "form": 3,
        "name": "고양이 욕조 골드",
        "icon": "../img/u/40/2.png"
      }
    ],
    "41": [
      {
        "unitId": 41,
        "form": 1,
        "name": "고양이 에스테",
        "icon": "../img/u/41/0.png"
      },
      {
        "unitId": 41,
        "form": 2,
        "name": "고양이 젠느",
        "icon": "../img/u/41/1.png"
      },
      {
        "unitId": 41,
        "form": 3,
        "name": "고양이 퍼펙트",
        "icon": "../img/u/41/2.png"
      }
    ],
    "42": [
      {
        "unitId": 42,
        "form": 1,
        "name": "고양이 아이스",
        "icon": "../img/u/42/0.png"
      },
      {
        "unitId": 42,
        "form": 2,
        "name": "고양이 아이스퀸",
        "icon": "../img/u/42/1.png"
      },
      {
        "unitId": 42,
        "form": 3,
        "name": "고양이 아이스 크리스탈",
        "icon": "../img/u/42/2.png"
      }
    ],
    "43": [
      {
        "unitId": 43,
        "form": 1,
        "name": "고양이 머신",
        "icon": "../img/u/43/0.png"
      },
      {
        "unitId": 43,
        "form": 2,
        "name": "고양이 머신・파",
        "icon": "../img/u/43/1.png"
      },
      {
        "unitId": 43,
        "form": 3,
        "name": "고양이 머신・멸",
        "icon": "../img/u/43/2.png"
      }
    ],
    "44": [
      {
        "unitId": 44,
        "form": 1,
        "name": "도깨비 야옹마",
        "icon": "../img/u/44/0.png"
      },
      {
        "unitId": 44,
        "form": 2,
        "name": "도깨비신 야옹마",
        "icon": "../img/u/44/1.png"
      },
      {
        "unitId": 44,
        "form": 3,
        "name": "헬파이어 도깨비 야옹마",
        "icon": "../img/u/44/2.png"
      }
    ],
    "46": [
      {
        "unitId": 46,
        "form": 1,
        "name": "고양이 쥬라",
        "icon": "../img/u/46/0.png"
      },
      {
        "unitId": 46,
        "form": 2,
        "name": "고양이 쥬라싯터",
        "icon": "../img/u/46/1.png"
      },
      {
        "unitId": 46,
        "form": 3,
        "name": "고양이 쥬라 사우루스",
        "icon": "../img/u/46/2.png"
      }
    ],
    "47": [
      {
        "unitId": 47,
        "form": 1,
        "name": "고양이 파이터",
        "icon": "../img/u/47/0.png"
      },
      {
        "unitId": 47,
        "form": 2,
        "name": "메간톤 파이터",
        "icon": "../img/u/47/1.png"
      },
      {
        "unitId": 47,
        "form": 3,
        "name": "맥시멈 파이터",
        "icon": "../img/u/47/2.png"
      }
    ],
    "49": [
      {
        "unitId": 49,
        "form": 1,
        "name": "고양이 도둑",
        "icon": "../img/u/49/0.png"
      },
      {
        "unitId": 49,
        "form": 2,
        "name": "괴도 야콘",
        "icon": "../img/u/49/1.png"
      },
      {
        "unitId": 49,
        "form": 3,
        "name": "고양이 에몽",
        "icon": "../img/u/49/2.png"
      }
    ],
    "51": [
      {
        "unitId": 51,
        "form": 1,
        "name": "고양이 점쟁이",
        "icon": "../img/u/51/0.png"
      },
      {
        "unitId": 51,
        "form": 2,
        "name": "고양이 어부",
        "icon": "../img/u/51/1.png"
      },
      {
        "unitId": 51,
        "form": 3,
        "name": "고양이 의사",
        "icon": "../img/u/51/2.png"
      }
    ],
    "52": [
      {
        "unitId": 52,
        "form": 1,
        "name": "고양이 샤먼",
        "icon": "../img/u/52/0.png"
      },
      {
        "unitId": 52,
        "form": 2,
        "name": "고양이 라만사",
        "icon": "../img/u/52/1.png"
      },
      {
        "unitId": 52,
        "form": 3,
        "name": "고양이 라만사 댄스",
        "icon": "../img/u/52/2.png"
      }
    ],
    "55": [
      {
        "unitId": 55,
        "form": 1,
        "name": "고양이 마녀",
        "icon": "../img/u/55/0.png"
      },
      {
        "unitId": 55,
        "form": 2,
        "name": "고양이 위치",
        "icon": "../img/u/55/1.png"
      },
      {
        "unitId": 55,
        "form": 3,
        "name": "고양이 소서리스",
        "icon": "../img/u/55/2.png"
      }
    ],
    "56": [
      {
        "unitId": 56,
        "form": 1,
        "name": "고양이 아처",
        "icon": "../img/u/56/0.png"
      },
      {
        "unitId": 56,
        "form": 2,
        "name": "고양이 큐피트",
        "icon": "../img/u/56/1.png"
      },
      {
        "unitId": 56,
        "form": 3,
        "name": "고양이 궁수자리",
        "icon": "../img/u/56/2.png"
      }
    ],
    "57": [
      {
        "unitId": 57,
        "form": 1,
        "name": "고양이 슈발리에",
        "icon": "../img/u/57/0.png"
      },
      {
        "unitId": 57,
        "form": 2,
        "name": "고양이 베르세르크",
        "icon": "../img/u/57/1.png"
      },
      {
        "unitId": 57,
        "form": 3,
        "name": "고양이 파라딘",
        "icon": "../img/u/57/2.png"
      }
    ],
    "59": [
      {
        "unitId": 59,
        "form": 1,
        "name": "고양이 베이비",
        "icon": "../img/u/59/0.png"
      },
      {
        "unitId": 59,
        "form": 2,
        "name": "고양이 베이비즈",
        "icon": "../img/u/59/1.png"
      },
      {
        "unitId": 59,
        "form": 3,
        "name": "고양이 베이비카트",
        "icon": "../img/u/59/2.png"
      },
      {
        "unitId": 59,
        "form": 4,
        "name": "고양이 베이비월드",
        "icon": "../img/u/59/3.png"
      }
    ],
    "60": [
      {
        "unitId": 60,
        "form": 1,
        "name": "고양이브・론즈",
        "icon": "../img/u/60/0.png"
      },
      {
        "unitId": 60,
        "form": 2,
        "name": "예술의 고양이스테츄",
        "icon": "../img/u/60/1.png"
      },
      {
        "unitId": 60,
        "form": 3,
        "name": "퀴즈왕 고양이",
        "icon": "../img/u/60/2.png"
      }
    ],
    "61": [
      {
        "unitId": 61,
        "form": 1,
        "name": "고양이 스시",
        "icon": "../img/u/61/0.png"
      },
      {
        "unitId": 61,
        "form": 2,
        "name": "고양이 리젠트",
        "icon": "../img/u/61/1.png"
      },
      {
        "unitId": 61,
        "form": 3,
        "name": "고양이 연어알",
        "icon": "../img/u/61/2.png"
      }
    ],
    "63": [
      {
        "unitId": 63,
        "form": 1,
        "name": "고양이 운동회",
        "icon": "../img/u/63/0.png"
      },
      {
        "unitId": 63,
        "form": 2,
        "name": "고양이 납치",
        "icon": "../img/u/63/1.png"
      },
      {
        "unitId": 63,
        "form": 3,
        "name": "고양이 봉",
        "icon": "../img/u/63/2.png"
      }
    ],
    "70": [
      {
        "unitId": 70,
        "form": 1,
        "name": "고양리맨",
        "icon": "../img/u/70/0.png"
      },
      {
        "unitId": 70,
        "form": 2,
        "name": "고양이 원혼",
        "icon": "../img/u/70/1.png"
      },
      {
        "unitId": 70,
        "form": 3,
        "name": "고양이 분노",
        "icon": "../img/u/70/2.png"
      }
    ],
    "71": [
      {
        "unitId": 71,
        "form": 1,
        "name": "그리폰",
        "icon": "../img/u/71/0.png"
      },
      {
        "unitId": 71,
        "form": 2,
        "name": "분노의 그리폰",
        "icon": "../img/u/71/1.png"
      },
      {
        "unitId": 71,
        "form": 3,
        "name": "비약의 무신・그리폰",
        "icon": "../img/u/71/2.png"
      }
    ],
    "72": [
      {
        "unitId": 72,
        "form": 1,
        "name": "백호",
        "icon": "../img/u/72/0.png"
      },
      {
        "unitId": 72,
        "form": 2,
        "name": "분노의 백호",
        "icon": "../img/u/72/1.png"
      },
      {
        "unitId": 72,
        "form": 3,
        "name": "진노의 백호",
        "icon": "../img/u/72/2.png"
      }
    ],
    "73": [
      {
        "unitId": 73,
        "form": 1,
        "name": "하데스",
        "icon": "../img/u/73/0.png"
      },
      {
        "unitId": 73,
        "form": 2,
        "name": "분노의 하데스",
        "icon": "../img/u/73/1.png"
      },
      {
        "unitId": 73,
        "form": 3,
        "name": "천마의 하데스",
        "icon": "../img/u/73/2.png"
      },
      {
        "unitId": 73,
        "form": 4,
        "name": "몽환천마 하데스",
        "icon": "../img/u/73/3.png"
      }
    ],
    "74": [
      {
        "unitId": 74,
        "form": 1,
        "name": "순록피쉬",
        "icon": "../img/u/74/0.png"
      },
      {
        "unitId": 74,
        "form": 2,
        "name": "고양이회 모듬",
        "icon": "../img/u/74/1.png"
      },
      {
        "unitId": 74,
        "form": 3,
        "name": "피쉬・더・노엘",
        "icon": "../img/u/74/2.png"
      }
    ],
    "75": [
      {
        "unitId": 75,
        "form": 1,
        "name": "바람의 신・윈디",
        "icon": "../img/u/75/0.png"
      },
      {
        "unitId": 75,
        "form": 2,
        "name": "바람의 신・윈디α",
        "icon": "../img/u/75/1.png"
      },
      {
        "unitId": 75,
        "form": 3,
        "name": "질풍의 신・윈디α",
        "icon": "../img/u/75/2.png"
      },
      {
        "unitId": 75,
        "form": 4,
        "name": "얼티밋・윈디α",
        "icon": "../img/u/75/3.png"
      }
    ],
    "76": [
      {
        "unitId": 76,
        "form": 1,
        "name": "번개의 신・산디아",
        "icon": "../img/u/76/0.png"
      },
      {
        "unitId": 76,
        "form": 2,
        "name": "번개의 신・산디아β",
        "icon": "../img/u/76/1.png"
      },
      {
        "unitId": 76,
        "form": 3,
        "name": "천둥의 신・산디아β",
        "icon": "../img/u/76/2.png"
      },
      {
        "unitId": 76,
        "form": 4,
        "name": "얼티밋・산디아β",
        "icon": "../img/u/76/3.png"
      }
    ],
    "78": [
      {
        "unitId": 78,
        "form": 1,
        "name": "고양이와 우주",
        "icon": "../img/u/78/0.png"
      },
      {
        "unitId": 78,
        "form": 2,
        "name": "냐앙소령",
        "icon": "../img/u/78/1.png"
      },
      {
        "unitId": 78,
        "form": 3,
        "name": "우주전사 고양이",
        "icon": "../img/u/78/2.png"
      }
    ],
    "79": [
      {
        "unitId": 79,
        "form": 1,
        "name": "냥코 성인",
        "icon": "../img/u/79/0.png"
      },
      {
        "unitId": 79,
        "form": 2,
        "name": "냥코 환자",
        "icon": "../img/u/79/1.png"
      },
      {
        "unitId": 79,
        "form": 3,
        "name": "냥코 죄수",
        "icon": "../img/u/79/2.png"
      }
    ],
    "80": [
      {
        "unitId": 80,
        "form": 1,
        "name": "내가 도깨비라오",
        "icon": "../img/u/80/0.png"
      },
      {
        "unitId": 80,
        "form": 2,
        "name": "고양이 신사",
        "icon": "../img/u/80/1.png"
      },
      {
        "unitId": 80,
        "form": 3,
        "name": "고양이 신사 동맹",
        "icon": "../img/u/80/2.png"
      }
    ],
    "81": [
      {
        "unitId": 81,
        "form": 1,
        "name": "냥코 부부",
        "icon": "../img/u/81/0.png"
      },
      {
        "unitId": 81,
        "form": 2,
        "name": "야징가 로보",
        "icon": "../img/u/81/1.png"
      },
      {
        "unitId": 81,
        "form": 3,
        "name": "냥라진",
        "icon": "../img/u/81/2.png"
      }
    ],
    "83": [
      {
        "unitId": 83,
        "form": 1,
        "name": "지룡 소돔",
        "icon": "../img/u/83/0.png"
      },
      {
        "unitId": 83,
        "form": 2,
        "name": "지룡왕 소돔",
        "icon": "../img/u/83/1.png"
      },
      {
        "unitId": 83,
        "form": 3,
        "name": "지룡황제 소돔",
        "icon": "../img/u/83/2.png"
      }
    ],
    "84": [
      {
        "unitId": 84,
        "form": 1,
        "name": "성룡 메기도라",
        "icon": "../img/u/84/0.png"
      },
      {
        "unitId": 84,
        "form": 2,
        "name": "성룡왕 메기도라",
        "icon": "../img/u/84/1.png"
      },
      {
        "unitId": 84,
        "form": 3,
        "name": "성룡황제 메기도라",
        "icon": "../img/u/84/2.png"
      }
    ],
    "85": [
      {
        "unitId": 85,
        "form": 1,
        "name": "용기사 바르스",
        "icon": "../img/u/85/0.png"
      },
      {
        "unitId": 85,
        "form": 2,
        "name": "용기사왕 바르스",
        "icon": "../img/u/85/1.png"
      },
      {
        "unitId": 85,
        "form": 3,
        "name": "용기사황제 바르스",
        "icon": "../img/u/85/2.png"
      }
    ],
    "86": [
      {
        "unitId": 86,
        "form": 1,
        "name": "신룡 카무쿠라",
        "icon": "../img/u/86/0.png"
      },
      {
        "unitId": 86,
        "form": 2,
        "name": "신룡왕 카무쿠라",
        "icon": "../img/u/86/1.png"
      },
      {
        "unitId": 86,
        "form": 3,
        "name": "신룡황제 카무쿠라",
        "icon": "../img/u/86/2.png"
      }
    ],
    "87": [
      {
        "unitId": 87,
        "form": 1,
        "name": "용병기 라이덴",
        "icon": "../img/u/87/0.png"
      },
      {
        "unitId": 87,
        "form": 2,
        "name": "용병기왕 라이덴",
        "icon": "../img/u/87/1.png"
      },
      {
        "unitId": 87,
        "form": 3,
        "name": "용병기황제 라이덴",
        "icon": "../img/u/87/2.png"
      }
    ],
    "88": [
      {
        "unitId": 88,
        "form": 1,
        "name": "고양이 줄넘기",
        "icon": "../img/u/88/0.png"
      },
      {
        "unitId": 88,
        "form": 2,
        "name": "고양고양 줄넘기",
        "icon": "../img/u/88/1.png"
      },
      {
        "unitId": 88,
        "form": 3,
        "name": "고양이 국수",
        "icon": "../img/u/88/2.png"
      }
    ],
    "91": [
      {
        "unitId": 91,
        "form": 1,
        "name": "광란의 고양이",
        "icon": "../img/u/91/0.png"
      },
      {
        "unitId": 91,
        "form": 2,
        "name": "광란의 고양이 빌더",
        "icon": "../img/u/91/1.png"
      },
      {
        "unitId": 91,
        "form": 3,
        "name": "대광란의 고양이 모히칸",
        "icon": "../img/u/91/2.png"
      }
    ],
    "92": [
      {
        "unitId": 92,
        "form": 1,
        "name": "광란의 탱크 고양이",
        "icon": "../img/u/92/0.png"
      },
      {
        "unitId": 92,
        "form": 2,
        "name": "광란의 고양이 벽",
        "icon": "../img/u/92/1.png"
      },
      {
        "unitId": 92,
        "form": 3,
        "name": "대광란의 고무 고양이",
        "icon": "../img/u/92/2.png"
      }
    ],
    "93": [
      {
        "unitId": 93,
        "form": 1,
        "name": "광란의 배틀 고양이",
        "icon": "../img/u/93/0.png"
      },
      {
        "unitId": 93,
        "form": 2,
        "name": "광란의 용사 고양이",
        "icon": "../img/u/93/1.png"
      },
      {
        "unitId": 93,
        "form": 3,
        "name": "대광란의 암흑 고양이",
        "icon": "../img/u/93/2.png"
      }
    ],
    "94": [
      {
        "unitId": 94,
        "form": 1,
        "name": "광란의 징글 고양이",
        "icon": "../img/u/94/0.png"
      },
      {
        "unitId": 94,
        "form": 2,
        "name": "광란의 각선미 고양이",
        "icon": "../img/u/94/1.png"
      },
      {
        "unitId": 94,
        "form": 3,
        "name": "대광란의 불끈다리 고양이",
        "icon": "../img/u/94/2.png"
      }
    ],
    "95": [
      {
        "unitId": 95,
        "form": 1,
        "name": "광란의 황소 고양이",
        "icon": "../img/u/95/0.png"
      },
      {
        "unitId": 95,
        "form": 2,
        "name": "광란의 기린 고양이",
        "icon": "../img/u/95/1.png"
      },
      {
        "unitId": 95,
        "form": 3,
        "name": "대광란의 고양이 라이온",
        "icon": "../img/u/95/2.png"
      }
    ],
    "96": [
      {
        "unitId": 96,
        "form": 1,
        "name": "광란의 고양이 새",
        "icon": "../img/u/96/0.png"
      },
      {
        "unitId": 96,
        "form": 2,
        "name": "광란의 고양이 UFO",
        "icon": "../img/u/96/1.png"
      },
      {
        "unitId": 96,
        "form": 3,
        "name": "대광란의 천공의 고양이",
        "icon": "../img/u/96/2.png"
      }
    ],
    "97": [
      {
        "unitId": 97,
        "form": 1,
        "name": "광란의 고양이 피쉬",
        "icon": "../img/u/97/0.png"
      },
      {
        "unitId": 97,
        "form": 2,
        "name": "광란의 고양이 고래",
        "icon": "../img/u/97/1.png"
      },
      {
        "unitId": 97,
        "form": 3,
        "name": "대광란의 고양이 섬",
        "icon": "../img/u/97/2.png"
      }
    ],
    "98": [
      {
        "unitId": 98,
        "form": 1,
        "name": "광란의 고양이 도마뱀",
        "icon": "../img/u/98/0.png"
      },
      {
        "unitId": 98,
        "form": 2,
        "name": "광란의 고양이 드래곤",
        "icon": "../img/u/98/1.png"
      },
      {
        "unitId": 98,
        "form": 3,
        "name": "대광란의 고양이 킹드래곤",
        "icon": "../img/u/98/2.png"
      }
    ],
    "99": [
      {
        "unitId": 99,
        "form": 1,
        "name": "광란의 거신 고양이",
        "icon": "../img/u/99/0.png"
      },
      {
        "unitId": 99,
        "form": 2,
        "name": "광란의 고양이 다라보치",
        "icon": "../img/u/99/1.png"
      },
      {
        "unitId": 99,
        "form": 3,
        "name": "대광란의 고양이 쟈라미",
        "icon": "../img/u/99/2.png"
      }
    ],
    "100": [
      {
        "unitId": 100,
        "form": 1,
        "name": "고양이 소녀",
        "icon": "../img/u/100/0.png"
      },
      {
        "unitId": 100,
        "form": 2,
        "name": "모솔 고양이",
        "icon": "../img/u/100/1.png"
      },
      {
        "unitId": 100,
        "form": 3,
        "name": "장미냥",
        "icon": "../img/u/100/2.png"
      }
    ],
    "104": [
      {
        "unitId": 104,
        "form": 1,
        "name": "물 만난 물고기",
        "icon": "../img/u/104/0.png"
      },
      {
        "unitId": 104,
        "form": 2,
        "name": "물 만난 고양이",
        "icon": "../img/u/104/1.png"
      },
      {
        "unitId": 104,
        "form": 3,
        "name": "바람 만난 고양이",
        "icon": "../img/u/104/2.png"
      }
    ],
    "105": [
      {
        "unitId": 105,
        "form": 1,
        "name": "쿠우",
        "icon": "../img/u/105/0.png"
      },
      {
        "unitId": 105,
        "form": 2,
        "name": "쿠우γ",
        "icon": "../img/u/105/1.png"
      },
      {
        "unitId": 105,
        "form": 3,
        "name": "골드 쿠우γ",
        "icon": "../img/u/105/2.png"
      }
    ],
    "106": [
      {
        "unitId": 106,
        "form": 1,
        "name": "카이",
        "icon": "../img/u/106/0.png"
      },
      {
        "unitId": 106,
        "form": 2,
        "name": "카이μ",
        "icon": "../img/u/106/1.png"
      },
      {
        "unitId": 106,
        "form": 3,
        "name": "슈퍼 카이μ",
        "icon": "../img/u/106/2.png"
      }
    ],
    "107": [
      {
        "unitId": 107,
        "form": 1,
        "name": "갓파 마인",
        "icon": "../img/u/107/0.png"
      },
      {
        "unitId": 107,
        "form": 2,
        "name": "갓파κ",
        "icon": "../img/u/107/1.png"
      },
      {
        "unitId": 107,
        "form": 3,
        "name": "샤이니 갓파κ",
        "icon": "../img/u/107/2.png"
      }
    ],
    "109": [
      {
        "unitId": 109,
        "form": 1,
        "name": "마담・더・신부",
        "icon": "../img/u/109/0.png"
      },
      {
        "unitId": 109,
        "form": 2,
        "name": "마담・더・킹",
        "icon": "../img/u/109/1.png"
      },
      {
        "unitId": 109,
        "form": 3,
        "name": "마담・더・사반나",
        "icon": "../img/u/109/2.png"
      }
    ],
    "122": [
      {
        "unitId": 122,
        "form": 1,
        "name": "여왕님의 휴일",
        "icon": "../img/u/122/0.png"
      },
      {
        "unitId": 122,
        "form": 2,
        "name": "평범한 오피스 레이디",
        "icon": "../img/u/122/1.png"
      },
      {
        "unitId": 122,
        "form": 3,
        "name": "콜센터 레이디",
        "icon": "../img/u/122/2.png"
      }
    ],
    "123": [
      {
        "unitId": 123,
        "form": 1,
        "name": "콩콩 냥코",
        "icon": "../img/u/123/0.png"
      },
      {
        "unitId": 123,
        "form": 2,
        "name": "럽럽 냥코",
        "icon": "../img/u/123/1.png"
      },
      {
        "unitId": 123,
        "form": 3,
        "name": "발키리 냥코",
        "icon": "../img/u/123/2.png"
      }
    ],
    "124": [
      {
        "unitId": 124,
        "form": 1,
        "name": "오딘",
        "icon": "../img/u/124/0.png"
      },
      {
        "unitId": 124,
        "form": 2,
        "name": "분노의 오딘",
        "icon": "../img/u/124/1.png"
      },
      {
        "unitId": 124,
        "form": 3,
        "name": "사안의 오딘",
        "icon": "../img/u/124/2.png"
      }
    ],
    "125": [
      {
        "unitId": 125,
        "form": 1,
        "name": "아수라",
        "icon": "../img/u/125/0.png"
      },
      {
        "unitId": 125,
        "form": 2,
        "name": "분노의 아수라",
        "icon": "../img/u/125/1.png"
      },
      {
        "unitId": 125,
        "form": 3,
        "name": "분노의 투우 아수라",
        "icon": "../img/u/125/2.png"
      }
    ],
    "126": [
      {
        "unitId": 126,
        "form": 1,
        "name": "꼭두각시 냥코",
        "icon": "../img/u/126/0.png"
      },
      {
        "unitId": 126,
        "form": 2,
        "name": "고양이 인형사",
        "icon": "../img/u/126/1.png"
      },
      {
        "unitId": 126,
        "form": 3,
        "name": "고양이 채피",
        "icon": "../img/u/126/2.png"
      }
    ],
    "127": [
      {
        "unitId": 127,
        "form": 1,
        "name": "고양이 플라워",
        "icon": "../img/u/127/0.png"
      },
      {
        "unitId": 127,
        "form": 2,
        "name": "냥코 선풍기",
        "icon": "../img/u/127/1.png"
      },
      {
        "unitId": 127,
        "form": 3,
        "name": "고양이 봄버",
        "icon": "../img/u/127/2.png"
      }
    ],
    "128": [
      {
        "unitId": 128,
        "form": 1,
        "name": "처녀귀신 냥코",
        "icon": "../img/u/128/0.png"
      },
      {
        "unitId": 128,
        "form": 2,
        "name": "냥코안경",
        "icon": "../img/u/128/1.png"
      },
      {
        "unitId": 128,
        "form": 3,
        "name": "연날리기 냥코",
        "icon": "../img/u/128/2.png"
      }
    ],
    "129": [
      {
        "unitId": 129,
        "form": 1,
        "name": "골드 고양이",
        "icon": "../img/u/129/0.png"
      },
      {
        "unitId": 129,
        "form": 2,
        "name": "골드 고양이 빌더",
        "icon": "../img/u/129/1.png"
      },
      {
        "unitId": 129,
        "form": 3,
        "name": "순금 고양이 빌더",
        "icon": "../img/u/129/2.png"
      }
    ],
    "130": [
      {
        "unitId": 130,
        "form": 1,
        "name": "울프와 우루룬",
        "icon": "../img/u/130/0.png"
      },
      {
        "unitId": 130,
        "form": 2,
        "name": "나비와 우루룬",
        "icon": "../img/u/130/1.png"
      },
      {
        "unitId": 130,
        "form": 3,
        "name": "각성의 나비와 우루룬",
        "icon": "../img/u/130/2.png"
      }
    ],
    "131": [
      {
        "unitId": 131,
        "form": 1,
        "name": "귀요미",
        "icon": "../img/u/131/0.png"
      },
      {
        "unitId": 131,
        "form": 2,
        "name": "스타 귀요미",
        "icon": "../img/u/131/1.png"
      }
    ],
    "132": [
      {
        "unitId": 132,
        "form": 1,
        "name": "쿵후 냥코G",
        "icon": "../img/u/132/0.png"
      },
      {
        "unitId": 132,
        "form": 2,
        "name": "취권 냥코G",
        "icon": "../img/u/132/1.png"
      },
      {
        "unitId": 132,
        "form": 3,
        "name": "강권 냥코G",
        "icon": "../img/u/132/2.png"
      }
    ],
    "134": [
      {
        "unitId": 134,
        "form": 1,
        "name": "냥꼬북",
        "icon": "../img/u/134/0.png"
      },
      {
        "unitId": 134,
        "form": 2,
        "name": "용궁수 거북레온",
        "icon": "../img/u/134/1.png"
      },
      {
        "unitId": 134,
        "form": 3,
        "name": "용궁초수 킹거북레온",
        "icon": "../img/u/134/2.png"
      }
    ],
    "135": [
      {
        "unitId": 135,
        "form": 1,
        "name": "크레인 냥코",
        "icon": "../img/u/135/0.png"
      },
      {
        "unitId": 135,
        "form": 2,
        "name": "은하전사 코스모",
        "icon": "../img/u/135/1.png"
      },
      {
        "unitId": 135,
        "form": 3,
        "name": "궁극전사 코즈믹 코스모",
        "icon": "../img/u/135/2.png"
      },
      {
        "unitId": 135,
        "form": 4,
        "name": "궁극용사 울트라 코스모",
        "icon": "../img/u/135/3.png"
      }
    ],
    "136": [
      {
        "unitId": 136,
        "form": 1,
        "name": "복숭아 동자",
        "icon": "../img/u/136/0.png"
      },
      {
        "unitId": 136,
        "form": 2,
        "name": "폭주형제 피치스타즈",
        "icon": "../img/u/136/1.png"
      },
      {
        "unitId": 136,
        "form": 3,
        "name": "폭주형제 피치저스티스",
        "icon": "../img/u/136/2.png"
      }
    ],
    "137": [
      {
        "unitId": 137,
        "form": 1,
        "name": "석공 냥돌이",
        "icon": "../img/u/137/0.png"
      },
      {
        "unitId": 137,
        "form": 2,
        "name": "이동요새 카무이",
        "icon": "../img/u/137/1.png"
      },
      {
        "unitId": 137,
        "form": 3,
        "name": "이동요새 골드카무이",
        "icon": "../img/u/137/2.png"
      },
      {
        "unitId": 137,
        "form": 4,
        "name": "울트라 석공 냥돌이",
        "icon": "../img/u/137/3.png"
      }
    ],
    "138": [
      {
        "unitId": 138,
        "form": 1,
        "name": "대나무 공주",
        "icon": "../img/u/138/0.png"
      },
      {
        "unitId": 138,
        "form": 2,
        "name": "파괴위성 데스문",
        "icon": "../img/u/138/1.png"
      },
      {
        "unitId": 138,
        "form": 3,
        "name": "파괴위성 카오스문",
        "icon": "../img/u/138/2.png"
      },
      {
        "unitId": 138,
        "form": 4,
        "name": "울트라 대나무 공주",
        "icon": "../img/u/138/3.png"
      }
    ],
    "143": [
      {
        "unitId": 143,
        "form": 1,
        "name": "고양이 간호사",
        "icon": "../img/u/143/0.png"
      },
      {
        "unitId": 143,
        "form": 2,
        "name": "고양이 나이팅게일",
        "icon": "../img/u/143/1.png"
      },
      {
        "unitId": 143,
        "form": 3,
        "name": "조이풀 고양이 간호사",
        "icon": "../img/u/143/2.png"
      }
    ],
    "145": [
      {
        "unitId": 145,
        "form": 1,
        "name": "건맨 고양이",
        "icon": "../img/u/145/0.png"
      },
      {
        "unitId": 145,
        "form": 2,
        "name": "웨스턴 고양이",
        "icon": "../img/u/145/1.png"
      },
      {
        "unitId": 145,
        "form": 3,
        "name": "로데오 고양이",
        "icon": "../img/u/145/2.png"
      }
    ],
    "146": [
      {
        "unitId": 146,
        "form": 1,
        "name": "죽마 고양이",
        "icon": "../img/u/146/0.png"
      },
      {
        "unitId": 146,
        "form": 2,
        "name": "토템 고양이",
        "icon": "../img/u/146/1.png"
      },
      {
        "unitId": 146,
        "form": 3,
        "name": "고양이 잡기단",
        "icon": "../img/u/146/2.png"
      }
    ],
    "147": [
      {
        "unitId": 147,
        "form": 1,
        "name": "양철 고양이",
        "icon": "../img/u/147/0.png"
      },
      {
        "unitId": 147,
        "form": 2,
        "name": "양철 비행기 고양이",
        "icon": "../img/u/147/1.png"
      },
      {
        "unitId": 147,
        "form": 3,
        "name": "로봇 고양이",
        "icon": "../img/u/147/2.png"
      }
    ],
    "148": [
      {
        "unitId": 148,
        "form": 1,
        "name": "고양이 로커",
        "icon": "../img/u/148/0.png"
      },
      {
        "unitId": 148,
        "form": 2,
        "name": "고양이 아티스트",
        "icon": "../img/u/148/1.png"
      },
      {
        "unitId": 148,
        "form": 3,
        "name": "고양이 라면의 길",
        "icon": "../img/u/148/2.png"
      }
    ],
    "149": [
      {
        "unitId": 149,
        "form": 1,
        "name": "인어 고양이",
        "icon": "../img/u/149/0.png"
      },
      {
        "unitId": 149,
        "form": 2,
        "name": "솔져 고양이",
        "icon": "../img/u/149/1.png"
      },
      {
        "unitId": 149,
        "form": 3,
        "name": "카메라맨 고양이",
        "icon": "../img/u/149/2.png"
      }
    ],
    "150": [
      {
        "unitId": 150,
        "form": 1,
        "name": "창가의 소녀 고양이",
        "icon": "../img/u/150/0.png"
      },
      {
        "unitId": 150,
        "form": 2,
        "name": "창가의 공주 고양이",
        "icon": "../img/u/150/1.png"
      },
      {
        "unitId": 150,
        "form": 3,
        "name": "창가의 무희 고양이",
        "icon": "../img/u/150/2.png"
      }
    ],
    "152": [
      {
        "unitId": 152,
        "form": 1,
        "name": "고양이 스케이트",
        "icon": "../img/u/152/0.png"
      },
      {
        "unitId": 152,
        "form": 2,
        "name": "고양이 요요",
        "icon": "../img/u/152/1.png"
      },
      {
        "unitId": 152,
        "form": 3,
        "name": "고양이 콤비",
        "icon": "../img/u/152/2.png"
      }
    ],
    "153": [
      {
        "unitId": 153,
        "form": 1,
        "name": "고양이 토스터",
        "icon": "../img/u/153/0.png"
      },
      {
        "unitId": 153,
        "form": 2,
        "name": "고양이 영사기",
        "icon": "../img/u/153/1.png"
      },
      {
        "unitId": 153,
        "form": 3,
        "name": "고양이 클래식",
        "icon": "../img/u/153/2.png"
      }
    ],
    "154": [
      {
        "unitId": 154,
        "form": 1,
        "name": "고양이 훌라",
        "icon": "../img/u/154/0.png"
      },
      {
        "unitId": 154,
        "form": 2,
        "name": "고양이 트리플 훌라",
        "icon": "../img/u/154/1.png"
      },
      {
        "unitId": 154,
        "form": 3,
        "name": "고양이 스프링 훌라",
        "icon": "../img/u/154/2.png"
      }
    ],
    "158": [
      {
        "unitId": 158,
        "form": 1,
        "name": "사라만다",
        "icon": "../img/u/158/0.png"
      },
      {
        "unitId": 158,
        "form": 2,
        "name": "분노의 사라만다",
        "icon": "../img/u/158/1.png"
      },
      {
        "unitId": 158,
        "form": 3,
        "name": "격노의 사라만다",
        "icon": "../img/u/158/2.png"
      },
      {
        "unitId": 158,
        "form": 4,
        "name": "격노군신 사라만다",
        "icon": "../img/u/158/3.png"
      }
    ],
    "159": [
      {
        "unitId": 159,
        "form": 1,
        "name": "명계의 칼리파",
        "icon": "../img/u/159/0.png"
      },
      {
        "unitId": 159,
        "form": 2,
        "name": "명계의X칼리파",
        "icon": "../img/u/159/1.png"
      },
      {
        "unitId": 159,
        "form": 3,
        "name": "명계의XX칼리파",
        "icon": "../img/u/159/2.png"
      }
    ],
    "168": [
      {
        "unitId": 168,
        "form": 1,
        "name": "아시루가",
        "icon": "../img/u/168/0.png"
      },
      {
        "unitId": 168,
        "form": 2,
        "name": "아시란파사란",
        "icon": "../img/u/168/1.png"
      },
      {
        "unitId": 168,
        "form": 3,
        "name": "아타타타아시란",
        "icon": "../img/u/168/2.png"
      }
    ],
    "169": [
      {
        "unitId": 169,
        "form": 1,
        "name": "쿠비루가",
        "icon": "../img/u/169/0.png"
      },
      {
        "unitId": 169,
        "form": 2,
        "name": "쿠비란파사란",
        "icon": "../img/u/169/1.png"
      },
      {
        "unitId": 169,
        "form": 3,
        "name": "E・쿠비란파사란",
        "icon": "../img/u/169/2.png"
      }
    ],
    "170": [
      {
        "unitId": 170,
        "form": 1,
        "name": "테코루가",
        "icon": "../img/u/170/0.png"
      },
      {
        "unitId": 170,
        "form": 2,
        "name": "테사란파사란",
        "icon": "../img/u/170/1.png"
      },
      {
        "unitId": 170,
        "form": 3,
        "name": "밀짚모자 테사란",
        "icon": "../img/u/170/2.png"
      }
    ],
    "171": [
      {
        "unitId": 171,
        "form": 1,
        "name": "바라라가",
        "icon": "../img/u/171/0.png"
      },
      {
        "unitId": 171,
        "form": 2,
        "name": "바라란파사란",
        "icon": "../img/u/171/1.png"
      },
      {
        "unitId": 171,
        "form": 3,
        "name": "피카란바라란",
        "icon": "../img/u/171/2.png"
      }
    ],
    "172": [
      {
        "unitId": 172,
        "form": 1,
        "name": "꼬맹이 야옹마",
        "icon": "../img/u/172/0.png"
      },
      {
        "unitId": 172,
        "form": 2,
        "name": "꼬양이 야옹마",
        "icon": "../img/u/172/1.png"
      },
      {
        "unitId": 172,
        "form": 3,
        "name": "각성의 꼬양이 야옹마",
        "icon": "../img/u/172/2.png"
      }
    ],
    "176": [
      {
        "unitId": 176,
        "form": 1,
        "name": "마시멜로 냥코",
        "icon": "../img/u/176/0.png"
      },
      {
        "unitId": 176,
        "form": 2,
        "name": "징글마시멜로 냥코",
        "icon": "../img/u/176/1.png"
      }
    ],
    "177": [
      {
        "unitId": 177,
        "form": 1,
        "name": "패룡 디오라무스",
        "icon": "../img/u/177/0.png"
      },
      {
        "unitId": 177,
        "form": 2,
        "name": "패룡왕 디오라무스",
        "icon": "../img/u/177/1.png"
      },
      {
        "unitId": 177,
        "form": 3,
        "name": "패룡황제 디오라무스",
        "icon": "../img/u/177/2.png"
      },
      {
        "unitId": 177,
        "form": 4,
        "name": "패룡대제 디오라무스",
        "icon": "../img/u/177/3.png"
      }
    ],
    "194": [
      {
        "unitId": 194,
        "form": 1,
        "name": "아키라",
        "icon": "../img/u/194/0.png"
      },
      {
        "unitId": 194,
        "form": 2,
        "name": "쉐도우・아키라",
        "icon": "../img/u/194/1.png"
      },
      {
        "unitId": 194,
        "form": 3,
        "name": "인펠・아키라",
        "icon": "../img/u/194/2.png"
      }
    ],
    "195": [
      {
        "unitId": 195,
        "form": 1,
        "name": "메카소녀 진",
        "icon": "../img/u/195/0.png"
      },
      {
        "unitId": 195,
        "form": 2,
        "name": "닥터 메카소녀 진",
        "icon": "../img/u/195/1.png"
      },
      {
        "unitId": 195,
        "form": 3,
        "name": "스페이스 메카소녀 진",
        "icon": "../img/u/195/2.png"
      }
    ],
    "196": [
      {
        "unitId": 196,
        "form": 1,
        "name": "캣맨대디",
        "icon": "../img/u/196/0.png"
      },
      {
        "unitId": 196,
        "form": 2,
        "name": "캣맨다크",
        "icon": "../img/u/196/1.png"
      },
      {
        "unitId": 196,
        "form": 3,
        "name": "캣맨라이징",
        "icon": "../img/u/196/2.png"
      },
      {
        "unitId": 196,
        "form": 4,
        "name": "캣맨포에버",
        "icon": "../img/u/196/3.png"
      }
    ],
    "197": [
      {
        "unitId": 197,
        "form": 1,
        "name": "사이킥 냥코",
        "icon": "../img/u/197/0.png"
      },
      {
        "unitId": 197,
        "form": 2,
        "name": "네오 사이킥 냥코",
        "icon": "../img/u/197/1.png"
      },
      {
        "unitId": 197,
        "form": 3,
        "name": "데빌 사이킥 냥코",
        "icon": "../img/u/197/2.png"
      }
    ],
    "199": [
      {
        "unitId": 199,
        "form": 1,
        "name": "고양이 서퍼",
        "icon": "../img/u/199/0.png"
      },
      {
        "unitId": 199,
        "form": 2,
        "name": "표류 고양이",
        "icon": "../img/u/199/1.png"
      },
      {
        "unitId": 199,
        "form": 3,
        "name": "고양이 표류기",
        "icon": "../img/u/199/2.png"
      }
    ],
    "201": [
      {
        "unitId": 201,
        "form": 1,
        "name": "군악대장",
        "icon": "../img/u/201/0.png"
      },
      {
        "unitId": 201,
        "form": 2,
        "name": "플랜카드 냥코",
        "icon": "../img/u/201/1.png"
      },
      {
        "unitId": 201,
        "form": 3,
        "name": "떡방아 냥코",
        "icon": "../img/u/201/2.png"
      }
    ],
    "203": [
      {
        "unitId": 203,
        "form": 1,
        "name": "너굴냥즈",
        "icon": "../img/u/203/0.png"
      },
      {
        "unitId": 203,
        "form": 2,
        "name": "화염돌격대 너굴냥즈",
        "icon": "../img/u/203/1.png"
      },
      {
        "unitId": 203,
        "form": 3,
        "name": "화염저격대 너굴냥즈",
        "icon": "../img/u/203/2.png"
      }
    ],
    "209": [
      {
        "unitId": 209,
        "form": 1,
        "name": "꼬맹이 고양이",
        "icon": "../img/u/209/0.png"
      },
      {
        "unitId": 209,
        "form": 2,
        "name": "꼬맹이 고양이 빌더",
        "icon": "../img/u/209/1.png"
      },
      {
        "unitId": 209,
        "form": 3,
        "name": "꼬맹이 고양이 모히칸",
        "icon": "../img/u/209/2.png"
      }
    ],
    "210": [
      {
        "unitId": 210,
        "form": 1,
        "name": "꼬맹이 탱크 고양이",
        "icon": "../img/u/210/0.png"
      },
      {
        "unitId": 210,
        "form": 2,
        "name": "꼬맹이 고양이 벽",
        "icon": "../img/u/210/1.png"
      },
      {
        "unitId": 210,
        "form": 3,
        "name": "꼬맹이 고무 고양이",
        "icon": "../img/u/210/2.png"
      }
    ],
    "211": [
      {
        "unitId": 211,
        "form": 1,
        "name": "꼬맹이 배틀 고양이",
        "icon": "../img/u/211/0.png"
      },
      {
        "unitId": 211,
        "form": 2,
        "name": "꼬맹이 용사 고양이",
        "icon": "../img/u/211/1.png"
      },
      {
        "unitId": 211,
        "form": 3,
        "name": "꼬맹이 암흑 고양이",
        "icon": "../img/u/211/2.png"
      }
    ],
    "212": [
      {
        "unitId": 212,
        "form": 1,
        "name": "화이트 래빗",
        "icon": "../img/u/212/0.png"
      },
      {
        "unitId": 212,
        "form": 2,
        "name": "블랙 캣",
        "icon": "../img/u/212/1.png"
      },
      {
        "unitId": 212,
        "form": 3,
        "name": "그레이 폭스",
        "icon": "../img/u/212/2.png"
      },
      {
        "unitId": 212,
        "form": 4,
        "name": "스펙트르 캣",
        "icon": "../img/u/212/3.png"
      }
    ],
    "226": [
      {
        "unitId": 226,
        "form": 1,
        "name": "주술사 데스삐에로",
        "icon": "../img/u/226/0.png"
      },
      {
        "unitId": 226,
        "form": 2,
        "name": "암흑 상인 바빌",
        "icon": "../img/u/226/1.png"
      },
      {
        "unitId": 226,
        "form": 3,
        "name": "과학자 클레이G",
        "icon": "../img/u/226/2.png"
      }
    ],
    "227": [
      {
        "unitId": 227,
        "form": 1,
        "name": "냥프킨",
        "icon": "../img/u/227/0.png"
      },
      {
        "unitId": 227,
        "form": 2,
        "name": "랜턴 냥프킨",
        "icon": "../img/u/227/1.png"
      },
      {
        "unitId": 227,
        "form": 3,
        "name": "사신 냥프킨",
        "icon": "../img/u/227/2.png"
      }
    ],
    "237": [
      {
        "unitId": 237,
        "form": 1,
        "name": "고양이 박사 냥코",
        "icon": "../img/u/237/0.png"
      },
      {
        "unitId": 237,
        "form": 2,
        "name": "고양이 대박사",
        "icon": "../img/u/237/1.png"
      },
      {
        "unitId": 237,
        "form": 3,
        "name": "고양이 명예교수",
        "icon": "../img/u/237/2.png"
      }
    ],
    "238": [
      {
        "unitId": 238,
        "form": 1,
        "name": "고양이 도련님",
        "icon": "../img/u/238/0.png"
      },
      {
        "unitId": 238,
        "form": 2,
        "name": "고양이 도령의 파파",
        "icon": "../img/u/238/1.png"
      },
      {
        "unitId": 238,
        "form": 3,
        "name": "고양이 도령의 파파의 파파",
        "icon": "../img/u/238/2.png"
      }
    ],
    "239": [
      {
        "unitId": 239,
        "form": 1,
        "name": "견습생 스냥이퍼",
        "icon": "../img/u/239/0.png"
      },
      {
        "unitId": 239,
        "form": 2,
        "name": "고양고르고",
        "icon": "../img/u/239/1.png"
      },
      {
        "unitId": 239,
        "form": 3,
        "name": "고양고르고31",
        "icon": "../img/u/239/2.png"
      }
    ],
    "240": [
      {
        "unitId": 240,
        "form": 1,
        "name": "가시루가",
        "icon": "../img/u/240/0.png"
      },
      {
        "unitId": 240,
        "form": 2,
        "name": "가시란파사란",
        "icon": "../img/u/240/1.png"
      },
      {
        "unitId": 240,
        "form": 3,
        "name": "가시란시시가미",
        "icon": "../img/u/240/2.png"
      }
    ],
    "244": [
      {
        "unitId": 244,
        "form": 1,
        "name": "고양이의 선물",
        "icon": "../img/u/244/0.png"
      },
      {
        "unitId": 244,
        "form": 2,
        "name": "고양이 선물",
        "icon": "../img/u/244/1.png"
      }
    ],
    "245": [
      {
        "unitId": 245,
        "form": 1,
        "name": "꼬맹이 징글 고양이",
        "icon": "../img/u/245/0.png"
      },
      {
        "unitId": 245,
        "form": 2,
        "name": "꼬맹이 각선미 고양이",
        "icon": "../img/u/245/1.png"
      },
      {
        "unitId": 245,
        "form": 3,
        "name": "꼬맹이 불끈다리 고양이",
        "icon": "../img/u/245/2.png"
      }
    ],
    "246": [
      {
        "unitId": 246,
        "form": 1,
        "name": "꼬맹이 황소 고양이",
        "icon": "../img/u/246/0.png"
      },
      {
        "unitId": 246,
        "form": 2,
        "name": "꼬맹이 고양이 기린",
        "icon": "../img/u/246/1.png"
      },
      {
        "unitId": 246,
        "form": 3,
        "name": "꼬맹이 고양이 라이온",
        "icon": "../img/u/246/2.png"
      }
    ],
    "247": [
      {
        "unitId": 247,
        "form": 1,
        "name": "꼬맹이 고양이 새",
        "icon": "../img/u/247/0.png"
      },
      {
        "unitId": 247,
        "form": 2,
        "name": "꼬맹이 고양이 UFO",
        "icon": "../img/u/247/1.png"
      },
      {
        "unitId": 247,
        "form": 3,
        "name": "꼬맹이 천공의 고양이",
        "icon": "../img/u/247/2.png"
      }
    ],
    "257": [
      {
        "unitId": 257,
        "form": 1,
        "name": "천공신 제우스",
        "icon": "../img/u/257/0.png"
      },
      {
        "unitId": 257,
        "form": 2,
        "name": "기간트 제우스",
        "icon": "../img/u/257/1.png"
      },
      {
        "unitId": 257,
        "form": 3,
        "name": "G기간트 제우스",
        "icon": "../img/u/257/2.png"
      }
    ],
    "258": [
      {
        "unitId": 258,
        "form": 1,
        "name": "수호신 아누비스",
        "icon": "../img/u/258/0.png"
      },
      {
        "unitId": 258,
        "form": 2,
        "name": "퍼펙트 아누비스",
        "icon": "../img/u/258/1.png"
      },
      {
        "unitId": 258,
        "form": 3,
        "name": "G퍼펙트 아누비스",
        "icon": "../img/u/258/2.png"
      }
    ],
    "259": [
      {
        "unitId": 259,
        "form": 1,
        "name": "미의 여신 아프로디테",
        "icon": "../img/u/259/0.png"
      },
      {
        "unitId": 259,
        "form": 2,
        "name": "메가로디테",
        "icon": "../img/u/259/1.png"
      },
      {
        "unitId": 259,
        "form": 3,
        "name": "G메가로디테",
        "icon": "../img/u/259/2.png"
      }
    ],
    "260": [
      {
        "unitId": 260,
        "form": 1,
        "name": "냥웨이",
        "icon": "../img/u/260/0.png"
      },
      {
        "unitId": 260,
        "form": 2,
        "name": "고양이 드론",
        "icon": "../img/u/260/1.png"
      },
      {
        "unitId": 260,
        "form": 3,
        "name": "타임머신 고양이",
        "icon": "../img/u/260/2.png"
      }
    ],
    "261": [
      {
        "unitId": 261,
        "form": 1,
        "name": "천주 송골매",
        "icon": "../img/u/261/0.png"
      },
      {
        "unitId": 261,
        "form": 2,
        "name": "마신 송골매",
        "icon": "../img/u/261/1.png"
      },
      {
        "unitId": 261,
        "form": 3,
        "name": "섬멸 송골매",
        "icon": "../img/u/261/2.png"
      }
    ],
    "267": [
      {
        "unitId": 267,
        "form": 1,
        "name": "고양이 타이푼",
        "icon": "../img/u/267/0.png"
      },
      {
        "unitId": 267,
        "form": 2,
        "name": "고양이 허리케인",
        "icon": "../img/u/267/1.png"
      },
      {
        "unitId": 267,
        "form": 3,
        "name": "고양이 폭풍",
        "icon": "../img/u/267/2.png"
      }
    ],
    "268": [
      {
        "unitId": 268,
        "form": 1,
        "name": "고양이 냥미",
        "icon": "../img/u/268/0.png"
      },
      {
        "unitId": 268,
        "form": 2,
        "name": "러블리 냥미",
        "icon": "../img/u/268/1.png"
      },
      {
        "unitId": 268,
        "form": 3,
        "name": "각성의 러블리 냥미",
        "icon": "../img/u/268/2.png"
      }
    ],
    "269": [
      {
        "unitId": 269,
        "form": 1,
        "name": "요수 가오",
        "icon": "../img/u/269/0.png"
      },
      {
        "unitId": 269,
        "form": 2,
        "name": "황수 가오우",
        "icon": "../img/u/269/1.png"
      }
    ],
    "271": [
      {
        "unitId": 271,
        "form": 1,
        "name": "태양신 아마테라스",
        "icon": "../img/u/271/0.png"
      },
      {
        "unitId": 271,
        "form": 2,
        "name": "테라 아마테라스",
        "icon": "../img/u/271/1.png"
      },
      {
        "unitId": 271,
        "form": 3,
        "name": "G테라 아마테라스",
        "icon": "../img/u/271/2.png"
      }
    ],
    "272": [
      {
        "unitId": 272,
        "form": 1,
        "name": "번영신 가네샤",
        "icon": "../img/u/272/0.png"
      },
      {
        "unitId": 272,
        "form": 2,
        "name": "가네샤 엑사",
        "icon": "../img/u/272/1.png"
      },
      {
        "unitId": 272,
        "form": 3,
        "name": "G가네샤 엑사",
        "icon": "../img/u/272/2.png"
      }
    ],
    "273": [
      {
        "unitId": 273,
        "form": 1,
        "name": "치어리더 냥코",
        "icon": "../img/u/273/0.png"
      },
      {
        "unitId": 273,
        "form": 2,
        "name": "웨이트리스 냥코",
        "icon": "../img/u/273/1.png"
      },
      {
        "unitId": 273,
        "form": 3,
        "name": "러브소바 냥코",
        "icon": "../img/u/273/2.png"
      }
    ],
    "282": [
      {
        "unitId": 282,
        "form": 1,
        "name": "냥코 오도리",
        "icon": "../img/u/282/0.png"
      },
      {
        "unitId": 282,
        "form": 2,
        "name": "냥코 소란",
        "icon": "../img/u/282/1.png"
      },
      {
        "unitId": 282,
        "form": 3,
        "name": "냥코 고저스 삼바",
        "icon": "../img/u/282/2.png"
      }
    ],
    "283": [
      {
        "unitId": 283,
        "form": 1,
        "name": "묘반권 파이파이",
        "icon": "../img/u/283/0.png"
      },
      {
        "unitId": 283,
        "form": 2,
        "name": "묘반권 파이파이Z",
        "icon": "../img/u/283/1.png"
      },
      {
        "unitId": 283,
        "form": 3,
        "name": "묘권왕 파이파이DX",
        "icon": "../img/u/283/2.png"
      }
    ],
    "284": [
      {
        "unitId": 284,
        "form": 1,
        "name": "냥코 우등",
        "icon": "../img/u/284/0.png"
      },
      {
        "unitId": 284,
        "form": 2,
        "name": "냥코 특급",
        "icon": "../img/u/284/1.png"
      },
      {
        "unitId": 284,
        "form": 3,
        "name": "냥코 익스프레스",
        "icon": "../img/u/284/2.png"
      }
    ],
    "286": [
      {
        "unitId": 286,
        "form": 1,
        "name": "광전기병 레이",
        "icon": "../img/u/286/0.png"
      },
      {
        "unitId": 286,
        "form": 2,
        "name": "광전기병 플라즈마 레이",
        "icon": "../img/u/286/1.png"
      },
      {
        "unitId": 286,
        "form": 3,
        "name": "광전휘병 윙 레이",
        "icon": "../img/u/286/2.png"
      }
    ],
    "287": [
      {
        "unitId": 287,
        "form": 1,
        "name": "고양이 야구",
        "icon": "../img/u/287/0.png"
      },
      {
        "unitId": 287,
        "form": 2,
        "name": "고양이 리거",
        "icon": "../img/u/287/1.png"
      },
      {
        "unitId": 287,
        "form": 3,
        "name": "고양이 골퍼",
        "icon": "../img/u/287/2.png"
      }
    ],
    "299": [
      {
        "unitId": 299,
        "form": 1,
        "name": "꼬마 마도카",
        "icon": "../img/u/299/0.png"
      },
      {
        "unitId": 299,
        "form": 2,
        "name": "꼬마 마법소녀 마도카",
        "icon": "../img/u/299/1.png"
      },
      {
        "unitId": 299,
        "form": 3,
        "name": "꼬마 얼티밋 마도카",
        "icon": "../img/u/299/2.png"
      }
    ],
    "300": [
      {
        "unitId": 300,
        "form": 1,
        "name": "꼬마 호무라",
        "icon": "../img/u/300/0.png"
      },
      {
        "unitId": 300,
        "form": 2,
        "name": "꼬마 마법소녀 호무라",
        "icon": "../img/u/300/1.png"
      },
      {
        "unitId": 300,
        "form": 3,
        "name": "꼬마 악마 호무라",
        "icon": "../img/u/300/2.png"
      }
    ],
    "303": [
      {
        "unitId": 303,
        "form": 1,
        "name": "타코야끼냥",
        "icon": "../img/u/303/0.png"
      },
      {
        "unitId": 303,
        "form": 2,
        "name": "냥택배",
        "icon": "../img/u/303/1.png"
      },
      {
        "unitId": 303,
        "form": 3,
        "name": "고양이 급식당번",
        "icon": "../img/u/303/2.png"
      }
    ],
    "304": [
      {
        "unitId": 304,
        "form": 1,
        "name": "강철육군 카타바르스",
        "icon": "../img/u/304/0.png"
      },
      {
        "unitId": 304,
        "form": 2,
        "name": "격멸전차 기가파르도",
        "icon": "../img/u/304/1.png"
      },
      {
        "unitId": 304,
        "form": 3,
        "name": "초격멸전차 기가파르도",
        "icon": "../img/u/304/2.png"
      },
      {
        "unitId": 304,
        "form": 4,
        "name": "극격멸전차 기가파르도",
        "icon": "../img/u/304/3.png"
      }
    ],
    "305": [
      {
        "unitId": 305,
        "form": 1,
        "name": "고대군함 가레스",
        "icon": "../img/u/305/0.png"
      },
      {
        "unitId": 305,
        "form": 2,
        "name": "무적함대 시갈레온",
        "icon": "../img/u/305/1.png"
      },
      {
        "unitId": 305,
        "form": 3,
        "name": "초무적함대 시갈레온",
        "icon": "../img/u/305/2.png"
      },
      {
        "unitId": 305,
        "form": 4,
        "name": "극무적함대 시갈레온",
        "icon": "../img/u/305/3.png"
      }
    ],
    "306": [
      {
        "unitId": 306,
        "form": 1,
        "name": "비행습격 바머스",
        "icon": "../img/u/306/0.png"
      },
      {
        "unitId": 306,
        "form": 2,
        "name": "비행전함 보르본",
        "icon": "../img/u/306/1.png"
      },
      {
        "unitId": 306,
        "form": 3,
        "name": "초비행전함 보르본바",
        "icon": "../img/u/306/2.png"
      },
      {
        "unitId": 306,
        "form": 4,
        "name": "극비행전함 보르본바",
        "icon": "../img/u/306/3.png"
      }
    ],
    "307": [
      {
        "unitId": 307,
        "form": 1,
        "name": "고양이 점퍼",
        "icon": "../img/u/307/0.png"
      },
      {
        "unitId": 307,
        "form": 2,
        "name": "고양이 장대",
        "icon": "../img/u/307/1.png"
      },
      {
        "unitId": 307,
        "form": 3,
        "name": "고양이 빨래봉",
        "icon": "../img/u/307/2.png"
      }
    ],
    "308": [
      {
        "unitId": 308,
        "form": 1,
        "name": "고양이 가위",
        "icon": "../img/u/308/0.png"
      },
      {
        "unitId": 308,
        "form": 2,
        "name": "고양이 톱",
        "icon": "../img/u/308/1.png"
      },
      {
        "unitId": 308,
        "form": 3,
        "name": "고양이 풀베기",
        "icon": "../img/u/308/2.png"
      }
    ],
    "311": [
      {
        "unitId": 311,
        "form": 1,
        "name": "꼬맹이 고양이 피쉬",
        "icon": "../img/u/311/0.png"
      },
      {
        "unitId": 311,
        "form": 2,
        "name": "꼬맹이 고양이 고래",
        "icon": "../img/u/311/1.png"
      },
      {
        "unitId": 311,
        "form": 3,
        "name": "꼬맹이 고양이 섬",
        "icon": "../img/u/311/2.png"
      }
    ],
    "312": [
      {
        "unitId": 312,
        "form": 1,
        "name": "꼬맹이 고양이 도마뱀",
        "icon": "../img/u/312/0.png"
      },
      {
        "unitId": 312,
        "form": 2,
        "name": "꼬맹이 고양이 드래곤",
        "icon": "../img/u/312/1.png"
      },
      {
        "unitId": 312,
        "form": 3,
        "name": "꼬맹이 고양이 킹드래곤",
        "icon": "../img/u/312/2.png"
      }
    ],
    "313": [
      {
        "unitId": 313,
        "form": 1,
        "name": "꼬맹이 거신 고양이",
        "icon": "../img/u/313/0.png"
      },
      {
        "unitId": 313,
        "form": 2,
        "name": "꼬맹이 고양이 다라보치",
        "icon": "../img/u/313/1.png"
      },
      {
        "unitId": 313,
        "form": 3,
        "name": "꼬맹이 고양이 쟈라미",
        "icon": "../img/u/313/2.png"
      }
    ],
    "316": [
      {
        "unitId": 316,
        "form": 1,
        "name": "해왕신 포세이돈",
        "icon": "../img/u/316/0.png"
      },
      {
        "unitId": 316,
        "form": 2,
        "name": "포세이도라군",
        "icon": "../img/u/316/1.png"
      },
      {
        "unitId": 316,
        "form": 3,
        "name": "G포세이도라군",
        "icon": "../img/u/316/2.png"
      }
    ],
    "319": [
      {
        "unitId": 319,
        "form": 1,
        "name": "살의의 고양이",
        "icon": "../img/u/319/0.png"
      },
      {
        "unitId": 319,
        "form": 2,
        "name": "독기의 고양이",
        "icon": "../img/u/319/1.png"
      },
      {
        "unitId": 319,
        "form": 3,
        "name": "개심의 고양이",
        "icon": "../img/u/319/2.png"
      }
    ],
    "322": [
      {
        "unitId": 322,
        "form": 1,
        "name": "떠돌이 악사",
        "icon": "../img/u/322/0.png"
      },
      {
        "unitId": 322,
        "form": 2,
        "name": "폭주 락밴드 몽키헤븐",
        "icon": "../img/u/322/1.png"
      },
      {
        "unitId": 322,
        "form": 3,
        "name": "질주 락밴드 몽키헤븐",
        "icon": "../img/u/322/2.png"
      }
    ],
    "323": [
      {
        "unitId": 323,
        "form": 1,
        "name": "무사시",
        "icon": "../img/u/323/0.png"
      },
      {
        "unitId": 323,
        "form": 2,
        "name": "주연 무사시",
        "icon": "../img/u/323/1.png"
      },
      {
        "unitId": 323,
        "form": 3,
        "name": "각성의 주연 무사시",
        "icon": "../img/u/323/2.png"
      }
    ],
    "324": [
      {
        "unitId": 324,
        "form": 1,
        "name": "고양이 스톤",
        "icon": "../img/u/324/0.png"
      },
      {
        "unitId": 324,
        "form": 2,
        "name": "고양이 클리너",
        "icon": "../img/u/324/1.png"
      },
      {
        "unitId": 324,
        "form": 3,
        "name": "고양이 거북 카",
        "icon": "../img/u/324/2.png"
      }
    ],
    "325": [
      {
        "unitId": 325,
        "form": 1,
        "name": "고양이 복서",
        "icon": "../img/u/325/0.png"
      },
      {
        "unitId": 325,
        "form": 2,
        "name": "고양이 챔피온",
        "icon": "../img/u/325/1.png"
      },
      {
        "unitId": 325,
        "form": 3,
        "name": "고양이 리벤지",
        "icon": "../img/u/325/2.png"
      }
    ],
    "329": [
      {
        "unitId": 329,
        "form": 1,
        "name": "고양이 에그",
        "icon": "../img/u/329/0.png"
      },
      {
        "unitId": 329,
        "form": 2,
        "name": "고양이 에그2",
        "icon": "../img/u/329/1.png"
      },
      {
        "unitId": 329,
        "form": 3,
        "name": "고양이 에그3",
        "icon": "../img/u/329/2.png"
      }
    ],
    "334": [
      {
        "unitId": 334,
        "form": 1,
        "name": "여우아가씨 하늘나리",
        "icon": "../img/u/334/0.png"
      },
      {
        "unitId": 334,
        "form": 2,
        "name": "구미호공주 하늘나리",
        "icon": "../img/u/334/1.png"
      },
      {
        "unitId": 334,
        "form": 3,
        "name": "풍요의 여우공주 하늘나리",
        "icon": "../img/u/334/2.png"
      }
    ],
    "335": [
      {
        "unitId": 335,
        "form": 1,
        "name": "인어아가씨 루리",
        "icon": "../img/u/335/0.png"
      },
      {
        "unitId": 335,
        "form": 2,
        "name": "인어공주 루리",
        "icon": "../img/u/335/1.png"
      },
      {
        "unitId": 335,
        "form": 3,
        "name": "용궁의 인어공주 루리",
        "icon": "../img/u/335/2.png"
      }
    ],
    "336": [
      {
        "unitId": 336,
        "form": 1,
        "name": "미라아가씨 레이카",
        "icon": "../img/u/336/0.png"
      },
      {
        "unitId": 336,
        "form": 2,
        "name": "미라공주 레이카",
        "icon": "../img/u/336/1.png"
      },
      {
        "unitId": 336,
        "form": 3,
        "name": "황금의 미라공주 레이카",
        "icon": "../img/u/336/2.png"
      }
    ],
    "338": [
      {
        "unitId": 338,
        "form": 1,
        "name": "누아다",
        "icon": "../img/u/338/0.png"
      },
      {
        "unitId": 338,
        "form": 2,
        "name": "분노의 누아다",
        "icon": "../img/u/338/1.png"
      },
      {
        "unitId": 338,
        "form": 3,
        "name": "화염의 누아다",
        "icon": "../img/u/338/2.png"
      }
    ],
    "342": [
      {
        "unitId": 342,
        "form": 1,
        "name": "은혜 갚는 고양이",
        "icon": "../img/u/342/0.png"
      },
      {
        "unitId": 342,
        "form": 2,
        "name": "축복 고양이",
        "icon": "../img/u/342/1.png"
      }
    ],
    "343": [
      {
        "unitId": 343,
        "form": 1,
        "name": "민달팽이 고양이",
        "icon": "../img/u/343/0.png"
      },
      {
        "unitId": 343,
        "form": 2,
        "name": "고양이 민달팽이",
        "icon": "../img/u/343/1.png"
      }
    ],
    "351": [
      {
        "unitId": 351,
        "form": 1,
        "name": "시시루와 코마리",
        "icon": "../img/u/351/0.png"
      },
      {
        "unitId": 351,
        "form": 2,
        "name": "시시루와 코마리Φ",
        "icon": "../img/u/351/1.png"
      },
      {
        "unitId": 351,
        "form": 3,
        "name": "쌍둥이별 시시루와 코마리Φ",
        "icon": "../img/u/351/2.png"
      }
    ],
    "355": [
      {
        "unitId": 355,
        "form": 1,
        "name": "관측병기 갈릴레오",
        "icon": "../img/u/355/0.png"
      },
      {
        "unitId": 355,
        "form": 2,
        "name": "시공기지 아마겟돈",
        "icon": "../img/u/355/1.png"
      },
      {
        "unitId": 355,
        "form": 3,
        "name": "초시공기지 아마겟돈",
        "icon": "../img/u/355/2.png"
      }
    ],
    "357": [
      {
        "unitId": 357,
        "form": 1,
        "name": "늑대아가씨 딜",
        "icon": "../img/u/357/0.png"
      },
      {
        "unitId": 357,
        "form": 2,
        "name": "늑대공주 딜",
        "icon": "../img/u/357/1.png"
      },
      {
        "unitId": 357,
        "form": 3,
        "name": "도화의 늑대공주 딜",
        "icon": "../img/u/357/2.png"
      }
    ],
    "358": [
      {
        "unitId": 358,
        "form": 1,
        "name": "좀비아가씨 버베나",
        "icon": "../img/u/358/0.png"
      },
      {
        "unitId": 358,
        "form": 2,
        "name": "사령의 신부 버베나",
        "icon": "../img/u/358/1.png"
      },
      {
        "unitId": 358,
        "form": 3,
        "name": "행복한 신부 버베나",
        "icon": "../img/u/358/2.png"
      }
    ],
    "359": [
      {
        "unitId": 359,
        "form": 1,
        "name": "불의 정령 메라라",
        "icon": "../img/u/359/0.png"
      },
      {
        "unitId": 359,
        "form": 2,
        "name": "불꽃의 정령 메라란",
        "icon": "../img/u/359/1.png"
      },
      {
        "unitId": 359,
        "form": 3,
        "name": "불꽃의 정령왕 메라버닝",
        "icon": "../img/u/359/2.png"
      },
      {
        "unitId": 359,
        "form": 4,
        "name": "불꽃의 대정령 메라피닉스",
        "icon": "../img/u/359/3.png"
      }
    ],
    "360": [
      {
        "unitId": 360,
        "form": 1,
        "name": "물의 정령 마리",
        "icon": "../img/u/360/0.png"
      },
      {
        "unitId": 360,
        "form": 2,
        "name": "유수의 정령 마리린",
        "icon": "../img/u/360/1.png"
      },
      {
        "unitId": 360,
        "form": 3,
        "name": "유수의 정령왕 마리리린",
        "icon": "../img/u/360/2.png"
      },
      {
        "unitId": 360,
        "form": 4,
        "name": "유수의 대정령 마리나데",
        "icon": "../img/u/360/3.png"
      }
    ],
    "361": [
      {
        "unitId": 361,
        "form": 1,
        "name": "바람의 정령 에어리",
        "icon": "../img/u/361/0.png"
      },
      {
        "unitId": 361,
        "form": 2,
        "name": "폭풍의 정령 에어린",
        "icon": "../img/u/361/1.png"
      },
      {
        "unitId": 361,
        "form": 3,
        "name": "폭풍의 정령왕 에어리린",
        "icon": "../img/u/361/2.png"
      },
      {
        "unitId": 361,
        "form": 4,
        "name": "폭풍의 대정령 에어리얼",
        "icon": "../img/u/361/3.png"
      }
    ],
    "376": [
      {
        "unitId": 376,
        "form": 1,
        "name": "고양이 탐사기",
        "icon": "../img/u/376/0.png"
      },
      {
        "unitId": 376,
        "form": 2,
        "name": "고양이 서치MkⅡ",
        "icon": "../img/u/376/1.png"
      },
      {
        "unitId": 376,
        "form": 3,
        "name": "고양이 위성",
        "icon": "../img/u/376/2.png"
      }
    ],
    "382": [
      {
        "unitId": 382,
        "form": 1,
        "name": "유리 고양이",
        "icon": "../img/u/382/0.png"
      },
      {
        "unitId": 382,
        "form": 2,
        "name": "유리 고양이 빌더",
        "icon": "../img/u/382/1.png"
      },
      {
        "unitId": 382,
        "form": 3,
        "name": "크리스탈 고양이 빌더",
        "icon": "../img/u/382/2.png"
      }
    ],
    "396": [
      {
        "unitId": 396,
        "form": 1,
        "name": "고룡 강글리온",
        "icon": "../img/u/396/0.png"
      },
      {
        "unitId": 396,
        "form": 2,
        "name": "고룡왕 강글리온",
        "icon": "../img/u/396/1.png"
      },
      {
        "unitId": 396,
        "form": 3,
        "name": "고룡황제 강글리온",
        "icon": "../img/u/396/2.png"
      }
    ],
    "397": [
      {
        "unitId": 397,
        "form": 1,
        "name": "사쿠라",
        "icon": "../img/u/397/0.png"
      },
      {
        "unitId": 397,
        "form": 2,
        "name": "JK사쿠라",
        "icon": "../img/u/397/1.png"
      },
      {
        "unitId": 397,
        "form": 3,
        "name": "천주 사쿠라",
        "icon": "../img/u/397/2.png"
      },
      {
        "unitId": 397,
        "form": 4,
        "name": "천주Z 사쿠라",
        "icon": "../img/u/397/3.png"
      }
    ],
    "401": [
      {
        "unitId": 401,
        "form": 1,
        "name": "번개의 정령 볼트",
        "icon": "../img/u/401/0.png"
      },
      {
        "unitId": 401,
        "form": 2,
        "name": "벼락의 정령 피카볼트",
        "icon": "../img/u/401/1.png"
      },
      {
        "unitId": 401,
        "form": 3,
        "name": "벼락의 정령왕 기가볼트",
        "icon": "../img/u/401/2.png"
      },
      {
        "unitId": 401,
        "form": 4,
        "name": "벼락의 대정령 테라볼타",
        "icon": "../img/u/401/3.png"
      }
    ],
    "402": [
      {
        "unitId": 402,
        "form": 1,
        "name": "꼬맹이 신지",
        "icon": "../img/u/402/0.png"
      },
      {
        "unitId": 402,
        "form": 2,
        "name": "플러그 슈트 꼬맹이 신지",
        "icon": "../img/u/402/1.png"
      },
      {
        "unitId": 402,
        "form": 3,
        "name": "다크 플러그 슈트 꼬맹이 신지",
        "icon": "../img/u/402/2.png"
      }
    ],
    "405": [
      {
        "unitId": 405,
        "form": 1,
        "name": "꼬맹이 카오루",
        "icon": "../img/u/405/0.png"
      },
      {
        "unitId": 405,
        "form": 2,
        "name": "플러그 슈트 꼬맹이 카오루",
        "icon": "../img/u/405/1.png"
      },
      {
        "unitId": 405,
        "form": 3,
        "name": "달의 소년 꼬맹이 카오루",
        "icon": "../img/u/405/2.png"
      }
    ],
    "417": [
      {
        "unitId": 417,
        "form": 1,
        "name": "온천천국 테르마이",
        "icon": "../img/u/417/0.png"
      },
      {
        "unitId": 417,
        "form": 2,
        "name": "지하전대 그란돈",
        "icon": "../img/u/417/1.png"
      },
      {
        "unitId": 417,
        "form": 3,
        "name": "초지하전대 그란돈",
        "icon": "../img/u/417/2.png"
      },
      {
        "unitId": 417,
        "form": 4,
        "name": "극지하전대 그란돈",
        "icon": "../img/u/417/3.png"
      }
    ],
    "418": [
      {
        "unitId": 418,
        "form": 1,
        "name": "광란의 귀여미",
        "icon": "../img/u/418/0.png"
      },
      {
        "unitId": 418,
        "form": 2,
        "name": "광란의 스타 귀여미",
        "icon": "../img/u/418/1.png"
      }
    ],
    "427": [
      {
        "unitId": 427,
        "form": 1,
        "name": "고양이 퀘스트",
        "icon": "../img/u/427/0.png"
      },
      {
        "unitId": 427,
        "form": 2,
        "name": "고양이 퀘스트XI",
        "icon": "../img/u/427/1.png"
      },
      {
        "unitId": 427,
        "form": 3,
        "name": "고양이 퀘스트XI-2",
        "icon": "../img/u/427/2.png"
      },
      {
        "unitId": 427,
        "form": 4,
        "name": "고양이 퀘스트 헤븐",
        "icon": "../img/u/427/3.png"
      }
    ],
    "431": [
      {
        "unitId": 431,
        "form": 1,
        "name": "망자탐정 비그라",
        "icon": "../img/u/431/0.png"
      },
      {
        "unitId": 431,
        "form": 2,
        "name": "마계탐정 그라비",
        "icon": "../img/u/431/1.png"
      },
      {
        "unitId": 431,
        "form": 3,
        "name": "마신탐정 그라티비",
        "icon": "../img/u/431/2.png"
      },
      {
        "unitId": 431,
        "form": 4,
        "name": "성마탐정 제로그라티비",
        "icon": "../img/u/431/3.png"
      }
    ],
    "436": [
      {
        "unitId": 436,
        "form": 1,
        "name": "노비루가",
        "icon": "../img/u/436/0.png"
      },
      {
        "unitId": 436,
        "form": 2,
        "name": "노비란파사란",
        "icon": "../img/u/436/1.png"
      },
      {
        "unitId": 436,
        "form": 3,
        "name": "노비란 터번",
        "icon": "../img/u/436/2.png"
      }
    ],
    "439": [
      {
        "unitId": 439,
        "form": 1,
        "name": "시간의 신 크로노스",
        "icon": "../img/u/439/0.png"
      },
      {
        "unitId": 439,
        "form": 2,
        "name": "크로노스 트리거",
        "icon": "../img/u/439/1.png"
      },
      {
        "unitId": 439,
        "form": 3,
        "name": "G크로노스 트리거",
        "icon": "../img/u/439/2.png"
      }
    ],
    "442": [
      {
        "unitId": 442,
        "form": 1,
        "name": "유모차 고양이",
        "icon": "../img/u/442/0.png"
      },
      {
        "unitId": 442,
        "form": 2,
        "name": "음료 카트 고양이",
        "icon": "../img/u/442/1.png"
      },
      {
        "unitId": 442,
        "form": 3,
        "name": "바캉스 고양이",
        "icon": "../img/u/442/2.png"
      }
    ],
    "443": [
      {
        "unitId": 443,
        "form": 1,
        "name": "전대 드릴러",
        "icon": "../img/u/443/0.png"
      },
      {
        "unitId": 443,
        "form": 2,
        "name": "전대 파워 드릴러",
        "icon": "../img/u/443/1.png"
      },
      {
        "unitId": 443,
        "form": 3,
        "name": "신 파워 드릴러",
        "icon": "../img/u/443/2.png"
      }
    ],
    "444": [
      {
        "unitId": 444,
        "form": 1,
        "name": "전대 드라이버",
        "icon": "../img/u/444/0.png"
      },
      {
        "unitId": 444,
        "form": 2,
        "name": "전대 파워 드라이버",
        "icon": "../img/u/444/1.png"
      },
      {
        "unitId": 444,
        "form": 3,
        "name": "신 파워 드라이버",
        "icon": "../img/u/444/2.png"
      }
    ],
    "445": [
      {
        "unitId": 445,
        "form": 1,
        "name": "전대 커터 고양이",
        "icon": "../img/u/445/0.png"
      },
      {
        "unitId": 445,
        "form": 2,
        "name": "전대 파워 커터 고양이",
        "icon": "../img/u/445/1.png"
      },
      {
        "unitId": 445,
        "form": 3,
        "name": "신 파워 커터 고양이",
        "icon": "../img/u/445/2.png"
      }
    ],
    "446": [
      {
        "unitId": 446,
        "form": 1,
        "name": "전대 포클레인 고양이",
        "icon": "../img/u/446/0.png"
      },
      {
        "unitId": 446,
        "form": 2,
        "name": "전대 파워 포클레인 고양이",
        "icon": "../img/u/446/1.png"
      },
      {
        "unitId": 446,
        "form": 3,
        "name": "신 파워 포클레인 고양이",
        "icon": "../img/u/446/2.png"
      }
    ],
    "447": [
      {
        "unitId": 447,
        "form": 1,
        "name": "전대 직쏘고양이",
        "icon": "../img/u/447/0.png"
      },
      {
        "unitId": 447,
        "form": 2,
        "name": "전대 파워 직쏘고양이",
        "icon": "../img/u/447/1.png"
      },
      {
        "unitId": 447,
        "form": 3,
        "name": "신  파워 직쏘고양이",
        "icon": "../img/u/447/2.png"
      }
    ],
    "452": [
      {
        "unitId": 452,
        "form": 1,
        "name": "고대 고양이",
        "icon": "../img/u/452/0.png"
      },
      {
        "unitId": 452,
        "form": 2,
        "name": "현대 고양이",
        "icon": "../img/u/452/1.png"
      },
      {
        "unitId": 452,
        "form": 3,
        "name": "미래 고양이",
        "icon": "../img/u/452/2.png"
      }
    ],
    "495": [
      {
        "unitId": 495,
        "form": 1,
        "name": "고양이 마타도르",
        "icon": "../img/u/495/0.png"
      },
      {
        "unitId": 495,
        "form": 2,
        "name": "고양이 플라멩코",
        "icon": "../img/u/495/1.png"
      },
      {
        "unitId": 495,
        "form": 3,
        "name": "고양이 벨리댄스",
        "icon": "../img/u/495/2.png"
      }
    ],
    "496": [
      {
        "unitId": 496,
        "form": 1,
        "name": "미네르바",
        "icon": "../img/u/496/0.png"
      },
      {
        "unitId": 496,
        "form": 2,
        "name": "분노의 미네르바",
        "icon": "../img/u/496/1.png"
      },
      {
        "unitId": 496,
        "form": 3,
        "name": "호염의 미네르바",
        "icon": "../img/u/496/2.png"
      },
      {
        "unitId": 496,
        "form": 4,
        "name": "연옥무쌍 미네르바",
        "icon": "../img/u/496/3.png"
      }
    ],
    "502": [
      {
        "unitId": 502,
        "form": 1,
        "name": "멜슈",
        "icon": "../img/u/502/0.png"
      },
      {
        "unitId": 502,
        "form": 2,
        "name": "멜슈ξ",
        "icon": "../img/u/502/1.png"
      },
      {
        "unitId": 502,
        "form": 3,
        "name": "럭셔리 멜슈ξ",
        "icon": "../img/u/502/2.png"
      }
    ],
    "505": [
      {
        "unitId": 505,
        "form": 1,
        "name": "각룡 그라디오스",
        "icon": "../img/u/505/0.png"
      },
      {
        "unitId": 505,
        "form": 2,
        "name": "각룡왕 그라디오스",
        "icon": "../img/u/505/1.png"
      },
      {
        "unitId": 505,
        "form": 3,
        "name": "각룡황제 그라디오스",
        "icon": "../img/u/505/2.png"
      }
    ],
    "519": [
      {
        "unitId": 519,
        "form": 1,
        "name": "라스트 보스",
        "icon": "../img/u/519/0.png"
      },
      {
        "unitId": 519,
        "form": 2,
        "name": "파이널 라스트 보스",
        "icon": "../img/u/519/1.png"
      },
      {
        "unitId": 519,
        "form": 3,
        "name": "신 라스트 보스",
        "icon": "../img/u/519/2.png"
      }
    ],
    "525": [
      {
        "unitId": 525,
        "form": 1,
        "name": "긴타로",
        "icon": "../img/u/525/0.png"
      },
      {
        "unitId": 525,
        "form": 2,
        "name": "맹총전대 긴레인저",
        "icon": "../img/u/525/1.png"
      },
      {
        "unitId": 525,
        "form": 3,
        "name": "초총전대 긴레인저",
        "icon": "../img/u/525/2.png"
      }
    ],
    "528": [
      {
        "unitId": 528,
        "form": 1,
        "name": "고양이 코사크",
        "icon": "../img/u/528/0.png"
      },
      {
        "unitId": 528,
        "form": 2,
        "name": "고양이 보드카",
        "icon": "../img/u/528/1.png"
      },
      {
        "unitId": 528,
        "form": 3,
        "name": "고양이 근위병",
        "icon": "../img/u/528/2.png"
      }
    ],
    "531": [
      {
        "unitId": 531,
        "form": 1,
        "name": "네코쿠마",
        "icon": "../img/u/531/0.png"
      },
      {
        "unitId": 531,
        "form": 2,
        "name": "네코 블랙쿠마",
        "icon": "../img/u/531/1.png"
      },
      {
        "unitId": 531,
        "form": 3,
        "name": "네코 프랑켄슈타인 베어",
        "icon": "../img/u/531/2.png"
      }
    ],
    "534": [
      {
        "unitId": 534,
        "form": 1,
        "name": "명계신 하데스",
        "icon": "../img/u/534/0.png"
      },
      {
        "unitId": 534,
        "form": 2,
        "name": "데스 하데스",
        "icon": "../img/u/534/1.png"
      },
      {
        "unitId": 534,
        "form": 3,
        "name": "G데스 하데스",
        "icon": "../img/u/534/2.png"
      }
    ],
    "542": [
      {
        "unitId": 542,
        "form": 1,
        "name": "ネコ少年",
        "icon": "../img/u/542/0.png"
      },
      {
        "unitId": 542,
        "form": 2,
        "name": "ネコ学生",
        "icon": "../img/u/542/1.png"
      }
    ],
    "545": [
      {
        "unitId": 545,
        "form": 1,
        "name": "팬텀 고양이",
        "icon": "../img/u/545/0.png"
      },
      {
        "unitId": 545,
        "form": 2,
        "name": "연기 고양이",
        "icon": "../img/u/545/1.png"
      },
      {
        "unitId": 545,
        "form": 3,
        "name": "고양이 버블",
        "icon": "../img/u/545/2.png"
      }
    ],
    "558": [
      {
        "unitId": 558,
        "form": 1,
        "name": "레어 뽑기 고양이",
        "icon": "../img/u/558/0.png"
      },
      {
        "unitId": 558,
        "form": 2,
        "name": "럭키 뽑기 고양이",
        "icon": "../img/u/558/1.png"
      }
    ],
    "559": [
      {
        "unitId": 559,
        "form": 1,
        "name": "지옥 경찰 엠마",
        "icon": "../img/u/559/0.png"
      },
      {
        "unitId": 559,
        "form": 2,
        "name": "지옥 중사 엠마",
        "icon": "../img/u/559/1.png"
      },
      {
        "unitId": 559,
        "form": 3,
        "name": "염라 대장 엠마",
        "icon": "../img/u/559/2.png"
      }
    ],
    "569": [
      {
        "unitId": 569,
        "form": 1,
        "name": "돌의 정령 롤링스톤",
        "icon": "../img/u/569/0.png"
      },
      {
        "unitId": 569,
        "form": 2,
        "name": "암석의 정령 락앤롤",
        "icon": "../img/u/569/1.png"
      },
      {
        "unitId": 569,
        "form": 3,
        "name": "암석의 정령왕 스톤헨지",
        "icon": "../img/u/569/2.png"
      }
    ],
    "594": [
      {
        "unitId": 594,
        "form": 1,
        "name": "공중상사 콜럼버스",
        "icon": "../img/u/594/0.png"
      },
      {
        "unitId": 594,
        "form": 2,
        "name": "수송병단 아틀란티스",
        "icon": "../img/u/594/1.png"
      },
      {
        "unitId": 594,
        "form": 3,
        "name": "초수송병단 아틀란티스",
        "icon": "../img/u/594/2.png"
      }
    ],
    "607": [
      {
        "unitId": 607,
        "form": 1,
        "name": "모험가 칸나",
        "icon": "../img/u/607/0.png"
      },
      {
        "unitId": 607,
        "form": 2,
        "name": "대모험 소녀 칸나",
        "icon": "../img/u/607/1.png"
      },
      {
        "unitId": 607,
        "form": 3,
        "name": "전설의 모험 소녀 칸나",
        "icon": "../img/u/607/2.png"
      }
    ],
    "617": [
      {
        "unitId": 617,
        "form": 1,
        "name": "소환소년 사토루",
        "icon": "../img/u/617/0.png"
      },
      {
        "unitId": 617,
        "form": 2,
        "name": "악마 소환소년 사토루",
        "icon": "../img/u/617/1.png"
      },
      {
        "unitId": 617,
        "form": 3,
        "name": "데빌 헌터 사토루",
        "icon": "../img/u/617/2.png"
      }
    ],
    "618": [
      {
        "unitId": 618,
        "form": 1,
        "name": "아레스",
        "icon": "../img/u/618/0.png"
      },
      {
        "unitId": 618,
        "form": 2,
        "name": "마신 아레스",
        "icon": "../img/u/618/1.png"
      },
      {
        "unitId": 618,
        "form": 3,
        "name": "원망의 마신 아레스",
        "icon": "../img/u/618/2.png"
      }
    ],
    "619": [
      {
        "unitId": 619,
        "form": 1,
        "name": "리린",
        "icon": "../img/u/619/0.png"
      },
      {
        "unitId": 619,
        "form": 2,
        "name": "리린π",
        "icon": "../img/u/619/1.png"
      },
      {
        "unitId": 619,
        "form": 3,
        "name": "와이즈 리린π",
        "icon": "../img/u/619/2.png"
      }
    ],
    "620": [
      {
        "unitId": 620,
        "form": 1,
        "name": "사룡 헤비저크",
        "icon": "../img/u/620/0.png"
      },
      {
        "unitId": 620,
        "form": 2,
        "name": "사룡왕 헤비저크",
        "icon": "../img/u/620/1.png"
      },
      {
        "unitId": 620,
        "form": 3,
        "name": "사룡황제 헤비저크",
        "icon": "../img/u/620/2.png"
      }
    ],
    "621": [
      {
        "unitId": 621,
        "form": 1,
        "name": "악마연구가",
        "icon": "../img/u/621/0.png"
      },
      {
        "unitId": 621,
        "form": 2,
        "name": "사악한 악마연구가",
        "icon": "../img/u/621/1.png"
      },
      {
        "unitId": 621,
        "form": 3,
        "name": "냥코 연구가",
        "icon": "../img/u/621/2.png"
      }
    ],
    "624": [
      {
        "unitId": 624,
        "form": 1,
        "name": "열혈경파 쿠니오군",
        "icon": "../img/u/624/0.png"
      },
      {
        "unitId": 624,
        "form": 2,
        "name": "피구부 쿠니오군",
        "icon": "../img/u/624/1.png"
      }
    ],
    "625": [
      {
        "unitId": 625,
        "form": 1,
        "name": "오코루가",
        "icon": "../img/u/625/0.png"
      },
      {
        "unitId": 625,
        "form": 2,
        "name": "오코란파사란",
        "icon": "../img/u/625/1.png"
      },
      {
        "unitId": 625,
        "form": 3,
        "name": "극대노 파사란",
        "icon": "../img/u/625/2.png"
      }
    ],
    "626": [
      {
        "unitId": 626,
        "form": 1,
        "name": "ネコキリンモドキ",
        "icon": "../img/u/626/0.png"
      },
      {
        "unitId": 626,
        "form": 2,
        "name": "駿馬ネコキリンモドキ",
        "icon": "../img/u/626/1.png"
      }
    ],
    "627": [
      {
        "unitId": 627,
        "form": 1,
        "name": "ネコノトリッキー",
        "icon": "../img/u/627/0.png"
      },
      {
        "unitId": 627,
        "form": 2,
        "name": "天馬ネコノトリッキー",
        "icon": "../img/u/627/1.png"
      }
    ],
    "628": [
      {
        "unitId": 628,
        "form": 1,
        "name": "ネコノドラゴーン",
        "icon": "../img/u/628/0.png"
      },
      {
        "unitId": 628,
        "form": 2,
        "name": "名馬ネコノドラゴーン",
        "icon": "../img/u/628/1.png"
      }
    ],
    "631": [
      {
        "unitId": 631,
        "form": 1,
        "name": "어둠의 정령 야미",
        "icon": "../img/u/631/0.png"
      },
      {
        "unitId": 631,
        "form": 2,
        "name": "암흑의 정령 야미누아르",
        "icon": "../img/u/631/1.png"
      },
      {
        "unitId": 631,
        "form": 3,
        "name": "암흑의 정령왕 야미슈발츠",
        "icon": "../img/u/631/2.png"
      }
    ],
    "632": [
      {
        "unitId": 632,
        "form": 1,
        "name": "초용전기 데스 트로이",
        "icon": "../img/u/632/0.png"
      },
      {
        "unitId": 632,
        "form": 2,
        "name": "전자전기 디아 볼로스",
        "icon": "../img/u/632/1.png"
      },
      {
        "unitId": 632,
        "form": 3,
        "name": "초전자전기 디아 볼로스",
        "icon": "../img/u/632/2.png"
      }
    ],
    "633": [
      {
        "unitId": 633,
        "form": 1,
        "name": "혀 잘린 참새",
        "icon": "../img/u/633/0.png"
      },
      {
        "unitId": 633,
        "form": 2,
        "name": "요괴 결사 짹짹",
        "icon": "../img/u/633/1.png"
      },
      {
        "unitId": 633,
        "form": 3,
        "name": "대요괴 결사 짹짹",
        "icon": "../img/u/633/2.png"
      }
    ],
    "634": [
      {
        "unitId": 634,
        "form": 1,
        "name": "백기사 키클롭스",
        "icon": "../img/u/634/0.png"
      },
      {
        "unitId": 634,
        "form": 2,
        "name": "흑기사 키클롭스",
        "icon": "../img/u/634/1.png"
      },
      {
        "unitId": 634,
        "form": 3,
        "name": "신마기사 키클롭스",
        "icon": "../img/u/634/2.png"
      }
    ],
    "642": [
      {
        "unitId": 642,
        "form": 1,
        "name": "타락 천신 루시퍼",
        "icon": "../img/u/642/0.png"
      },
      {
        "unitId": 642,
        "form": 2,
        "name": "그랜드 루시퍼",
        "icon": "../img/u/642/1.png"
      },
      {
        "unitId": 642,
        "form": 3,
        "name": "G그랜드 루시퍼",
        "icon": "../img/u/642/2.png"
      }
    ],
    "647": [
      {
        "unitId": 647,
        "form": 1,
        "name": "테룬",
        "icon": "../img/u/647/0.png"
      },
      {
        "unitId": 647,
        "form": 2,
        "name": "테룬ζ",
        "icon": "../img/u/647/1.png"
      },
      {
        "unitId": 647,
        "form": 3,
        "name": "헌트리스 테룬ζ",
        "icon": "../img/u/647/2.png"
      }
    ],
    "649": [
      {
        "unitId": 649,
        "form": 1,
        "name": "흑표",
        "icon": "../img/u/649/0.png"
      },
      {
        "unitId": 649,
        "form": 2,
        "name": "분노의 흑표",
        "icon": "../img/u/649/1.png"
      },
      {
        "unitId": 649,
        "form": 3,
        "name": "절영의 흑표",
        "icon": "../img/u/649/2.png"
      }
    ],
    "650": [
      {
        "unitId": 650,
        "form": 1,
        "name": "소꿉친구 냥코",
        "icon": "../img/u/650/0.png"
      },
      {
        "unitId": 650,
        "form": 2,
        "name": "여자친구 냥코",
        "icon": "../img/u/650/1.png"
      }
    ],
    "651": [
      {
        "unitId": 651,
        "form": 1,
        "name": "말괄량이 고양이 라이온",
        "icon": "../img/u/651/0.png"
      },
      {
        "unitId": 651,
        "form": 2,
        "name": "철가면 고양이 라이온",
        "icon": "../img/u/651/1.png"
      }
    ],
    "652": [
      {
        "unitId": 652,
        "form": 1,
        "name": "고양이 칠판지우개",
        "icon": "../img/u/652/0.png"
      },
      {
        "unitId": 652,
        "form": 2,
        "name": "고양이 칠판대장",
        "icon": "../img/u/652/1.png"
      }
    ],
    "655": [
      {
        "unitId": 655,
        "form": 1,
        "name": "얼음의 정령 블리즈",
        "icon": "../img/u/655/0.png"
      },
      {
        "unitId": 655,
        "form": 2,
        "name": "빙결의 정령 블리자나",
        "icon": "../img/u/655/1.png"
      },
      {
        "unitId": 655,
        "form": 3,
        "name": "빙결의 정령왕 블리자레나",
        "icon": "../img/u/655/2.png"
      }
    ],
    "658": [
      {
        "unitId": 658,
        "form": 1,
        "name": "오래된 알: N101",
        "icon": "../img/s/0/0.png"
      },
      {
        "unitId": 658,
        "form": 2,
        "name": "붉은 알: N101",
        "icon": "../img/s/2/1.png"
      },
      {
        "unitId": 658,
        "form": 3,
        "name": "배달 고양이",
        "icon": "../img/u/658/2.png"
      }
    ],
    "659": [
      {
        "unitId": 659,
        "form": 1,
        "name": "오래된 알: N102",
        "icon": "../img/s/0/0.png"
      },
      {
        "unitId": 659,
        "form": 2,
        "name": "푸른 알: N102",
        "icon": "../img/s/7/1.png"
      },
      {
        "unitId": 659,
        "form": 3,
        "name": "고양이 타장",
        "icon": "../img/u/659/2.png"
      }
    ],
    "660": [
      {
        "unitId": 660,
        "form": 1,
        "name": "해룡 다라이어던",
        "icon": "../img/u/660/0.png"
      },
      {
        "unitId": 660,
        "form": 2,
        "name": "해룡왕 다라이어던",
        "icon": "../img/u/660/1.png"
      },
      {
        "unitId": 660,
        "form": 3,
        "name": "해룡황제 다라이어던",
        "icon": "../img/u/660/2.png"
      }
    ],
    "663": [
      {
        "unitId": 663,
        "form": 1,
        "name": "오래된 알: N103",
        "icon": "../img/s/0/0.png"
      },
      {
        "unitId": 663,
        "form": 2,
        "name": "검은 알: N103",
        "icon": "../img/s/4/1.png"
      },
      {
        "unitId": 663,
        "form": 3,
        "name": "고양이 방독면",
        "icon": "../img/u/663/2.png"
      }
    ],
    "665": [
      {
        "unitId": 665,
        "form": 1,
        "name": "오래된 알: N201",
        "icon": "../img/s/0/0.png"
      },
      {
        "unitId": 665,
        "form": 2,
        "name": "악의 알: N201",
        "icon": "../img/s/9/1.png"
      },
      {
        "unitId": 665,
        "form": 3,
        "name": "냥소시스트",
        "icon": "../img/u/665/2.png"
      }
    ],
    "668": [
      {
        "unitId": 668,
        "form": 1,
        "name": "고양이 텐구",
        "icon": "../img/u/668/0.png"
      },
      {
        "unitId": 668,
        "form": 2,
        "name": "대요괴 고양이 텐구",
        "icon": "../img/u/668/1.png"
      },
      {
        "unitId": 668,
        "form": 3,
        "name": "대신선 고양이 텐구",
        "icon": "../img/u/668/2.png"
      }
    ],
    "669": [
      {
        "unitId": 669,
        "form": 1,
        "name": "오래된 알: N003",
        "icon": "../img/s/0/0.png"
      },
      {
        "unitId": 669,
        "form": 2,
        "name": "악의 알: N003",
        "icon": "../img/s/9/1.png"
      },
      {
        "unitId": 669,
        "form": 3,
        "name": "고양이 선인장",
        "icon": "../img/u/669/2.png"
      }
    ],
    "674": [
      {
        "unitId": 674,
        "form": 1,
        "name": "유랑극단 캐러셀즈",
        "icon": "../img/u/674/0.png"
      },
      {
        "unitId": 674,
        "form": 2,
        "name": "기습괴광 유에포즈",
        "icon": "../img/u/674/1.png"
      },
      {
        "unitId": 674,
        "form": 3,
        "name": "초기습괴광 유에포즈",
        "icon": "../img/u/674/2.png"
      }
    ],
    "675": [
      {
        "unitId": 675,
        "form": 1,
        "name": "오래된 알: N105",
        "icon": "../img/s/0/0.png"
      },
      {
        "unitId": 675,
        "form": 2,
        "name": "푸른 알: N105",
        "icon": "../img/s/7/1.png"
      },
      {
        "unitId": 675,
        "form": 3,
        "name": "고양이 스매시",
        "icon": "../img/u/675/2.png"
      }
    ],
    "682": [
      {
        "unitId": 682,
        "form": 1,
        "name": "여신 베가",
        "icon": "../img/u/682/0.png"
      },
      {
        "unitId": 682,
        "form": 2,
        "name": "환영의 가호여신 베가",
        "icon": "../img/u/682/1.png"
      },
      {
        "unitId": 682,
        "form": 3,
        "name": "허영의 가호여신 베가",
        "icon": "../img/u/682/2.png"
      }
    ],
    "689": [
      {
        "unitId": 689,
        "form": 1,
        "name": "10년이면 고양이",
        "icon": "../img/u/689/0.png"
      },
      {
        "unitId": 689,
        "form": 2,
        "name": "10년이면 고양이 동상",
        "icon": "../img/u/689/1.png"
      }
    ],
    "692": [
      {
        "unitId": 692,
        "form": 1,
        "name": "엄지 동자",
        "icon": "../img/u/692/0.png"
      },
      {
        "unitId": 692,
        "form": 2,
        "name": "귀습잠수함 방망-E",
        "icon": "../img/u/692/1.png"
      },
      {
        "unitId": 692,
        "form": 3,
        "name": "귀습전투함 방망-E",
        "icon": "../img/u/692/2.png"
      }
    ],
    "696": [
      {
        "unitId": 696,
        "form": 1,
        "name": "고양이 반장",
        "icon": "../img/u/696/0.png"
      },
      {
        "unitId": 696,
        "form": 2,
        "name": "불량 고양이 반장",
        "icon": "../img/u/696/1.png"
      }
    ],
    "697": [
      {
        "unitId": 697,
        "form": 1,
        "name": "오래된 알: N107",
        "icon": "../img/s/0/0.png"
      },
      {
        "unitId": 697,
        "form": 2,
        "name": "보라색 알: N107",
        "icon": "../img/s/8/1.png"
      },
      {
        "unitId": 697,
        "form": 3,
        "name": "고양이 촌장",
        "icon": "../img/u/697/2.png"
      }
    ],
    "698": [
      {
        "unitId": 698,
        "form": 1,
        "name": "썬더 잭",
        "icon": "../img/u/698/0.png"
      },
      {
        "unitId": 698,
        "form": 2,
        "name": "블러디 잭",
        "icon": "../img/u/698/1.png"
      },
      {
        "unitId": 698,
        "form": 3,
        "name": "라이트닝 잭",
        "icon": "../img/u/698/2.png"
      }
    ],
    "712": [
      {
        "unitId": 712,
        "form": 1,
        "name": "카오루가",
        "icon": "../img/u/712/0.png"
      },
      {
        "unitId": 712,
        "form": 2,
        "name": "카오란파사란",
        "icon": "../img/u/712/1.png"
      },
      {
        "unitId": 712,
        "form": 3,
        "name": "카오란타타란",
        "icon": "../img/u/712/2.png"
      }
    ],
    "715": [
      {
        "unitId": 715,
        "form": 1,
        "name": "건설병단 스핑크스",
        "icon": "../img/u/715/0.png"
      },
      {
        "unitId": 715,
        "form": 2,
        "name": "돌격부대 콘보이즈",
        "icon": "../img/u/715/1.png"
      },
      {
        "unitId": 715,
        "form": 3,
        "name": "초돌격부대 콘보이즈",
        "icon": "../img/u/715/2.png"
      }
    ],
    "719": [
      {
        "unitId": 719,
        "form": 1,
        "name": "철의 정령 메탈릭",
        "icon": "../img/u/719/0.png"
      },
      {
        "unitId": 719,
        "form": 2,
        "name": "강철의 정령 헤비메탈",
        "icon": "../img/u/719/1.png"
      },
      {
        "unitId": 719,
        "form": 3,
        "name": "강철의 정령왕 파워메탈",
        "icon": "../img/u/719/2.png"
      }
    ],
    "721": [
      {
        "unitId": 721,
        "form": 1,
        "name": "화원고교 번장 리키",
        "icon": "../img/u/721/0.png"
      },
      {
        "unitId": 721,
        "form": 2,
        "name": "피구부 리키",
        "icon": "../img/u/721/1.png"
      }
    ],
    "723": [
      {
        "unitId": 723,
        "form": 1,
        "name": "광익신 이시스",
        "icon": "../img/u/723/0.png"
      },
      {
        "unitId": 723,
        "form": 2,
        "name": "네페르 이시스",
        "icon": "../img/u/723/1.png"
      },
      {
        "unitId": 723,
        "form": 3,
        "name": "G네페르 이시스",
        "icon": "../img/u/723/2.png"
      }
    ],
    "725": [
      {
        "unitId": 725,
        "form": 1,
        "name": "닌자아가씨 토모에",
        "icon": "../img/u/725/0.png"
      },
      {
        "unitId": 725,
        "form": 2,
        "name": "식도락 닌자 토모에",
        "icon": "../img/u/725/1.png"
      },
      {
        "unitId": 725,
        "form": 3,
        "name": "미식극락 닌자 토모에",
        "icon": "../img/u/725/2.png"
      }
    ],
    "733": [
      {
        "unitId": 733,
        "form": 1,
        "name": "페가사",
        "icon": "../img/u/733/0.png"
      },
      {
        "unitId": 733,
        "form": 2,
        "name": "페가사ν",
        "icon": "../img/u/733/1.png"
      },
      {
        "unitId": 733,
        "form": 3,
        "name": "요람의 페가사ν",
        "icon": "../img/u/733/2.png"
      }
    ],
    "735": [
      {
        "unitId": 735,
        "form": 1,
        "name": "고양이 교장",
        "icon": "../img/u/735/0.png"
      },
      {
        "unitId": 735,
        "form": 2,
        "name": "고양이 세컨드 라이프",
        "icon": "../img/u/735/1.png"
      }
    ],
    "754": [
      {
        "unitId": 754,
        "form": 1,
        "name": "알리칸토",
        "icon": "../img/u/754/0.png"
      },
      {
        "unitId": 754,
        "form": 2,
        "name": "분노의 알리칸토",
        "icon": "../img/u/754/1.png"
      },
      {
        "unitId": 754,
        "form": 3,
        "name": "지략의 알리칸토",
        "icon": "../img/u/754/2.png"
      }
    ],
    "760": [
      {
        "unitId": 760,
        "form": 1,
        "name": "포룡 건듀로스",
        "icon": "../img/u/760/0.png"
      },
      {
        "unitId": 760,
        "form": 2,
        "name": "포룡왕 건듀로스",
        "icon": "../img/u/760/1.png"
      }
    ],
    "763": [
      {
        "unitId": 763,
        "form": 1,
        "name": "고양이 다이너사우루스",
        "icon": "../img/u/763/0.png"
      },
      {
        "unitId": 763,
        "form": 2,
        "name": "메카 고양이 다이너사우루스",
        "icon": "../img/u/763/1.png"
      }
    ],
    "769": [
      {
        "unitId": 769,
        "form": 1,
        "name": "냥꽃 할배",
        "icon": "../img/u/769/0.png"
      },
      {
        "unitId": 769,
        "form": 2,
        "name": "폭식괴수 빅트리",
        "icon": "../img/u/769/1.png"
      }
    ],
    "774": [
      {
        "unitId": 774,
        "form": 1,
        "name": "특수기동대 엑셀",
        "icon": "../img/u/774/0.png"
      },
      {
        "unitId": 774,
        "form": 2,
        "name": "더티 엑셀",
        "icon": "../img/u/774/1.png"
      }
    ],
    "781": [
      {
        "unitId": 781,
        "form": 1,
        "name": "마모루가",
        "icon": "../img/u/781/0.png"
      },
      {
        "unitId": 781,
        "form": 2,
        "name": "마모란파사란",
        "icon": "../img/u/781/1.png"
      }
    ],
    "784": [
      {
        "unitId": 784,
        "form": 1,
        "name": "チョコサプネコC",
        "icon": "../img/u/784/0.png"
      },
      {
        "unitId": 784,
        "form": 2,
        "name": "チョコサプネコF",
        "icon": "../img/u/784/1.png"
      }
    ],
    "799": [
      {
        "unitId": 799,
        "form": 1,
        "name": "곡사포대 런처즈",
        "icon": "../img/u/799/0.png"
      },
      {
        "unitId": 799,
        "form": 2,
        "name": "영격포대 건하우저",
        "icon": "../img/u/799/1.png"
      }
    ],
    "831": [
      {
        "unitId": 831,
        "form": 1,
        "name": "스카프 냥코",
        "icon": "../img/u/831/0.png"
      },
      {
        "unitId": 831,
        "form": 2,
        "name": "레드 냥코",
        "icon": "../img/u/831/1.png"
      }
    ],
    "832": [
      {
        "unitId": 832,
        "form": 1,
        "name": "페도라 냥코",
        "icon": "../img/u/832/0.png"
      },
      {
        "unitId": 832,
        "form": 2,
        "name": "블루 냥코",
        "icon": "../img/u/832/1.png"
      }
    ],
    "833": [
      {
        "unitId": 833,
        "form": 1,
        "name": "헬멧 냥코",
        "icon": "../img/u/833/0.png"
      },
      {
        "unitId": 833,
        "form": 2,
        "name": "옐로 냥코",
        "icon": "../img/u/833/1.png"
      }
    ],
    "834": [
      {
        "unitId": 834,
        "form": 1,
        "name": "고글 냥코",
        "icon": "../img/u/834/0.png"
      },
      {
        "unitId": 834,
        "form": 2,
        "name": "그린 냥코",
        "icon": "../img/u/834/1.png"
      }
    ],
    "835": [
      {
        "unitId": 835,
        "form": 1,
        "name": "리본 냥코",
        "icon": "../img/u/835/0.png"
      },
      {
        "unitId": 835,
        "form": 2,
        "name": "핑크 냥코",
        "icon": "../img/u/835/1.png"
      }
    ],
    "857": [
      {
        "unitId": 857,
        "form": 1,
        "name": "バリスタにゃんこ",
        "icon": "../img/u/857/0.png"
      },
      {
        "unitId": 857,
        "form": 2,
        "name": "シルバーにゃんこ",
        "icon": "../img/u/857/1.png"
      }
    ],
    "858": [
      {
        "unitId": 858,
        "form": 1,
        "name": "司令官にゃんこ",
        "icon": "../img/u/858/0.png"
      },
      {
        "unitId": 858,
        "form": 2,
        "name": "ゴールドにゃんこ",
        "icon": "../img/u/858/1.png"
      }
    ],
    "866": [
      {
        "unitId": 866,
        "form": 1,
        "name": "PAC-MAN",
        "icon": "../img/u/866/0.png"
      },
      {
        "unitId": 866,
        "form": 2,
        "name": "PAC-MAN 고양이",
        "icon": "../img/u/866/1.png"
      }
    ],
    "874": [
      {
        "unitId": 874,
        "form": 1,
        "name": "류이치",
        "icon": "../img/u/874/0.png"
      },
      {
        "unitId": 874,
        "form": 2,
        "name": "류이치 & 류지",
        "icon": "../img/u/874/1.png"
      }
    ],
    "880": [
      {
        "unitId": 880,
        "form": 1,
        "name": "志々雄真実",
        "icon": "../img/u/880/0.png"
      },
      {
        "unitId": 880,
        "form": 2,
        "name": "志々雄真実CC",
        "icon": "../img/u/880/1.png"
      }
    ]
  }
};
