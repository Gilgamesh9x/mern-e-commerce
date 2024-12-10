import FormContainer from "../components/FormContainer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRegisterMutation } from "../store/authApiSlice";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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
      const response = await register(data).unwrap();
      navigate(redirect === "/" ? "/login" : `/login?redirect=${redirect}`);
      toast.success("Registered successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to register. Try again later.");
    }
  }
  return (
    <FormContainer>
      <h1>Register</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Group controlId="fullName" className="my-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="fullName"
              type="fullName"
              placeholder="Enter your full name"
              required
            ></Form.Control>
          </Form.Group>

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
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Already a member?
          <Link to="/login">Log in</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}
