import '../index.css';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Map from './Map';
import Card from './Card';
import Modal from './Modal';

function Homepage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [rangeValue, setRangeValue] = useState(0.5);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAllow = () => {
    setShowModal(false);
    getGeolocation();
  };

  const handleDeny = () => {
    setShowModal(false);
  };

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(newCoordinates);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleCenter = () => {
    getGeolocation();
  };

  const handleSearch = (placeId) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const newCoordinates = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setCoordinates(newCoordinates);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 flex-grow p-4 gap-4">
        <div className="row-span-1 md:col-span-1 h-5/6 md:h-auto sticky top-0 md:relative">
          <Map coordinates={coordinates} setCoordinates={setCoordinates} range={rangeValue} />
        </div>
        <div className="row-span-1 md:col-span-1 h-full scrollable">
          <Card rangeValue={rangeValue} setRangeValue={setRangeValue} onSearch={handleSearch} onCenter={handleCenter} darkMode={darkMode} />
        </div>
      </div>
      <Modal showModal={showModal} handleAllow={handleAllow} handleDeny={handleDeny} />
    </div>
  );
}

export default Homepage;
