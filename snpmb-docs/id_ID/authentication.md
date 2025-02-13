# Autentikasi

## 01. Login

Untuk melakukan login pada laman SNPMB, kita harus melakukan visit pada laman SNPMB Dashboard terlebih dahulu.
Karena, kita akan melakukan login pada SSO yang telah disediakan.

- Link Dashboard: https://portal-snpmb.bppp.kemdikbud.go.id/dashboard

Jika belum login pada laman dashboard (sebagai guest), akan redirect ke laman SSO SNPMB.

### 01.1 Payload (as search params / queries)
```json
{
    "username": "EMAIL",
    "password": "PASSWORD"
}
```
 ### 01.2 Pengiriman Payload
 Melakukan HTTP Request POST pada url SSO yang telah didapat dari step pertama dari redirection SNPMB Dashboard.
 ```yaml
http_method: POST
http_url: sso_url
http_body: queries / search params of sso_url + &username=EMAIL&password=PASSWORD
http_headers:
    - "Content-Type=application/x-www-form-urlencoded"
 ```

 `sso_url` pada redirection sudah memiliki payload yang dibutuhkan, sebaiknya tidak dihapus atau menggunakan URL baru.

 ### 01.3 Respons
 **Identifikasi Gagal Masuk:** Terdapat kalimat `email atau kata sandi anda salah!` pada body respons.

**Identifikasi Berhasil Masuk:** Tidak mendapat kalimat pada identifikasi gagal, mendapat redirection dengan cookie `opbs=authenticated`, selanjutnya silahkan simpan cookie selama proses redirection ini ke dalam file store.

## 02. Logout
Untuk melakukan logout, secara sederhana bisa saja hard-logout dengan melakukan fresh session ke dashboard SNPMB.

Namun, apabila mengikuti soft logout berdasarkan flow website SNPMB, kurang lebih seperti berikut:

1. Melakukan HTTP Request GET biasa dengan menggunakan cookie account ke `dashboard url + /auth/logout`
2. Selanjutnya, akan mendapatkan redirection ke URL baru (bisa didapatkan dari response header `Location`)
3. Apabila URL redirection mengandung pattern `signout`, artinya kita dapat melakukan logout. Dan, sebaliknya jika `signin` artinya tidak bisa.
4. Melakukan ekstraksi URL logout dalam konten web, bisa menggunakan regex berikut
```js
/window\.location\.href='(https?:\/\/[^']+\/signout\/global\?[^']+)'/;
````
5. Silahkan melakukan HTTP Request GET pada URL yang telah diekstraksi menggunakan regex diatas, selesai.
