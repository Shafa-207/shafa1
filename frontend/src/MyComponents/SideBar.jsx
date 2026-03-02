import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const SidebarContainer = styled.nav`
  width: 240px;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  position: fixed; /* Biar nempel di kiri terus */
  left: 0;
  top: 0;
`;

const Logo = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #5d59ad;
`;

const MenuLink = styled(NavLink)`
  padding: 15px 25px;
  text-decoration: none;
  color: #a8a9ab;
  font-size: 16px;
  transition: 0.3s;

  &:hover {
    background-color: #2d2d2d;
    color: white;
  }

  /* Warna saat menu aktif/diklik */
  &.active {
    background-color: #5d59ad;
    color: white;
    border-right: 4px solid #fff;
  }
`;

export default function Sidebar(props) {
  const { uri } = props;
  const url = uri;
  return (
    <SidebarContainer>
      <Logo>Shafa App</Logo>
      <MenuLink to="/">Welcome</MenuLink>
      {url.length > 0 ? (
        url.map((item, index) => (
          <MenuLink key={index} to={`/page${index + 1}`}>
            Page {index + 1}
          </MenuLink>
        ))
      ) : (
        <p>Tidak ada url yang diberikan...</p>
      )}
    </SidebarContainer>
  );
}
