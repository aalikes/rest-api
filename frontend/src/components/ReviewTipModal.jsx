import { useState } from 'react';

const tipAmounts = [5, 10, 15, 20];

export default function ReviewTipModal({ onClose }) {
  const [step, setStep] = useState('review');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onClose(), 2500);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thank You!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your feedback helps us improve.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {step === 'review' ? 'How was your experience?' : 'Would you like to leave a tip?'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {step === 'review' && (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="text-3xl transition-transform hover:scale-110">
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {rating <= 2 ? 'We\'re sorry to hear that.' : rating <= 3 ? 'Thanks for your feedback.' : 'Glad you had a great experience!'}
                </p>
              )}
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience (optional)"
                rows={3}
                className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm resize-none"
              />
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  Skip
                </button>
                <button onClick={() => setStep('tip')} className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                  {rating > 0 ? 'Next' : 'Skip to Tip'}
                </button>
              </div>
            </div>
          )}

          {step === 'tip' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Your technician worked hard to provide quality service. Tips are always appreciated!</p>
              <div className="grid grid-cols-4 gap-2">
                {tipAmounts.map((amt) => (
                  <button key={amt} onClick={() => { setTipAmount(amt); setCustomTip(''); }}
                    className={`py-3 rounded-lg text-sm font-bold transition ${
                      tipAmount === amt ? 'bg-teal-600 text-white' : 'border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-teal-400'
                    }`}>
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Custom:</span>
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => { setCustomTip(e.target.value); setTipAmount(0); }}
                  placeholder="$"
                  className="flex-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSubmit} className="flex-1 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  No Tip
                </button>
                <button onClick={handleSubmit} disabled={!tipAmount && !customTip}
                  className="flex-1 py-2.5 bg-teal-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                  Leave Tip {tipAmount ? `($${tipAmount})` : customTip ? `($${customTip})` : ''}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
