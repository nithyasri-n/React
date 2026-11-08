import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

function SEO() {
  const location = useLocation();

  let title = "Dashboard | StayEase";
  let description =
    "Manage your hotel properties, prices and listings with StayEase.";

  if (location.pathname === "/add") {
    title = "Add Hotel | StayEase";
    description = "Add a new hotel property to your StayEase dashboard.";
  } else if (location.pathname.startsWith("/edit/")) {
    title = "Edit Hotel | StayEase";
    description = "Update hotel property information in StayEase.";
  } else if (location.pathname.startsWith("/hotel/")) {
    title = "Hotel Details | StayEase";
    description = "View hotel information, pricing and location on StayEase.";
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}

export default SEO;
