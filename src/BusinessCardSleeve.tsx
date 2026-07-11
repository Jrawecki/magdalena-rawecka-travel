import { useState, type KeyboardEvent } from 'react'

export function BusinessCardSleeve() {
  const [isOpen, setIsOpen] = useState(false)

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <figure className="card-presentation">
      <button
        className="card-presentation__control"
        type="button"
        aria-label={`${isOpen ? 'Return' : 'Reveal'} Magdalena Rawecka's business card`}
        aria-pressed={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className="card-presentation__stage" aria-hidden="true">
          <span className="card-sleeve card-sleeve--back" />
          <span className="sleeved-card">
            <span className="sleeved-card__name">Magdalena Rawecka</span>
            <span className="sleeved-card__role">Private Travel &amp; Hospitality</span>
          </span>
          <span className="card-sleeve card-sleeve--front">
            <span className="card-sleeve__monogram">MR</span>
          </span>
        </span>
      </button>
      <figcaption className="card-presentation__caption">
        <span>Business card / sleeve study</span>
        <span>{isOpen ? 'Press to return' : 'Hover or press to reveal'} <span aria-hidden="true">&rarr;</span></span>
      </figcaption>
    </figure>
  )
}
