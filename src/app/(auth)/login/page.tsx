"use client";
import { z } from "zod";
import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/features/auth/utils/schema";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";

const LoginPage = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const loginForm = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof loginSchema>) => {
		console.log(values);
	};

	const togglePasswordVisible = () => {
		setIsPasswordVisible((visible) => !visible);
	};

	return (
		<>
			<div className="mb-8 text-center">
				<h1 className="text-2xl font-semibold mb-2">
					👋 Welcome to Campus Chronicles!
				</h1>
				<p className="text-muted-foreground">Let's log you in.</p>
			</div>

			<Form {...loginForm}>
				<form className="space-y-6" onSubmit={loginForm.handleSubmit(onSubmit)}>
					<FormField
						control={loginForm.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="Enter username" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={loginForm.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Password</FormLabel>
									<Link href="/forgot-password">
										<Button variant="link" className="px-0">
											Forgot Password
										</Button>
									</Link>
								</div>
								<FormControl>
									<div className="relative">
										<Input
											placeholder="6+ characters"
											className="pr-6"
											{...field}
											type={isPasswordVisible ? "text" : "password"}
										/>
										<div className="absolute h-full inset-y-0 right-0 p-1 flex items-center justify-center">
											<Button
												size="icon"
												variant="ghost"
												type="button"
												className="size-7"
												onClick={togglePasswordVisible}
											>
												{isPasswordVisible ? (
													<EyeClosed className="size-5" />
												) : (
													<Eye className="size-5" />
												)}
											</Button>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" size="lg">
						Login
					</Button>

					<p className="text-center  text-muted-foreground">
						Want to access as a guest?{" "}
						<Link
							href="/signup"
							className="text-primary hover:underline font-medium"
						>
							<Button type="button" variant="link" className="px-0">
								Register
							</Button>
						</Link>
					</p>
				</form>
			</Form>
		</>
	);
};

export default LoginPage;
