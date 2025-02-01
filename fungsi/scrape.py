import requests
from bs4 import BeautifulSoup

def scrape_images(url):
    # Mengirimkan request untuk mendapatkan halaman HTML
    response = requests.get(url)
    
    # Cek apakah request berhasil
    if response.status_code != 200:
        return "Failed to retrieve page"

    # Parsing HTML dengan BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Mencari elemen dengan id 'Baca_Komik'
    baca_komik = soup.find(id="Baca_Komik")

    # Jika elemen 'Baca_Komik' ditemukan, ambil semua src dari tag img
    if baca_komik:
        image_links = []
        for img_tag in baca_komik.find_all('img'):
            src = img_tag.get('src')
            if src:
                image_links.append(src)
        
        return image_links
    else:
        return "Baca_Komik not found"
