import React from 'react'
import { getTranslation } from '../../dist'

// Example React component using teatag for i18n

interface UserProfileProps {
  name: string
  email: string
  age: number
  locale: string
}

export function UserProfile({ name, email, age, locale }: UserProfileProps) {
  const t = getTranslation(locale)

  return (
    <div className="user-profile">
      <h1>{t`User Profile`}</h1>

      <div className="user-info">
        <p>
          <strong>{t`Name:`}</strong> {name}
        </p>
        <p>
          <strong>{t`Email:`}</strong> {email}
        </p>
        <p>
          <strong>{t`Age:`}</strong> {t`${age} years old`}
        </p>
      </div>

      <div className="actions">
        <button>{t`Edit Profile`}</button>
        <button>{t`Delete Account`}</button>
      </div>

      <div className="welcome-message">
        {t`Welcome, ${name}! You have ${getUnreadCount()} unread messages.`}
      </div>
    </div>
  )
}

// Helper function that would be extracted by teatag
function getUnreadCount(): number {
  return 5 // Mock implementation
}

// Language switcher component
interface LanguageSwitcherProps {
  currentLocale: string
  onLocaleChange: (locale: string) => void
}

export function LanguageSwitcher({
  currentLocale,
  onLocaleChange,
}: LanguageSwitcherProps) {
  const t = getTranslation(currentLocale)

  const locales = [
    { code: 'en', name: t`English` },
    { code: 'ja', name: t`Japanese` },
    { code: 'fr', name: t`French` },
    { code: 'es', name: t`Spanish` },
  ]

  return (
    <div className="language-switcher">
      <label>{t`Language:`}</label>
      <select
        value={currentLocale}
        onChange={(e) => onLocaleChange(e.target.value)}
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.name}
          </option>
        ))}
      </select>
    </div>
  )
}
