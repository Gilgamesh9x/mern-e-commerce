import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../store/cart";
import CheckoutSteps from "../components/CheckoutSteps";

export default function ShippingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);

  function submitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    dispatch(cartActions.saveShippingAddress(data));
    navigate("/payment");
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />

      <h1>Shipping</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            name="address"
            type="text"
            placeholder="Enter address"
            defaultValue={shippingAddress.address || ""}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            name="city"
            type="text"
            placeholder="Enter city"
            defaultValue={shippingAddress.city || ""}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-2">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            name="postalCode"
            type="text"
            placeholder="Enter postal code"
            defaultValue={shippingAddress.postalCode || ""}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="my-2">
          <Form.Label>Country</Form.Label>
          <Form.Control
            name="country"
            type="text"
            placeholder="Enter country"
            defaultValue={shippingAddress.country || ""}
            required
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}
