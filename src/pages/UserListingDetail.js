/**
 * UserListingDetail page
 * - Public route that shows a full-page view of a user-created listing.
 * - Fetches detail from `GET /userlistings/:id` (with fallback to `GET /userlistings`).
 */
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../componets/NavBar/NavBar';
import Footer from '../componets/Footer/Footer';
import '../css/UserListingDetail.css';

const UserListingDetail = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [activeImg, setActiveImg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const cleanId = useMemo(() => listingId || '', [listingId]);

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true);
            setError('');
            try {
                let data = null;
                try {
                    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userlistings/${cleanId}`, { withCredentials: true });
                    data = resp.data;
                } catch (_) {
                    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userlistings`, { withCredentials: true });
                    const arr = resp.data || [];
                    data = arr.find(l => (l.listingId === cleanId));
                }
                if (!data) {
                    setError('Listing not found.');
                    setLoading(false);
                    return;
                }
                setListing(data);
                const imgs = Array.isArray(data.images) && data.images.length ? data.images : [data.picture].filter(Boolean);
                setActiveImg(imgs[0] || '');
                setLoading(false);
            } catch (err) {
                setError('Unable to load listing right now.');
                setLoading(false);
            }
        };
        fetchListing();
    }, [cleanId]);

    const images = useMemo(() => {
        if (!listing) return [];
        const arr = Array.isArray(listing.images) && listing.images.length ? listing.images : [];
        if (listing.picture) {
            if (!arr.includes(listing.picture)) {
                arr.unshift(listing.picture);
            }
        }
        return arr;
    }, [listing]);

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="detail-page">
                    <p className="status-text">Loading listing...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !listing) {
        return (
            <>
                <NavBar />
                <div className="detail-page">
                    <p className="status-text">{error || 'Listing not found.'}</p>
                    <button className="ghost-btn" onClick={() => navigate('/')}>Back to Listings</button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="detail-page">
                <div className="detail-header">
                    <div>
                        <p className="eyebrow">Listed on e46finder.com</p>
                        <h1>{listing.title || listing.car}</h1>
                        {listing.listedBy && <p className="muted">Listed by {listing.listedBy}</p>}
                    </div>
                    <button className="ghost-btn" onClick={() => navigate('/')}>Back to Listings</button>
                </div>

                <div className="detail-gallery">
                    {activeImg && (
                        <div className="hero-img">
                            <img src={activeImg} alt="Listing" />
                        </div>
                    )}
                    {images.length > 1 && (
                        <div className="thumbs">
                            {images.map((img, idx) => (
                                <button
                                    key={`thumb-${idx}`}
                                    className={`thumb ${img === activeImg ? 'active' : ''}`}
                                    onClick={() => setActiveImg(img)}
                                >
                                    <img src={img} alt={`thumb-${idx}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="detail-meta">
                    <div className="meta-box">
                        <span className="label">Price</span>
                        <span className="value">{listing.price || 'N/A'}</span>
                    </div>
                    <div className="meta-box">
                        <span className="label">Mileage</span>
                        <span className="value">{listing.mileage || 'N/A'}</span>
                    </div>
                    <div className="meta-box">
                        <span className="label">Transmission</span>
                        <span className="value">{listing.transmission || listing.trans || 'N/A'}</span>
                    </div>
                    <div className="meta-box">
                        <span className="label">Location</span>
                        <span className="value">{listing.location || 'N/A'}</span>
                    </div>
                </div>

                {listing.description && (
                    <div className="detail-description">
                        <h2>Description</h2>
                        <p>{listing.description}</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default UserListingDetail;
