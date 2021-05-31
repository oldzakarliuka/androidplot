import { StatusBar } from "expo-status-bar";
import * as mexp from "math-expression-evaluator";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";

const { height: Height } = Dimensions.get("window");

export default function App() {
  const contentInset = { top: 20, bottom: 20 };

  const [f, setF] = useState("");

  const [a, setA] = useState();
  const [b, setB] = useState();

  const [X, setX] = useState([]);
  const [Y, setY] = useState([]);

  const [points, setPoints] = useState(10);

  const handler = (f) => (value) =>
    value
      ? f(Number(value.replace(/\,/g, ".").replace(/[^0-9-\.]+/g, "")))
      : f(undefined);

  const showHandler = () => {
    let errMsg = "";
    if (typeof a === "undefined") {
      errMsg += "\nA is undefined";
    }
    if (typeof b === "undefined") {
      errMsg += "\nB is undefined";
    }
    if (typeof points === "undefined") {
      errMsg += "\nPoints is undefined";
    }
    if (!f) {
      errMsg += "\nFunction is undefined";
    }

    if (errMsg) {
      Alert.alert(errMsg);
      return;
    }

    const min = Math.min(a, b);
    const max = Math.max(a, b);

    const h = (max - min) / points;

    try {
      const y = [];
      const x = [];

      for (let i = min; i <= max; i += h) {
        const xi = i.toFixed(2);
        y.push(mexp.eval(f.replace("x", xi)));
        x.push(xi);
      }

      setY(y);
      setX(x);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  return (
    <ScrollView>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <TextInput
          style={styles.inputFunc}
          placeholder="sin(x)"
          onChangeText={setF}
        />
        <View style={styles.segment}>
          <Text>[</Text>
          <TextInput
            style={styles.input}
            placeholder="A"
            onChangeText={handler(setA)}
          />
          <Text> ; </Text>
          <TextInput
            style={styles.input}
            placeholder="B"
            onChangeText={handler(setB)}
          />
          <Text>]</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Points"
          onChangeText={handler(setPoints)}
          keyboardType="number-pad"
        />
        <Button title="Show" onPress={showHandler} />
      </View>

      {X.length && X.length == Y.length ? (
        <View
          style={{
            height: 400,
            padding: 20,
            flexDirection: "row",
          }}
        >
          <YAxis
            data={Y}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{
              fill: "grey",
              fontSize: 10,
            }}
            style={{ marginBottom: -20 }}
            formatLabel={(value) => value}
          />
          <View style={{ height: 400, padding: 10, flex: 1 }}>
            <LineChart
              style={{ flex: 1, marginLeft: 16 }}
              data={Y}
              svg={{ stroke: "#333", strokeWidth: 2 }}
              contentInset={contentInset}
            >
              <Grid />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10 }}
              data={Y}
              formatLabel={(_, index) => X[index]}
              contentInset={{ left: 10, right: 10 }}
              svg={{ fontSize: 10, fill: "black" }}
            />
          </View>
        </View>
      ) : null}

      <View
        style={{ height: 90, justifyContent: "center", alignItems: "center" }}
      >
        <Text>{f}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F4D8",
  },
  segment: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    paddingLeft: 5,
    marginTop: 10,
    marginBottom: 10,
    width: 100,
    textAlign: "center",
  },
  inputFunc: {
    height: 40,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    paddingLeft: 5,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
  },
});
