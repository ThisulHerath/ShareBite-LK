import '../styles/sharebite.css'

const stateContent = {
  loading: { title: 'Loading food nearby', text: 'We are finding the latest available listings for you.' },
  empty: { title: 'Nothing available yet', text: 'Try adjusting your filters or check back soon for new listings.' },
  error: { title: 'We could not load this', text: 'Please check your connection and try again.' },
  success: { title: 'You are all set!', text: 'Your reservation has been saved. Please collect it before the listed time.' },
}

/** Reusable status feedback for listings, forms, and reservation flows. */
export default function StatusState({ type = 'loading', title, children, action }) {
  const content = stateContent[type] || stateContent.loading
  return (
    <section className={`status-state status-${type}`} role={type === 'error' ? 'alert' : 'status'} aria-live="polite">
      <div className="status-icon" aria-hidden="true">{type === 'loading' ? '…' : type === 'empty' ? '○' : type === 'error' ? '!' : '✓'}</div>
      <div>
        <h2>{title || content.title}</h2>
        <p>{children || content.text}</p>
        {action}
      </div>
    </section>
  )
}

