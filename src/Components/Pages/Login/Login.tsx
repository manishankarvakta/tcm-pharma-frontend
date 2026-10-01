import React, { useEffect, useState } from "react";
import * as Icons from "heroicons-react";
import logo from "../../../logo.png";
import { Button, Card, Form, Image, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { notify } from "../../Utility/Notify";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useLoginUserMutation } from "../../../services/userApi";
import { useDispatch } from "react-redux";
import { signInUser } from "../../Utility/Auth";
import { languages } from "../../../language";
import { selectLanguage } from "../../../features/languageSlice";
import { jwtDecode } from "jwt-decode";
// import {en} from "../../../language/en"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const user = signInUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location: any = useLocation();
  const from = location?.state?.from.pathname || "/";

  const { register, handleSubmit } = useForm();

  const [loginUser] = useLoginUserMutation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessTokens");
    if (accessToken) {
      navigate("/", { replace: true });
      return;
    }
  }, []);

  const handleLogin = async (data: any) => {
    const response: any = await loginUser(data);
    // console.log(data)
    if (response) {
      // console.log(response)
      if (response?.error?.data?.status === false) {
        notify("Login Filed! User ID and Password is not matching", "error");
        console.log("Login Filed! User ID and Password is not matching");
        localStorage.clear();
      } else {
        console.log("Login Success");

        if (response?.data?.access_token) {
          localStorage.setItem(
            "accessTokens",
            JSON.stringify(response?.data?.access_token)
          );
          
          // Decode the token to get user info 
          const userData = jwtDecode(response?.data?.access_token);
          // Store the decoded user data as 'user' in localStorage
          localStorage.setItem("user", JSON.stringify(userData));

          // TODO:: check user language preferances
          // TODO:: Set user language to presist
          
          //@ts-ignore
          // console.log(userData?.storeSettings?.lang, "success");
          //@ts-ignore
          const userLang = userData?.storeSettings?.lang || "en";
          if (userLang === "en") {
            // console.log("EN", "success");
            dispatch(selectLanguage(languages.en));
          } else {
            // console.log("BN", "success");
            dispatch(selectLanguage(languages.bn));
          }
          notify("Login Success", "success");
          navigate(from, { replace: true });
        }
      }
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 mt-5 pt-5">
            <div className="d-flex justify-content-center">
              <Card style={{ width: "18rem" }}>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                  <p className="text-center">
                    <Image src={logo} height="30"></Image>
                  </p>
                  <Card.Title className="text-center">
                    Pharmacy Login
                  </Card.Title>
                  <hr></hr>
                  <Form onSubmit={handleSubmit(handleLogin)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email or User ID</Form.Label>
                      <Form.Control
                        {...register("email")}
                        type="text"
                        placeholder="Enter email OR User id"
                      />
                      <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                          style={{ borderColor: "#ced4da" }}
                        >
                          {showPassword ? (
                            <Icons.EyeOffOutline size={20} />
                          ) : (
                            <Icons.EyeOutline size={20} />
                          )}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="dark"
                        className="float-center"
                        type="submit"
                      >
                        <Icons.LockOpenOutline
                          size={20}
                        ></Icons.LockOpenOutline>{" "}
                        Login
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Login;
