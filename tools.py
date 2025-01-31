import os
import re
import customtkinter as ctk
from tkinter import messagebox

# Fungsi untuk membuat folder dan file index.mdx
def create_folder_and_file():
    title = entry_title.get().strip()
    deskripsi = entry_deskripsi.get().strip()
    author = entry_author.get().strip()
    genre = entry_genre.get().strip()
    status = entry_status.get().strip()
    type_ = entry_type.get().strip()
    image = entry_image.get().strip()
    project = entry_project.get().strip()
    rilis = entry_rilis.get().strip()
    
    if not title:
        messagebox.showerror("Error", "Judul tidak boleh kosong!")
        return
    
    folder_name = re.sub(r'\s+', '-', title.lower())
    content_dir = "content"
    folder_path = os.path.join(content_dir, folder_name)
    os.makedirs(folder_path, exist_ok=True)
    
    index_mdx_content = f"""
---
title: "{title}"
deskripsi: "{deskripsi}"
author: "{author}"
genre: "{genre}"
status: "{status}"
type: "{type_}"
image: "{image}"
project: "{project}"
rilis: "{rilis}"
---
"""
    
    index_mdx_path = os.path.join(folder_path, "index.mdx")
    with open(index_mdx_path, "w", encoding="utf-8") as f:
        f.write(index_mdx_content)
    
    messagebox.showinfo("Sukses", f"Folder '{folder_path}' dan file 'index.mdx' berhasil dibuat!")
    clear_entries()

# Fungsi untuk menghapus inputan setelah diproses
def clear_entries():
    entry_title.delete(0, ctk.END)
    entry_deskripsi.delete(0, ctk.END)
    entry_author.delete(0, ctk.END)
    entry_genre.delete(0, ctk.END)
    entry_status.delete(0, ctk.END)
    entry_type.delete(0, ctk.END)
    entry_image.delete(0, ctk.END)
    entry_project.delete(0, ctk.END)
    entry_rilis.delete(0, ctk.END)

# Setup GUI
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

root = ctk.CTk()
root.title("Folder & MDX Creator")
root.geometry("500x600")

# Pusatkan jendela di tengah layar
root.update_idletasks()
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()
window_width = 500
window_height = 600
position_x = (screen_width - window_width) // 2
position_y = (screen_height - window_height) // 2
root.geometry(f"{window_width}x{window_height}+{position_x}+{position_y}")

frame = ctk.CTkFrame(root)
frame.pack(pady=20, padx=20, fill="both", expand=True)

ctk.CTkLabel(frame, text="Masukkan Data untuk index.mdx", font=("Arial", 16)).pack(pady=10)

entry_title = ctk.CTkEntry(frame, placeholder_text="Judul")
entry_title.pack(pady=5, fill='x', padx=10)

entry_deskripsi = ctk.CTkEntry(frame, placeholder_text="Deskripsi")
entry_deskripsi.pack(pady=5, fill='x', padx=10)

entry_author = ctk.CTkEntry(frame, placeholder_text="Author")
entry_author.pack(pady=5, fill='x', padx=10)

entry_genre = ctk.CTkEntry(frame, placeholder_text="Genre")
entry_genre.pack(pady=5, fill='x', padx=10)

entry_status = ctk.CTkEntry(frame, placeholder_text="Status")
entry_status.pack(pady=5, fill='x', padx=10)

entry_type = ctk.CTkEntry(frame, placeholder_text="Type")
entry_type.pack(pady=5, fill='x', padx=10)

entry_image = ctk.CTkEntry(frame, placeholder_text="Image URL")
entry_image.pack(pady=5, fill='x', padx=10)

entry_project = ctk.CTkEntry(frame, placeholder_text="Project")
entry_project.pack(pady=5, fill='x', padx=10)

entry_rilis = ctk.CTkEntry(frame, placeholder_text="Rilis")
entry_rilis.pack(pady=5, fill='x', padx=10)

btn_create = ctk.CTkButton(frame, text="Proses", command=create_folder_and_file)
btn_create.pack(pady=20)

root.mainloop()
