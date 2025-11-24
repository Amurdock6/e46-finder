/**
 * EditListing page
 * - Protected route where a logged-in user can edit their own listing.
 * - Prefills fields from the user's listings; saves via PUT to the backend.
 */
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../componets/NavBar/NavBar';
import Footer from '../componets/Footer/Footer';
import '../css/CreateListing.css';

const MAX_IMAGES = 5;

const EditListing = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [transmission, setTransmission] = useState('manual');
    const [location, setLocation] = useState('');
    const [durationDays, setDurationDays] = useState(7);
    const [images, setImages] = useState(['']);
    const [price, setPrice] = useState('');
    const [mileage, setMileage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const cleanListingId = useMemo(() => listingId || '', [listingId]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                // Preferred: backend supports GET /userlistings/:id
                let data = null;
                try {
                    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userlistings/${cleanListingId}`, { withCredentials: true });
                    data = resp.data;
                } catch (_) {
                    // Fallback: fetch all and find locally
                    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userlistings`, { withCredentials: true });
                    const arr = resp.data || [];
                    data = arr.find(l => (l.listingId === cleanListingId));
                }
                if (!data) {
                    setError('Listing not found or not yours to edit.');
                    setLoading(false);
                    return;
                }
                setTitle(data.title || data.car || '');
                setDescription(data.description || '');
                setTransmission((data.transmission || data.trans || 'manual').toLowerCase().includes('auto') ? 'automatic' : 'manual');
                setLocation(data.location || '');
                setDurationDays(data.durationDays || 7);
                setImages(Array.isArray(data.images) && data.images.length ? data.images.slice(0, MAX_IMAGES) : [data.picture || '']);
                setPrice(data.price || '');
                setMileage(data.mileage || '');
                setLoading(false);
            } catch (err) {
                setError('Could not load listing for editing.');
                setLoading(false);
            }
        };
        fetchListing();
    }, [cleanListingId]);

    const addImageField = () => {
        if (images.length >= MAX_IMAGES) return;
        setImages(prev => [...prev, '']);
    };

    const updateImage = (index, value) => {
        setImages(prev => prev.map((img, i) => (i === index ? value : img)));
    };

    const removeImage = (index) => {
        if (images.length === 1) return;
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const cleanImages = images.map(img => img.trim()).filter(Boolean);
        if (!title.trim()) return setError('Please enter a listing title.');
        if (!description.trim()) return setError('Please add a short description.');
        if (!location.trim()) return setError('Please enter a location.');
        if (!durationDays || Number(durationDays) < 1) return setError('Listing duration must be at least 1 day.');
        if (!price.trim()) return setError('Please add a price.');
        if (!mileage.trim()) return setError('Please add mileage.');
        if (cleanImages.length === 0) return setError('Add at least one image URL (max 5).');
        if (cleanImages.length > MAX_IMAGES) return setError('You can only add up to 5 images.');

        setSubmitting(true);
        try {
            const payload = {
                title: title.trim(),
                description: description.trim(),
                transmission,
                location: location.trim(),
                durationDays: Number(durationDays),
                images: cleanImages,
                price: price.trim(),
                mileage: mileage.trim(),
            };
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/userlistings/${cleanListingId}`, payload, { withCredentials: true });
            setSuccess('Listing updated!');
            setTimeout(() => navigate('/account'), 800);
        } catch (err) {
            if (err?.response?.status === 404) {
                setError('Edit endpoint is not available yet. Please deploy backend support.');
            } else if (err?.response?.status === 403) {
                setError('You can only edit your own listings.');
            } else {
                setError('Could not update listing. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <NavBar />
            <div className="create-listing-page">
                <div className="create-card">
                    <div className="create-head">
                        <div>
                            <p className="eyebrow">Update your listing</p>
                            <h1>Edit Listing</h1>
                            <p className="subhead">Adjust details, price, photos, or duration.</p>
                        </div>
                        <button className="ghost-btn" type="button" onClick={() => navigate('/account')}>Back to Account</button>
                    </div>

                    {loading ? (
                        <p>Loading listing...</p>
                    ) : (
                        <form className="create-form" onSubmit={onSubmit}>
                            <label className="field">
                                <span>Listing Title*</span>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., 2004 BMW E46 M3 Coupe"
                                    required
                                />
                            </label>

                            <label className="field">
                                <span>Description*</span>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Highlight condition, mods, maintenance, and anything buyers should know."
                                    rows={4}
                                    required
                                />
                            </label>

                            <div className="field two-col">
                                <label>
                                    <span>Transmission*</span>
                                    <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                                        <option value="manual">Manual</option>
                                        <option value="automatic">Automatic</option>
                                    </select>
                                </label>
                                <label>
                                    <span>Location*</span>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="City, State or Country"
                                        required
                                    />
                                </label>
                            </div>

                            <div className="field two-col">
                                <label>
                                    <span>Price*</span>
                                    <input
                                        type="text"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="$18,500"
                                        required
                                    />
                                </label>
                                <label>
                                    <span>Mileage*</span>
                                    <input
                                        type="text"
                                        value={mileage}
                                        onChange={(e) => setMileage(e.target.value)}
                                        placeholder="123,456 miles"
                                        required
                                    />
                                </label>
                            </div>

                            <label className="field">
                                <span>Listing Duration (days)*</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={durationDays}
                                    onChange={(e) => setDurationDays(e.target.value)}
                                />
                            </label>

                            <div className="field">
                                <div className="images-head">
                                    <span>Images (1-5 URLs)*</span>
                                    <button
                                        type="button"
                                        onClick={addImageField}
                                        disabled={images.length >= MAX_IMAGES}
                                        className="ghost-btn"
                                    >
                                        Add image
                                    </button>
                                </div>
                                <div className="images-list">
                                    {images.map((img, idx) => (
                                        <div className="image-row" key={`image-${idx}`}>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/my-e46.jpg"
                                                value={img}
                                                onChange={(e) => updateImage(idx, e.target.value)}
                                                required={idx === 0}
                                            />
                                            {images.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="remove-btn"
                                                    onClick={() => removeImage(idx)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && <div className="form-status error">{error}</div>}
                            {success && <div className="form-status success">{success}</div>}

                            <div className="actions">
                                <button className="primary-btn" type="submit" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button className="ghost-btn" type="button" onClick={() => navigate('/account')}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EditListing;
