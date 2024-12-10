import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  useGetOrderQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../store/ordersApiSlice";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";

export default function OrderPage() {
  const { orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  /////////////////////////////////////////// Order Query /////////////////////////////////////////////////////////////////////

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrderQuery(orderId);

  //////////////////////////////////////////////// Deliver mutation /////////////////////////////////////////////////////////

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  async function deliverOrderHandler(orderId) {
    try {
      await deliverOrder(orderId);
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to mark as delivered");
    }
  }

  /////////////////////////////////////////// Pay mutation and Paypal ////////////////////////////////////////////////////////////

  const [payOrder] = usePayOrderMutation();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <h1>{error?.data?.message || "Failed to fetch order"}</h1>;
  }

  ////////////////////////////////////// Paypal Buttons ///////////////////////////////////////////////////////////////////
  async function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => orderId);
  }
  async function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        /* console.log(details); */
        refetch();
        toast.success("Payment Successful");
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }

  function onError(error) {
    toast.error(error.message);
  }

  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.fullName}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not delivered yet</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={item.image}
                        alt={item.image}
                        fluid
                        rounded
                      ></Image>
                    </Col>

                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>

                    <Col md={4}>
                      {item.quantity} * ${item.price} = $
                      {item.quantity * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
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
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  <div>
                    {" "}
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                </ListGroup.Item>
              )}

              {/* Mark as delivered */}
              {loadingDeliver && <LoadingSpinner />}
              {userInfo?.role === "admin" &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={() => deliverOrderHandler(order._id)}
                    >
                      Mark as delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
