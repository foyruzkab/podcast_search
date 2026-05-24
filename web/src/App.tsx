import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PodcastDetail from './pages/PodcastDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/podcasts/:id" element={<PodcastDetail />} />
    </Routes>
  );
}
