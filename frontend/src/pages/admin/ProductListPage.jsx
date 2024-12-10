import { Table, Button, Row, Col } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../store/productsApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import Message from "../../components/Message";

export default function ProductListPage() {
  const { page } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ page });

  const [createProduct, { isLoading: creatingProductLoading }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  async function createProductHandler() {
    if (window.confirm("Are you sure you want to create a new product? ")) {
      try {
        createProduct();
        toast.success("Sample product created successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to create sample product");
      }
    }
  }
  function deleteProductHandler(productId) {
    if (window.confirm("Are you sure you want to delete the product? ")) {
      try {
        deleteProduct(productId);
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to deleteproduct");
      }
    }
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
      {creatingProductLoading && <LoadingSpinner />}
      {isDeleting && <LoadingSpinner />}
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || "Failed to fetch products"}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant="light"
                      className="btn-sm mx-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.totalPages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
}
