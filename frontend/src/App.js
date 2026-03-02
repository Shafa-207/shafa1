import "./App.css";
import Page from "./pages/Page";
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
  const uri = [
    "https://www.shafalk.web.id/notes/",
    "https://www.raquella.web.id/notes/",
  ];
  return (
    <MainLayout>
      <SideBar uri={uri} />
      <ContentArea>
        <Routes>
          <Route path="/" element={<h1>Selamat Datang!</h1>} />
          {uri.map((item, index) => (
            <Route
              key={index}
              path={`/page${index + 1}`}
              element={<Page key={item} uri={item} />}
            />
          ))}
        </Routes>
      </ContentArea>
    </MainLayout>
  );
}

export default App;
