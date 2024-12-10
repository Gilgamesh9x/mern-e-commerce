import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/userApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserListPage() {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  async function deleteUserHandler(userId) {
    if (window.confirm("Are you sure you want to delete the product? ")) {
      try {
        deleteUser(userId);
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete user");
      }
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>{error?.data?.message || "Failed to fetch users"}</h1>;
  }

  return (
    <>
      <h1>Users</h1>
      {isDeleting && <LoadingSpinner />}
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>Admin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.fullName}</td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>
                {user.role === "admin" ? (
                  <FaCheck style={{ color: "green" }} />
                ) : (
                  <FaTimes style={{ color: "red" }} />
                )}
              </td>
              <td>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => deleteUserHandler(user._id)}
                >
                  <FaTrash style={{ color: "white" }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
