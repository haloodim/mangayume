import os
import re
import json
import customtkinter as ctk
from tkinter import messagebox
from datetime import datetime
import textwrap
from fungsi.scrape import scrape_images 

def create_chapter():
    # Ambil data input
    chapter_title = entry_chapter_name.get().strip()
    komik_title = entry_chapter_check.get().strip()  # Ambil judul komik dari input
    image_links = text_area_image_link.get("1.0", "end").strip().splitlines()  # Ambil link gambar

    # Validasi input
    if not chapter_title or not komik_title or not image_links:
        messagebox.showerror("Error", "Judul chapter, komik, dan link gambar tidak boleh kosong!")
        return
    
    # Generate slug untuk chapter dan komik
    chapter_slug = re.sub(r'\s+', '-', chapter_title.lower())  # Format: chapter-01
    chapter_number = float(re.search(r'(\d+(\.\d+)?)', chapter_slug).group(0)) 
    #chapter_number = int(re.search(r'(\d+)', chapter_slug).group(0))  # Mengambil angka chapter
    created_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")  # Format tanggal
    
    # Generate slug komik
    komik_slug = re.sub(r'\s+', '-', komik_title.lower())  # Menggunakan re.sub untuk komik
    
    # Tentukan folder path berdasarkan komik_slug
    folder_path = os.path.join("content", komik_slug)
    
    # Cek apakah folder komik ada
    if not os.path.exists(folder_path):
        messagebox.showerror("Error", "Folder komik tidak ditemukan!")
        return

    # Cek file chapters.json
    chapters_json_path = os.path.join("data", "chapters.json")
    if os.path.exists(chapters_json_path):
        with open(chapters_json_path, "r", encoding="utf-8") as f:
            try:
                chapters_data = json.load(f)
            except json.JSONDecodeError:
                chapters_data = []
    else:
        chapters_data = []

    # Cari data komik yang sesuai dengan komik_slug
    comic_data = next((comic for comic in chapters_data if comic['slug'] == komik_slug), None)

    if not comic_data:
        messagebox.showerror("Error", f"Komik dengan slug {komik_slug} tidak ditemukan!")
        return

    # Cek apakah chapter sudah ada, jika sudah maka tambahkan setelah chapter terakhir
    if "chapters" not in comic_data:
        comic_data["chapters"] = []

    # Tambahkan chapter baru ke list chapters
    new_chapter = {
        "name": chapter_slug,
        "number": chapter_number,
        "createdAt": created_at
    }
    comic_data["chapters"].append(new_chapter)

    # Urutkan berdasarkan chapter number
    comic_data["chapters"] = sorted(comic_data["chapters"], key=lambda x: x["number"])

    # Simpan kembali ke chapters.json
    with open(chapters_json_path, "w", encoding="utf-8") as f:
        json.dump(chapters_data, f, indent=2)

    # Buat file MDX untuk chapter baru
    chapter_filename = f"{chapter_slug}.mdx"
    chapter_path = os.path.join(folder_path, chapter_filename)

    # Ambil judul komik dan buat frontmatter untuk file MDX
    chapter_mdx_content = textwrap.dedent(f"""\
        ---
        title: "{komik_title.replace(' Bahasa Indonesia', '')} Chapter {chapter_number} Bahasa Indonesia"
        deskripsi: "Ini adalah chapter {chapter_number} dari komik dengan judul {komik_title}."
        createdAt: {created_at}
        ---

    """)

    # Tambahkan gambar ke dalam konten dengan tag <img>
    for index, image_link in enumerate(image_links):
        chapter_mdx_content += f'<img src="{image_link}" alt="{komik_title} Chapter {chapter_number}" loading="lazy" />\n\n'

    # Simpan file chapter.mdx
    with open(chapter_path, "w", encoding="utf-8") as f:
        f.write(chapter_mdx_content)

    messagebox.showinfo("Sukses", f"Chapter {chapter_slug} berhasil dibuat dan disimpan ke dalam {chapter_path}")

    # Menghapus inputan setelah chapter berhasil dibuat
    entry_chapter_name.delete(0, ctk.END)
    text_area_image_link.delete("1.0", ctk.END)

    # Sembunyikan form inputan
    entry_chapter_name.pack_forget()
    text_area_image_link.pack_forget()
    btn_create_chapter.pack_forget()
    btn_scrape_link.pack_forget()

    # Menampilkan pesan atau tombol lain jika diperlukan setelah chapter selesai dibuat
    messagebox.showinfo("Sukses", "Chapter baru berhasil dibuat! Anda dapat membuat chapter baru lagi.")


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

