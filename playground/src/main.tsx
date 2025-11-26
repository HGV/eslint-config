import React from "react";

const myUrl = "https://www.google.com";
console.log(myUrl);

const counter = () => {
  const [counter, setCounter] = React.useState(0);
  return <button onClick={() => setCounter(counter + 1)}>{counter}</button>;
};

function foo_bar() {
  return 42;
}
