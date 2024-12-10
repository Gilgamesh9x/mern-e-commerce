import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Message from "../components/Message";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUpdateProfileMutation } from "../store/userApiSlice";
import { useGetUserOrdersQuery } from "../store/ordersApiSlice";
import { Link } from "react-router-dom";
import { authActions } from "../store/auth";

export default function ProfilePage() {
  //////////////////////////////////// functions and state /////////////////////////////////////////////////////////////
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  /////////////////////////////////////// Edit profile logic ///////////////////////////////////////////////////////////

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  async function submitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await updateProfile(data).unwrap();
      dispatch(authActions.setCredentials({ ...response }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update profile. Try again later."
      );
    }
  }
  /////////////////////////////////////////// Get my orders logic //////////////////////////////////////////////////////////
  const {
    data: myOrders,
    isLoading: isMyOrdersLoading,
    isError,
    error,
  } = useGetUserOrdersQuery();

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              name="fullName"
              defaultValue={userInfo.fullName}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              defaultValue={userInfo.email}
              required
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isMyOrdersLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <Message variant="danger">
            {error?.data?.message || "Failed to fetch your orders"}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      className="btn-sm"
                      variant="light"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}
