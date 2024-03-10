import pandas as pd
import openpyxl
import numpy as np
from datetime import datetime
from collections import defaultdict
import sys
import json

def infer_data_types(file_path):
    
    try:
        if file_path.endswith(".csv"):
            df = pd.read_csv(file_path, dtype=object)
        elif file_path.endswith(".xlsx"):
            df = pd.read_excel(file_path, dtype=object)
        else:
            raise ValueError("Unsupported file format. Please provide a CSV or Excel file.")

        for col in df.columns:
            inferred_type = df[col].dtype

            if pd.api.types.is_string_dtype(inferred_type):
                try:
                    df[col] = pd.to_datetime(df[col])
                except ValueError:
                    pass
            if pd.api.types.is_string_dtype(df[col]):
                try:
                    df[col] = pd.to_timedelta(df[col])
                except ValueError:
                    pass
            if pd.api.types.is_string_dtype(df[col]) and df[col].nunique() < len(df):
                df[col] = pd.Categorical(df[col])
            
            if inferred_type == object and df[col].dtype == object:
                count = count_numeric_strings(df[col])
                if count < len(df[col])//2 + 1:
                    df[col] = df[col].astype(str)
                else:
                    df[col] = pd.to_numeric(pd.Series(df[col]), errors='coerce')

    except (IOError, FileNotFoundError) as e:
        return None, str(e)
    
    return (df.dtypes.apply(lambda x: x.name).to_dict())

def count_numeric_strings(data):
    count = 0
    for item in data:
        try:
            float(item)
            count += 1
        except ValueError:
            pass
    return count

if __name__ == '__main__':
    received_data = sys.argv[1]
    df = infer_data_types(received_data)
    print(json.dumps(df))