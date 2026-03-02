import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import VocabularyDetailPage from './pages/VocabularyDetailPage';
import PhrasesPage from './pages/PhrasesPage';
import PhrasesDetailPage from './pages/PhrasesDetailPage';
import PracticePage from './pages/PracticePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/vocabulary/:topicId" element={<VocabularyDetailPage />} />
        <Route path="/vocabulary/:topicId/practice" element={<PracticePage />} />
        <Route path="/phrases" element={<PhrasesPage />} />
        <Route path="/phrases/:topicId" element={<PhrasesDetailPage />} />
        <Route path="/phrases/:topicId/practice" element={<PracticePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
