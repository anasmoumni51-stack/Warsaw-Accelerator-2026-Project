import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Spinner from '../components/Spinner'
import { SalonEditProvider, useSalonEditContext } from '../components/SalonEditContext'
import { pinkPinIcon } from '../utils/mapIcons'
import { WARSAW_DISTRICTS, SERVICE_NAMES } from '../utils/constants'
import { useSalonEditor } from '../hooks/useSalonEditor'
import { getSalonById } from '../services/api'
import type { SalonDetail } from '../types'

interface SalonHeroProps {
  salon: SalonDetail
}

function SalonHero({ salon }: SalonHeroProps) {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-[14px] overflow-hidden mb-8">
      <img
        src={salon.imageUrl}
        alt={salon.name}
        width="1200"
        height="500"
        fetchPriority="high"
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function SalonInfo() {
  const { salon, isEditing, editedSalon, handleInputChange } = useSalonEditContext()
  if (!salon || (isEditing && !editedSalon)) return null
  const s = isEditing ? editedSalon! : salon

  return (
    <div className="bg-canvas border-[0.25px] border-hairline rounded-[14px] p-6">
      {isEditing ? (
        <input
          type="text"
          aria-label="Salon name"
          autoComplete="organization"
          maxLength={100}
          value={s.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full font-display text-[24px] md:text-[32px] lg:text-[36px] font-semibold text-ink mb-4 border-b-2 border-primary pb-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        />
      ) : (
        <h1 className="font-display text-[24px] md:text-[32px] lg:text-[36px] font-semibold text-ink mb-4" style={{ textWrap: 'balance' }}>{s.name}</h1>
      )}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8385C" stroke="#E8385C" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {isEditing ? (
            <>
              <input
                type="number"
                aria-label="Rating"
                min="0"
                max="5"
                step="0.1"
                value={s.rating || 0}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                className="font-body text-[16px] font-semibold text-ink border border-hairline rounded-[8px] px-2 py-1 w-16 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
              <span className="font-body text-[16px] text-muted">(
                <input
                  type="number"
                  aria-label="Review count"
                  min="0"
                  value={s.reviewCount || 0}
                  onChange={(e) => handleInputChange('reviewCount', parseInt(e.target.value))}
                  className="font-body text-[16px] text-muted border border-hairline rounded-[8px] px-2 py-1 w-20 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                /> reviews)
              </span>
            </>
          ) : (
            <>
              <span className="font-body text-[16px] font-semibold text-ink">{s.rating}</span>
              <span className="font-body text-[16px] text-muted">({s.reviewCount} reviews)</span>
            </>
          )}
        </div>
        <div className="w-1 h-1 rounded-full bg-hairline" />
        <div className="flex items-center gap-1.5 text-muted">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {isEditing ? (
            <select
              value={s.district}
              aria-label="District"
              onChange={(e) => handleInputChange('district', e.target.value)}
              className="font-body text-[16px] border border-hairline rounded-[8px] px-3 py-1.5 bg-canvas focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            >
              {WARSAW_DISTRICTS.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          ) : (
            <span className="font-body text-[16px]">{s.district}</span>
          )}
        </div>
      </div>
      {isEditing ? (
        <select
          value={s.priceRange}
          aria-label="Price range"
          onChange={(e) => handleInputChange('priceRange', e.target.value)}
          className="font-body text-[14px] font-medium text-primary border border-hairline rounded-[8px] px-3 py-2 bg-canvas focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer mt-2"
        >
          <option value="zł">zł</option>
          <option value="zł zł">zł zł</option>
          <option value="zł zł zł">zł zł zł</option>
        </select>
      ) : (
        <p className="font-body text-[14px] font-medium text-primary mt-2">{s.priceRange}</p>
      )}
    </div>
  )
}

function SalonServices() {
  const { salon, isEditing, editedSalon, handleServicesChange } = useSalonEditContext()
  if (!salon || (isEditing && !editedSalon)) return null
  const s = isEditing ? editedSalon! : salon

  return (
    <div className="bg-canvas border-[0.25px] border-hairline rounded-[14px] p-6">
      <h2 className="font-display text-[20px] font-semibold text-ink mb-4">Services offered</h2>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_NAMES.map(service => (
            <label key={service} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={s.services.includes(service)}
                onChange={(e) => handleServicesChange(service, e.target.checked)}
                className="w-5 h-5 rounded border-hairline text-primary focus:ring-primary cursor-pointer"
              />
              <span className="font-body text-[16px] text-body">{service}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {s.services.map((service) => (
            <span
              key={service}
              className="px-4 py-2 bg-primary-light rounded-full font-body text-[14px] font-medium text-primary"
            >
              {service}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SalonLocation() {
  const { salon, isEditing, editedSalon, handleInputChange } = useSalonEditContext()
  if (!salon || (isEditing && !editedSalon)) return null
  const s = isEditing ? editedSalon! : salon

  return (
    <div className="bg-canvas border-[0.25px] border-hairline rounded-[14px] p-6">
      <h2 className="font-display text-[20px] font-semibold text-ink mb-4">Location</h2>
      <div className="w-full h-[300px] rounded-[8px] overflow-hidden mb-4">
        <MapContainer
          center={[s.lat, s.lng]}
          zoom={15}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
          style={{ background: '#e8eff5' }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={[s.lat, s.lng]} icon={pinkPinIcon} />
        </MapContainer>
      </div>
      {isEditing ? (
        <div className="space-y-2 mt-2">
          <input
            type="text"
            aria-label="Address"
            autoComplete="street-address"
            name="address"
            spellCheck={false}
            value={s.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Street address"
            className="w-full font-body text-[14px] text-body border border-hairline rounded-[8px] px-3 py-2 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
          <input
            type="text"
            aria-label="Street number"
            autoComplete="off"
            name="streetNumber"
            spellCheck={false}
            value={s.streetNumber || ''}
            onChange={(e) => handleInputChange('streetNumber', e.target.value)}
            placeholder="Street number"
            className="w-full font-body text-[14px] text-body border border-hairline rounded-[8px] px-3 py-2 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              aria-label="City"
              autoComplete="address-level2"
              name="city"
              spellCheck={false}
              value={s.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
              className="w-full font-body text-[14px] text-body border border-hairline rounded-[8px] px-3 py-2 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
            <input
              type="text"
              aria-label="Postcode"
              autoComplete="postal-code"
              name="postcode"
              spellCheck={false}
              value={s.postcode || ''}
              onChange={(e) => handleInputChange('postcode', e.target.value)}
              placeholder="Postcode"
              className="w-full font-body text-[14px] text-body border border-hairline rounded-[8px] px-3 py-2 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </div>
          <input
            type="text"
            aria-label="Country"
            autoComplete="country-name"
            name="country"
            spellCheck={false}
            value={s.country || ''}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="Country"
            className="w-full font-body text-[14px] text-body border border-hairline rounded-[8px] px-3 py-2 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>
      ) : (
        <div className="mt-2 space-y-1">
          <p className="font-body text-[14px] text-body">{s.address}{s.streetNumber ? ` ${s.streetNumber}` : ''}</p>
          <p className="font-body text-[13px] text-muted">{[s.postcode, s.city].filter(Boolean).join(', ')}{s.country ? `, ${s.country}` : ''}</p>
        </div>
      )}
    </div>
  )
}

function SalonContact() {
  const { salon, isEditing, editedSalon, handleInputChange } = useSalonEditContext()
  if (!salon || (isEditing && !editedSalon)) return null
  const s = isEditing ? editedSalon! : salon

  return (
    <div className="bg-canvas border-[0.25px] border-hairline rounded-[14px] p-6">
      <h2 className="font-display text-[20px] font-semibold text-ink mb-4">Contact</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {isEditing ? (
            <input
              type="tel"
              inputMode="tel"
              aria-label="Phone number"
              autoComplete="tel"
              value={s.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="font-body text-[14px] text-body border border-hairline rounded-[8px] px-3 py-2 flex-1 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          ) : (
            <span className="font-body text-[14px] text-body">{s.phone}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {isEditing ? (
            <input
              type="url"
              inputMode="url"
              aria-label="Website"
              autoComplete="url"
              value={s.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="font-body text-[14px] text-body border border-hairline rounded-[8px] px-3 py-2 flex-1 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          ) : (
            <span className="font-body text-[14px] text-body truncate">{s.website}</span>
          )}
        </div>
      </div>
    </div>
  )
}

interface SalonDetailContentProps {
  isEditing: boolean
  isSaving: boolean
  displaySalon: SalonDetail | null
  handleEdit: () => void
  handleSave: () => void
  handleCancel: () => void
}

function SalonDetailContent({ isEditing, isSaving, displaySalon, handleEdit, handleSave, handleCancel }: SalonDetailContentProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar activeItem={isEditing ? 'Edit Salons' : 'About'} />

      {/* Header bar */}
      <div className="border-b border-hairline bg-canvas px-4 md:px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="font-body text-[14px] font-medium">Back to salons</span>
          </Link>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-[8px] font-body text-[14px] font-semibold cursor-pointer transition-colors duration-200"
            >
              Edit Salon
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2.5 border border-hairline text-body rounded-[8px] font-body text-[14px] font-medium hover:border-primary cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-[8px] font-body text-[14px] font-semibold cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 py-10">
        <div className="max-w-[1200px] mx-auto">
          {displaySalon && <SalonHero salon={displaySalon} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SalonInfo />
              <SalonServices />
            </div>

            <div className="space-y-6">
              <SalonLocation />
              <SalonContact />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

interface SalonDetailPageProps {
  onUpdateSalon: (salon: SalonDetail) => Promise<void>
}

export default function SalonDetailPage({ onUpdateSalon }: SalonDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const [salon, setSalon] = useState<SalonDetail | null>(null)
  const [loadedId, setLoadedId] = useState<string | undefined>(undefined)
  const loading = loadedId !== id

  useEffect(() => {
    let cancelled = false
    getSalonById(id!)
      .then(data => { if (!cancelled) setSalon(data) })
      .catch(() => { if (!cancelled) setSalon(null) })
      .finally(() => { if (!cancelled) setLoadedId(id) })
    return () => { cancelled = true }
  }, [id])

  const handleUpdateSalon = async (updatedSalon: SalonDetail) => {
    await onUpdateSalon(updatedSalon)
    const refreshedSalon = await getSalonById(id!)
    setSalon(refreshedSalon)
  }

  const editor = useSalonEditor(salon, handleUpdateSalon)

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-canvas px-6 py-10">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="font-display text-[32px] font-semibold text-ink mb-4">Salon not found</h1>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-[8px] font-body text-[14px] font-semibold cursor-pointer transition-colors duration-200"
          >
            Back to salons
          </Link>
        </div>
      </div>
    )
  }

  return (
    <SalonEditProvider value={{
      salon: editor.displaySalon,
      isEditing: editor.isEditing,
      editedSalon: editor.editedSalon,
      handleInputChange: editor.handleInputChange,
      handleServicesChange: editor.handleServicesChange,
    }}>
      <SalonDetailContent
        isEditing={editor.isEditing}
        isSaving={editor.isSaving}
        displaySalon={editor.displaySalon}
        handleEdit={editor.handleEdit}
        handleSave={editor.handleSave}
        handleCancel={editor.handleCancel}
      />
    </SalonEditProvider>
  )
}
