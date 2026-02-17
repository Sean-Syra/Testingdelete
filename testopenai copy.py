from openai import OpenAI
#client = OpenAI()
client = OpenAI(api_key="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")

response = client.responses.create(
    model="gpt-5.2",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)