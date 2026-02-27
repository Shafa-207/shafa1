import TrackCard from "../MyComponents/TrackCard";
import styled from "styled-components";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: flex-start;
`;

export default function Page1() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ambilData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data); // Simpan data array dari MongoDB
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };
    ambilData();
  }, []);

  return (
    <Container>
      {/* 3. Looping data posts */}
      {posts.length > 0 ? (
        posts.map((item) => (
          <TrackCard
            key={item._id} // ID unik dari MongoDB
            title={item.title}
            content={item.content}
            author={item.author}
            date={item.createdAt}
          />
        ))
      ) : (
        <p>Sedang mengambil data atau data kosong...</p>
      )}
    </Container>
  );
}
