import { Form, Button, Col } from "react-bootstrap";
import FormConainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);
  function paymentHandler(e) {
    e.preventDefault();
    navigate("/placeorder");
  }

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  return (
    <FormConainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={paymentHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Paypal or Credit Card"
              id="Paypal"
              name="paymentMethod"
              required
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormConainer>
  );
}
