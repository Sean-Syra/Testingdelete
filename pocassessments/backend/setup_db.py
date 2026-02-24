from database import init_db, get_connection, questions_table

def populate_questions():
    """Populate the questions table with PHQ-9 and GAD-7 questions"""
    questions = [
        # PHQ-9 Questions
        ("Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?", "PHQ9"),
        ("Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?", "PHQ9"),
        ("Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?", "PHQ9"),
        ("Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?", "PHQ9"),
        ("Over the last 2 weeks, how often have you had poor appetite or been overeating?", "PHQ9"),
        ("Over the last 2 weeks, how often have you felt bad about yourself or that you are a failure?", "PHQ9"),
        ("Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading the newspaper or watching television?", "PHQ9"),
        ("Over the last 2 weeks, how often have you been moving or speaking so slowly that other people could have noticed? Or the opposite, being so fidgety or restless that you have been moving around a lot more than usual?", "PHQ9"),
        ("Over the last 2 weeks, how often have you had thoughts that you would be better off dead, or of hurting yourself in some way?", "PHQ9"),
        # GAD-7 Questions
        ("Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious or on edge?", "GAD7"),
        ("Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?", "GAD7"),
        ("Over the last 2 weeks, how often have you been bothered by worrying too much about different things?", "GAD7"),
        ("Over the last 2 weeks, how often have you had trouble relaxing?", "GAD7"),
        ("Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?", "GAD7"),
        ("Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?", "GAD7"),
        ("Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?", "GAD7"),
    ]
    
    try:
        connection = get_connection()
        for text, qtype in questions:
            connection.execute(
                questions_table.insert().values(
                    question_text=text,
                    question_type=qtype
                )
            )
        connection.commit()
        connection.close()
        print(f"Successfully populated {len(questions)} questions.")
    except Exception as e:
        print(f"Error populating questions: {str(e)}")

if __name__ == "__main__":
    init_db()
    populate_questions()
    print("Database setup completed successfully.")

