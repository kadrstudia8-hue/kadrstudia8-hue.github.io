// KADR Studio landing, ES content (sales rewrite, 2026-11).
// Started as a verbatim copy of the live page; now edited copy on the same product facts.
// Visible copy rules: no long dashes, no word «ролик», short paragraphs.
// `page` holds the 9-section CRO structure (redesign/CRO.md); old fields stay for current builds.
import type { SiteContent } from './types.ts'

export const es: SiteContent = {
  lang: "es",
  meta: {
    htmlLang: "es",
    title: "KADR Studio. Una frase. Un vídeo listo.",
    description: "Escribe una idea y KADR Studio hace el vídeo entero: guion, voz, imágenes, música y subtítulos. Para Windows y Mac.",
    canonical: "https://kadrstudia8-hue.github.io/landing-es.html",
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
      locale: "es_ES",
      localeAlternates: [
        "uk_UA",
        "ru_RU",
        "en_US",
        "de_DE"
      ],
      url: "https://kadrstudia8-hue.github.io/landing-es.html",
      title: "KADR Studio. Una frase. Un vídeo listo.",
      description: "Escribe una idea y KADR Studio hace el vídeo entero: guion, voz, imágenes, música y subtítulos. Para Windows y Mac.",
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
        label: "Ejemplos",
        href: "#proof"
      },
      {
        label: "Cómo funciona",
        href: "#how"
      },
      {
        label: "Para quién",
        href: "#who"
      },
      {
        label: "¿Sin GPU?",
        href: "#req"
      },
      {
        label: "Precios",
        href: "#pricing"
      },
      {
        label: "FAQ",
        href: "#faq"
      }
    ],
    langMenuLabel: "Idioma",
    langCurrent: {
      full: "Español",
      short: "ES"
    },
    cta: {
      label: "Descargar",
      href: "#download",
      variant: "ghost"
    }
  },
  hero: {
    id: "top",
    tag: "Una app para Windows y macOS",
    title: [
      {
        text: "Una frase.",
        nowrap: true
      },
      {
        text: "Un vídeo listo.",
        accent: true
      }
    ],
    lead: "Escribe una idea. KADR Studio crea el guion, la voz, las imágenes, la música y los subtítulos, y exporta un MP4.",
    ctas: [
      {
        label: "Descargar KADR Studio",
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
    note: "Windows y Mac · sin anuncios ni telemetría",
    mobileHint: [
      "KADR Studio funciona en el ordenador. Abre esta web en un Mac o PC, o ",
      {
        button: "envíate el enlace",
        action: "share"
      },
      "."
    ],
    video: {
      src: "media/hero-en.mp4",
      poster: "media/hero-en.jpg",
      width: 1280,
      height: 720,
      label: "Planos de la película «Why Does Your Brain Make Dreams Feel Real?», hecha en KADR Studio"
    },
    caption: "No es material de archivo. Son planos de una película de 17 minutos sobre los sueños, hecha con un solo encargo.",
    facts: [
      [
        {
          b: "De 15 segundos a 30 minutos"
        }
      ],
      [
        {
          b: "9:16 · 16:9 · 1:1 · 4:5"
        }
      ],
      [
        "voces ",
        {
          b: "ES · DE · EN · UK · RU"
        }
      ],
      [
        "funciona ",
        {
          b: "sin claves"
        }
      ],
      [
        "tras un corte de luz ",
        {
          b: "sigue donde se quedó"
        }
      ]
    ],
    badges: [
      "3 vídeos gratis",
      "Windows y Mac",
      "Sin anuncios",
      "Licencia para 2 ordenadores"
    ]
  },
  promises: {
    id: "promises",
    tag: "Por qué KADR",
    title: "Vídeo sin cámara ni editor",
    items: [
      {
        icon: "Clapperboard",
        title: "Sin rodar ni editar",
        text: "Tú escribes la idea. KADR se encarga del guion, la voz, las imágenes y la música."
      },
      {
        icon: "Timer",
        title: "Tu primer vídeo en 2 minutos",
        text: "Un tutorial corto te lleva de la idea al MP4 terminado."
      },
      {
        icon: "Gift",
        title: "3 vídeos gratis",
        text: "Modo de prueba sin tarjeta. Compra cuando te guste el resultado."
      },
      {
        icon: "Cloud",
        title: "Pronto, nube con RTX 5090",
        text: "No necesitarás tu propia GPU: nuestros servidores generarán los planos."
      },
      {
        icon: "Film",
        title: "MP4 para cada plataforma",
        text: "TikTok, Shorts, Reels y YouTube: 9:16, 16:9, 1:1 y 4:5."
      },
      {
        icon: "ShieldCheck",
        title: "Sin anuncios ni telemetría",
        text: "Tus proyectos y vídeos se quedan en tu ordenador."
      }
    ]
  },
  proof: {
    id: "proof",
    tag: "Ejemplos reales",
    title: "Una frase → un vídeo",
    lead: "Peticiones reales y los vídeos que KADR Studio hizo con ellas. Se escribieron en ruso; aquí van traducidas.",
    tablistLabel: "Peticiones de ejemplo",
    examples: [
      {
        label: "Taxi y tarta",
        video: "media/oleg.mp4",
        poster: "media/oleg.jpg",
        shape: "v",
        alt: "Short: el taxista Oleg y una tarta olvidada por un pasajero",
        meta: [
          "Short 9:16",
          "31 segundos",
          "voz y subtítulos palabra a palabra"
        ],
        prompt: "El taxista Oleg cuenta una historia divertida sobre un pasajero que se olvidó una tarta de cumpleaños en su coche"
      },
      {
        label: "3 consejos de taxi",
        video: "media/oleg-tips.mp4",
        poster: "media/oleg-tips.jpg",
        shape: "v",
        alt: "Short: el taxista Oleg da consejos",
        meta: [
          "Short 9:16",
          "30 segundos",
          "el mismo protagonista en cada plano"
        ],
        prompt: "El taxista Oleg da 3 consejos para moverse en taxi por la ciudad pagando menos"
      },
      {
        label: "Anuncio de café",
        video: "media/cafe.mp4",
        poster: "media/cafe.jpg",
        shape: "v",
        alt: "Anuncio de cafetería: cruasanes y café",
        meta: [
          "Anuncio 9:16",
          "28 segundos",
          "texto grande en pantalla"
        ],
        prompt: "Un anuncio corto para una cafetería acogedora del barrio: mañana, olor a café recién hecho, cruasanes, una barista sonriente y, al final, una invitación a pasarse hoy mismo"
      },
      {
        label: "Océano",
        video: "media/ocean.mp4",
        poster: "media/ocean.jpg",
        shape: "h",
        alt: "Vídeo sobre el océano: una medusa y el Gran Agujero Azul",
        meta: [
          "YouTube 16:9",
          "26 segundos",
          "escenas animadas"
        ],
        prompt: "Un vídeo sobre el océano: los lugares y criaturas más asombrosos que muy poca gente ha visto"
      }
    ],
    initial: {
      prompt: "El taxista Oleg cuenta una historia divertida sobre un pasajero que se olvidó una tarta de cumpleaños en su coche",
      meta: [
        "Short 9:16",
        "30 segundos",
        "voz y subtítulos palabra a palabra"
      ],
      image: {
        src: "media/oleg.jpg",
        alt: "Short: el taxista Oleg y una tarta olvidada por un pasajero",
        width: 404,
        height: 720
      }
    },
    note: "Fragmento sin sonido, con voz y subtítulos en ruso. Los clips completos con sonido están en el showreel."
  },
  reel: {
    id: "reel",
    tag: "Showreel",
    title: "25 segundos de trabajo real",
    lead: "Solo lo que hizo la app. Activa el sonido: la voz y la música también salen de la app.",
    video: {
      src: "media/reel-en.mp4",
      poster: "media/reel-en.jpg",
      width: 960,
      height: 540,
      label: "Showreel de KADR Studio, 25 segundos, con sonido"
    },
    captions: [
      "Fragmentos tal como los renderizó la app. Solo los hemos unido.",
      "2 MB · con sonido"
    ],
    ctas: [
      {
        label: "Descargar KADR Studio",
        href: "#download",
        variant: "main"
      },
      {
        label: "Cómo funciona",
        href: "#how",
        variant: "ghost"
      }
    ]
  },
  tutorial: {
    id: "tutorial",
    tag: "Videotutorial",
    title: "Tu primer vídeo en 2 minutos",
    lead: "Dónde escribir la idea, cómo elegir formato y voz, y dónde encontrar el vídeo terminado.",
    video: {
      src: "media/tutorial-uk.mp4",
      poster: "media/tutorial-uk.jpg",
      width: 1280,
      height: 720,
      label: "Tutorial de KADR Studio: tu primer vídeo en 2 minutos (en ucraniano)"
    },
    captions: [
      "El vídeo está en ucraniano · 2:01 · con sonido",
      "4 MB"
    ]
  },
  who: {
    id: "who",
    tag: "Para quién",
    title: "Para quién es KADR Studio",
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
              label: "Short de la película sobre los sueños: un retrato luminoso"
            },
            {
              src: "media/short-2.mp4",
              poster: "media/short-2.jpg",
              width: 404,
              height: 720,
              label: "Short de la película sobre los sueños: un cerebro luminoso"
            },
            {
              src: "media/short-3.mp4",
              poster: "media/short-3.jpg",
              width: 404,
              height: 720,
              label: "Short de la película sobre los sueños: primer plano de un ojo"
            }
          ]
        },
        title: "Creadores de TikTok, Shorts y Reels",
        text: "Vídeos verticales cada día sin rodar ni editar. Una película larga se convierte en una serie de Shorts.",
        source: "Ejemplo: 7 Shorts sacados de una película sobre los sueños",
        details: "«Cortar Shorts» saca de una película larga entre 3 y 8 clips, cada uno con título gancho, encuadre por la cara, texto y hashtags."
      },
      {
        media: {
          kind: "solo",
          image: {
            src: "media/cafe.jpg",
            alt: "Plano del anuncio de la cafetería: cruasanes y texto grande",
            width: 404,
            height: 720
          }
        },
        title: "Pequeños negocios",
        text: "Anuncios para un café, una tienda o un servicio con una sola frase. Tu producto sale igual en cada plano.",
        source: "Ejemplo: anuncio de cafetería a partir de una frase, 28 segundos",
        details: "Formatos 9:16, 1:1 y 4:5. Define el producto o el personaje con fotos. Hay una plantilla «Anuncio de producto»."
      },
      {
        media: {
          kind: "video",
          video: {
            src: "media/film.mp4",
            poster: "media/film.jpg",
            width: 960,
            height: 540,
            label: "Fragmento de la película sobre los sueños"
          }
        },
        title: "Divulgación en YouTube y canales sin cara",
        text: "Vídeos explicativos y películas de hasta 30 minutos con capítulos. Un director de IA escribe el guion.",
        source: "Ejemplo: la película sobre los sueños, 17 minutos, a partir de un solo encargo",
        details: "Un guion que abre con gancho, planos y ángulos elegidos, y textos para publicar: título, descripción con capítulos, hashtags."
      },
      {
        media: {
          kind: "pair",
          items: [
            {
              image: {
                src: "media/lang-en.jpg",
                alt: "Plano de la película con subtítulos en inglés",
                width: 800,
                height: 450
              },
              badge: "EN"
            },
            {
              image: {
                src: "media/lang-ru.jpg",
                alt: "El mismo plano con subtítulos en ruso",
                width: 800,
                height: 450
              },
              badge: "RU"
            }
          ]
        },
        title: "En varios idiomas",
        text: "Las mismas imágenes en otro idioma, con un narrador nativo y subtítulos traducidos.",
        source: "Ejemplo: la película sobre los sueños en inglés y en ruso",
        details: "Voces neuronales gratuitas, también en español y alemán. Con una clave de ElevenLabs tienes sus voces, incluida tu voz clonada."
      }
    ]
  },
  how: {
    id: "how",
    tag: "Cómo funciona",
    title: "Tres pasos de la idea al MP4",
    lead: "Sin línea de tiempo. Tú describes lo que necesitas y la app hace el resto.",
    steps: [
      {
        n: "1",
        title: "Escribe una idea",
        text: "Una frase o tu propio texto, hasta 30.000 caracteres. Elige formato y duración.",
        details: "Formatos 9:16, 16:9, 1:1 y 4:5, de 15 segundos a 30 minutos. Plantillas: Datos, Top 5, Historia, Anuncio de producto, Tutorial."
      },
      {
        n: "2",
        title: "Pulsa ➤",
        text: "KADR escribe el guion, pone la voz, dibuja los planos, anima escenas, compone música y añade subtítulos.",
        details: "Claude, OpenAI o Gemini escribe el guion con tu clave. Si quieres revisar los planos antes, activa el storyboard."
      },
      {
        n: "3",
        title: "Llévate el vídeo terminado",
        text: "Un MP4 con el volumen listo para redes. Redibuja cualquier plano con un clic.",
        details: "«Revisión del vídeo» detecta fallos por sí sola y te dice con palabras claras qué corregir."
      }
    ],
    note: "En una RTX 3060 un plano tarda cerca de un minuto y una película de 20 minutos, unas 4 horas.",
    screenshot: {
      src: "img/home-en.jpg",
      alt: "Pantalla de inicio de KADR Studio: campo de idea, formatos y plantillas",
      width: 1280,
      height: 820
    },
    caption: "La pantalla de inicio: idea, formato, plantilla y el botón ➤."
  },
  looks: {
    id: "looks",
    tag: "Cómo se verá",
    title: "El estilo visual, en un clic",
    lead: "12 estilos, del cine al anime y la animación 3D. El mismo plano en estilos distintos:",
    styles: [
      {
        name: "Cine",
        image: {
          src: "img/look-cinema.jpg",
          alt: "Cine"
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
        name: "Animación 3D",
        image: {
          src: "img/look-cartoon3d.jpg",
          alt: "Animación 3D"
        }
      },
      {
        name: "Acuarela",
        image: {
          src: "img/look-watercolor.jpg",
          alt: "Acuarela"
        }
      },
      {
        name: "Neón noir",
        image: {
          src: "img/look-neon.jpg",
          alt: "Neón noir"
        }
      },
      {
        name: "Anuncio de producto",
        image: {
          src: "img/look-studio.jpg",
          alt: "Anuncio de producto"
        }
      }
    ]
  },
  req: {
    id: "req",
    tag: "Sinceros con el hardware",
    title: "También sin GPU",
    lead: "Lo que obtienes hoy en tu ordenador. KADR Cloud con RTX 5090 llega pronto.",
    tiers: [
      {
        who: "PC CON NVIDIA DE 8 A 12 GB",
        title: "Todo en tu GPU",
        paragraphs: [
          "Planos, escenas y música se generan en tu tarjeta. Sin pagar por imagen.",
          "Windows 10/11, 64 bits."
        ],
        details: "La app descarga e instala el generador (unos 28 GB) por sí sola."
      },
      {
        who: "MAC CON APPLE M1, M2, M3, M4",
        title: "El Mac dibuja los planos",
        paragraphs: [
          "Con 16 GB de memoria o más, los planos se generan en el propio Mac.",
          "Requiere macOS 12 o posterior. Los Mac con Intel también sirven."
        ],
        details: "Las escenas animadas aún no se generan en el propio Mac. Voz, subtítulos, montaje y render funcionan en cualquier Mac."
      },
      {
        who: "CUALQUIER ORDENADOR",
        title: "Vídeo también sin GPU",
        paragraphs: [
          "Los planos con IA los hace un servicio con tu clave, o se usan fotos gratuitas de Pexels y Pixabay.",
          "Pronto llega KADR Cloud: nuestras RTX 5090 generarán los planos."
        ],
        details: "Sin claves, una voz neuronal gratuita lee tu texto sobre un fondo animado. Listo en uno o dos minutos."
      }
    ],
    notes: {
      title: "Conviene saberlo antes",
      items: [
        "La velocidad depende de la GPU: en una RTX 3060 un plano tarda cerca de un minuto.",
        "Si se va la luz, no pierdes nada: la app sigue donde se quedó.",
        "Los guiones con IA y las voces de ElevenLabs usan tus propias claves. La clave de Gemini es gratuita.",
        "La interfaz de la app está en inglés, ucraniano y ruso. El español llegará más adelante.",
        "En el primer arranque en Mac, abre «Ajustes del Sistema» → «Privacidad y seguridad» → «Abrir igualmente»."
      ]
    }
  },
  cloud: {
    id: "cloud",
    tag: "KADR Cloud",
    title: "Nuestras RTX 5090 trabajarán por ti",
    lead: "KADR Cloud llega pronto: vídeos desde cualquier ordenador, incluso un portátil modesto o un Mac.",
    bullets: [
      "Planos, escenas animadas y música se generarán en nuestros servidores con RTX 5090.",
      "Pagas con Energía ⚡: paquetes desde $10, y la app te muestra el precio antes de empezar.",
      "La recarga de ⚡ se abre en la app con el lanzamiento de la nube."
    ],
    cta: {
      label: "Descargar KADR Studio",
      href: "#download",
      variant: "main"
    }
  },
  mobileSoon: {
    tag: "Próximamente",
    title: "Pronto, versión móvil",
    text: "Haz vídeos directamente desde tu teléfono. Ya estamos preparando la app."
  },
  features: {
    id: "features",
    tag: "Funciones",
    title: "Todo un estudio de vídeo en una ventana",
    lead: "Genera en tu propia GPU o con tus propias claves. Pronto, la nube con RTX 5090.",
    items: [
      {
        icon: "✎",
        title: "Guion con IA",
        text: "Claude, OpenAI o Gemini con tu clave. Sin clave, tu propio texto es el guion."
      },
      {
        icon: "♪",
        title: "Locución",
        text: "Voces neuronales gratuitas, voces del sistema o ElevenLabs, incluida una copia de tu voz."
      },
      {
        icon: "▣",
        title: "Planos en tu GPU",
        text: "RealVisXL en tu NVIDIA; el generador se instala con un clic. Sin NVIDIA, los planos van con clave."
      },
      {
        icon: "▶",
        title: "Escenas animadas",
        text: "Los momentos clave cobran vida (Wan 2.2). Unos 2,5 minutos por escena en una RTX 3060."
      },
      {
        icon: "♫",
        title: "Música de fondo",
        text: "La IA compone la música (ACE-Step). Olvídate de buscar pistas en bancos de audio."
      },
      {
        icon: "Aa",
        title: "Subtítulos y sonido",
        text: "Subtítulos palabra por palabra y volumen listo para redes. El MP4 sale listo para publicar."
      },
      {
        icon: "✂",
        title: "Cortar Shorts",
        text: "Entre 3 y 8 clips verticales de una película larga, con texto y hashtags."
      },
      {
        icon: "☺",
        title: "Personajes propios y listos",
        text: "Un personaje o producto a partir de fotos sale igual en cada plano. Y 12 personajes listos con voz propia."
      },
      {
        icon: "文",
        title: "Otros idiomas",
        text: "Las mismas imágenes, un narrador nativo y subtítulos traducidos."
      },
      {
        icon: "✉",
        title: "Textos para publicar",
        text: "Título, descripción con capítulos, hashtags y comentario fijado con un clic."
      },
      {
        icon: "✦",
        title: "Asistente de IA",
        text: "El chat cambia escenas y estilo. Antes de empezar, la IA te propone 3 versiones del vídeo."
      },
      {
        icon: "⚿",
        title: "Configuración sencilla",
        text: "Pega una clave y la app reconoce el servicio. Las claves se guardan cifradas."
      }
    ]
  },
  download: {
    id: "download",
    tag: "Descargar",
    title: "Para Windows y Mac",
    lead: "Una sola app para los dos ordenadores. Las actualizaciones te las ofrece ella sola.",
    platforms: [
      {
        os: "windows",
        name: "Windows",
        details: "10 y 11, 64 bits · instalador .exe · v3.0.3",
        cta: "Descargar para Windows",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/download/v3.0.3/KADR-Studio-Setup-3.0.3.exe"
      },
      {
        os: "mac-arm",
        name: "Mac con chip Apple",
        details: "M1, M2, M3, M4 · macOS 12 o posterior · .dmg",
        cta: "Descargar para Mac (chip M)",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/latest/download/KADR-Studio-3.0-arm64.dmg"
      },
      {
        os: "mac-intel",
        name: "Mac con Intel",
        details: "macOS 12 o posterior · .dmg",
        cta: "Descargar para Mac (Intel)",
        href: "https://github.com/kadrstudia8-hue/kadr-studio-releases/releases/latest/download/KADR-Studio-3.0-x86_64.dmg"
      }
    ],
    note: "Abre el menú Apple → «Acerca de este Mac». Con «Chip Apple M…» usa el primer botón; con «Procesador Intel», el segundo."
  },
  pricing: {
    id: "pricing",
    tag: "Precios",
    title: "Precios",
    lead: "Empieza con 3 vídeos gratis. Precios en grivnas ucranianas (UAH); se paga en USDT al cambio del día.",
    currency: "UAH",
    plans: [
      {
        name: "Prueba",
        price: {
          display: "Gratis",
          value: 0
        },
        per: "3 vídeos de hasta 60 segundos",
        items: [
          "Sin tarjeta",
          "Una pequeña marca «KADR Studio» en una esquina",
          "Todos los estilos, personajes y claves funcionan"
        ],
        cta: {
          label: "Descargar gratis",
          href: "#download",
          variant: "ghost"
        }
      },
      {
        name: "Licencia «Fundador»",
        badge: "primeros 100",
        price: {
          display: "1.999 UAH",
          value: 1999,
          old: "2.999 UAH",
          oldValue: 2999
        },
        per: "pago único · primeros 100 compradores",
        items: [
          "Sin marca ni límites",
          "Todo en tu PC, 1 año de actualizaciones",
          "Dos ordenadores",
          "Pruébala gratis antes: 3 vídeos"
        ],
        cta: {
          label: "Comprar en la app",
          href: "#download",
          variant: "main"
        },
        highlight: true
      },
      {
        name: "Llave en mano",
        price: {
          display: "5.999 UAH",
          value: 5999
        },
        per: "pago único · en remoto",
        items: [
          "La licencia «Fundador»",
          "Configuramos tu PC",
          "Hacemos juntos tu primer vídeo"
        ],
        cta: {
          label: "Pedir llave en mano",
          href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
          variant: "ghost"
        }
      }
    ],
    extras: [
      {
        title: "Energía ⚡ para la nube con RTX 5090",
        text: "Paquetes desde $10. Planos, escenas y música se generan en nuestras RTX 5090. La recarga se abre en la app con el lanzamiento de la nube."
      },
      {
        title: "Pago en USDT",
        text: "USDT en BNB Smart Chain (BEP-20) al cambio del día. La licencia se abre sola en tu cuenta."
      }
    ],
    note: "Las claves de servicios de IA son opcionales. Si las añades, pagas directamente a esos servicios.",
    buy: {
      text: "Compra dentro de la app: USDT (BEP-20) al cambio del día. La licencia se abre sola en tu cuenta.",
      cta: {
        label: "Descargar y comprar",
        href: "#download",
        variant: "main"
      },
      note: "¿No se abrió la licencia? Escribe a kadrstudia8@gmail.com y te respondemos en persona."
    },
    legal: [
      {
        label: "Condiciones",
        href: "https://kadrstudia8-hue.github.io/terms-es.html"
      },
      {
        label: "Reembolsos",
        href: "https://kadrstudia8-hue.github.io/refund-es.html"
      }
    ],
    highlight: "Precio para los primeros 100 compradores"
  },
  faq: {
    id: "faq",
    tag: "FAQ",
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Es difícil?",
        a: [
          "No. Escribe una idea, elige formato y duración y pulsa ➤. Hay plantillas, 12 estilos visuales y 12 personajes listos. Pega una clave y la app sabrá a qué servicio pertenece."
        ],
        open: true
      },
      {
        q: "¿En qué idioma está la app?",
        a: [
          "La interfaz está en inglés, ucraniano y ruso; la versión en español aún no está lista. Los vídeos sí pueden ser en español: la app entiende tu idea en español y le pone voz con una voz neuronal gratuita o con ElevenLabs."
        ]
      },
      {
        q: "¿Necesito mi propia GPU?",
        a: [
          "No. La app funciona sin NVIDIA: la licencia quita la marca y los límites de la prueba, los planos con IA los hace un servicio con tu clave y, sin claves, se usan fotos gratuitas de Pexels y Pixabay. Con una NVIDIA de 8 a 12 GB, o un Mac con chip Apple y 16 GB o más, los planos se generan gratis en casa. Pronto llega KADR Cloud: nuestras RTX 5090 generarán los planos."
        ]
      },
      {
        q: "¿No parecerá una papilla barata de IA?",
        a: [
          "Mira el showreel de arriba: es resultado real de la app. Antes del render, activa el storyboard y redibuja cualquier plano. Después, «Revisión del vídeo» explica los fallos con palabras claras y corrige una vez por sí sola los defectos graves. Con una clave de Gemini, una IA revisa las escenas animadas: si una sale mal se repite, y tras dos fallos queda como una buena imagen fija."
        ]
      },
      {
        q: "¿Cuánto tarda un vídeo?",
        a: [
          "Depende de la GPU. En una RTX 3060, un plano tarda cerca de un minuto, una escena animada unos 2,5 minutos y una película de 20 minutos unas 4 horas. Un vídeo a partir de tu texto, sin claves ni GPU, está listo en uno o dos minutos."
        ]
      },
      {
        q: "¿Cuánto cuesta?",
        a: [
          "La prueba es gratuita: 3 vídeos de hasta 60 segundos. La licencia «Fundador» cuesta ",
          {
            b: "1.999 UAH"
          },
          " para los primeros 100 compradores y después 2.999 UAH: sin marca ni límites, 1 año de actualizaciones, dos ordenadores. La instalación llave en mano cuesta 5.999 UAH. Se paga en la app en USDT en BNB Smart Chain (BEP-20) al cambio del día. La Energía ⚡ para la nube con RTX 5090 va en paquetes desde $10; la recarga se abre con el lanzamiento de la nube. Si tienes dudas sobre el pago, escribe a ",
          {
            a: "kadrstudia8@gmail.com",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F"
          },
          "."
        ]
      },
      {
        q: "¿Cómo obtengo acceso?",
        a: [
          "Descarga KADR Studio: la prueba de 3 vídeos funciona al instante. Para quitar la marca y los límites, compra la licencia dentro de la app. Cuando pagas en USDT, la licencia se abre sola en tu cuenta. Si no se abre, escríbenos; los contactos están en la página de ",
          {
            a: "Soporte",
            href: "https://kadrstudia8-hue.github.io/support-es.html"
          },
          "."
        ]
      },
      {
        q: "¿Qué es la Energía ⚡?",
        a: [
          "La Energía ⚡ es la forma de pagar el alquiler de nuestros servidores con RTX 5090. En ellos se generan los planos, las escenas animadas y la música, así que no necesitas GPU propia. Los ⚡ se descuentan según se terminan los planos y ves el precio antes de empezar. Paquetes desde $10; la recarga se abre en la app con el lanzamiento de la nube. ⚡ no es dinero ni una criptomoneda y no se puede transferir."
        ]
      },
      {
        q: "¿Funciona en Mac?",
        a: [
          "Sí: macOS 12 o posterior, Mac con chip Apple (M1, M2, M3, M4) o Intel. En los Mac con chip Apple y 16 GB o más, los planos se generan en el propio ordenador; en los demás, con la clave de un servicio y, cuando se lance la nube, en nuestras RTX 5090. Las escenas animadas aún no se generan en el propio Mac. Voz, subtítulos, montaje y render funcionan en cualquier Mac. En el primer arranque, macOS pide permiso una vez: «Ajustes del Sistema» → «Privacidad y seguridad» → «Abrir igualmente»."
        ]
      },
      {
        q: "¿Necesito claves de IA de pago?",
        a: [
          "No. Sin claves, tu propio texto es el guion y lo leen voces neuronales gratuitas o voces del sistema. Con una clave de Claude, OpenAI o Gemini, la IA escribe el guion por ti; la de Gemini es gratuita. Una clave de ElevenLabs desbloquea sus voces, incluida tu voz clonada."
        ]
      },
      {
        q: "¿Adónde van mis datos y claves?",
        a: [
          "Los vídeos, guiones y proyectos se quedan en tu ordenador. La cuenta solo sirve para la activación y el saldo de ⚡; no hay telemetría. Las claves se guardan cifradas: con DPAPI en Windows y en el Llavero en Mac. Los servicios externos (Claude, OpenAI, Gemini, ElevenLabs) reciben el texto de la petición directamente con tu clave. Más en la ",
          {
            a: "Política de privacidad",
            href: "https://kadrstudia8-hue.github.io/privacy-es.html"
          },
          "."
        ]
      },
      {
        q: "¿Qué formatos y duraciones?",
        a: [
          "9:16 para Shorts, TikTok y Reels, 16:9 para YouTube, además de 1:1 y 4:5. De 15 segundos a 30 minutos."
        ]
      },
      {
        q: "¿Puedo pedir un reembolso?",
        a: [
          "Las ventas son definitivas, así que pruébala gratis antes: 3 vídeos de hasta 60 segundos. Te devolvemos el dinero si un pago se cobró dos veces o si la app no funciona en un ordenador que cumple los requisitos y el soporte no pudo ayudarte. Las condiciones completas están en la ",
          {
            a: "Política de reembolso",
            href: "https://kadrstudia8-hue.github.io/refund-es.html"
          },
          "."
        ]
      }
    ]
  },
  contact: {
    id: "contact",
    tag: "Pruébalo con tu propia idea",
    title: "Una frase y ➤",
    lead: "Descarga KADR Studio y escribe de qué va tu vídeo. Si tienes dudas, escríbenos y te respondemos en persona.",
    ctas: [
      {
        label: "Descargar KADR Studio",
        href: "#download",
        variant: "main",
        osAware: true
      },
      {
        label: "Contactar con soporte",
        href: "https://kadrstudia8-hue.github.io/support-es.html",
        variant: "ghost"
      }
    ]
  },
  ctaBand: {
    title: "Tu primer vídeo en 2 minutos",
    subtitle: "3 vídeos gratis. Sin tarjeta.",
    cta: {
      label: "Descargar gratis",
      href: "#download",
      variant: "main"
    }
  },
  mobileBar: {
    label: "Acciones rápidas",
    ctas: [
      {
        label: "Descargar",
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
        label: "Condiciones",
        href: "https://kadrstudia8-hue.github.io/terms-es.html"
      },
      {
        label: "Privacidad",
        href: "https://kadrstudia8-hue.github.io/privacy-es.html"
      },
      {
        label: "Reembolsos",
        href: "https://kadrstudia8-hue.github.io/refund-es.html"
      },
      {
        label: "Licencias",
        href: "https://kadrstudia8-hue.github.io/licenses-es.html"
      },
      {
        label: "Soporte",
        href: "https://kadrstudia8-hue.github.io/support-es.html"
      },
      {
        label: "Escríbenos",
        href: "mailto:kadrstudia8@gmail.com"
      }
    ],
    note: "Windows 10/11 y macOS 12+ · Sin telemetría"
  },
  ui: {
    downloadMac: "Descargar para Mac",
    downloadWindows: "Descargar para Windows",
    linkCopied: "enlace copiado",
    langHint: {
      question: "¿Leer esta página en español?",
      accept: "En español",
      close: "Cerrar"
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
          label: "Ejemplos",
          href: "#proof"
        },
        {
          label: "Cómo funciona",
          href: "#how"
        },
        {
          label: "Precios",
          href: "#pricing"
        }
      ],
      cta: {
        label: "Probar",
        href: "#download",
        variant: "main"
      }
    },
    hero: {
      id: "top",
      title: [
        {
          text: "Una frase.",
          nowrap: true
        },
        {
          text: "Un vídeo listo.",
          accent: true
        }
      ],
      subtitle: "La app escribe el guion, pone la voz, dibuja los planos y monta el vídeo.",
      cta: {
        label: "Pruébalo gratis",
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
        "3 vídeos gratis",
        "Sin tarjeta",
        "Windows y Mac"
      ],
      note: "sin rodar ni editar",
      sticker: "3 vídeos gratis",
      mobile: {
        cta: {
          label: "Envíate el enlace",
          href: "#top",
          variant: "main",
          action: "share"
        },
        caption: "La app funciona en el ordenador. Abre el enlace en un PC o Mac."
      }
    },
    proof: {
      id: "proof",
      tag: "Ejemplos reales",
      title: "Esto lo hizo la app",
      subtitle: "Toca un vídeo. Debajo está la frase de la que salió.",
      promptLabel: "Todo lo que escribió el autor",
      reelCard: "Showreel con sonido, 25 segundos",
      cta: {
        label: "Ver el showreel, 25 s",
        href: "#proof",
        variant: "ghost",
        action: "play-reel"
      }
    },
    who: {
      id: "who",
      title: "Para quién es",
      subtitle: "Elige lo tuyo. Te enseñamos un ejemplo y un estilo.",
      cards: [
        {
          title: "Shorts y Reels",
          text: "Vídeos verticales cada día. Sin cámara."
        },
        {
          title: "Anuncios de negocio",
          text: "Un café, una tienda o un servicio con una frase."
        },
        {
          title: "YouTube sin cara",
          text: "Películas de hasta 30 minutos con capítulos."
        },
        {
          title: "Otros idiomas",
          text: "El mismo vídeo con otro narrador."
        }
      ],
      stylesTitle: "12 estilos. Un clic.",
      cta: {
        label: "Pruébalo con tu idea",
        href: "#download",
        variant: "main"
      }
    },
    how: {
      id: "how",
      title: "Tres pasos al vídeo",
      subtitle: "Escribes la idea. Pulsas el botón. Te llevas el archivo.",
      steps: [
        "Escribe una idea",
        "Pulsa ➤",
        "Llévate el vídeo"
      ],
      screenshotCaption: "Así es la app",
      note: "«¿Te acuerdas de la Game Boy?»",
      cta: {
        label: "Tutorial, 2 minutos",
        href: "#how",
        variant: "ghost",
        action: "play-tutorial"
      }
    },
    compare: {
      id: "compare",
      title: "Antes y con KADR",
      subtitle: "Seis tareas y seis personas. O una sola frase.",
      before: {
        title: "Antes",
        items: [
          "Guion",
          "Narrador",
          "Rodaje",
          "Montaje",
          "Música",
          "Subtítulos"
        ]
      },
      after: {
        title: "Con KADR",
        text: "Una frase y ➤"
      },
      note: "Un vídeo sencillo a partir de tu texto está listo en uno o dos minutos.",
      more: {
        label: "Qué más hace la app",
        items: [
          "Escenas animadas: los momentos clave cobran vida",
          "Subtítulos palabra por palabra y volumen listo para redes",
          "Corta una película larga en Shorts",
          "Tu personaje o producto a partir de fotos en cada plano",
          "Versiones en otros idiomas",
          "Título, descripción y hashtags con un clic",
          "Un asistente de IA cambia escenas y estilo",
          "3 versiones del vídeo para elegir antes de empezar"
        ]
      },
      cta: {
        label: "Pruébalo gratis",
        href: "#download",
        variant: "main"
      }
    },
    pc: {
      id: "pc",
      title: "Tu ordenador sirve",
      subtitle: "¿Tienes GPU? Todo gratis en casa. ¿No? Te ayuda nuestra nube.",
      tiles: [
        {
          title: "Tu propio ordenador",
          text: "Windows o Mac. Los planos y la música se generan en tu equipo."
        },
        {
          title: "KADR Cloud",
          badge: "Pronto",
          text: "Pronto nuestras RTX 5090 trabajarán por ti. Pago con Energía ⚡ desde $10."
        }
      ],
      mobileChip: "Versión móvil pronto",
      details: [
        "Los planos se generan gratis en casa con una NVIDIA de 8 a 12 GB o en un Mac con chip Apple y 16 GB de memoria o más. La app descarga sola el generador (unos 28 GB).",
        "Sin esa tarjeta la app también funciona: la licencia quita la marca y los límites de la prueba, y los planos los hace un servicio con tu clave o salen de fotos gratuitas de Pexels y Pixabay.",
        "Necesitas Windows 10/11 (64 bits) o macOS 12 o posterior. Las escenas animadas aún no se generan en el propio Mac.",
        "En el primer arranque en Mac, abre «Ajustes del Sistema» → «Privacidad y seguridad» → «Abrir igualmente»."
      ],
      cta: {
        label: "¿Qué ordenador tengo?",
        href: "#pc",
        variant: "ghost",
        action: "disclose"
      }
    },
    pricing: {
      id: "pricing",
      title: "Primero, gratis",
      subtitle: "No hay reembolsos. Por eso los 3 primeros vídeos van por nuestra cuenta.",
      currency: "UAH",
      plans: [
        {
          id: "trial",
          tone: "entry",
          label: "Empieza aquí",
          name: "Prueba",
          price: {
            display: "0 UAH",
            value: 0
          },
          per: "3 vídeos de hasta 60 segundos",
          items: [
            "Sin tarjeta",
            "Todos los estilos y personajes",
            "Una pequeña marca KADR en la esquina"
          ],
          cta: {
            label: "Descargar y probar",
            href: "#download",
            variant: "main"
          }
        },
        {
          id: "founder",
          tone: "center",
          label: "Para los primeros 100 compradores",
          name: "Licencia «Fundador»",
          price: {
            display: "1.999 UAH",
            value: 1999,
            old: "2.999 UAH",
            oldValue: 2999
          },
          then: "después 2.999 UAH",
          per: "Un pago. Para siempre.",
          items: [
            "Sin marca ni límites",
            "Dos ordenadores",
            "1 año de actualizaciones"
          ],
          cta: {
            label: "Comprar por 1.999 UAH",
            href: "#download",
            variant: "ghost"
          },
          note: "Se compra dentro de la app, después de la prueba"
        },
        {
          id: "turnkey",
          tone: "premium",
          label: "Premium",
          name: "Llave en mano",
          price: {
            display: "5.999 UAH",
            value: 5999
          },
          per: "Lo configuramos todo por ti. En remoto.",
          items: [
            "Incluye la licencia «Fundador»",
            "Instalación y configuración de tu PC",
            "Tu primer vídeo, hecho juntos"
          ],
          cta: {
            label: "Pedir llave en mano",
            href: "mailto:kadrstudia8@gmail.com?subject=KADR%20Studio%3A%20%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F",
            variant: "ghost"
          }
        }
      ],
      honest: "No hay reembolsos. Por eso primero tienes 3 vídeos gratis.",
      currencyNote: "La app lo convierte a USDT al cambio del día.",
      pay: {
        title: "Cómo pagar",
        steps: [
          "Descarga la app",
          "Pulsa «Comprar» dentro",
          "Paga en USDT, red BEP-20"
        ],
        help: "¿No tienes USDT? La app incluye una guía para comprarlo."
      },
      cloud: "La nube con nuestras RTX 5090 llega pronto. Se paga con Energía ⚡, paquetes desde $10.",
      cta: {
        label: "Descargar y probar",
        href: "#download",
        variant: "main"
      }
    },
    faq: {
      id: "faq",
      title: "Respuestas claras",
      subtitle: "Seis preguntas que se hacen antes de comprar.",
      items: [
        {
          q: "¿Es difícil?",
          a: [
            "No. Escribe una idea, elige formato y duración y pulsa ➤. Hay plantillas, 12 estilos visuales y 12 personajes listos."
          ],
          open: true
        },
        {
          q: "¿No parecerá una papilla barata de IA?",
          a: [
            "Mira los ejemplos de arriba: es resultado real de la app. Antes del render puedes revisar el storyboard y redibujar cualquier plano. Después, «Revisión del vídeo» explica los fallos con palabras claras y corrige una vez por sí sola los defectos graves."
          ]
        },
        {
          q: "¿Necesito una GPU potente?",
          a: [
            "No. La app funciona en Windows 10/11 y en Mac con macOS 12 o posterior. Con una NVIDIA de 8 GB o más, o un Mac con chip Apple y 16 GB o más, los planos se generan gratis en casa. Sin ella, los planos los hace un servicio con clave o salen de fotos gratuitas. Pronto llega KADR Cloud con nuestras RTX 5090."
          ]
        },
        {
          q: "¿Cuánto tarda un vídeo?",
          a: [
            "Depende del ordenador. Un vídeo a partir de tu texto, sin GPU, está listo en uno o dos minutos. En una RTX 3060, un plano tarda cerca de un minuto y una película de 20 minutos, unas 4 horas."
          ]
        },
        {
          q: "¿Cómo pago y por qué USDT?",
          a: [
            "Compras dentro de la app. Pulsa «Comprar»: la app convierte el precio a USDT al cambio del día y te muestra el importe y la dirección. Pagas en USDT en BNB Smart Chain (BEP-20). Así el pago se comprueba automáticamente y la licencia se abre sola, sin esperas."
          ]
        },
        {
          q: "¿Puedo pedir un reembolso?",
          a: [
            "No. Por eso hay una prueba: 3 vídeos gratis, sin tarjeta. Compra cuando te guste el resultado. Las excepciones que exige la ley están en la ",
            {
              a: "Política de reembolsos",
              href: "https://kadrstudia8-hue.github.io/refund-es.html"
            },
            "."
          ]
        }
      ],
      all: {
        label: "Todas las preguntas",
        href: "https://kadrstudia8-hue.github.io/support-es.html"
      },
      cta: {
        label: "Escríbenos",
        href: "https://kadrstudia8-hue.github.io/support-es.html",
        variant: "ghost"
      }
    },
    final: {
      id: "download",
      title: "Una frase. Y ➤",
      subtitle: "3 vídeos gratis. Sin tarjeta ni registro en la web.",
      cta: {
        label: "Descargar KADR Studio",
        href: "#download",
        variant: "main",
        osAware: true
      },
      platforms: "Windows · Mac con chip M · Mac Intel",
      macHelp: {
        label: "¿Qué Mac tengo?",
        text: "Abre el menú Apple → «Acerca de este Mac». Con «Chip Apple M…» usa el segundo botón; con «Procesador Intel», el tercero."
      },
      support: {
        label: "Escribir a soporte. Respondemos en persona.",
        href: "https://kadrstudia8-hue.github.io/support-es.html"
      }
    },
    mobileBar: {
      ctas: [
        {
          label: "Envíate el enlace",
          href: "#top",
          variant: "main",
          action: "share"
        },
        {
          label: "Precios",
          href: "#pricing",
          variant: "ghost"
        }
      ]
    }
  }
}

export default es
