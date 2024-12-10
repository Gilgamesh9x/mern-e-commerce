import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../store/authApiSlice";
import { authActions } from "../store/auth";
import SearchBox from "./SearchContainer";

const Header = () => {
  /////////////////////////////////////////////// Redux State /////////////////////////////////////////////////////////
  const { cartItemsQuantity } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async function logoutHandler() {
    try {
      const data = await logout().unwrap();
      dispatch(authActions.logout());
      navigate("/");
      toast.success(data?.message);
    } catch (error) {
      toast.error("Failed to log out");
      console.error(error);
    }
  }
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            MERN E-COMMERCE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <Nav.Link as={Link} to="/cart">
                <FaShoppingCart /> Cart
                <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                  {cartItemsQuantity}
                </Badge>
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.fullName} id="username">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {/* Admin Links */}
              {userInfo?.role === "admin" && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item as={Link} to="/admin/productslist">
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderslist">
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userslist">
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
