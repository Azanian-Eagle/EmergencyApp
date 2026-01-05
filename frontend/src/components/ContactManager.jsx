import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Phone, Mail } from 'lucide-react';

const ContactList = React.memo(({ contacts }) => {
  return (
    <div className="space-y-3 mb-6">
      {contacts.length === 0 && <p className="text-gray-500 italic">No contacts added yet.</p>}
      {contacts.map((contact) => (
        <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
          <div>
            <p className="font-semibold">{contact.name}</p>
            <div className="text-sm text-gray-600 flex flex-col">
              {contact.phone && <span className="flex items-center"><Phone size={12} className="mr-1"/> {contact.phone}</span>}
              {contact.email && <span className="flex items-center"><Mail size={12} className="mr-1"/> {contact.email}</span>}
            </div>
          </div>
          {/* In a real app we'd add delete functionality */}
          {/* <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button> */}
        </div>
      ))}
    </div>
  );
});

ContactList.displayName = 'ContactList';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('/api/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contacts', newContact);
      setNewContact({ name: '', phone: '', email: '' });
      fetchContacts();
    } catch (err) {
      alert('Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Emergency Contacts</h2>

      {/* List */}
      <ContactList contacts={contacts} />

      {/* Add Form */}
      <form onSubmit={handleAddContact} className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-gray-700">Add New Contact</h3>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={newContact.phone}
          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-2 border rounded"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          {loading ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
    </div>
  );
};

export default ContactManager;
