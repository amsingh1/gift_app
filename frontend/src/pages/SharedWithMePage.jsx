import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Gift, ChevronRight, Calendar } from 'lucide-react';
import { getSharedWithMe } from '../services/api';
import './SharedWithMePage.css';

export default function SharedWithMePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSharedWithMe()
      .then((data) => setEvents(data.events))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-muted" style={{ padding: '60px 0' }}>Loading shared wishlists...</div>;
  }

  return (
    <div className="shared-page">
      <div className="page-header">
        <div>
          <h1>Shared With Me</h1>
          <p className="text-muted">Wishlists from friends and family</p>
        </div>
      </div>

      <div className="shared-grid">
        {events.map((event) => (
          <div key={event.id} className="shared-card card" onClick={() => navigate(`/event/${event.id}`)}>
            <div className="card-body">
              <div className="shared-card-top">
                <div className="shared-owner-avatar">
                  {(event.owner?.displayName || event.owner?.username || '?').charAt(0).toUpperCase()}
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
              <h3 className="event-name">{event.name}</h3>
              <p className="shared-owner-name">
                By {event.owner?.displayName || event.owner?.username}
              </p>
              <div className="event-meta">
                <span className="badge badge-primary">
                  <Gift size={12} style={{ marginRight: 4 }} />
                  {event.giftCount} {event.giftCount === 1 ? 'gift' : 'gifts'}
                </span>
                {event.eventDate && (
                  <span className="event-date">
                    <Calendar size={12} style={{ marginRight: 4 }} />
                    {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <Users size={48} />
            <h3>Nothing shared yet</h3>
            <p>When someone shares a wishlist with you, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
