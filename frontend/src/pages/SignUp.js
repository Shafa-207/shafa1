import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function SignUp() {
  const url = "https://www.shafalk.web.id/user/";

  const [post, setPost] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [conPass, setconPass] = useState("");

  const [status, setStatus] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    if (status) {
      // LOGIKA REGISTER (Sudah OK, tinggal rapihkan dikit)
      if (post.password !== conPass) {
        alert("Password tidak cocok!");
        return;
      }
      try {
        await axios.post(`${url}register`, post);
        alert("Berhasil Daftar!");
        navigate("/page1");
      } catch (err) {
        alert("Gagal daftar!");
      }
    } else {
      // LOGIKA LOGIN (Perbaikan)
      try {
        // Sebaiknya Backend punya endpoint /login
        const response = await axios.post(`${url}login`, {
          email: post.email,
          password: post.password,
        });

        if (response.data.success) {
          alert("Login Berhasil!");
          navigate("/page1");
        } else {
          alert("Email atau Password salah!");
        }
      } catch (err) {
        alert("Login Gagal! Cek koneksi atau data anda.");
      }
    }
  };

  return (
    <Container>
      <div>Register Page</div>
      <Form onSubmit={handleAuth}>
        {status === true ? (
          <input
            type="text"
            placeholder="name"
            value={post.name}
            onChange={(e) => setPost({ ...post, name: e.target.value })}
          />
        ) : null}
        <input
          type="email"
          placeholder="Email"
          value={post.email}
          onChange={(e) => setPost({ ...post, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={post.password}
          onChange={(e) => setPost({ ...post, password: e.target.value })}
        />
        {status === true ? (
          <input
            type="password"
            placeholder="Confirm Password"
            value={conPass}
            onChange={(e) => setconPass(e.target.value)}
          />
        ) : null}

        {/* 2. Teks tombol utama berubah otomatis */}
        <button type="submit">{status ? "Create Account" : "Sign In"}</button>
      </Form>
      {/* 3. Tombol saklar untuk pindah mode */}
      <button onClick={() => setStatus(!status)}>
        {status
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
    </Container>
  );
}
