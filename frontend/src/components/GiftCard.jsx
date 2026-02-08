import { ExternalLink, BookmarkPlus, BookmarkCheck, Trash2, Edit, DollarSign } from 'lucide-react';
import './GiftCard.css';

export default function GiftCard({ gift, isOwner, currentUserId, onReserve, onEdit, onDelete }) {
  const isReservedByMe = gift.reservedByUserId === currentUserId;

  return (
    <div className={`gift-card card ${gift.reserved ? 'gift-reserved' : ''}`}>
      {gift.imageLink && (
        <div className="gift-image">
          <img
            src={gift.imageLink}
            alt={gift.giftName}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="gift-content">
        <div className="gift-header">
          <h3 className="gift-name">{gift.giftName}</h3>
          <div className="gift-badges">
            {gift.priority === 'high' && <span className="badge badge-danger">High</span>}
            {gift.priority === 'low' && <span className="badge badge-warning">Low</span>}
            {gift.reserved && isOwner && (
              <span className="badge badge-success">Reserved</span>
            )}
          </div>
        </div>

        {gift.description && (
          <p className="gift-description">{gift.description}</p>
        )}

        {gift.price && (
          <div className="gift-price">
            <DollarSign size={14} />
            <span>{Number(gift.price).toFixed(2)}</span>
          </div>
        )}

        <div className="gift-actions">
          {gift.giftLink && (
            <a href={gift.giftLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
              <ExternalLink size={14} />
              View
            </a>
          )}

          {!isOwner && (
            <button
              className={`btn btn-sm ${gift.reserved && isReservedByMe ? 'btn-success' : gift.reserved ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => onReserve(gift.id)}
              disabled={gift.reserved && !isReservedByMe}
            >
              {gift.reserved && isReservedByMe ? (
                <><BookmarkCheck size={14} /> Unreserve</>
              ) : gift.reserved ? (
                <><BookmarkCheck size={14} /> Reserved</>
              ) : (
                <><BookmarkPlus size={14} /> Reserve</>
              )}
            </button>
          )}

          {isOwner && (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => onEdit(gift)}>
                <Edit size={14} />
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(gift)}>
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
