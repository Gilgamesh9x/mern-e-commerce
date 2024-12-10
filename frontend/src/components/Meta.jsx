import { Helmet } from "react-helmet-async";

export default function Meta({
  title = "E-COMMERCE MERN",
  description = "App built with MERN stack",
  keywords = "e-commerce, mern, web app",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta name="keywords" content={keywords}></meta>
    </Helmet>
  );
}
