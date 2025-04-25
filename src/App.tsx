import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();


function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Dodaj swoje zadanie");
    if (content) {
      client.models.Todo.create({ content, status: "DO ZROBIENIA" });
    }
  }
  

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function updateStatus(id: string, newStatus: string) {
    client.models.Todo.update({ id, status: newStatus });
  }
  

  return (
    <main>
      <h1>Twoje dzienne zadania {user?.signInDetails?.loginId}</h1>
      <button onClick={createTodo}>+ Nowe zadanie</button>
      <ul>
      {todos.map((todo) => (
        <li 
          key={todo.id}
          className={`todo-item ${
            todo.status === "DO ZROBIENIA"
              ? "todo-item-to-do"
              : todo.status === "W  TRAKCIE"
              ? "todo-item-in-progress"
              : todo.status === "ZROBIONE"
              ? "todo-item-done"
              : ""
        }`}
      >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{todo.content}</span>
          </div>
          <div>
            <strong>Status:</strong> {todo.status}
          </div>
          <div>
            <button onClick={() => updateStatus(todo.id, "W  TRAKCIE")}>🔄</button>
            <button onClick={() => updateStatus(todo.id, "ZROBIONE")}>✅</button>
            <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
          </div>
        </li>
      ))}

      </ul>
      <div>
        🥳 Aplikacja działa. Baw się polaczku.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Kliknij w ikone kosza aby usunac.
          Kliknij w sign out aby się wylogować.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;