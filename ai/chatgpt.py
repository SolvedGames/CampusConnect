import openai

openai.api_key = "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"

class ChatGPT():
    def __init__(self, role) -> None:
        self.role = role

    def get_response(self, question) -> str:
        messages = [
            { "role": "system", "content": self.role },
            { "role": "user", "content": question },
        ]

        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
        return completion.choices[0].message.content

