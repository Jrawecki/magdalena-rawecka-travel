import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

export type JourneySlide = {
  image: string
  alt: string
  copy: string
}

export type Journey = {
  number: string
  title: string
  className: string
  slides: [JourneySlide, ...JourneySlide[]]
}

type JourneyAlbumProps = {
  journey: Journey
}

function ArrowIcon({ direction }: { direction: 'previous' | 'next' }) {
  const path = direction === 'previous' ? 'M17 12H7m4-4-4 4 4 4' : 'M7 12h10m-4-4 4 4-4 4'

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  )
}

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

export function JourneyAlbum({ journey }: JourneyAlbumProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const headingId = useId()
  const mediaRef = useRef<HTMLElement>(null)
  const normalizedIndex = activeIndex % journey.slides.length
  const activeSlide = journey.slides[normalizedIndex]
  const hasMultipleSlides = journey.slides.length > 1

  const changeSlide = (offset: number) => {
    setActiveIndex((currentIndex) => wrapIndex(currentIndex + offset, journey.slides.length))
  }

  useEffect(() => {
    const media = mediaRef.current
    if (!hasMultipleSlides || !media || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        const adjacentIndexes = [
          wrapIndex(normalizedIndex - 1, journey.slides.length),
          wrapIndex(normalizedIndex + 1, journey.slides.length),
        ]

        adjacentIndexes.forEach((index) => {
          const image = new Image()
          image.src = journey.slides[index].image
        })
        observer.disconnect()
      },
      { rootMargin: '240px 0px' },
    )

    observer.observe(media)
    return () => observer.disconnect()
  }, [hasMultipleSlides, journey.slides, normalizedIndex])

  const handleGalleryKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      changeSlide(-1)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      changeSlide(1)
    }
  }

  return (
    <article className={`${journey.className} reveal`}>
      <figure
        className="journey__image"
        ref={mediaRef}
        role="group"
        aria-roledescription="carousel"
        aria-labelledby={headingId}
        onKeyDown={handleGalleryKeyDown}
      >
        <img
          key={activeSlide.image}
          className="journey__photo"
          src={activeSlide.image}
          alt={activeSlide.alt}
          loading="lazy"
          draggable="false"
        />

        {hasMultipleSlides && (
          <>
            <button
              className="journey__control journey__control--previous"
              type="button"
              aria-label={`Previous photo in ${journey.title}`}
              onClick={() => changeSlide(-1)}
            >
              <ArrowIcon direction="previous" />
            </button>
            <button
              className="journey__control journey__control--next"
              type="button"
              aria-label={`Next photo in ${journey.title}`}
              onClick={() => changeSlide(1)}
            >
              <ArrowIcon direction="next" />
            </button>
            <span className="journey__counter" aria-hidden="true">
              {String(normalizedIndex + 1).padStart(2, '0')} / {String(journey.slides.length).padStart(2, '0')}
            </span>
            <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
              Photo {normalizedIndex + 1} of {journey.slides.length}: {activeSlide.alt}
            </span>
          </>
        )}
      </figure>

      <div className="journey__copy">
        <p className="item-number">Journey idea / {journey.number}</p>
        <h3 id={headingId}>{journey.title}</h3>
        <p className="journey__description" key={activeSlide.copy}>
          {activeSlide.copy}
        </p>
      </div>
    </article>
  )
}
