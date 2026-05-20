import L from 'leaflet'

export const pinkPinIcon = L.divIcon({
  className: 'custom-pin',
  html: `
    <div style="position: relative; width: 28px; height: 28px;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 32px; height: 32px; background: rgba(232, 56, 92, 0.12); border-radius: 50%;"></div>
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); width: 14px; height: 14px; background: #E8385C; border: 2px solid #FFFFFF; border-radius: 50% 50% 50% 0; box-shadow: 0 2px 6px rgba(232, 56, 92, 0.3);"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
})
