// KADR Studio landing, EN content (sales rewrite, 2026-11).
// Started as a verbatim copy of the live page; now edited copy on the same product facts.
// Visible copy rules: no long dashes, no word «ролик» (except «Проверка ролика» / «Перевірка ролика»), short paragraphs.
import type { SiteContent } from './types.ts'

export const en: SiteContent = {
  lang: "en",
  meta: {
    htmlLang: "en",
    title: "KADR Studio. One sentence. A finished video.",
    description: "Write an idea and KADR Studio makes the whole video: script, voice, frames, music and subtitles. Windows, Mac and KADR Cloud.",
    canonical: "https://kadrstudia8-hue.github.io/landing-en.html",
    alternates: [
      {
        hreflang: "uk",
        href: "https://kadrstudia8-hue.github.io/"
      },
      {
        hreflang: "ru",
        href: "https://kadrstudia8-hue.github.io/landing.html"
      },
      {
        hreflang: "en",
        href: "https://kadrstudia8-hue.github.io/landing-en.html"
      },
      {
        hreflang: "es",
        href: "https://kadrstudia8-hue.github.io/landing-es.html"
      },
      {
        hreflang: "de",
        href: "https://kadrstudia8-hue.github.io/landing-de.html"
      },
      {
        hreflang: "x-default",
        href: "https://kadrstudia8-hue.github.io/"
      }
    ],
    themeColor: "#0e0c0a",
    og: {
      type: "website",
      siteName: "KADR Studio",
      locale: "en_US",
      localeAlternates: [
        "uk_UA",
        "ru_RU",
        "es_ES",
        "de_DE"
      ],
      url: "https://kadrstudia8-hue.github.io/landing-en.html",
      title: "KADR Studio. One sentence. A finished video.",
      description: "Write an idea and KADR Studio makes the whole video: script, voice, frames, music and subtitles. Windows, Mac and KADR Cloud.",
      image: "https://kadrstudia8-hue.github.io/media/reel-en.jpg",
      imageWidth: 960,
      imageHeight: 540
    },
    twitterCard: "summary_large_image",
    preloadImage: "media/hero-en.jpg",
    favicon: "favicon.svg"
  },
  nav: {
    logo: {
      text: "KADR",
      em: "studio",
      href: "#top"
    },
    links: [
      {
        label: "Examples",
        href: "#proof"
      },
      {
        label: "How it works",
        href: "#how"
      },
      {
        label: "Who it's for",
        href: "#who"
      },
      {
        label: "No GPU needed",
        href: "#req"
      },
      {
        label: "Pricing",
        href: "#pricing"
      },
      {
        label: "FAQ",
        href: "#faq"
      }
    ],
    langMenuLabel: "Language",
    langCurrent: {
      full: "English",
      short: "EN"
    },
    cta: {
      label: "Download",
      href: "#download",
      variant: "ghost"
    }
  },
  hero: {
    id: "top",
    tag: "An app for Windows and macOS",
    title: [
      {
        text: "One sentence.",
        nowrap: true
      },
      {
        text: "A finished video.",
        accent: true
      }
    ],
    lead: "Write an idea. KADR Studio makes the script, voice, frames, music and subtitles, then exports an MP4.",
    ctas: [
      {
        label: "Download KADR Studio",
        href: "#download",
        variant: "main",
        osAware: true
      },
      {
        label: "▶ Showreel, 25 s",
        href: "#reel",
        variant: "ghost"
      }
    ],
    note: "Windows and Mac · no ads, no telemetry",
    mobileHint: [
      "KADR Studio runs on a computer. Open this site on a Mac or PC, or ",
      {
        button: "send the link to yourself",
        action: "share"
      },
      "."
    ],
    video: {
      src: "media/hero-en.mp4",
      poster: "media/hero-en.jpg",
      width: 1280,
      height: 720,
      label: "Shots from the film “Why Does Your Brain Make Dreams Feel Real?”, made in KADR Studio"
    },
    caption: "Not stock footage. These are shots from a 17-minute film about dreams, built by KADR Studio from one brief.",
    facts: [
      [
        {
          b: "15 seconds to 30 minutes"
        }
      ],
      [
        {
          b: "9:16 · 16:9 · 1:1 · 4:5"
        }
      ],
      [
        "voices ",
        {
          b: "EN · UK · RU"
        }
      ],
      [
        "runs ",
        {
          b: "without a GPU"
        }
      ],
      [
        "after a power cut it ",
        {
          b: "picks up where it stopped"
        }
      ]
    ],
    badges: [
      "3 free videos",
      "No GPU needed",
      "Windows and Mac",
      "No ads"
    ]
  },
  promises: {
    id: "promises",
    tag: "Why KADR",
    title: "Video without a camera or an editor",
    items: [
      {
        icon: "Clapperboard",
        title: "No filming, no editing",
        text: "You write the idea. KADR handles the script, voice, frames and music."
      },
      {
        icon: "Timer",
        title: "Your first video in 2 minutes",
        text: "A short tutorial walks you from idea to finished MP4."
      },
      {
        icon: "Gift",
        title: "3 videos free",
        text: "Trial mode, no card. Buy once you like what you get."
      },
      {
        icon: "Cloud",
        title: "Runs on any computer",
        text: "Our GPUs in KADR Cloud do the heavy lifting."
      },
      {
        icon: "Film",
        title: "An MP4 for every platform",
        text: "TikTok, Shorts, Reels and YouTube: 9:16, 16:9, 1:1 and 4:5."
      },
      {
        icon: "ShieldCheck",
        title: "No ads, no telemetry",
        text: "Your projects and videos stay on your computer."
      }
    ]
  },
  proof: {
    id: "proof",
    tag: "Real examples",
    title: "One sentence → a video",
    lead: "Real requests and the videos KADR Studio made from them. Typed in Russian, translated here. Tap any one.",
    tablistLabel: "Example requests",
    examples: [
      {
        label: "Taxi and cake",
        video: "media/oleg.mp4",
        poster: "media/oleg.jpg",
        shape: "v",
        alt: "Short: taxi driver Oleg and a cake a passenger forgot",
        meta: [
          "Short 9:16",
          "31 seconds",
          "voice and word-by-word subtitles"
        ],
        prompt: "Taxi driver Oleg tells a funny story about a passenger who forgot a birthday cake in his car"
      },
      {
        label: "3 taxi tips",
        video: "media/oleg-tips.mp4",
        poster: "media/oleg-tips.jpg",
        shape: "v",
        alt: "Short: taxi driver Oleg shares tips",
        meta: [
          "Short 9:16",
          "30 seconds",
          "same hero in every frame"
        ],
        prompt: "Taxi driver Oleg shares 3 tips on how to ride a taxi around the city for less"
      },
      {
        label: "Café ad",
        video: "media/cafe.mp4",
        poster: "media/cafe.jpg",
        shape: "v",
        alt: "Café ad: croissants and coffee",
        meta: [
          "Ad 9:16",
          "28 seconds",
          "big on-screen text"
        ],
        prompt: "A short ad for a cosy neighbourhood café: morning, the smell of fresh coffee, croissants, a smiling barista, and an invitation to drop in today at the end"
      },
      {
        label: "Ocean",
        video: "media/ocean.mp4",
        poster: "media/ocean.jpg",
        shape: "h",
        alt: "Ocean video: a jellyfish and the Blue Hole",
        meta: [
          "YouTube 16:9",
          "26 seconds",
          "live scenes"
        ],
        prompt: "A video about the ocean: the most amazing places and creatures few people have ever seen"
      }
    ],
    initial: {
      prompt: "Taxi driver Oleg tells a funny story about a passenger who forgot a birthday cake in his car",
      meta: [
        "Short 9:16",
        "30 seconds",
        "voice and word-by-word subtitles"
      ],
      image: {
        src: "media/oleg.jpg",
        alt: "Short: taxi driver Oleg and a cake a passenger forgot",
        width: 404,
        height: 720
      }
    },
    note: "Muted excerpt with Russian voice and subtitles. Full clips with sound are in the showreel below."
  },
  reel: {
    id: "reel",
    tag: "Showreel",
    title: "25 seconds of real output",
    lead: "Only what the app made. Turn the sound on: the voice and music came out of the app too.",
    video: {
      src: "media/reel-en.mp4",
      poster: "media/reel-en.jpg",
      width: 960,
      height: 540,
      label: "KADR Studio showreel, 25 seconds, with sound"
    },
    captions: [
      "Excerpts exactly as the app rendered them. We only joined them together.",
      "2 MB · with sound"
    ],
    ctas: [
      {
        label: "Download KADR Studio",
        href: "#download",
        variant: "main"
      },
      {
        label: "How it works",
        href: "#how",
        variant: "ghost"
      }
    ]
  },
  tutorial: {
    id: "tutorial",
    tag: "Video tutorial",
    title: "Your first video in 2 minutes",
    lead: "Where to type your idea, how to pick a format and voice, and where to find the finished video.",
    video: {
      src: "media/tutorial-uk.mp4",
      poster: "media/tutorial-uk.jpg",
      width: 1280,
      height: 720,
      label: "KADR Studio tutorial: your first video in 2 minutes (in Ukrainian)"
    },
    captions: [
      "The video is in Ukrainian · 2:01 · with sound",
      "4 MB"
    ]
  },
  who: {
    id: "who",
    tag: "Who it's for",
    title: "Who KADR Studio is for",
    cards: [
      {
        media: {
          kind: "trio",
          videos: [
            {
              src: "media/short-1.mp4",
              poster: "media/short-1.jpg",
              width: 404,
              height: 720,
              label: "Short from the dream film: a glowing portrait"
            },
            {
              src: "media/short-2.mp4",
              poster: "media/short-2.jpg",
              width: 404,
              height: 720,
              label: "Short from the dream film: a glowing brain"
            },
            {
              src: "media/short-3.mp4",
              poster: "media/short-3.jpg",
              width: 404,
              height: 720,
              label: "Short from the dream film: a close-up of an eye"
            }
          ]
        },
        title: "TikTok, Shorts and Reels creators",
        text: "Vertical videos every day with no filming or editing. One long film becomes a series of Shorts.",
        source: "Example: 7 Shorts cut from one dream film",
        details: "“Cut Shorts” turns a long film into 3 to 8 clips, each with a hook title, face-aware framing, text and hashtags."
      },
      {
        media: {
          kind: "solo",
          image: {
            src: "media/cafe.jpg",
            alt: "Frame of the café ad: croissants and big text",
            width: 404,
            height: 720
          }
        },
        title: "Small businesses",
        text: "Ads for a café, shop or service from one sentence. A product from your photos looks the same in every frame.",
        source: "Example: a café ad from one sentence, 28 seconds",
        details: "Formats 9:16, 1:1 and 4:5. Set the product or hero from photos. There is a “Product ad” template."
      },
      {
        media: {
          kind: "video",
          video: {
            src: "media/film.mp4",
            poster: "media/film.jpg",
            width: 960,
            height: 540,
            label: "Excerpt of the dream film"
          }
        },
        title: "YouTube explainers and faceless channels",
        text: "Explainers and films up to 30 minutes with chapters. An AI director writes the script and picks the angles.",
        source: "Example: the dream film, 17 minutes, from one brief",
        details: "A script that opens with a hook, chosen shots and angles, plus publishing texts: title, description with chapters, hashtags."
      },
      {
        media: {
          kind: "pair",
          items: [
            {
              image: {
                src: "media/lang-en.jpg",
                alt: "Film frame with English subtitles",
                width: 800,
                height: 450
              },
              badge: "EN"
            },
            {
              image: {
                src: "media/lang-ru.jpg",
                alt: "The same frame with Russian subtitles",
                width: 800,
                height: 450
              },
              badge: "RU"
            }
          ]
        },
        title: "In several languages",
        text: "The same footage in another language, with a native narrator and translated subtitles.",
        source: "Example: the dream film in English and in Russian",
        details: "Free neural voices speak English, Ukrainian and Russian. With an ElevenLabs key you get their voices too, including your own clone."
      }
    ]
  },
  how: {
    id: "how",
    tag: "How it works",
    title: "Three steps from idea to MP4",
    lead: "No timeline. You describe what you need, and the app does the rest.",
    steps: [
      {
        n: "1",
        title: "Write an idea",
        text: "One sentence or your own text, up to 30,000 characters. Pick a format and a length.",
        details: "Formats 9:16, 16:9, 1:1 and 4:5, from 15 seconds to 30 minutes. Templates: Facts, Top 5, Story, Product ad, Tutorial."
      },
      {
        n: "2",
        title: "Press ➤",
        text: "KADR writes the script, voices it, draws frames, animates scenes, composes music and adds subtitles.",
        details: "Claude, OpenAI or Gemini writes the script with your key. To review the frames first, turn on the storyboard."
      },
      {
        n: "3",
        title: "Take the finished video",
        text: "An MP4 with social-ready loudness. Redraw any frame with one click.",
        details: "“Video check” spots flaws on its own and tells you in plain words what to fix."
      }
    ],
    note: "On an RTX 3060 a frame takes about a minute and a 20-minute film about 4 hours.",
    screenshot: {
      src: "img/home-en.jpg",
      alt: "KADR Studio home screen: the idea field, formats and templates",
      width: 1280,
      height: 820
    },
    caption: "The home screen: idea, format, template and the ➤ button."
  },
  looks: {
    id: "looks",
    tag: "How it will look",
    title: "Picture style in one click",
    lead: "12 styles, from cinema to anime and 3D animation. The same frame in different styles:",
    styles: [
      {
        name: "Cinema",
        image: {
          src: "img/look-cinema.jpg",
          alt: "Cinema"
        }
      },
      {
        name: "Anime",
        image: {
          src: "img/look-anime.jpg",
          alt: "Anime"
        }
      },
      {
        name: "3D animation",
        image: {
          src: "img/look-cartoon3d.jpg",
          alt: "3D animation"
        }
      },
      {
        name: "Watercolor",
        image: {
          src: "img/look-watercolor.jpg",
          alt: "Watercolor"
        }
      },
      {
        name: "Neon noir",
        image: {
          src: "img/look-neon.jpg",
          alt: "Neon noir"
        }
      },
      {
        name: "Product ad",
        image: {
          src: "img/look-studio.jpg",
          alt: "Product ad"
        }
      }
    ]
  },
  req: {
    id: "req",
    tag: "Honest about hardware",
    title: "You don’t need a GPU",
    lead: "Choose where to render: in our cloud or on your own computer.",
    tiers: [
      {
        who: "PC WITH NVIDIA, 8 TO 12 GB",
        title: "Everything on your GPU",
        paragraphs: [
          "Frames, scenes and music render on your card. No per-image fees.",
          "Windows 10/11, 64-bit."
        ],
        details: "The app downloads and installs the generator (about 28 GB) by itself."
      },
      {
        who: "MAC WITH APPLE M1, M2, M3, M4",
        title: "The Mac draws the frames",
        paragraphs: [
          "With 16 GB of memory or more, frames render right on the Mac.",
          "Needs macOS 12 or later. Intel Macs work too."
        ],
        details: "KADR Cloud renders live scenes for Macs. Voice, subtitles, editing and export work on any Mac."
      },
      {
        who: "ANY COMPUTER",
        title: "KADR Cloud",
        paragraphs: [
          "Our powerful GPUs render your frames, live scenes and music.",
          "Even a weak laptop will do. You spend ⚡ only on finished work."
        ],
        details: "Without the cloud or keys, a free neural voice reads your text over an animated backdrop. Ready in a minute or two."
      }
    ],
    notes: {
      title: "Good to know",
      items: [
        "With your own GPU, speed depends on the card: on an RTX 3060 a frame takes about a minute.",
        "If the power goes out, nothing is lost: the app picks up where it stopped.",
        "AI scripts and ElevenLabs voices use your own keys. A Gemini key is free.",
        "On first launch on a Mac, open “System Settings” → “Privacy & Security” → “Open Anyway”."
      ]
    }
  },
  cloud: {
    id: "cloud",
    tag: "KADR Cloud",
    title: "Our GPUs work for you",
    lead: "Make videos from any device. You don’t need a GPU: a weak laptop or any Mac will do.",
    bullets: [
      "Frames, live scenes and music render on powerful GPUs that we rent.",
      "The app shows the price before it starts. ⚡ is charged as each frame is done.",
      "Energy packs start at $10 and you buy them right in the app."
    ],
    cta: {
      label: "Try the cloud",
      href: "#download",
      variant: "main"
    }
  },
  mobileSoon: {
    tag: "Coming next",
    title: "Mobile version coming soon",
    text: "Make videos right from your phone. We are already building the app."
  },
  features: {
    id: "features",
    tag: "Features",
    title: "A whole video studio in one window",
    lead: "Render in KADR Cloud, on your own GPU, or plug in your own keys.",
    items: [
      {
        icon: "✎",
        title: "AI script",
        text: "Claude, OpenAI or Gemini with your key. Without a key, your own text becomes the script."
      },
      {
        icon: "♪",
        title: "Voice-over",
        text: "Free neural voices (EN, UK, RU), system voices or ElevenLabs, including a clone of your voice."
      },
      {
        icon: "▣",
        title: "Frames in the cloud or at home",
        text: "KADR Cloud or RealVisXL on your NVIDIA. The generator installs with one click."
      },
      {
        icon: "▶",
        title: "Live scenes",
        text: "Key moments come alive (Wan 2.2). About 2.5 minutes per scene on an RTX 3060."
      },
      {
        icon: "♫",
        title: "Background music",
        text: "AI composes the music (ACE-Step). No more digging through stock tracks."
      },
      {
        icon: "Aa",
        title: "Subtitles and sound",
        text: "Word-by-word subtitles and social-ready loudness. The MP4 is ready to post."
      },
      {
        icon: "✂",
        title: "Cut Shorts",
        text: "3 to 8 vertical clips from one long film, with text and hashtags."
      },
      {
        icon: "☺",
        title: "Your own and ready characters",
        text: "A hero or product from photos looks the same in every frame. Plus 12 ready heroes with their own voices."
      },
      {
        icon: "文",
        title: "Other languages",
        text: "The same footage, a native narrator and translated subtitles."
      },
      {
        icon: "✉",
        title: "Publishing texts",
        text: "Title, description with chapters, hashtags and a pinned comment in one click."
      },
      {
        icon: "✦",
        title: "AI assistant",
        text: "The chat changes scenes and style. Before you start, the AI offers 3 takes on the video."
      },
      {
        icon: "⚿",
        title: "Easy setup",
        text: "Paste a key and the app detects the service. Keys are stored encrypted."
      }
    ]
  },
  download: {
    id: "download",
    tag: "Download",
    title: "For Windows and Mac",
    lead: "One app for both computers. It offers updates by itself.",
    platforms: [
      {
        os: "windows",
        name: "Windows",
        details: "10 and 11, 64-bit · .exe installer · v3.0.3",
        cta: "Download for Windows",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/download/v3.0.3/KADR-Studio-Setup-3.0.3.exe"
      },
      {
        os: "mac-arm",
        name: "Mac with Apple chip",
        details: "M1, M2, M3, M4 · macOS 12 and later · .dmg",
        cta: "Download for Mac (M chip)",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/latest/download/KADR-Studio-3.0-arm64.dmg"
      },
      {
        os: "mac-intel",
        name: "Mac with Intel",
        details: "macOS 12 and later · .dmg",
        cta: "Download for Mac (Intel)",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/latest/download/KADR-Studio-3.0-x86_64.dmg"
      }
    ],
    note: "Open the Apple menu → “About This Mac”. “Chip Apple M…” means the first button, “Processor Intel” the second."
  },
  pricing: {
    id: "pricing",
    tag: "Pricing",
    title: "Pricing",
    lead: "Start for free. Pay once you like the videos.",
    currency: "USD",
    plans: [
      {
        name: "Trial",
        price: {
          display: "Free",
          value: 0
        },
        per: "3 videos up to 60 seconds",
        items: [
          "No card needed",
          "A small “KADR Studio” mark in a corner",
          "All styles, characters and keys work"
        ],
        cta: {
          label: "Download for free",
          href: "#download",
          variant: "ghost"
        }
      },
      {
        name: "Lifetime licence",
        badge: "−40%",
        price: {
          display: "$59",
          value: 59,
          old: "$99",
          oldValue: 99
        },
        per: "one-time · first 100 buyers",
        items: [
          "1 year of updates",
          "Then $99 for everyone",
          "No mark, no limits",
          "14-day refund if unused"
        ],
        cta: {
          label: "Buy at the discount →",
          href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
          variant: "main"
        },
        highlight: true
      },
      {
        name: "Subscription",
        price: {
          display: "$9",
          value: 9
        },
        per: "a month · or $79 a year",
        items: [
          "For when you need it for a while",
          "Updates while subscribed",
          "Cancel any time"
        ],
        cta: {
          label: "Subscribe",
          href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
          variant: "ghost"
        }
      }
    ],
    extras: [
      {
        title: "Energy ⚡ for the cloud",
        text: "Packs from $10, topped up in the app. The cloud renders frames, scenes and music; you see the price first."
      },
      {
        title: "Done-for-you setup, $99 to $149",
        text: "I install the app, connect your keys, and we make your first video together. Remotely."
      }
    ],
    note: "AI-service keys are optional. If you add them, you pay those services directly.",
    buy: {
      text: "Write to kadrstudia8@gmail.com. We send the payment details and activate the app. Card payment is coming soon.",
      cta: {
        label: "Buy by e-mail",
        href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
        variant: "main"
      },
      note: "We reply personally. No newsletters, no trackers."
    },
    legal: [
      {
        label: "Terms",
        href: "https://kadrstudia8-hue.github.io/terms-en.html"
      },
      {
        label: "Refunds",
        href: "https://kadrstudia8-hue.github.io/refund-en.html"
      }
    ],
    highlight: "40% off for the first 100 buyers"
  },
  faq: {
    id: "faq",
    tag: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "Is it hard?",
        a: [
          "No. Write an idea, pick a format and length, press ➤. There are templates, 12 picture styles and 12 ready characters. Just paste a key: the app works out which service it belongs to."
        ],
        open: true
      },
      {
        q: "Do I need my own GPU?",
        a: [
          "No. KADR Cloud renders frames, live scenes and music on our GPUs, and you pay in ⚡. With an NVIDIA card with 8 to 12 GB, or an Apple-chip Mac with 16 GB or more, you can render frames for free at home. Without the cloud or keys, a free voice reads your text over an animated colour backdrop."
        ]
      },
      {
        q: "Won’t it look like cheap AI mush?",
        a: [
          "Watch the showreel above: that is real output from the app. Before rendering, turn on the storyboard and redraw any frame. After rendering, “Video check” names flaws in plain words and redraws gross defects once by itself. With a Gemini key, an AI checks live scenes: a bad one is re-shot, and after two failures the scene stays a good still."
        ]
      },
      {
        q: "How long does a video take?",
        a: [
          "It depends on where it renders. On an RTX 3060 a frame takes about a minute, a live scene about 2.5 minutes, a 20-minute film about 4 hours. A video from your text with no keys and no GPU is ready in a minute or two."
        ]
      },
      {
        q: "How much does it cost?",
        a: [
          "The trial is free: 3 videos up to 60 seconds. A lifetime licence costs ",
          {
            b: "$59"
          },
          " for the first 100 buyers, then $99, with 1 year of updates. A subscription costs $9 a month or $79 a year. Energy ⚡ packs for the cloud start at $10. Done-for-you setup costs $99 to $149. To buy, ",
          {
            a: "write to kadrstudia8@gmail.com",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F"
          },
          ". Card payment is coming soon."
        ]
      },
      {
        q: "How do I get access?",
        a: [
          "Download KADR Studio and sign up with your e-mail. Without paying, you get the trial with 3 videos. To remove the mark and the limits, buy a licence or a subscription: write to kadrstudia8@gmail.com from your account e-mail and we activate it. This usually takes a few minutes during working hours. A ⚡ top-up only pays for the cloud and does not activate the app. Contacts are on the ",
          {
            a: "Support",
            href: "https://kadrstudia8-hue.github.io/support-en.html"
          },
          " page."
        ]
      },
      {
        q: "What is Energy ⚡?",
        a: [
          "KADR’s internal unit for the cloud. Our servers render frames, live scenes and music, and ⚡ is charged as they are done. You see the price before you start. If something fails on our side, no ⚡ is charged. ⚡ is not money or a cryptocurrency and can’t be transferred. You top up in the app, in the “Energy” window, with USDT or USDC (BEP-20 network)."
        ]
      },
      {
        q: "Does it work on Mac?",
        a: [
          "Yes: macOS 12 or later, Macs with an Apple chip (M1, M2, M3, M4) or Intel. KADR Cloud renders frames, live scenes and music on any Mac. On Apple-chip Macs with 16 GB or more, frames can also render on the computer itself. On first launch macOS asks once: “System Settings” → “Privacy & Security” → “Open Anyway”."
        ]
      },
      {
        q: "Do I need paid AI keys?",
        a: [
          "No. Without keys your own text becomes the script, read by free neural voices (English, Ukrainian, Russian) or system voices. With a Claude, OpenAI or Gemini key the AI writes the script for you; the Gemini key is free. An ElevenLabs key unlocks ElevenLabs voices, including your cloned one."
        ]
      },
      {
        q: "Where do my data and keys go?",
        a: [
          "Videos, scripts and projects stay on your computer. The account is only for activation and the ⚡ balance; there is no telemetry. Keys are stored encrypted: with DPAPI on Windows, in the Keychain on Mac. External services (Claude, OpenAI, Gemini, ElevenLabs) get the request text directly with your key. More in the ",
          {
            a: "Privacy Policy",
            href: "https://kadrstudia8-hue.github.io/privacy-en.html"
          },
          "."
        ]
      },
      {
        q: "What formats and lengths?",
        a: [
          "9:16 for Shorts, TikTok and Reels, 16:9 for YouTube, plus 1:1 and 4:5. From 15 seconds to 30 minutes."
        ]
      },
      {
        q: "Can I get a refund?",
        a: [
          "Yes. We refund a licence within 14 days if you haven’t used it. Full terms are on the ",
          {
            a: "Refund Policy",
            href: "https://kadrstudia8-hue.github.io/refund-en.html"
          },
          " page."
        ]
      }
    ]
  },
  contact: {
    id: "contact",
    tag: "Try it on your own idea",
    title: "One sentence and ➤",
    lead: "Download KADR Studio and write what your video is about. Send us any question and we reply personally.",
    ctas: [
      {
        label: "Download KADR Studio",
        href: "#download",
        variant: "main",
        osAware: true
      },
      {
        label: "Contact support",
        href: "https://kadrstudia8-hue.github.io/support-en.html",
        variant: "ghost"
      }
    ]
  },
  ctaBand: {
    title: "Your first video in 2 minutes",
    subtitle: "3 free videos. No card, no GPU.",
    cta: {
      label: "Download for free",
      href: "#download",
      variant: "main"
    }
  },
  mobileBar: {
    label: "Quick actions",
    ctas: [
      {
        label: "Download",
        href: "#download",
        variant: "main"
      },
      {
        label: "▶ Showreel",
        href: "#reel",
        variant: "ghost"
      }
    ]
  },
  footer: {
    copyright: "© 2026 KADR Studio",
    ownerPlaceholder: "[PLACEHOLDER: name / company]",
    links: [
      {
        label: "Terms",
        href: "https://kadrstudia8-hue.github.io/terms-en.html"
      },
      {
        label: "Privacy",
        href: "https://kadrstudia8-hue.github.io/privacy-en.html"
      },
      {
        label: "Refunds",
        href: "https://kadrstudia8-hue.github.io/refund-en.html"
      },
      {
        label: "Licences",
        href: "https://kadrstudia8-hue.github.io/licenses-en.html"
      },
      {
        label: "Support",
        href: "https://kadrstudia8-hue.github.io/support-en.html"
      },
      {
        label: "Write to us",
        href: "mailto:kadrstudia8@gmail.com"
      }
    ],
    note: "Windows 10/11 and macOS 12+ · No telemetry"
  },
  ui: {
    downloadMac: "Download for Mac",
    downloadWindows: "Download for Windows",
    linkCopied: "link copied",
    langHint: {
      question: "Read this page in English?",
      accept: "In English",
      close: "Close"
    }
  }
}

export default en
