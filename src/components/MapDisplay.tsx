import React, { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { chart_global_danger_Color_100 } from '@patternfly/react-tokens'
import './MapDisplay.css'

const LIGHT_RED = chart_global_danger_Color_100.value

interface MapsListType {
  [id: string]: mapboxgl.Map;
}
const mapsList: MapsListType = {}

export const addMarkerToMap = (
  mapId: string,
  lngLat: [number, number]
): void => {
  new mapboxgl.Marker({ color: LIGHT_RED })
    .setLngLat(lngLat)
    .addTo(mapsList[mapId])
}

interface MapDisplayProps {
  id: string;
  latitude: string;
  longitude: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ id, latitude, longitude }) => {
  useEffect(() => {
    const lngLat = [Number(longitude), Number(latitude)] as [number, number]
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''
    const map = new mapboxgl.Map({
      container: id,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: lngLat,
      zoom: 10
    })
    mapsList[id] = map
    addMarkerToMap(id, lngLat)
  }, [id, latitude, longitude])
  return <div className="map" id={id}></div>
}

export default MapDisplay
