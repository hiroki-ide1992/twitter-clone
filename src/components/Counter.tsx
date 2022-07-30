import * as React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  counterState,
  add,
  down,
  reset,
  inputUser,
} from "../features/counterSlice";
import { Grid, Container, Button, TextField } from "@mui/material";

const Counter = () => {
  const dispatch = useDispatch();
  const count = useSelector(counterState);

  const [userInput, setUserInput] = useState<number>(0);

  const userInputHandler = (e: number) => {
    let getValue: number;

    isNaN(e) ? (getValue = 0) : (getValue = e);
    setUserInput(getValue);
  };

  return (
    <Container maxWidth={"lg"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {count}
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={(e) => dispatch(add(count))}>
            UP
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={(e) => dispatch(down(count))}>
            DOWN
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={(e) => dispatch(reset(count))}>
            RESET
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="filled-basic"
            label="User Input"
            variant="filled"
            onChange={(e) => userInputHandler(Number(e.target.value))}
          />
          <Button
            variant="contained"
            onClick={(e) => dispatch(inputUser(userInput))}
          >
            Reflection
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Counter;
