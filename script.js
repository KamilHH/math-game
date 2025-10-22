class Game {
	constructor(totalQuestions) {
		this.totalQuestions = totalQuestions;
		this.currentQuestion = 0;
		this.time = 0;
		this.answers = [];
		this.score = 0;
		this.gameActive = false;
		
	}
	start() {
		const input = document.querySelector("#answer");
		const endButton = document.querySelector(".end");
		const startButton = document.querySelector(".start");
		const game = document.querySelector(".game");

		document.querySelector(".results").innerHTML = "";
		document.querySelector(".score").textContent = "0";

		game.classList.add("on");
		input.disabled = false;
		this.gameActive = true;
		this.currentQuestion = 0;
		this.time = 0;
		this.answers = [];
		this.score = 0;
		startButton.disabled = true;
		endButton.disabled = false;

		this.clockId = setInterval(() => {
			this.time += 1;
			document.querySelector(".clock").textContent = this.timeFormat(this.time)
		}, 1000);

		this.askQuestion();
	}
	end() {
		const input = document.querySelector("#answer");
		const startButton = document.querySelector(".start");
		const endButton = document.querySelector(".end");
		const game = document.querySelector(".game");
		input.value = "";
		game.classList.remove("on");
		document.querySelector(".clock").textContent = "00:00:00";
		
		if (!this.answers.some(a => a.question === this.expression)) {
			this.answers.push({
				question: this.expression,
				correctAnswer: this.correctAnswer,
				playerAnswer: "no answer",
				correct: false,
			});
		}
		// game summary, answers, results
		const table = document.createElement("table");
		const tableHeader = document.createElement("tr");
		tableHeader.innerHTML =
			"<th>#</th><th>Question</th><th>Your Answer</th><th>Correct</th>";
		table.appendChild(tableHeader);
		this.answers.forEach((answer, i) => {
			const tr = document.createElement("tr");
			tr.innerHTML = `<th>${i + 1}</th><td>${answer.question}</td><td>${
				answer.playerAnswer
			}</td><td>${answer.correct == true ? "✅" : "❌"}</td>`;
			if (!answer.correct) {
				tr.classList.add("wrong");
			}
			table.appendChild(tr);
		});
		const p = document.createElement("p")
		p.textContent = `Score: ${this.score} / ${this.currentQuestion} Time: ${this.timeFormat(this.time)}`
		
		document.querySelector(".results").append(p, table);

		input.disabled = true;
		this.gameActive = false;
		this.time = 0;
		startButton.disabled = false;
		endButton.disabled = true;
		clearInterval(this.clockId);
	}
	askQuestion() {
		document.querySelector("#answer").focus();
		document.querySelector(".q-number").textContent = `Question #${this.currentQuestion + 1}`;
		const operators = ["+", "-"];
		const a = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
		const b = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
		const op = operators[Math.floor(Math.random() * operators.length)];
		this.expression = `${a} ${op} ${b}`;
		document.querySelector(".question").textContent = this.expression;
		this.currentQuestion++;
		
		let result;
		switch (op) {
			case "+":
				result = a + b;
				break;
			case "-":
				result = a - b;
				break;
		}
		this.correctAnswer = result;
	}
	checkAnswer() {
		let answer = document.querySelector("#answer").value;
		if (answer.trim() === "") return; //nie sprawdzi pustej odpowiedzi
		answer = parseFloat(answer);
		const correct = answer === this.correctAnswer
		if (correct) {
			this.score++;
			document.querySelector(".score").textContent = this.score.toString();
		}

		this.answers.push({
			question: this.expression,
			correctAnswer: this.correctAnswer,
			playerAnswer: answer,
			correct,
		});

		
		const input = document.querySelector("#answer");
		input.value = "";
		if (this.currentQuestion < this.totalQuestions) {
			this.askQuestion();
		} else {
			this.end()
		}
	}
	timeFormat(time) {
			const h = String(Math.floor(time / 3600)).padStart(2, "0");
			const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
			const s = String(time % 60).padStart(2, "0");
			return `${h}:${m}:${s}`;
	}
}

const game = new Game(10);
document.querySelector(".start").addEventListener("click", () => {
	game.start();
});
document.querySelector(".end").addEventListener("click", () => {
	game.end();
});
document.querySelector("#answer").addEventListener("keyup", (e) => {
	if (e.key === "Enter") {
		game.checkAnswer();
	}
});