# Fungsi cek judul komik dan chapter di json
def check_comic_and_chapter():
    comic_title = entry_chapter_check.get().strip()
    
    if not comic_title:
        messagebox.showerror("Error", "Judul komik tidak boleh kosong!")
        return
    
    # Konversi judul ke slug
    comic_slug = re.sub(r'\s+', '-', comic_title.lower())
    
    # Cek apakah chapters.json ada
    chapters_json_path = "data/chapters.json"
    if not os.path.exists(chapters_json_path):
        messagebox.showerror("Error", "File chapters.json tidak ditemukan!")
        return

    # Baca chapters.json
    try:
        with open(chapters_json_path, "r", encoding="utf-8") as f:
            chapters_data = json.load(f)
    except json.JSONDecodeError:
        chapters_data = []

    # Cari komik berdasarkan slug
    for entry in chapters_data:
        if entry["slug"] == comic_slug:
            chapters = entry.get("chapters", [])
            
            if not chapters:
                response = messagebox.askyesno("Info", f"Komik '{comic_title}' ditemukan.\nNamun, chapters masih kosong!\n\nIngin mengisi data JSON?")
                if response:
                    show_chapter_form()
                return
            
            # Ambil chapter terakhir berdasarkan number tertinggi
            last_chapter = max(chapters, key=lambda x: x["number"])
            response = messagebox.askyesno("Info", f"Komik '{comic_title}' ditemukan.\nChapter terakhir: {last_chapter['name']} (Chapter {last_chapter['number']})\nDibuat pada: {last_chapter['createdAt']}\n\nIngin menambah chapter baru?")
            
            if response:
                show_chapter_form()
            return
    
    # Jika tidak ditemukan
    messagebox.showwarning("Info", f"Komik '{comic_title}' tidak ditemukan dalam chapters.json!")

def show_chapter_form():
    # Menampilkan form input chapter setelah memilih Yes

    global entry_chapter_name  # Membuat entry field global untuk akses di seluruh fungsi
    entry_chapter_name = ctk.CTkEntry(tab_create_chapter, placeholder_text="Judul Chapter")
    entry_chapter_name.pack(pady=5, fill='x', padx=10)

    # Menggunakan CTkTextbox tanpa placeholder_text dan memperbesar tinggi
    global text_area_image_link  # Membuat text area global untuk akses di seluruh fungsi
    text_area_image_link = ctk.CTkTextbox(tab_create_chapter, height=100)  # Memperbesar tinggi text area
    text_area_image_link.pack(pady=5, fill='x', padx=10)

    # Tombol untuk membuat chapter baru (menambahkan fungsi create_chapter)
    global btn_create_chapter  # Menjadikan tombol sebagai global untuk akses di seluruh fungsi
    btn_create_chapter = ctk.CTkButton(tab_create_chapter, text="Buat Chapter Baru", command=create_chapter)  # Fungsi create_chapter dihubungkan dengan tombol
    btn_create_chapter.pack(pady=10)

    # Tombol Scrape Link
    global btn_scrape_link
    btn_scrape_link = ctk.CTkButton(tab_create_chapter, text="Scrape Link", command=open_scrape_window)
    btn_scrape_link.pack(pady=10)


# Definisikan entry_url secara global
global entry_url
scrape_window = None 

