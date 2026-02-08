import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Gift, ChevronRight, Star } from 'lucide-react';
import { getEvents, createEvent } from '../services/api';
import Modal from '../components/Modal';
import './DashboardPage.css';

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', eventDate: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createEvent(newEvent);
      setShowCreateModal(false);
      setNewEvent({ name: '', description: '', eventDate: '' });
      fetchEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted" style={{ padding: '60px 0' }}>Loading your wishlists...</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>My Wishlists</h1>
          <p className="text-muted">Manage your gift lists and occasions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          New List
        </button>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card card" onClick={() => navigate(`/event/${event.id}`)}>
            <div className="card-body">
              <div className="event-card-header">
                <div className="event-icon" style={{ background: event.isDefault ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'linear-gradient(135deg, var(--secondary), #d97706)' }}>
                  {event.isDefault ? <Star size={20} /> : <Calendar size={20} />}
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
              <h3 className="event-name">{event.name}</h3>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              <div className="event-meta">
                <span className="badge badge-primary">
                  <Gift size={12} style={{ marginRight: 4 }} />
                  {event.giftCount} {event.giftCount === 1 ? 'gift' : 'gifts'}
                </span>
                {event.eventDate && (
                  <span className="event-date">
                    {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <Gift size={48} />
            <h3>No wishlists yet</h3>
            <p>Create your first wishlist to start adding gifts</p>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} />
              Create Wishlist
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <Modal title="Create New Wishlist" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>List Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Birthday 2026, Christmas, Wedding"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                className="form-input"
                placeholder="What's this list for?"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Event Date (optional)</label>
              <input
                type="date"
                className="form-input"
                value={newEvent.eventDate}
                onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
