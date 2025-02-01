import os
import re
import json
import customtkinter as ctk
from tkinter import messagebox
from datetime import datetime

# Fungsi untuk membuat folder dan file index.mdx serta memperbarui chapters.json
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
    data_dir = "data"
    folder_path = os.path.join(content_dir, folder_name)
    os.makedirs(folder_path, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)
    
    index_mdx_content = f"""---
title: {title}
deskripsi: {deskripsi}
author: {author}
genre: {genre}
status: {status}
type: {type_}
image: {image}
project: {project}
rilis: {rilis}
---
"""
    
    index_mdx_path = os.path.join(folder_path, "index.mdx")
    with open(index_mdx_path, "w", encoding="utf-8") as f:
        f.write(index_mdx_content)
    
    chapters_json_path = os.path.join(data_dir, "chapters.json")
    if os.path.exists(chapters_json_path):
        with open(chapters_json_path, "r", encoding="utf-8") as f:
            try:
                chapters_data = json.load(f)
            except json.JSONDecodeError:
                chapters_data = []
    else:
        chapters_data = []
    
    new_entry = {
        "slug": folder_name,
        "chapters": [
            
        ]
    }
    
    chapters_data.insert(0, new_entry)
    
    with open(chapters_json_path, "w", encoding="utf-8") as f:
        json.dump(chapters_data, f, indent=2)
    
    messagebox.showinfo("Sukses", f"Folder '{folder_path}', file 'index.mdx', dan 'chapters.json' berhasil diperbarui!")
    clear_entries()

# Fungsi untuk membuat chapter baru
def create_chapter():
    chapter_title = entry_chapter_title.get().strip()
    komik_slug = entry_komik_slug.get().strip()
    
    if not chapter_title or not komik_slug:
        messagebox.showerror("Error", "Judul chapter dan slug komik tidak boleh kosong!")
        return
    
    folder_path = os.path.join("content", komik_slug)
    if not os.path.exists(folder_path):
        messagebox.showerror("Error", "Folder komik tidak ditemukan!")
        return
    
    chapter_number = len([f for f in os.listdir(folder_path) if f.startswith("chapter-")]) + 1
    chapter_filename = f"chapter-{chapter_number:02}.mdx"
    chapter_path = os.path.join(folder_path, chapter_filename)
    
    chapter_content = f"""---
title: "{chapter_title}"
number: {chapter_number}
---

# {chapter_title}
"""
    
    with open(chapter_path, "w", encoding="utf-8") as f:
        f.write(chapter_content)
    
    messagebox.showinfo("Sukses", f"Chapter '{chapter_title}' berhasil dibuat di '{chapter_filename}'!")
    entry_chapter_title.delete(0, ctk.END)
    entry_komik_slug.delete(0, ctk.END)

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

# Tab View
tabview = ctk.CTkTabview(root)
tabview.pack(pady=20, padx=20, fill="both", expand=True)

tab_create_folder = tabview.add("Create Folder")
tab_create_chapter = tabview.add("Create Chapter")

# Tab Create Folder
ctk.CTkLabel(tab_create_folder, text="Masukkan Data untuk index.mdx", font=("Arial", 16)).pack(pady=10)
entry_title = ctk.CTkEntry(tab_create_folder, placeholder_text="Judul")
entry_title.pack(pady=5, fill='x', padx=10)
entry_deskripsi = ctk.CTkEntry(tab_create_folder, placeholder_text="Deskripsi")
entry_deskripsi.pack(pady=5, fill='x', padx=10)
entry_author = ctk.CTkEntry(tab_create_folder, placeholder_text="Author")
entry_author.pack(pady=5, fill='x', padx=10)
entry_genre = ctk.CTkEntry(tab_create_folder, placeholder_text="Genre")
entry_genre.pack(pady=5, fill='x', padx=10)
entry_status = ctk.CTkEntry(tab_create_folder, placeholder_text="Status")
entry_status.pack(pady=5, fill='x', padx=10)
entry_type = ctk.CTkEntry(tab_create_folder, placeholder_text="Type")
entry_type.pack(pady=5, fill='x', padx=10)
entry_image = ctk.CTkEntry(tab_create_folder, placeholder_text="Image URL")
entry_image.pack(pady=5, fill='x', padx=10)
entry_project = ctk.CTkEntry(tab_create_folder, placeholder_text="Project")
entry_project.pack(pady=5, fill='x', padx=10)
entry_rilis = ctk.CTkEntry(tab_create_folder, placeholder_text="Rilis")
entry_rilis.pack(pady=5, fill='x', padx=10)
btn_create = ctk.CTkButton(tab_create_folder, text="Proses", command=create_folder_and_file)
btn_create.pack(pady=20)

root.mainloop()
