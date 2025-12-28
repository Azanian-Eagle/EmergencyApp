import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const EmergencyButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleEmergency = async () => {
    setLoading(true);
    setStatus('Initializing...');
    setError('');

    try {
      // 1. Get Location
      setStatus('Acquiring Location...');
      const location = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) reject('Geolocation not supported');
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err.message),
          { enableHighAccuracy: true, timeout: 5000 }
        );
      });

      // 2. Get Audio/Video (Mocking implementation for now as getUserMedia requires HTTPS or localhost)
      setStatus('Recording Environment...');
      // In a real implementation with HTTPS:
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: "environment" } });
      // Record for 5-10 seconds...
      // For this demo, we'll just send metadata saying we tried.
      const mediaData = { audio: 'mock_audio_blob', video: 'mock_video_blob' };

      // 3. Send Alert
      setStatus('Sending Alert...');
      await axios.post('/api/alert', {
        location,
        media: mediaData,
        timestamp: new Date().toISOString()
      });

      setStatus('Alert Sent! Help is on the way.');
    } catch (err) {
      console.error(err);
      setError('Failed to send alert: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={handleEmergency}
        disabled={loading}
        className={`
          w-64 h-64 rounded-full border-8 border-red-600 bg-red-500
          text-white font-bold text-3xl shadow-xl transform transition-transform
          active:scale-95 flex flex-col items-center justify-center
          ${loading ? 'opacity-80' : 'hover:bg-red-600'}
        `}
      >
        {loading ? (
          <Loader className="animate-spin w-16 h-16" />
        ) : (
          <AlertCircle className="w-24 h-24 mb-2" />
        )}
        {loading ? 'SENDING...' : 'EMERGENCY'}
      </button>

      {status && <p className="mt-4 text-xl font-semibold text-gray-800">{status}</p>}
      {error && <p className="mt-4 text-red-600 font-bold">{error}</p>}

      <p className="mt-6 text-sm text-gray-500 text-center max-w-xs">
        Pressing this button will capture your location, audio, and video and notify your emergency contacts.
      </p>
    </div>
  );
};

export default EmergencyButton;
