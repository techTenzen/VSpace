def process_json(json_data):
    processed_data = []

    # Faculty data
    if "faculties" in json_data and isinstance(json_data["faculties"], list):
        for entry in json_data["faculties"]:
            text = (
                f"Name: {entry['name']}\n"
                f"Department: {entry['department']}\n"
                f"Subjects: {', '.join(entry['subjects'])}\n"
                f"Cabin Number (Office): {entry['cabin_number']}\n"
                f"Email: {entry['email']}\n"
                f"Phone: {entry['phone']}"
            )
            processed_data.append(text)

    # Fee data
    if "programs" in json_data and isinstance(json_data["programs"], list):
        for program in json_data["programs"]:
            prog_name = program.get("name", "")

            # Type C: Flat programs with direct fees
            if "tuition_fees" in program:
                text = (
                    f"Program: {prog_name}\n"
                    f"Tuition Fees: {program.get('tuition_fees')}\n"
                    f"Caution Fees: {program.get('caution_fees')}\n"
                    f"Total Fees: {program.get('total_fees')}\n"
                )
                if "thesis_fees" in program:
                    text += f"Thesis Fees: {program.get('thesis_fees')}\n"
                processed_data.append(text)
                continue

            # Type A & B: programs with categories
            for category in program.get("categories", []):
                cat_id = category.get("category", "")

                # Type B: category has direct fees
                if "tuition_fees" in category:
                    text = (
                        f"Program: {prog_name}\n"
                        f"Category: {cat_id}\n"
                        f"Tuition Fees: {category.get('tuition_fees')}\n"
                        f"Caution Fees: {category.get('caution_fees')}\n"
                        f"Total Fees: {category.get('total_fees')}"
                    )
                    processed_data.append(text)

                # Type A: category has group_A/group_B
                for key, value in category.items():
                    if key.startswith("group_") and isinstance(value, dict):
                        text = (
                            f"Program: {prog_name}\n"
                            f"Category: {cat_id}\n"
                            f"Group: {key.split('_')[1].upper()}\n"
                            f"Total Fee: {value.get('total_fee')}\n"
                            f"Advance Fee: {value.get('advance_fee')}\n"
                            f"Balance Fee: {value.get('balance_fee')}"
                        )
                        processed_data.append(text)

    return processed_data
