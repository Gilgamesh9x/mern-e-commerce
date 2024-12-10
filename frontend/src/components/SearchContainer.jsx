import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchBox() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  function submitHandler(e) {
    const formData = new FormData(e.target);
    const { searchTerm } = Object.fromEntries(formData.entries());
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
    } else {
      navigate("/");
    }
  }
  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="searchTerm"
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
}
