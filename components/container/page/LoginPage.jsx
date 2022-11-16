import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import router, { useRouter } from 'next/router';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Alert,
  FormFeedback,
  FormText,
  FormControl,
  Button,
} from 'reactstrap';

import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const LoginPage = ({ props }) => {
  const [validate, setField] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(validate);
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [access, setPermison] = useState(false);

  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ showPassword: !values.showPassword });
  };

  const handleChange = names => e => {
    const name = names;
    console.log(name);
    const value = e.target.value;
    const v = '';
    console.log('Value isgggggggggggg');
    if (name == 'email') {
      setField({
        ...validate,
        [name]: value,
      });
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (re.test(value)) {
        const v = 'has-success';
      } else {
        const v = 'has-danger';
      }

      //  if(validate.password!="")
      //  setDisable(false);
    }

    if (name == 'password') {
      if (validate.email != '') {
        setField({
          ...validate,
          [name]: value,
        });
        setDisable(true);
        if (validate.password.length > 3) {
          setDisable(false);
          console.log(' hello Validate is', validate);
        }
      }
      // }
    }
  };

  const submitHandler = e => {
    e.preventDefault();

    axios
      .post(
        `https://api.mazglobal.co.uk/maz-api//users/login`,
        { email: validate.email, password: validate.password },

        { headers: { 'content-type': 'application/json' } },
      )
      .then(response => {
        console.log(response.data);
        if (response.data.success == 1) {
          console.log(localStorage.getItem('token'));

          localStorage.setItem('token', response.data.token);
          console.log('ttttttttt', localStorage.getItem('token'));
          router.push('/home/Home');
        } else {
          setPermison(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const GetLogin = () => (
    <Card className="w-25 box-shadow">
      <CardBody>
        <Form onSubmit={submitHandler}>
          <fieldset>
            <legend className="text-primary bg-gradient-primary font-weight-bold uppercase">
              <h3 className="mt-2 ml-3 text-light text-center">Login</h3>
            </legend>
            <FormGroup>
              <Label for="exampleInputEmail3" style={{ width: '800px' }}>
                Email address
              </Label>
              <Input
                type="email"
                className="form-control"
                style={{ width: '335px' }}
                id="exampleInputEmail3"
                name="email"
                value={validate.email}
                aria-describedby="emailHelp"
                onChange={handleChange('email')}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleInputPassword3" style={{ width: '800px' }}>
                Password
              </Label>

              <Input
                type={values.showPassword ? 'text' : 'password'}
                value={validate.password}
                className="form-control"
                style={{ width: '335px' }}
                name="password"
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      //onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormGroup>

            <FormGroup check>
              <Input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck3"
              />
            </FormGroup>
          </fieldset>
          <Button
            disabled={disable}
            color="primary"
            block
            size="lg"
            className="mt-2"
          >
            Submit
          </Button>
          {access && <Alert color="danger">Invalid email or password</Alert>}
        </Form>
      </CardBody>
    </Card>
  );

  return <>{GetLogin()}</>;
};

export default LoginPage;
