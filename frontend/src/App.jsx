import React from 'react';
import EmergencyButton from './components/EmergencyButton';
import ContactManager from './components/ContactManager';
import { Shield } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Azanian Eagle</h1>
        </div>
        <p className="text-gray-600">Emergency Alert System</p>
      </header>

      <main className="w-full flex flex-col items-center px-4 gap-8">
        <EmergencyButton />
        <ContactManager />
      </main>

      <footer className="mt-auto py-6 text-gray-500 text-sm text-center">
        <p>A non-profit mission to fight GBV and Femicide.</p>
        <p>&copy; {new Date().getFullYear()} Azanian Eagle</p>
      </footer>
    </div>
  );
}

export default App;
