import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { cartActions } from "../store/cart";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, cartItemsQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

  ///////////////////////////////////////////////////////////////////////////

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>
            Your cart is empty. <Link to="/">Go back</Link>
          </p>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => {
              return (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>

                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>

                    <Col md={2}>${item.price}</Col>

                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.quantity} // Always reflect Redux state
                        onChange={(e) => {
                          dispatch(
                            cartActions.addToCart({
                              ...item,
                              quantity: Number(e.target.value), // Update with the new value
                            })
                          );
                        }}
                      >
                        {[...Array(item.countInStock).keys()].map((index) => {
                          return (
                            <option key={index + 1} value={index + 1}>
                              {index + 1}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Col>

                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() =>
                          dispatch(cartActions.removeFromCart(item._id))
                        }
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal {cartItemsQuantity} items</h2>${totalPrice}
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={() => navigate("/login?redirect=/shipping")}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}