def open_scrape_window():
    global entry_url, scrape_window 
    # Membuka jendela baru untuk scraping menggunakan CTkToplevel
    scrape_window = ctk.CTkToplevel()
    scrape_window.title("Scrape Link")
    
    # Menentukan ukuran jendela baru
    window_width = 400
    window_height = 300
    
    # Mendapatkan posisi tengah layar
    screen_width = scrape_window.winfo_screenwidth()
    screen_height = scrape_window.winfo_screenheight()
    
    # Menghitung posisi x dan y untuk menampilkan di tengah
    position_top = int(screen_height / 2 - window_height / 2)
    position_left = int(screen_width / 2 - window_width / 2)

    # Menentukan ukuran dan posisi jendela
    scrape_window.geometry(f'{window_width}x{window_height}+{position_left}+{position_top}')

    scrape_window.resizable(False, False)  # Menonaktifkan resizing
    scrape_window.grab_set()  # Mencegah interaksi dengan jendela utama
    scrape_window.focus_set()  # Mengatur fokus ke jendela pop-up
    scrape_window.lift()  # Membuat jendela tetap berada di depan
    
    # Menambahkan widget pada jendela scrape_window
    label = ctk.CTkLabel(scrape_window, text="Masukkan URL untuk Scrape:")
    label.pack(pady=10)
    
    # Entry untuk URL komik
    entry_url = ctk.CTkEntry(scrape_window, placeholder_text="URL Komik")
    entry_url.pack(pady=10, padx=20, fill='x')

    # Tombol Scrape
    btn_scrape = ctk.CTkButton(scrape_window, text="Scrape Link", command=scrape_link)
    btn_scrape.pack(pady=10)

# Fungsi untuk melakukan scraping dan menampilkan hasilnya
def scrape_link():
    global entry_url, scrape_window  # Menandakan entry_url dan scrape_window sebagai global
    url = entry_url.get()  # Ambil URL dari entry

    # Panggil fungsi scrape_images dari file scrape.py
    image_links = scrape_images(url)

    # Jika hasil scraping adalah daftar gambar
    if isinstance(image_links, list):
        # Menampilkan hasil gambar di text_area_image_link
        for link in image_links:
            text_area_image_link.insert('end', link + '\n')  # Menambahkan setiap link ke text area
    else:
        # Jika ada error, tampilkan pesan error
        text_area_image_link.insert('end', image_links + '\n')  # Menampilkan pesan error

    # Setelah scraping selesai, tampilkan dialog "Scrape Selesai"
    show_scrape_complete_dialog()

    # Menutup jendela scrape setelah selesai
    if scrape_window:
        scrape_window.destroy()

# Fungsi untuk menampilkan dialog selesai menggunakan messagebox
def show_scrape_complete_dialog():
    # Menampilkan dialog selesai
    messagebox.showinfo("Scrape Selesai", "Scraping selesai!")





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
window_height = 550
position_x = (screen_width - window_width) // 2
position_y = (screen_height - window_height) // 2
root.geometry(f"{window_width}x{window_height}+{position_x}+{position_y}")

# Tab View
tabview = ctk.CTkTabview(root)
tabview.pack(pady=20, padx=20, fill="both", expand=True)

tab_create_folder = tabview.add("Create Folder")
tab_create_chapter = tabview.add("Create Chapter")
tab_create_chapter_batch = tabview.add("Create Chapter Batch")

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


# Tambahkan UI untuk cek komik di tab Create Chapter
# Tambahkan Entry untuk input judul komik
entry_chapter_check = ctk.CTkEntry(tab_create_chapter, placeholder_text="Judul Komik")
entry_chapter_check.pack(pady=10, fill='x', padx=10)

#UI untuk chapter batch



# Tambahkan tombol cek komik & chapter di UI
btn_check_comic = ctk.CTkButton(tab_create_chapter, text="Cek Komik & Chapter", command=check_comic_and_chapter)
btn_check_comic.pack(pady=10)



root.mainloop()
