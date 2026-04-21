import { useState, useEffect, useRef, useCallback } from 'react'
import { Analytics } from '@vercel/analytics/react'

/* ═══════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════ */
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLScDHW3TdNlZf_uofILISbCQBL2yg4B_ee5KCpYOW38DnV9r5Q/formResponse'
const FORM_ENTRIES = {
  name: 'entry.1282747869',
  email: 'entry.1889011114',
  phone: 'entry.1776549513',
  instagram: 'entry.2043937780',
  newsletter: 'entry.1505155485'
}
const SKOOL_URL = 'https://www.skool.com/'
const PDF_DOWNLOAD_URL = 'https://www.canva.com/design/DAHHOO_Yq8I/qY3SWUCP2YOoFGTHQLITdQ/view?utm_content=DAHHOO_Yq8I&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h981dfba2bd#6'

const COACHED_ATHLETES = [
  { name: 'Azriel', handle: '@azrielmmn', title: 'IFBB Pro Classic', avatar: '/clients/avatars/azrielmmn.jpg' },
  { name: 'Yann L.', handle: '@yann.let', title: 'Champion de France', avatar: '/clients/avatars/yannlet.jpg' },
  { name: 'Barbiscotto', handle: '@barbiscotto_vet_wnbfpro', title: 'NPC Competitor', avatar: '/clients/avatars/barbiscotto.jpg' },
  { name: 'Imajor', handle: '@imajor_classic', title: 'Junior IFBB Elite', avatar: '/clients/avatars/imajor.jpg' },
  { name: 'Doc Athletic', handle: '@docathletic', title: "Men's Physique Pro", avatar: '/clients/avatars/docathletic.jpg' },
  { name: 'Roby', handle: '@roby_sxm971', title: 'Classic Physique', avatar: '/clients/avatars/roby.jpg' },
]

const POSES = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `/poses/${i + 1}.png`,
  title: `Pose ${i + 1}`,
}))

const REVIEWS = [
  {
    name: 'Azriel',
    role: 'IFBB Pro Classic',
    avatarHandle: 'azrielmmn',
    avatar: '/clients/avatars/azrielmmn.jpg',
    stars: 5,
    comment: "Merci beaucoup pour le cours tu es vraiment quelqu'un de très professionnel, qui explique simplement et clairement les poses, c'est très positif et l'ambiance était top. Je te recontacte au plus vite afin de fixer une seconde séance",
  },
  {
    name: 'Yann L.',
    role: 'Champion de France',
    avatarHandle: 'yann.let',
    avatar: '/clients/avatars/yannlet.jpg',
    stars: 5,
    comment: "Séance très constructive avec Manaël, beaucoup de détails que je n'arrivais pas à mettre en place en distanciel. Cette session en présentiel m'a beaucoup aidé et de plus avoir un contact direct avec la personne qui te coach c'est encore plus sympa — donc si t'as l'occasion, fonce !",
  },
  {
    name: 'Roby',
    role: 'Classic Physique',
    avatarHandle: 'roby_sxm971',
    avatar: '/clients/avatars/roby.jpg',
    stars: 5,
    comment: "Merci pour cette session Manaël, ultra intéressant d'avoir le tout résumé et synthétisé pour avoir une base commune. Je sais pas encore si je serai là la semaine pro mais je vais tout faire pour !",
  },
]



/* ─── ICONS ─── */
function StarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#D4A843" stroke="#D4A843" strokeWidth="1">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronLR() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 7-5 5 5 5" /><path d="m15 7 5 5-5 5" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  )
}

