'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: 'Principles', href: '#principles', index: '01' },
  { label: 'Products', href: '#products', index: '02' },
  { label: 'Manufacturing', href: '#manufacturing', index: '03' },
  { label: 'Sustainability', href: '#sustainability', index: '04' },
  { label: 'Careers', href: '#careers', index: '05' },
  { label: 'Contact', href: '#contact', index: '06' },
];

const DISCIPLINES = [
  {
    num: '01',
    title: 'Systems Thinking',
    copy: 'Seeing the mill, the fiber supply, and the customer as one connected loop rather than isolated steps.',
  },
  {
    num: '02',
    title: 'Personal Mastery',
    copy: 'Operators, engineers, and quality staff held to a standard of continuous, individual improvement.',
  },
  {
    num: '03',
    title: 'Mental Models',
    copy: 'Testing assumptions about fiber, process, and demand against what the mill floor actually shows.',
  },
  {
    num: '04',
    title: 'Shared Vision',
    copy: 'One production standard held across three shifts, twenty-four hours a day.',
  },
  {
    num: '05',
    title: 'Team Learning',
    copy: 'Improvement carried across shifts and roles, not held by any single team.',
  },
];

const STATS = [
  { value: 2017, suffix: '', label: 'Founded', isYear: true },
  { value: 400, suffix: '', label: 'Metric tons produced daily' },
  { value: 100, suffix: '%', label: 'Recycled fiber input' },
  { value: 3, suffix: '', label: 'Shifts running 24/7' },
];

const PRODUCTS = [
  {
    tag: 'Inner Layer',
    title: 'Corrugating Medium',
    copy: 'The fluted inner layer of corrugated board, engineered to hold its shape under stacking pressure and load.',
  },
  {
    tag: 'Outer Layer',
    title: 'Test Linerboard',
    copy: 'The flat facing that gives corrugated boxes their strength, print surface, and structural rigidity.',
  },
  {
    tag: 'Office Recovery',
    title: 'White Grade Paper',
    copy: 'Recovered office paper reprocessed into clean white-grade sheet for printing and specialty packaging.',
  },
  {
    tag: 'Recovered Fiber',
    title: 'Newsprint & Specialty Grades',
    copy: 'Additional recycled grades produced from recovered fiber for niche packaging and print applications.',
  },
];

