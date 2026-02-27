import "./App.css";
import Page1 from "./pages/Page1";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <MainLayout>
      <SideBar />
      <ContentArea>
        <Routes>
          <Route path="/" element={<h1>Selamat Datang!</h1>} />
          <Route path="/page1" element={<Page1 />} />
        </Routes>
      </ContentArea>
    </MainLayout>
  );
}

export default App;
