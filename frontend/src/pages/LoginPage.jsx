import FormContainer from "../components/FormContainer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLoginMutation } from "../store/authApiSlice";
import { authActions } from "../store/auth";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async function submitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // we used unwrap to resolve the promise because redux returns a promise in this case
      const response = await login(data).unwrap();
      dispatch(authActions.setCredentials({ ...response.userInfo }));
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to login. Try again later.");
    }
  }
  return (
    <FormContainer>
      <h1>Sign in</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter email"
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password Address</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Enter password"
            required
          ></Form.Control>
        </Form.Group>

        <Button
          disabled={isLoading}
          type="submit"
          variant="primary"
          className="mt-2"
        >
          {isLoading ? "Logging in..." : "Sign in"}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link
            to={
              redirect === "/" ? "/register" : `/register?redirect=${redirect}`
            }
          >
            Register here
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}
