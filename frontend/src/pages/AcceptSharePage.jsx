import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Gift, Check, AlertCircle } from 'lucide-react';
import { acceptShareLink } from '../services/api';

export default function AcceptSharePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    acceptShareLink(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message);
        setEventId(data.event?.id);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
      });
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div className="card-body" style={{ padding: 40 }}>
          {status === 'loading' && (
            <>
              <Gift size={40} style={{ color: 'var(--primary)', marginBottom: 16 }} />
              <h2 style={{ marginBottom: 8 }}>Joining wishlist...</h2>
              <p className="text-muted">Please wait</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Check size={28} style={{ color: 'var(--success)' }} />
              </div>
              <h2 style={{ marginBottom: 8 }}>{message}</h2>
              <p className="text-muted" style={{ marginBottom: 20 }}>You can now view and reserve gifts from this wishlist.</p>
              {eventId ? (
                <button className="btn btn-primary btn-lg" onClick={() => navigate(`/event/${eventId}`)}>
                  View Wishlist
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/shared')}>
                  Go to Shared Lists
                </button>
              )}
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <AlertCircle size={28} style={{ color: 'var(--danger)' }} />
              </div>
              <h2 style={{ marginBottom: 8 }}>Unable to join</h2>
              <p className="text-muted" style={{ marginBottom: 20 }}>{message}</p>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
