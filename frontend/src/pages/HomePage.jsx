import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../store/productsApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams, Link } from "react-router-dom";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";

export default function HomePage() {
  const { page, searchTerm } = useParams();

  /////////////////////////////////////////////// Query ///////////////////////////////////////////////////////////////////
  const { data, isLoading, isError, error } = useGetProductsQuery({
    page,
    searchTerm,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  // the first error display is from our API and the second in case our server is off
  if (isError) {
    return <h1>{error?.data?.message || "Failed to fetch products"}</h1>;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Meta />
      {searchTerm && (
        <Link to="/" className="btn btn-light mt-2 mb-2">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      <Row>
        {data.products.length === 0
          ? "There are no products yet"
          : data.products.map((product) => {
              return (
                <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                  <Product product={product} />
                </Col>
              );
            })}
      </Row>
      <Paginate
        pages={data.totalPages}
        page={page}
        searchTerm={searchTerm ? searchTerm : ""}
      />
    </>
  );
}
