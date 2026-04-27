import os
import subprocess

ui_folder = "UiFolder"
py_folder = "PyFolder"

os.makedirs(py_folder, exist_ok=True)

for ui_file in os.listdir(ui_folder):
    if ui_file.endswith(".ui"):
        input_path = os.path.join(ui_folder, ui_file)
        output_path = os.path.join(py_folder, f"{os.path.splitext(ui_file)[0]}.py")
        subprocess.run(["pyside6-uic", input_path, "-o", output_path])
        print(f"Converted {input_path} to {output_path}")