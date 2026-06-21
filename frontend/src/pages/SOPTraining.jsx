import { useState } from 'react';

const modules = [
  {
    id: 'fingerprint',
    title: 'Fingerprint Capture Procedures',
    sections: [
      { title: 'Equipment Setup', items: ['Power on LiveScan device', 'Ensure connection to FDLE portal', 'Load FD-258 blank cards', 'Calibrate scanner if needed'] },
      { title: 'Client Check-in', items: ['Verify government-issued photo ID', 'Confirm ORI number if provided', 'Collect intake form or direct to online form', 'Verify residency status (resident vs non-resident pricing)'] },
      { title: 'Capture Process', items: ['Clean client fingers with alcohol wipes', 'Roll each finger from nail to nail (right hand, then left)', 'Capture flat impressions of four fingers simultaneously', 'Capture both thumbs flat', 'Review print quality — reject smudged or incomplete prints', 'Re-capture any prints below quality threshold'] },
      { title: 'Post-Capture', items: ['Submit electronically if applicable', 'Print FD-258 card for mail-in submissions', 'Offer PDF copy option to client', 'Issue receipt and confirmation code'] },
    ],
  },
  {
    id: 'fbi',
    title: 'FBI Background Check Processing',
    sections: [
      { title: 'Intake Requirements', items: ['Collect completed FBI intake form', 'Verify SSN provided', 'Confirm reason for check and ORI', 'Check residency status for pricing'] },
      { title: 'Submission', items: ['Capture fingerprints per standard procedure', 'Package FD-258 card with cover letter', 'Send to FBI CJIS Division, Clarksburg, WV', 'Log submission date and tracking number'] },
      { title: 'Status Tracking', items: ['Check FBI portal for processing updates', 'Update client status in dashboard', 'Contact client when results received', 'Forward results securely via encrypted email or in-person pickup'] },
    ],
  },
  {
    id: 'apostille',
    title: 'Apostille Workflow',
    sections: [
      { title: 'Document Intake', items: ['Verify document type (birth cert, marriage, diploma, FBI report)', 'Determine jurisdiction — state vs federal', 'Check Hague Convention membership for destination country', 'Photograph/scan document for records'] },
      { title: 'State Apostille', items: ['Complete state authentication request form', 'Submit to Secretary of State (Florida: Tallahassee)', 'Track processing status', 'Timeline: 3–15 business days by mail, same-day for walk-in'] },
      { title: 'Federal Apostille', items: ['Submit to U.S. Department of State, Office of Authentications', 'Address: 600 19th St NW, Washington, DC 20006', 'Timeline: 3–5 weeks standard', 'Include prepaid return envelope', 'Track via travel.state.gov'] },
      { title: 'Completion', items: ['Verify apostille stamp/certificate is properly attached', 'Notify client of completion', 'Ship via selected method (standard, expedited, international)'] },
    ],
  },
  {
    id: 'customer',
    title: 'Customer Service Standards',
    sections: [
      { title: 'Communication', items: ['Answer phone within 3 rings during business hours', 'Respond to emails within 2 business hours', 'Confirm appointments via text 24 hours before', 'Send completion notifications within 1 hour of service'] },
      { title: 'Handling Issues', items: ['Never argue with clients — escalate to admin', 'Offer reschedule for missed appointments (1 free reschedule)', 'Process refunds only for services not yet performed', 'Document all complaints in the dashboard'] },
      { title: 'Privacy & Security', items: ['Never discuss client info with other clients', 'Shred physical documents after scanning', 'Log out of all systems when stepping away', 'Do not store SSN or biometric data locally'] },
    ],
  },
];

export default function SOPTraining() {
  const [activeModule, setActiveModule] = useState('fingerprint');
  const [completedItems, setCompletedItems] = useState({});

  const toggleItem = (moduleId, sectionIdx, itemIdx) => {
    const key = `${moduleId}-${sectionIdx}-${itemIdx}`;
    setCompletedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const mod = modules.find((m) => m.id === activeModule);
  const totalItems = mod?.sections.reduce((sum, s) => sum + s.items.length, 0) || 0;
  const completedCount = mod?.sections.reduce((sum, s, si) => sum + s.items.filter((_, ii) => completedItems[`${mod.id}-${si}-${ii}`]).length, 0) || 0;
  const pct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">SOP Training</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Standard Operating Procedures — review each module and check off completed items.</p>

      <div className="flex gap-2 flex-wrap mb-6">
        {modules.map((m) => (
          <button key={m.id} onClick={() => setActiveModule(m.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeModule === m.id ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-teal-400'}`}>
            {m.title}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mod?.title}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{completedCount}/{totalItems} ({pct}%)</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {mod?.sections.map((section, si) => (
          <div key={si} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, ii) => {
                const key = `${mod.id}-${si}-${ii}`;
                const done = completedItems[key];
                return (
                  <li key={ii}>
                    <label className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition ${done ? 'bg-teal-50 dark:bg-teal-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                      <input type="checkbox" checked={!!done} onChange={() => toggleItem(mod.id, si, ii)}
                        className="mt-0.5 rounded text-teal-600 border-gray-300 dark:border-slate-500" />
                      <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
