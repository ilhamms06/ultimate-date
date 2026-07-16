# CI/CD: GitHub Actions → GHCR → VPS

Panduan reusable untuk deploy app Docker ke VPS lewat GitHub Actions.

Alur:

1. Push ke branch `master` (atau jalankan manual)
2. Build image Docker
3. Push ke GitHub Container Registry (`ghcr.io`)
4. SSH ke VPS → `docker compose pull` + `up -d`

---

## Prasyarat

- Repo di GitHub
- VPS dengan Docker + Docker Compose
- Branch deploy: `master` (ubah di workflow jika beda)
- File di root repo:
  - `Dockerfile`
  - `docker-compose.yml`
  - `.github/workflows/deploy.yml`

---

## 1. File workflow

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [master]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  # Ganti: <github-username>/<repo-name> (huruf kecil)
  IMAGE_NAME: <github-username>/<repo-name>

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    # Hapus baris ini jika secrets ditaruh di Repository secrets
    # (bukan Environment secrets)
    environment: <ENVIRONMENT_NAME>
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=latest
            type=sha,prefix=

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ${{ secrets.VPS_DEPLOY_PATH }}
            docker compose pull
            docker compose up -d --remove-orphans
```

### Checklist ganti per proyek

| Placeholder | Contoh |
|-------------|--------|
| `IMAGE_NAME` | `ilhamms06/portfolio` |
| `environment` | `PORTFOLIO PROD` (atau hapus jika pakai repository secrets) |
| branch `master` | sesuaikan branch utama |

---

## 2. `docker-compose.yml` di repo & VPS

Image harus sama dengan yang di-push workflow:

```yaml
version: "3.9"

services:
  app:
    container_name: <nama-container>
    image: ghcr.io/<github-username>/<repo-name>:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

Salin file yang sama ke folder deploy di VPS (`VPS_DEPLOY_PATH`).

---

## 3. SSH key khusus deploy (GitHub Actions → VPS)

Di laptop:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy-<repo>" -f ~/.ssh/gh_actions_deploy_<repo> -N ""
```

### Di VPS (user yang dipakai deploy, mis. `root`)

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo '<ISI_PUBLIC_KEY>' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Public key:

```bash
cat ~/.ssh/gh_actions_deploy_<repo>.pub
```

### Di GitHub → secret `VPS_SSH_KEY`

Isi **private key** penuh (termasuk `BEGIN` / `END`):

```bash
cat ~/.ssh/gh_actions_deploy_<repo>
```

Jangan commit private key ke repo.

---

## 4. Secrets yang wajib ada

GitHub → **Settings → Secrets and variables → Actions**

### Opsi A — Environment secrets (disarankan untuk prod)

1. Buat Environment (mis. `PORTFOLIO PROD`)
2. Tambah secrets di environment itu
3. Pastikan workflow punya `environment: <nama>`

### Opsi B — Repository secrets

Tambah langsung di Repository secrets, lalu **hapus** baris `environment:` di workflow.

### Daftar secret

| Name | Isi | Contoh |
|------|-----|--------|
| `VPS_HOST` | IP / hostname VPS | `123.45.67.89` |
| `VPS_USER` | user SSH | `root` |
| `VPS_SSH_KEY` | private key deploy | isi file private key |
| `VPS_DEPLOY_PATH` | folder di VPS yang berisi `docker-compose.yml` | `/root/projects/portfolio` |

`VPS_DEPLOY_PATH` **bukan** path di laptop. Cek di VPS:

```bash
pwd
# contoh output: /root/projects/portfolio
```

---

## 5. Login GHCR di VPS (jika package private)

Package GHCR default sering private. Di VPS:

1. Buat PAT di GitHub (scope: `read:packages`)
2. Login:

```bash
echo <PAT> | docker login ghcr.io -u <github-username> --password-stdin
```

Opsional: buat package public  
GitHub → package image → Package settings → Change visibility.

---

## 6. Multi-akun GitHub (opsional)

Kalau pakai 2 akun GitHub di satu laptop, pakai SSH alias.

`~/.ssh/config`:

```sshconfig
Host github.com-<akun>
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_<akun>
  IdentitiesOnly yes
```

Remote repo:

```bash
git remote set-url origin git@github.com-<akun>:<akun>/<repo>.git
```

Catatan: terminal Cursor bisa memakai akun GitHub yang login di Cursor. Untuk push, SSH alias di atas yang menentukan akun.

---

## 7. Uji deploy

1. Pastikan 4 secrets terisi
2. Pastikan public key ada di VPS `authorized_keys`
3. Pastikan `docker-compose.yml` ada di `VPS_DEPLOY_PATH`
4. Push ke `master`, atau Actions → Deploy → Run workflow
5. Cek log:
   - Build & push OK
   - Deploy to VPS OK

---

## Troubleshooting

| Error | Penyebab | Perbaikan |
|-------|----------|-----------|
| `missing server host` | `VPS_HOST` kosong / secret tidak kebaca | Isi secret; jika Environment secrets, wajib `environment:` di workflow |
| `Permission denied` (SSH) | Public key belum di VPS / user salah | Cek `authorized_keys` & `VPS_USER` |
| `denied to <akun-lain>` saat `git push` | Akun auth salah (sering dari Cursor) | Pakai SSH alias, atau ganti akun GitHub di Cursor |
| `pull access denied` di VPS | Belum login GHCR / image private | `docker login ghcr.io` atau buat package public |
| Image lama tetap jalan | `image:` di compose beda dari `IMAGE_NAME` | Samakan ke `ghcr.io/<user>/<repo>:latest` |
| Secrets ada tapi tetap kosong | Secrets di Environment, workflow tanpa `environment` | Tambah `environment: <nama>` atau pindah ke Repository secrets |

---

## Checklist cepat proyek baru

- [ ] `Dockerfile` siap
- [ ] `docker-compose.yml` pakai `ghcr.io/<user>/<repo>:latest`
- [ ] `deploy.yml` dengan `IMAGE_NAME` yang benar
- [ ] Environment / repository secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_DEPLOY_PATH`
- [ ] SSH key deploy: private di secret, public di VPS
- [ ] Folder deploy di VPS berisi `docker-compose.yml`
- [ ] VPS sudah `docker login ghcr.io` (jika private)
- [ ] Push ke `master` → cek Actions
