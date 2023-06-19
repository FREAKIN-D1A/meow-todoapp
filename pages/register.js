import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";
import { auth, Provider } from "../firebase/firebase";
import {
	createUserWithEmailAndPassword,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";

import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import Link from "next/link";

import Loader from "@/components/loader";

const RegisterForm = () => {
	const router = useRouter();

	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);

	const { authUser, isLoading, setAuthUser } = useAuth();

	useEffect(() => {
		if (!isLoading && authUser) {
			router.push("/");
		}
	}, [authUser, isLoading]);

	const singupHandler = async () => {
		if (!email || !password || !username) return;
		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log(user);

			await updateProfile(auth.currentUser, {
				displayName: username,
			});

			setAuthUser({
				uid: user.uid,
				email: user.email,
				username: user.displayName,
			});
		} catch (error) {
			console.error("An error occured", error);
		}
	};

	// const Provider = new GoogleAuthProvider();

	const signInWithGoogle = async () => {
		const user = await signInWithPopup(auth, Provider);
		console.log(user);
	};

	return isLoading || (!isLoading && !!authUser) ? (
		<Loader />
	) : (
		<main className='flex lg:h-[100vh]'>
			<div className='w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start'>
				<div className='p-8 w-[600px]'>
					<div className='flex justify-center flex-col items-center'>
						<span className='text-7xl mb-10'>📝</span>
						<h1 className='text-5xl md:text-7xl font-bold'>
							Meowww Tooo Dooo's
						</h1>
					</div>
					<h1 className='text-6xl font-semibold'>Sign Up Now</h1>
					<p className='mt-6 ml-1'>
						Already have an account ?{" "}
						<Link href='/login'>
							<span className='underline hover:text-blue-400 cursor-pointer'>
								Login
							</span>
						</Link>
					</p>

					<div className='bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group'>
						<FcGoogle size={22} />
						<span
							className='font-medium text-black group-hover:text-white'
							onClick={signInWithGoogle}>
							Login with Google
						</span>
					</div>

					<form onSubmit={(e) => e.preventDefault()}>
						<div className='mt-10 pl-1 flex flex-col'>
							<label>Your Name</label>
							<input
								type='text'
								className='font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400'
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className='mt-10 pl-1 flex flex-col'>
							<label>Email</label>
							<input
								type='email'
								name='email'
								className='font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400'
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='mt-10 pl-1 flex flex-col'>
							<label>Password</label>
							<input
								type='password'
								name='password'
								className='font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400'
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<button
							className='bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90'
							onClick={singupHandler}>
							Sign Up
						</button>
					</form>
				</div>
			</div>
			<div
				className='w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block'
				style={{
					backgroundImage: "url('/login-banner.jpg')",
				}}></div>
		</main>
	);
};

export default RegisterForm;
