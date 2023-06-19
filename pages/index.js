import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import Link from "next/link";
import Loader from "@/components/loader";

import {
	collection,
	addDoc,
	getDocs,
	where,
	query,
	deleteDoc,
	updateDoc,
	doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// const arr = [
// 	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
// ];

export default function Home() {
	const router = useRouter();

	const [todoInput, setTodoInput] = useState("");
	const [todos, setTodos] = useState([]);

	const { authUser, isLoading, signOut } = useAuth();

	const onKeyUp = (event) => {
		if (event?.key === "Enter" && todoInput?.length > 0) {
			addToDo();
		}
	};

	const fetchTodos = async (uid) => {
		try {
			// Create a Firestore query to fetch all the todos for the user with the given ID.
			const q = query(collection(db, "todos"), where("owner", "==", uid));

			// Execute the query and get a snapshot of the results.
			const querySnapshot = await getDocs(q);

			// Extract the data from each todo document and add it to the data array.
			let data = [];
			querySnapshot.forEach((todo) => {
				console.log(todo);
				data.push({ ...todo.data(), id: todo.id });
			});

			// Set the todos state with the data array.
			setTodos(data);
		} catch (error) {
			console.error("An error occured", error);
		}
	};

	const addToDo = async () => {
		try {
			const docRef = await addDoc(collection(db, "todos"), {
				owner: authUser.uid,
				content: todoInput,
				completed: false,
			});

			// After adding the new todo, fetch all todos for the current user and update the state with the new data.
			fetchTodos(authUser.uid);

			// Clear the todo input field.
			setTodoInput("");
		} catch (error) {
			console.error("An error occured", error);
		}
	};

	const deleteTodo = async (docId) => {
		try {
			// Delete the todo document with the given ID from the "todos" collection in Firestore.
			await deleteDoc(doc(db, "todos", docId));

			// After deleting the todo, fetch all todos for the current user and update the state with the new data.
			fetchTodos(authUser.uid);
		} catch (error) {
			console.error("An error occured", error);
		}
	};

	const makeAsCompleteHander = async (event, docId) => {
		try {
			// Get a reference to the todo document with the given ID in the "todos" collection in Firestore.
			const todoRef = doc(db, "todos", docId);

			// Update the "completed" field of the todo document to the value of the "checked" property of the event target.
			await updateDoc(todoRef, {
				completed: event.target.checked,
			});

			// After updating the todo, fetch all todos for the current user and update the state with the new data.
			fetchTodos(authUser.uid);
		} catch (error) {
			console.error("An error occured", error);
		}
	};

	useEffect(() => {
		if (!isLoading && !authUser) {
			router.push("/login");
		}
	}, [authUser, isLoading]);

	return !authUser ? (
		<Loader />
	) : (
		<main className=''>
			<div
				className='bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer'
				onClick={signOut}>
				<GoSignOut size={18} />
				<span onClick={signOut}>Logout</span>
			</div>
			<div className='max-w-3xl mx-auto mt-10 p-8'>
				<div className='bg-white -m-6 p-3 sticky top-0'>
					<div className='flex justify-center flex-col items-center'>
						<span className='text-7xl mb-10'>📝</span>
						<h1 className='text-5xl md:text-7xl font-bold'>Meowww</h1>
						<h1 className='text-5xl md:text-7xl font-bold'>Tooo Dooo's</h1>
					</div>
					<div className='flex items-center gap-2 mt-10'>
						<input
							placeholder={`👋 Hello ${authUser.username}, What to do Today?`}
							type='text'
							className='font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300'
							autoFocus
							value={todoInput}
							onChange={(e) => setTodoInput(e.target.value)}
							onKeyUp={(e) => onKeyUp(e)}
						/>
						<button
							className='w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]'
							onClick={addToDo}>
							<AiOutlinePlus size={30} color='#fff' />
						</button>
					</div>
				</div>
				<div className='my-10'>
					{todos.length > 0 &&
						todos.map((todo) => (
							<div
								key={todo.id}
								className='flex items-center justify-between mt-4'>
								<div className='flex items-center gap-3'>
									<input
										id={`todo-${todo.id}`}
										type='checkbox'
										className='w-4 h-4 accent-green-400 rounded-lg'
										checked={todo.completed}
										onChange={(e) => makeAsCompleteHander(e, todo.id)}
									/>
									<label
										htmlFor={`todo-${todo.id}`}
										className={`font-medium ${
											todo.completed ? "line-through" : ""
										}`}>
										{todo.content}
									</label>
								</div>

								<div className='flex items-center gap-3'>
									<MdDeleteForever
										size={24}
										className='text-red-400 hover:text-red-600 cursor-pointer'
										onClick={() => deleteTodo(todo.id)}
									/>
								</div>
							</div>
						))}

					{todos.length < 1 && (
						<span className='text-center w-full block text-2xl font-medium text-gray-400 mt-28'>{`You don't have todo's. Wanna create some?`}</span>
					)}
				</div>
			</div>
		</main>
	);
}
