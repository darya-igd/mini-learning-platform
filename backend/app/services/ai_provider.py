from ..config import settings
import httpx

async def generate_lesson(topic: str, prompt: str) -> str:
    if not settings.OPENAI_API_KEY:
        return f"# Lesson: {topic}\n\n**Prompt:** {prompt}\n\nThis is a mock lesson with Overview, Key Concepts, Examples, and a Quick Quiz."
    headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
    data = {
        "model": settings.OPENAI_MODEL,
        "input": f"Create a concise beginner lesson on {topic}. User prompt: {prompt}. Sections: Overview, Key Concepts, Examples, Quick Quiz.",
    }
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post("https://api.openai.com/v1/responses", headers=headers, json=data)
        r.raise_for_status()
        j = r.json()
        # Try to grab a text field safely; adapt if your model/SDK differs
        return j.get("output", "") or j.get("content", [{}])[0].get("text", "AI response unavailable")

