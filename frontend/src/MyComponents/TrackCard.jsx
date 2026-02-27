import React from "react";
import styled from "styled-components";

// --- STYLED COMPONENTS (Gabung di sini) ---
const CardContainer = styled.div`
  background-color: white;
  border: 1px solid #f0f1f3;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: 10px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #1a1a1a;
  font-weight: bold;
`;

const Content = styled.p`
  margin: 0;
  font-size: 14px;
  color: #5e5f61;
  line-height: 1.5;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #ececec;
  margin: 8px 0;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaInfo = styled.span`
  font-size: 12px;
  color: #a8a9ab;
`;

const Author = styled.span`
  font-size: 13px;
  color: #5d59ad;
  font-weight: 600;
`;

// --- KOMPONEN UTAMA ---
export default function TrackCard({
  title = "Judul Default Track",
  content = "Ini adalah konten atau deskripsi track yang bisa kamu isi sesuai kebutuhan belajar kamu.",
  date = "27 Februari 2026",
  time = "14:00 WIB",
  author = "Shafa",
}) {
  return (
    <CardContainer>
      {/* 1. Title */}
      <Title>{title}</Title>

      {/* 2. Content */}
      <Content>{content}</Content>

      <Divider />

      <FooterWrapper>
        {/* 3. Waktu dan Tanggal */}
        <MetaInfo>
          {date} • {time}
        </MetaInfo>

        {/* 4. Author */}
        <Author>Author: {author}</Author>
      </FooterWrapper>
    </CardContainer>
  );
}
