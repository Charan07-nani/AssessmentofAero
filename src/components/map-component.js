import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { pilotsData } from '../data/pilotsData';
import { haversineDistance } from '../utils/map-component.helper';
import './map-component.css';


const PilotLocator = () => {
    const [distance, setDistance] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [nearestPilots, setNearestPilots] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    }, []);

    const findNearestPilots = () => {
        if (!userLocation) return;

        const filteredPilots = pilotsData
            .map(pilot => ({
                ...pilot,
                distance: haversineDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    pilot.latitude,
                    pilot.longitude
                )
            }))
            .filter(pilot => pilot.distance <= parseFloat(distance))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10);
         console.log(filteredPilots)   

        setNearestPilots(filteredPilots);
    };
    
    const userLocationIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41"><path d="M12 2C7.03 2 3 6.03 3 11s9 14 9 14 9-9 9-14S16.97 2 12 2zm0 16.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 13.5 12 13.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM12 5c-2.76 0-5 2.24-5 5s5 10 5 10 5-7.24 5-10-2.24-5-5-5z"/></svg>`;

    const adminLocationIcon = new L.Icon({
        iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const centerMap = () => {
        if (userLocation) {
            return [userLocation.latitude, userLocation.longitude];
        }
        return [0, 0];
    };

    return (
        <div>
            <div className='alignItems'>
                <h1>Drone Flying Pilots</h1>
                <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="Enter distance in km"
                /><br></br>
                <button onClick={findNearestPilots} className='buttonPilot'>Find Nearest Pilots</button>
            </div>

            {userLocation && (
                <MapContainer center={centerMap()} zoom={10} style={{ height: '500px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <Marker position={[userLocation.latitude, userLocation.longitude]} icon={adminLocationIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>
                    {nearestPilots.map((pilot, index) => (
                        <Marker
                            key={index}
                            position={[pilot.latitude, pilot.longitude]}
                            icon={userLocationIcon}
                        >
                            <Popup>
                                {pilot.name} <br /> 
                                {pilot.experience_years} years of experience<br/>
                                {pilot.distance.toFixed(2)} km away
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </div>
    );
};

export default PilotLocator;
