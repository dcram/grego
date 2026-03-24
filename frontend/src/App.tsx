import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ChantsPage from "@/pages/ChantsPage";
import ChantDetailPage from "@/pages/ChantDetailPage";
import TagsPage from "@/pages/TagsPage";
import SourcesPage from "@/pages/SourcesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chants" element={<ChantsPage />} />
        <Route path="/chants/:id" element={<ChantDetailPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/sources" element={<SourcesPage />} />
      </Route>
    </Routes>
  );
}
