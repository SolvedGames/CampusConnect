from datetime import datetime

class Note():
    def __init__(self, title: str, body: str, created: datetime) -> None:
        self.title = title
        self.body = body
        self.created = created
        