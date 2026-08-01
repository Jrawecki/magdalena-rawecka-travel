import { useEffect } from 'react'
import { CONTACT, EMAIL_LINK, PHONE_LINK, WHATSAPP_LINK } from './contact'
import { BusinessCardSleeve } from './BusinessCardSleeve'
import { JourneyAlbum, type Journey } from './JourneyAlbum'

const journeys: Journey[] = [
  {
    number: '01',
    title: 'A slower Mediterranean',
    className: 'journey journey--one',
    slides: [
      {
        image: '/images/journey-mediterranean.webp',
        alt: 'A quiet stone lane leading toward the Mediterranean Sea',
        copy: 'Long lunches, small coastal stays and enough unplanned time to follow the day. A journey shaped around fewer places, longer stays and an unhurried rhythm.',
      },
      {
        image: '/images/journey-mediterranean-02.jpg',
        alt: 'A white terrace and wooden table overlooking the Aegean Sea',
        copy: 'Mornings begin above the water, with nowhere to be too quickly. A simple terrace and an open horizon leave space for the day to unfold on its own.',
      },
      {
        image: '/images/journey-mediterranean-03.jpg',
        alt: 'Sailboats resting in clear water beside a rocky Mediterranean cove',
        copy: 'A sheltered cove becomes the plan for the afternoon. Time on the water is balanced with quiet evenings back on shore and room to linger.',
      },
    ],
  },
  {
    number: '02',
    title: 'A winter escape in the Alps',
    className: 'journey journey--two',
    slides: [
      {
        image: '/images/journey-alps.webp',
        alt: 'A snow-covered Alpine valley seen from a timber lodge',
        copy: 'Mountain mornings, warm interiors and days balanced between movement and rest. A winter itinerary with thoughtful transfers and space to settle in.',
      },
      {
        image: '/images/journey-alps-02.jpg',
        alt: 'A timber lodge glowing beside a snow-covered mountain lake',
        copy: 'The right lodge makes returning part of the day: warm light, an unhurried dinner and the mountains just beyond the windows. Each stay is chosen as carefully as the route.',
      },
      {
        image: '/images/journey-alps-03.jpg',
        alt: 'A small timber cabin tucked among pine trees in winter',
        copy: 'Some days are deliberately small: a walk through the pines, a long lunch and a quiet afternoon indoors. The itinerary leaves space for rest without losing its sense of place.',
      },
    ],
  },
  {
    number: '03',
    title: 'Three cities, carefully connected',
    className: 'journey journey--three',
    slides: [
      {
        image: '/images/journey-cities.webp',
        alt: 'A quiet European railway platform beneath an iron canopy',
        copy: 'Three distinct places, joined without rush. The route, stays and travel days are considered together so each city has room to leave an impression.',
      },
      {
        image: '/images/journey-cities-02.jpg',
        alt: 'Colorful balconies on an apartment building in Geneva',
        copy: 'Between travel days, the details become more local: a balcony, a neighborhood market and a familiar route back to the hotel. Each stay gives the city time to feel lived in.',
      },
      {
        image: '/images/journey-cities-03.jpg',
        alt: 'A softly lit cafe seen through a rain-covered window',
        copy: 'Rain changes the pace without changing the plan. A cafe pause, a nearby gallery and a well-placed reservation keep the day flexible and quietly connected.',
      },
    ],
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
          <a href="#approach">Approach</a>
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
            <p className="hero__note">From the first idea to every thoughtful detail.</p>
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

        <section className="introduction shell reveal" id="approach" aria-labelledby="approach-title">
          <p className="section-label">A considered approach</p>
          <div className="introduction__copy">
            <h2 id="approach-title">The whole journey, considered.</h2>
            <div className="introduction__body">
              <p>
                I work closely with each client to shape a journey around the way they want to travel—from the first idea to the smallest detail.
              </p>
              <p>
                I bring the route, stays and practical details into one clear plan. While you travel, I remain discreetly available—making sure each stay is ready for your arrival and stepping in only when needed.
              </p>
            </div>
            <p className="introduction__scope" aria-label="Planning services">
              Itinerary design <span aria-hidden="true">/</span> stays and reservations <span aria-hidden="true">/</span> travel coordination <span aria-hidden="true">/</span> quiet care along the way
            </p>
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
                <JourneyAlbum journey={journey} key={journey.number} />
              ))}
            </div>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about__inner shell reveal">
            <div className="about__visuals">
              <figure className="about__portrait" aria-label="Reserved space for a future portrait of Magdalena">
                <div className="about__portrait-frame">
                  <span>Portrait to follow</span>
                </div>
                <figcaption>Magdalena / portrait</figcaption>
              </figure>
              <BusinessCardSleeve />
            </div>
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
            {/* Replace about__portrait-frame with Magdalena's real portrait when available. */}
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
            <div>
              <p>WhatsApp</p>
              <a href={WHATSAPP_LINK}>{CONTACT.whatsappLabel}</a>
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
