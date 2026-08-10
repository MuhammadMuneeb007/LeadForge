import os

import uvicorn


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=os.getenv("LEADFORGE_HOST", "127.0.0.1"),
        port=int(os.getenv("LEADFORGE_PORT", "8000")),
        reload=False,
    )

