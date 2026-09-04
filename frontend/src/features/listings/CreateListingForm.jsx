import { useState } from 'react'

const initial = { title: '', description: '', category: '', portions: '', district: '', pickupAddress: '', contactPhone: '', availableUntil: '' }
const isFuture = (value) => new Date(value).getTime() > Date.now()

export default function CreateListingForm({ onSubmit }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [submitError, setSubmitError] = useState('')

  const validate = (values) => {
    const result = {}
    if (values.title.trim().length < 3 || values.title.trim().length > 100) result.title = 'Use 3–100 characters.'
    if (values.description.trim().length < 10 || values.description.trim().length > 500) result.description = 'Use 10–500 characters.'
    if (!values.category) result.category = 'Choose a category.'
    if (!Number.isInteger(Number(values.portions)) || Number(values.portions) < 1 || Number(values.portions) > 500) result.portions = 'Enter a whole number from 1–500.'
    if (!values.district.trim()) result.district = 'Enter the district.'
    if (values.pickupAddress.trim().length < 5 || values.pickupAddress.trim().length > 200) result.pickupAddress = 'Use 5–200 characters.'
    if (!/^\+?[0-9\s-]{9,15}$/.test(values.contactPhone.trim())) result.contactPhone = 'Enter a valid phone number (9–15 digits).'
    if (!isFuture(values.availableUntil)) result.availableUntil = 'Choose a future date and time.'
    return result
  }

  const change = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSuccess('')
    setSubmitError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    setSubmitError('')
    try {
      await onSubmit?.({ ...form, portions: Number(form.portions) })
      setSuccess('Your food listing is now live!')
      setForm(initial)
    } catch (error) {
      setSubmitError(error?.message || 'Submission failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Base input style helper
  const getInputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#dc2626' : '#176B59'}`,
    backgroundColor: '#FFFAF0',
    color: '#173A35',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  })

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#104C40',
    marginBottom: '6px',
  }

  const errorStyle = {
    color: '#dc2626',
    fontSize: '0.8rem',
    marginTop: '4px',
    fontWeight: '600',
  }

  return (
    <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', padding: '16px' }}>
      
      {/* KEYFRAME ANIMATIONS FOR FLOATING BLOBS */}
      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .form-floating-accent { animation: floatSlow 5s ease-in-out infinite; }
      `}</style>

      {/* FLOATING DECORATIVE BLOB */}
      <div className="form-floating-accent" style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#D9ED89', width: '48px', height: '48px', borderRadius: '50%', opacity: 0.7, pointerEvents: 'none' }} />

      <form 
        onSubmit={submit} 
        noValidate 
        style={{
          background: '#FFFDF8',
          border: '2px solid #D9ED89',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 24px rgba(23, 58, 53, 0.06)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Share Surplus</span>
          <h2 style={{ margin: '4px 0 0 0', color: '#104C40', fontSize: '1.75rem', fontWeight: '800' }}>Create Food Listing</h2>
        </div>

        {/* TITLE */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="listing-title" style={labelStyle}>Food Title</label>
          <input id="listing-title" name="title" placeholder="e.g. Fresh vegetable rice packs" maxLength={100} value={form.title} onChange={change} style={getInputStyle(errors.title)} />
          {errors.title && <div style={errorStyle}>{errors.title}</div>}
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="listing-description" style={labelStyle}>Description</label>
          <textarea id="listing-description" name="description" rows={3} placeholder="Briefly describe the food, ingredients, and any collection notes." maxLength={500} value={form.description} onChange={change} style={{ ...getInputStyle(errors.description), resize: 'vertical' }} />
          {errors.description && <div style={errorStyle}>{errors.description}</div>}
        </div>

        {/* CATEGORY & PORTIONS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label htmlFor="listing-category" style={labelStyle}>Category</label>
            <select id="listing-category" name="category" value={form.category} onChange={change} style={getInputStyle(errors.category)}>
              <option value="">Choose a category</option>
              <option value="Meals">Meals</option>
              <option value="Bakery">Bakery</option>
              <option value="Produce">Produce</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <div style={errorStyle}>{errors.category}</div>}
          </div>

          <div>
            <label htmlFor="listing-portions" style={labelStyle}>Portions Available</label>
            <input id="listing-portions" type="number" min="1" max="500" name="portions" placeholder="e.g. 12" value={form.portions} onChange={change} style={getInputStyle(errors.portions)} />
            {errors.portions && <div style={errorStyle}>{errors.portions}</div>}
          </div>
        </div>

        {/* DISTRICT & ADDRESS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label htmlFor="listing-district" style={labelStyle}>District</label>
            <input id="listing-district" name="district" placeholder="e.g. Colombo" value={form.district} onChange={change} style={getInputStyle(errors.district)} />
            {errors.district && <div style={errorStyle}>{errors.district}</div>}
          </div>

          <div>
            <label htmlFor="listing-address" style={labelStyle}>Pickup Address</label>
            <input id="listing-address" name="pickupAddress" placeholder="e.g. 15 Flower Road, Colombo 07" maxLength={200} value={form.pickupAddress} onChange={change} style={getInputStyle(errors.pickupAddress)} />
            {errors.pickupAddress && <div style={errorStyle}>{errors.pickupAddress}</div>}
          </div>
        </div>

        {/* PHONE & EXPIRATION TIME GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div>
            <label htmlFor="listing-phone" style={labelStyle}>Contact Phone Number</label>
            <input id="listing-phone" type="tel" name="contactPhone" placeholder="e.g. +94 77 123 4567" inputMode="tel" value={form.contactPhone} onChange={change} style={getInputStyle(errors.contactPhone)} />
            {errors.contactPhone && <div style={errorStyle}>{errors.contactPhone}</div>}
          </div>

          <div>
            <label htmlFor="listing-until" style={labelStyle}>Available Until</label>
            <input id="listing-until" type="datetime-local" name="availableUntil" value={form.availableUntil} onChange={change} style={getInputStyle(errors.availableUntil)} />
            {errors.availableUntil && <div style={errorStyle}>{errors.availableUntil}</div>}
          </div>
        </div>

        {/* SUBMIT ROW */}
        <div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              width: '100%',
              backgroundColor: '#104C40',
              color: '#FFFAF0',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'background-color 0.2s',
            }}
          >
            {isSubmitting ? 'Publishing…' : 'Publish Listing'}
          </button>

          {/* STATUS NOTIFICATIONS */}
          {success && (
            <div style={{ backgroundColor: '#D9ED89', color: '#104C40', padding: '12px 16px', borderRadius: '10px', marginTop: '16px', fontWeight: '700', textAlign: 'center', fontSize: '0.9rem' }}>
              ✓ {success}
            </div>
          )}

          {submitError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginTop: '16px', fontWeight: '600', textAlign: 'center', fontSize: '0.9rem' }}>
              ✕ {submitError}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}