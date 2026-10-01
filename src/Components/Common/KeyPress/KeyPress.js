import React from "react";
import useKeypress from "react-use-keypress";

const KeyPress = (props) => {
  useKeypress("F9", (e) => {
    // console.log('F9')
  });

  return <div></div>;
};

export default KeyPress;
