import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";
import axios from 'axios';
import socket from '../socket'

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [loginpassword, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && loginpassword.length > 0;
  }

  function handleSubmit(event) {

    event.preventDefault();
    props.login(email,loginpassword);
    props.close();

}
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bssize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={props.defaultEmail!='' ? (props.defaultEmail):(email)}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="loginpassword" bssize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={loginpassword}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bssize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}