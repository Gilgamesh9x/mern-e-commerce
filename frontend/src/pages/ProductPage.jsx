import { useParams, Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import {
  useGetProductQuery,
  useCreateProductReviewMutation,
} from "../store/productsApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../store/cart";
import { useState } from "react";
import { addDecimals } from "../utils/helperFunctions";
import Message from "../components/Message";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

export default function ProductPage() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);

  /////////////////////////////////////////////// Redux State /////////////////////////////////////////////////////////

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  /////////////////////////////////////////// QUERY /////////////////////////////////////////////////////////////////////

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(productId);

  const [createProductReview, { isLoading: creatingReview }] =
    useCreateProductReviewMutation();

  async function submitReviewHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await createProductReview({ data, productId: product._id }).unwrap();
      toast.success("Review added successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add review");
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <h1>{error?.data?.message || "Failed to fetch product"}</h1>;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Meta title={product.name} />
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      <>
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>

          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  numReviews={product.numReviews}
                  rating={product.rating}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                Price: ${addDecimals(product.price)}
              </ListGroup.Item>
              <ListGroup.Item>{product.description}</ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${addDecimals(product.price * quantity)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Quantity</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={quantity}
                          onChange={(e) => setQuantity(+e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map(
                            (index) => {
                              return (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              );
                            }
                          )}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={() =>
                      dispatch(cartActions.addToCart({ ...product, quantity }))
                    }
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock < 1}
                  >
                    Add to cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row className="review">
          <Col md={6}>
            <h2>Reviews</h2>
            {product.reviews.length === 0 && <Message>No reviews</Message>}
            <ListGroup variant="flush">
              {product.reviews.map((review) => {
                return (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                );
              })}
              <ListGroup.Item>
                <h2>Write a Customer Review</h2>
                {creatingReview && <LoadingSpinner />}
                {userInfo ? (
                  <Form onSubmit={submitReviewHandler}>
                    <Form.Group className="my-2" controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control as="select" required name="rating">
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2" controlId="comment">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="3"
                        name="comment"
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={creatingReview}
                      type="submit"
                      variant="primary"
                    >
                      {creatingReview ? "Submitting..." : "Submit"}
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    Please <Link to="/login">sign in</Link> to write a review
                  </Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </>
    </>
  );
}
