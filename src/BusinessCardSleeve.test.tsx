// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { BusinessCardSleeve } from './BusinessCardSleeve'

afterEach(() => cleanup())

describe('BusinessCardSleeve', () => {
  it('reveals and returns the card with a press', async () => {
    const user = userEvent.setup()
    render(<BusinessCardSleeve />)

    const control = screen.getByRole('button', { name: "Reveal Magdalena Rawecka's business card" })
    expect(control.getAttribute('aria-pressed')).toBe('false')

    await user.click(control)
    expect(control.getAttribute('aria-pressed')).toBe('true')
    expect(control.getAttribute('aria-label')).toBe("Return Magdalena Rawecka's business card")
    expect(screen.getByText('Press to return')).toBeTruthy()

    await user.click(control)
    expect(control.getAttribute('aria-pressed')).toBe('false')
  })

  it('returns an open card to its sleeve with Escape', async () => {
    const user = userEvent.setup()
    render(<BusinessCardSleeve />)

    const control = screen.getByRole('button', { name: "Reveal Magdalena Rawecka's business card" })
    await user.click(control)
    await user.keyboard('{Escape}')

    expect(control.getAttribute('aria-pressed')).toBe('false')
    expect(control.getAttribute('aria-label')).toBe("Reveal Magdalena Rawecka's business card")
  })
})
