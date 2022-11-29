import sys
import json

def main():
    file_path = sys.argv[1]
    print('Hello World')
    print(file_path)
    f = open(file_path)
    data = json.load(f)
    
    env_file = open(".env", "a")
    for key, value in data['parameters'].items():
        print(value['value'])
        param_value = value['value']
        line = f'{key}={param_value}'
        env_file.write(f'{line}\n')

if __name__ == "__main__":
    main()