import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

const TABS = ['Today', 'Scheduled', 'Intakes', 'Calendar', 'Earnings', 'History', 'Performance'];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');
  const [outOfOffice, setOutOfOffice] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {displayName}</p>
        </div>
        {/* Out of Office Toggle */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
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
                  ? 'border-indigo-600 text-indigo-600'
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
        {activeTab === 'Today' && <TodayTab data={data} />}
        {activeTab === 'Scheduled' && <ScheduledTab data={data} />}
        {activeTab === 'Intakes' && <IntakesTab data={data} />}
        {activeTab === 'Calendar' && <CalendarTab />}
        {activeTab === 'Earnings' && <EarningsTab data={data} />}
        {activeTab === 'History' && <HistoryTab data={data} />}
        {activeTab === 'Performance' && <PerformanceTab data={data} />}
      </div>
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

function TodayTab({ data }) {
  const appointments = [
    { time: '9:00 AM', client: 'Maria Rodriguez', service: 'Fingerprinting', status: 'confirmed' },
    { time: '10:30 AM', client: 'Jean Baptiste', service: 'FBI Background Check', status: 'confirmed' },
    { time: '11:00 AM', client: 'Carlos Mejia', service: 'Apostille', status: 'pending' },
    { time: '1:00 PM', client: 'Ana Silva', service: 'FBI + Apostille', status: 'confirmed' },
    { time: '2:30 PM', client: 'Robert Johnson', service: 'Fingerprinting', status: 'confirmed' },
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
                <p className="text-sm font-medium text-gray-900">{apt.client}</p>
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

function ScheduledTab({ data }) {
  const upcoming = [
    { date: 'Mon, Jun 2', time: '9:00 AM', client: 'David Chen', service: 'FBI Background Check' },
    { date: 'Mon, Jun 2', time: '11:00 AM', client: 'Marie Dupont', service: 'Apostille (2 docs)' },
    { date: 'Tue, Jun 3', time: '10:00 AM', client: 'Jose Martinez', service: 'Fingerprinting' },
    { date: 'Tue, Jun 3', time: '2:00 PM', client: 'Lisa Wong', service: 'FBI + Apostille' },
    { date: 'Wed, Jun 4', time: '9:30 AM', client: 'Pierre Louis', service: 'Fingerprinting' },
    { date: 'Thu, Jun 5', time: '1:00 PM', client: 'Sarah Brown', service: 'Apostille (1 doc)' },
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
                <p className="text-sm font-medium text-gray-900">{apt.client}</p>
                <p className="text-xs text-gray-500">{apt.service}</p>
              </div>
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntakesTab({ data }) {
  const intakes = [
    { name: 'James Wilson', service: 'FBI Background Check', submitted: '2 hours ago', status: 'new' },
    { name: 'Sophie Laurent', service: 'Apostille', submitted: '5 hours ago', status: 'new' },
    { name: 'Miguel Santos', service: 'Fingerprinting', submitted: '1 day ago', status: 'reviewed' },
    { name: 'Fatima Hassan', service: 'FBI + Apostille', submitted: '1 day ago', status: 'reviewed' },
    { name: 'John Peters', service: 'Fingerprinting', submitted: '2 days ago', status: 'contacted' },
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
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
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
                  isToday ? 'bg-indigo-600 text-white font-bold' :
                  'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day}
                {isBusy && !isToday && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-indigo-400 rounded-full" /> Appointments booked
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
                  className="w-8 bg-indigo-500 rounded-t"
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

function HistoryTab({ data }) {
  const history = [
    { date: 'May 23', client: 'Ana Garcia', service: 'Fingerprinting', amount: '$99', status: 'completed' },
    { date: 'May 22', client: 'Tom Harris', service: 'FBI + Apostille', amount: '$329', status: 'completed' },
    { date: 'May 22', client: 'Marie Jean', service: 'Apostille', amount: '$200', status: 'shipped' },
    { date: 'May 21', client: 'Kevin Brown', service: 'Fingerprinting', amount: '$99', status: 'completed' },
    { date: 'May 21', client: 'Laura Chen', service: 'FBI Background Check', amount: '$129', status: 'completed' },
    { date: 'May 20', client: 'Pierre Blanc', service: 'Apostille (2 docs)', amount: '$400', status: 'shipped' },
    { date: 'May 19', client: 'Sofia Ramos', service: 'FBI + Apostille', amount: '$379', status: 'completed' },
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
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.client}</td>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 font-medium">{m.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
            <p className="text-xs text-green-600 mt-1">{m.change} vs last month</p>
          </div>
        ))}
      </div>
    </div>
  );
}
