# capstone cloud computing api

<p align="center">
  <img src="https://raw.githubusercontent.com/IDEAT-YourPocketNutritionist/.github/main/profile/IDEAT_Cover.png">
</p>

---

## overview

This project is the final part of Bangkit Academy. This project involves creating an API for the IDEAT application.

## packages used in the project

- Hapi.js
- dotenv
- @google-cloud/firestore
- @google-cloud/storage
- jsonwebtoken
- bcryptjs
- Joi
- Axios
- Jest

## documentation

☁️ [Documentation API IDEAT](https://documenter.getpostman.com/view/30953348/2sAYJ4k22H)

## GCP Config Service

- Firestore
- Cloud Storage

## installation

1. Download & Install cloud SDK

   ⚙️ [Download](https://cloud.google.com/sdk/docs/install?hl=id)

2. clone the repository:

   ```sh
   git clone https://github.com/ilhanmanzis/ideat
   ```

3. copy file .env.example menjadi .env, kemudian isi yang diperlukan didalam file .env

   ```sh
   cp .env.example .env
   ```

4. Install the required packages

   ```sh
   npm install
   ```

5. Config Cloud SDK

   ```sh
   gcloud init
   ```

6. how to run

   - development
     ```sh
     npm run dev
     ```
   - production
     ```sh
     npm run start
     ```

7. Run test
   ```sh
    npm run test
   ```
