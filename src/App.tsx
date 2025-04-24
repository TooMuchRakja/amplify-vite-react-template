import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();


function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>Moje zadania</h1>
      <button onClick={createTodo}>+ Nowe zadanie</button>
      <ul>
        {todos.map((todo) => (
     <li key={todo.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
     <span>{todo.content}</span>
     <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
   </li>
   
      

        ))}
      </ul>
      <div>
        🥳 Aplikacja dziala. Uzywaj do woli polaczku.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Kliknij w ikone kosza aby usunac.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
