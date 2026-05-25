import { memo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { pinkPinIcon } from '../utils/mapIcons'
import type { SalonSummary } from '../types'

function ZoomControls() {
  const map = useMap()

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col">
      <button
        onClick={() => map.zoomIn()}
        className="bg-canvas border border-hairline w-9 h-9 flex items-center justify-center rounded-t-[8px] text-[18px] text-body cursor-pointer hover:bg-surface-soft transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Zoom in"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-canvas border border-t-0 border-hairline w-9 h-9 flex items-center justify-center rounded-b-[8px] text-[18px] text-body cursor-pointer hover:bg-surface-soft transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Zoom out"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  )
}

interface FlyToSalonProps {
  salon: SalonSummary | null
}

function FlyToSalon({ salon }: FlyToSalonProps) {
  const map = useMap()
  useEffect(() => {
    if (!salon) return
    map.flyTo([salon.lat, salon.lng], 15, { duration: 1.2 })
    const onMoveEnd = () => {
      map.eachLayer(layer => {
        if (layer instanceof L.Marker && layer.getLatLng().equals([salon.lat, salon.lng])) {
          layer.openPopup()
        }
      })
      map.off('moveend', onMoveEnd)
    }
    map.on('moveend', onMoveEnd)
    return () => { map.off('moveend', onMoveEnd) }
  }, [salon, map])
  return null
}

interface MapPanelProps {
  salons: SalonSummary[]
  selectedSalonId: number | null
}

export default memo(function MapPanel({ salons, selectedSalonId }: MapPanelProps) {
  const center: [number, number] = [52.2297, 21.0122]
  const zoom = 12
  const selectedSalon = salons.find(s => s.id === selectedSalonId) || null

  return (
    <div className="w-full h-full">
      <div className="border-[0.25px] border-hairline rounded-[14px] overflow-hidden relative h-full">
        <MapContainer
          center={center}
          zoom={zoom}
          zoomControl={false}
          attributionControl={true}
          className="w-full h-full"
          style={{ background: '#e8eff5' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {salons.map((salon) => (
            <Marker
              key={salon.id}
              position={[salon.lat, salon.lng]}
              icon={pinkPinIcon}
            >
              <Popup>
                <strong>{salon.name}</strong>
                <br />
                {salon.rating} ★ ({salon.reviewCount})
              </Popup>
            </Marker>
          ))}
          <ZoomControls />
          <FlyToSalon salon={selectedSalon} />
        </MapContainer>
      </div>
    </div>
  )
})
