import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";
import axios from 'axios';

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");


  function validateForm() {
    return email.length > 0 && password.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {

    var url;
    if(process.env.NODE_ENV === 'production')
      url='https://fartmanjack.herokuapp.com/register';
    else
      url='http://localhost:3000/register';

    event.preventDefault();
    axios.post(url, {
        email:email,
        password:password,
        name:name,
        confirmpassword:confirmpassword
    }).then(response => {
        console.log(response.data.ops[0]._id) 
            if(response.data) {
                console.log('reg login')
            }else {
                console.log("Reg error")
            }
        }
    )
}

  return (
    <div className="Register">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bssize="large">
        <FormLabel>Display Name</FormLabel>
          <FormControl
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <FormLabel>Email</FormLabel>
          <FormControl
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bssize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
          </FormGroup>
          <FormGroup controlId="confirmpassword" bssize="large">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            value={confirmpassword}
            onChange={e => setConfirmPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bssize="large" disabled={!validateForm()} type="submit">
          Register
        </Button>
      </form>
    </div>
  );
}