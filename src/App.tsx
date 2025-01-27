import type React from "react";
import { useState, useEffect } from "react";
import { Laugh, CandyCane, Plus, X } from "lucide-react";

interface Joke {
	id: number;
	question: string;
	answer: string;
}

function App() {
	const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
	const [showAnswer, setShowAnswer] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newJoke, setNewJoke] = useState({ question: "", answer: "" });
	const [createSuccess, setCreateSuccess] = useState(false);

	const fetchRandomJoke = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await fetch("http://localhost:3000/api/v1/jokes/random");
			if (!response.ok) {
				throw new Error("Failed to fetch joke");
			}
			const joke = await response.json();
			setCurrentJoke(joke);
			setShowAnswer(false);
		} catch (err) {
			setError("Unable to load joke. Please try again later.");
			console.error("Error fetching joke:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateJoke = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/api/v1/jokes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newJoke),
			});

			if (!response.ok) {
				throw new Error("Failed to create joke");
			}

			setCreateSuccess(true);
			setNewJoke({ question: "", answer: "" });

			// Hide success message after 3 seconds
			setTimeout(() => {
				setCreateSuccess(false);
				setShowCreateModal(false);
			}, 3000);
		} catch (err) {
			setError("Unable to create joke. Please try again.");
			console.error("Error creating joke:", err);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-red-500 to-red-600 flex flex-col items-center">
			{/* Header */}
			<header className="w-full bg-white/10 backdrop-blur-sm py-4">
				<div className="container mx-auto px-4 flex items-center justify-center">
					<CandyCane className="text-white w-8 h-8 mr-2" />
					<h1 className="text-3xl font-bold text-white">Carambar & Co</h1>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center">
				<div className="max-w-2xl w-full">
					{/* Welcome Section */}
					{!currentJoke && !error && (
						<div className="text-center mb-8">
							<h2 className="text-4xl font-bold text-white mb-4">
								Bienvenue chez Carambar & Co !
							</h2>
							<p className="text-xl text-white/90 mb-4">
								Découvrez notre collection de blagues qui vous feront sourire !
							</p>
							<button
								onClick={() => setShowCreateModal(true)}
								className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full flex items-center mx-auto transition-colors"
							>
								<Plus className="w-5 h-5 mr-2" />
								Ajouter une blague
							</button>
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="bg-white/90 rounded-lg p-4 mb-8 text-red-600 text-center">
							{error}
						</div>
					)}

					{/* Joke Card */}
					{currentJoke && (
						<div className="bg-white rounded-lg shadow-xl p-8 mb-8 transform transition-all">
							<p className="text-xl font-medium text-gray-800 mb-4">
								{currentJoke.question}
							</p>
							{showAnswer && (
								<p className="text-xl font-bold text-red-600 mt-4">
									{currentJoke.answer}
								</p>
							)}
							{!showAnswer && (
								<button
									onClick={() => setShowAnswer(true)}
									className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
								>
									Voir la réponse
								</button>
							)}
						</div>
					)}

					{/* Action Button */}
					<button
						onClick={fetchRandomJoke}
						disabled={isLoading}
						className={`bg-yellow-400 hover:bg-yellow-500 text-red-800 font-bold py-4 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 flex items-center justify-center mx-auto ${
							isLoading ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						<Laugh className="w-6 h-6 mr-2" />
						{isLoading
							? "Chargement..."
							: currentJoke
								? "Une autre blague !"
								: "Découvrir une blague"}
					</button>
				</div>
			</main>

			{/* Create Joke Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
						<button
							onClick={() => setShowCreateModal(false)}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Ajouter une nouvelle blague
						</h2>
						{createSuccess ? (
							<div className="text-green-600 text-center py-4">
								Blague ajoutée avec succès !
							</div>
						) : (
							<form onSubmit={handleCreateJoke}>
								<div className="mb-4">
									<label
										htmlFor="question"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Question
									</label>
									<textarea
										id="question"
										value={newJoke.question}
										onChange={(e) =>
											setNewJoke({ ...newJoke, question: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
										rows={3}
										required
									/>
								</div>
								<div className="mb-6">
									<label
										htmlFor="answer"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Réponse
									</label>
									<textarea
										id="answer"
										value={newJoke.answer}
										onChange={(e) =>
											setNewJoke({ ...newJoke, answer: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
										rows={3}
										required
									/>
								</div>
								<button
									type="submit"
									className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
								>
									Ajouter la blague
								</button>
							</form>
						)}
					</div>
				</div>
			)}

			{/* Footer */}
			<footer className="w-full py-4 bg-white/10 backdrop-blur-sm mt-auto">
				<div className="container mx-auto px-4 text-center text-white/80">
					© {new Date().getFullYear()} Carambar & Co - Les meilleures blagues
					sont chez nous !
				</div>
			</footer>
		</div>
	);
}

export default App;
