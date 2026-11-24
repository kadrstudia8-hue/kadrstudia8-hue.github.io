// KADR Studio landing, DE content (sales rewrite, 2026-11).
// Started as a verbatim copy of the live page; now edited copy on the same product facts.
// Visible copy rules: no long dashes, no word «ролик» (except «Проверка ролика» / «Перевірка ролика»), short paragraphs.
import type { SiteContent } from './types.ts'

export const de: SiteContent = {
  lang: "de",
  meta: {
    htmlLang: "de",
    title: "KADR Studio. Ein Satz. Ein fertiges Video.",
    description: "Schreiben Sie eine Idee, KADR Studio macht das ganze Video: Drehbuch, Stimme, Bilder, Musik und Untertitel. Windows, Mac und KADR Cloud.",
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
      description: "Schreiben Sie eine Idee, KADR Studio macht das ganze Video: Drehbuch, Stimme, Bilder, Musik und Untertitel. Windows, Mac und KADR Cloud.",
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
        label: "Ohne GPU",
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
        "läuft ",
        {
          b: "ohne GPU"
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
      "Keine GPU nötig",
      "Windows und Mac",
      "Keine Werbung"
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
        title: "Läuft auf jedem Computer",
        text: "Die schwere Arbeit erledigen unsere GPUs in der KADR Cloud."
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
    title: "Sie brauchen keine GPU",
    lead: "Wählen Sie, wo gerechnet wird: in unserer Cloud oder auf Ihrem Computer.",
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
        details: "Lebendige Szenen für den Mac rechnet die KADR Cloud. Stimme, Untertitel, Schnitt und Export laufen auf jedem Mac."
      },
      {
        who: "JEDER COMPUTER",
        title: "KADR Cloud",
        paragraphs: [
          "Unsere starken GPUs rechnen Ihre Bilder, lebendigen Szenen und Musik.",
          "Ein schwacher Laptop reicht. ⚡ zahlen Sie nur für fertige Arbeit."
        ],
        details: "Ohne Cloud und Schlüssel liest eine kostenlose neuronale Stimme Ihren Text vor einem animierten Hintergrund. In ein, zwei Minuten fertig."
      }
    ],
    notes: {
      title: "Gut zu wissen",
      items: [
        "Mit eigener GPU hängt das Tempo von der Karte ab: Auf einer RTX 3060 dauert ein Bild etwa eine Minute.",
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
    title: "Unsere GPUs arbeiten für Sie",
    lead: "Machen Sie Videos auf jedem Gerät. Eine eigene GPU brauchen Sie nicht: Ein schwacher Laptop oder ein Mac reicht.",
    bullets: [
      "Bilder, lebendige Szenen und Musik entstehen auf starken GPUs, die wir mieten.",
      "Den Preis zeigt die App vor dem Start. ⚡ wird abgebucht, sobald jedes Bild fertig ist.",
      "Energie-Pakete ab $10 kaufen Sie direkt in der App."
    ],
    cta: {
      label: "Cloud ausprobieren",
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
    lead: "Rechnen Sie in der KADR Cloud, auf Ihrer GPU oder mit Ihren eigenen Schlüsseln.",
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
        title: "Bilder in der Cloud oder zu Hause",
        text: "KADR Cloud oder RealVisXL auf Ihrer NVIDIA. Der Generator installiert sich per Klick."
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
    lead: "Starten Sie kostenlos. Zahlen Sie, wenn Ihnen die Videos gefallen.",
    currency: "USD",
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
        name: "Lebenslange Lizenz",
        badge: "−40%",
        price: {
          display: "$59",
          value: 59,
          old: "$99",
          oldValue: 99
        },
        per: "einmalig · für die ersten 100 Käufer",
        items: [
          "1 Jahr Updates",
          "Danach $99 für alle",
          "Kein Zeichen, keine Limits",
          "14 Tage Rückerstattung, wenn ungenutzt"
        ],
        cta: {
          label: "Mit Rabatt kaufen →",
          href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
          variant: "main"
        },
        highlight: true
      },
      {
        name: "Abo",
        price: {
          display: "$9",
          value: 9
        },
        per: "pro Monat · oder $79 pro Jahr",
        items: [
          "Wenn Sie die App nur eine Zeit lang brauchen",
          "Updates, solange das Abo läuft",
          "Jederzeit kündbar"
        ],
        cta: {
          label: "Abonnieren",
          href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
          variant: "ghost"
        }
      }
    ],
    extras: [
      {
        title: "Energie ⚡ für die Cloud",
        text: "Pakete ab $10, Aufladen in der App. Die Cloud rechnet Bilder, Szenen und Musik; den Preis sehen Sie vorher."
      },
      {
        title: "Einrichtung als Rundum-Service, $99 bis $149",
        text: "Ich installiere die App, verbinde Ihre Schlüssel, und wir machen gemeinsam Ihr erstes Video. Per Fernzugriff."
      }
    ],
    note: "Schlüssel für KI-Dienste sind optional. Wenn Sie welche nutzen, zahlen Sie diese Dienste direkt.",
    buy: {
      text: "Schreiben Sie an kadrstudia8@gmail.com. Wir senden die Zahlungsdaten und aktivieren die App. Kartenzahlung folgt bald.",
      cta: {
        label: "Per E-Mail kaufen",
        href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
        variant: "main"
      },
      note: "Wir antworten persönlich. Keine Newsletter, keine Tracker."
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
    highlight: "40 % Rabatt für die ersten 100 Käufer"
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
          "Nein. Die KADR Cloud rechnet Bilder, lebendige Szenen und Musik auf unseren GPUs, bezahlt wird in ⚡. Mit einer NVIDIA-Karte mit 8 bis 12 GB oder einem Mac mit Apple-Chip ab 16 GB rechnen Sie die Bilder kostenlos zu Hause. Ohne Cloud und Schlüssel liest eine kostenlose Stimme Ihren Text vor einem animierten Farbhintergrund."
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
          "Das hängt davon ab, wo gerechnet wird. Auf einer RTX 3060 dauert ein Bild etwa eine Minute, eine lebendige Szene etwa 2,5 Minuten, ein 20-Minuten-Film etwa 4 Stunden. Ein Video aus Ihrem Text ohne Schlüssel und ohne GPU ist in ein bis zwei Minuten fertig."
        ]
      },
      {
        q: "Was kostet es?",
        a: [
          "Die Testversion ist kostenlos: 3 Videos bis 60 Sekunden. Eine lebenslange Lizenz kostet ",
          {
            b: "$59"
          },
          " für die ersten 100 Käufer, danach $99, mit 1 Jahr Updates. Ein Abo kostet $9 im Monat oder $79 im Jahr. Energie-Pakete ⚡ für die Cloud gibt es ab $10. Die Einrichtung als Rundum-Service kostet $99 bis $149. Zum Kaufen ",
          {
            a: "schreiben Sie an kadrstudia8@gmail.com",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F"
          },
          ". Kartenzahlung folgt bald."
        ]
      },
      {
        q: "Wie bekomme ich Zugang?",
        a: [
          "Laden Sie KADR Studio herunter und registrieren Sie sich mit Ihrer E-Mail. Ohne Zahlung läuft die Testversion mit 3 Videos. Um Zeichen und Limits zu entfernen, kaufen Sie eine Lizenz oder ein Abo: Schreiben Sie von der E-Mail Ihres Kontos an kadrstudia8@gmail.com, und wir aktivieren es. Das dauert meist nur wenige Minuten zu Geschäftszeiten. Eine ⚡-Aufladung bezahlt nur die Cloud und aktiviert die App nicht. Kontakte finden Sie auf der Seite ",
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
          "Die interne Einheit von KADR für die Cloud. Unsere Server rechnen Bilder, lebendige Szenen und Musik, und ⚡ wird abgebucht, sobald sie fertig sind. Den Preis sehen Sie vor dem Start. Scheitert etwas durch unseren Fehler, wird nichts abgebucht. ⚡ ist weder Geld noch Kryptowährung und nicht übertragbar. Aufgeladen wird in der App, im Fenster „Energie“, mit USDT oder USDC (Netzwerk BEP-20)."
        ]
      },
      {
        q: "Läuft es auf dem Mac?",
        a: [
          "Ja: macOS 12 und neuer, Macs mit Apple-Chip (M1, M2, M3, M4) oder Intel. Die KADR Cloud rechnet Bilder, lebendige Szenen und Musik auf jedem Mac. Auf Macs mit Apple-Chip ab 16 GB entstehen die Bilder auch direkt auf dem Computer. Beim ersten Start fragt macOS einmal nach: „Systemeinstellungen“ → „Datenschutz & Sicherheit“ → „Dennoch öffnen“."
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
          "Ja. Eine Lizenz erstatten wir innerhalb von 14 Tagen, wenn Sie sie nicht genutzt haben. Alle Bedingungen stehen in der ",
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
    subtitle: "3 Videos gratis. Ohne Karte, ohne GPU.",
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
  }
}

export default de
