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
  min-height: 100vh;
  width: 100%;
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
        const response = await axios.post(`${url}register`, post);
        // Cek status HTTP-nya, bukan isi propertinya
        if (response.status === 200) {
          localStorage.setItem("token", "dummy-token-dulu"); // Nanti kita bahas cara dapat token asli
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/page1");
          alert("Berhasil Daftar!");
          navigate("/page1");
          setStatus(false);
          // Bersihkan form setelah sukses daftar
          setPost({ email: "", name: "", password: "" });
          setconPass("");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Gagal mendaftar!";
        alert(errorMessage);
        // Sekarang alert akan muncul: "Email ini sudah terdaftar!" bukan cuma "Gagal daftar!"
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
          // Bersihkan form setelah sukses daftar
          setPost({ email: "", name: "", password: "" });
          setconPass("");
        } else {
          alert("Email atau Password salah!");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Login Gagal! Cek koneksi atau data anda.";
        alert(errorMessage);
        // Sekarang alert akan muncul: "Email ini sudah terdaftar!" bukan cuma "Gagal daftar!"
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
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        />
        {/* Tips: Kasih instruksi ke user
        <ul style={{ fontSize: "12px", color: "#666", textAlign: "left" }}>
          <li style={{ color: /[A-Z]/.test(post.password) ? "green" : "red" }}>
            Minimal 1 Huruf Kapital
          </li>
          <li style={{ color: /[0-9]/.test(post.password) ? "green" : "red" }}>
            Minimal 1 Angka
          </li>
          <li
            style={{
              color: /[!@#$%^&*]/.test(post.password) ? "green" : "red",
            }}
          >
            Minimal 1 Simbol (!@#$)
          </li>
          <li style={{ color: post.password.length >= 8 ? "green" : "red" }}>
            Minimal 8 Karakter
          </li>
        </ul> */}
        <input
          type="password"
          placeholder="Password"
          value={post.password}
          onChange={(e) => setPost({ ...post, password: e.target.value })}
          pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}"
          title="Wajib: 1 Huruf Besar, 1 Huruf Kecil, 1 Angka, dan 1 Simbol (!@#$%^&*._-)"
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
