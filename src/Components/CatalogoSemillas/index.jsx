import { useEffect, useState } from "react";
import React from "react";
import { Cards } from "./Cards";

export const Categorias = () => {
  const [users, setUsers] = useState([]);
  async function getData() {
    const fetchData = await fetch("categorias.json");
    const datajson = await fetchData.json();
    setUsers(datajson);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
   
      {users &&
        users.map((user) => (
          <Cards
            key={user.id}
            imgProyect={user.imgProyect}
            tituloCategoria={user.tituloCategoria}
          
          />
        ))}
    </>
  );
};
