import { useState, useEffect } from "react";

const App = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/pets")
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);
        setPets(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {pets.map((pet) => (
        <div key={pet._id}> {pet.name}</div>
      ))}
    </div>
  );
};

export default App;
