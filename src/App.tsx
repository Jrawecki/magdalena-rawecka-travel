import { useEffect } from 'react'
import { CONTACT, EMAIL_LINK, PHONE_LINK } from './contact'

const services = [
  {
    number: '01',
    title: 'Bespoke planning',
    copy: 'Every journey begins with a conversation: how you like to travel, what matters to you, and how you want the time to feel. From there, I shape an itinerary that is considered as a whole—not simply a collection of bookings.',
  },
  {
    number: '02',
    title: 'Details and coordination',
    copy: 'Flights, stays, transfers, reservations and the practicalities in between are brought into one clear plan. Each detail is considered in relation to the next, so the journey feels well paced from beginning to end.',
  },
  {
    number: '03',
    title: 'Support while you travel',
    copy: 'Plans sometimes shift. While you are away, I remain a point of contact for questions and changes, allowing you to stay present in the journey.',
  },
]

const journeys = [
  {
    number: '01',
    title: 'A slower Mediterranean',
    copy: 'Long lunches, small coastal stays and enough unplanned time to follow the day. A journey shaped around fewer places, longer stays and an unhurried rhythm.',
    image: '/images/journey-mediterranean.webp',
    alt: 'A quiet stone lane leading toward the Mediterranean Sea',
    className: 'journey journey--one',
  },
  {
    number: '02',
    title: 'A winter escape in the Alps',
    copy: 'Mountain mornings, warm interiors and days balanced between movement and rest. A winter itinerary with thoughtful transfers and space to settle in.',
    image: '/images/journey-alps.webp',
    alt: 'A snow-covered Alpine valley seen from a timber lodge',
    className: 'journey journey--two',
  },
  {
    number: '03',
    title: 'Three cities, carefully connected',
    copy: 'Three distinct places, joined without rush. The route, stays and travel days are considered together so each city has room to leave an impression.',
    image: '/images/journey-cities.webp',
    alt: 'A quiet European railway platform beneath an iron canopy',
    className: 'journey journey--three',
  },
]

const process = [
  {
    number: '01',
    title: 'First, we talk.',
    copy: 'We begin with a conversation about the occasion, the people travelling and the way you want the journey to feel.',
  },
  {
    number: '02',
    title: 'Then, the journey takes shape.',
    copy: 'I develop the route, stays and details, refining them with you until the plan feels entirely your own.',
  },
  {
    number: '03',
    title: 'Finally, you travel.',
    copy: 'With everything gathered into one clear itinerary, you set off. I remain available if plans need attention along the way.',
  },
]

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header shell">
        <a className="identity" href="#top" aria-label="Magdalena Rawecka, home">
          <span className="identity__name">Magdalena Rawecka</span>
          <span className="identity__role">Independent Travel Advisor</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#journeys">Journeys</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero shell" id="top" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow">Personal travel planning</p>
            <div>
              <h1 id="hero-title">Travel,<br />thoughtfully arranged.</h1>
              <p className="hero__support">
                Personal travel planning for clients who want the details handled with care.
              </p>
            </div>
            <p className="hero__note">From the first idea to the smallest detail.</p>
          </div>
          <figure className="hero__figure">
            <img
              src="/images/hero-mediterranean.webp"
              alt="A quiet stone terrace overlooking a calm Mediterranean coast"
              fetchPriority="high"
            />
            <figcaption>Journey study / The Mediterranean</figcaption>
          </figure>
        </section>

        <section className="introduction shell reveal" aria-labelledby="introduction-title">
          <p className="section-label" id="introduction-title">A considered approach</p>
          <div className="introduction__copy">
            <p>
              Some journeys need more than a list of reservations. They need someone who understands how the pieces fit together.
            </p>
            <p>
              I work closely with each client to shape a journey around the way they want to travel—from the first idea to the smallest detail.
            </p>
          </div>
        </section>

        <section className="services shell" id="services" aria-labelledby="services-title">
          <header className="section-heading reveal">
            <p className="section-label">Services</p>
            <h2 id="services-title">Care at every stage.</h2>
          </header>
          <div className="services__list">
            {services.map((service) => (
              <article className="service reveal" key={service.number}>
                <p className="item-number">{service.number}</p>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="journeys" id="journeys" aria-labelledby="journeys-title">
          <div className="shell">
            <header className="journeys__heading reveal">
              <div>
                <p className="section-label">Selected journeys</p>
                <h2 id="journeys-title">A few ways a journey might take shape.</h2>
              </div>
              <p>
                Not a catalogue or a record of past work—simply a sense of the journeys we might imagine together.
              </p>
            </header>

            <div className="journeys__list">
              {journeys.map((journey) => (
                <article className={journey.className + ' reveal'} key={journey.number}>
                  <figure className="journey__image">
                    <img src={journey.image} alt={journey.alt} loading="lazy" />
                  </figure>
                  <div className="journey__copy">
                    <p className="item-number">Journey idea / {journey.number}</p>
                    <h3>{journey.title}</h3>
                    <p>{journey.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about__inner shell reveal">
            <aside className="about__signature" aria-label="Magdalena Rawecka monogram">
              <span>MR</span>
              <p>A personal practice</p>
            </aside>
            <div className="about__copy">
              <p className="section-label">About Magdalena</p>
              <h2 id="about-title">Thoughtful planning, personally handled.</h2>
              <p className="about__lead">
                I’m Magdalena Rawecka, an independent travel advisor. My work is personal by design: I take the time to understand how each client wants to travel, then bring the many moving parts into one thoughtful, coherent plan.
              </p>
              <p>
                I believe the best journeys feel both considered and natural. The care is in the pacing, the transitions and the details that allow you to be fully present once you leave.
              </p>
            </div>
            {/* A future portrait can replace about__signature without changing the layout. */}
          </div>
        </section>

        <section className="process shell" aria-labelledby="process-title">
          <header className="section-heading reveal">
            <p className="section-label">Process</p>
            <h2 id="process-title">Simple, from the start.</h2>
          </header>
          <div className="process__list">
            {process.map((step) => (
              <article className="process__step reveal" key={step.number}>
                <p className="item-number">{step.number}</p>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="contact" aria-labelledby="contact-title">
        <div className="contact__inner shell">
          <div className="contact__heading reveal">
            <p className="section-label">Magdalena Rawecka / Independent Travel Advisor</p>
            <h2 id="contact-title">When you are ready,<br />let’s begin with a conversation.</h2>
            <a className="conversation-link" href={EMAIL_LINK}>
              Begin a conversation <span aria-hidden="true">↗</span>
            </a>
          </div>
          <address className="contact__details reveal">
            <div>
              <p>Email</p>
              <a href={EMAIL_LINK}>{CONTACT.emailLabel}</a>
            </div>
            <div>
              <p>Telephone</p>
              <a href={PHONE_LINK}>{CONTACT.phoneLabel}</a>
            </div>
          </address>
          <div className="contact__foot">
            <p>Personal travel planning, thoughtfully arranged.</p>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
