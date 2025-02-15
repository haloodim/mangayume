import subprocess
import customtkinter as ctk
from tkinter import messagebox

def run_git_command(command):
    try:
        result = subprocess.run(command, check=True, shell=True, capture_output=True, text=True)
        messagebox.showinfo("Success", result.stdout if result.stdout else "Command executed successfully")
    except subprocess.CalledProcessError as e:
        messagebox.showerror("Error", e.stderr if e.stderr else "An error occurred")

def git_init():
    run_git_command("git init")

def git_add():
    run_git_command("git add .")

def git_commit():
    commit_message = commit_entry.get()
    if commit_message:
        run_git_command(f'git commit -m "{commit_message}"')
    else:
        messagebox.showwarning("Warning", "Commit message cannot be empty")

def git_push():
    run_git_command("git push")
    messagebox.showinfo("Success", "Push completed successfully")

# GUI setup
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

root = ctk.CTk()
root.title("Git Push Tool")
root.geometry("300x250")

ctk.CTkButton(root, text="Git Init", command=git_init).pack(pady=5)
ctk.CTkButton(root, text="Git Add .", command=git_add).pack(pady=5)

commit_entry = ctk.CTkEntry(root, width=250)
commit_entry.pack(pady=5)
commit_entry.insert(0, "Enter commit message")

ctk.CTkButton(root, text="Git Commit", command=git_commit).pack(pady=5)
ctk.CTkButton(root, text="Git Push", command=git_push).pack(pady=5)

root.mainloop()
