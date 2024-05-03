import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { RadioButton } from "react-native-paper";
import { createPassword, createTables } from "../db";

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "Left",
    padding: 20,
    marginHorizontal: 36,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  labelText: {
    marginBottom: 5,
  },
  radioButtonContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
};

function generatePassword(longitud, nivel) {
  const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  const caracteresEspeciales = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  console.log(longitud, nivel);
  let caracteres = "";

  if (nivel === "baja") {
    caracteres = letras;
  } else if (nivel === "media") {
    caracteres = letras + numeros;
  } else if (nivel === "alta") {
    caracteres = letras + numeros + caracteresEspeciales;
  } else {
    throw new Error(
      "Nivel de seguridad no válido. Debe ser 'baja', 'media' o 'alta'."
    );
  }

  let contraseña = "";
  for (let i = 0; i < longitud; i++) {
    const caracterAleatorio = caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
    contraseña += caracterAleatorio;
  }
  console.log(contraseña);
  return contraseña;
}

function validateData(title, password) {
  if (title === "") {
    alert("Debe ingresar un titulo");
    return false;
  }
  if (password === "") {
    alert("Debe ingresar una contraseña");
    return false;
  }
  return true;
}

function NewPass() {
  const [radioBtn, setRadioBtn] = useState("baja");
  const [length, setLength] = useState("8");
  const [newPass, setNewPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    createTables();
  }, []);

  const clean = () => {
    setRadioBtn("baja");
    setLength("8");
    setNewPass("");
    setShowPassword(false);
    setTitle("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>Título:</Text>
        <TextInput style={styles.input} onChangeText={(e) => setTitle(e)} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>Contraseña:</Text>
        <TextInput
          value={newPass}
          onChangeText={(e) => setNewPass(e)}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <Button
          title={showPassword ? "Esconder contraseña" : "Mostrar contraseña"}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>Longitud:</Text>
        <TextInput
          onChangeText={(e) => setLength(parseInt(e))}
          style={styles.input}
          value={length}
        />
      </View>

      <View style={styles.radioButtonContainer}>
        <Text style={styles.labelText}>Nivel de seguridad:</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setRadioBtn(newValue)}
          value={radioBtn}
        >
          <View style={{ flexDirection: "row" }}>
            <RadioButton value="baja" />
            <Text>Baja</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <RadioButton value="media" />
            <Text>Media</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <RadioButton value="alta" />
            <Text>Alta</Text>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setNewPass(generatePassword(length, radioBtn));
          }}
          title="Generar contraseña"
          color="#841584"
        />
        <Button
          onPress={() => {
            if (validateData(title, newPass)) {
              createPassword(title, newPass, radioBtn);
              clean();
            }
          }}
          title="Guardar"
          color="#841584"
        />
      </View>
    </View>
  );
}

export default NewPass;
