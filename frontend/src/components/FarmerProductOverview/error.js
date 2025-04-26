import { Link } from "react-router-dom";

export default function ErrorNotFound() {
  return (
    <div>
      <h1>404 Error: Page Not Found</h1>
      <Link className="bg-[#f0761f] p-1" to="/">
        Go Back To Home
      </Link>
    </div>
  );
}
