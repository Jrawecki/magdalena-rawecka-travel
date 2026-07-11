// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { JourneyAlbum, type Journey } from './JourneyAlbum'

const journey: Journey = {
  number: '01',
  title: 'A slower Mediterranean',
  className: 'journey journey--one',
  slides: [
    { image: '/one.jpg', alt: 'First coastal view', copy: 'First description.' },
    { image: '/two.jpg', alt: 'Second coastal view', copy: 'Second description.' },
    { image: '/three.jpg', alt: 'Third coastal view', copy: 'Third description.' },
  ],
}

afterEach(() => cleanup())

describe('JourneyAlbum', () => {
  it('changes the photo, alt text, description and count while keeping the title stable', async () => {
    const user = userEvent.setup()
    render(<JourneyAlbum journey={journey} />)

    const title = screen.getByRole('heading', { name: journey.title })
    expect(screen.getByRole('img', { name: 'First coastal view' }).getAttribute('src')).toBe('/one.jpg')
    expect(screen.getByText('First description.')).toBeTruthy()
    expect(screen.getByText('01 / 03')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: `Next photo in ${journey.title}` }))

    expect(screen.getByRole('img', { name: 'Second coastal view' }).getAttribute('src')).toBe('/two.jpg')
    expect(screen.getByText('Second description.')).toBeTruthy()
    expect(screen.getByText('02 / 03')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toContain('Photo 2 of 3: Second coastal view')
    expect(screen.getByRole('heading', { name: journey.title })).toBe(title)
    expect(screen.getByText('Journey idea / 01')).toBeTruthy()
  })

  it('wraps from the first photo to the last and from the last photo to the first', async () => {
    const user = userEvent.setup()
    render(<JourneyAlbum journey={journey} />)

    await user.click(screen.getByRole('button', { name: `Previous photo in ${journey.title}` }))
    expect(screen.getByRole('img', { name: 'Third coastal view' })).toBeTruthy()
    expect(screen.getByText('Third description.')).toBeTruthy()
    expect(screen.getByText('03 / 03')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: `Next photo in ${journey.title}` }))
    expect(screen.getByRole('img', { name: 'First coastal view' })).toBeTruthy()
    expect(screen.getByText('First description.')).toBeTruthy()
    expect(screen.getByText('01 / 03')).toBeTruthy()
  })

  it('keeps each journey album on its own active photo', async () => {
    const user = userEvent.setup()
    const secondJourney: Journey = {
      ...journey,
      number: '02',
      title: 'A winter escape in the Alps',
      slides: [
        { image: '/alps-1.jpg', alt: 'Alpine view 1', copy: 'Alpine description 1.' },
        { image: '/alps-2.jpg', alt: 'Alpine view 2', copy: 'Alpine description 2.' },
        { image: '/alps-3.jpg', alt: 'Alpine view 3', copy: 'Alpine description 3.' },
      ],
    }

    render(
      <>
        <JourneyAlbum journey={journey} />
        <JourneyAlbum journey={secondJourney} />
      </>,
    )

    const [firstAlbum, secondAlbum] = screen.getAllByRole('article')
    await user.click(within(firstAlbum).getByRole('button', { name: `Next photo in ${journey.title}` }))

    expect(within(firstAlbum).getByRole('img', { name: 'Second coastal view' })).toBeTruthy()
    expect(within(secondAlbum).getByRole('img', { name: 'Alpine view 1' })).toBeTruthy()
  })

  it('supports scoped arrow-key navigation and keeps focus on the control', async () => {
    const user = userEvent.setup()
    render(<JourneyAlbum journey={journey} />)

    const nextButton = screen.getByRole('button', { name: `Next photo in ${journey.title}` })
    nextButton.focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('img', { name: 'Second coastal view' })).toBeTruthy()
    expect(document.activeElement).toBe(nextButton)

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('img', { name: 'First coastal view' })).toBeTruthy()
    expect(document.activeElement).toBe(nextButton)

    fireEvent.keyDown(nextButton, { key: 'ArrowRight', altKey: true })
    expect(screen.getByRole('img', { name: 'First coastal view' })).toBeTruthy()
  })

  it('normalizes the active photo and omits controls when an album is reduced to one photo', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<JourneyAlbum journey={journey} />)

    await user.click(screen.getByRole('button', { name: `Previous photo in ${journey.title}` }))
    expect(screen.getByRole('img', { name: 'Third coastal view' })).toBeTruthy()

    rerender(<JourneyAlbum journey={{ ...journey, slides: [journey.slides[0]] }} />)

    expect(screen.getByRole('img', { name: 'First coastal view' })).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByText('01 / 01')).toBeNull()
  })
})
