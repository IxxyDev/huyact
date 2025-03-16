const todos = ["Walk the dog", "Water the plants", "Sand the chairs"];

console.log("Script runs");
const addTodoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo-btn");
const todosList = document.getElementById("todos-list");

for (const todo of todos) {
	todosList.append(renderTodoInReadMode(todo));
}

addTodoInput.addEventListener("input", () => {
	addTodoButton.disabled = addTodoInput.value.length < 3;
});

addTodoInput.addEventListener("keydown", ({ key }) => {
	if (key === "Enter" && addTodoInput.value.length >= 3) {
		addTodo();
	}
});

addTodoButton.addEventListener("click", () => {
	addTodo();
});

function renderTodoInReadMode(todo) {
	const li = document.createElement("li");
	const span = document.createElement("span");
	const button = document.createElement("button");

	span.textContent = todo;
	span.addEventListener("dblclick", () => {
		const idx = todos.indexOf(todo);

		todosList.replaceChild(
			renderTodoInEditMode(todo),
			todosList.childNodes[idx],
		);
	});
	li.append(span);

	button.textContent = "Done";
	button.addEventListener("click", () => {
		const idx = todos.indexOf(todo);
		removeTodo(idx);
	});
	li.append(button);

	return li;
}

function renderTodoInEditMode(todo) {
	const li = document.createElement("li");
	const input = document.createElement("input");
	const saveBtn = document.createElement("button");
	const cancelBtn = document.createElement("button");

	saveBtn.textContent = "Save";
	saveBtn.addEventListener("click", () => {
		const idx = todos.indexOf(todo);
		updateTodo(idx, input.value);
	});
	li.append(saveBtn);

	cancelBtn.textContent = "Cancel";
	button.addEventListener("click", () => {
		const idx = todos.indexOf(todo);
		todosList.replaceChild(
			renderTodoInReadMode(todo),
			todosList.childNodes[idx],
		);
	});
	li.append(cancelBtn);

	return li;
}

function addTodo() {
	const desc = addTodoInput.value;

	todos.push(desc);
	const todo = renderTodoInReadMode(desc);
	todosList.append(todo);

	addTodoInput.value = "";
	addTodoButton.disabled = true;
}

function removeTodo(index) {
	todos.splice(index, 1);
	todosList.childNodes[index].remove();
}

function updateTodo(index, desc) {
	todos[index] = desc;
	const todo = renderTodoInReadMode(desc);
	todosList.replaceChild(todo, todosList.childNodes[index]);
}
