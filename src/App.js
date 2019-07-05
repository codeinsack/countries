import React from 'react';
import { ToastContainer } from "react-toastify";

import { Filter, Table } from "./components";

const App = () => {
  return (
    <>
      {/*<Filter />*/}
      <Table />
      <ToastContainer position="top-center" />
    </>
  );
};

export default App;
