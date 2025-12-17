/**
 * EditListing page
 * - Protected route where a logged-in user can edit their own listing.
 * - Prefills fields from the user's listings; saves via PUT to the backend.
 * - Supports 1-5 images via URLs and/or local uploads (multipart when files present).
 */
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../componets/NavBar/NavBar';
import Footer from '../componets/Footer/Footer';
import '../css/CreateListing.css';

const MAX_IMAGES = 5;
const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
};

const EditListing = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [transmission, setTransmission] = useState('manual');
    const [location, setLocation] = useState('');
    const [durationDays, setDurationDays] = useState(7);
    const [imageUrls, setImageUrls] = useState(['']);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [mileage, setMileage] = useState('');
    const [mileageUnit, setMileageUnit] = useState('mi');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const usedImages = imageUrls.filter(Boolean).length + uploadFiles.length;
    const hasUploads = uploadFiles.length > 0;
    const remainingSlots = Math.max(0, MAX_IMAGES - usedImages);

    const cleanListingId = useMemo(() => listingId || '', [listingId]);

    const formatNumberWithGrouping = (raw, fractionDigits = 2) => {
        const trimmed = (raw || '').trim();
        if (!trimmed) return '';
        const numeric = parseFloat(trimmed.replace(/[^0-9.+-]/g, ''));
        if (Number.isNaN(numeric)) return trimmed;
        return numeric.toLocaleString('en-US', {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        });
    };

    const detectCurrencyFromPrice = (rawPrice) => {
        const value = (rawPrice || '').trim();
        const entries = Object.entries(CURRENCY_SYMBOLS);
        for (const [code, symbol] of entries) {
            if (value.startsWith(symbol)) {
                return { currency: code, cleanPrice: value.slice(symbol.length).trim() };
            }
        }
        return { currency: 'USD', cleanPrice: value };
    };

    const formatPriceWithCurrency = (rawPrice, curr) => {
        const symbol = CURRENCY_SYMBOLS[curr] || '';
        const base = formatNumberWithGrouping(rawPrice, 2);
        if (!symbol) return base;
        const normalized = base.startsWith(symbol) ? base.slice(symbol.length).trim() : base;
        return normalized ? `${symbol}${normalized}` : '';
    };

    const detectMileageUnit = (rawMileage) => {
        const value = (rawMileage || '').trim();
        if (!value) return { unit: 'mi', cleanMileage: '' };
        const kmMatch = /\bkm\b|kilometer/i.test(value);
        const miMatch = /\bmi\b|mile/i.test(value);
        const unit = kmMatch ? 'km' : (miMatch ? 'mi' : 'mi');
        const cleanMileage = value.replace(/\s*(mi|miles|km|kilometers?)$/i, '').trim();
        return { unit, cleanMileage };
    };

    const formatMileageWithUnit = (rawMileage, unit) => {
        const trimmed = rawMileage.trim();
        if (!trimmed) return trimmed;
        const cleaned = trimmed.replace(/\s*(mi|miles|km|kilometers?)$/i, '').trim();
        const formatted = formatNumberWithGrouping(cleaned, 0);
        const suffix = unit === 'km' ? ' km' : ' mi';
        return `${formatted}${suffix}`;
    };

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
                setImageUrls(Array.isArray(data.images) && data.images.length ? data.images.slice(0, MAX_IMAGES) : [data.picture || '']);
                const { currency: detectedCurrency, cleanPrice } = detectCurrencyFromPrice(data.price);
                setCurrency(detectedCurrency);
                setPrice(formatNumberWithGrouping(cleanPrice || '', 2));
                const { unit, cleanMileage } = detectMileageUnit(data.mileage);
                setMileageUnit(unit);
                setMileage(formatNumberWithGrouping(cleanMileage || '', 0));
                setLoading(false);
            } catch (err) {
                setError('Could not load listing for editing.');
                setLoading(false);
            }
        };
        fetchListing();
    }, [cleanListingId]);

    const addImageField = () => {
        const used = imageUrls.filter(Boolean).length + uploadFiles.length;
        if (imageUrls.length >= MAX_IMAGES || used >= MAX_IMAGES) return;
        setImageUrls(prev => [...prev, '']);
    };

    const updateImage = (index, value) => {
        setImageUrls(prev => prev.map((img, i) => (i === index ? value : img)));
    };

    const removeImage = (index) => {
        if (imageUrls.length === 1) return;
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const slotsLeft = MAX_IMAGES - imageUrls.filter(Boolean).length - uploadFiles.length;
        const nextFiles = files.slice(0, Math.max(0, slotsLeft));
        if (nextFiles.length) {
            setUploadFiles(prev => [...prev, ...nextFiles]);
        }
        e.target.value = '';
    };

    const removeFile = (index) => {
        setUploadFiles(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const cleanImageUrls = imageUrls.map(img => img.trim()).filter(Boolean);
        const totalImages = cleanImageUrls.length + uploadFiles.length;
        if (!title.trim()) return setError('Please enter a listing title.');
        if (!description.trim()) return setError('Please add a short description.');
        if (!location.trim()) return setError('Please enter a location.');
        if (!durationDays || Number(durationDays) < 1) return setError('Listing duration must be at least 1 day.');
        if (!price.trim()) return setError('Please add a price.');
        if (!mileage.trim()) return setError('Please add mileage.');
        if (totalImages === 0) return setError('Add at least one image (upload or URL, max 5).');
        if (totalImages > MAX_IMAGES) return setError('You can only add up to 5 images.');

        setSubmitting(true);
        try {
            const formattedPrice = formatPriceWithCurrency(price, currency);
            const formattedMileage = formatMileageWithUnit(mileage, mileageUnit);
            const baseFields = {
                title: title.trim(),
                description: description.trim(),
                transmission,
                location: location.trim(),
                durationDays: Number(durationDays),
                price: formattedPrice,
                mileage: formattedMileage,
            };

            if (uploadFiles.length > 0) {
                const formData = new FormData();
                Object.entries(baseFields).forEach(([key, val]) => formData.append(key, val));
                cleanImageUrls.forEach((url) => formData.append('imageUrls', url));
                uploadFiles.forEach((file) => formData.append('images', file));

                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/userlistings/${cleanListingId}`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                const payload = { ...baseFields, images: cleanImageUrls };
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/userlistings/${cleanListingId}`, payload, { withCredentials: true });
            }
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

                            <div className="field price-row">
                                <label>
                                    <span>Price*</span>
                                    <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder={`${CURRENCY_SYMBOLS[currency] || ''}18,500`}
                                    onBlur={() => setPrice(formatPriceWithCurrency(price, currency))}
                                    required
                                />
                            </label>
                                <label>
                                    <span>Currency*</span>
                                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="CAD">CAD (C$)</option>
                                        <option value="AUD">AUD (A$)</option>
                                    </select>
                                </label>
                                <label>
                                    <span>Mileage*</span>
                                    <div className="input-with-unit">
                                        <input
                                        type="text"
                                        value={mileage}
                                        onChange={(e) => setMileage(e.target.value)}
                                        placeholder="123,456"
                                        onBlur={() => setMileage(formatNumberWithGrouping(mileage, 0))}
                                        required
                                    />
                                        <select value={mileageUnit} onChange={(e) => setMileageUnit(e.target.value)}>
                                            <option value="mi">Miles</option>
                                            <option value="km">Kilometers</option>
                                        </select>
                                    </div>
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
                                    <span>Images (1-5 total)*</span>
                                    <button
                                        type="button"
                                        onClick={addImageField}
                                        disabled={usedImages >= MAX_IMAGES}
                                        className="ghost-btn"
                                    >
                                        Add URL
                                    </button>
                                </div>
                                <div className="upload-row">
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileSelect}
                                            disabled={usedImages >= MAX_IMAGES}
                                        />
                                        <small className="hint">Upload directly from your device (up to {MAX_IMAGES} total, {remainingSlots} slots left).</small>
                                    </div>
                                    {uploadFiles.length > 0 && (
                                        <div className="file-list">
                                            {uploadFiles.map((file, idx) => (
                                                <div className="file-pill" key={`${file.name}-${idx}`}>
                                                    <span>{file.name}</span>
                                                    <button type="button" onClick={() => removeFile(idx)} aria-label={`Remove ${file.name}`}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="images-list">
                                    {imageUrls.map((img, idx) => (
                                        <div className="image-row" key={`image-${idx}`}>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/my-e46.jpg"
                                                value={img}
                                                onChange={(e) => updateImage(idx, e.target.value)}
                                                required={!hasUploads && idx === 0}
                                            />
                                            {imageUrls.length > 1 && (
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
