import React from "react";

const counter = () => {
  const [counter, setCounter] = React.useState(0);
  return <button onClick={() => setCounter(counter + 1)}>{counter}</button>;
};

function foo_bar() {
  return 42;
}
