import { MainLayout } from "../components/MainLayout";

export const withMainLayout = (Component) => (props) => (
  <MainLayout>
    <Component {...props}/>
  </MainLayout>
);