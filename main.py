import os
import re
import json
import subprocess
import customtkinter as ctk
from tkinter import messagebox
from datetime import datetime
import textwrap
from fungsi.scrape_data import scrape_komik_title
from fungsi.scrape import scrape_images

# ===================== SETUP GLOBAL ===================== #
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# ===================== APLIKASI UTAMA ===================== #
app = ctk.CTk()
app.title("Aplikasi dengan 3 Tab")
app.geometry("900x750")

# Main Tabview
main_tabview = ctk.CTkTabview(app)
main_tabview.pack(fill="both", expand=True, padx=10, pady=10)

# ===================== TAB 1: Form Input Link Komik ===================== #
tab1 = main_tabview.add("Tab 1: Form Input Link Komik")
scrollable_frame = ctk.CTkScrollableFrame(tab1)
scrollable_frame.pack(padx=20, pady=20, fill="both", expand=True)

ctk.CTkLabel(scrollable_frame, text="Masukkan Link Scrape Komik:").pack(pady=10)
entry = ctk.CTkEntry(scrollable_frame, width=300)
entry.pack(pady=5)

def submit():
    link = entry.get()
    result = scrape_komik_title(link)
    label_output.configure(text=f"Judul: {result}")

ctk.CTkButton(scrollable_frame, text="Submit", command=submit).pack(pady=10)
label_output = ctk.CTkLabel(scrollable_frame, text="")
label_output.pack(pady=5)

# ===================== TAB 2: Folder & MDX Creator ===================== #
tab2 = main_tabview.add("Tab 2: Folder & MDX Creator")
# Menggunakan nested tabview agar sesuai dengan struktur kode asli
nested_tabview = ctk.CTkTabview(tab2)
nested_tabview.pack(pady=20, padx=20, fill="both", expand=True)

# --- Nested Tab: Create Folder ---
tab_create_folder = nested_tabview.add("Create Folder")
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
        "chapters": []
    }
    
    chapters_data.insert(0, new_entry)
    
    with open(chapters_json_path, "w", encoding="utf-8") as f:
        json.dump(chapters_data, f, indent=2)
    
    messagebox.showinfo("Sukses", f"Folder '{folder_path}', file 'index.mdx', dan 'chapters.json' berhasil diperbarui!")
    clear_entries()

ctk.CTkButton(tab_create_folder, text="Proses", command=create_folder_and_file).pack(pady=20)

# --- Nested Tab: Create Chapter ---
tab_create_chapter = nested_tabview.add("Create Chapter")
entry_chapter_check = ctk.CTkEntry(tab_create_chapter, placeholder_text="Judul Komik")
entry_chapter_check.pack(pady=10, fill='x', padx=10)

def create_chapter():
    chapter_title = entry_chapter_name.get().strip()
    komik_title = entry_chapter_check.get().strip()
    image_links = text_area_image_link.get("1.0", "end").strip().splitlines()
    
    if not chapter_title or not komik_title or not image_links:
        messagebox.showerror("Error", "Judul chapter, komik, dan link gambar tidak boleh kosong!")
        return
    
    chapter_slug = re.sub(r'\s+', '-', chapter_title.lower())
    chapter_number = float(re.search(r'(\d+(\.\d+)?)', chapter_slug).group(0))
    created_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    
    komik_slug = re.sub(r'\s+', '-', komik_title.lower())
    folder_path = os.path.join("content", komik_slug)
    
    if not os.path.exists(folder_path):
        messagebox.showerror("Error", "Folder komik tidak ditemukan!")
        return

    chapters_json_path = os.path.join("data", "chapters.json")
    if os.path.exists(chapters_json_path):
        with open(chapters_json_path, "r", encoding="utf-8") as f:
            try:
                chapters_data = json.load(f)
            except json.JSONDecodeError:
                chapters_data = []
    else:
        chapters_data = []

    comic_data = next((comic for comic in chapters_data if comic['slug'] == komik_slug), None)

    if not comic_data:
        messagebox.showerror("Error", f"Komik dengan slug {komik_slug} tidak ditemukan!")
        return

    if "chapters" not in comic_data:
        comic_data["chapters"] = []

    new_chapter = {
        "name": chapter_slug,
        "number": chapter_number,
        "createdAt": created_at
    }
    comic_data["chapters"].append(new_chapter)
    comic_data["chapters"] = sorted(comic_data["chapters"], key=lambda x: x["number"])

    with open(chapters_json_path, "w", encoding="utf-8") as f:
        json.dump(chapters_data, f, indent=2)

    chapter_filename = f"{chapter_slug}.mdx"
    chapter_path = os.path.join(folder_path, chapter_filename)

    chapter_mdx_content = textwrap.dedent(f"""\
        ---
        title: "{komik_title.replace(' Bahasa Indonesia', '')} Chapter {chapter_number} Bahasa Indonesia"
        deskripsi: "Ini adalah chapter {chapter_number} dari komik dengan judul {komik_title}."
        createdAt: {created_at}
        ---
    
    """)
    for index, image_link in enumerate(image_links):
        chapter_mdx_content += f'<img src="{image_link}" alt="{komik_title} Chapter {chapter_number}" />\n\n'

    with open(chapter_path, "w", encoding="utf-8") as f:
        f.write(chapter_mdx_content)

    messagebox.showinfo("Sukses", f"Chapter {chapter_slug} berhasil dibuat dan disimpan ke dalam {chapter_path}")

    entry_chapter_name.delete(0, ctk.END)
    text_area_image_link.delete("1.0", ctk.END)

    entry_chapter_name.pack_forget()
    text_area_image_link.pack_forget()
    btn_create_chapter.pack_forget()
    btn_scrape_link.pack_forget()

    messagebox.showinfo("Sukses", "Chapter baru berhasil dibuat! Anda dapat membuat chapter baru lagi.")

