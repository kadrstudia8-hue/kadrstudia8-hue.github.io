// KADR Studio landing, DE content (sales rewrite, 2026-11).
// Started as a verbatim copy of the live page; now edited copy on the same product facts.
// Visible copy rules: no long dashes, no word «ролик», short paragraphs.
// `page` holds the 9-section CRO structure (redesign/CRO.md); old fields stay for current builds.
import type { SiteContent } from './types.ts'

export const de: SiteContent = {
  lang: "de",
  meta: {
    htmlLang: "de",
    title: "KADR Studio. Ein Satz. Ein fertiges Video.",
    description: "Schreiben Sie eine Idee, KADR Studio macht das ganze Video: Drehbuch, Stimme, Bilder, Musik und Untertitel. Für Windows und Mac.",
    canonical: "https://kadrstudia8-hue.github.io/landing-de.html",
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
      locale: "de_DE",
      localeAlternates: [
        "uk_UA",
        "ru_RU",
        "en_US",
        "es_ES"
      ],
      url: "https://kadrstudia8-hue.github.io/landing-de.html",
      title: "KADR Studio. Ein Satz. Ein fertiges Video.",
      description: "Schreiben Sie eine Idee, KADR Studio macht das ganze Video: Drehbuch, Stimme, Bilder, Musik und Untertitel. Für Windows und Mac.",
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
        label: "Beispiele",
        href: "#proof"
      },
      {
        label: "So funktioniert's",
        href: "#how"
      },
      {
        label: "Für wen",
        href: "#who"
      },
      {
        label: "Keine GPU?",
        href: "#req"
      },
      {
        label: "Preise",
        href: "#pricing"
      },
      {
        label: "FAQ",
        href: "#faq"
      }
    ],
    langMenuLabel: "Sprache",
    langCurrent: {
      full: "Deutsch",
      short: "DE"
    },
    cta: {
      label: "Download",
      href: "#download",
      variant: "ghost"
    }
  },
  hero: {
    id: "top",
    tag: "Eine App für Windows und macOS",
    title: [
      {
        text: "Ein Satz.",
        nowrap: true
      },
      {
        text: "Ein fertiges Video.",
        accent: true
      }
    ],
    lead: "Schreiben Sie eine Idee. KADR Studio liefert Drehbuch, Stimme, Bilder, Musik und Untertitel und exportiert ein MP4.",
    ctas: [
      {
        label: "KADR Studio herunterladen",
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
    note: "Windows und Mac · keine Werbung, keine Telemetrie",
    mobileHint: [
      "KADR Studio läuft auf dem Computer. Öffnen Sie diese Seite auf einem Mac oder PC, oder ",
      {
        button: "schicken Sie sich den Link",
        action: "share"
      },
      "."
    ],
    video: {
      src: "media/hero-en.mp4",
      poster: "media/hero-en.jpg",
      width: 1280,
      height: 720,
      label: "Szenen aus dem Film „Why Does Your Brain Make Dreams Feel Real?“, erstellt mit KADR Studio"
    },
    caption: "Kein Stockmaterial. Das sind Szenen aus einem 17-minütigen Film über Träume, gebaut aus einem einzigen Briefing.",
    facts: [
      [
        {
          b: "15 Sekunden bis 30 Minuten"
        }
      ],
      [
        {
          b: "9:16 · 16:9 · 1:1 · 4:5"
        }
      ],
      [
        "Stimmen ",
        {
          b: "DE · ES · EN · UK · RU"
        }
      ],
      [
        "funktioniert ",
        {
          b: "ohne Schlüssel"
        }
      ],
      [
        "nach einem Stromausfall ",
        {
          b: "geht es dort weiter, wo es aufhörte"
        }
      ]
    ],
    badges: [
      "3 Videos gratis",
      "Windows und Mac",
      "Keine Werbung",
      "Lizenz für 2 Computer"
    ]
  },
  promises: {
    id: "promises",
    tag: "Warum KADR",
    title: "Video ohne Kamera und Cutter",
    items: [
      {
        icon: "Clapperboard",
        title: "Kein Dreh, kein Schnitt",
        text: "Sie schreiben die Idee. Drehbuch, Stimme, Bilder und Musik macht KADR."
      },
      {
        icon: "Timer",
        title: "Ihr erstes Video in 2 Minuten",
        text: "Ein kurzes Tutorial führt Sie von der Idee zum fertigen MP4."
      },
      {
        icon: "Gift",
        title: "3 Videos gratis",
        text: "Testversion ohne Karte. Kaufen Sie erst, wenn Ihnen das Ergebnis gefällt."
      },
      {
        icon: "Cloud",
        title: "Bald: Cloud mit RTX 5090",
        text: "Eine eigene GPU brauchen Sie dann nicht: Unsere Server rechnen die Bilder."
      },
      {
        icon: "Film",
        title: "MP4 für jede Plattform",
        text: "TikTok, Shorts, Reels und YouTube: 9:16, 16:9, 1:1 und 4:5."
      },
      {
        icon: "ShieldCheck",
        title: "Keine Werbung, keine Telemetrie",
        text: "Ihre Projekte und Videos bleiben auf Ihrem Computer."
      }
    ]
  },
  proof: {
    id: "proof",
    tag: "Echte Beispiele",
    title: "Ein Satz → ein Video",
    lead: "Echte Anfragen und die Videos, die KADR Studio daraus gemacht hat. Eingegeben auf Russisch, hier übersetzt.",
    tablistLabel: "Beispielanfragen",
    examples: [
      {
        label: "Taxi und Torte",
        video: "media/oleg.mp4",
        poster: "media/oleg.jpg",
        shape: "v",
        alt: "Short: Taxifahrer Oleg und eine vergessene Torte",
        meta: [
          "Short 9:16",
          "31 Sekunden",
          "Stimme und Wort-für-Wort-Untertitel"
        ],
        prompt: "Taxifahrer Oleg erzählt eine lustige Geschichte über einen Fahrgast, der eine Geburtstagstorte in seinem Auto vergessen hat"
      },
      {
        label: "3 Taxi-Tipps",
        video: "media/oleg-tips.mp4",
        poster: "media/oleg-tips.jpg",
        shape: "v",
        alt: "Short: Taxifahrer Oleg gibt Tipps",
        meta: [
          "Short 9:16",
          "30 Sekunden",
          "derselbe Held in jeder Szene"
        ],
        prompt: "Taxifahrer Oleg gibt 3 Tipps, wie man in der Stadt günstiger Taxi fährt"
      },
      {
        label: "Café-Werbung",
        video: "media/cafe.mp4",
        poster: "media/cafe.jpg",
        shape: "v",
        alt: "Café-Werbung: Croissants und Kaffee",
        meta: [
          "Werbung 9:16",
          "28 Sekunden",
          "großer Text im Bild"
        ],
        prompt: "Ein kurzer Werbeclip für ein gemütliches Café um die Ecke: Morgen, Duft von frischem Kaffee, Croissants, eine lächelnde Barista und am Ende die Einladung, heute noch vorbeizukommen"
      },
      {
        label: "Ozean",
        video: "media/ocean.mp4",
        poster: "media/ocean.jpg",
        shape: "h",
        alt: "Video über den Ozean: eine Qualle und das Blue Hole",
        meta: [
          "YouTube 16:9",
          "26 Sekunden",
          "lebendige Szenen"
        ],
        prompt: "Ein Video über den Ozean: die erstaunlichsten Orte und Lebewesen, die kaum jemand je gesehen hat"
      }
    ],
    initial: {
      prompt: "Taxifahrer Oleg erzählt eine lustige Geschichte über einen Fahrgast, der eine Geburtstagstorte in seinem Auto vergessen hat",
      meta: [
        "Short 9:16",
        "30 Sekunden",
        "Stimme und Wort-für-Wort-Untertitel"
      ],
      image: {
        src: "media/oleg.jpg",
        alt: "Short: Taxifahrer Oleg und eine vergessene Torte",
        width: 404,
        height: 720
      }
    },
    note: "Ausschnitt ohne Ton, mit russischer Stimme und Untertiteln. Die ganzen Clips mit Ton sehen Sie im Showreel."
  },
  reel: {
    id: "reel",
    tag: "Showreel",
    title: "25 Sekunden echte Ergebnisse",
    lead: "Nur, was die App gemacht hat. Schalten Sie den Ton ein: Stimme und Musik stammen ebenfalls aus der App.",
    video: {
      src: "media/reel-en.mp4",
      poster: "media/reel-en.jpg",
      width: 960,
      height: 540,
      label: "KADR Studio Showreel, 25 Sekunden, mit Ton"
    },
    captions: [
      "Ausschnitte genau so, wie die App sie gerendert hat. Wir haben sie nur aneinandergefügt.",
      "2 MB · mit Ton"
    ],
    ctas: [
      {
        label: "KADR Studio herunterladen",
        href: "#download",
        variant: "main"
      },
      {
        label: "So funktioniert's",
        href: "#how",
        variant: "ghost"
      }
    ]
  },
  tutorial: {
    id: "tutorial",
    tag: "Video-Tutorial",
    title: "Ihr erstes Video in 2 Minuten",
    lead: "Wo Sie die Idee eintippen, wie Sie Format und Stimme wählen und wo das fertige Video landet.",
    video: {
      src: "media/tutorial-uk.mp4",
      poster: "media/tutorial-uk.jpg",
      width: 1280,
      height: 720,
      label: "KADR Studio Tutorial: Ihr erstes Video in 2 Minuten (auf Ukrainisch)"
    },
    captions: [
      "Das Video ist auf Ukrainisch · 2:01 · mit Ton",
      "4 MB"
    ]
  },
  who: {
    id: "who",
    tag: "Für wen",
    title: "Für wen KADR Studio gemacht ist",
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
              label: "Short aus dem Traum-Film: ein leuchtendes Porträt"
            },
            {
              src: "media/short-2.mp4",
              poster: "media/short-2.jpg",
              width: 404,
              height: 720,
              label: "Short aus dem Traum-Film: ein leuchtendes Gehirn"
            },
            {
              src: "media/short-3.mp4",
              poster: "media/short-3.jpg",
              width: 404,
              height: 720,
              label: "Short aus dem Traum-Film: Nahaufnahme eines Auges"
            }
          ]
        },
        title: "Creator für TikTok, Shorts und Reels",
        text: "Jeden Tag Hochkant-Videos ohne Dreh und Schnitt. Aus einem langen Film wird eine Shorts-Serie.",
        source: "Beispiel: 7 Shorts aus einem Traum-Film",
        details: "„Shorts schneiden“ macht aus einem langen Film 3 bis 8 Clips, jeder mit Aufhänger-Titel, Gesichtszuschnitt, Text und Hashtags."
      },
      {
        media: {
          kind: "solo",
          image: {
            src: "media/cafe.jpg",
            alt: "Bild aus der Café-Werbung: Croissants und großer Text",
            width: 404,
            height: 720
          }
        },
        title: "Kleine Unternehmen",
        text: "Werbung für Café, Laden oder Dienstleistung aus einem Satz. Ihr Produkt sieht in jedem Bild gleich aus.",
        source: "Beispiel: Café-Werbung aus einem Satz, 28 Sekunden",
        details: "Formate 9:16, 1:1 und 4:5. Produkt oder Figur legen Sie per Foto fest. Es gibt eine Vorlage „Produktwerbung“."
      },
      {
        media: {
          kind: "video",
          video: {
            src: "media/film.mp4",
            poster: "media/film.jpg",
            width: 960,
            height: 540,
            label: "Ausschnitt aus dem Traum-Film"
          }
        },
        title: "YouTube-Erklärvideos und Faceless-Kanäle",
        text: "Erklärvideos und Filme bis 30 Minuten mit Kapiteln. Ein KI-Regisseur schreibt das Drehbuch und wählt die Perspektiven.",
        source: "Beispiel: der Traum-Film, 17 Minuten, aus einem Briefing",
        details: "Ein Drehbuch mit Aufhänger, gewählte Einstellungen und Perspektiven, dazu Texte zum Posten: Titel, Beschreibung mit Kapiteln, Hashtags."
      },
      {
        media: {
          kind: "pair",
          items: [
            {
              image: {
                src: "media/lang-en.jpg",
                alt: "Filmbild mit englischen Untertiteln",
                width: 800,
                height: 450
              },
              badge: "EN"
            },
            {
              image: {
                src: "media/lang-ru.jpg",
                alt: "Dasselbe Bild mit russischen Untertiteln",
                width: 800,
                height: 450
              },
              badge: "RU"
            }
          ]
        },
        title: "In mehreren Sprachen",
        text: "Dieselben Bilder in einer anderen Sprache, mit muttersprachlichem Sprecher und übersetzten Untertiteln.",
        source: "Beispiel: der Traum-Film auf Englisch und auf Russisch",
        details: "Kostenlose neuronale Stimmen, auch auf Deutsch und Spanisch. Mit einem ElevenLabs-Schlüssel gibt es deren Stimmen, auch Ihre geklonte."
      }
    ]
  },
  how: {
    id: "how",
    tag: "So funktioniert's",
    title: "Drei Schritte von der Idee zum MP4",
    lead: "Keine Timeline. Sie beschreiben, was Sie brauchen, die App erledigt den Rest.",
    steps: [
      {
        n: "1",
        title: "Idee schreiben",
        text: "Ein Satz oder Ihr eigener Text, bis zu 30.000 Zeichen. Wählen Sie Format und Länge.",
        details: "Formate 9:16, 16:9, 1:1 und 4:5, von 15 Sekunden bis 30 Minuten. Vorlagen: Fakten, Top 5, Geschichte, Produktwerbung, Tutorial."
      },
      {
        n: "2",
        title: "➤ drücken",
        text: "KADR schreibt das Drehbuch, vertont es, zeichnet Bilder, belebt Szenen, komponiert Musik und setzt Untertitel.",
        details: "Claude, OpenAI oder Gemini schreibt das Drehbuch mit Ihrem Schlüssel. Um die Bilder vorher zu prüfen, schalten Sie das Storyboard ein."
      },
      {
        n: "3",
        title: "Fertiges Video mitnehmen",
        text: "Ein MP4 mit Lautstärke für Social Media. Jedes Bild zeichnen Sie per Klick neu.",
        details: "Die „Videoprüfung“ findet Schwächen selbst und sagt Ihnen in klaren Worten, was zu ändern ist."
      }
    ],
    note: "Auf einer RTX 3060 dauert ein Bild etwa eine Minute, ein 20-Minuten-Film etwa 4 Stunden.",
    screenshot: {
      src: "img/home-en.jpg",
      alt: "Startbildschirm von KADR Studio: Ideenfeld, Formate und Vorlagen",
      width: 1280,
      height: 820
    },
    caption: "Der Startbildschirm: Idee, Format, Vorlage und die Taste ➤."
  },
  looks: {
    id: "looks",
    tag: "So wird es aussehen",
    title: "Bildstil mit einem Klick",
    lead: "12 Stile, von Kino bis Anime und 3D-Animation. Dasselbe Bild in verschiedenen Stilen:",
    styles: [
      {
        name: "Kino",
        image: {
          src: "img/look-cinema.jpg",
          alt: "Kino"
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
        name: "3D-Animation",
        image: {
          src: "img/look-cartoon3d.jpg",
          alt: "3D-Animation"
        }
      },
      {
        name: "Aquarell",
        image: {
          src: "img/look-watercolor.jpg",
          alt: "Aquarell"
        }
      },
      {
        name: "Neon Noir",
        image: {
          src: "img/look-neon.jpg",
          alt: "Neon Noir"
        }
      },
      {
        name: "Produktwerbung",
        image: {
          src: "img/look-studio.jpg",
          alt: "Produktwerbung"
        }
      }
    ]
  },
  req: {
    id: "req",
    tag: "Ehrlich zur Hardware",
    title: "Auch ohne GPU",
    lead: "Was Sie heute auf Ihrem Computer bekommen. Die KADR Cloud mit RTX 5090 kommt bald.",
    tiers: [
      {
        who: "PC MIT NVIDIA, 8 BIS 12 GB",
        title: "Alles auf Ihrer GPU",
        paragraphs: [
          "Bilder, Szenen und Musik entstehen auf Ihrer Karte. Keine Kosten pro Bild.",
          "Windows 10/11, 64 Bit."
        ],
        details: "Den Generator (etwa 28 GB) lädt und installiert die App selbst."
      },
      {
        who: "MAC MIT APPLE M1, M2, M3, M4",
        title: "Der Mac zeichnet die Bilder",
        paragraphs: [
          "Ab 16 GB Arbeitsspeicher entstehen die Bilder direkt auf dem Mac.",
          "Ab macOS 12. Macs mit Intel funktionieren auch."
        ],
        details: "Lebendige Szenen laufen auf dem Mac selbst noch nicht. Stimme, Untertitel, Schnitt und Export funktionieren auf jedem Mac."
      },
      {
        who: "JEDER COMPUTER",
        title: "Video auch ohne GPU",
        paragraphs: [
          "KI-Bilder liefert ein Dienst mit Ihrem Schlüssel, oder kostenlose Fotos von Pexels und Pixabay.",
          "Bald kommt die KADR Cloud: Dann rechnen unsere RTX 5090 die Bilder."
        ],
        details: "Ohne Schlüssel liest eine kostenlose neuronale Stimme Ihren Text vor einem animierten Hintergrund. In ein, zwei Minuten fertig."
      }
    ],
    notes: {
      title: "Gut zu wissen",
      items: [
        "Das Tempo hängt von der GPU ab: Auf einer RTX 3060 dauert ein Bild etwa eine Minute.",
        "Bei einem Stromausfall geht nichts verloren: Die App macht dort weiter, wo sie aufgehört hat.",
        "KI-Drehbücher und ElevenLabs-Stimmen laufen über Ihre eigenen Schlüssel. Ein Gemini-Schlüssel ist kostenlos.",
        "Die Oberfläche der App ist auf Englisch, Ukrainisch und Russisch. Deutsch folgt später.",
        "Beim ersten Start auf dem Mac öffnen Sie „Systemeinstellungen“ → „Datenschutz & Sicherheit“ → „Dennoch öffnen“."
      ]
    }
  },
  cloud: {
    id: "cloud",
    tag: "KADR Cloud",
    title: "Unsere RTX 5090 arbeiten bald für Sie",
    lead: "Die KADR Cloud kommt bald: Videos auf jedem Computer, auch auf einem schwachen Laptop oder einem Mac.",
    bullets: [
      "Bilder, lebendige Szenen und Musik entstehen dann auf unseren Servern mit RTX 5090.",
      "Sie zahlen mit Energie ⚡: Pakete ab $10, den Preis zeigt die App vor dem Start.",
      "Das Aufladen von ⚡ öffnet in der App mit dem Start der Cloud."
    ],
    cta: {
      label: "KADR Studio herunterladen",
      href: "#download",
      variant: "main"
    }
  },
  mobileSoon: {
    tag: "Demnächst",
    title: "Bald als mobile Version",
    text: "Machen Sie Videos direkt auf dem Smartphone. Wir arbeiten bereits an der App."
  },
  features: {
    id: "features",
    tag: "Funktionen",
    title: "Ein ganzes Videostudio in einem Fenster",
    lead: "Rechnen Sie auf Ihrer eigenen GPU oder mit Ihren eigenen Schlüsseln. Bald kommt die Cloud mit RTX 5090.",
    items: [
      {
        icon: "✎",
        title: "KI-Drehbuch",
        text: "Claude, OpenAI oder Gemini mit Ihrem Schlüssel. Ohne Schlüssel wird Ihr Text zum Drehbuch."
      },
      {
        icon: "♪",
        title: "Vertonung",
        text: "Kostenlose neuronale Stimmen, Systemstimmen oder ElevenLabs, auch mit Ihrer geklonten Stimme."
      },
      {
        icon: "▣",
        title: "Bilder auf Ihrer GPU",
        text: "RealVisXL auf Ihrer NVIDIA; der Generator installiert sich per Klick. Ohne NVIDIA kommen Bilder per Schlüssel."
      },
      {
        icon: "▶",
        title: "Lebendige Szenen",
        text: "Schlüsselmomente werden lebendig (Wan 2.2). Etwa 2,5 Minuten pro Szene auf einer RTX 3060."
      },
      {
        icon: "♫",
        title: "Hintergrundmusik",
        text: "Die KI komponiert die Musik (ACE-Step). Keine Suche mehr in Stock-Archiven."
      },
      {
        icon: "Aa",
        title: "Untertitel und Ton",
        text: "Wort-für-Wort-Untertitel und Lautstärke für Social Media. Das MP4 ist sofort postfertig."
      },
      {
        icon: "✂",
        title: "Shorts schneiden",
        text: "3 bis 8 Hochkant-Clips aus einem langen Film, mit Text und Hashtags."
      },
      {
        icon: "☺",
        title: "Eigene und fertige Figuren",
        text: "Eine Figur oder ein Produkt per Foto sieht in jedem Bild gleich aus. Dazu 12 fertige Figuren mit eigener Stimme."
      },
      {
        icon: "文",
        title: "Andere Sprachen",
        text: "Dieselben Bilder, ein muttersprachlicher Sprecher und übersetzte Untertitel."
      },
      {
        icon: "✉",
        title: "Texte zum Posten",
        text: "Titel, Beschreibung mit Kapiteln, Hashtags und angehefteter Kommentar per Klick."
      },
      {
        icon: "✦",
        title: "KI-Assistent",
        text: "Der Chat ändert Szenen und Stil. Vor dem Start schlägt die KI 3 Varianten des Videos vor."
      },
      {
        icon: "⚿",
        title: "Einfache Einrichtung",
        text: "Schlüssel einfügen, die App erkennt den Dienst. Schlüssel werden verschlüsselt gespeichert."
      }
    ]
  },
  download: {
    id: "download",
    tag: "Download",
    title: "Für Windows und Mac",
    lead: "Eine App für beide Computer. Updates bietet sie selbst an.",
    platforms: [
      {
        os: "windows",
        name: "Windows",
        details: "10 und 11, 64 Bit · .exe-Installer · v3.0.3",
        cta: "Für Windows herunterladen",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/download/v3.0.3/KADR-Studio-Setup-3.0.3.exe"
      },
      {
        os: "mac-arm",
        name: "Mac mit Apple-Chip",
        details: "M1, M2, M3, M4 · macOS 12 und neuer · .dmg",
        cta: "Für Mac herunterladen (M-Chip)",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/latest/download/KADR-Studio-3.0-arm64.dmg"
      },
      {
        os: "mac-intel",
        name: "Mac mit Intel",
        details: "macOS 12 und neuer · .dmg",
        cta: "Für Mac herunterladen (Intel)",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/latest/download/KADR-Studio-3.0-x86_64.dmg"
      }
    ],
    note: "Apple-Menü → „Über diesen Mac“. Bei „Chip Apple M…“ nehmen Sie den ersten Button, bei „Prozessor Intel“ den zweiten."
  },
  pricing: {
    id: "pricing",
    tag: "Preise",
    title: "Preise",
    lead: "Starten Sie mit 3 Gratis-Videos. Preise in ukrainischen Hrywnja (UAH); bezahlt wird in USDT zum Tageskurs.",
    currency: "UAH",
    plans: [
      {
        name: "Testversion",
        price: {
          display: "Kostenlos",
          value: 0
        },
        per: "3 Videos bis 60 Sekunden",
        items: [
          "Keine Karte nötig",
          "Ein kleines „KADR Studio“-Zeichen in der Ecke",
          "Alle Stile, Figuren und Schlüssel funktionieren"
        ],
        cta: {
          label: "Kostenlos herunterladen",
          href: "#download",
          variant: "ghost"
        }
      },
      {
        name: "Lizenz „Gründer“",
        badge: "erste 100",
        price: {
          display: "1.999 UAH",
          value: 1999,
          old: "2.999 UAH",
          oldValue: 2999
        },
        per: "einmalig · für die ersten 100 Käufer",
        items: [
          "Kein Wasserzeichen, keine Limits",
          "Alles auf Ihrem PC, 1 Jahr Updates",
          "Zwei Computer",
          "Erst kostenlos testen: 3 Videos"
        ],
        cta: {
          label: "In der App kaufen",
          href: "#download",
          variant: "main"
        },
        highlight: true
      },
      {
        name: "Rundum-Service",
        price: {
          display: "5.999 UAH",
          value: 5999
        },
        per: "einmalig · per Fernzugriff",
        items: [
          "Die Lizenz „Gründer“",
          "Wir richten Ihren PC ein",
          "Ihr erstes Video machen wir gemeinsam"
        ],
        cta: {
          label: "Rundum-Service anfragen",
          href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
          variant: "ghost"
        }
      }
    ],
    extras: [
      {
        title: "Energie ⚡ für die Cloud mit RTX 5090",
        text: "Pakete ab $10. Bilder, Szenen und Musik laufen auf unseren RTX 5090. Aufladen in der App, sobald die Cloud startet."
      },
      {
        title: "Zahlung in USDT",
        text: "USDT auf BNB Smart Chain (BEP-20) zum Tageskurs. Die Lizenz wird in Ihrem Konto automatisch freigeschaltet."
      }
    ],
    note: "Schlüssel für KI-Dienste sind optional. Wenn Sie welche nutzen, zahlen Sie diese Dienste direkt.",
    buy: {
      text: "Kaufen Sie direkt in der App: USDT (BEP-20) zum Tageskurs. Die Lizenz wird in Ihrem Konto automatisch freigeschaltet.",
      cta: {
        label: "Herunterladen und kaufen",
        href: "#download",
        variant: "main"
      },
      note: "Lizenz nicht freigeschaltet? Schreiben Sie an kadrstudia8@gmail.com, wir antworten persönlich."
    },
    legal: [
      {
        label: "Nutzungsbedingungen",
        href: "https://kadrstudia8-hue.github.io/terms-de.html"
      },
      {
        label: "Rückerstattung",
        href: "https://kadrstudia8-hue.github.io/refund-de.html"
      }
    ],
    highlight: "Preis für die ersten 100 Käufer"
  },
  faq: {
    id: "faq",
    tag: "FAQ",
    title: "Häufige Fragen",
    items: [
      {
        q: "Ist das kompliziert?",
        a: [
          "Nein. Idee schreiben, Format und Länge wählen, ➤ drücken. Es gibt Vorlagen, 12 Bildstile und 12 fertige Figuren. Einen Schlüssel fügen Sie einfach ein: Die App erkennt selbst, zu welchem Dienst er gehört."
        ],
        open: true
      },
      {
        q: "In welcher Sprache ist die App?",
        a: [
          "Die Oberfläche ist auf Englisch, Ukrainisch und Russisch; eine deutsche Oberfläche ist noch nicht fertig. Die Videos selbst können auf Deutsch sein: Die App versteht Ihre Idee auf Deutsch und vertont sie mit einer kostenlosen neuronalen Stimme oder mit ElevenLabs."
        ]
      },
      {
        q: "Brauche ich eine eigene GPU?",
        a: [
          "Nein. Die App läuft auch ohne NVIDIA: Die Lizenz entfernt Wasserzeichen und Testlimits, KI-Bilder liefert ein Dienst mit Ihrem Schlüssel, und ohne Schlüssel nutzt sie kostenlose Fotos von Pexels und Pixabay. Mit einer NVIDIA-Karte mit 8 bis 12 GB oder einem Mac mit Apple-Chip ab 16 GB entstehen die Bilder kostenlos bei Ihnen. Bald kommt die KADR Cloud: Dann rechnen unsere RTX 5090 die Bilder."
        ]
      },
      {
        q: "Sieht das nicht nach billigem KI-Brei aus?",
        a: [
          "Sehen Sie sich das Showreel oben an: Das ist echtes Ergebnis der App. Vor dem Rendern schalten Sie das Storyboard ein und lassen jedes Bild neu zeichnen. Danach benennt die „Videoprüfung“ Schwächen in klaren Worten und zeichnet grobe Fehler einmal selbst neu. Mit einem Gemini-Schlüssel prüft eine KI die lebendigen Szenen: Misslungene werden neu gedreht, nach zwei Fehlversuchen bleibt die Szene ein gutes Standbild."
        ]
      },
      {
        q: "Wie lange dauert ein Video?",
        a: [
          "Das hängt von der GPU ab. Auf einer RTX 3060 dauert ein Bild etwa eine Minute, eine lebendige Szene etwa 2,5 Minuten, ein 20-Minuten-Film etwa 4 Stunden. Ein Video aus Ihrem Text ohne Schlüssel und ohne GPU ist in ein bis zwei Minuten fertig."
        ]
      },
      {
        q: "Was kostet es?",
        a: [
          "Die Testversion ist kostenlos: 3 Videos bis 60 Sekunden. Die Lizenz „Gründer“ kostet ",
          {
            b: "1.999 UAH"
          },
          " für die ersten 100 Käufer, danach 2.999 UAH: kein Wasserzeichen, keine Limits, 1 Jahr Updates, zwei Computer. Der Rundum-Service kostet 5.999 UAH. Bezahlt wird in der App in USDT auf BNB Smart Chain (BEP-20) zum Tageskurs. Energie ⚡ für die Cloud mit RTX 5090 gibt es in Paketen ab $10; das Aufladen öffnet mit dem Start der Cloud. Fragen zur Zahlung beantworten wir unter ",
          {
            a: "kadrstudia8@gmail.com",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F"
          },
          "."
        ]
      },
      {
        q: "Wie bekomme ich Zugang?",
        a: [
          "Laden Sie KADR Studio herunter: Die Testversion mit 3 Videos läuft sofort. Um Wasserzeichen und Limits zu entfernen, kaufen Sie die Lizenz direkt in der App. Nach der Zahlung in USDT wird die Lizenz in Ihrem Konto automatisch freigeschaltet. Falls nicht, schreiben Sie uns; die Kontakte stehen auf der Seite ",
          {
            a: "Support",
            href: "https://kadrstudia8-hue.github.io/support-de.html"
          },
          "."
        ]
      },
      {
        q: "Was ist Energie ⚡?",
        a: [
          "Mit Energie ⚡ bezahlen Sie die Miete unserer Server mit RTX 5090. Darauf entstehen Bilder, lebendige Szenen und Musik, eine eigene GPU brauchen Sie nicht. ⚡ wird abgebucht, sobald Bilder fertig sind, den Preis sehen Sie vor dem Start. Pakete ab $10; das Aufladen öffnet in der App mit dem Start der Cloud. ⚡ ist weder Geld noch Kryptowährung und nicht übertragbar."
        ]
      },
      {
        q: "Läuft es auf dem Mac?",
        a: [
          "Ja: macOS 12 und neuer, Macs mit Apple-Chip (M1, M2, M3, M4) oder Intel. Auf Macs mit Apple-Chip ab 16 GB entstehen die Bilder direkt auf dem Computer, auf anderen mit dem Schlüssel eines Dienstes und nach dem Cloud-Start auf unseren RTX 5090. Lebendige Szenen laufen auf dem Mac selbst noch nicht. Stimme, Untertitel, Schnitt und Export funktionieren auf jedem Mac. Beim ersten Start fragt macOS einmal nach: „Systemeinstellungen“ → „Datenschutz & Sicherheit“ → „Dennoch öffnen“."
        ]
      },
      {
        q: "Brauche ich kostenpflichtige KI-Schlüssel?",
        a: [
          "Nein. Ohne Schlüssel wird Ihr eigener Text zum Drehbuch, eingesprochen von kostenlosen neuronalen Stimmen oder Systemstimmen. Mit einem Schlüssel für Claude, OpenAI oder Gemini schreibt die KI das Drehbuch; der Gemini-Schlüssel ist kostenlos. Ein ElevenLabs-Schlüssel schaltet die ElevenLabs-Stimmen frei, auch Ihre geklonte."
        ]
      },
      {
        q: "Wohin gehen meine Daten und Schlüssel?",
        a: [
          "Videos, Drehbücher und Projekte bleiben auf Ihrem Computer. Das Konto dient nur der Aktivierung und dem ⚡-Guthaben; es gibt keine Telemetrie. Schlüssel werden verschlüsselt gespeichert: unter Windows mit DPAPI, auf dem Mac im Schlüsselbund. Externe Dienste (Claude, OpenAI, Gemini, ElevenLabs) erhalten den Anfragetext direkt mit Ihrem Schlüssel. Mehr in der ",
          {
            a: "Datenschutzerklärung",
            href: "https://kadrstudia8-hue.github.io/privacy-de.html"
          },
          "."
        ]
      },
      {
        q: "Welche Formate und Längen?",
        a: [
          "9:16 für Shorts, TikTok und Reels, 16:9 für YouTube, dazu 1:1 und 4:5. Von 15 Sekunden bis 30 Minuten."
        ]
      },
      {
        q: "Kann ich mein Geld zurückbekommen?",
        a: [
          "Käufe sind endgültig, deshalb testen Sie zuerst kostenlos: 3 Videos bis 60 Sekunden. Geld erstatten wir, wenn eine Zahlung doppelt abgebucht wurde oder die App auf einem passenden Computer nicht läuft und der Support nicht helfen konnte. Alle Bedingungen stehen in der ",
          {
            a: "Rückerstattungsrichtlinie",
            href: "https://kadrstudia8-hue.github.io/refund-de.html"
          },
          "."
        ]
      }
    ]
  },
  contact: {
    id: "contact",
    tag: "Probieren Sie es mit Ihrer eigenen Idee",
    title: "Ein Satz und ➤",
    lead: "Laden Sie KADR Studio herunter und schreiben Sie, worum es im Video geht. Fragen beantworten wir persönlich.",
    ctas: [
      {
        label: "KADR Studio herunterladen",
        href: "#download",
        variant: "main",
        osAware: true
      },
      {
        label: "Support kontaktieren",
        href: "https://kadrstudia8-hue.github.io/support-de.html",
        variant: "ghost"
      }
    ]
  },
  ctaBand: {
    title: "Ihr erstes Video in 2 Minuten",
    subtitle: "3 Videos gratis. Ohne Karte.",
    cta: {
      label: "Kostenlos herunterladen",
      href: "#download",
      variant: "main"
    }
  },
  mobileBar: {
    label: "Schnellaktionen",
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
        label: "Nutzungsbedingungen",
        href: "https://kadrstudia8-hue.github.io/terms-de.html"
      },
      {
        label: "Datenschutz",
        href: "https://kadrstudia8-hue.github.io/privacy-de.html"
      },
      {
        label: "Rückerstattung",
        href: "https://kadrstudia8-hue.github.io/refund-de.html"
      },
      {
        label: "Lizenzen",
        href: "https://kadrstudia8-hue.github.io/licenses-de.html"
      },
      {
        label: "Support",
        href: "https://kadrstudia8-hue.github.io/support-de.html"
      },
      {
        label: "Schreiben Sie uns",
        href: "mailto:kadrstudia8@gmail.com"
      }
    ],
    note: "Windows 10/11 und macOS 12+ · Keine Telemetrie"
  },
  ui: {
    downloadMac: "Für Mac herunterladen",
    downloadWindows: "Für Windows herunterladen",
    linkCopied: "Link kopiert",
    langHint: {
      question: "Diese Seite auf Deutsch lesen?",
      accept: "Auf Deutsch",
      close: "Schließen"
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
          label: "Beispiele",
          href: "#proof"
        },
        {
          label: "So funktioniert’s",
          href: "#how"
        },
        {
          label: "Preise",
          href: "#pricing"
        }
      ],
      cta: {
        label: "Testen",
        href: "#download",
        variant: "main"
      }
    },
    hero: {
      id: "top",
      title: [
        {
          text: "Ein Satz.",
          nowrap: true
        },
        {
          text: "Ein fertiges Video.",
          accent: true
        }
      ],
      subtitle: "Die App schreibt das Drehbuch, vertont es, zeichnet die Bilder und schneidet das Video.",
      cta: {
        label: "Kostenlos testen",
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
        "3 Videos gratis",
        "Ohne Karte",
        "Windows und Mac"
      ],
      note: "kein Dreh, kein Schnitt",
      sticker: "3 Videos gratis",
      mobile: {
        cta: {
          label: "Link an mich senden",
          href: "#top",
          variant: "main",
          action: "share"
        },
        caption: "Die App läuft auf dem Computer. Öffnen Sie den Link auf einem PC oder Mac."
      }
    },
    proof: {
      id: "proof",
      tag: "Echte Beispiele",
      title: "Das hat die App gemacht",
      subtitle: "Tippen Sie ein Video an. Darunter steht der Satz, aus dem es entstand.",
      promptLabel: "Mehr hat der Autor nicht geschrieben",
      reelCard: "Showreel mit Ton, 25 Sekunden",
      cta: {
        label: "Showreel ansehen, 25 s",
        href: "#proof",
        variant: "ghost",
        action: "play-reel"
      }
    },
    who: {
      id: "who",
      title: "Für wen es ist",
      subtitle: "Wählen Sie Ihres. Wir zeigen Beispiel und Stil.",
      cards: [
        {
          title: "Shorts und Reels",
          text: "Jeden Tag Hochkant-Videos. Ohne Kamera."
        },
        {
          title: "Werbung fürs Geschäft",
          text: "Café, Laden oder Dienstleistung aus einem Satz."
        },
        {
          title: "YouTube ohne Gesicht",
          text: "Filme bis 30 Minuten mit Kapiteln."
        },
        {
          title: "Andere Sprachen",
          text: "Dasselbe Video mit neuem Sprecher."
        }
      ],
      stylesTitle: "12 Stile. Ein Klick.",
      cta: {
        label: "Mit Ihrer Idee testen",
        href: "#download",
        variant: "main"
      }
    },
    how: {
      id: "how",
      title: "Drei Schritte zum Video",
      subtitle: "Idee schreiben. Knopf drücken. Fertige Datei mitnehmen.",
      steps: [
        "Idee schreiben",
        "➤ drücken",
        "Video mitnehmen"
      ],
      screenshotCaption: "So sieht die App aus",
      note: "„Weißt du noch, der Game Boy?“",
      cta: {
        label: "Tutorial, 2 Minuten",
        href: "#how",
        variant: "ghost",
        action: "play-tutorial"
      }
    },
    compare: {
      id: "compare",
      title: "Früher und mit KADR",
      subtitle: "Sechs Aufgaben, sechs Leute. Oder ein Satz.",
      before: {
        title: "Früher",
        items: [
          "Drehbuch",
          "Sprecher",
          "Dreh",
          "Schnitt",
          "Musik",
          "Untertitel"
        ]
      },
      after: {
        title: "Mit KADR",
        text: "Ein Satz und ➤"
      },
      note: "Ein einfaches Video aus Ihrem Text ist in ein, zwei Minuten fertig.",
      more: {
        label: "Was die App noch kann",
        items: [
          "Lebendige Szenen: Schlüsselmomente bewegen sich",
          "Wort-für-Wort-Untertitel und Lautstärke für Social Media",
          "Schneidet einen langen Film in Shorts",
          "Ihre Figur oder Ihr Produkt per Foto in jedem Bild",
          "Fassungen in anderen Sprachen",
          "Titel, Beschreibung und Hashtags per Klick",
          "Ein KI-Assistent ändert Szenen und Stil",
          "Vor dem Start 3 Varianten des Videos zur Auswahl"
        ]
      },
      cta: {
        label: "Kostenlos testen",
        href: "#download",
        variant: "main"
      }
    },
    pc: {
      id: "pc",
      title: "Ihr Computer reicht",
      subtitle: "Mit GPU läuft alles gratis bei Ihnen. Ohne hilft unsere Cloud.",
      tiles: [
        {
          title: "Ihr eigener Computer",
          text: "Windows oder Mac. Bilder und Musik entstehen bei Ihnen."
        },
        {
          title: "KADR Cloud",
          badge: "Bald",
          text: "Bald arbeiten unsere RTX 5090 für Sie. Bezahlt mit Energie ⚡ ab $10."
        }
      ],
      mobileChip: "Mobile Version bald",
      details: [
        "Kostenlos bei Ihnen entstehen Bilder auf einer NVIDIA-Karte mit 8 bis 12 GB oder auf einem Mac mit Apple-Chip ab 16 GB Arbeitsspeicher. Den Generator (etwa 28 GB) lädt die App selbst.",
        "Ohne solche Karte funktioniert die App trotzdem: Die Lizenz entfernt Wasserzeichen und Testlimits, Bilder liefert ein Dienst mit Ihrem Schlüssel oder kostenlose Fotos von Pexels und Pixabay.",
        "Sie brauchen Windows 10/11 (64 Bit) oder macOS 12 und neuer. Lebendige Szenen laufen auf dem Mac selbst noch nicht.",
        "Beim ersten Start auf dem Mac öffnen Sie „Systemeinstellungen“ → „Datenschutz & Sicherheit“ → „Dennoch öffnen“."
      ],
      cta: {
        label: "Welchen Computer habe ich?",
        href: "#pc",
        variant: "ghost",
        action: "disclose"
      }
    },
    pricing: {
      id: "pricing",
      title: "Zuerst kostenlos",
      subtitle: "Keine Erstattungen. Deshalb gehen die ersten 3 Videos auf uns.",
      currency: "UAH",
      plans: [
        {
          id: "trial",
          tone: "entry",
          label: "Hier starten",
          name: "Testversion",
          price: {
            display: "0 UAH",
            value: 0
          },
          per: "3 Videos bis 60 Sekunden",
          items: [
            "Ohne Karte",
            "Alle Stile und Figuren",
            "Kleines KADR-Zeichen in der Ecke"
          ],
          cta: {
            label: "Herunterladen und testen",
            href: "#download",
            variant: "main"
          }
        },
        {
          id: "founder",
          tone: "center",
          label: "Für die ersten 100 Käufer",
          name: "Lizenz „Gründer“",
          price: {
            display: "1.999 UAH",
            value: 1999,
            old: "2.999 UAH",
            oldValue: 2999
          },
          then: "danach 2.999 UAH",
          per: "Einmal zahlen. Für immer.",
          items: [
            "Kein Wasserzeichen, keine Limits",
            "Zwei Computer",
            "1 Jahr Updates"
          ],
          cta: {
            label: "Für 1.999 UAH kaufen",
            href: "#download",
            variant: "ghost"
          },
          note: "Kauf in der App, nach dem Test"
        },
        {
          id: "turnkey",
          tone: "premium",
          label: "Premium",
          name: "Rundum-Service",
          price: {
            display: "5.999 UAH",
            value: 5999
          },
          per: "Wir richten alles für Sie ein. Per Fernzugriff.",
          items: [
            "Lizenz „Gründer“ inklusive",
            "Installation und Einrichtung Ihres PCs",
            "Ihr erstes Video machen wir gemeinsam"
          ],
          cta: {
            label: "Rundum-Service anfragen",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
            variant: "ghost"
          }
        }
      ],
      honest: "Keine Erstattungen. Deshalb zuerst 3 Videos gratis.",
      currencyNote: "Die App rechnet den Preis zum Tageskurs in USDT um.",
      pay: {
        title: "So bezahlen Sie",
        steps: [
          "App herunterladen",
          "In der App auf „Kaufen“ klicken",
          "In USDT zahlen, Netzwerk BEP-20"
        ],
        help: "Kein USDT? In der App steht, wie Sie es kaufen."
      },
      cloud: "Die Cloud mit unseren RTX 5090 kommt bald. Bezahlt mit Energie ⚡, Pakete ab $10.",
      cta: {
        label: "Herunterladen und testen",
        href: "#download",
        variant: "main"
      }
    },
    faq: {
      id: "faq",
      title: "Ehrliche Antworten",
      subtitle: "Sechs Fragen, die man vor dem Kauf stellt.",
      items: [
        {
          q: "Ist das kompliziert?",
          a: [
            "Nein. Idee schreiben, Format und Länge wählen, ➤ drücken. Es gibt Vorlagen, 12 Bildstile und 12 fertige Figuren."
          ],
          open: true
        },
        {
          q: "Sieht das nicht nach billigem KI-Brei aus?",
          a: [
            "Sehen Sie sich die Beispiele oben an: Das ist echtes Ergebnis der App. Vor dem Rendern prüfen Sie das Storyboard und lassen jedes Bild neu zeichnen. Danach benennt die „Videoprüfung“ Schwächen in klaren Worten und zeichnet grobe Fehler einmal selbst neu."
          ]
        },
        {
          q: "Brauche ich eine starke GPU?",
          a: [
            "Nein. Die App läuft unter Windows 10/11 und auf Macs mit macOS 12 und neuer. Mit einer NVIDIA-Karte ab 8 GB oder einem Mac mit Apple-Chip ab 16 GB entstehen die Bilder kostenlos bei Ihnen. Ohne sie liefert ein Dienst mit Schlüssel die Bilder, oder die App nutzt kostenlose Fotos. Bald kommt die KADR Cloud mit unseren RTX 5090."
          ]
        },
        {
          q: "Wie lange dauert ein Video?",
          a: [
            "Das hängt vom Computer ab. Ein Video aus Ihrem Text ohne GPU ist in ein bis zwei Minuten fertig. Auf einer RTX 3060 dauert ein Bild etwa eine Minute, ein 20-Minuten-Film etwa 4 Stunden."
          ]
        },
        {
          q: "Wie bezahle ich, und warum USDT?",
          a: [
            "Sie kaufen in der App. Klicken Sie auf „Kaufen“: Die App rechnet den Preis zum Tageskurs in USDT um und zeigt Betrag und Adresse. Sie zahlen in USDT auf BNB Smart Chain (BEP-20). So wird die Zahlung automatisch geprüft und die Lizenz ohne Wartezeit freigeschaltet."
          ]
        },
        {
          q: "Kann ich mein Geld zurückbekommen?",
          a: [
            "Nein. Deshalb gibt es die Testversion: 3 Videos gratis, ohne Karte. Kaufen Sie, wenn Ihnen das Ergebnis gefällt. Gesetzliche Ausnahmen stehen in den ",
            {
              a: "Rückerstattungsregeln",
              href: "https://kadrstudia8-hue.github.io/refund-de.html"
            },
            "."
          ]
        }
      ],
      all: {
        label: "Alle Fragen",
        href: "https://kadrstudia8-hue.github.io/support-de.html"
      },
      cta: {
        label: "Schreiben Sie uns",
        href: "https://kadrstudia8-hue.github.io/support-de.html",
        variant: "ghost"
      }
    },
    final: {
      id: "download",
      title: "Ein Satz. Und ➤",
      subtitle: "3 Videos gratis. Ohne Karte, ohne Registrierung auf der Website.",
      cta: {
        label: "KADR Studio herunterladen",
        href: "#download",
        variant: "main",
        osAware: true
      },
      platforms: "Windows · Mac mit M-Chip · Intel-Mac",
      macHelp: {
        label: "Welchen Mac habe ich?",
        text: "Öffnen Sie das Apple-Menü → „Über diesen Mac“. Bei „Chip Apple M…“ nehmen Sie den zweiten Button, bei „Prozessor Intel“ den dritten."
      },
      support: {
        label: "Support schreiben. Wir antworten persönlich.",
        href: "https://kadrstudia8-hue.github.io/support-de.html"
      }
    },
    mobileBar: {
      ctas: [
        {
          label: "Link an mich senden",
          href: "#top",
          variant: "main",
          action: "share"
        },
        {
          label: "Preise",
          href: "#pricing",
          variant: "ghost"
        }
      ]
    }
  }
}

export default de