const CERTIFICATIONS = [
  {
    title: 'ISO 9001:2015',
    copy: 'Quality management certification maintained across every stage of production.',
    image: '/images/5D_ISO.png',
    meta: 'Reg. No. 01 100 2134897 · Valid to Apr 2028',
  },
  {
    title: 'FSC Certified',
    copy: 'Forest Stewardship Council certification for responsible, traceable fiber sourcing.',
    image: '/images/5D_FSC.png',
    meta: 'Cert. BV-COC-003101 · Valid to Mar 2031',
  },
];

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll hook                                              */
/* ------------------------------------------------------------------ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const Component = Tag as any;
  return (
    <Component
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function Counter({
  value,
  suffix,
  isYear = false,
}: {
  value: number;
  suffix: string;
  isYear?: boolean;
}) {
  const { ref, visible } = useReveal<HTMLSpanElement>();
  const [display, setDisplay] = useState(isYear ? value : 0);

  useEffect(() => {
    if (!visible || isYear) return;
    const duration = 1400;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible, value, isYear]);

  return (
    <span ref={ref} className={styles.statValue}>
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCert, setActiveCert] = useState<(typeof CERTIFICATIONS)[number] | null>(null);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!activeCert) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveCert(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeCert]);

  return (
    <div className={styles.page}>
      {/* ---------------------------------------------- HANGING NAV */}
      <div className={styles.navWrap}>
        <header className={`${styles.navCard} ${scrolled ? styles.navCardScrolled : ''}`}>
          <div className={styles.navInner}>
            <a href="#top" className={styles.logo}>
              <Image
                src="/images/logo-horizontal.png"
                alt="Fifth Discipline Packaging Paper Corporation"
                width={525}
                height={92}
                priority
                className={styles.logoImg}
              />
            </a>

            <nav className={styles.navLinks} aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className={styles.navLink}>
                  <span className={styles.navIndex}>{link.index}</span>
                  {link.label}
                </a>
              ))}
            </nav>

            <div className={styles.navActions}>
              <a href="#contact" className={styles.navCta}>
                Get in touch
                <svg viewBox="0 0 16 16" fill="none" className={styles.navCtaIcon}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button
                className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ''}`}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>

          <div className={styles.navProgress} style={{ transform: `scaleX(${progress})` }} />
        </header>

        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={styles.mobileLink}>
              <span className={styles.navIndex}>{link.index}</span>
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className={styles.mobileCta}>
            Get in touch
          </a>
        </div>
      </div>

      {/* ----------------------------------------------------- HERO */}
      <section id="top" className={styles.hero}>
        <div className={styles.heroGrain} aria-hidden="true" />
        <svg className={styles.heroLine} viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M-20 220 C 40 160, 100 160, 160 220 C 220 280, 280 280, 340 220 C 400 160, 460 160, 520 220 C 580 280, 640 280, 700 220 C 760 160, 820 160, 880 220 C 940 280, 1000 280, 1060 220 C 1120 160, 1180 160, 1220 220"
            fill="none"
            stroke="var(--azure)"
            strokeWidth="2"
          />
        </svg>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>100% Recycled Paper Manufacturing · Est. 2017</p>
          <h1 className={styles.heroTitle}>
            Every fiber,
            <br />
            given another life.
          </h1>
          <p className={styles.heroSub}>
            Fifth Discipline Packaging Paper Corporation transforms recovered paper
            into corrugating medium, linerboard, and specialty grades — milled in
            Mabalacat and delivered to the industries that pack, ship, and protect
            the Philippines.
          </p>
          <div className={styles.heroActions}>
            <a href="#products" className={styles.btnPrimary}>
              See our products
            </a>
            <a href="#contact" className={styles.btnGhost}>
              Talk to our team
            </a>
          </div>
        </div>

        <div className={styles.scrollCue} aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ---------------------------------------------------- STATS */}
      <section className={styles.stats}>
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 90} className={styles.statItem}>
            <Counter value={stat.value} suffix={stat.suffix} isYear={stat.isYear} />
            <span className={styles.statLabel}>{stat.label}</span>
          </Reveal>
        ))}
      </section>

      {/* ----------------------------------------------------ABOUT */}
      <section className={styles.about}>
        <Reveal as="p" className={styles.sectionEyebrow}>
          About Fifth Discipline
        </Reveal>
        <div className={styles.aboutGrid}>
          <Reveal className={styles.aboutPhoto}>
            <Image
              src="/images/about-us.jpg"
              alt="Fifth Discipline Packaging Paper Corporation facility"
              width={507}
              height={495}
              className={styles.aboutPhotoImg}
            />
            <span className={styles.aboutCaption}>
              TECO Industrial Park &middot; Bundagul, Mabalacat City
            </span>
          </Reveal>

          <div className={styles.aboutTextCol}>
            <Reveal as="h2" className={styles.aboutTitle}>
              A dedicated packaging-paper mill, built alongside TIPCO.
            </Reveal>
            <Reveal delay={120} className={styles.aboutBody}>
              <p>
                Fifth Discipline Packaging Paper Corporation (FDPPC) is a
                Philippine paper manufacturer based at TECO Industrial Park in
                Bundagul, Mabalacat City, Pampanga. It operates as a separate,
                SEC-registered entity from TIPCO, though the two share the same
                industrial complex and a closely linked operational history.
              </p>
              <p>
                While TIPCO&rsquo;s traditional lines span newsprint, printing and
                writing paper, and packaging paper, Fifth Discipline was built to
                concentrate on one thing: packaging-grade paper made entirely from
                recycled fiber, for a market being reshaped by shipping, logistics,
                and e-commerce.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- PRINCIPLES */}
      <section id="principles" className={styles.principles}>
        <Reveal as="p" className={styles.sectionEyebrow}>
          Where the Name Comes From
        </Reveal>
        <div className={styles.principlesIntro}>
          <Reveal as="h2" className={styles.sectionTitle}>
            Five disciplines, run through a paper mill.
          </Reveal>
          <Reveal delay={100} as="p" className={styles.principlesCopy}>
            The company&rsquo;s name is widely believed to reference{' '}
            <em>The Fifth Discipline</em>, Peter M. Senge&rsquo;s influential book
            on the &ldquo;learning organization.&rdquo; No official source
            confirms this as the origin — but the five disciplines it describes
            read like a fair account of how a 24/7 mill actually has to run.
          </Reveal>
        </div>

        <div className={styles.disciplineGrid}>
          {DISCIPLINES.map((d, i) => (
            <Reveal key={d.title} delay={i * 90} className={styles.disciplineCard}>
              <span className={styles.disciplineNum}>{d.num}</span>
              <h3 className={styles.disciplineTitle}>{d.title}</h3>
              <p className={styles.disciplineCopy}>{d.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- PRODUCTS */}
      <section id="products" className={styles.industries}>
        <Reveal as="p" className={styles.sectionEyebrow}>
          What We Produce
        </Reveal>
        <Reveal as="h2" className={styles.sectionTitle}>
          Four grades, one recovered fiber stream.
        </Reveal>

        <div className={styles.industryGrid}>
          {PRODUCTS.map((item, i) => (
            <Reveal key={item.title} delay={i * 100} className={styles.industryCard}>
              <span className={styles.industryTag}>{item.tag}</span>
              <h3 className={styles.industryTitle}>{item.title}</h3>
              <p className={styles.industryCopy}>{item.copy}</p>
              <span className={styles.industryArrow} aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------- MANUFACTURING */}
      <section id="manufacturing" className={styles.presence}>
        <Reveal as="p" className={styles.sectionEyebrow}>
          Manufacturing
        </Reveal>
        <Reveal as="h2" className={styles.sectionTitle}>
          One mill, running around the clock.
        </Reveal>

        <Reveal delay={100} className={styles.presenceBanner}>
          <Image
            src="/images/finished-rolls.jpg"
            alt="Finished paper rolls ready for dispatch at the Fifth Discipline mill"
            width={1200}
            height={974}
            className={styles.presenceBannerImg}
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority={false}
          />
        </Reveal>

        <div className={styles.presenceRow}>
          <Reveal delay={160} as="p" className={styles.presenceCopy}>
            The plant runs 24 hours a day across three continuous shifts, with a
            production capacity of roughly 400 metric tons per day. Wastepaper is
            sourced from suppliers across the Philippines and finished product
            leaves the mill primarily as large paper rolls, ready for converters,
            carton box manufacturers, and paper bag manufacturers.
          </Reveal>

          <div className={styles.certGrid}>
            {CERTIFICATIONS.map((cert, i) => (
              <Reveal key={cert.title} delay={220 + i * 100} className={styles.certCard}>
                <button
                  type="button"
                  onClick={() => setActiveCert(cert)}
                  className={styles.certThumb}
                  aria-label={`View ${cert.title} certificate`}
                >
                  <Image
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    width={420}
                    height={560}
                    className={styles.certThumbImg}
                    sizes="96px"
                  />
                  <span className={styles.certThumbHint}>View</span>
                </button>
                <div className={styles.certBody}>
                  <span className={styles.certCheck} aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  <p className={styles.certCopy}>{cert.copy}</p>
                  <span className={styles.certMeta}>{cert.meta}</span>
                  <button
                    type="button"
                    onClick={() => setActiveCert(cert)}
                    className={styles.certViewLink}
                  >
                    View certificate
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------SUSTAINABILITY */}
      <section id="sustainability" className={styles.sustain}>
        <Reveal as="p" className={styles.sectionEyebrowLight}>
          Sustainability
        </Reveal>
        <Reveal as="h2" className={styles.sustainTitle}>
          Recycled fiber isn&rsquo;t a division here. It&rsquo;s the entire mill.
        </Reveal>
        <Reveal delay={120} className={styles.sustainGrid}>
          <div className={styles.sustainStat}>
            <span className={styles.sustainNumber}>ISO 9001</span>
            <span className={styles.sustainLabel}>
              Quality management certification maintained mill-wide
            </span>
          </div>
          <div className={styles.sustainStat}>
            <span className={styles.sustainNumber}>FSC</span>
            <span className={styles.sustainLabel}>
              Chain-of-custody certification for responsible fiber sourcing
            </span>
          </div>
          <div className={styles.sustainStat}>
            <span className={styles.sustainNumber}>0%</span>
            <span className={styles.sustainLabel}>
              Virgin fiber added — every sheet starts as recovered paper
            </span>
          </div>
        </Reveal>
      </section>

      {/* --------------------------------------------------------CTA */}
      <section id="careers" className={styles.cta}>
        <Reveal as="h2" className={styles.ctaTitle}>
          Let&rsquo;s talk packaging paper.
        </Reveal>
        <Reveal delay={100} as="p" className={styles.ctaSub}>
          From corrugating medium to specialty recycled grades — our team can
          walk you through capacity, specifications, and lead times.
        </Reveal>
        <Reveal delay={180}>
          <a id="contact" href="mailto:contact@fifthdiscipline.example" className={styles.ctaButton}>
            Start a conversation
          </a>
        </Reveal>
      </section>

      {/* -----------------------------------------------------FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a href="#top" className={styles.footerLogo}>
            <Image
              src="/images/logo-full.png"
              alt="Fifth Discipline Packaging Paper Corporation"
              width={350}
              height={276}
              className={styles.footerLogoImg}
            />
          </a>

          <div className={styles.footerCols}>
            <div className={styles.footerCol}>
              <span className={styles.footerHeading}>Company</span>
              <a href="#products">Products</a>
              <a href="#manufacturing">Manufacturing</a>
              <a href="#sustainability">Sustainability</a>
            </div>
            <div className={styles.footerCol}>
              <span className={styles.footerHeading}>Resources</span>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
              <a href="#manufacturing">Certifications</a>
            </div>
            <div className={styles.footerCol}>
              <span className={styles.footerHeading}>Connect</span>
              <a href="#top">LinkedIn</a>
              <a href="#careers">Job openings</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>&copy; {new Date().getFullYear()} Fifth Discipline Packaging Paper Corporation.</span>
          <span>TECO Industrial Park, Bundagul, Mabalacat City, Pampanga</span>
        </div>
      </footer>

      {/* ------------------------------------------------ CERT MODAL */}
      {activeCert && (
        <div
          className={styles.certModalOverlay}
          onClick={() => setActiveCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCert.title} certificate`}
        >
          <div className={styles.certModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.certModalClose}
              onClick={() => setActiveCert(null)}
              aria-label="Close certificate"
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className={styles.certModalImageWrap}>
              <Image
                src={activeCert.image}
                alt={`${activeCert.title} certificate`}
                width={activeCert.image.includes('fsc') ? 2481 : 2550}
                height={activeCert.image.includes('fsc') ? 3508 : 3300}
                className={styles.certModalImage}
                sizes="(max-width: 640px) 90vw, 480px"
                priority
              />
            </div>

            <div className={styles.certModalInfo}>
              <h3 className={styles.certModalTitle}>{activeCert.title}</h3>
              <p className={styles.certModalCopy}>{activeCert.copy}</p>
              <span className={styles.certModalMeta}>{activeCert.meta}</span>
              <a
                href={activeCert.image}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.certModalDownload}
              >
                Open full size
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}