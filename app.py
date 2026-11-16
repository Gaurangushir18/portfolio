from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


if __name__ == "__main__":
    site_dir = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(site_dir))
    address = ("127.0.0.1", 8000)

    print(f"Portfolio is running at http://{address[0]}:{address[1]}")
    ThreadingHTTPServer(address, handler).serve_forever()
