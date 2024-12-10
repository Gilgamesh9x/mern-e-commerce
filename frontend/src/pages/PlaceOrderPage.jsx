import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../store/ordersApiSlice";

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const { cartItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } =
    useSelector((state) => state.cart);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress]);

  async function placeOrderHandler() {
    try {
      const response = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        totalPrice,
      }).unwrap();
      toast.success("Order placed successfully");
      navigate(`/order/${response._id}`);
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to place order. Try again later."
      );
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>
                  Address: {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </strong>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                "Your cart is empty"
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>

                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.quantity} * ${item.price} = $
                          {item.quantity * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? "Placing order..." : "Place Order"}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
