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
    { time: '9:00 AM', client: 'Maria Rodriguez', service: 'Fingerprinting', status: 'confirmed', email: 'maria.rodriguez@gmail.com', phone: '(305) 555-0101', dob: '1988-04-12', address: '1250 NE 2nd Ave, Miami, FL 33132', ori: '', notes: 'Regular client, prefers morning appointments' },
    { time: '10:30 AM', client: 'Jean Baptiste', service: 'FBI Background Check', status: 'confirmed', email: 'jean.baptiste@gmail.com', phone: '(305) 555-0102', dob: '1995-08-23', address: '3400 Biscayne Blvd, Miami, FL 33137', ori: 'FL924680Z', notes: 'Immigration application — needs expedited processing' },
    { time: '11:00 AM', client: 'Carlos Mejia', service: 'Apostille', status: 'pending', email: 'cmejia@outlook.com', phone: '(786) 555-0103', dob: '1979-11-05', address: '800 NE 71st St, Miami, FL 33138', ori: '', notes: 'Birth certificate apostille for Colombia' },
    { time: '1:00 PM', client: 'Ana Silva', service: 'FBI + Apostille', status: 'confirmed', email: 'ana.silva@yahoo.com', phone: '(954) 555-0104', dob: '1990-02-17', address: '2200 N Ocean Blvd, Ft. Lauderdale, FL 33305', ori: 'FL113355X', notes: 'Work visa for Portugal — FBI + federal apostille' },
    { time: '2:30 PM', client: 'Robert Johnson', service: 'Fingerprinting', status: 'confirmed', email: 'rjohnson@mail.com', phone: '(305) 555-0105', dob: '1983-06-30', address: '500 Brickell Ave, Miami, FL 33131', ori: '', notes: 'Security guard license renewal — 2 FD-258 cards needed' },
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
    { date: 'Mon, Jun 2', time: '9:00 AM', client: 'David Chen', service: 'FBI Background Check', email: 'david.chen@gmail.com', phone: '(305) 555-0201', dob: '1992-01-15', address: '900 NE 125th St, North Miami, FL 33161', ori: 'FL778899A', notes: 'Employment background check' },
    { date: 'Mon, Jun 2', time: '11:00 AM', client: 'Marie Dupont', service: 'Apostille (2 docs)', email: 'marie.dupont@outlook.com', phone: '(786) 555-0202', dob: '1985-07-22', address: '1500 Bay Rd, Miami Beach, FL 33139', ori: '', notes: 'Marriage certificate + birth certificate for France' },
    { date: 'Tue, Jun 3', time: '10:00 AM', client: 'Jose Martinez', service: 'Fingerprinting', email: 'jose.m@yahoo.com', phone: '(305) 555-0203', dob: '1998-03-08', address: '7400 SW 8th St, Miami, FL 33144', ori: '', notes: 'Concealed weapons permit' },
    { date: 'Tue, Jun 3', time: '2:00 PM', client: 'Lisa Wong', service: 'FBI + Apostille', email: 'lwong@mail.com', phone: '(954) 555-0204', dob: '1987-12-01', address: '3000 E Commercial Blvd, Ft. Lauderdale, FL 33308', ori: 'FL445566B', notes: 'Teaching position in Dubai' },
    { date: 'Wed, Jun 4', time: '9:30 AM', client: 'Pierre Louis', service: 'Fingerprinting', email: 'pierre.l@gmail.com', phone: '(305) 555-0205', dob: '2001-09-14', address: '200 NE 36th St, Miami, FL 33137', ori: '', notes: 'Security guard license — first time' },
    { date: 'Thu, Jun 5', time: '1:00 PM', client: 'Sarah Brown', service: 'Apostille (1 doc)', email: 'sarah.b@gmail.com', phone: '(305) 555-0206', dob: '1976-05-19', address: '1200 Brickell Ave, Miami, FL 33131', ori: '', notes: 'Corporate document for UK business registration' },
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
    { name: 'James Wilson', client: 'James Wilson', service: 'FBI Background Check', submitted: '2 hours ago', status: 'new', email: 'james.wilson@gmail.com', phone: '(305) 555-0301', dob: '1991-10-22', address: '600 NE 27th St, Miami, FL 33137', ori: 'FL998877C', notes: 'Needs FBI check for state licensing board' },
    { name: 'Sophie Laurent', client: 'Sophie Laurent', service: 'Apostille', submitted: '5 hours ago', status: 'new', email: 'sophie.l@outlook.com', phone: '(786) 555-0302', dob: '1993-04-11', address: '1800 NW 7th Ave, Miami, FL 33136', ori: '', notes: 'Diploma apostille for French university' },
    { name: 'Miguel Santos', client: 'Miguel Santos', service: 'Fingerprinting', submitted: '1 day ago', status: 'reviewed', email: 'miguel.s@yahoo.com', phone: '(305) 555-0303', dob: '1986-08-03', address: '4500 NW 27th Ave, Miami, FL 33142', ori: '', notes: 'Out-of-state submission — needs PDF + ink card' },
    { name: 'Fatima Hassan', client: 'Fatima Hassan', service: 'FBI + Apostille', submitted: '1 day ago', status: 'reviewed', email: 'fatima.h@gmail.com', phone: '(954) 555-0304', dob: '1989-12-25', address: '2700 N Federal Hwy, Ft. Lauderdale, FL 33306', ori: 'FL223344D', notes: 'Immigration to UAE — expedite if possible' },
    { name: 'John Peters', client: 'John Peters', service: 'Fingerprinting', submitted: '2 days ago', status: 'contacted', email: 'jpeters@mail.com', phone: '(305) 555-0305', dob: '1975-02-28', address: '8900 SW 107th Ave, Miami, FL 33176', ori: '', notes: 'Private investigator license — 2 cards' },
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
    { date: 'May 23', client: 'Ana Garcia', service: 'Fingerprinting', amount: '$99', status: 'completed', email: 'ana.garcia@gmail.com', phone: '(305) 555-0401', dob: '1994-06-18', address: '3200 NE 1st Ave, Miami, FL 33137', ori: '', notes: 'Completed — 2 FD-258 cards mailed' },
    { date: 'May 22', client: 'Tom Harris', service: 'FBI + Apostille', amount: '$329', status: 'completed', email: 'tom.harris@outlook.com', phone: '(786) 555-0402', dob: '1980-11-30', address: '1700 NW 10th Ave, Miami, FL 33136', ori: 'FL556677E', notes: 'FBI results received, apostille shipped' },
    { date: 'May 22', client: 'Marie Jean', service: 'Apostille', amount: '$200', status: 'shipped', email: 'marie.jean@yahoo.com', phone: '(305) 555-0403', dob: '1996-03-07', address: '5600 SW 72nd St, Miami, FL 33143', ori: '', notes: 'Birth certificate — shipped to Haiti consulate' },
    { date: 'May 21', client: 'Kevin Brown', service: 'Fingerprinting', amount: '$99', status: 'completed', email: 'kbrown@gmail.com', phone: '(954) 555-0404', dob: '1982-09-22', address: '4400 N Federal Hwy, Ft. Lauderdale, FL 33308', ori: '', notes: 'Real estate license application' },
    { date: 'May 21', client: 'Laura Chen', service: 'FBI Background Check', amount: '$129', status: 'completed', email: 'laura.chen@mail.com', phone: '(305) 555-0405', dob: '1999-01-14', address: '1000 NE 2nd Ave, Miami, FL 33132', ori: 'FL889900F', notes: 'Adoption background check' },
    { date: 'May 20', client: 'Pierre Blanc', service: 'Apostille (2 docs)', amount: '$400', status: 'shipped', email: 'pierre.blanc@outlook.com', phone: '(786) 555-0406', dob: '1973-07-02', address: '2900 Collins Ave, Miami Beach, FL 33140', ori: '', notes: 'Divorce decree + court order — France' },
    { date: 'May 19', client: 'Sofia Ramos', service: 'FBI + Apostille', amount: '$379', status: 'completed', email: 'sofia.r@gmail.com', phone: '(305) 555-0407', dob: '1988-05-25', address: '7200 NW 36th St, Miami, FL 33166', ori: 'FL112233G', notes: 'Work visa for Spain — all documents received' },
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
  const name = client.client || client.name || 'Unknown';
  const serviceHistory = [
    { date: 'Jun 20, 2026', service: client.service, status: client.status || 'scheduled' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-teal-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-teal-100 text-sm">{client.service}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{client.email || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{client.phone || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{client.dob ? new Date(client.dob + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{client.address || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Service Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Service Type</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{client.service}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">ORI Number</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{client.ori || 'N/A'}</p>
              </div>
              {client.time && (
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Appointment Time</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{client.time}{client.date ? ` — ${client.date}` : ''}</p>
                </div>
              )}
              {client.status && (
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === 'confirmed' || client.status === 'completed' ? 'bg-green-100 text-green-700' :
                    client.status === 'pending' || client.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                    client.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{client.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Notes</h3>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                <p className="text-sm text-amber-900 dark:text-amber-200">{client.notes}</p>
              </div>
            </div>
          )}

          {/* Service History */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Service History</h3>
            <div className="bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Service</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                  {serviceHistory.map((h, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{h.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{h.service}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          h.status === 'confirmed' || h.status === 'completed' ? 'bg-green-100 text-green-700' :
                          h.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{h.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                Email Client
              </a>
            )}
            {client.phone && (
              <a href={`tel:${client.phone.replace(/\D/g, '')}`} className="flex-1 border border-teal-600 text-teal-600 text-center py-2.5 rounded-lg text-sm font-medium hover:bg-teal-50 transition">
                Call Client
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