def check_comic_and_chapter():
    comic_title = entry_chapter_check.get().strip()
    
    if not comic_title:
        messagebox.showerror("Error", "Judul komik tidak boleh kosong!")
        return
    
    comic_slug = re.sub(r'\s+', '-', comic_title.lower())
    chapters_json_path = "data/chapters.json"
    if not os.path.exists(chapters_json_path):
        messagebox.showerror("Error", "File chapters.json tidak ditemukan!")
        return

    try:
        with open(chapters_json_path, "r", encoding="utf-8") as f:
            chapters_data = json.load(f)
    except json.JSONDecodeError:
        chapters_data = []

    for entry_data in chapters_data:
        if entry_data["slug"] == comic_slug:
            chapters = entry_data.get("chapters", [])
            if not chapters:
                response = messagebox.askyesno("Info", f"Komik '{comic_title}' ditemukan.\nNamun, chapters masih kosong!\n\nIngin mengisi data JSON?")
                if response:
                    show_chapter_form()
                return
            last_chapter = max(chapters, key=lambda x: x["number"])
            response = messagebox.askyesno("Info", f"Komik '{comic_title}' ditemukan.\nChapter terakhir: {last_chapter['name']} (Chapter {last_chapter['number']})\nDibuat pada: {last_chapter['createdAt']}\n\nIngin menambah chapter baru?")
            if response:
                show_chapter_form()
            return
    messagebox.showwarning("Info", f"Komik '{comic_title}' tidak ditemukan dalam chapters.json!")

def show_chapter_form():
    global entry_chapter_name
    entry_chapter_name = ctk.CTkEntry(tab_create_chapter, placeholder_text="Judul Chapter")
    entry_chapter_name.pack(pady=5, fill='x', padx=10)
    
    global text_area_image_link
    text_area_image_link = ctk.CTkTextbox(tab_create_chapter, height=100)
    text_area_image_link.pack(pady=5, fill='x', padx=10)
    
    global btn_create_chapter
    btn_create_chapter = ctk.CTkButton(tab_create_chapter, text="Buat Chapter Baru", command=create_chapter)
    btn_create_chapter.pack(pady=10)
    
    global btn_scrape_link
    btn_scrape_link = ctk.CTkButton(tab_create_chapter, text="Scrape Link", command=open_scrape_window)
    btn_scrape_link.pack(pady=10)

ctk.CTkButton(tab_create_chapter, text="Cek Komik & Chapter", command=check_comic_and_chapter).pack(pady=10)

# --- Nested Tab: Create Chapter Batch (UI tambahan) ---
tab_create_chapter_batch = nested_tabview.add("Create Chapter Batch")
ctk.CTkLabel(tab_create_chapter_batch, text="UI untuk chapter batch").pack(pady=20)

def open_scrape_window():
    global entry_url, scrape_window 
    scrape_window = ctk.CTkToplevel(app)
    scrape_window.title("Scrape Link")
    window_width = 400
    window_height = 300
    screen_width = scrape_window.winfo_screenwidth()
    screen_height = scrape_window.winfo_screenheight()
    position_top = int(screen_height / 2 - window_height / 2)
    position_left = int(screen_width / 2 - window_width / 2)
    scrape_window.geometry(f'{window_width}x{window_height}+{position_left}+{position_top}')
    scrape_window.resizable(False, False)
    scrape_window.grab_set()
    scrape_window.focus_set()
    scrape_window.lift()
    ctk.CTkLabel(scrape_window, text="Masukkan URL untuk Scrape:").pack(pady=10)
    global entry_url
    entry_url = ctk.CTkEntry(scrape_window, placeholder_text="URL Komik")
    entry_url.pack(pady=10, padx=20, fill='x')
    ctk.CTkButton(scrape_window, text="Scrape Link", command=scrape_link).pack(pady=10)

def scrape_link():
    global entry_url, scrape_window
    url = entry_url.get()
    image_links = scrape_images(url)
    if isinstance(image_links, list):
        for link in image_links:
            text_area_image_link.insert('end', link + '\n')
    else:
        text_area_image_link.insert('end', image_links + '\n')
    show_scrape_complete_dialog()
    if scrape_window:
        scrape_window.destroy()

def show_scrape_complete_dialog():
    messagebox.showinfo("Scrape Selesai", "Scraping selesai!")

# --- End of Tab 2 ---

# ===================== TAB 3: Git Push Tool ===================== #
tab3 = main_tabview.add("Tab 3: Git Push Tool")

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

ctk.CTkButton(tab3, text="Git Init", command=git_init).pack(pady=5)
ctk.CTkButton(tab3, text="Git Add .", command=git_add).pack(pady=5)

commit_entry = ctk.CTkEntry(tab3, width=250)
commit_entry.pack(pady=5)
commit_entry.insert(0, "Enter commit message")

ctk.CTkButton(tab3, text="Git Commit", command=git_commit).pack(pady=5)
ctk.CTkButton(tab3, text="Git Push", command=git_push).pack(pady=5)

# Menjalankan aplikasi utama
app.mainloop()
