import time

class Note():
    def __init__(self, title="", body="", created=time.time(), last_updated=time.time()) -> None:
        self.title = title
        self.body = body
        self.created = created
        self.last_updated = last_updated
