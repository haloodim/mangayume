import requests
from bs4 import BeautifulSoup
import re
import os
import json
from datetime import datetime
from tkinter import messagebox

def scrape_komik_title(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        title_container = soup.find("div", id="Judul")

        if title_container:
            h1_tag = title_container.find("h1")

            if h1_tag:
                span_tag = h1_tag.find("span")

                if span_tag:
                    title = span_tag.get_text(strip=True).replace("Komik", "").strip()
                    title_with_lang = f"{title} Bahasa Indonesia"
                    formatted_title = f"{title.lower().replace(' ', '-')}-bahasa-indonesia"

                    # Deskripsi
                    description = soup.find("p", class_="desc").get_text(strip=True) if soup.find("p", class_="desc") else "Deskripsi tidak ditemukan"
                    description = re.sub(r'\s+', ' ', description).strip()  # Rapiin deskripsi

                    # Author, Genre, Status, Type
                    author = soup.select("table tr:nth-of-type(5) td:nth-of-type(2)")[0].get_text(strip=True) if soup.select("table tr:nth-of-type(5) td:nth-of-type(2)") else "Author tidak ditemukan"
                    genres = [span.get_text(strip=True) for span in [g.find("span") for g in soup.find_all("li", class_="genre")] if span]
                    genre = ", ".join(genres)
                    status = soup.select("table tr:nth-of-type(6) td:nth-of-type(2)")[0].get_text(strip=True) if soup.select("table tr:nth-of-type(6) td:nth-of-type(2)") else "Status tidak ditemukan"
                    type_ = soup.select("table tr:nth-of-type(3) td:nth-of-type(2)")[0].get_text(strip=True) if soup.select("table tr:nth-of-type(3) td:nth-of-type(2)") else "Type tidak ditemukan"

                    # Gambar
                    image_tag = soup.find("div", class_="ims").find("img") if soup.find("div", class_="ims") else None
                    image = image_tag["src"] if image_tag else "Image tidak ditemukan"

                    project = "no"
                    rilis = "none"

                    base_url = "https://komiku.id"
                    chapter_tags = soup.find_all("td", class_="judulseries")
                    chapters = []

                    # Modifikasi pada bagian penamaan chapter
                    for chapter_tag in chapter_tags:
                        chapter_name = chapter_tag.find("span").get_text(strip=True) if chapter_tag.find("span") else "Chapter tidak ditemukan"
                        chapter_href = chapter_tag.find("a")["href"] if chapter_tag.find("a") else None

                        if chapter_href:
                            chapter_href = chapter_href.replace("/manga", "")
                            full_url = f"{base_url}{chapter_href}"

                            # Ambil hanya angka dari nama chapter dan perhatikan koma jika ada
                            chapter_number_match = re.search(r"(\d+(\.\d+)?)", chapter_name)
                            if chapter_number_match:
                                chapter_number = chapter_number_match.group(1)

                                # Format chapter number dengan menambahkan angka 0 di depan jika kurang dari 10
                                if '.' in chapter_number:
                                    # Jika chapter memiliki angka desimal
                                    integer_part, decimal_part = chapter_number.split('.')
                                    chapter_number = f"{int(integer_part):02d}.{decimal_part}"
                                    chapter_file_name = f"chapter-{chapter_number}.mdx"
                                else:
                                    # Jika chapter hanya memiliki angka bulat
                                    chapter_number = f"{int(chapter_number):02d}"  # Menambahkan angka 0 di depan jika kurang dari 10
                                    chapter_file_name = f"chapter-{chapter_number}.mdx"

                                chapters.append({
                                    "chapter": chapter_file_name,
                                    "href": full_url
                                })


                    # Mengambil chapter dari bawah ke atas sesuai urutan di halaman web
                    chapters.reverse()  # Membalik urutan, chapter terbaru ada di bawah

                    # Membuat folder dan file index.mdx
                    content_dir = './content'
                    slug_folder_path = os.path.join(content_dir, formatted_title)

                    if not os.path.exists(slug_folder_path):
                        os.makedirs(slug_folder_path)

                    index_file_path = os.path.join(slug_folder_path, 'index.mdx')
                    mdx_content = f"""---
title: {title_with_lang}
deskripsi: {description}
author: {author}
genre: {genre}
status: {status}
type: {type_}
image: {image}
project: {project}
rilis: {rilis}
---

# Daftar Chapter
"""

                    for chapter in chapters:
                        mdx_content += f"- [{chapter['chapter'].replace('.mdx', '')}]({chapter['href']})\n"

                    with open(index_file_path, "w", encoding="utf-8") as f:
                        f.write(mdx_content)

                    chapters_data = []
                    for chapter in chapters:
                        # Scrape images for each chapter
                        image_links = scrape_images(chapter['href'])

                        created_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")

                        chapter_title = chapter["chapter"].replace('.mdx', '')
                        chapter_number = re.search(r"(\d+(\.\d+)?)", chapter_title).group(1)

                        # Menambahkan gambar ke dalam konten chapter (vertikal)
                        image_html = "".join([f'<img src="{img}" alt="{title} Chapter {chapter_number} Bahasa Indonesia" loading="lazy" />\n' for img in image_links])

                        mdx_content = f"""---
title: "{title} Chapter {chapter_number} Bahasa Indonesia"
deskripsi: "Ini adalah chapter {chapter_number} dari komik dengan judul {title} Bahasa Indonesia."
createdAt: {created_at}
---

{image_html}
"""

                        chapter_path = os.path.join(slug_folder_path, chapter["chapter"])
                        with open(chapter_path, "w", encoding="utf-8") as f:
                            f.write(mdx_content)

                        chapters_data.append({
                            "name": chapter["chapter"].replace('.mdx', ''),
                            "number": float(chapter_number) if '.' in chapter_number else int(chapter_number),
                            "createdAt": created_at
                        })

                    # Membalik urutan chapter agar chapter pertama muncul di bawah
                    chapters_data.reverse()  # Membalik urutan, chapter baru di bawah

                    chapters_json_path = "./data/chapters.json"

                    if os.path.exists(chapters_json_path):
                        with open(chapters_json_path, "r", encoding="utf-8") as f:
                            existing_data = json.load(f)
                    else:
                        existing_data = []

                    if not isinstance(existing_data, list):
                        existing_data = []

                    for entry in existing_data:
                        if entry["slug"] == formatted_title:
                            entry["chapters"] = chapters_data
                            break
                    else:
                        new_entry = {
                            "slug": formatted_title,
                            "chapters": chapters_data
                        }
                        existing_data.insert(0, new_entry)

                    with open(chapters_json_path, "w", encoding="utf-8") as f:
                        json.dump(existing_data, f, ensure_ascii=False, indent=4)

                    messagebox.showinfo("Berhasil", f"Scrape sukses! Data '{formatted_title}' telah disimpan.\n{len(chapters)} chapter dibuat.")
                    return f"Folder '{formatted_title}' dan file 'index.mdx' berhasil dibuat. {len(chapters)} chapter ditambahkan."

                else:
                    raise ValueError("Judul tidak ditemukan dalam <span>")

            else:
                raise ValueError("Elemen <h1> tidak ditemukan di dalam div judul")

        else:
            raise ValueError("Elemen dengan id='Judul' tidak ditemukan")

    except requests.exceptions.RequestException as e:
        messagebox.showerror("Gagal", f"Terjadi kesalahan: {e}")
        return f"Error: {e}"
    except Exception as e:
        messagebox.showerror("Error", f"Terjadi kesalahan: {e}")
        return f"Error: {e}"

# Fungsi untuk scrape gambar pada halaman chapter
def scrape_images(url):
    response = requests.get(url)
    if response.status_code != 200:
        return "Failed to retrieve page"

    soup = BeautifulSoup(response.content, 'html.parser')
    baca_komik = soup.find(id="Baca_Komik")

    if baca_komik:
        image_links = []
        for img_tag in baca_komik.find_all('img'):
            src = img_tag.get('src')
            if src:
                image_links.append(src)

        return image_links
    else:
        return "Baca_Komik not found"
