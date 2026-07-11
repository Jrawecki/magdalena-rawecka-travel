/**
 * Replace the placeholder values below before launch.
 * All footer contact links read from this single object.
 */
export const CONTACT = {
  email: 'EMAIL_ADDRESS_PLACEHOLDER',
  emailLabel: 'Email address',
  phone: 'PHONE_NUMBER_PLACEHOLDER',
  phoneLabel: 'Phone number',
  whatsapp: 'WHATSAPP_NUMBER_PLACEHOLDER',
  whatsappLabel: 'WhatsApp number',
} as const

export const EMAIL_LINK = 'mailto:' + CONTACT.email
export const PHONE_LINK = 'tel:' + CONTACT.phone
export const WHATSAPP_LINK = 'https://wa.me/' + CONTACT.whatsapp
