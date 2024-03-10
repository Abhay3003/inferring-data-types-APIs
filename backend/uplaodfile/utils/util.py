
pandas_to_python = {
    "object": "String",
    "datetime64[ns]": "DateTime",
    "timedelta[ns]": "TimeFrame",
    "float64": "Integer or Float",
    "bool": "Boolean",
    "category": "Categorical Values"
}

valid_data_types = ["String", "DateTime", "TimeFrame", "Boolean", "Integer", "Float", "Categorical Values", "Key-Value Mapping"]

def convert_to_python_data_types(dictionary):
    for key, value in dictionary.items():
        dictionary[key] = pandas_to_python[value]
    return dictionary

def validate_update_data_types(dictionary):
    for value in dictionary.values():
        if value not in valid_data_types:
            return False
    return True
