/**
 * CreateListing page
 * - Protected route where logged-in users can submit a new listing.
 * - Collects 1-5 image URLs, title, description, transmission, location, and duration (days).
 * - Posts to the backend create-listing endpoint; shows inline validation and success/error states.
 */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../componets/NavBar/NavBar';
import Footer from '../componets/Footer/Footer';
import '../css/CreateListing.css';

const MAX_IMAGES = 5;

const CreateListing = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [mileage, setMileage] = useState('');
    const [transmission, setTransmission] = useState('manual');
    const [location, setLocation] = useState('');
    const [durationDays, setDurationDays] = useState(7);
    const [images, setImages] = useState(['']);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const addImageField = () => {
        if (images.length >= MAX_IMAGES) return;
        setImages(prev => [...prev, '']);
    };

    const updateImage = (index, value) => {
        setImages(prev => prev.map((img, i) => (i === index ? value : img)));
    };

    const removeImage = (index) => {
        if (images.length === 1) return; // must keep at least one field visible
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const cleanImages = images.map(img => img.trim()).filter(Boolean);
        if (!title.trim()) {
            setError('Please enter a listing title.');
            return;
        }
        if (!description.trim()) {
            setError('Please add a short description.');
            return;
        }
        if (!location.trim()) {
            setError('Please enter a location.');
            return;
        }
        if (!durationDays || Number(durationDays) < 1) {
            setError('Listing duration must be at least 1 day.');
            return;
        }
        if (!price.trim()) {
            setError('Please add a price (e.g., $18,500).');
            return;
        }
        if (!mileage.trim()) {
            setError('Please add mileage.');
            return;
        }
        if (cleanImages.length === 0) {
            setError('Add at least one image URL (max 5).');
            return;
        }
        if (cleanImages.length > MAX_IMAGES) {
            setError('You can only add up to 5 images.');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                title: title.trim(),
                description: description.trim(),
                transmission,
                location: location.trim(),
                price: price.trim(),
                mileage: mileage.trim(),
                durationDays: Number(durationDays),
                images: cleanImages,
            };
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/userlistings`, payload, { withCredentials: true });
            setSuccess('Listing created! It will now appear on the Listings page.');
            // Clear form
            setTitle('');
            setDescription('');
            setTransmission('manual');
            setLocation('');
            setPrice('');
            setMileage('');
            setDurationDays(7);
            setImages(['']);
            // Give the user a short moment to read success, then send them back to account
            setTimeout(() => navigate('/account'), 800);
        } catch (err) {
            if (err?.response?.status === 404) {
                setError('Create-listing endpoint is not available yet. Please deploy backend support.');
            } else {
                setError('Could not create listing. Please try again.');
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
                            <p className="eyebrow">List your E46</p>
                            <h1>Create a Listing</h1>
                            <p className="subhead">Add your car and it will appear in the main Listings feed labeled as e46finder.com.</p>
                        </div>
                        <button className="ghost-btn" type="button" onClick={() => navigate('/account')}>Back to Account</button>
                    </div>
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
                            <small className="hint">We will show a countdown and expire the listing automatically.</small>
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
                                {submitting ? 'Creating...' : 'Publish Listing'}
                            </button>
                            <button className="ghost-btn" type="button" onClick={() => navigate('/')}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CreateListing;
