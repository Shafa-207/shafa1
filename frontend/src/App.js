import "./App.css";
import Page from "./pages/Page";
import SignUp from "./pages/SignUp";
import { Routes, Route, Outlet } from "react-router-dom";
import styled from "styled-components";
import SideBar from "./MyComponents/SideBar";

const MainLayout = styled.div`
  display: flex;
`;

const ContentArea = styled.main`
  margin-left: 240px; /* Harus sama dengan lebar Sidebar */
  padding: 40px;
  width: 100%;
  min-height: 100vh;
`;

const LayoutDenganSidebar = ({ uri }) => (
  <MainLayout>
    <SideBar uri={uri} />
    <ContentArea>
      {/* Outlet adalah tempat halaman (Page) akan muncul */}
      <Outlet />
    </ContentArea>
  </MainLayout>
);

function App() {
  const uri = [
    "https://www.shafalk.web.id/notes/",
    "https://www.raquella.web.id/notes/",
  ];
  return (
    <Routes>
      {/* Halaman Tanpa Sidebar */}
      <Route path="/register" element={<SignUp />} />

      {/* Halaman Dengan Sidebar (Membungkus Page) */}
      <Route element={<LayoutDenganSidebar uri={uri} />}>
        {uri.map((item, index) => (
          <Route
            key={index}
            path={`/page${index + 1}`}
            element={<Page key={item} uri={item} />}
          />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
