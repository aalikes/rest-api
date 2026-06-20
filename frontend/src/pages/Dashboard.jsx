import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

const TECH_TABS = ['Today', 'Scheduled', 'Intakes', 'Calendar', 'Earnings', 'History', 'Performance'];
const ADMIN_TABS = ['Today', 'Scheduled', 'Intakes', 'Calendar', 'Earnings', 'History', 'Performance', 'Admin'];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');
  const [outOfOffice, setOutOfOffice] = useState(false);
  const [role, setRole] = useState('technician');
  const [selectedClient, setSelectedClient] = useState(null);
  const TABS = role === 'admin' ? ADMIN_TABS : TECH_TABS;

  useEffect(() => {
    api.get('/business/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Failed to load dashboard. Please login.</div>;
  }

  const firstName = user?.email?.split('@')[0]?.split('.')[0] || 'Technician';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{role === 'admin' ? 'Admin' : 'Technician'} Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {displayName}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setRole('technician')} className={`text-xs px-3 py-1 rounded-full font-medium transition ${
              role === 'technician' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}>Technician</button>
            <button onClick={() => setRole('admin')} className={`text-xs px-3 py-1 rounded-full font-medium transition ${
              role === 'admin' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}>Admin</button>
          </div>
        </div>
        {/* Out of Office Toggle */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Out of Office</p>
            <p className="text-xs text-gray-500">2-hour advance booking required</p>
          </div>
          <button
            onClick={() => setOutOfOffice(!outOfOffice)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              outOfOffice ? 'bg-red-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                outOfOffice ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Today"
          value={data.todayAppointments || 0}
          sub="appointments"
          color="blue"
        />
        <StatCard
          label="Scheduled"
          value={data.upcomingAppointments || 0}
          sub="upcoming"
          color="amber"
        />
        <StatCard
          label="Completed"
          value={data.totalOrders || 0}
          sub="all time"
          color="green"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'Today' && <TodayTab data={data} onClientClick={setSelectedClient} />}
        {activeTab === 'Scheduled' && <ScheduledTab data={data} onClientClick={setSelectedClient} />}
        {activeTab === 'Intakes' && <IntakesTab data={data} onClientClick={setSelectedClient} />}
        {activeTab === 'Calendar' && <CalendarTab />}
        {activeTab === 'Earnings' && <EarningsTab data={data} />}
        {activeTab === 'History' && <HistoryTab data={data} onClientClick={setSelectedClient} />}
        {activeTab === 'Performance' && <PerformanceTab data={data} />}
        {activeTab === 'Admin' && <AdminTab />}
      </div>

      {selectedClient && (
        <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  };
  return (
    <div className={`rounded-lg border p-5 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs opacity-70 mt-1">{sub}</p>
    </div>
  );
}

function TodayTab({ data, onClientClick }) {
  const appointments = [
    { time: '9:00 AM', client: 'Maria Rodriguez', service: 'Fingerprinting', status: 'confirmed', email: 'maria.rodriguez@gmail.com', phone: '(305) 555-0101', dob: '1988-04-12', address: '1250 NE 2nd Ave', addressLine2: '', city: 'Miami', state: 'FL', zip: '33132', ori: '', scheduledAt: 'Jun 20, 2026 - 9:00 AM', bufferBefore: 0, bufferAfter: 0, notes: 'Regular client, prefers morning appointments' },
    { time: '10:30 AM', client: 'Jean Baptiste', service: 'FBI Background Check', status: 'confirmed', email: 'jean.baptiste@gmail.com', phone: '(305) 555-0102', dob: '1995-08-23', address: '3400 Biscayne Blvd', addressLine2: 'Suite 200', city: 'Miami', state: 'FL', zip: '33137', ori: 'FL924680Z', scheduledAt: 'Jun 20, 2026 - 10:30 AM', bufferBefore: 15, bufferAfter: 15, notes: 'Immigration application — needs expedited processing' },
    { time: '11:00 AM', client: 'Carlos Mejia', service: 'Apostille', status: 'pending', email: 'cmejia@outlook.com', phone: '(786) 555-0103', dob: '1979-11-05', address: '800 NE 71st St', addressLine2: 'Apt 4', city: 'Miami', state: 'FL', zip: '33138', ori: '', scheduledAt: 'Jun 20, 2026 - 11:00 AM', bufferBefore: 0, bufferAfter: 0, notes: 'Birth certificate apostille for Colombia' },
    { time: '1:00 PM', client: 'Ana Silva', service: 'FBI + Apostille', status: 'confirmed', email: 'ana.silva@yahoo.com', phone: '(954) 555-0104', dob: '1990-02-17', address: '2200 N Ocean Blvd', addressLine2: '', city: 'Ft. Lauderdale', state: 'FL', zip: '33305', ori: 'FL113355X', scheduledAt: 'Jun 20, 2026 - 1:00 PM', bufferBefore: 15, bufferAfter: 15, notes: 'Work visa for Portugal — FBI + federal apostille' },
    { time: '2:30 PM', client: 'Robert Johnson', service: 'Fingerprinting', status: 'confirmed', email: 'rjohnson@mail.com', phone: '(305) 555-0105', dob: '1983-06-30', address: '500 Brickell Ave', addressLine2: 'Floor 12', city: 'Miami', state: 'FL', zip: '33131', ori: '', scheduledAt: 'Jun 20, 2026 - 2:30 PM', bufferBefore: 0, bufferAfter: 0, notes: 'Security guard license renewal — 2 FD-258 cards needed' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Appointments</h3>
        <span className="text-sm text-gray-500">{appointments.length} scheduled</span>
      </div>
      <div className="space-y-3">
        {appointments.map((apt, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-500 w-20">{apt.time}</div>
              <div>
                <button onClick={() => onClientClick(apt)} className="text-sm font-medium text-teal-700 hover:text-teal-900 hover:underline cursor-pointer text-left">{apt.client}</button>
                <p className="text-xs text-gray-500">{apt.service}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {apt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduledTab({ data, onClientClick }) {
  const upcoming = [
    { date: 'Mon, Jun 2', time: '9:00 AM', client: 'David Chen', service: 'FBI Background Check', email: 'david.chen@gmail.com', phone: '(305) 555-0201', dob: '1992-01-15', address: '900 NE 125th St', addressLine2: '', city: 'North Miami', state: 'FL', zip: '33161', ori: 'FL778899A', scheduledAt: 'Jun 2, 2026 - 9:00 AM', bufferBefore: 15, bufferAfter: 15, notes: 'Employment background check' },
    { date: 'Mon, Jun 2', time: '11:00 AM', client: 'Marie Dupont', service: 'Apostille (2 docs)', email: 'marie.dupont@outlook.com', phone: '(786) 555-0202', dob: '1985-07-22', address: '1500 Bay Rd', addressLine2: 'Unit 3A', city: 'Miami Beach', state: 'FL', zip: '33139', ori: '', scheduledAt: 'Jun 2, 2026 - 11:00 AM', bufferBefore: 0, bufferAfter: 0, notes: 'Marriage certificate + birth certificate for France' },
    { date: 'Tue, Jun 3', time: '10:00 AM', client: 'Jose Martinez', service: 'Fingerprinting', email: 'jose.m@yahoo.com', phone: '(305) 555-0203', dob: '1998-03-08', address: '7400 SW 8th St', addressLine2: '', city: 'Miami', state: 'FL', zip: '33144', ori: '', scheduledAt: 'Jun 3, 2026 - 10:00 AM', bufferBefore: 0, bufferAfter: 0, notes: 'Concealed weapons permit' },
    { date: 'Tue, Jun 3', time: '2:00 PM', client: 'Lisa Wong', service: 'FBI + Apostille', email: 'lwong@mail.com', phone: '(954) 555-0204', dob: '1987-12-01', address: '3000 E Commercial Blvd', addressLine2: 'Suite 100', city: 'Ft. Lauderdale', state: 'FL', zip: '33308', ori: 'FL445566B', scheduledAt: 'Jun 3, 2026 - 2:00 PM', bufferBefore: 15, bufferAfter: 15, notes: 'Teaching position in Dubai' },
    { date: 'Wed, Jun 4', time: '9:30 AM', client: 'Pierre Louis', service: 'Fingerprinting', email: 'pierre.l@gmail.com', phone: '(305) 555-0205', dob: '2001-09-14', address: '200 NE 36th St', addressLine2: '', city: 'Miami', state: 'FL', zip: '33137', ori: '', scheduledAt: 'Jun 4, 2026 - 9:30 AM', bufferBefore: 0, bufferAfter: 0, notes: 'Security guard license — first time' },
    { date: 'Thu, Jun 5', time: '1:00 PM', client: 'Sarah Brown', service: 'Apostille (1 doc)', email: 'sarah.b@gmail.com', phone: '(305) 555-0206', dob: '1976-05-19', address: '1200 Brickell Ave', addressLine2: 'Floor 28', city: 'Miami', state: 'FL', zip: '33131', ori: '', scheduledAt: 'Jun 5, 2026 - 1:00 PM', bufferBefore: 0, bufferAfter: 0, notes: 'Corporate document for UK business registration' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        <span className="text-sm text-gray-500">{upcoming.length} scheduled</span>
      </div>
      <div className="space-y-3">
        {upcoming.map((apt, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center min-w-[80px]">
                <p className="text-xs text-gray-500">{apt.date}</p>
                <p className="text-sm font-medium text-gray-700">{apt.time}</p>
              </div>
              <div>
                <button onClick={() => onClientClick(apt)} className="text-sm font-medium text-teal-700 hover:text-teal-900 hover:underline cursor-pointer text-left">{apt.client}</button>
                <p className="text-xs text-gray-500">{apt.service}</p>
              </div>
            </div>
            <button onClick={() => onClientClick(apt)} className="text-xs text-teal-600 hover:text-teal-800 font-medium">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntakesTab({ data, onClientClick }) {
  const intakes = [
    { name: 'James Wilson', client: 'James Wilson', service: 'FBI Background Check', submitted: '2 hours ago', status: 'new', email: 'james.wilson@gmail.com', phone: '(305) 555-0301', dob: '1991-10-22', address: '600 NE 27th St', addressLine2: '', city: 'Miami', state: 'FL', zip: '33137', ori: 'FL998877C', scheduledAt: 'Jun 21, 2026 - 10:00 AM', bufferBefore: 15, bufferAfter: 15, notes: 'Needs FBI check for state licensing board' },
    { name: 'Sophie Laurent', client: 'Sophie Laurent', service: 'Apostille', submitted: '5 hours ago', status: 'new', email: 'sophie.l@outlook.com', phone: '(786) 555-0302', dob: '1993-04-11', address: '1800 NW 7th Ave', addressLine2: 'Apt 12B', city: 'Miami', state: 'FL', zip: '33136', ori: '', scheduledAt: 'Jun 21, 2026 - 11:30 AM', bufferBefore: 0, bufferAfter: 0, notes: 'Diploma apostille for French university' },
    { name: 'Miguel Santos', client: 'Miguel Santos', service: 'Fingerprinting', submitted: '1 day ago', status: 'reviewed', email: 'miguel.s@yahoo.com', phone: '(305) 555-0303', dob: '1986-08-03', address: '4500 NW 27th Ave', addressLine2: '', city: 'Miami', state: 'FL', zip: '33142', ori: '', scheduledAt: 'Jun 22, 2026 - 9:00 AM', bufferBefore: 0, bufferAfter: 0, notes: 'Out-of-state submission — needs PDF + ink card' },
    { name: 'Fatima Hassan', client: 'Fatima Hassan', service: 'FBI + Apostille', submitted: '1 day ago', status: 'reviewed', email: 'fatima.h@gmail.com', phone: '(954) 555-0304', dob: '1989-12-25', address: '2700 N Federal Hwy', addressLine2: 'Suite 310', city: 'Ft. Lauderdale', state: 'FL', zip: '33306', ori: 'FL223344D', scheduledAt: 'Jun 22, 2026 - 1:00 PM', bufferBefore: 15, bufferAfter: 15, notes: 'Immigration to UAE — expedite if possible' },
    { name: 'John Peters', client: 'John Peters', service: 'Fingerprinting', submitted: '2 days ago', status: 'contacted', email: 'jpeters@mail.com', phone: '(305) 555-0305', dob: '1975-02-28', address: '8900 SW 107th Ave', addressLine2: '', city: 'Miami', state: 'FL', zip: '33176', ori: '', scheduledAt: 'Jun 23, 2026 - 2:00 PM', bufferBefore: 0, bufferAfter: 0, notes: 'Private investigator license — 2 cards' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Client Intake Forms</h3>
        <span className="text-sm text-gray-500">{intakes.length} submissions</span>
      </div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {intakes.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer" onClick={() => onClientClick(item)}>
                <td className="px-4 py-3 text-sm font-medium text-teal-700 hover:text-teal-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.service}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.submitted}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'reviewed' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalendarTab() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  const busyDays = [2, 5, 8, 12, 15, 18, 22, 25, 28];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{monthName}</h3>
      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate();
            const isBusy = busyDays.includes(day);
            return (
              <div
                key={day}
                className={`h-10 flex items-center justify-center rounded-lg text-sm relative ${
                  isToday ? 'bg-teal-600 text-white font-bold' :
                  'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day}
                {isBusy && !isToday && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 bg-teal-400 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-teal-400 rounded-full" /> Appointments booked
        </span>
      </div>
    </div>
  );
}

function EarningsTab({ data }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const earnings = [2400, 3100, 2800, 4200, 3800, data.totalRevenue || 4500];

  const maxEarning = Math.max(...earnings);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
        <span className="text-sm font-medium text-green-600">
          Total: ${data.totalRevenue || 0}
        </span>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-end justify-between gap-2 h-40">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-32">
                <div
                  className="w-8 bg-teal-500 rounded-t"
                  style={{ height: `${(earnings[i] / maxEarning) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500">This Month</p>
          <p className="text-xl font-bold text-gray-900">${earnings[earnings.length - 1]}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500">Avg/Month</p>
          <p className="text-xl font-bold text-gray-900">
            ${Math.round(earnings.reduce((a, b) => a + b, 0) / earnings.length)}
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ data, onClientClick }) {
  const history = [
    { date: 'Jun 19', client: 'Andrea Cano', service: 'Live Scan Fingerprinting Service', amount: '$20.00', status: 'completed', email: 'acinsurancemiami@gmail.com', phone: '6462887906', dob: '1990-03-22', address: '2125 Biscayne Blvd', addressLine2: 'Suite 336', city: 'Miami', state: 'FL', zip: '33137', ori: '', tcn: '70CS1419420000000915', scheduledAt: 'Jun 19, 2026 - 6:23 PM', completedAt: 'Jun 19, 2026 - 6:30 PM', earned: '+$20.00', bufferBefore: 0, bufferAfter: 0, notes: 'Live scan completed successfully' },
    { date: 'Jun 18', client: 'Tom Harris', service: 'FBI Background Check + Apostille', amount: '$329.00', status: 'completed', email: 'tom.harris@outlook.com', phone: '7865550402', dob: '1980-11-30', address: '1700 NW 10th Ave', addressLine2: '', city: 'Miami', state: 'FL', zip: '33136', ori: 'FL556677E', tcn: '70CS1419420000000908', scheduledAt: 'Jun 18, 2026 - 10:00 AM', completedAt: 'Jun 18, 2026 - 10:45 AM', earned: '+$329.00', bufferBefore: 15, bufferAfter: 15, notes: 'FBI results received, apostille shipped' },
    { date: 'Jun 18', client: 'Marie Jean', service: 'State Apostille Service', amount: '$200.00', status: 'shipped', email: 'marie.jean@yahoo.com', phone: '3055550403', dob: '1996-03-07', address: '5600 SW 72nd St', addressLine2: '', city: 'Miami', state: 'FL', zip: '33143', ori: '', tcn: '', scheduledAt: 'Jun 18, 2026 - 2:00 PM', completedAt: 'Jun 18, 2026 - 2:20 PM', earned: '+$200.00', bufferBefore: 0, bufferAfter: 0, notes: 'Birth certificate — shipped to Haiti consulate' },
    { date: 'Jun 17', client: 'Kevin Brown', service: 'Ink Card Fingerprinting Service', amount: '$99.00', status: 'completed', email: 'kbrown@gmail.com', phone: '9545550404', dob: '1982-09-22', address: '4400 N Federal Hwy', addressLine2: '', city: 'Ft. Lauderdale', state: 'FL', zip: '33308', ori: '', tcn: '70CS1419420000000891', scheduledAt: 'Jun 17, 2026 - 11:00 AM', completedAt: 'Jun 17, 2026 - 11:15 AM', earned: '+$99.00', bufferBefore: 0, bufferAfter: 0, notes: 'Real estate license application — 2 FD-258 cards' },
    { date: 'Jun 17', client: 'Laura Chen', service: 'FBI Background Check', amount: '$129.00', status: 'completed', email: 'laura.chen@mail.com', phone: '3055550405', dob: '1999-01-14', address: '1000 NE 2nd Ave', addressLine2: 'Apt 4B', city: 'Miami', state: 'FL', zip: '33132', ori: 'FL889900F', tcn: '70CS1419420000000884', scheduledAt: 'Jun 17, 2026 - 3:00 PM', completedAt: 'Jun 17, 2026 - 3:25 PM', earned: '+$129.00', bufferBefore: 10, bufferAfter: 10, notes: 'Adoption background check' },
    { date: 'Jun 16', client: 'Pierre Blanc', service: 'State Apostille Service (2 docs)', amount: '$400.00', status: 'shipped', email: 'pierre.blanc@outlook.com', phone: '7865550406', dob: '1973-07-02', address: '2900 Collins Ave', addressLine2: 'Unit 1802', city: 'Miami Beach', state: 'FL', zip: '33140', ori: '', tcn: '', scheduledAt: 'Jun 16, 2026 - 9:00 AM', completedAt: 'Jun 16, 2026 - 9:30 AM', earned: '+$400.00', bufferBefore: 0, bufferAfter: 0, notes: 'Divorce decree + court order — France' },
    { date: 'Jun 15', client: 'Sofia Ramos', service: 'FBI Background Check + Federal Apostille', amount: '$379.00', status: 'completed', email: 'sofia.r@gmail.com', phone: '3055550407', dob: '1988-05-25', address: '7200 NW 36th St', addressLine2: '', city: 'Miami', state: 'FL', zip: '33166', ori: 'FL112233G', tcn: '70CS1419420000000877', scheduledAt: 'Jun 15, 2026 - 1:00 PM', completedAt: 'Jun 15, 2026 - 1:40 PM', earned: '+$379.00', bufferBefore: 15, bufferAfter: 15, notes: 'Work visa for Spain — all documents received' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Service History</h3>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 cursor-pointer" onClick={() => onClientClick(item)}>
                <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-teal-700 hover:text-teal-900">{item.client}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.service}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.amount}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerformanceTab({ data }) {
  const metrics = [
    { label: 'Avg. Service Time', value: '22 min', change: '-3 min' },
    { label: 'Client Satisfaction', value: '4.8/5', change: '+0.2' },
    { label: 'Appointments/Day', value: '6.2', change: '+0.8' },
    { label: 'No-Show Rate', value: '4%', change: '-1%' },
    { label: 'Revenue/Appointment', value: '$168', change: '+$12' },
    { label: 'Return Clients', value: '34%', change: '+5%' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{m.value}</p>
            <p className="text-xs text-green-600 mt-1">{m.change} vs last month</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTab() {
  const technicians = [
    { name: 'Shah Saint-Cyr', email: 'shah@getproven.us', role: 'Admin', status: 'active', appointments: 142 },
    { name: 'Gary Pierre', email: 'gary@getproven.us', role: 'Technician', status: 'active', appointments: 98 },
    { name: 'Nigel Lewis', email: 'nigel@getproven.us', role: 'Technician', status: 'active', appointments: 76 },
    { name: 'Jenny Jeannot', email: 'jenny@getproven.us', role: 'Technician', status: 'active', appointments: 64 },
    { name: 'Anthony Goldstiewn', email: 'anthony@getproven.us', role: 'Technician', status: 'active', appointments: 51 },
    { name: 'Zarron', email: 'zarron@getproven.us', role: 'Technician', status: 'active', appointments: 45 },
    { name: 'Abner', email: 'abner@getproven.us', role: 'Technician', status: 'active', appointments: 38 },
    { name: 'Sam Jean', email: 'sam@getproven.us', role: 'Technician', status: 'active', appointments: 33 },
    { name: 'Micah Berkley', email: 'micah@getproven.us', role: 'Technician', status: 'active', appointments: 27 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Management</h3>
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Appointments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {technicians.map((tech) => (
                <tr key={tech.email} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{tech.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{tech.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tech.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                    }`}>{tech.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tech.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{tech.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{tech.appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Revenue (All Time)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$24,580</p>
          <p className="text-xs text-green-600 mt-1">+18% vs last quarter</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Technicians</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5 / 6</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 out of office</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Locations</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1 Active</p>
          <p className="text-xs text-amber-600 mt-1">Ft. Lauderdale opening Q3 2026</p>
        </div>
      </div>
    </div>
  );
}

function ClientDetailModal({ client, onClose }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone: client.phone || '',
    email: client.email || '',
    address: client.address || '',
    addressLine2: client.addressLine2 || '',
    city: client.city || '',
    state: client.state || '',
    zip: client.zip || '',
    ori: client.ori || '',
    tcn: client.tcn || '',
    notes: client.notes || '',
    bufferBefore: client.bufferBefore ?? 0,
    bufferAfter: client.bufferAfter ?? 0,
    status: client.status || 'scheduled',
    service: client.service || '',
  });
  const [saved, setSaved] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);
  const [jobStartTime, setJobStartTime] = useState(null);
  const [jobCompleted, setJobCompleted] = useState(false);
  const [jobCompleteTime, setJobCompleteTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formatDateTime = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' + formatTime(date);
  const formatElapsed = (s) => { const m = Math.floor(s / 60); const sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}`; };

  useEffect(() => {
    if (jobStarted && !jobCompleted) {
      const interval = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [jobStarted, jobCompleted]);

  const handleStartJob = () => {
    const now = new Date();
    setJobStarted(true);
    setJobStartTime(now);
    setForm({ ...form, status: 'in-progress' });
    setElapsed(0);
  };

  const handleCompleteJob = () => {
    const now = new Date();
    setJobCompleted(true);
    setJobCompleteTime(now);
    setForm({ ...form, status: 'completed' });
  };

  const name = client.client || client.name || 'Unknown';
  const isCompleted = form.status === 'completed' || form.status === 'shipped';
  const fullAddress = form.city
    ? `${form.address}${form.addressLine2 ? '\n' + form.addressLine2 : ''}\n${form.city}, ${form.state} ${form.zip}`
    : form.address || '';

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = 'w-full text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500';
  const labelClass = 'text-xs text-gray-500 dark:text-gray-400 mb-1 block';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* Status Badge + Close */}
        <div className="p-5 pb-0 flex items-center justify-between">
          {editing ? (
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="text-xs font-bold uppercase px-3 py-1.5 rounded-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500">
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ) : (
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
              form.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              form.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              form.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              form.status === 'in-progress' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' :
              form.status === 'pending' || form.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
              form.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>{form.status}</span>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="p-5 pt-3 space-y-5">

          {/* Saved confirmation */}
          {saved && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 text-sm px-3 py-2 rounded-lg">
              Changes saved successfully.
            </div>
          )}

          {/* Service Title + Schedule */}
          <div>
            {editing ? (
              <input type="text" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={`${inputClass} text-lg font-bold`} />
            ) : (
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{form.service}</h2>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Scheduled: {client.scheduledAt || client.time || 'N/A'}
            </p>
          </div>

          {/* Earned */}
          {(client.earned || client.amount) && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">{client.earned || client.amount}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Earned</span>
            </div>
          )}

          <hr className="border-gray-200 dark:border-slate-700" />

          {/* Client Info */}
          <div className="space-y-2">
            <p className="text-base font-semibold text-gray-900 dark:text-white">{name}</p>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address Line 2</label>
                  <input type="text" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} className={inputClass} placeholder="Suite, Apt, Unit" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} maxLength={2} />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP</label>
                    <input type="text" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className={inputClass} maxLength={10} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {form.phone && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <a href={`tel:${form.phone.replace(/\D/g, '')}`} className="hover:text-teal-600">{form.phone}</a>
                  </p>
                )}
                {form.email && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <a href={`mailto:${form.email}`} className="hover:text-teal-600">{form.email}</a>
                  </p>
                )}
                {fullAddress && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{fullAddress}</div>
                )}
              </>
            )}
          </div>

          <hr className="border-gray-200 dark:border-slate-700" />

          {/* Appointment Buffer */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Appointment Buffer</p>
            {editing ? (
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={form.bufferBefore} onChange={(e) => setForm({ ...form, bufferBefore: parseInt(e.target.value) || 0 })} className={`${inputClass} w-20 text-center`} />
                <span className="text-sm text-gray-500">min before /</span>
                <input type="number" min="0" value={form.bufferAfter} onChange={(e) => setForm({ ...form, bufferAfter: parseInt(e.target.value) || 0 })} className={`${inputClass} w-20 text-center`} />
                <span className="text-sm text-gray-500">min after</span>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {form.bufferBefore}min before / {form.bufferAfter}min after
              </p>
            )}
          </div>

          {/* ORI */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">ORI Number</p>
            {editing ? (
              <input type="text" value={form.ori} onChange={(e) => setForm({ ...form, ori: e.target.value.toUpperCase() })} className={`${inputClass} font-mono`} placeholder="e.g. FL924680Z" />
            ) : (
              <p className="text-sm font-mono text-gray-900 dark:text-white">{form.ori || 'N/A'}</p>
            )}
          </div>

          <hr className="border-gray-200 dark:border-slate-700" />

          {/* Completed / TCN */}
          {(isCompleted || editing) && (
            <div className="space-y-3">
              {client.completedAt && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Completed</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{client.completedAt}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">TCN</p>
                {editing ? (
                  <input type="text" value={form.tcn} onChange={(e) => setForm({ ...form, tcn: e.target.value })} className={`${inputClass} font-mono`} placeholder="e.g. 70CS1419420000000915" />
                ) : (
                  form.tcn ? <p className="text-sm font-mono text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 px-3 py-2 rounded">{form.tcn}</p> : <p className="text-sm text-gray-400">N/A</p>
                )}
              </div>
            </div>
          )}

          {/* Job Timer */}
          {(jobStarted || form.status === 'in-progress') && (
            <div className={`rounded-lg p-4 ${jobCompleted ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' : 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-xs font-semibold uppercase tracking-wide ${jobCompleted ? 'text-green-600 dark:text-green-400' : 'text-teal-600 dark:text-teal-400'}`}>
                  {jobCompleted ? 'Job Complete' : 'Job In Progress'}
                </p>
                {!jobCompleted && (
                  <span className="text-lg font-mono font-bold text-teal-700 dark:text-teal-300">{formatElapsed(elapsed)}</span>
                )}
              </div>
              {jobStartTime && (
                <p className="text-sm text-gray-600 dark:text-gray-300">Started: {formatDateTime(jobStartTime)}</p>
              )}
              {jobCompleteTime && (
                <p className="text-sm text-gray-600 dark:text-gray-300">Completed: {formatDateTime(jobCompleteTime)}</p>
              )}
              {jobCompleted && (
                <p className="text-sm text-gray-600 dark:text-gray-300">Duration: {formatElapsed(elapsed)}</p>
              )}
              {jobStarted && !jobCompleted && (
                <button onClick={handleCompleteJob} className="mt-3 w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                  Complete Job
                </button>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Notes</p>
            {editing ? (
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={`${inputClass} resize-none`} placeholder="Add notes about this appointment..." />
            ) : (
              form.notes ? <p className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded px-3 py-2">{form.notes}</p> : <p className="text-sm text-gray-400">No notes</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            {editing ? (
              <>
                <button onClick={handleSave} className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                  Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-center py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  Cancel
                </button>
              </>
            ) : (
              <>
                {!isCompleted && !jobStarted && form.status !== 'in-progress' && (
                  <button onClick={handleStartJob} className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg text-sm font-bold hover:bg-teal-700 transition">
                    Start Job
                  </button>
                )}
                {form.email && (
                  <a href={`mailto:${form.email}`} className={`flex-1 ${!isCompleted && !jobStarted && form.status !== 'in-progress' ? 'border border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20' : 'bg-teal-600 text-white hover:bg-teal-700'} text-center py-2.5 rounded-lg text-sm font-medium transition`}>
                    Email Client
                  </a>
                )}
                {form.phone && (
                  <a href={`tel:${form.phone.replace(/\D/g, '')}`} className="flex-1 border border-teal-600 text-teal-600 text-center py-2.5 rounded-lg text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition">
                    Call Client
                  </a>
                )}
                <button onClick={() => setEditing(true)} className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-center py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
