
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase,ref,get,set } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function readData(path){
  const snapshot = await get(ref(db,path));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function writeData(path,data){
  await set(ref(db,path),data);
  return true;
}
