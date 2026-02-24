def score_assessment(responses_json):
    total_score = sum(responses_json)
    severity = determine_severity(total_score)
    risk_flag = responses_json[8] > 0  # Assuming Q9 is the 9th question
    return total_score, severity, risk_flag

def determine_severity(score):
    if score <= 4:
        return "Minimal"
    elif score <= 9:
        return "Mild"
    elif score <= 14:
        return "Moderate"
    elif score <= 19:
        return "Moderately Severe"
    else:
        return "Severe"
