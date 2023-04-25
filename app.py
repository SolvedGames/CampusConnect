from flask import render_template, Flask, request

from ai.chatgpt import ChatGPT

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/maths/solver/", methods=["GET", "POST"])
def maths_solver():
    if request.method == "POST":
        question = request.form.get("question")
        return ChatGPT("You are a maths solver. Provide accurate solutions and show the steps.").get_response(question)
        
    else:
        return render_template("maths_solver.html")
    
@app.route("/notes/")
def notes():
    return render_template("notes.html")



app.run(debug=True)
