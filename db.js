import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("database.db");

const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS passwords (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, pass TEXT, security TEXT)",
      [],
      (sqlTxn, res) => console.log("table created successfully"),
      (error) => console.log("error on creating table" + error.message)
    );
  });
};

const createPassword = (title, pass, security) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO passwords (title, pass, security) VALUES (?,?,?)",
      [title, pass, security],
      (sqlTxn, res) => console.log("insertado correctamente"),
      (e) => console.log("hubo un error " + e.message)
    );
  });
};

const getPasswords = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM passwords",
        [],
        (sqlTxn, res) => {
          console.log("extracción exitosa");
          let result = [];
          for (let i = 0; i < res.rows.length; i++) {
            let item = res.rows.item(i);
            result.push({
              id: item.id,
              title: item.title,
              pass: item.pass,
              security: item.security,
            });
          }
          resolve(result); // Resolvemos la promesa con los resultados
        },
        (e) => {
          console.log("hubo un error prro" + e.message);
          reject(e.message); // Rechazamos la promesa en caso de error
        }
      );
    });
  });
};

const deletePassword = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM passwords WHERE id=?",
      [id],
      () => console.log("eliminación exitosa"),
      (e) => console.log("pinche prro error")
    );
  });
};

export { createTables, createPassword, getPasswords, deletePassword };
