import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Share2, Trash2, Edit, Users, Copy, Check, Link2, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getEvent, createGift, updateGift, deleteGift, reserveGift,
  createShareLink, deleteEvent, updateEvent, getEventMembers, removeEventMember
} from '../services/api';
import GiftCard from '../components/GiftCard';
import Modal from '../components/Modal';
import './EventDetailPage.css';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [editingGift, setEditingGift] = useState(null);

  // Form states
  const [giftForm, setGiftForm] = useState({ giftName: '', giftLink: '', imageLink: '', description: '', price: '', priority: 'medium' });
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState([]);
  const [eventForm, setEventForm] = useState({ name: '', description: '', eventDate: '' });
  const [saving, setSaving] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const data = await getEvent(id);
      setEvent(data.event);
      setEventForm({
        name: data.event.name,
        description: data.event.description || '',
        eventDate: data.event.eventDate || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleCreateGift = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...giftForm,
        eventId: parseInt(id),
        price: giftForm.price ? parseFloat(giftForm.price) : null,
      };
      if (editingGift) {
        await updateGift(editingGift.id, payload);
      } else {
        await createGift(payload);
      }
      setShowGiftModal(false);
      setEditingGift(null);
      setGiftForm({ giftName: '', giftLink: '', imageLink: '', description: '', price: '', priority: 'medium' });
      fetchEvent();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setGiftForm({
      giftName: gift.giftName,
      giftLink: gift.giftLink || '',
      imageLink: gift.imageLink || '',
      description: gift.description || '',
      price: gift.price || '',
      priority: gift.priority || 'medium',
    });
    setShowGiftModal(true);
  };

  const handleDeleteGift = async (gift) => {
    try {
      await deleteGift(gift.id);
      setShowDeleteConfirm(null);
      fetchEvent();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReserve = async (giftId) => {
    try {
      await reserveGift(giftId);
      fetchEvent();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShare = async () => {
    try {
      const data = await createShareLink(parseInt(id), 30);
      const link = `${window.location.origin}/share/${data.shareLink.token}`;
      setShareLink(link);
      setShowShareModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEvent(id, eventForm);
      setShowEditEvent(false);
      fetchEvent();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleShowMembers = async () => {
    try {
      const data = await getEventMembers(id);
      setMembers(data.members);
      setShowMembers(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeEventMember(id, userId);
      const data = await getEventMembers(id);
      setMembers(data.members);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center text-muted" style={{ padding: '60px 0' }}>Loading...</div>;
  }

  if (!event) {
    return (
      <div className="text-center" style={{ padding: '60px 0' }}>
        <h3>Event not found</h3>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isOwner = event.isOwner;
  const gifts = event.gifts || [];

  return (
    <div className="event-detail">
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        <ArrowLeft size={18} /> Back
      </button>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="event-detail-header">
        <div>
          <h1>{event.name}</h1>
          {event.description && <p className="text-muted">{event.description}</p>}
          {event.eventDate && (
            <p className="text-muted" style={{ fontSize: 13 }}>
              {new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          {!isOwner && event.owner && (
            <p className="text-muted" style={{ fontSize: 13 }}>
              By {event.owner.displayName || event.owner.username}
            </p>
          )}
        </div>
        <div className="event-detail-actions">
          {isOwner && (
            <>
              <button className="btn btn-primary" onClick={() => { setEditingGift(null); setGiftForm({ giftName: '', giftLink: '', imageLink: '', description: '', price: '', priority: 'medium' }); setShowGiftModal(true); }}>
                <Plus size={18} /> Add Gift
              </button>
              <button className="btn btn-secondary" onClick={handleShare}>
                <Share2 size={18} /> Share
              </button>
              <button className="btn btn-ghost btn-icon" onClick={handleShowMembers} title="Members">
                <Users size={18} />
              </button>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowEditEvent(true)} title="Settings">
                <Settings size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="gifts-grid">
        {gifts.map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            isOwner={isOwner}
            currentUserId={user?.id}
            onReserve={handleReserve}
            onEdit={handleEditGift}
            onDelete={(g) => setShowDeleteConfirm(g)}
          />
        ))}

        {gifts.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <h3>{isOwner ? 'No gifts yet' : 'No gifts in this list'}</h3>
            <p>{isOwner ? 'Start adding gifts to your wishlist' : 'Check back later for new items'}</p>
            {isOwner && (
              <button className="btn btn-primary" onClick={() => { setEditingGift(null); setGiftForm({ giftName: '', giftLink: '', imageLink: '', description: '', price: '', priority: 'medium' }); setShowGiftModal(true); }}>
                <Plus size={18} /> Add Your First Gift
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Gift Modal */}
      {showGiftModal && (
        <Modal
          title={editingGift ? 'Edit Gift' : 'Add Gift'}
          onClose={() => { setShowGiftModal(false); setEditingGift(null); }}
        >
          <form onSubmit={handleCreateGift}>
            <div className="form-group">
              <label>Gift Name *</label>
              <input type="text" className="form-input" placeholder="e.g., Wireless headphones" value={giftForm.giftName} onChange={(e) => setGiftForm({ ...giftForm, giftName: e.target.value })} required autoFocus />
            </div>
            <div className="form-group">
              <label>Link (optional)</label>
              <input type="url" className="form-input" placeholder="https://example.com/product" value={giftForm.giftLink} onChange={(e) => setGiftForm({ ...giftForm, giftLink: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Image URL (optional)</label>
              <input type="url" className="form-input" placeholder="https://example.com/image.jpg" value={giftForm.imageLink} onChange={(e) => setGiftForm({ ...giftForm, imageLink: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea className="form-input" placeholder="Any details or preferences..." value={giftForm.description} onChange={(e) => setGiftForm({ ...giftForm, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Price (optional)</label>
                <input type="number" className="form-input" placeholder="0.00" step="0.01" min="0" value={giftForm.price} onChange={(e) => setGiftForm({ ...giftForm, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-input" value={giftForm.priority} onChange={(e) => setGiftForm({ ...giftForm, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowGiftModal(false); setEditingGift(null); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingGift ? 'Update' : 'Add Gift'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <Modal title="Share Wishlist" onClose={() => setShowShareModal(false)}>
          <p style={{ marginBottom: 16, fontSize: 14, color: 'var(--gray-600)' }}>
            Share this link with friends and family so they can see your wishlist and reserve gifts.
          </p>
          <div className="share-link-box">
            <Link2 size={16} />
            <input type="text" className="form-input" value={shareLink} readOnly />
            <button className="btn btn-primary btn-sm" onClick={handleCopyLink}>
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--gray-400)' }}>
            Link expires in 30 days. Recipients need an account to view and reserve gifts.
          </p>
        </Modal>
      )}

      {/* Delete Gift Confirm */}
      {showDeleteConfirm && (
        <Modal title="Delete Gift" onClose={() => setShowDeleteConfirm(null)}>
          <p>Are you sure you want to delete <strong>{showDeleteConfirm.giftName}</strong>?</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDeleteGift(showDeleteConfirm)}>Delete</button>
          </div>
        </Modal>
      )}

      {/* Edit Event Modal */}
      {showEditEvent && (
        <Modal title="Edit Wishlist" onClose={() => setShowEditEvent(false)}>
          <form onSubmit={handleUpdateEvent}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Event Date</label>
              <input type="date" className="form-input" value={eventForm.eventDate} onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 8 }}>
              {!event.isDefault && (
                <button type="button" className="btn btn-danger btn-sm" onClick={handleDeleteEvent}>
                  <Trash2 size={14} /> Delete List
                </button>
              )}
              <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditEvent(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Members Modal */}
      {showMembers && (
        <Modal title="Shared With" onClose={() => setShowMembers(false)}>
          {members.length === 0 ? (
            <div className="text-center text-muted" style={{ padding: 20 }}>
              <p>No one has joined this list yet.</p>
              <p style={{ fontSize: 13 }}>Share the link to invite people.</p>
            </div>
          ) : (
            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar">
                    {(member.displayName || member.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.displayName || member.username}</span>
                    <span className="member-username">@{member.username}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleRemoveMember(member.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
