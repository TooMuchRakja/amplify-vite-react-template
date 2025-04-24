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
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content, isDone: false });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  // Funkcja do zmiany stanu "isDone" na true
  function markAsDone(todo: Schema["Todo"]["type"]) {
    const updatedTodo = { ...todo, isDone: true };  // Ustawiamy isDone na true
    client.models.Todo.update(updatedTodo);
    // Zaktualizowanie stanu lokalnego
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.id === todo.id ? { ...item, isDone: true } : item
      )
    );
  }

  return (
    <main>
      <h1>Twoje dzienne zadania {user?.signInDetails?.loginId}</h1>
      <button onClick={createTodo}>+ Nowe zadanie</button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: todo.isDone ? "lightgreen" : "yellow", // Kolor zmienia się na zielony po oznaczeniu jako "done"
              padding: "10px",
              margin: "5px 0",
              borderRadius: "5px",
            }}
          >
            <span>{todo.content}</span>
            {/* Kontener dla przycisków, aby były obok siebie */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Przycisk zmieniający stan na 'isDone' */}
              <button
                onClick={() => markAsDone(todo)}
                disabled={todo.isDone}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px", // Zwiększamy rozmiar ikony
                  color: todo.isDone ? "green" : "gray", // Zielony kolor po oznaczeniu jako "done"
                  marginRight: "10px", // Odstęp między przyciskami
                }}
              >
                {todo.isDone ? "✅" : "✔️"} {/* Emoji tick mark */}
              </button>
              <button onClick={() => deleteTodo(todo.id)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                🗑️ {/* Przycisk kosza */}
              </button>
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
