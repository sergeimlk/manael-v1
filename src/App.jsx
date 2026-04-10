import { useState, useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════ */
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
const FORM_ENTRIES = {
  name: 'entry.0000000001',
  email: 'entry.0000000002',
  phone: 'entry.0000000003',
  instagram: 'entry.0000000004',
}
const SKOOL_URL = 'https://www.skool.com/manael'
const GOOGLE_DRIVE_PDF_URL = 'https://drive.google.com/file/d/YOUR_PDF_FILE_ID/view'

const COACHED_ATHLETES = [
  { name: 'Mehdi R.', handle: '@mehdi.physique', title: 'IFBB Pro Classic' },
  { name: 'Antoine L.', handle: '@antoine_stage', title: 'Champion de France' },
  { name: 'Dylan K.', handle: '@dylan.posing', title: 'NPC Competitor' },
  { name: 'Lucas M.', handle: '@lucas.classic', title: 'Junior IFBB Elite' },
  { name: 'Rayan B.', handle: '@rayan_bbfit', title: "Men's Physique Pro" },
  { name: 'Nathan S.', handle: '@nathan.staging', title: 'Classic Physique' },
]

const POSES = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `/poses/${i + 1}.png`,
  title: `Pose ${i + 1}`,
}))

const REVIEWS = [
  {
    name: 'Karim B.',
    role: 'Classic Physique — Compétiteur Amateur',
    avatar: '/clients/client_1.png',
    stars: 5,
    comment:
      "Avant Posing Empire, je posais sans comprendre pourquoi. En 3 semaines, j'avais une logique derrière chaque mouvement. Résultat : +3 places à ma première régionale. Le module Compétition seul vaut l'accès.",
  },
  {
    name: 'Sophie M.',
    role: "Men's Physique — Athlète IFBB",
    avatar: '/clients/client_2.png',
    stars: 5,
    comment:
      "Les corrections de symétrie ont tout changé pour moi. Manael identifie en quelques secondes ce que d'autres coachs ne voient jamais. Précision chirurgicale, progressions réelles. Je recommande sans hésiter.",
  },
  {
    name: 'Thomas D.',
    role: 'Bodybuilder — Pro Card Holder',
    avatar: '/clients/client_3.png',
    stars: 5,
    comment:
      "Le module Mobilité & Activation m'a libéré de douleurs que j'avais depuis des années. Mes poses sont plus fluides, plus stables. Travailler directement avec Manael en session 1-1, c'est une autre dimension.",
  },
]

