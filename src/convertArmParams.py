import sys
import json

def main():
    file_path = sys.argv[1]
    print('Hello World')
    print(file_path)
    f = open(file_path)
    data = json.load(f)
    generate_environment_file(data)
    
    
def generate_environment_file(json_data):
    env_file = open(".env", "a")
    for key, value in json_data['parameters'].items():
        print(value['value'])
        param_value = value['value']
        line = f'{key}="{param_value}"'
        env_file.write(f'{line}\n')

def generate_powershell_comman(json_data):
    env_file = open("powershellCmd.ps1", "a")
    

if __name__ == "__main__":
    main()