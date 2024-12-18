from flask_app import create_app

app = create_app()

@app.route("/", methods=["GET", "POST"])
def index():
    return "Hello world!"

if __name__ == "__main__":
    app.run()