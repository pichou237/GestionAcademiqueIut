import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// import des composant
import Footer from '../src/assets/components/Home/footer';
import Header from './assets/components/Home/Header';
import AuthPage from './assets/components/Login/AuthPage';
import DashboardPage from './assets/components/Dashboard/DashboardPage';
import SeancesPage from './assets/components/pages/SeancesPage';
import StudentsPage from './assets/components/pages/StudensPage';
import TeacherPage from './assets/components/pages/TeacherPage';
import PresencePage from './assets/components/pages/PresencePage';
import SallesPage from './assets/components/pages/SallesPage';
import CoursPage from './assets/components/pages/CoursPage';
// import NavDash from './assets/components/Dashboard/NavDash';

function App() {

  return (
    <div className=''>
      {/* header */}
      <Header />

      <div className=''>
      <Router>
            <Routes>
              <Route path="/register" element={<AuthPage type="register" />} />
              <Route path="/login" element={<AuthPage type="login" />} />
              <Route path="/" element={<AuthPage type="login" />} />
              <Route path="/DashboardPage" element={<DashboardPage />} />
              <Route path="/" element={<Footer />} />
              <Route path="/seances" element={<SeancesPage />} />
              <Route path="/etudiants" element={<StudentsPage />} />
              <Route path="/Teacher" element={<TeacherPage />} />

              <Route path="/presences" element={<PresencePage  />} />
              <Route path="/salles" element={<SallesPage  />} />
              <Route path="/cours" element={<CoursPage  />} />
            </Routes>
        </Router>
      </div>
      {/* footer */}
      {/* <Footer /> */}
    </div>
  )
}

export default App
