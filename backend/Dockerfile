FROM python:3.12.6

WORKDIR /app

COPY ./ /app/

RUN pip3 install -r requirements.txt

ENTRYPOINT [ "fastapi", "run", "main.py" ]
