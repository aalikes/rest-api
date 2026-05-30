export default function OriCodes() {
  const codes = [
    { ori: 'FL920010Z', agency: 'Florida Department of Law Enforcement (FDLE)', type: 'State' },
    { ori: 'FL920020Z', agency: 'Florida Department of Children and Families', type: 'State' },
    { ori: 'FL920030Z', agency: 'Agency for Health Care Administration (AHCA)', type: 'State' },
    { ori: 'FL920040Z', agency: 'Florida Department of Education', type: 'State' },
    { ori: 'FL920050Z', agency: 'Florida Department of Financial Services', type: 'State' },
    { ori: 'FL920060Z', agency: 'Florida Real Estate Commission', type: 'State' },
    { ori: 'FL920070Z', agency: 'Florida Department of Insurance', type: 'State' },
    { ori: 'FL920080Z', agency: 'Florida Bar Association', type: 'State' },
    { ori: 'USMIFLC00', agency: 'U.S. Citizenship and Immigration Services (USCIS)', type: 'Federal' },
    { ori: 'DCHQ0001', agency: 'FBI Criminal Justice Information Services', type: 'Federal' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Florida ORI Codes</h1>
      <p className="text-gray-600 mt-1">Common ORI codes used for fingerprint submissions in Florida.</p>

      <div className="mt-6 bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ORI Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {codes.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono font-medium text-indigo-700">{c.ori}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{c.agency}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    c.type === 'Federal' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>{c.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> ORI codes may change. Please verify with the requesting agency before your appointment. 
          If you are unsure which ORI code to use, our technicians will assist you during your visit.
        </p>
      </div>
    </div>
  );
}