const MODULES = [
  {
    level: 'Level 1',
    icon: '🏗️',
    title: 'Les Fondations',
    desc: "Vocabulaire du poseur, setup corporel, symétrie et sangle abdominale. La base sans laquelle tout s'effondre sur scène.",
  },
  {
    level: 'Level 2',
    icon: '💪',
    title: 'Classic & Body',
    desc: "Placements de jambes, quarts de tour, mandatories et round d'endurance. Le cœur du posing compétitif.",
  },
  {
    level: 'Level 3',
    icon: '👑',
    title: 'The Classic Class',
    desc: 'Front, Side & ¾, Back poses et transitions artistiques. Le niveau où les vrais champions se distinguent.',
  },
  {
    level: 'Level 4',
    icon: '🏆',
    title: 'Compétition',
    desc: "Attitude scénique, respiration, tan, pump pre-stage et gestion des fédérations. Rien ne te surprendra le jour J.",
  },
  {
    level: 'Level 5',
    icon: '🎯',
    title: 'Sessions & Accompagnement',
    desc: "Coaching 1-1 avec Manael, suivi Premium 3 mois ou accès VIP. Pour aller plus loin avec un œil d'expert.",
  },
  {
    level: 'Bonus',
    icon: '⚡',
    title: 'Mobilité & Vacuum',
    desc: "Mobilité de hanche, colonne et activation musculaire complète. Plus le module Vacuum — l'arme secrète des pros.",
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

/* ─── COACH BANNER ─── */
function CoachBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gold-900/40 via-gold-800/20 to-gold-900/40 border-y border-gold-500/15">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.06),transparent_70%)]" />
      <div className="main-container relative z-10 py-5 sm:py-6">
        <p className="text-center text-xs text-gold-400 uppercase tracking-[0.15em] font-semibold mb-4">
          Coachés par Manael · Résultats prouvés en compétition
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-8">
          {COACHED_ATHLETES.map((athlete, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-[10px] font-bold text-bg-primary flex-shrink-0">
                {athlete.name.charAt(0)}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white group-hover:text-gold-400 transition-colors">{athlete.name}</p>
                <p className="text-[10px] text-gold-500/80">{athlete.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── NAVBAR ─── */
function Navbar() {
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
            src="/clients/manael/logoPE.jpg"
            alt="Logo Posing Empire"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-contain bg-black"
          />
          <span className="font-bold text-sm sm:text-base tracking-widest text-gold-gradient uppercase">
            POSING EMPIRE
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <a href="#poses" className="hidden sm:block text-sm text-gray-300 hover:text-gold-400 transition-colors">
            Poses
          </a>
          <a href="#programme" className="hidden sm:block text-sm text-gray-300 hover:text-gold-400 transition-colors">
            Programme
          </a>
          <a href="#avis" className="hidden sm:block text-sm text-gray-300 hover:text-gold-400 transition-colors">
            Avis
          </a>
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

/* ─── HERO ─── */
function Hero({ onPDF }) {
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
              <span className="text-xs text-gold-300 font-medium">PDF Gratuit · 16 Poses Classiques Offertes</span>
            </div>

            {/* H1 */}
            <h1 className="font-black tracking-tighter leading-[1.08] mb-6 text-[clamp(1.75rem,5.5vw,3.25rem)]">
              DOMINE LA{' '}
              <span className="text-gold-gradient">SCÈNE.</span>
              <br />
              <span className="text-gold-gradient">MAÎTRISE TON POSING.</span>
            </h1>

            {/* Accroche */}
            <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 mb-6 leading-relaxed">
              La méthode conçue par un coach IFBB certifié pour faire de ton posing une{' '}
              <strong className="text-white">arme compétitive</strong>
              {' '}— poses classiques, symétrie parfaite, transitions fluides.{' '}
              <strong className="text-gold-400">+3 places minimum</strong> dès ta prochaine compétition.
            </p>

            {/* Checklist */}
            <ul className="space-y-2.5 mb-8 max-w-sm mx-auto lg:mx-0 text-left">
              {[
                '10 modules progressifs · 50+ vidéos HD exclusives',
                'Poses, transitions & présence scénique maîtrisée',
                'Coaching 1-1 disponible directement avec Manael',
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
                Télécharger les 16 Poses Gratuitement <DownloadIcon />
              </button>
              <a href={SKOOL_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary-gold btn-hero w-full sm:w-auto">
                Accéder au Programme →
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {['K', 'S', 'T', 'A'].map((l, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-xs font-bold text-bg-primary border-2 border-bg-primary"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                Déjà <strong className="text-white">200+ athlètes</strong> formés à la méthode
              </p>
            </div>
          </div>

          {/* ── Photo Coach ── */}
          <div className="w-full max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto lg:mx-0 animate-float flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full">
              <div className="absolute -inset-3 bg-gradient-to-br from-gold-400/20 via-gold-600/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl shadow-gold-900/30">
                <img
                  src="/clients/manael/manael.jpg"
                  alt="Manael — Coach Posing Expert, Fondateur de Posing Empire"
                  className="w-full h-auto object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <p className="font-bold text-base text-white text-center">Manael</p>
                  <p className="text-gold-400 text-xs font-medium text-center uppercase tracking-widest">
                    Coach Posing · Fondateur Posing Empire
                  </p>
                </div>
              </div>
            </div>
          </div>

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

/* ─── PROGRAMME ─── */
function Programme() {
  return (
    <section id="programme" className="section-padding relative bg-black/40">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gold-600 rounded-full blur-[180px] opacity-5" />
      </div>
      <div className="main-container relative z-10">
        <SectionHeading
          white="LE PROGRAMME "
          gold="COMPLET"
          subtitle="De tes premières poses aux finales nationales — chaque module te rapproche du podium."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {MODULES.map((mod, i) => (
            <article
              key={i}
              className="card-glass p-5 sm:p-6 opacity-0 animate-fade-up group"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5 flex-shrink-0" role="img" aria-hidden="true">{mod.icon}</span>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1 block">{mod.level}</span>
                  <h3 className="font-bold text-white text-sm sm:text-base mb-1.5 group-hover:text-gold-400 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{mod.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <a href={SKOOL_URL} target="_blank" rel="noopener noreferrer" className="btn-primary-gold">
            Accéder au Programme Complet <ArrowRight />
          </a>
          <p className="text-gray-500 text-xs mt-2">Accès sur Skool · Rejoins 200+ athlètes</p>
        </div>
      </div>
    </section>
  )
}

/* ─── POSES GALLERY ─── */
function PosesGallery({ onImageClick, onPDF }) {
  return (
    <section id="poses" className="section-padding relative">
      <div className="main-container">
        <SectionHeading
          white="LES 16 POSES "
          gold="CLASSIQUES"
          subtitle="Placements précis, erreurs à éviter, corrections de symétrie — chaque pose décortiquée pour que tu ne laisses aucun point sur la table."
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
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={pose.src}
                  alt={`${pose.title} — Pose classique bodybuilding Posing Empire`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="py-2 px-3 text-center">
                <p className="text-xs font-semibold text-gold-400 tracking-wide">{pose.title}</p>
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

/* ─── REVIEWS ─── */
function Reviews() {
  return (
    <section id="avis" className="section-padding relative bg-black/50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-600 rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="main-container relative z-10">
        <SectionHeading
          white="ILS ONT "
          gold="DOMINÉ LA SCÈNE"
          subtitle="Des compétiteurs amateurs aux pros IFBB — voici ce que la méthode Posing Empire a concrètement changé pour eux."
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
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-500/40 flex-shrink-0 bg-gradient-to-br from-gold-400 to-gold-700">
                  <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" loading="lazy" />
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
    const onTouch = (e) => { e.preventDefault(); handleMove(e.touches[0].clientX) }
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
          subtitle="Une différence visible à l'œil nu. Glisse le curseur et juge toi-même l'impact du coaching Posing Empire."
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
            <img src="/clients/avant/apres/avant.png" alt="Posing avant le coaching Posing Empire" className="absolute inset-0 w-full h-full object-cover" draggable="false" />
            <div className="absolute top-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm z-10 border border-white/10">
              Avant
            </div>
            {/* Overlay clipé : Après */}
            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img src="/clients/avant/apres/apres.png" alt="Posing après le coaching Posing Empire" className="absolute inset-0 w-full h-full object-cover" draggable="false" />
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

/* ─── POPUP FORM ─── */
function FormPopup({ onClose, mode = 'pdf' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', instagram: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

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
        [FORM_ENTRIES.name]: formData.name,
        [FORM_ENTRIES.email]: formData.email,
        [FORM_ENTRIES.phone]: formData.phone,
        [FORM_ENTRIES.instagram]: formData.instagram,
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
    } catch { setSubmitted(true) }
    finally { setLoading(false) }
  }

  return (
    <div
      className="popup-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'pdf' ? 'Télécharger les 16 poses gratuitement' : 'Rejoindre Posing Empire'}
    >
      <div className="popup-modal animate-slide-in">
        {/* Ligne dorée sommitale */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>

        {!submitted ? (
          <>
            {/* Header popup */}
            <div className="popup-header">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-900/30 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-xs text-gold-300 font-medium">
                  {mode === 'pdf' ? 'PDF Gratuit · Sans Engagement' : 'Posing Empire · Skool'}
                </span>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-white mb-1.5 tracking-tight">
                {mode === 'pdf'
                  ? <><span className="text-gold-gradient">16 Poses Classiques</span> — PDF Offert</>
                  : <>Rejoins <span className="text-gold-gradient">Posing Empire</span></>
                }
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {mode === 'pdf'
                  ? 'Entre tes informations pour recevoir immédiatement le PDF des 16 poses classiques.'
                  : 'Crée ton accès et rejoins 200+ athlètes sur la plateforme Posing Empire.'
                }
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="popup-body space-y-3">
              <div>
                <label htmlFor="p-name" className="popup-label">Prénom et Nom *</label>
                <input
                  id="p-name" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Ton prénom et nom" required
                  autoComplete="name" className="input-gold"
                />
              </div>
              <div>
                <label htmlFor="p-email" className="popup-label">Email *</label>
                <input
                  id="p-email" type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="ton@email.com" required
                  autoComplete="email" className="input-gold"
                />
              </div>
              <div>
                <label htmlFor="p-phone" className="popup-label">Téléphone</label>
                <input
                  id="p-phone" type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="+33 6 XX XX XX XX"
                  autoComplete="tel" className="input-gold"
                />
              </div>
              <div>
                <label htmlFor="p-instagram" className="popup-label">Instagram</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500/60 text-sm select-none">@</span>
                  <input
                    id="p-instagram" type="text" name="instagram"
                    value={formData.instagram} onChange={handleChange}
                    placeholder="ton.instagram" className="input-gold pl-7"
                  />
                </div>
              </div>

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
                  Ton PDF des 16 poses classiques est prêt. Clique ci-dessous pour le télécharger maintenant.
                </p>
                <a href={GOOGLE_DRIVE_PDF_URL} target="_blank" rel="noopener noreferrer" className="btn-primary-gold inline-flex">
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
  }, [onClose])

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
          alt={`${pose.title} — Pose classique bodybuilding Posing Empire`}
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
        <h2 className="font-black tracking-widest text-xl sm:text-2xl text-gold-gradient mb-2 uppercase">POSING EMPIRE</h2>
        <p className="text-gray-500 text-sm mb-8">La référence du coaching posing bodybuilding en France · Classic & Men&apos;s Physique</p>

        <div className="flex justify-center mb-8">
          <a href={SKOOL_URL} target="_blank" rel="noopener noreferrer" className="btn-primary-gold">
            Rejoindre Posing Empire <ArrowRight />
          </a>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <a href="https://www.instagram.com/manael" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-full hover:bg-gold-600/20 hover:text-gold-400 transition-all text-gray-400" aria-label="Instagram de Manael — Posing Empire">
            <InstagramIcon />
          </a>
        </div>

        <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} Posing Empire by Manael. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

/* ─── APP ─── */
function App() {
  const [popupMode, setPopupMode] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Auto-popup after 8s pour proposer le PDF gratuit
  useEffect(() => {
    const t = setTimeout(() => setPopupMode('pdf'), 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (popupMode || lightboxIndex !== null) ? 'hidden' : ''
  }, [popupMode, lightboxIndex])

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      <Navbar />
      <Hero onPDF={() => setPopupMode('pdf')} />
      <CoachBanner />
      <PosesGallery onImageClick={setLightboxIndex} onPDF={() => setPopupMode('pdf')} />
      <Programme />
      <Reviews />
      <BeforeAfter />
      <Footer />

      {popupMode && <FormPopup mode={popupMode} onClose={() => setPopupMode(false)} />}
      {lightboxIndex !== null && <Lightbox initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
    </div>
  )
}

export default App
