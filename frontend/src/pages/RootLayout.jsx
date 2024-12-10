import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
