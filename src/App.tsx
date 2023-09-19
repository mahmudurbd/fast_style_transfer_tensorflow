import "./App.css";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Layout home>
        <HomePage />
      </Layout>
    </>
  );
}

export default App;
