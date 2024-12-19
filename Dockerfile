# Gunakan image node:18 sebagai base image
FROM node:18

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh source code aplikasi
COPY . .

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 8080

# Jalankan aplikasi saat container dijalankan
CMD ["npm", "start"]
