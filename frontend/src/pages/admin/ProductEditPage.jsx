import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductQuery,
} from "../../store/productsApiSlice";
export default function ProductEditPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(productId);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <h1>{error?.data?.message || "Failed to fetch product"}</h1>;
  }

  async function updateProductHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("avatar");
    if (file?.size > 5 * 1024 * 1024) {
      toast.error("Image size too large");
      return null;
    }

    try {
      await updateProduct({ formData, productId }).unwrap();
      toast.success("Updated product successfully");
      navigate("/admin/productslist");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to update product. Try again later."
      );
    }
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>
        {isUpdating && <LoadingSpinner />}

        <Form onSubmit={updateProductHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              defaultValue={product.name}
              name="name"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="price" className="my-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="price"
              defaultValue={product.price}
              name="price"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image" className="my-2">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image url"
              defaultValue={product.image}
            ></Form.Control>

            <Form.Control
              type="file"
              label="Choose file"
              name="image"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="brand" className="my-2">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand"
              defaultValue={product.brand}
              name="brand"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="countInStock" className="my-2">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter count in stock"
              defaultValue={product.countInStock}
              name="countInStock"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category" className="my-2">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category"
              defaultValue={product.category}
              name="category"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="description" className="my-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              defaultValue={product.description}
              name="description"
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </Form>
      </FormContainer>
    </>
  );
}
