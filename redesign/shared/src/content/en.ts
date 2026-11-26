// KADR Studio landing, EN content (sales rewrite, 2026-11).
// Started as a verbatim copy of the live page; now edited copy on the same product facts.
// Visible copy rules: no long dashes, no word «ролик», short paragraphs.
// `page` holds the 9-section CRO structure (redesign/CRO.md); old fields stay for current builds.
import type { SiteContent } from './types.ts'

export const en: SiteContent = {
  lang: "en",
  meta: {
    htmlLang: "en",
    title: "KADR Studio. One sentence. A finished video.",
    description: "Write an idea and KADR Studio makes the whole video: script, voice, frames, music and subtitles. For Windows and Mac.",
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
      description: "Write an idea and KADR Studio makes the whole video: script, voice, frames, music and subtitles. For Windows and Mac.",
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
        label: "No GPU?",
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
        "works ",
        {
          b: "without keys"
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
      "Windows and Mac",
      "No ads",
      "Licence for 2 computers"
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
        title: "Cloud on RTX 5090, coming soon",
        text: "You won’t need your own GPU: our servers will render the frames."
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
    title: "No GPU? It still works",
    lead: "What you get on your computer today. KADR Cloud on RTX 5090 is coming soon.",
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
        details: "Live scenes don’t run on the Mac itself yet. Voice, subtitles, editing and export work on any Mac."
      },
      {
        who: "ANY COMPUTER",
        title: "Video even without a GPU",
        paragraphs: [
          "AI frames come from a service with your key, or from free Pexels and Pixabay photos.",
          "KADR Cloud is coming soon: our RTX 5090s will render the frames."
        ],
        details: "With no keys, a free neural voice reads your text over an animated backdrop. Ready in a minute or two."
      }
    ],
    notes: {
      title: "Good to know",
      items: [
        "Speed depends on the GPU: on an RTX 3060 a frame takes about a minute.",
        "If the power goes out, nothing is lost: the app picks up where it stopped.",
        "AI scripts and ElevenLabs voices use your own keys. A Gemini key is free.",
        "On first launch on a Mac, open “System Settings” → “Privacy & Security” → “Open Anyway”."
      ]
    }
  },
  cloud: {
    id: "cloud",
    tag: "KADR Cloud",
    title: "Our RTX 5090s will work for you",
    lead: "KADR Cloud is coming soon: videos from any computer, even a weak laptop or a Mac.",
    bullets: [
      "Frames, live scenes and music will render on our servers with RTX 5090 cards.",
      "You pay with Energy ⚡: packs from $10, and the app shows the price before it starts.",
      "Energy top-ups open in the app when the cloud launches."
    ],
    cta: {
      label: "Download KADR Studio",
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
    lead: "Render on your own GPU or plug in your own keys. Cloud on RTX 5090 is coming soon.",
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
        title: "Frames on your GPU",
        text: "RealVisXL on your NVIDIA; the generator installs with one click. Without NVIDIA, frames come with a key."
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
    lead: "Start with 3 free videos. Prices are in Ukrainian hryvnias (UAH); you pay in USDT at the day’s rate.",
    currency: "UAH",
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
        name: "“Founder” licence",
        badge: "first 100",
        price: {
          display: "UAH 1,999",
          value: 1999,
          old: "UAH 2,999",
          oldValue: 2999
        },
        per: "one-time · first 100 buyers",
        items: [
          "No watermark, no limits",
          "Everything on your PC, 1 year of updates",
          "Two computers",
          "Try it free first: 3 videos"
        ],
        cta: {
          label: "Buy in the app",
          href: "#download",
          variant: "main"
        },
        highlight: true
      },
      {
        name: "Done for you",
        price: {
          display: "UAH 5,999",
          value: 5999
        },
        per: "one-time · remote",
        items: [
          "The “Founder” licence",
          "We set up your PC",
          "We make your first video together"
        ],
        cta: {
          label: "Order Done for you",
          href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
          variant: "ghost"
        }
      }
    ],
    extras: [
      {
        title: "Energy ⚡ for the cloud on RTX 5090",
        text: "Packs from $10. Frames, scenes and music render on our RTX 5090s. Top-ups open in the app when the cloud launches."
      },
      {
        title: "Pay in USDT",
        text: "USDT on BNB Smart Chain (BEP-20) at the day’s rate. The licence opens on your account by itself."
      }
    ],
    note: "AI-service keys are optional. If you add them, you pay those services directly.",
    buy: {
      text: "Buy right in the app: USDT (BEP-20) at the day’s rate. The licence opens on your account by itself.",
      cta: {
        label: "Download and buy",
        href: "#download",
        variant: "main"
      },
      note: "Licence didn’t open? Write to kadrstudia8@gmail.com and we reply personally."
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
    highlight: "Price for the first 100 buyers"
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
          "No. The app works without NVIDIA: the licence removes the watermark and the trial limits, AI frames come from a service with your key, and with no keys it uses free Pexels and Pixabay photos. With an NVIDIA card with 8 to 12 GB, or an Apple-chip Mac with 16 GB or more, frames render for free at home. KADR Cloud is coming soon: our RTX 5090s will render the frames."
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
          "It depends on the GPU. On an RTX 3060 a frame takes about a minute, a live scene about 2.5 minutes, a 20-minute film about 4 hours. A video from your text with no keys and no GPU is ready in a minute or two."
        ]
      },
      {
        q: "How much does it cost?",
        a: [
          "The trial is free: 3 videos up to 60 seconds. The “Founder” licence costs ",
          {
            b: "UAH 1,999"
          },
          " for the first 100 buyers, then UAH 2,999: no watermark and no limits, 1 year of updates, two computers. Done for you costs UAH 5,999. You pay in the app in USDT on BNB Smart Chain (BEP-20) at the day’s rate. Energy ⚡ for the cloud on RTX 5090 comes in packs from $10; top-ups open when the cloud launches. Questions about payment: write to ",
          {
            a: "kadrstudia8@gmail.com",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F"
          },
          "."
        ]
      },
      {
        q: "How do I get access?",
        a: [
          "Download KADR Studio: the trial with 3 videos works right away. To remove the watermark and the limits, buy a licence right in the app. Once you pay in USDT, the licence opens on your account by itself. If it doesn’t, write to us; contacts are on the ",
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
          "Energy ⚡ is how you pay for renting our servers with RTX 5090 cards. Frames, live scenes and music render on them, so you don’t need your own GPU. ⚡ is charged as frames are done, and you see the price before you start. Packs start at $10; top-ups open in the app when the cloud launches. ⚡ is not money or a cryptocurrency and can’t be transferred."
        ]
      },
      {
        q: "Does it work on Mac?",
        a: [
          "Yes: macOS 12 or later, Macs with an Apple chip (M1, M2, M3, M4) or Intel. On Apple-chip Macs with 16 GB or more, frames render on the computer itself; on others with a service key, and once the cloud launches on our RTX 5090s. Live scenes don’t run on the Mac itself yet. Voice, subtitles, editing and export work on any Mac. On first launch macOS asks once: “System Settings” → “Privacy & Security” → “Open Anyway”."
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
          "Sales are final, so try it free first: 3 videos up to 60 seconds. We refund you if a payment went through twice, or if the app doesn’t work on a computer that meets the requirements and support couldn’t help. Full terms are on the ",
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
    subtitle: "3 free videos. No card.",
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
  },
  page: {
    order: [
      "top",
      "proof",
      "who",
      "how",
      "compare",
      "pc",
      "pricing",
      "faq",
      "download"
    ],
    nav: {
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
          label: "Pricing",
          href: "#pricing"
        }
      ],
      cta: {
        label: "Try it",
        href: "#download",
        variant: "main"
      }
    },
    hero: {
      id: "top",
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
      subtitle: "The app writes the script, records the voice, draws the frames and builds the video.",
      cta: {
        label: "Try it free",
        href: "#download",
        variant: "main"
      },
      secondary: {
        label: "Showreel, 25 s",
        href: "#proof",
        variant: "ghost",
        action: "play-reel"
      },
      chips: [
        "3 free videos",
        "No card",
        "Windows and Mac"
      ],
      note: "no filming, no editing",
      sticker: "3 free videos",
      mobile: {
        cta: {
          label: "Send the link to yourself",
          href: "#top",
          variant: "main",
          action: "share"
        },
        caption: "The app runs on a computer. Open the link on a PC or Mac."
      }
    },
    proof: {
      id: "proof",
      tag: "Real examples",
      title: "The app made this",
      subtitle: "Tap a video. Below it is the sentence it came from.",
      promptLabel: "All the author wrote",
      reelCard: "Showreel with sound, 25 seconds",
      cta: {
        label: "Watch the showreel, 25 s",
        href: "#proof",
        variant: "ghost",
        action: "play-reel"
      }
    },
    who: {
      id: "who",
      title: "Who it’s for",
      subtitle: "Pick yours. We’ll show an example and a style.",
      cards: [
        {
          title: "Shorts and Reels",
          text: "Vertical videos every day. No camera."
        },
        {
          title: "Business ads",
          text: "A café, shop or service from one sentence."
        },
        {
          title: "Faceless YouTube",
          text: "Films up to 30 minutes with chapters."
        },
        {
          title: "Other languages",
          text: "The same video with a new narrator."
        }
      ],
      stylesTitle: "12 styles. One click.",
      cta: {
        label: "Try it on your own idea",
        href: "#download",
        variant: "main"
      }
    },
    how: {
      id: "how",
      title: "Three steps to video",
      subtitle: "Write an idea. Press the button. Take the finished file.",
      steps: [
        "Write an idea",
        "Press ➤",
        "Take your video"
      ],
      screenshotCaption: "This is what the app looks like",
      note: "“Remember the Game Boy?”",
      cta: {
        label: "Tutorial, 2 minutes",
        href: "#how",
        variant: "ghost",
        action: "play-tutorial"
      }
    },
    compare: {
      id: "compare",
      title: "Before and with KADR",
      subtitle: "Six jobs and six people. Or one sentence.",
      before: {
        title: "Before",
        items: [
          "Script",
          "Narrator",
          "Filming",
          "Editing",
          "Music",
          "Subtitles"
        ]
      },
      after: {
        title: "With KADR",
        text: "One sentence and ➤"
      },
      note: "A simple video from your own text is ready in a minute or two.",
      more: {
        label: "What else the app does",
        items: [
          "Live scenes: key moments come alive",
          "Word-by-word subtitles and social-ready loudness",
          "Cuts a long film into Shorts",
          "Your own hero or product from photos in every frame",
          "Versions in other languages",
          "Title, description and hashtags in one click",
          "An AI assistant changes scenes and style",
          "3 takes on the video to choose from before you start"
        ]
      },
      cta: {
        label: "Try it free",
        href: "#download",
        variant: "main"
      }
    },
    pc: {
      id: "pc",
      title: "Your computer will do",
      subtitle: "Got a GPU? Everything is free at home. No GPU? Our cloud helps.",
      tiles: [
        {
          title: "Your own computer",
          text: "Windows or Mac. Frames and music render on your machine."
        },
        {
          title: "KADR Cloud",
          badge: "Soon",
          text: "Soon our RTX 5090s will work for you. Pay with Energy ⚡ from $10."
        }
      ],
      mobileChip: "Mobile version soon",
      details: [
        "Frames render for free at home on an NVIDIA card with 8 to 12 GB or on an Apple-chip Mac with 16 GB of memory or more. The app downloads the generator (about 28 GB) by itself.",
        "Without such a card the app still works: the licence removes the watermark and the trial limits, and frames come from a service with your key or from free Pexels and Pixabay photos.",
        "You need Windows 10/11 (64-bit) or macOS 12 or later. Live scenes don’t run on the Mac itself yet.",
        "On first launch on a Mac, open “System Settings” → “Privacy & Security” → “Open Anyway”."
      ],
      cta: {
        label: "Which computer do I have?",
        href: "#pc",
        variant: "ghost",
        action: "disclose"
      }
    },
    pricing: {
      id: "pricing",
      title: "Free comes first",
      subtitle: "No refunds. That’s why your first 3 videos are on us.",
      currency: "UAH",
      plans: [
        {
          id: "trial",
          tone: "entry",
          label: "Start here",
          name: "Trial",
          price: {
            display: "UAH 0",
            value: 0
          },
          per: "3 videos up to 60 seconds",
          items: [
            "No card",
            "All styles and characters",
            "A small KADR mark in the corner"
          ],
          cta: {
            label: "Download and try",
            href: "#download",
            variant: "main"
          }
        },
        {
          id: "founder",
          tone: "center",
          label: "For the first 100 buyers",
          name: "“Founder” licence",
          price: {
            display: "UAH 1,999",
            value: 1999,
            old: "UAH 2,999",
            oldValue: 2999
          },
          then: "then UAH 2,999",
          per: "Pay once. Keep it.",
          items: [
            "No watermark, no limits",
            "Two computers",
            "1 year of updates"
          ],
          cta: {
            label: "Buy for UAH 1,999",
            href: "#download",
            variant: "ghost"
          },
          note: "Bought inside the app, after the trial"
        },
        {
          id: "turnkey",
          tone: "premium",
          label: "Premium",
          name: "Done for you",
          price: {
            display: "UAH 5,999",
            value: 5999
          },
          per: "We set it all up for you. Remotely.",
          items: [
            "The “Founder” licence included",
            "Installing and setting up your PC",
            "Your first video, made together"
          ],
          cta: {
            label: "Order Done for you",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
            variant: "ghost"
          }
        }
      ],
      honest: "No refunds. That’s why your first 3 videos are free.",
      currencyNote: "The app converts it to USDT at the day’s rate.",
      pay: {
        title: "How to pay",
        steps: [
          "Download the app",
          "Press “Buy” inside it",
          "Pay in USDT on the BEP-20 network"
        ],
        help: "No USDT? The app has a guide on how to buy it."
      },
      cloud: "Cloud on our RTX 5090s is coming soon. Paid with Energy ⚡, packs from $10.",
      cta: {
        label: "Download and try",
        href: "#download",
        variant: "main"
      }
    },
    faq: {
      id: "faq",
      title: "Straight answers",
      subtitle: "Six questions people ask before buying.",
      items: [
        {
          q: "Is it hard?",
          a: [
            "No. Write an idea, pick a format and length, press ➤. There are templates, 12 picture styles and 12 ready characters."
          ],
          open: true
        },
        {
          q: "Won’t it look like cheap AI mush?",
          a: [
            "Look at the examples above: that is real output from the app. Before rendering you can review the storyboard and redraw any frame. After rendering, “Video check” names flaws in plain words and redraws gross defects once by itself."
          ]
        },
        {
          q: "Do I need a powerful GPU?",
          a: [
            "No. The app runs on Windows 10/11 and on Macs with macOS 12 or later. With an NVIDIA card from 8 GB, or an Apple-chip Mac with 16 GB or more, frames render for free at home. Without one, frames come from a service with a key or from free photos. KADR Cloud on our RTX 5090s is coming soon."
          ]
        },
        {
          q: "How long does a video take?",
          a: [
            "It depends on your computer. A video from your text with no GPU is ready in a minute or two. On an RTX 3060 a frame takes about a minute, a 20-minute film about 4 hours."
          ]
        },
        {
          q: "How do I pay, and why USDT?",
          a: [
            "You buy inside the app. Press “Buy”: the app converts the price to USDT at the day’s rate and shows the amount and the address. You pay in USDT on BNB Smart Chain (BEP-20). That way the payment is checked automatically and the licence opens by itself, with no waiting."
          ]
        },
        {
          q: "Can I get a refund?",
          a: [
            "No. That’s why there is a trial: 3 free videos, no card. Buy when you like the result. Exceptions required by law are in the ",
            {
              a: "Refund Policy",
              href: "https://kadrstudia8-hue.github.io/refund-en.html"
            },
            "."
          ]
        }
      ],
      all: {
        label: "All questions",
        href: "https://kadrstudia8-hue.github.io/support-en.html"
      },
      cta: {
        label: "Write to us",
        href: "https://kadrstudia8-hue.github.io/support-en.html",
        variant: "ghost"
      }
    },
    final: {
      id: "download",
      title: "One sentence. And ➤",
      subtitle: "3 free videos. No card, no sign-up on the site.",
      cta: {
        label: "Download KADR Studio",
        href: "#download",
        variant: "main",
        osAware: true
      },
      platforms: "Windows · Mac with M chip · Intel Mac",
      macHelp: {
        label: "Which Mac do I have?",
        text: "Open the Apple menu → “About This Mac”. “Chip Apple M…” means the second button, “Processor Intel” the third."
      },
      support: {
        label: "Contact support. We reply personally.",
        href: "https://kadrstudia8-hue.github.io/support-en.html"
      }
    },
    mobileBar: {
      ctas: [
        {
          label: "Send the link to yourself",
          href: "#top",
          variant: "main",
          action: "share"
        },
        {
          label: "Pricing",
          href: "#pricing",
          variant: "ghost"
        }
      ]
    }
  }
}

export default en
