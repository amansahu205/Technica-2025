def handle_assessment(payload):
    answers = payload.get("answers") or []
    score = sum(1 for a in answers if str(a).lower() in ["a","b","c"])
    level = "beginner" if score < 3 else "intermediate" if score < 6 else "advanced"
    return {"profile": level, "score": score}