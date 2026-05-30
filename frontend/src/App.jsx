import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { I18nProvider } from './lib/i18n';
import Layout from './components/Layout';
import Services from './pages/Services';
import Intake from './pages/Intake';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import Pipeline from './pages/Pipeline';
import OriCodes from './pages/OriCodes';
import ApostilleLanding from './pages/ApostilleLanding';
import ApostilleOrder from './pages/ApostilleOrder';
import BookAppointment from './pages/BookAppointment';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ManageAppointment from './pages/ManageAppointment';

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Services />} />
              <Route path="/book" element={<Intake />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/ori-codes" element={<OriCodes />} />
              <Route path="/apostille" element={<ApostilleLanding />} />
              <Route path="/apostille-order" element={<ApostilleOrder />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/manage-appointment" element={<ManageAppointment />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}
