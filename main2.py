import customtkinter as ctk
from fungsi.scrape_data import scrape_komik_title

# Fungsi untuk menangani input link scrape komik
def submit():
    link = entry.get()
    result = scrape_komik_title(link)
    label_output.configure(text=f"Judul: {result}")

# Inisialisasi aplikasi
app = ctk.CTk()
app.title("Form Input Link Komik")

# Menentukan ukuran window
width = 400
height = 300  # Meningkatkan tinggi untuk memberi ruang scroll

# Menentukan posisi window di tengah layar
app.update_idletasks()
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()
x = (screen_width - width) // 2
y = (screen_height - height) // 2

app.geometry(f"{width}x{height}+{x}+{y}")

# Membuat scrollable frame
scrollable_frame = ctk.CTkScrollableFrame(app)
scrollable_frame.pack(padx=20, pady=20, fill="both", expand=True)

# Label dan input field di dalam scrollable frame
label = ctk.CTkLabel(scrollable_frame, text="Masukkan Link Scrape Komik:")
label.pack(pady=10)

entry = ctk.CTkEntry(scrollable_frame, width=300)
entry.pack(pady=5)

button = ctk.CTkButton(scrollable_frame, text="Submit", command=submit)
button.pack(pady=10)

label_output = ctk.CTkLabel(scrollable_frame, text="")
label_output.pack(pady=5)

# Menjalankan aplikasi
app.mainloop()
