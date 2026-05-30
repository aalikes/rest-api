import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const timeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM',
];

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false });
  }
  return days;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'fingerprint',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const calendarDays = getCalendarDays(currentYear, currentMonth);
  const todayDate = today.getDate();

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function isToday(day) {
    return day === todayDate && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  }

  function isPast(day) {
    const d = new Date(currentYear, currentMonth, day);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  }

  function handleDateClick(day, isCurrentMonth) {
    if (!isCurrentMonth || isPast(day)) return;
    setSelectedDate(day);
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
        <p className="text-gray-600">
          {monthNames[currentMonth]} {selectedDate}, {currentYear} at {selectedTime}
        </p>
        <p className="text-sm text-gray-500 mt-2">A confirmation email will be sent to {form.email}</p>
        <button onClick={() => navigate('/')} className="mt-6 text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
        <div className="text-sm text-gray-500">
          {lang === 'en' ? '🇺🇸 English' : lang === 'es' ? '🇪🇸 Español' : lang === 'ht' ? '🇭🇹 Kreyòl' : '🇧🇷 Português'}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 4 && <div className={`w-12 sm:w-20 h-0.5 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Date & Time */}
      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Time</h2>
            <p className="text-gray-500 mt-1">Select a date and time for your appointment</p>
            <p className="text-sm text-gray-400">Available Monday - Sunday, 8 AM - 9 PM • Closed on holidays</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">📅 Select Date</h3>
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">‹</button>
                <span className="font-medium">{monthNames[currentMonth]} {currentYear}</span>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">›</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {daysOfWeek.map(d => (
                  <div key={d} className="font-medium text-gray-500 py-1">{d}</div>
                ))}
                {calendarDays.map((d, i) => (
                  <button
                    key={i}
                    disabled={!d.currentMonth || isPast(d.day)}
                    onClick={() => handleDateClick(d.day, d.currentMonth)}
                    className={`py-2 rounded-lg text-sm transition ${
                      !d.currentMonth ? 'text-gray-300' :
                      isPast(d.day) ? 'text-gray-300 cursor-not-allowed' :
                      selectedDate === d.day ? 'bg-blue-600 text-white font-bold' :
                      isToday(d.day) ? 'text-blue-600 font-bold border border-blue-300' :
                      'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-300" /> Federal Holiday</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-300" /> Fully Booked</span>
              </div>
            </div>

            {/* Time Slots */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">🕐 Select Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 px-2 rounded-lg text-sm border transition ${
                      selectedTime === t
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {selectedTime && (
                <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
                  1 technician available
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!selectedDate || !selectedTime}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3.5 rounded-lg font-medium transition"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Service Selection */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Select Service</h2>
          <div className="space-y-3">
            {[
              { id: 'fingerprint', label: 'Fingerprinting', price: '$99', desc: 'In-office fingerprint capture' },
              { id: 'fbi', label: 'FBI Background Check', price: '$129+', desc: 'Includes fingerprinting' },
              { id: 'fbi-apostille', label: 'FBI + Apostille Bundle', price: '$329+', desc: 'Background check + federal apostille' },
            ].map(s => (
              <label key={s.id} className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition ${
                form.service === s.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="service" value={s.id} checked={form.service === s.id}
                    onChange={(e) => setForm({ ...form, service: e.target.value })} />
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.desc}</div>
                  </div>
                </div>
                <span className="font-bold text-gray-900">{s.price}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-medium transition"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Your Details */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Your Details</h2>
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" placeholder="John Smith" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" placeholder="john@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" placeholder="(305) 555-1234" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea placeholder="Any special requirements..." value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-20 resize-none" />
            </div>
          </div>
          <button
            onClick={() => setStep(4)}
            disabled={!form.name || !form.email || !form.phone}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3.5 rounded-lg font-medium transition"
          >
            Continue to Review
          </button>
        </div>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Review & Confirm</h2>
          <div className="border border-gray-200 rounded-lg p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{monthNames[currentMonth]} {selectedDate}, {currentYear}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service</span>
              <span className="font-medium capitalize">{form.service.replace('-', ' + ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{form.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{form.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Location</span>
              <span className="font-medium">2125 Biscayne Blvd Suite 303, Miami FL</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <p className="text-sm text-gray-500">Payment will be collected at the office on your appointment date.</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-bold transition"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
