from flask import Flask, request, jsonify # Importar Flask para crear la aplicación web, request para manejar las solicitudes HTTP y jsonify para devolver respuestas JSON
from flask_cors import CORS  # Importar CORS desde flask_cors
import sqlite3 # Importar sqlite3 para trabajar con bases de datos SQLite

app = Flask(__name__) # Crear una instancia de la aplicación Flask
CORS(app) # Habilitar CORS para permitir solicitudes entre dominios desde cualquier origen


# Ruta para recibir las respuestas del usuario y devolver las carreras recomendadas
@app.route('/recibir-respuestas', methods=['POST'])
def recibir_respuestas():

    # Obtener las respuestas del cuerpo de la solicitud
    respuestas = request.json # Obtener las respuestas del cuerpo de la solicitud HTTP en formato JSON

    # Realizar la lógica del sistema experto para determinar las carreras recomendadas
    carreras_recomendadas = logica_sistema_experto(respuestas) # Llamar a la función de lógica del sistema experto

    # Devolver las carreras recomendadas al frontend
    return jsonify(carreras_recomendadas) # Devolver las carreras recomendadas al frontend en formato JSON


# Función para la lógica del sistema experto
def logica_sistema_experto(respuestas):
    # Aquí puedes implementar la lógica del sistema experto para analizar las respuestas y determinar las carreras recomendadas
    
    # Conexión a la base de datos
    conexion = sqlite3.connect('backend/database_Carreras.db')
    cursor = conexion.cursor()
    coincidencias = {} # Inicializar un diccionario para almacenar las coincidencias de cada carrera

    # Iterar sobre cada carrera en la base de datos
    cursor.execute('SELECT Carreras, Descripcion FROM carreras') # Ejecutar una consulta SQL para obtener todas las carreras y descripciones
    carreras = cursor.fetchall() # Obtener todas las filas de resultados de la consulta

    for carrera, descripcion in carreras: # Iterar sobre cada carrera y su descripción
        contador_coincidencias = 0 # Inicializar el contador de coincidencias para esta carrera
        
        for pregunta, respuesta_usuario in respuestas.items(): # Iterar sobre cada pregunta y respuesta del usuario
            if respuesta_usuario.lower() in descripcion.lower(): # Verificar si la respuesta del usuario coincide con alguna parte de la descripción de la carrera
                contador_coincidencias += 1 # Incrementar el contador de coincidencias
        
        # Almacenar la descripción y el número de coincidencias en el diccionario
        coincidencias[carrera] = {'descripcion': descripcion, 'coincidencias': contador_coincidencias}
    conexion.close() # Cerrar la conexión a la base de datos


    # Modificar la estructura de los datos devueltos al frontend para incluir tanto los nombres como las descripciones de las carreras
    carreras_recomendadas = [{'nombre': carrera, 'descripcion': coincidencias[carrera]['descripcion']} 
        for carrera in sorted(
            coincidencias, key=lambda x: coincidencias[x]['coincidencias'], reverse=True)[:10]] # Devolver las tres carreras con más coincidencias

    # Devolver las carreras recomendadas
    return carreras_recomendadas 

if __name__ == '__main__':
    app.run(debug=True)  # Ejecutar la aplicación Flask en modo de depuración
