# Usa una imagen base de Python
FROM python:3.12

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo requirements.txt y las dependencias al contenedor
COPY requirements.txt /app/

# Instala las dependencias desde el archivo requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el código de tu aplicación al contenedor
COPY . /app/

# Exponer el puerto
EXPOSE 8080

# Ejecuta el servidor Uvicorn
CMD ["python", "main.py"]
