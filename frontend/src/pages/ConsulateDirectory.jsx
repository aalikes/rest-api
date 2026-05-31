import { useState } from 'react';

const consulates = [
  { country: 'Argentina', city: 'Miami', phone: '(305) 373-7794', address: '1101 Brickell Ave Suite 900, Miami, FL 33131', website: 'https://www.consuladoargentino-miami.org' },
  { country: 'Brazil', city: 'Miami', phone: '(305) 285-6200', address: '80 SW 8th St Suite 2600, Miami, FL 33130', website: 'https://miami.itamaraty.gov.br' },
  { country: 'Canada', city: 'Miami', phone: '(305) 579-1600', address: '200 S Biscayne Blvd Suite 1600, Miami, FL 33131', website: 'https://www.international.gc.ca' },
  { country: 'Chile', city: 'Miami', phone: '(305) 373-8623', address: '800 Brickell Ave Suite 1230, Miami, FL 33131', website: 'https://www.chile.gob.cl' },
  { country: 'Colombia', city: 'Miami', phone: '(305) 441-1235', address: '280 Aragon Ave, Coral Gables, FL 33134', website: 'https://miami.consulado.gov.co' },
  { country: 'Costa Rica', city: 'Miami', phone: '(305) 871-7485', address: '1600 NW LeJeune Rd Suite 102, Miami, FL 33126', website: 'https://www.rree.go.cr' },
  { country: 'Dominican Republic', city: 'Miami', phone: '(305) 358-3221', address: '1038 Brickell Ave, Miami, FL 33131', website: 'https://www.mirex.gob.do' },
  { country: 'Ecuador', city: 'Miami', phone: '(305) 539-8214', address: '117 NW 42nd Ave, Miami, FL 33126', website: 'https://www.cancilleria.gob.ec' },
  { country: 'France', city: 'Miami', phone: '(305) 403-4150', address: '1395 Brickell Ave Suite 1050, Miami, FL 33131', website: 'https://miami.consulfrance.org' },
  { country: 'Germany', city: 'Miami', phone: '(305) 358-0290', address: '100 N Biscayne Blvd Suite 2200, Miami, FL 33132', website: 'https://www.germany.info/miami' },
  { country: 'Guatemala', city: 'Miami', phone: '(305) 679-9945', address: '1101 Brickell Ave Suite 603-S, Miami, FL 33131', website: 'https://www.minex.gob.gt' },
  { country: 'Haiti', city: 'Miami', phone: '(305) 859-2003', address: '259 SW 13th St, Miami, FL 33130', website: 'https://www.haiti.org' },
  { country: 'Honduras', city: 'Miami', phone: '(305) 269-9076', address: '4700 NW 2nd Ave Suite 102, Miami, FL 33127', website: 'https://www.sre.gob.hn' },
  { country: 'Israel', city: 'Miami', phone: '(305) 925-9400', address: '100 N Biscayne Blvd Suite 1800, Miami, FL 33132', website: 'https://embassies.gov.il/miami' },
  { country: 'Italy', city: 'Miami', phone: '(305) 374-6322', address: '4000 Ponce de Leon Blvd Suite 590, Coral Gables, FL 33146', website: 'https://consmiami.esteri.it' },
  { country: 'Jamaica', city: 'Miami', phone: '(305) 374-8431', address: '25 SE 2nd Ave Suite 824, Miami, FL 33131', website: 'https://www.mfaft.gov.jm' },
  { country: 'Japan', city: 'Miami', phone: '(305) 530-9090', address: '80 SW 8th St Suite 3200, Miami, FL 33130', website: 'https://www.miami.us.emb-japan.go.jp' },
  { country: 'Mexico', city: 'Miami', phone: '(786) 268-4900', address: '1399 SW 1st Ave, Miami, FL 33135', website: 'https://consulmex.sre.gob.mx/miami' },
  { country: 'Nicaragua', city: 'Miami', phone: '(305) 265-1415', address: '8532 SW 8th St Suite 270, Miami, FL 33144', website: 'https://www.cancilleria.gob.ni' },
  { country: 'Panama', city: 'Miami', phone: '(305) 447-3700', address: '1990 NW 87th Ave, Doral, FL 33172', website: 'https://www.mire.gob.pa' },
  { country: 'Peru', city: 'Miami', phone: '(305) 374-1305', address: '444 Brickell Ave Suite 135, Miami, FL 33131', website: 'https://www.consulado.pe/miami' },
  { country: 'Spain', city: 'Miami', phone: '(305) 446-5511', address: '2655 Le Jeune Rd Suite 203, Coral Gables, FL 33134', website: 'https://www.exteriores.gob.es/miami' },
  { country: 'Trinidad and Tobago', city: 'Miami', phone: '(305) 374-2199', address: '1000 Brickell Ave Suite 800, Miami, FL 33131', website: 'https://www.foreign.gov.tt' },
  { country: 'United Kingdom', city: 'Miami', phone: '(305) 400-6400', address: '1001 Brickell Bay Dr Suite 2800, Miami, FL 33131', website: 'https://www.gov.uk/miami' },
  { country: 'Uruguay', city: 'Miami', phone: '(305) 443-9764', address: '1077 Ponce De Leon Blvd Suite B, Coral Gables, FL 33134', website: 'https://www.mrree.gub.uy' },
  { country: 'Venezuela', city: 'Miami', phone: '(786) 359-6079', address: '1101 Brickell Ave Suite 901, Miami, FL 33131', website: '' },
];

export default function ConsulateDirectory() {
  const [search, setSearch] = useState('');
  const filtered = consulates.filter((c) => c.country.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Consulate & Embassy Directory</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Foreign consulates in the Miami / South Florida area. Contact them for country-specific apostille and authentication requirements.</p>

      <div className="mb-6">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by country..."
          className="w-full sm:w-96 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2.5 text-sm" />
      </div>

      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          <div className="col-span-3">Country</div>
          <div className="col-span-4">Address</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-3">Website</div>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">No consulates found matching "{search}"</div>
        )}
        {filtered.map((c) => (
          <div key={c.country} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-4 py-3 border-b dark:border-slate-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
            <div className="sm:col-span-3 font-medium text-gray-900 dark:text-white text-sm">{c.country}</div>
            <div className="sm:col-span-4 text-gray-600 dark:text-gray-300 text-sm">{c.address}</div>
            <div className="sm:col-span-2">
              <a href={`tel:${c.phone}`} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">{c.phone}</a>
            </div>
            <div className="sm:col-span-3">
              {c.website ? <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 dark:text-teal-400 hover:underline truncate block">Visit →</a> : <span className="text-sm text-gray-400">—</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">About Apostille Authentication</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          An apostille is a certificate issued under the Hague Convention that authenticates documents for use in other member countries. The United States has been a member since 1981.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          <strong>State-issued documents</strong> (birth certificates, marriage licenses, court documents) are processed by your state's Secretary of State.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          <strong>Federal documents</strong> (FBI background checks) must go to the U.S. Department of State in Washington, D.C.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          For more details on the federal process, visit the <a href="https://travel.state.gov/content/travel/en/replace-certify-docs/authenticate-your-document/office-of-authentications.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">U.S. Department of State — Office of Authentications</a>.
        </p>
      </div>
    </div>
  );
}
