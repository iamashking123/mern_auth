import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  function login() {
    axios({
      url: "/login",
      method: "POST",
      data: { email, password },
      withCredentials: true,
    }).then((res) => {
      if (res.data.user) {
        getCookie();
      } else {
        console.log(res.data);
      }
    });
  }
  function register() {
    axios({
      url: "/signup",
      method: "POST",
      data: {
        email,
        password,
      },
      withCredentials: true,
    })
      .then((res) => {
        getCookie();
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getCookie();
  }, []);
  function getCookie() {
    axios({ url: "/check_auth", method: "GET" }, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("authenticated", true);
        }
      })
      .catch((err) => {
        console.log(err.response);
        setUser("");
        localStorage.setItem("authenticated", false);
      });
  }
  function logout() {
    axios.get("/logout").then((_) => {
      setUser("");
      localStorage.setItem("authenticated", false);
    });
  }
  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>
      <button onClick={logout}>Logout</button>
      <div>{user}</div>
    </>
  );
}
