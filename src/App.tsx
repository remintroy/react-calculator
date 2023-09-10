import { Card, Flex, Text } from "@mantine/core";
import { useEffect, useState } from "react";

function App() {
  const size = 100;
  const buttonColumnGap = 10;
  const buttonRowGap = buttonColumnGap;
  const [inputValue, setInputValue] = useState("");
  const [answer, setAnswer] = useState("");

  const mathOperators = ["*", "-", "+", "/", "%"];
  const allowedNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const allowedSymbol = ["."];

  const chars = [
    [1, 2, 3, "+"],
    [4, 5, 6, "-"],
    [7, 8, 9, "*"],
    [".", 0, "/", "<="],
  ];

  const handleClick = (e: any) => {
    const element = e.target as HTMLElement;
    const value = element.innerText?.trim();
    if (inputValue == "" && mathOperators.includes(value)) return;
    if (value == "=") return;
    if (
      !allowedSymbol.includes(value) &&
      !allowedNumber.includes(Number(value)) &&
      !mathOperators.includes(value)
    )
      return;

    if (
      mathOperators.includes(inputValue[inputValue.length - 1]) &&
      mathOperators.includes(value)
    ) {
      setInputValue((pre) => {
        let charArr = pre.split("");
        charArr[charArr.length - 1] = value;
        return charArr.join("");
      });
    } else {
      setInputValue((pre) => pre + value);
    }
  };

  const displayInputValue = () => {
    return inputValue
      .split("")
      .map((e) => (mathOperators.includes(e) ? ` ${e} ` : e))
      .join("");
  };
  const calculateOutput = (formula: string) => {
    formula = formula.split(" ").join("");

    let addAcc = 0;
    const additionValues: string[] = formula.split("+").filter((e) => e != "");

    for (const additionValue of additionValues) {
      let subAcc = 0;
      const subVals = additionValue.split("-");

      for (let s = 0; s < subVals.length; s++) {
        let multiAcc = 1;
        const multivals = subVals[s].split("*");

        //
        for (let m = 0; m < multivals.length; m++) {
          const divVals = multivals[m].split("/");
          let divAcc = Number(divVals[0]) || 1;

          //
          for (let d = 1; d < divVals.length; d++) {
            divAcc = divAcc / Number(divVals[d]);
          }

          multiAcc = multiAcc * divAcc;
        }

        subAcc = subAcc != 0 ? subAcc - multiAcc : multiAcc;
      }

      addAcc = addAcc + subAcc;
    }

    setAnswer(addAcc.toString());
  };

  useEffect(() => {
    calculateOutput(inputValue);
  }, [inputValue]);

  return (
    <Flex gap={20} align={"center"} justify={"center"} h={"100vh"}>
      <Flex gap={buttonRowGap} direction={"column"}>
        <Card withBorder>
          <Text align="end">{displayInputValue() || 0}</Text>
          <Text align="end" fz="sm" color="dimmed">
            {answer ? answer : "-"}
          </Text>
        </Card>
        {chars.map((c, i) => {
          const currWidth = 400 / c.length - buttonColumnGap;

          return (
            <Flex align="center" key={i} gap={buttonColumnGap}>
              {c.map((char) => (
                <Card
                  key={char}
                  onClick={handleClick}
                  withBorder
                  w={currWidth}
                  h={size}
                  bg={"gray.0"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {char}
                </Card>
              ))}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default App;
