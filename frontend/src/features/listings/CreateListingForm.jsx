import { useState } from 'react';
import './listings.css';

const initial = { title: '', description: '', category: '', portions: '', district: '', pickupAddress: '', contactPhone: '', availableUntil: '' };
const isFuture = (value) => new Date(value).getTime() > Date.now();

export default function CreateListingForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const validate = (values) => {
    const result = {};
    if (values.title.trim().length < 3 || values.title.trim().length > 100) result.title = 'Use 3–100 characters.';
    if (values.description.trim().length < 10 || values.description.trim().length > 500) result.description = 'Use 10–500 characters.';
    if (!values.category) result.category = 'Choose a category.';
    if (!Number.isInteger(Number(values.portions)) || Number(values.portions) < 1 || Number(values.portions) > 500) result.portions = 'Enter a whole number from 1–500.';
    if (!values.district.trim()) result.district = 'Enter the district.';
    if (values.pickupAddress.trim().length < 5 || values.pickupAddress.trim().length > 200) result.pickupAddress = 'Use 5–200 characters.';
    if (!/^\+?[0-9\s-]{9,15}$/.test(values.contactPhone.trim())) result.contactPhone = 'Enter a valid phone number (9–15 digits).';
    if (!isFuture(values.availableUntil)) result.availableUntil = 'Choose a future date and time.';
    return result;
  };
  const change = (event) => { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: undefined })); setSuccess(''); setSubmitError(''); };
  const submit = async (event) => {
    event.preventDefault(); const nextErrors = validate(form); setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    setIsSubmitting(true); setSubmitError('');
    try { await onSubmit?.({ ...form, portions: Number(form.portions) }); setSuccess('Your food listing is now live.'); setForm(initial); } catch (error) { setSubmitError(error?.message || 'Submission failed.'); } finally { setIsSubmitting(false); }
  };
  return <form onSubmit={submit} noValidate>
    <div className="sb-form-row"><label htmlFor="listing-title">Food title</label><input id="listing-title" name="title" placeholder="e.g. Fresh vegetable rice packs" maxLength="100" value={form.title} onChange={change} />{errors.title && <div className="sb-error">{errors.title}</div>}</div>
    <div className="sb-form-row"><label htmlFor="listing-description">Description</label><textarea id="listing-description" name="description" placeholder="Briefly describe the food, ingredients, and any collection notes." maxLength="500" value={form.description} onChange={change} />{errors.description && <div className="sb-error">{errors.description}</div>}</div>
    <div className="sb-form-grid category-portions"><div className="sb-form-row"><label htmlFor="listing-category">Category</label><select id="listing-category" name="category" value={form.category} onChange={change}><option value="">Choose a category</option><option>Meals</option><option>Bakery</option><option>Produce</option><option>Other</option></select>{errors.category && <div className="sb-error">{errors.category}</div>}</div><div className="sb-form-row"><label htmlFor="listing-portions">Portions</label><input id="listing-portions" type="number" min="1" max="500" name="portions" placeholder="e.g. 12" value={form.portions} onChange={change} />{errors.portions && <div className="sb-error">{errors.portions}</div>}</div></div>
    <div className="sb-form-grid"><div className="sb-form-row"><label htmlFor="listing-district">District</label><input id="listing-district" name="district" placeholder="e.g. Colombo" value={form.district} onChange={change} />{errors.district && <div className="sb-error">{errors.district}</div>}</div><div className="sb-form-row"><label htmlFor="listing-address">Pickup address</label><input id="listing-address" name="pickupAddress" placeholder="e.g. 15 Flower Road, Colombo 07" maxLength="200" value={form.pickupAddress} onChange={change} />{errors.pickupAddress && <div className="sb-error">{errors.pickupAddress}</div>}</div></div>
    <div className="sb-form-grid"><div className="sb-form-row"><label htmlFor="listing-phone">Contact phone number</label><input id="listing-phone" type="tel" name="contactPhone" placeholder="e.g. +94 77 123 4567" inputMode="tel" value={form.contactPhone} onChange={change} />{errors.contactPhone && <div className="sb-error">{errors.contactPhone}</div>}</div><div className="sb-form-row"><label htmlFor="listing-until">Available until</label><input id="listing-until" type="datetime-local" name="availableUntil" value={form.availableUntil} onChange={change} />{errors.availableUntil && <div className="sb-error">{errors.availableUntil}</div>}</div></div>
    <div className="sb-submit-row"><button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Publishing…' : 'Create listing'}</button>{success && <div className="sb-success">{success}</div>}{submitError && <div className="sb-error">{submitError}</div>}</div>
  </form>;
}
