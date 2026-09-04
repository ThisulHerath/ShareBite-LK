import React, { useState } from 'react';
import './listings.css';

const initial = {
  title: '', description: '', category: '', portions: '', district: '', pickupAddress: '', availableUntil: ''
};

function isFuture(dateStr){
  const d = new Date(dateStr);
  return d.toString() !== 'Invalid Date' && d.getTime() > Date.now();
}

export default function CreateListingForm({ onSubmit }){
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  function validate(values){
    const e = {};
    if (!values.title || values.title.trim().length < 3) e.title = 'Title must be 3–100 characters.';
    if (values.title && values.title.trim().length > 100) e.title = 'Title must be 3–100 characters.';
    if (!values.description || values.description.trim().length < 10) e.description = 'Description must be 10–500 characters.';
    if (values.description && values.description.trim().length > 500) e.description = 'Description must be 10–500 characters.';
    if (!values.category) e.category = 'Category is required.';
    const p = Number(values.portions);
    if (!values.portions || !Number.isInteger(p) || p < 1 || p > 500) e.portions = 'Portions must be a whole number 1–500.';
    if (!values.district) e.district = 'District is required.';
    if (!values.pickupAddress || values.pickupAddress.trim().length < 5) e.pickupAddress = 'Address must be 5–200 characters.';
    if (values.pickupAddress && values.pickupAddress.trim().length > 200) e.pickupAddress = 'Address must be 5–200 characters.';
    if (!values.availableUntil || !isFuture(values.availableUntil)) e.availableUntil = 'Available-until must be a future date/time.';
    return e;
  }

  function handleChange(e){
    const { name, value } = e.target;
    setForm(prev=> ({...prev, [name]: value}));
    setErrors(prev=> ({...prev, [name]: undefined}));
    setSuccess(''); setSubmitError('');
  }

  async function handleSubmit(e){
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setIsSubmitting(true);
    setSubmitError(''); setSuccess('');
    try{
      if (onSubmit){
        await onSubmit({
          ...form,
          portions: Number(form.portions)
        });
      } else {
        // fallback: simulate network
        await new Promise(r=>setTimeout(r,500));
      }
      setSuccess('Listing created successfully.');
      setForm(initial);
    }catch(err){
      setSubmitError(err?.message || 'Submission failed.');
    }finally{
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="sb-form-row">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
        {errors.title && <div className="sb-error">{errors.title}</div>}
      </div>

      <div className="sb-form-row">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
        {errors.description && <div className="sb-error">{errors.description}</div>}
      </div>

      <div style={{display:'flex',gap:8}}>
        <div style={{flex:1}} className="sb-form-row">
          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} />
          {errors.category && <div className="sb-error">{errors.category}</div>}
        </div>
        <div style={{width:140}} className="sb-form-row">
          <label>Portions</label>
          <input name="portions" value={form.portions} onChange={handleChange} />
          {errors.portions && <div className="sb-error">{errors.portions}</div>}
        </div>
      </div>

      <div style={{display:'flex',gap:8}}>
        <div style={{flex:1}} className="sb-form-row">
          <label>District</label>
          <input name="district" value={form.district} onChange={handleChange} />
          {errors.district && <div className="sb-error">{errors.district}</div>}
        </div>
        <div style={{flex:1}} className="sb-form-row">
          <label>Pickup Address</label>
          <input name="pickupAddress" value={form.pickupAddress} onChange={handleChange} />
          {errors.pickupAddress && <div className="sb-error">{errors.pickupAddress}</div>}
        </div>
      </div>

      <div className="sb-form-row">
        <label>Available Until</label>
        <input type="datetime-local" name="availableUntil" value={form.availableUntil} onChange={handleChange} />
        {errors.availableUntil && <div className="sb-error">{errors.availableUntil}</div>}
      </div>

      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button type="submit" disabled={isSubmitting}>{isSubmitting? 'Sending...':'Create listing'}</button>
        {success && <div className="sb-success">{success}</div>}
        {submitError && <div className="sb-error">{submitError}</div>}
      </div>
    </form>
  );
}
