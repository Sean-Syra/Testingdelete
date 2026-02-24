def score_assessment(responses_json):
    """
    Score the assessment based on response values
    responses_json: List of integers (0-3) representing response values
    Returns: (total_score, severity, risk_flag)
    """
    # Calculate total score
    total_score = sum(responses_json)
    
    # Determine severity based on total score
    severity = determine_severity(total_score)
    
    # Check risk flag: if 9th question (index 8) > 0
    risk_flag = responses_json[8] > 0 if len(responses_json) > 8 else False
    
    return total_score, severity, risk_flag

def determine_severity(score):
    """
    Determine severity level based on total score
    """
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

def calculate_phq9_severity(score):
    """
    Calculate PHQ-9 severity based on score (0-27)
    """
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

def calculate_gad7_severity(score):
    """
    Calculate GAD-7 severity based on score (0-21)
    """
    if score <= 4:
        return "Minimal"
    elif score <= 9:
        return "Mild"
    elif score <= 14:
        return "Moderate"
    else:
        return "Severe"

def calculate_single_item_severity(value):
    """
    Calculate severity for single-item measures (0-3 scale)
    """
    if value == 0:
        return "Minimal"
    elif value == 1:
        return "Mild"
    elif value == 2:
        return "Moderate"
    else:
        return "Severe"