/* ─── COACH BANNER ─── */
function CoachBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gold-900/40 via-gold-800/20 to-gold-900/40 border-y border-gold-500/15 py-6 sm:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.06),transparent_70%)]" />

      <div className="main-container relative z-10">
        <p className="text-center text-xs text-gold-400 uppercase tracking-[0.15em] font-semibold mb-6">
          Coachés par Manaël · Résultats prouvés en compétition
        </p>
      </div>

      <div className="relative z-10 w-full flex overflow-hidden group">
        <div className="flex shrink-0 animate-marquee gap-4 sm:gap-5 pr-4 sm:pr-5 select-none">
          {COACHED_ATHLETES.map((athlete, i) => {
            const rawHandle = athlete.handle.replace('@', '');
            const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.name)}&background=d4a843&color=050505&bold=true`;
            return (
              <div
                key={`a-${i}`}
                // href={`https://instagram.com/${rawHandle}`}
                // target="_blank"
                // rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 pr-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-gold-500/40 transition-all duration-300 shadow-lg shadow-black/20"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gold-900/50 border border-gold-500/30">
                  <img
                    src={athlete.avatar || `https://unavatar.io/instagram/${rawHandle}?fallback=${encodeURIComponent(fallbackUrl)}`}
                    alt={`Profil de ${athlete.name}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackUrl;
                    }}
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">
                    {athlete.name}
                  </p>
                  <p className="text-[11px] text-gray-400 group-hover:text-gold-500/80 transition-colors mt-0.5">
                    {athlete.handle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex shrink-0 animate-marquee gap-4 sm:gap-5 pr-4 sm:pr-5 select-none" aria-hidden="true">
          {COACHED_ATHLETES.map((athlete, i) => {
            const rawHandle = athlete.handle.replace('@', '');
            const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.name)}&background=d4a843&color=050505&bold=true`;
            return (
              <div
                key={`b-${i}`}
                // href={`https://instagram.com/${rawHandle}`}
                // target="_blank"
                // rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 pr-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-gold-500/40 transition-all duration-300 shadow-lg shadow-black/20"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gold-900/50 border border-gold-500/30">
                  <img
                    src={athlete.avatar || `https://unavatar.io/instagram/${rawHandle}?fallback=${encodeURIComponent(fallbackUrl)}`}
                    alt={`Profil de ${athlete.name}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackUrl;
                    }}
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">
                    {athlete.name}
                  </p>
                  <p className="text-[11px] text-gray-400 group-hover:text-gold-500/80 transition-colors mt-0.5">
                    {athlete.handle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── NAVBAR ─── */
function Navbar({ onSkoolTeaser }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'shadow-lg shadow-black/30' : ''}`}>
      <div className="main-container flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/clients/manael/logoPE.png"
            alt="Logo Posing Empire"
            className="h-10 w-10 sm:h-10 sm:w-10 rounded-md object-contain bg-bg-primary"
          />
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <a href="#poses" className="hidden sm:block text-sm text-gray-300 hover:text-gold-400 transition-colors">
            Poses
          </a>

          <a href="#avis" className="hidden sm:block text-sm text-gray-300 hover:text-gold-400 transition-colors">
            Avis
          </a>

          <button onClick={onSkoolTeaser} className="hidden md:block text-sm text-gray-300 hover:text-gold-400 transition-colors font-medium">
            Skool
          </button>

          <a
            href={SKOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-gold btn-compact"
          >
            Rejoindre
          </a>
        </div>
      </div>
    </nav>
  )
}

/* ─── HERO VIDEO CARD ─── */
/* HERO VIDEOS — commenté temporairement (hébergement CDN requis pour les fichiers >100MB)
const HERO_VIDEOS = [
  '/Video/NewManaëlPosing.MP4',
  '/Video/OldManaëlPosing.MP4',
  '/Video/Fix1.mov',
] */

function HeroVideoCard() {
  return (
    <div className="w-full max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto lg:mx-0 animate-float flex justify-center lg:justify-end order-1 lg:order-2">
      <div className="relative w-full">
        <div className="absolute -inset-3 bg-gradient-to-br from-gold-400/8 via-gold-600/5 to-transparent rounded-3xl blur-2xl" />
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl shadow-gold-900/30">
          <img
            src="/clients/manael/manael.jpg"
            alt="Manaël — Coach Posing Expert, Fondateur de Posing Empire"
            className="w-full h-auto object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <p className="font-bold text-base text-white text-center">Manaël</p>
            <p className="text-gold-400 text-[9px] sm:text-xs font-medium text-center uppercase tracking-widest whitespace-nowrap">
              Coach Posing · Fondateur du Posing Empire
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── HERO ─── */
function Hero({ onPDF, onSkoolTeaser }) {
  return (
    <header
      id="hero"
      className="relative w-full pt-[124px] sm:pt-[144px] lg:pt-[160px] pb-16 sm:pb-20 lg:pb-24 overflow-hidden"
    >
      <div className="hero-grid-bg">
        <div className="grid-overlay" />
        <div className="radial-glow" />
      </div>

      <div className="main-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">

          {/* ── Texte ── */}
          <div className="w-full text-center lg:text-left animate-fade-up order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-900/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-xs text-gold-300 font-medium">PDF Gratuit · 16 Poses Classic Offertes</span>
            </div>

            {/* H1 */}
            <h1 className="font-black tracking-tighter leading-[1.08] mb-6 text-[clamp(1.75rem,5.5vw,3.25rem)]">
              DOMINE LA{' '}
              <span className="text-gold-gradient">SCÈNE.</span>
              <br />
              <span className="text-gold-gradient">MAÎTRISE TON POSING.</span>
            </h1>

            {/* Accroche */}
            <p className="text-gray-300 text-[13.5px] sm:text-base max-w-[360px] sm:max-w-lg mx-auto lg:mx-0 mb-6 leading-snug sm:leading-relaxed">
              Je vous offre 16 fiches explicatives des poses mandatories pour chaque catégorie et toutes les fédérations.
            </p>

            {/* Checklist */}
            <ul className="space-y-2.5 mb-8 max-w-sm mx-auto lg:mx-0 text-left">
              {[
                '16 fiches explicatives',
                'Les poses mandatories, quarts de tour...',
                'Catégories classic physique et bodybuilding',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start">
              <button onClick={onPDF} className="btn-primary-gold btn-hero animate-pulse-gold w-full sm:w-auto">
                Télécharger les 16 Poses <DownloadIcon />
              </button>
              <button onClick={onSkoolTeaser} className="btn-secondary-gold btn-hero w-full sm:w-auto">
                Accéder à la communauté Skool →
              </button>
            </div>
          </div>

          {/* ── Photo Coach avec Hover Vidéo ── */}
          <HeroVideoCard />

        </div>
      </div>
    </header>
  )
}

/* ─── SECTION HEADING helper ─── */
function SectionHeading({ white, gold, subtitle }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <h2 className="font-black tracking-tight text-[clamp(1.5rem,4.5vw,2.75rem)] leading-[1.1] mb-4">
        <span className="text-white-gradient">{white}</span>
        <span className="text-gold-gradient">{gold}</span>
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}



/* ─── POSES GALLERY ─── */
function PosesGallery({ onImageClick, onPDF }) {
  return (
    <section id="poses" className="section-padding relative">
      <div className="main-container">
        <SectionHeading
          white="LES 16"
          gold=" POSES"
          subtitle="Chaque pose détaillée de A à Z pour les maitriser parfaitement."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          {POSES.map((pose, index) => (
            <div
              key={pose.id}
              className="pose-card opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              onClick={() => onImageClick(index)}
              role="button"
              tabIndex={0}
              aria-label={`Voir ${pose.title} en détail`}
              onKeyDown={(e) => e.key === 'Enter' && onImageClick(index)}
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={pose.src}
                  alt={`${pose.title} — Pose Classic bodybuilding Posing Empire`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs font-semibold text-gold-400 tracking-wide text-center">{pose.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <button onClick={onPDF} className="btn-primary-gold">
            Télécharger le PDF des 16 Poses <DownloadIcon />
          </button>
          <p className="text-gray-500 text-xs mt-2">100% gratuit · PDF téléchargeable instantanément</p>
        </div>
      </div>
    </section>
  )
}

/* ─── YOUTUBE SECTION ─── */
function YoutubeSection() {
  const playerDivRef = useRef(null)
  const playerRef = useRef(null)
  const [active, setActive] = useState(false)

  const handlePlay = () => {
    setActive(true)

    const initPlayer = () => {
      if (playerRef.current) return
      playerRef.current = new window.YT.Player(playerDivRef.current, {
        videoId: 'ZUXbjlT-Lmc',
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e) => {
            e.target.setVolume(25)
            e.target.playVideo()
          },
        },
      })
    }

    // Charge l'API si pas encore présente
    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      window.onYouTubeIframeAPIReady = initPlayer
      document.head.appendChild(tag)
    }
  }

  return (
    <section className="section-padding relative bg-black border-y border-gold-500/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.05),transparent_70%)]" />
      <div className="main-container relative z-10">
        <SectionHeading
          white="LA MÉTHODE EN "
          gold="ACTION"
          subtitle="Explications détaillées des poses quart de tour"
        />
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl shadow-black/60">
          <div className="aspect-video w-full bg-black relative">
            {/* Thumbnail cliquable */}
            {!active && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 w-full h-full group"
                aria-label="Lancer la vidéo"
              >
                <img
                  src="https://img.youtube.com/vi/ZUXbjlT-Lmc/maxresdefault.jpg"
                  alt="Manaël — Coaching Posing Live"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                {/* Bouton play centré */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-500 flex items-center justify-center shadow-[0_0_40px_rgba(212,168,67,0.5)] group-hover:scale-110 transition-transform duration-200">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                  </div>
                </div>
              </button>
            )}
            <div ref={playerDivRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── REVIEWS ─── */
function Reviews() {
  return (
    <section id="avis" className="section-padding relative bg-black/50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-600 rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="main-container relative z-10">
        <SectionHeading
          white="ILS ONT "
          gold="DOMINÉ LA SCÈNE"
          subtitle="De compétiteurs amateurs à bodybuilder profesionnels — Voici l'impact de l'accompagnement PosingEmpire"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {REVIEWS.map((review, i) => (
            <article
              key={i}
              className="card-glass p-5 sm:p-6 opacity-0 animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3" aria-label={`${review.stars} étoiles sur 5`}>
                {Array.from({ length: review.stars }).map((_, j) => <StarIcon key={j} />)}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-300 text-sm sm:text-[0.9rem] leading-relaxed mb-4 flex-1">
                &ldquo;{review.comment}&rdquo;
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3 pt-4 mt-auto border-t border-white/5">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-500/40 flex-shrink-0 bg-gold-900">
                  {(() => {
                    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=d4a843&color=050505&bold=true`;
                    return (
                      <img
                        src={review.avatar || `https://unavatar.io/instagram/${review.avatarHandle}?fallback=${encodeURIComponent(fallbackUrl)}`}
                        alt={review.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackUrl;
                        }}
                      />
                    );
                  })()}
                </div>
                <div>
                  <cite className="font-semibold text-sm text-white not-italic block">{review.name}</cite>
                  <p className="text-xs text-gold-400 mt-0.5">{review.role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── VIDEO TESTIMONIALS ─── */
const VIDEO_TESTIMONIALS = [
  { videoId: '4qT_B9UB5VA', name: 'Romain', role: 'Compétiteur' },
  { videoId: 'jcwHoi5LD9k', name: 'Adrien', role: 'Compétiteur' },
  { videoId: 'zEYvKEfo1uI', name: 'Dylan', role: 'Compétiteur' },
  { videoId: 'xjcNlndr2V8', name: 'Nicola', role: 'Compétiteur' },
  { videoId: 'pjE4w-Xbyjg', name: 'Joan', role: 'Compétiteur' },
]

function VideoTestimonialCard({ videoId, name, role }) {
  const [playing, setPlaying] = useState(false)
  const [hovering, setHovering] = useState(false)

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-xl shadow-black/40 group aspect-[9/16] bg-black"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={`Témoignage de ${name}`}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={() => setPlaying(true)}
          role="button"
          aria-label={`Lire le témoignage de ${name}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={`Témoignage de ${name}`}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay gradient bas */}
          <div className="absolute bottom-0 left-0 right-0 pt-20 pb-4 px-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none">
            <p className="font-bold text-white text-sm">{name}</p>
            <p className="text-gold-400 text-xs mt-0.5">{role}</p>
          </div>

          {/* Play icon centré */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-transform group-hover:scale-110">
            <div className="w-14 h-14 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function VideoTestimonials() {
  return (
    <section className="section-padding relative bg-black/30">
      <div className="main-container">
        <SectionHeading
          white="ILS EN PARLENT "
          gold="EN VIDÉO"
          subtitle="Les retours authentiques de nos athlètes après leurs sessions de correction live."
        />
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 sm:pb-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:gap-6 max-w-4xl mx-auto hide-scrollbar">
          {VIDEO_TESTIMONIALS.map((v, i) => (
            <div key={i} className="w-[85vw] max-w-[320px] sm:max-w-none sm:w-auto shrink-0 snap-center">
              <VideoTestimonialCard {...v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── TRANSFO GALLERY ─── */
const TRANSFOS = [
  { src: '/clients/transfo/T1.png', label: 'Transformation 1' },
  { src: '/clients/transfo/T2.png', label: 'Transformation 2' },
  { src: '/clients/transfo/T3.png', label: 'Transformation 3' },
  { src: '/clients/transfo/T4.jpeg', label: 'Transformation 4' },
]

function TransfoGallery() {
  return (
    <section className="section-padding relative bg-black/40">
      <div className="main-container">
        <SectionHeading
          white="TRANSFORMATIONS "
          gold="POSING"
          subtitle="Les résultats concrets des athlètes coachés par Manaël"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {TRANSFOS.map((transfo, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden border border-gold-500/12 hover:border-gold-500/50 shadow-xl shadow-black/50 transition-all duration-300 hover:scale-[1.03] group opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              <img
                src={transfo.src}
                alt={transfo.label}
                className="w-full h-auto object-contain select-none group-hover:brightness-110 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">{transfo.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PRO CARDS ─── */
const PROCARDS = [
  { src: '/clients/procards/TOPArthur.png', name: 'Arthur' },
  { src: '/clients/procards/TOPAzriel.png', name: 'Azriel' },
  { src: '/clients/procards/TopClement.png', name: 'Clément' },
  { src: '/clients/procards/TOPHerve.png', name: 'Hervey' },
  { src: '/clients/procards/TOPJawed.png', name: 'Jawed' },
  { src: '/clients/procards/TOPJerome.png', name: 'Jérôme' },
  { src: '/clients/procards/TOPJulien.png', name: 'Julien' },
  { src: '/clients/procards/TOPMael.png', name: 'Maël' },
  { src: '/clients/procards/TOPYann.png', name: 'Yann' },
  { src: '/clients/procards/TOPYann2.png', name: 'Yann' },
]

function ProCardsSection() {
  return (
    <section className="section-padding relative bg-black/60 border-y border-gold-500/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.06),transparent_60%)]" />
      <div className="main-container relative z-10">
        <SectionHeading
          white="MES ATHLÈTES "
          gold="SUR LE PODIUM"
          subtitle="Les athlètes coachés par Manaël qui ont décroché leur carte Pro IFBB — la reconnaissance ultime du circuit professionnel."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {PROCARDS.map((pro, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden border border-gold-500/15 hover:border-gold-500/50 transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-black/40 group"
            >
              <img
                src={pro.src}
                alt={`IFBB Pro Card athlète ${pro.name} — coaché par Manaël`}
                className="w-full h-auto object-cover select-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">{pro.name}</span>
              </div>
            </div>
          ))}

          {/* Card CTA — "Vous pouvez être le prochain" */}
          <div className="relative rounded-xl overflow-hidden border border-gold-500/40 hover:border-gold-500/80 transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-gold-900/30 group">
            <img
              src="/clients/procards/TOPArthur.png"
              alt="Votre future Pro Card IFBB"
              className="w-full h-auto object-cover select-none blur-sm scale-105 brightness-50"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 flex flex-col items-center justify-center p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gold-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <p className="text-white font-black text-[10px] sm:text-xs leading-tight uppercase tracking-wide">
                Vous pouvez être<br />
                <span className="text-gold-400">le prochain</span><br />
                à obtenir votre<br />
                <span className="text-gold-300 font-black">PRO CARD !</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── SKOOL COMING SOON ─── */
/* ─── COUNTDOWN HOOK ─── */
const SKOOL_OPEN_DATE = new Date('2026-05-09T00:00:00+02:00')

const getTimeLeft = (target) => {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function useCountdown(target) {
  const [time, setTime] = useState(() => getTimeLeft(target))

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(t)
  }, [target])

  return time
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-black/70 border border-gold-500/40 backdrop-blur flex items-center justify-center shadow-[0_0_20px_rgba(212,168,67,0.15)]">
        <span className="font-black text-xl sm:text-3xl text-gold-gradient tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-2 font-medium">{label}</span>
    </div>
  )
}

function SkoolComingSoon() {
  const { days, hours, minutes, seconds } = useCountdown(SKOOL_OPEN_DATE)

  return (
    <section className="section-padding relative overflow-hidden bg-black border-y border-gold-500/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.08),transparent_60%)]" />
      <div className="main-container relative z-10 text-center">
        <SectionHeading
          white="OUVERTURE DU SKOOL : "
          gold="POSING EMPIRE"
          subtitle="La communauté privée numéro 1 pour les compétiteurs. Masterclass inédites, lives de correction, et l'intégralité du programme Posing Empire."
        />

        <div className="max-w-4xl mx-auto mt-10">
          <div className="relative rounded-3xl overflow-hidden border border-gold-500/20 shadow-[0_0_50px_-15px_rgba(212,168,67,0.2)]">
            {/* Image affichée en entier, légèrement floutée */}
            <div className="relative w-full flex items-center justify-center bg-bg-primary">
              <img
                src="/skool/Skool.png"
                alt="Plateforme Skool Posing Empire"
                className="w-full h-auto object-contain blur-[3px] opacity-60 select-none"
              />

              {/* Overlay léger */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Contenu centré */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 gap-5">
                {/* Cadenas avec l'animation pulse */}
                <div className="animate-pulse-gold w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-600/20 shadow-[0_0_50px_rgba(212,168,67,0.5)] border border-gold-500 flex items-center justify-center text-gold-400 backdrop-blur-sm">
                  <LockIcon />
                </div>

                {/* Compte à rebours */}
                <div className="flex items-start gap-2 sm:gap-4">
                  <CountdownUnit value={days} label="Jours" />
                  <span className="text-gold-400 font-black text-2xl sm:text-4xl mt-3 sm:mt-5 leading-none">:</span>
                  <CountdownUnit value={hours} label="Heures" />
                  <span className="text-gold-400 font-black text-2xl sm:text-4xl mt-3 sm:mt-5 leading-none">:</span>
                  <CountdownUnit value={minutes} label="Min" />
                  <span className="text-gold-400 font-black text-2xl sm:text-4xl mt-3 sm:mt-5 leading-none">:</span>
                  <CountdownUnit value={seconds} label="Sec" />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/50 bg-black/70 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-bold text-gray-200 uppercase tracking-widest">Accès Verrouillé</span>
                </div>
              </div>
            </div>
          </div>
          {/* CTA sous l'image floue */}
          <div className="text-center mt-6">
            <button disabled className="btn-primary-gold inline-flex opacity-50 cursor-not-allowed hover:-translate-y-0 shadow-none pointer-events-none">
              Rejoindre Posing Empire
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-80">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── BEFORE/AFTER ─── */
function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current || !isDragging.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.min(Math.max(x, 2), 98))
  }, [])

  const handleMouseDown = useCallback(() => { isDragging.current = true }, [])
  const handleMouseUp = useCallback(() => { isDragging.current = false }, [])

  useEffect(() => {
    const onMove = (e) => handleMove(e.clientX)
    const onTouch = (e) => {
      if (isDragging.current) {
        e.preventDefault();
        handleMove(e.touches[0].clientX)
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', onTouch, { passive: false })
    document.addEventListener('touchend', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', onTouch)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [handleMove, handleMouseUp])

  return (
    <section className="section-padding relative">
      <div className="main-container">
        <SectionHeading
          white="LA TRANSFORMATION "
          gold="EN DIRECT"
          subtitle="Glisse le curseur et juge toi-même l'impact du coaching Posing Empire."
        />
        <div className="flex justify-center">
          <div
            ref={containerRef}
            className="slider-container"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            role="img"
            aria-label={`Comparaison avant/après coaching posing : curseur à ${Math.round(sliderPos)}%`}
          >
            {/* Image de fond : Avant */}
            <img src="/clients/avant-apres/apres.png" alt="Posing avant le coaching Posing Empire" className="absolute inset-0 w-full h-full object-cover" draggable="false" />
            <div className="absolute top-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm z-10 border border-white/10">
              Avant
            </div>
            {/* Overlay clipé : Après */}
            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img src="/clients/avant-apres/avant.png" alt="Posing après le coaching Posing Empire" className="absolute inset-0 w-full h-full object-cover" draggable="false" />
              <div className="absolute top-3 right-3 bg-gold-600/80 text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm border border-gold-400/30">
                Après
              </div>
            </div>
            <div className="slider-handle" style={{ left: `${sliderPos}%` }}>
              <div className="slider-handle-circle"><ChevronLR /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── COUNTRY CODES ─── */
const COUNTRY_CODES = [
  { flag: '🇫🇷', name: 'France', dial: '+33' },
  { flag: '🇧🇪', name: 'Belgique', dial: '+32' },
  { flag: '🇨🇭', name: 'Suisse', dial: '+41' },
  { flag: '🇱🇺', name: 'Luxembourg', dial: '+352' },
  { flag: '🇲🇦', name: 'Maroc', dial: '+212' },
  { flag: '🇩🇿', name: 'Algérie', dial: '+213' },
  { flag: '🇹🇳', name: 'Tunisie', dial: '+216' },
  { flag: '🇸🇳', name: 'Sénégal', dial: '+221' },
  { flag: '🇨🇮', name: 'Côte d’Ivoire', dial: '+225' },
  { flag: '🇨🇲', name: 'Cameroun', dial: '+237' },
  { flag: '🇬🇧', name: 'Royaume-Uni', dial: '+44' },
  { flag: '🇩🇪', name: 'Allemagne', dial: '+49' },
  { flag: '🇪🇸', name: 'Espagne', dial: '+34' },
  { flag: '🇮🇹', name: 'Italie', dial: '+39' },
  { flag: '🇵🇹', name: 'Portugal', dial: '+351' },
  { flag: '🇳🇱', name: 'Pays-Bas', dial: '+31' },
  { flag: '🇵🇱', name: 'Pologne', dial: '+48' },
  { flag: '🇷🇺', name: 'Russie', dial: '+7' },
  { flag: '🇺🇸', name: 'États-Unis', dial: '+1' },
  { flag: '🇨🇦', name: 'Canada', dial: '+1' },
  { flag: '🇧🇷', name: 'Brésil', dial: '+55' },
  { flag: '🇲🇽', name: 'Mexique', dial: '+52' },
  { flag: '🇦🇪', name: 'Émirats arabes', dial: '+971' },
  { flag: '🇸🇦', name: 'Arabie saoudite', dial: '+966' },
  { flag: '🇶🇦', name: 'Qatar', dial: '+974' },
  { flag: '🇯🇵', name: 'Japon', dial: '+81' },
  { flag: '🇨🇳', name: 'Chine', dial: '+86' },
  { flag: '🇮🇳', name: 'Inde', dial: '+91' },
  { flag: '🇦🇺', name: 'Australie', dial: '+61' },
  { flag: '🇬🇵', name: 'Guadeloupe', dial: '+590' },
  { flag: '🇲🇶', name: 'Martinique', dial: '+596' },
  { flag: '🇷🇪', name: 'Réunion', dial: '+262' },
  { flag: '🇬🇳', name: 'Guyane', dial: '+594' },
  { flag: '🇲🇨', name: 'Mayotte', dial: '+262' },
]

function FormPopup({ onClose, mode = 'pdf' }) {
  // phoneLocal : numéro saisi par l'utilisateur (sans indicatif)
  const [formData, setFormData] = useState({ name: '', email: '', phoneLocal: '', instagram: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Pays sélectionné — France par défaut
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Ferme le dropdown si clic en dehors
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  /* ── Formatage : regroupe les chiffres par paquets de 2 ── */
  const formatPhoneLocal = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 15)
    return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trimEnd()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'phoneLocal') {
      setFormData(prev => ({ ...prev, phoneLocal: formatPhoneLocal(value) }))
    } else if (name === 'instagram') {
      const clean = value.startsWith('@') ? value : '@' + value.replace(/^@*/, '')
      setFormData(prev => ({ ...prev, instagram: clean }))
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  /* Numéro complet envoyé : indicatif pays + numéro local sans espaces */
  const getFullPhone = () => {
    const digits = formData.phoneLocal.replace(/\D/g, '')
    return selectedCountry.dial + digits
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = GOOGLE_FORM_ACTION
      form.target = 'hidden-iframe'
      form.style.display = 'none'
      const fields = {
        [FORM_ENTRIES.name]: formData.name.trim(),
        [FORM_ENTRIES.email]: formData.email.trim(),
        [FORM_ENTRIES.phone]: getFullPhone(),
        [FORM_ENTRIES.instagram]: formData.instagram.trim(),
      }
      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input')
        input.name = name; input.value = value; form.appendChild(input)
      })
      let iframe = document.getElementById('hidden-iframe')
      if (!iframe) {
        iframe = document.createElement('iframe')
        iframe.name = 'hidden-iframe'; iframe.id = 'hidden-iframe'; iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      setSubmitted(true)
      if (onSuccess) onSuccess()
    } catch {
      setSubmitted(true)
      if (onSuccess) onSuccess()
    }
    finally { setLoading(false) }
  }

  return (
    <div
      className="popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'pose-gate' ? 'Débloquer les poses' : mode === 'pdf' ? 'Télécharger les 16 poses gratuitement' : 'Rejoindre Posing Empire'}
    >
      <div className="popup-modal animate-slide-in">
        {/* Ligne dorée sommitale */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />



        {!submitted ? (
          <>
            {/* Header popup */}
            <div className="popup-header">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-900/30 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-xs text-gold-300 font-medium">
                  {mode === 'pose-gate' ? '🔓 Accès Gratuit · Sans Engagement' : mode === 'pdf' ? 'PDF Gratuit · Sans Engagement' : 'Posing Empire · Skool'}
                </span>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-white mb-1.5 tracking-tight">
                {mode === 'pose-gate'
                  ? <><span className="text-gold-gradient">Débloque les 16 Poses</span><br />en HD gratuitement</>
                  : mode === 'pdf'
                    ? <><span className="text-gold-gradient">16 Poses Classic</span> <br /> PDF Offert</>
                    : <>Rejoins <span className="text-gold-gradient">Posing Empire</span></>
                }
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {mode === 'pose-gate'
                  ? 'Entre tes coordonnées pour accéder aux 16 poses en grand et télécharger le PDF gratuitement.'
                  : mode === 'pdf'
                    ? 'Entre tes informations pour recevoir immédiatement le PDF des 16 poses Classic.'
                    : 'Crée ton accès et rejoins 200+ athlètes sur la plateforme Posing Empire.'
                }
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="popup-body space-y-2">
              {/* Prénom & Nom */}
              <div>
                <label htmlFor="p-name" className="popup-label">Prénom et Nom *</label>
                <input
                  id="p-name" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Prénom et Nom"
                  required
                  minLength={2}
                  pattern="[A-Za-zÀ-ÿ\s\-']{2,}"
                  title="Prénom et nom (lettres uniquement)"
                  autoComplete="name"
                  className="input-gold"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="p-email" className="popup-label">Email *</label>
                <input
                  id="p-email" type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="ton@email.com"
                  required
                  autoComplete="email"
                  className="input-gold"
                />
              </div>

              {/* Téléphone avec sélecteur de pays */}
              <div>
                <label htmlFor="p-phone" className="popup-label">Téléphone *</label>
                <div className="flex items-center input-gold p-0 overflow-visible relative" ref={dropdownRef}>

                  {/* Bouton indicatif — ouvre le dropdown */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-1.5 px-3 h-full min-h-[38px] border-r border-gold-500/20 bg-white/5 hover:bg-white/10 transition-colors shrink-0 rounded-l-[7px]"
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    aria-label="Sélectionner le pays"
                  >
                    <span className="text-base leading-none" aria-hidden="true">{selectedCountry.flag}</span>
                    <span className="text-xs font-semibold text-gold-300 whitespace-nowrap">{selectedCountry.dial}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`text-gold-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown liste de pays */}
                  {dropdownOpen && (
                    <ul
                      role="listbox"
                      className="absolute top-full left-0 z-50 mt-1 w-56 max-h-56 overflow-y-auto rounded-xl border border-gold-500/25 bg-[#111] shadow-2xl shadow-black/60 py-1"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <li
                          key={country.name + country.dial}
                          role="option"
                          aria-selected={selectedCountry.name === country.name}
                          onClick={() => {
                            setSelectedCountry(country)
                            setDropdownOpen(false)
                          }}
                          className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm transition-colors ${selectedCountry.name === country.name
                            ? 'bg-gold-500/15 text-gold-300'
                            : 'text-gray-300 hover:bg-white/8 hover:text-white'
                            }`}
                        >
                          <span className="text-base shrink-0" aria-hidden="true">{country.flag}</span>
                          <span className="flex-1 truncate">{country.name}</span>
                          <span className="text-gold-400 font-semibold shrink-0">{country.dial}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Champ numéro */}
                  <input
                    id="p-phone"
                    type="tel"
                    name="phoneLocal"
                    value={formData.phoneLocal}
                    onChange={handleChange}
                    placeholder="06 00 00 00 00"
                    required
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label htmlFor="p-instagram" className="popup-label">Instagram *</label>
                <input
                  id="p-instagram" type="text" name="instagram"
                  value={formData.instagram} onChange={handleChange}
                  placeholder="@ton.instagram"
                  required
                  pattern="@[A-Za-z0-9._]{1,30}"
                  title="Handle Instagram (ex: @mon.compte)"
                  className="input-gold"
                />
              </div>

              {/* Newsletter opt-in — décommenter pour réactiver
              <div className="flex items-start gap-2.5 pt-1.5 pb-1">
                <input
                  id="p-newsletter" type="checkbox" name="newsletter"
                  checked={formData.newsletter} onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded border-gold-500/40 text-gold-500 focus:ring-gold-500 bg-black/50 shrink-0 cursor-pointer"
                />
                <label htmlFor="p-newsletter" className="text-[11px] text-gray-400 leading-tight cursor-pointer select-none">
                  Je m'inscris à la newsletter pour recevoir des conseils exclusifs sur le posing et la compétition.
                </label>
              </div>
              */}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-gold w-full mt-2 disabled:opacity-50"
              >
                {loading
                  ? 'Envoi en cours…'
                  : mode === 'pdf'
                    ? 'Recevoir le PDF Gratuitement'
                    : 'Rejoindre Posing Empire'
                }
                {!loading && (mode === 'pdf' ? <DownloadIcon /> : <ArrowRight />)}
              </button>
            </form>

            <div className="popup-footer">
              <p className="text-xs text-gray-600 text-center">
                🔒 Données confidentielles · Jamais partagées · Désabonnement en 1 clic
              </p>
            </div>
          </>
        ) : (
          /* Success */
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="3" strokeLinecap="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            {mode === 'pdf' ? (
              <>
                <h3 className="font-black text-xl text-white mb-2">C&apos;est parti !</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Ton PDF des 16 poses Classic est prêt. Clique ci-dessous pour le télécharger maintenant.
                </p>
                <a href={PDF_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="btn-primary-gold inline-flex">
                  Ouvrir mon PDF <DownloadIcon />
                </a>
              </>
            ) : (
              <>
                <h3 className="font-black text-xl text-white mb-2">Bienvenue dans l&apos;Empire !</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Ton accès à Posing Empire t&apos;attend sur Skool. Rejoins la communauté maintenant.
                </p>
                <a href={SKOOL_URL} target="_blank" rel="noopener noreferrer" className="btn-primary-gold inline-flex">
                  Accéder à Posing Empire <ArrowRight />
                </a>
              </>
            )}
            <button onClick={onClose} className="block mx-auto mt-3 text-sm text-gray-500 hover:text-gold-400 transition-colors">
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── LIGHTBOX ─── */
function Lightbox({ initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const handleNext = (e) => { if (e) e.stopPropagation(); setCurrentIndex((p) => (p + 1) % POSES.length) }
  const handlePrev = (e) => { if (e) e.stopPropagation(); setCurrentIndex((p) => (p - 1 + POSES.length) % POSES.length) }

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    document.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose, handleNext, handlePrev])

  const pose = POSES[currentIndex]

  return (
    <div className="lightbox-overlay animate-fade-in" onClick={onClose}>
      <button onClick={handlePrev} className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-gold-600/80 text-white transition-all z-50 border border-white/10" aria-label="Pose précédente">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      <div className="w-full max-w-4xl h-full flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50" aria-label="Fermer la galerie">
          <CloseIcon />
        </button>
        <img
          key={pose.id}
          src={pose.src}
          alt={`${pose.title} — Pose Classic bodybuilding Posing Empire`}
          className="max-w-full max-h-[85vh] rounded-xl border border-gold-500/20 shadow-2xl object-contain animate-fade-in"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur border border-gold-500/30">
          <p className="text-white text-xs font-semibold uppercase tracking-wide">
            {pose.title} <span className="text-gold-500 opacity-75">({currentIndex + 1}/{POSES.length})</span>
          </p>
        </div>
      </div>

      <button onClick={handleNext} className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-gold-600/80 text-white transition-all z-50 border border-white/10" aria-label="Pose suivante">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </div>
  )
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="section-padding bg-black border-t border-gold-500/10">
      <div className="main-container text-center">
        <div className="flex justify-center gap-3 mb-8">
          <a href="https://www.instagram.com/manael.posing" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-full hover:bg-gold-600/20 hover:text-gold-400 transition-all text-gray-400" aria-label="Instagram de Manaël — Posing Empire">
            <InstagramIcon />
          </a>
        </div>

        <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} Posing Empire by Manaël. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

/* ─── MODAL COUNTDOWN (version compacte pour la modale Skool) ─── */
function ModalCountdown() {
  const { days, hours, minutes, seconds } = useCountdown(SKOOL_OPEN_DATE)
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <CountdownUnit value={days} label="Jours" />
      <span className="text-gold-400 font-black text-xl sm:text-2xl mt-2 sm:mt-3 leading-none">:</span>
      <CountdownUnit value={hours} label="Heures" />
      <span className="text-gold-400 font-black text-xl sm:text-2xl mt-2 sm:mt-3 leading-none">:</span>
      <CountdownUnit value={minutes} label="Min" />
      <span className="text-gold-400 font-black text-xl sm:text-2xl mt-2 sm:mt-3 leading-none">:</span>
      <CountdownUnit value={seconds} label="Sec" />
    </div>
  )
}

/* ─── TEASER VIDEO POPUP ─── */
function SkoolTeaserPopup({ onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div className="lightbox-overlay animate-fade-in flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-bg-primary rounded-2xl border border-gold-500/20 shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-gold-600/80 text-white transition-all border border-white/10" aria-label="Fermer le teaser">
          <CloseIcon />
        </button>
        <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
          <img src="/clients/manael/manael.jpg" alt="Teaser Skool" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gold-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,168,67,0.4)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
            </div>
            <p className="text-gold-400 font-bold uppercase tracking-widest text-sm drop-shadow-md">Trailer Officiel</p>
          </div>
        </div>

        {/* Programme du Skool */}
        <div className="p-6 sm:p-8 bg-black/80 border-b border-gold-500/10 text-left">
          <h4 className="text-sm font-black text-white mb-5 tracking-widest uppercase">Au Programme de Skool :</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <svg className="flex-shrink-0 mt-0.5 text-gold-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
              <div>
                <span className="font-semibold text-gray-200 text-sm block leading-tight">10 modules progressifs & 120 vidéos</span>
                <span className="text-gray-400 text-xs mt-1 block">Modules selon ta catégorie et module spécial pour les compétiteurs, et bien d'autres...</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <svg className="flex-shrink-0 mt-0.5 text-gold-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
              <div>
                <span className="font-semibold text-gray-200 text-sm block leading-tight">Poses, transitions, routines et présence scénique</span>
                <span className="text-gray-400 text-xs mt-1 block">Poses adaptées à ta morphologie, contrôle de la respiration, et méthode ultime.</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <svg className="flex-shrink-0 mt-0.5 text-gold-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
              <div>
                <span className="font-semibold text-gray-200 text-sm block leading-tight">Sessions groupées et bilans corrections posing quotidienne.</span>
                <span className="text-gray-400 text-xs mt-1 block">Feedback visuel en temps réel via webcam avec Manaël pour détruire tes imperfections et asymétries.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 bg-gradient-to-t from-black to-bg-primary text-center">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Rejoins l&apos;élite sur <span className="text-gold-gradient">Skool</span></h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">Le seul programme immersif pour dominer la scène grace a ton posing.</p>
          {/* Countdown — même timer que sur l'accueil */}
          <div className="flex flex-col items-center gap-4">
            <div className="animate-pulse-gold w-12 h-12 rounded-full bg-gold-600/20 shadow-[0_0_30px_rgba(212,168,67,0.4)] border border-gold-500 flex items-center justify-center text-gold-400">
              <LockIcon />
            </div>
            <ModalCountdown />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/50 bg-black/70 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-200 uppercase tracking-widest">Accès Verrouillé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── APP ─── */
function App() {
  const [popupMode, setPopupMode] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [showTeaser, setShowTeaser] = useState(false)

  // Formulaire déjà rempli cette session ?
  const [formSubmitted, setFormSubmitted] = useState(
    () => sessionStorage.getItem('pe_form_done') === '1'
  )
  // Index de la pose en attente (cliquée avant soumission)
  const [pendingPoseIndex, setPendingPoseIndex] = useState(null)

  // Clic sur une pose : gate si form pas encore rempli
  const handlePoseClick = (i) => {
    if (formSubmitted) {
      setLightboxIndex(i)
    } else {
      setPendingPoseIndex(i)
      setPopupMode('pose-gate')
    }
  }

  // Appelé par FormPopup dès que le form est soumis avec succès
  const handleFormSuccess = () => {
    setFormSubmitted(true)
    sessionStorage.setItem('pe_form_done', '1')
  }

  // Fermeture du popup : si form vient d'être rempli + pose en attente → ouvre lightbox
  const handlePopupClose = () => {
    setPopupMode(false)
    if (pendingPoseIndex !== null && formSubmitted) {
      setLightboxIndex(pendingPoseIndex)
      setPendingPoseIndex(null)
    }
  }

  // Auto-popup après 30s pour proposer le PDF gratuit (seulement si form pas encore rempli)
  useEffect(() => {
    if (formSubmitted) return
    const t = setTimeout(() => setPopupMode('pdf'), 30000)
    return () => clearTimeout(t)
  }, [formSubmitted])

  useEffect(() => {
    document.body.style.overflow = (popupMode || lightboxIndex !== null || showTeaser) ? 'hidden' : ''
  }, [popupMode, lightboxIndex, showTeaser])

  // Désactiver click droit et drag sur toutes les images du site
  useEffect(() => {
    const preventImageAction = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', preventImageAction)
    document.addEventListener('dragstart', preventImageAction)

    return () => {
      document.removeEventListener('contextmenu', preventImageAction)
      document.removeEventListener('dragstart', preventImageAction)
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      <Navbar onSkoolTeaser={() => setShowTeaser(true)} />
      <Hero onPDF={() => setPopupMode('pdf')} onSkoolTeaser={() => setShowTeaser(true)} />
      <CoachBanner />
      <PosesGallery onImageClick={handlePoseClick} onPDF={() => setPopupMode('pdf')} />
      <Reviews />
      <VideoTestimonials />
      <BeforeAfter />
      <TransfoGallery />
      <ProCardsSection />
      <YoutubeSection />
      <SkoolComingSoon />
      <Footer />

      {popupMode && <FormPopup mode={popupMode} onSuccess={handleFormSuccess} onClose={handlePopupClose} />}
      {lightboxIndex !== null && <Lightbox initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
      {showTeaser && <SkoolTeaserPopup onClose={() => setShowTeaser(false)} />}
      <Analytics />
    </div>
  )
}

export default App

