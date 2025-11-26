import { useState } from "react";
import {xmlalala} from "./myimport"

function foo() {
  const state = useState();
  const { http } = useState;
  // since it is in a destructured array, it is always checked
  const [httpState, setState] = useState();
  //Editor does not recognize that state is an indirection for useState result, so it is checked
  const bar = state["http"];

  const val = val
  return useState;
}

function bar() {
  const useState = () => {
    return [32];
  };

  const [http] = useState();

  return useState;
}