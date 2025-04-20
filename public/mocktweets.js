const mockTweets = [
    {
      id: '1',
      username: 'IGN',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1897355924479606785/0BEB1k_h_400x400.jpg',
      content: "Just dropped our review of Elden Ring: Shadow of the Erdtree — it's brutal, beautiful, and bold. 🌌🔥",
      created_at: '2025-04-19T10:05:00Z',
      favorites: 142,
      comments: []
    },
    {
      id: '2',
      username: 'PlayStation',
      profile_image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg',
      content: "The PS5 Pro is real and it's coming sooner than you think 👀 Stay tuned.",
      created_at: '2025-04-19T09:45:00Z',
      favorites: 220,
      comments: []
    },
    {
      id: '3',
      username: 'Kotaku',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1145899315006717952/ozxwJgmx_400x400.png',
      content: "Tears of the Kingdom modders are getting WILD. Someone turned Link into Goku.",
      created_at: '2025-04-19T08:30:00Z',
      favorites: 98,
      comments: []
    },
    {
      id: '4',
      username: 'xbox',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1911118827049390081/caSgMV59_400x400.jpg',
      content: "Get ready for Game Pass April drops — including a surprise release 👾",
      created_at: '2025-04-18T22:00:00Z',
      favorites: 174,
      comments: []
    },
    {
      id: '5',
      username: 'nintendo',
      profile_image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg',
      content: "We’re not saying Mario Kart 9 is in development... but we’re not not saying it. 🏁🍄",
      created_at: '2025-04-18T20:15:00Z',
      favorites: 310,
      comments: []
    },
    {
      id: '6',
      username: 'GameSpot',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1828825064914997248/2rurCf2y_400x400.jpg',
      content: "Cyberpunk 2077’s Phantom Liberty DLC is shaping up to be everything we wanted at launch — finally. 🌃💾",
      created_at: '2025-04-19T11:20:00Z',
      favorites: 201,
      comments: []
    },
    {
      id: '7',
      username: 'RockstarGames',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1417471791845478403/MzAWCfK7_400x400.jpg',
      content: "First teaser for GTA VI drops this week. The streets of Vice City await. 🚓🌴",
      created_at: '2025-04-19T10:50:00Z',
      favorites: 387,
      comments: []
    },
    {
      id: '8',
      username: 'GameInformer',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1904604082377023488/AKr_ZNdi_400x400.jpg',
      content: "Dragon Age: Dreadwolf is bringing back tactical combat and fan-favorite companions 🐺🛡️",
      created_at: '2025-04-19T10:15:00Z',
      favorites: 129,
      comments: []
    },
    {
      id: '9',
      username: 'bethesda',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1699093473591169024/008GjELD_400x400.png',
      content: "Starfield gets its biggest update yet — more planets, more factions, and a photo mode! 🪐📸",
      created_at: '2025-04-19T09:00:00Z',
      favorites: 265,
      comments: []
    },
    {
      id: '10',
      username: 'Ubisoft',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1902057778895798272/IPbiktoC_400x400.jpg',
      content: "Assassin’s Creed: Nexus leaks suggest full open-world VR experience 🗡️🕶️",
      created_at: '2025-04-19T08:10:00Z',
      favorites: 194,
      comments: []
    },
    {
      id: '11',
      username: 'CapcomUSA',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1890540404568973312/Lvwqr4Es_400x400.jpg',
      content: "Resident Evil 9 announcement coming this summer. Yes, it’s scarier than ever. 🧟‍♂️💀",
      created_at: '2025-04-18T21:50:00Z',
      favorites: 312,
      comments: []
    },
    {
      id: '12',
      username: 'FromSoftware',
      profile_image_url: 'https://pbs.twimg.com/profile_images/875586745479249922/GYekVrNZ_400x400.jpg',
      content: "Armored Core VI DLC teased with a cryptic mech blueprint. 👁️🤖",
      created_at: '2025-04-18T19:40:00Z',
      favorites: 176,
      comments: []
    },
    {
      id: '13',
      username: 'EA',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1863978608097660928/bGtQIxEO_400x400.png',
      content: "Mass Effect 5 will feature cross-galaxy travel and dual protagonists. N7 forever. 🌌💫",
      created_at: '2025-04-18T18:25:00Z',
      favorites: 228,
      comments: []
    },
    {
      id: '14',
      username: 'SquareEnix',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1908139593611788288/AdJS3u8k_400x400.jpg',
      content: "Final Fantasy XVII will be revealed at Tokyo Game Show. Magic and mechs confirmed. ⚔️✨",
      created_at: '2025-04-18T17:00:00Z',
      favorites: 291,
      comments: []
    },
    {
      id: '15',
      username: 'DevolverDigital',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1752756600266203136/zwIE915Y_400x400.jpg',
      content: "We made a game about being stuck in a game conference — it's as weird as it sounds. 🌀🎮",
      created_at: '2025-04-18T16:15:00Z',
      favorites: 142,
      comments: []
    }
  ];
  
  export default mockTweets;