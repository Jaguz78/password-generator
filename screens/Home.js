import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getPasswords, deletePassword } from "../db";
import * as Clipboard from "expo-clipboard";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const deleteItems = (id, data, setData) => {
  deletePassword(id);
  setData(data.filter((item) => item.id !== id));
};

const copyToClipboard = async (m) => {
  try {
    await Clipboard.setStringAsync(m);
  } catch (error) {
    console.log("hubo error prro: " + error);
  }
};

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getPasswords()
      .then((d) => setData([...d]))
      .catch((e) => console.log(e));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getPasswords()
        .then((d) => setData([...d]))
        .catch((e) => console.log(e));
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {data.map((e, index) => (
        <Card e={e} index={index} data={data} setData={setData}></Card>
      ))}
    </ScrollView>
  );
}

function Card({ e, index, data, setData }) {
  const [visibility, setVisibility] = useState(true);
  return (
    <View key={index} style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={[styles.cardText, styles.cardTitle]}>{e.title}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={visibility}
          editable={false}
        >
          {e.pass}
        </TextInput>
        <Text style={styles.cardText}>
          Seguridad:{" "}
          <Text
            style={
              e.security == "baja"
                ? styles.textRed
                : e.security == "media"
                ? styles.textYellow
                : styles.textGreen
            }
          >
            {e.security}
          </Text>
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.redButton]}
          onPress={() => deleteItems(e.id, data, setData)}
        >
          <Text style={styles.buttonText}>
            <MaterialCommunityIcons name="delete" size={24} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.blueButton]}>
          <Text
            style={styles.buttonText}
            onPress={() => setVisibility(!visibility)}
          >
            {visibility ? (
              <MaterialCommunityIcons name="eye-off" size={24} color="white" />
            ) : (
              <MaterialCommunityIcons name="eye" size={24} color="white" />
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.blueButton]}
          onPress={() => copyToClipboard(e.pass)}
        >
          <Text style={styles.buttonText}>
            <MaterialCommunityIcons
              name="content-copy"
              size={24}
              color="white"
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  textGreen: {
    fontWeight: "bold",
    color: "#90be6d",
  },
  textYellow: {
    fontWeight: "bold",
    color: "#f9c74f",
  },
  textRed: {
    fontWeight: "bold",
    color: "#f94144",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    width: 50,
    height: 50,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  redButton: {
    backgroundColor: "#f94144",
  },
  blueButton: {
    backgroundColor: "#277da1",
  },
  buttonText: {
    fontSize: 10,
    color: "#fff",
  },
  input: {
    borderWidth: 0,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: null,
    marginBottom: 10,
    width: "90%",
  },
});

export default Home;
