import { Home, Spot, New, SignIn, SignUp, Layout } from "@/pages";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/spot",
        element: <Spot />,
      },
      {
        path: "/new",
        element: <New />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
];

export default routes;
